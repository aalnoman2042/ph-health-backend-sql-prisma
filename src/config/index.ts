import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    emailSender: {
        email: process.env.EMAIL,
        app_pass: process.env.APP_PASS
    },

    cloudiniary :{

        couldinary_api_secret_key: process.env.CLOUDINARY_API_SECRET 
    },
    jwt_secret:process.env.JWT_SECRET_KEY,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    reset_pass_secret: process.env.RESET_PAASS_TOKEN_SECRET,
    salt_round: process.env.SALT_ROUNDS,
    reset_pass_link: process.env.RESET_PASS_LINK,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    StripeSecretKey: process.env.STRIPE_SECRET_KEY,
}