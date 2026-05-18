export const AppConfig = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',

  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? '',

  appName: process.env.APP_NAME ?? '',
  appShortName: process.env.APP_SHORT_NAME ?? '',

  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    expiresInMinutes: Number(process.env.JWT_EXPIRES_IN_MINUTES ?? 15),

    refreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
    refreshExpiresInDays: Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS ?? 30),
  },

  corsOrigin: process.env.CORS_ORIGIN,

  mail: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === 'true',
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },

  front: {
    url: process.env.FRONT_URL,
    verifyEmailUri: process.env.VERIFY_EMAIL_URI,
    resetPasswordUri: process.env.RESET_PASSWORD_URI,
  },
};

export type AppConfig = typeof AppConfig;
