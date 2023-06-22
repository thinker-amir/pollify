import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { CreatePollDto } from 'src/polls/dto/create-poll.dto';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { initMockUser } from '../helper/auth.helper';

const publishDate = new Date();
publishDate.setMinutes(publishDate.getMinutes() + 1);

const createPollDto: CreatePollDto = {
  title: 'Which Language do you love more?',
  description: 'I know it is a difficult decision :)',
  publishDate: publishDate,
  durationInMinutes: 5,
  options: ['Typescript', 'PHP', 'Java', 'Python', 'Go'],
};

describe('Poll Cover API - /polls/:id/cover', () => {
  let app: INestApplication;
  let access_token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();

    access_token = await initMockUser(app.getHttpServer());
  });

  it('Upload Cover [POST /polls/:id/cover]', async () => {
    const id = 1;
    const filePath = __dirname + '/../nestJs.png';

    await request(app.getHttpServer())
      .post('/polls')
      .set('Authorization', `Bearer ${access_token}`)
      .send(createPollDto)
      .expect(HttpStatus.CREATED);

    return await request(app.getHttpServer())
      .patch(`/polls/${id}/cover`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', filePath)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });

  it('Remove Cover [DELETE /polls/:id/cover]', () => {
    const id = 1;

    return request(app.getHttpServer())
      .delete(`/polls/${id}/cover`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
