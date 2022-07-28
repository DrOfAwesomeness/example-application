import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  frontendUrl: process.env.FRONTEND_URL || 'https://example.com',
  database: {
    host: process.env.MARIADB_HOST,
    port: parseInt(process.env.MARIADB_PORT!, 10),
    username: process.env.MARIADB_USERNAME,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE
  },
  stripeApiKey: process.env.STRIPE_API_KEY!
}