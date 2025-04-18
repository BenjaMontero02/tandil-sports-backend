require('dotenv').config();

const inspector = require('inspector');

export const enviroment = {
    db: {
        type: 'postgres' as const,
        url: process.env.DB_URL,
        host: process.env.DB_HOST ? process.env.DB_HOST : '0.0.0.0',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
        username: process.env.DB_USERNAME ? process.env.DB_USERNAME : 'postgres',
        password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'postgres',
        database: process.env.DB_DATABASE ? process.env.DB_DATABASE : 'artistic',
        entities: inspector.url() !== undefined ? ['src/**/*.entity{.ts,.js}'] : ['dist/**/*.entity{.ts,.js}'],
        migrations: inspector.url() !== undefined ? ['src/migrations/*{.ts,.js}'] : ['dist/migrations/*{.ts,.js}'],
        synchronize: process.env.DB_SYNC ? process.env.DB_SYNC == 'YES' : false, //NUNCA CAMBIAR ESTE VALOR SIN AUTORIZACION
        logging: process.env.DB_LOGGING ? process.env.DB_LOGGING == 'YES' : false, //NUNCA CAMBIAR ESTE VALOR SIN AUTORIZACION
        autoLoadEntities: process.env.DB_AUTOLOAD ? process.env.DB_AUTOLOAD == 'true' : true,
        connectTimeoutMS:60000,
    },
    APP_PORT: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3001,
    APP_CORS: process.env.APP_CORS ? process.env.APP_CORS == 'YES' : true,
    APP_LIMIT: process.env.APP_LIMIT ? process.env.APP_LIMIT : '50mb',
    JWT_SECRET: process.env.JWT_SECRET ? process.env.JWT_SECRET : '6hhH2P7TFQSxdndLMIH*xvSmUkGqREcEs0xBgG3izZg=',
    JWT_ISS: process.env.JWT_ISS ?? 'artistic-jwt',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION ?? '10min',
}