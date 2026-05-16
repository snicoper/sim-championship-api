export const AppConfig = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    expiresInMinutes: Number(process.env.JWT_EXPIRES_IN_MINUTES ?? 15),

    refreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
    refreshExpiresInDays: Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS ?? 30),
  },
  corsOrigin: process.env.CORS_ORIGIN,
};

export type AppConfig = typeof AppConfig;
