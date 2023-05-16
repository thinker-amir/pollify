import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config = {
    type: 'postgres',
    host: `${process.env.TEST_DATABASE_HOST}`,
    port: +`${process.env.DATABASE_PORT}`,
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.TEST_DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE_NAME}`,
    autoLoadEntities: true,
    synchronize: true,
    dropSchema: true,
}

export default registerAs('test-typeorm', () => config)
