import { SigninDto } from "src/auth/dto/signin.dto";
import { SignupDto } from "src/auth/dto/signup.dto";
import * as request from 'supertest';

export const mockSignupDto: SignupDto = {
	"name": "John",
	"surname": "Doe",
	"email": "john.doe@gmail.com",
	"username": "johny",
	"password": "secret-secret"
}

const { username, password } = mockSignupDto;
export const mockSigninDto: SigninDto = { username, password };

export async function signupMockUser(server: any, data: {} = mockSignupDto) {
	return await request(server)
		.post('/auth/sign-up')
		.send(data as SignupDto);
}

export async function signinMockUser(server: any, data: SigninDto = mockSigninDto) {
	return await request(server)
		.post('/auth/sign-in')
		.send(data as SignupDto);
}

export async function initMockUser(server: any) {
	await signupMockUser(server);
	const result = await signinMockUser(server);
	return result.body.access_token;
}