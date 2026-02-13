//List of  api routes
//Single source of truth for api endpoints

export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        WHOAMI: '/api/auth/whoami',
        UPDATEPROFILE: '/api/auth/update-profile',
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    },
    ADMIN:{
        USER:{
            CREATE: '/api/admin/users/',
            LIST: '/api/admin/users/',
            DETAIL: '/api/admin/users',
            UPDATE: '/api/admin/users',
            DELETE: '/api/admin/users',
        }
    }
}
