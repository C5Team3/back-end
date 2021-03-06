require('dotenv').config();

const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3000,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_host: process.env.DB_HOST,
    db_name: process.env.DB_NAME,
    db_local_test_url:process.env.DB_LOCAL_TEST_URI,
    db_test_mode:process.env.DB_TEST_MODE,
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
    spotify_client_id:process.env.SPOTIFY_CLIENT_ID,
    spotify_client_secret:process.env.SPOTIFY_CLIENT_SECRET,
    default_admin_user_email:process.env.ADMIN_USER_EMAIL,
    default_admin_user_password:process.env.ADMIN_USER_PASSWORD,
    default_admin_user_name:process.env.ADMIN_USER_NAME,
    test_admin_api_key:process.env.TEST_ADMIN_API_KEY,
    test_public_api_key:process.env.TEST_PUBLIC_API_KEY,
    app_url_recovery:process.env.APP_URL_RECOVERY
}

module.exports = config;