import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { Socket, io } from 'socket.io-client';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CreateParticipateDto } from '../../src/participates/dto/create-participate.dto';
import { CreatePollDto } from '../../src/polls/dto/create-poll.dto';
import { initMockUser } from '../helper/auth.helper';

describe('Real-time Gateway - websocket', () => {
  let app: INestApplication;
  let access_token: string;
  let socket: Socket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // allows setting the container to be used by the class-validor library
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.listen(3001);
    await app.init();

    access_token = await initMockUser(app.getHttpServer());
    socket = io('http://localhost:3001');
    socket.connect();
  });

  describe('handleMessage', () => {
    it('should return polls and participation rates', async () => {
      const publishDate = new Date();
      publishDate.setSeconds(publishDate.getSeconds() + 1);

      const createPollDto: CreatePollDto = {
        title: 'Which Language do you love more?',
        description: 'I know it is a difficult decision :)',
        publishDate: publishDate,
        durationInMinutes: 5,
        options: ['Typescript', 'PHP', 'Java', 'Python', 'Go'],
      };

      const createParticipateDto: CreateParticipateDto = {
        pollOption: 1,
      };

      // Create a poll
      await request(app.getHttpServer())
        .post('/polls')
        .set('Authorization', `Bearer ${access_token}`)
        .send(createPollDto)
        .expect(HttpStatus.CREATED);

      // Sleep to ensure pass the publish date
      await new Promise((r) => setTimeout(r, 1500));

      // Participate in the poll
      await request(app.getHttpServer())
        .post('/participates')
        .set('Authorization', `Bearer ${access_token}`)
        .send(createParticipateDto)
        .expect(HttpStatus.CREATED);

      // Emit to websocket server and receive the polls results with participation rates
      return new Promise((resolve, reject) => {
        socket.emit('live-polls-results', {}, (response: any) => {
          try {
            expect(response.length).toBe(1);
            expect(response[0]['title']).toEqual(createPollDto.title);
            expect(response[0]['totalParticipates']).toEqual(1);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      });
    });
  });

  afterAll(async () => {
    socket.disconnect();
    await app.close();
  });
});
