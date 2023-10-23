// app functions
import { END_POINT, WS_END_POINT, RequestMethod } from '../const';

class Api {
  constructor() {}

  static async loginAccount(login, password) {
    try {
      const btn = document.getElementById('js-authorization-btn');
      // preloader
      btn.innerHTML = '<div class="preloader"></div>';

      // запрос
      const response = await fetch(`${END_POINT}/login`, {
        method: 'POST',
        body: JSON.stringify({ login: login, password: password }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      btn.innerHTML = 'Войти';

      return data;
    } catch (error) {
      document.getElementById('js-authorization-btn').innerHTML = 'Войти';
      return error;
    }
  }

  static async getAccounts(token) {
    try {
      const response = await fetch(`${END_POINT}/accounts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
      });
      const data = await response.json();

      return data;
    } catch (error) {
      const newError = new TypeError(error);

      return newError;
    }
  }

  static async createAccount(token) {
    try {
      const response = await fetch(`${END_POINT}/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
      });
      const data = await response.json();

      return data;
    } catch (error) {
      const newError = new TypeError(error);

      return newError;
    }
  }

  static async getAccountId(token, id) {
    try {
      const response = await fetch(`${END_POINT}/account/${id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Basic ${token}`,
        },
      });
      const data = await response.json();

      return data;
    } catch (error) {
      const newError = new TypeError(error);

      return newError;
    }
  }
}

export { Api };
