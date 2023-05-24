import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePollDto } from 'src/polls/dto/create-poll.dto';
import { UpdatePollDto } from 'src/polls/dto/update-poll.dto';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { initMockUser } from '../helper/auth.helper';

const publishDate = new Date();
publishDate.setSeconds(publishDate.getSeconds() + 1);
const createPollDto: CreatePollDto = {
  "title": "Which Language do you love more?",
  "description": "I know it is a difficult decision :)",
  "publishDate": publishDate,
  "duration": 5,
  "options": [
    "Typescript", "PHP", "Java", "Python", "Go"
  ]
};

describe('Poll API - /polls', () => {
  let app: INestApplication;
  let access_token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true }
      }),
    );

    await app.init();

    access_token = await initMockUser(app.getHttpServer());
  });

  describe('Create [POST /polls]', () => {

    describe('with a valid request body', () => {
      it('should successfully create a poll and return a 201 Created status', async () => {
        return request(app.getHttpServer())
          .post('/polls')
          .set('Authorization', `Bearer ${access_token}`)
          .send(createPollDto)
          .expect(HttpStatus.CREATED)
      })
    });
    describe('with an invalid request body', () => {
      it('should return a 400 Bad Request status', async () => {
        const invalidBody = { ...createPollDto, title: undefined };
        return request(app.getHttpServer())
          .post('/polls')
          .set('Authorization', `Bearer ${access_token}`)
          .send(invalidBody as CreatePollDto)
          .expect(HttpStatus.BAD_REQUEST)
      })
    })
    describe('if JWT token is invalid or missing', () => {
      it('should return 401 unauthorized', async () => {
        await request(app.getHttpServer())
          .post('/polls')
          .send(createPollDto)
          .expect(401);
      })
    });
  });

  describe('Get all [GET /polls]', () => {
    it('should return a list of polls', async () => {
      return request(app.getHttpServer())
        .get('/polls')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toBeDefined();
          expect(body.length).toEqual(1);
          expect(body[0].title).toEqual(createPollDto.title);
        });
    })
    describe('if JWT token is invalid or missing', () => {
      it('should return 401 unauthorized', async () => {
        await request(app.getHttpServer())
          .get('/polls')
          .expect(401);
      })
    });
  });

  describe('Get one [GET /polls/:id]', () => {
    it('should return a poll with the given Id', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/polls/1')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(HttpStatus.OK);
      expect(body).toBeDefined();
    })
    describe('if JWT token is invalid or missing', () => {
      it('should return 401 unauthorized', async () => {
        await request(app.getHttpServer())
          .get('/polls/1')
          .expect(401);
      })
    });
  });

  describe('Update one [PATCH /:id]', () => {
    describe('with a valid request body', () => {
      it('should successfully update the existing poll and then return it', async () => {
        const updateBody = { ...createPollDto, title: 'The Updated title' };
        const { body } = await request(app.getHttpServer())
          .patch('/polls/1')
          .set('Authorization', `Bearer ${access_token}`)
          .send(updateBody as UpdatePollDto)
          .expect(HttpStatus.OK);
        expect(body).toBeDefined();
        expect(body.title).toEqual(updateBody.title);
      })
    });
    describe('with an invalid request body', () => {
      it('should return a 400 Bad Request status', async () => {
        const invalidBody = { ...createPollDto, title: 'f' };
        const { body } = await request(app.getHttpServer())
          .patch('/polls/1')
          .set('Authorization', `Bearer ${access_token}`)
          .send(invalidBody as UpdatePollDto)
          .expect(HttpStatus.BAD_REQUEST);
        expect(body).toBeDefined();
      })
    })
    describe('if JWT token is invalid or missing', () => {
      it('should return 401 Unauthorized', async () => {
        await request(app.getHttpServer())
          .patch('/polls/1')
          .expect(HttpStatus.UNAUTHORIZED);
      })
    });
  })

  describe('Delete one [DELETE /polls/:id]', () => {
    it('should successfully remove the existing poll and then return it', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/polls/1')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(HttpStatus.OK);
      expect(body).toBeDefined();
    })
    describe('if JWT token is invalid or missing', () => {
      it('should return 401 unauthorized', async () => {
        await request(app.getHttpServer())
          .delete('/polls/1')
          .expect(401);
      })
    });
  });



  afterAll(async () => {
    await app.close();
  })
});
