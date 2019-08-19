// centralize all calls to LocalStorage in one file so that additional things can be checked later

export const TOKEN_KEY_CONSTANT = "tokenKey";

export const getTokenLocalStorage = ({ tokenKey }) => {
  localStorage.setItem(TOKEN_KEY_CONSTANT, tokenKey);
};

export const checkTokenKeyInLocalStorage = () => {
  const tokenKey = localStorage.getItem(TOKEN_KEY_CONSTANT);
  if (tokenKey) {
    return true;
  } else {
    return false;
  }
};

export const removeTokenKeyFromLocalStorage = () => {
  localStorage.removeItem(TOKEN_KEY_CONSTANT);
};
