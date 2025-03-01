export const PORT = process.env.PORT || 9000;
export const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://admin:npg_Ybj2AnIu0hRl@ep-raspy-river-a4bszsib-pooler.us-east-1.aws.neon.tech/ecomm?sslmode=require";
export const JWT_SECRET = process.env.JWT_SECRET || "onlyme";
export const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  "70242128114-gmdohjgf4gcuvkr7nlgh2q3m8l15k4d9.apps.googleusercontent.com";
export const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || "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";
export const REDIRECT_URI =
  process.env.REDIRECT_URI || "http://localhost:9000/api/auth/google/callback";
export const MAIL_ID = process.env.MAIL_ID || "hoangdang36lt@gmail.com";
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD || "klsqxqbkyxdmjjdr";
export const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME || "djlvyvcj7";
export const CLOUDINARY_API_KEY =
  process.env.CLOUDINARY_API_KEY || "865134844476842";
export const CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET || "nk7wxN0Z65olzkKQ-bUa0heqimw";
export const ADMIN = "Admin";
export const USER = "User";
