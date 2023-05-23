import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { DataSourceOptions } from "typeorm";

const environmentName = process.env.NODE_ENV;
console.info(`Environment: ${environmentName}`)

dotenvConfig({ path: '.env' });

const config = {
    type: 'postgres',
    host: `${process.env.DATABASE_HOST}`,
    port: `${process.env.DATABASE_PORT}`,
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE_NAME}`,
    autoLoadEntities: true,
    synchronize: false,
}

const configEnvMap = new Map<string, Partial<DataSourceOptions>>([
    [
        "develop",
        {
            synchronize: true,
        }
    ],
    [
        "test",
        {
            host: `${process.env.TEST_DATABASE_HOST}`,
            password: `${process.env.TEST_DATABASE_PASSWORD}`,
            synchronize: true,
            dropSchema: true,
        }
    ],
]);

function getConfig(): DataSourceOptions {
    const envConfig = configEnvMap.get(environmentName);
    if (envConfig === undefined) {
        throw new Error(`Unexpected value [${environmentName}]`);
    }
    return { ...config, ...envConfig } as DataSourceOptions;
}

export default registerAs('typeorm', () => getConfig());
