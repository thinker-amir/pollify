import { ClassSerializerInterceptor, HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { SigninDto } from "src/auth/dto/signin.dto";
import * as request from 'supertest';
import { AppModule } from "../../src/app.module";
import { mockSigninDto, mockSignupDto, signinMockUser, signupMockUser } from "../helper/auth.helper";

describe('Auth API - /auth', () => {
    let app: INestApplication;
    let accessToken: string;

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

        app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get('Reflector')));

        await app.init();
    });

    describe('Sign up [POST /auth/sign-up]', () => {
        describe('with a valid request body', () => {
            it('should successfully create a user and return a 201 Created status', async () => {
                const result = await signupMockUser(app.getHttpServer());
                expect(result.statusCode).toEqual(HttpStatus.CREATED)
            })
        });
        describe('with an invalid request body', () => {
            it('should return a 400 Bad Request status', async () => {
                const invalidBody = { ...mockSignupDto, name: undefined };
                const result = await signupMockUser(app.getHttpServer(), invalidBody);

                expect(result.statusCode).toEqual(HttpStatus.BAD_REQUEST)
            })
        })
    });

    describe('Sign in [POST /auth/sign-in]', () => {

        describe('with a valid credential', () => {
            it('should successfully login and return the token', async () => {
                const result = await signinMockUser(app.getHttpServer());

                expect(result.statusCode).toEqual(HttpStatus.OK)
                expect(result.body).toBeDefined();
                expect(result.body.access_token).toBeDefined();

                accessToken = result.body.access_token;
            })
        });
        describe('with an invalid credential', () => {
            const invalidBody: SigninDto = { ...mockSigninDto, username: 'wrong.password' };
            it('should return a 401 Unauthorized status', async () => {
                const result = await signinMockUser(app.getHttpServer(), invalidBody);

                expect(result.statusCode).toEqual(HttpStatus.UNAUTHORIZED)
            })
        })
    });

    describe('Profile [GET /auth/profile]', () => {
        it('should return the user profile', async () => {
            return await request(app.getHttpServer())
                .get('/auth/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(HttpStatus.OK)
                .then(({ body }) => {
                    expect(body).toBeDefined();
                    expect(body.username).toEqual(mockSignupDto.username)
                })
        });
    });

    afterAll(async () => {
        await app.close();
    })
});
