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

  // Перевод средств со счёта на счёт
  static async transferFunds(token, from, to, amount) {
    try {
      const response = await fetch(`${END_POINT}/transfer-funds`, {
        method: 'POST',
        body: JSON.stringify({
          from,
          to,
          amount,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
      });
      const data = await response.json();

      return data;
    } catch (error) {
      const newError = new TypeError(error);
      console.error(newError);

      return newError;
    }
  }

  // Массив со списком кодов всех используемых бэкендом валют на данный момент
  static async getAllCurrencies(token) {
    try {
      const response = await fetch(`${END_POINT}/all-currencies`, {
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
      console.error(newError);

      return newError;
    }
  }

  // Список валютных счетов текущего пользователя
  static async getCurrencies(token) {
    try {
      const response = await fetch(`${END_POINT}/currencies`, {
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
      console.error(newError);

      return newError;
    }
  }

  // Валютный обмен
  static async currencyBuy(token, from, to, amount) {
    try {
      const response = await fetch(`${END_POINT}/currency-buy`, {
        method: 'POST',
        body: JSON.stringify({
          from,
          to,
          amount,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
      });
      const data = await response.json();

      return data;
    } catch (error) {
      const newError = new TypeError(error);
      console.error(newError);

      return newError;
    }
  }

  // Обновление курсов валют в реальном времени
  static getChangedCurrency() {
    const webSocket = new WebSocket(`${WS_END_POINT}/currency-feed`);

    console.log(webSocket);
    return webSocket;
  }
}

export { Api };
