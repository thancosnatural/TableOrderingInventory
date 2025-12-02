// import Cookies from "js-cookie";

// /* ========================================================================
//    USER DATA (stores role, permissions, name, email, outlet info, etc.)
//    ======================================================================== */

// export const setUserData = (userData) => {
//     Cookies.set("th_to_user", JSON.stringify(userData), {
//         expires: 3650,         // 10 years
//         sameSite: "Strict",
//         secure: true,
//     });
// };

// export const getUserData = () => {
//     try {
//         const stored = Cookies.get("th_to_user");
//         return stored ? JSON.parse(stored) : null;
//     } catch (err) {
//         console.error("Failed to parse th_to_user:", err);
//         return null;
//     }
// };

// export const clearUserData = () => {
//     Cookies.remove("th_to_user");
// };


// /* ========================================================================
//    ACCESS TOKEN
//    ======================================================================== */

// export const setAccessToken = (token) => {
//     Cookies.set("th_to_access_token", token, {
//         expires: 3650,
//         sameSite: "Strict",
//         secure: true,
//     });
// };

// export const getAccessToken = () => {
//     return Cookies.get("th_to_access_token") || null;
// };

// export const removeAccessToken = () => {
//     Cookies.remove("th_to_access_token");
// };


// /* ========================================================================
//    REFRESH TOKEN
//    ======================================================================== */

// export const setRefreshToken = (token) => {
//     Cookies.set("th_to_refresh_token", token, {
//         expires: 3650,
//         sameSite: "Strict",
//         secure: true,
//     });
// };

// export const getRefreshToken = () => {
//     return Cookies.get("th_to_refresh_token") || null;
// };

// export const removeRefreshToken = () => {
//     Cookies.remove("th_to_refresh_token");
// };


// /* ========================================================================
//    CLEAR ALL
//    ======================================================================== */

// export const clearAllAuth = () => {
//     Cookies.remove("th_to_user");
//     Cookies.remove("th_to_access_token");
//     Cookies.remove("th_to_refresh_token");
// };



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
