// app functions
import { END_POINT, WS_END_POINT, RequestMethod } from '../const';

class Api {
  constructor() {
    this.preloaderStatus = false;
  }

  static async loginAccount(login, password) {
    try {
      // preloader
      const btn = document.getElementById('js-account-btn');
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
      console.log(error);
      const newError = new Error(error);
      throw newError;
    }
  }
}

export { Api };
