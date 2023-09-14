// app functions
import { END_POINT, WS_END_POINT, RequestMethod } from '../const';

class Api {
  constructor() {}

  // static async loginAccount() {
  //   try {
  //     const response = await fetch(`${END_POINT}/login`);
  //     const data = await response.json();

  //     window.localStorage.set('token', data);

  //     return data;
  //   } catch (error) {}
  // }
  static async loginAccount(login, password) {
    try {
      const response = await fetch(`${END_POINT}/login`, {
        method: 'POST',
        body: JSON.stringify({ login: login, password: password }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
      const newError = new Error(error);
      throw newError;
    }
  }
}

export { Api };
