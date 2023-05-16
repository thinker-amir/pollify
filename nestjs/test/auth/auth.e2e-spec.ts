import { ClassSerializerInterceptor, HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SigninDto } from "src/auth/dto/signin.dto";
import * as request from 'supertest';
import { AuthModule } from "../../src/auth/auth.module";
import { SignupDto } from "../../src/auth/dto/signup.dto";
import testTypeorm from "../../src/config/testTypeorm";

describe('Auth API - /auth', () => {
    let app: INestApplication;
    let accessToken: string;
    const signupDto: SignupDto = {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@test.com',
        username: 'testuser',
        password: 'testpassword'
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AuthModule,
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [testTypeorm]
                }),
                TypeOrmModule.forRootAsync({
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) => (configService.get('test-typeorm'))
                }),
            ],
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
                return await request(app.getHttpServer())
                    .post('/auth/sign-up')
                    .send(signupDto as SignupDto)
                    .expect(HttpStatus.CREATED);
            })
        });
        describe('with an invalid request body', () => {
            it('should return a 400 Bad Request status', async () => {
                const invalidBody = { ...signupDto, name: undefined };
                return request(app.getHttpServer())
                    .post('/auth/sign-up')
                    .send(invalidBody as SignupDto)
                    .expect(HttpStatus.BAD_REQUEST)
            })
        })
    });

    describe('Sign in [POST /auth/sign-in]', () => {
        const { username, password } = signupDto;
        const signinDto: SigninDto = { username, password };
        describe('with a valid credential', () => {
            it('should successfully login and return the token', async () => {
                return await request(app.getHttpServer())
                    .post('/auth/sign-in')
                    .send(signinDto as SignupDto)
                    .expect(HttpStatus.OK)
                    .then(({ body }) => {
                        expect(body).toBeDefined();
                        expect(body.access_token).toBeDefined();
                        accessToken = body.access_token;
                    })
            })
        });
        describe('with an invalid credential', () => {
            const invalidBody: SigninDto = { ...signinDto, username: 'wrong.password' };
            it('should return a 401 Unauthorized status', async () => {
                return await request(app.getHttpServer())
                    .post('/auth/sign-in')
                    .send(invalidBody as SignupDto)
                    .expect(HttpStatus.UNAUTHORIZED);
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
                    expect(body.username).toEqual(signupDto.username)
                })
        });
    });

    afterAll(async () => {
        await app.close();
    })
});
