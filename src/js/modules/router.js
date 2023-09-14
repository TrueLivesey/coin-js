// libraries
import Navigo from 'navigo';
import { el, setChildren, mount } from 'redom';

// app functions
import { createAccountDOM } from './render';
import { formValidation } from './validation';
import { Api } from '../api/api';

function initRouting() {
  const router = new Navigo('/');
  const body = window.document.body;
  const main = document.querySelector('.main');

  main.classList.add('account-main');

  router.on('/', () => {
    const account = createAccountDOM();

    mount(app, account);

    formValidation(
      'js-account-form',
      'js-account-login',
      'js-account-password',
    );

    const accountBtn = document.querySelector('.account__btn');

    accountBtn.addEventListener('click', () => {
      const userLogin = document.getElementById('js-account-login').value;
      const userPassword = document.getElementById('js-account-password').value;

      Api.loginAccount(userLogin, userPassword).then((value) => {
        if (value.error === '') {
          const token = value.payload.token;
          window.localStorage.setItem('token', token);
          router.navigate('account');
        } else {
          const error = new Error(value.error);
          throw error;
        }
      });
    });
  });

  router.resolve();
}

export { initRouting };
