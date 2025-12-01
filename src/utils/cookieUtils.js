import Cookies from 'js-cookie';

// Functions for handling user data
export const setUserData = (userData) => {
    Cookies.set('thancosadmin', JSON.stringify(userData), { expires: 3650 }); // 10 years (3650 days)
};

export const getUserData = () => {
    const userDataString = Cookies.get('thancosuser');
    return userDataString ? JSON.parse(userDataString) : null;
};

export const clearUserData = () => {
    Cookies.remove('thancosadmin');
};

// Functions for handling tokens
export const setToken = (token) => {
    Cookies.set('thancosadmintoken', token, { expires: 3650 }); // 10 years (3650 days)
};

export const getToken = () => {
    return Cookies.get('thancosadmintoken');
};

export const removeToken = () => {
    Cookies.remove('thancosadmintoken');
};
