import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { HashService } from './hash.service';

@Injectable()
export class BcryptService implements HashService {
    async hash(data: string | Buffer): Promise<string> {
        const salt = await genSalt();
        return hash(data, salt)
    }
    compare(data: string | Buffer, encrypted: string): Promise<boolean> {
        return compare(data, encrypted);
    }
}
