import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from '../auth/dto/signup.dto';
import { HashService } from '../common/utils/hash/hash.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly hashService: HashService
    ) { }

    async findOne(where: {}) {
        const user = await this.userRepository.findOne({ where });
        if (!user) {
            throw new NotFoundException(`User not found!`)
        }
        return user;
    }

    async create(signupDto: SignupDto) {
        signupDto.password = await this.hashService.hash(signupDto.password);
        const user = this.userRepository.create(signupDto);
        try {
            await this.userRepository.save(user);
        } catch (error) {
            const pgUniqueViolationErrorCode = '23505';
            if (error.code === pgUniqueViolationErrorCode) {
                throw new ConflictException(error.detail);
            }
            throw error;
        }
    }
}
