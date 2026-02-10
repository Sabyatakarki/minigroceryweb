//List of  api routes
//Single source of truth for api endpoints

export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        WHOAMI: '/api/auth/whoami',
        UPDATEPROFILE: '/api/auth/update-profile',
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
