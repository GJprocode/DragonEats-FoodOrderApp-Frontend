// C:\Users\gertf\Desktop\FoodApp\frontend\src\components\ui\cookiesUtils.ts
import Cookies from "js-cookie"; // Correct import

// Function to set a cookie
export const setCookie = (name: string, value: string, days: number) => {
  Cookies.set(name, value, { expires: days, secure: true, sameSite: 'Strict' });
};

// Function to get a cookie
export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

// Function to remove a cookie
export const removeCookie = (name: string) => {
  Cookies.remove(name);
};
