// libraries
import Navigo from 'navigo';
import { el, setChildren, mount } from 'redom';

// app functions
import { createAccountDOM } from './render';
import { formValidation } from './validate';
import { Api } from '../api/api';
import { createError, errorTranslate, elemRemove } from './functions';

// Инициализация роутера
function initRouting() {
  const router = new Navigo('/');
  const body = window.document.body;
  const main = document.querySelector('.main');

  main.classList.add('account-main');

  // Главная страница (авторизация)
  router.on('/', () => {
    const account = createAccountDOM();

    mount(app, account);

    formValidation(
      'js-account-form',
      'js-account-login',
      'js-account-password',
    );

    // DOM-элементы
    const form = document.getElementById('js-account-form');
    const userLogin = document.getElementById('js-account-login');
    const userPassword = document.getElementById('js-account-password');

    // Удаление ошибки, вернувшейся с сервера при изменении любого инпута
    [userLogin, userPassword].forEach((e) => {
      e.addEventListener('input', () => {
        elemRemove('account__error');
      });
    });

    // Обработка события submit у формы
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const userLoginValue = userLogin.value;
      const userPasswordValue = userPassword.value;

      // Проверка на присутствие ошибки на странице.
      // P.S. настройка lockForm у плагина just-validate работает не совсем
      // корректно, приходится использовать дополнительную проверку
      if (document.querySelector('.just-validate-error-label')) {
        return;
      } else {
        // обращаемся к серверу за логином и паролем
        Api.loginAccount(userLoginValue, userPasswordValue).then((value) => {
          if (value.error === '') {
            const token = value.payload.token;
            window.localStorage.setItem('token', token);
            // навигация на новую страницу
            router.navigate('account');
          } else {
            const error = new Error(value.error);
            const errorObj = errorTranslate(value.error);
            const errorBlock = createError(errorObj.errorText);

            // Добавляем ошибку, которая пришла с сервера
            if (errorObj.errorProblem === 'user') {
              mount(userLogin.parentNode, errorBlock);
            } else if (errorObj.errorProblem === 'password') {
              mount(userPassword.parentNode, errorBlock);
            }

            // выкидываем ошибку в консоль
            throw error;
          }
        });
      }
    });
  });

  router.resolve();
}

export { initRouting };
