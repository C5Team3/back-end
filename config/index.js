require('dotenv').config();

const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3000,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_host: process.env.DB_HOST,
    db_name: process.env.DB_NAME,
    auth_jwt_Secret: process.env.AUTH_JWT_SECRET,
    smtp_user: process.env.SMTP_USER,
    smtp_password: process.env.SMTP_PASSWORD,
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_ssl: process.env.SMTP_SSL_SUPPORT,
    smtp_tls: process.env.SMTP_TLS_SUPPORT,
    smtp_sender_name: process.env.SMTP_NAME_SENDER,
    app_url_activate:process.env.APP_URL_ACTIVATE,
    facebook_app_id:process.env.FACEBOOK_APP_ID,
    facebook_app_secret:process.env.FACEBOOK_APP_SECRET,
}

module.exports = config;