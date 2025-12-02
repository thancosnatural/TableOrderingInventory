
/* ========================================================================
   USER DATA  (JSON object)
   ======================================================================== */

export const setUserData = (userData) => {
  try {
    localStorage.setItem("th_to_user", JSON.stringify(userData));
  } catch (err) {
    console.error("Failed to store user data:", err);
  }
};

export const getUserData = () => {
  try {
    const raw = localStorage.getItem("th_to_user");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Failed to parse user data:", err);
    return null;
  }
};

export const clearUserData = () => {
  localStorage.removeItem("th_to_user");
};


/* ========================================================================
   ACCESS TOKEN
   ======================================================================== */

export const setAccessToken = (token) => {
  try {
    localStorage.setItem("th_to_access_token", token);
  } catch (err) {
    console.error("Failed to store access token:", err);
  }
};

export const getAccessToken = () => {
  return localStorage.getItem("th_to_access_token") || null;
};

export const removeAccessToken = () => {
  localStorage.removeItem("th_to_access_token");
};


/* ========================================================================
   REFRESH TOKEN
   ======================================================================== */

export const setRefreshToken = (token) => {
  try {
    localStorage.setItem("th_to_refresh_token", token);
  } catch (err) {
    console.error("Failed to store refresh token:", err);
  }
};

export const getRefreshToken = () => {
  return localStorage.getItem("th_to_refresh_token") || null;
};

export const removeRefreshToken = () => {
  localStorage.removeItem("th_to_refresh_token");
};


/* ========================================================================
   CLEAR ALL
   ======================================================================== */

export const clearAllAuth = () => {
  localStorage.removeItem("th_to_user");
  localStorage.removeItem("th_to_access_token");
  localStorage.removeItem("th_to_refresh_token");
};
