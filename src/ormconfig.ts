export const config = () => ({
    database: {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: 3306,
        username: process.env.DB_USERNAME.toString(),
        password: process.env.DB_PASSWORD.toString(),
        database: process.env.DB_DATABASE.toString(),
        autoLoadEntities: process.env.NODE_ENV !== 'production',
        synchronize: true,
    },
});
