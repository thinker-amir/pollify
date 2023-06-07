import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { UpdateParticipateDto } from 'src/participates/dto/update-participate.dto';
import { CreatePollDto } from 'src/polls/dto/create-poll.dto';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CreateParticipateDto } from '../../src/participates/dto/create-participate.dto';
import { initMockUser } from '../../test/helper/auth.helper';

const createParticipateDto: CreateParticipateDto = {
  pollOption: 1,
};

const publishDate = new Date();
publishDate.setSeconds(publishDate.getSeconds() + 1);

const createPollDto: CreatePollDto = {
  title: 'Which Language do you love more?',
  description: 'I know it is a difficult decision :)',
  publishDate: publishDate,
  durationInMinutes: 5,
  options: ['Typescript', 'PHP', 'Java', 'Python', 'Go'],
};

describe('Participate API - /participates', () => {
  let app: INestApplication;
  let access_token: string;

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

    await app.init();

    access_token = await initMockUser(app.getHttpServer());
  });

  describe('Create [POST /participate]', () => {
    describe('with a valid request body', () => {
      it('should successfully create a participate and return a 201 Created status', async () => {
        await request(app.getHttpServer())
          .post('/polls')
          .set('Authorization', `Bearer ${access_token}`)
          .send(createPollDto)
          .expect(HttpStatus.CREATED);

        await new Promise((r) => setTimeout(r, 1500)); // sleep to pass publish date

        return request(app.getHttpServer())
          .post('/participates')
          .set('Authorization', `Bearer ${access_token}`)
          .send(createParticipateDto)
          .expect(HttpStatus.CREATED);
      });
    });
    describe('with an invalid request body', () => {
      it('should return a 400 Bad Request status', async () => {
        const invalidBody = { ...createParticipateDto, id: undefined };
        return request(app.getHttpServer())
          .post('/participates')
          .set('Authorization', `Bearer ${access_token}`)
          .send(invalidBody)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
    describe('if JWT token is invalid or missing', () => {
      it('should return 401 unauthorized', async () => {
        await request(app.getHttpServer())
          .post('/participates')
          .send(createParticipateDto)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('Get all [GET /participates]', () => {
    it('should return a list of participates', async () => {
      return request(app.getHttpServer())
        .get('/participates')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toBeDefined();
          expect(body.length).toEqual(1);
          expect(body[0].pollOption.id).toEqual(
            createParticipateDto.pollOption,
          );
        });
    });
    describe('if JWT token is invalid or missing', () => {
      it('should return 401 unauthorized', async () => {
        await request(app.getHttpServer())
          .get('/participates')
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('Get one [GET /participates/:id]', () => {
    it('should return a participate with the given Id', async () => {
      return request(app.getHttpServer())
        .get('/participates/1')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toBeDefined();
        });
    });
    describe('if JWT token is invalid or missing', () => {
      it('should return 401 unauthorized', async () => {
        await request(app.getHttpServer())
          .get('/participates/1')
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('Update one [PATCH /participates/:id]', () => {
    describe('with a valid request body', () => {
      it('should successfully update the existing participate and then return it', async () => {
        const updateBody: UpdateParticipateDto = { pollOption: 2 };
        return request(app.getHttpServer())
          .patch('/participates/1')
          .set('Authorization', `Bearer ${access_token}`)
          .send(updateBody)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toBeDefined();
            expect(body.pollOption.id).toEqual(updateBody.pollOption);
          });
      });
    });
    describe('with an invalid request body', () => {
      it('should return a 400 Bad Request status', async () => {
        const invalidBody: UpdateParticipateDto = { pollOption: undefined };
        const { body } = await request(app.getHttpServer())
          .patch('/participates/1')
          .set('Authorization', `Bearer ${access_token}`)
          .send(invalidBody)
          .expect(HttpStatus.BAD_REQUEST);
        expect(body).toBeDefined();
      });
    });
    describe('if JWT token is invalid or missing', () => {
      it('should return 401 Unauthorized', async () => {
        await request(app.getHttpServer())
          .patch('/participates/1')
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('Delete one [DELETE /participates/:id]', () => {
    it('should successfully remove the existing participate and then return it', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/participates/1')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(HttpStatus.OK);
      expect(body).toBeDefined();
    });
    describe('if JWT token is invalid or missing', () => {
      it('should return 401 unauthorized', async () => {
        await request(app.getHttpServer())
          .delete('/participates/1')
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
