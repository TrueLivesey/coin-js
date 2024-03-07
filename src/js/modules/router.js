// libraries
import Navigo from 'navigo';
import { el, setChildren, mount } from 'redom';

// app functions
import {
  createAuthorizationDOM,
  createHeaderNavDOM,
  createAccount,
  createAccounts,
  createAccountDetails,
  createHistory,
} from './render';
import { formValidation, accountFormValidation } from './validate';
import { Api } from '../api/api';
import {
  createError,
  errorTranslate,
  elemRemove,
  removeClass,
} from './functions';
import { openModal, closeModal, createExitModal } from './modal';
import { showMore } from './show-more';
import { createDynamicChart, drawChart } from '../libs/dynamic-chart';

// Инициализация роутера
function initRouting() {
  const router = new Navigo('/');
  const body = window.document.body;

  // создание страницы с авторизацией
  function createAuthorization(main, app) {
    const authorization = createAuthorizationDOM();

    main.classList.add('authorization-main');
    app.removeAttribute('class');
    app.innerHTML = '';
    mount(app, authorization);

    formValidation(
      'js-authorization-form',
      'js-authorization-login',
      'js-authorization-password',
    );

    // DOM-элементы
    const form = document.getElementById('js-authorization-form');
    const userLogin = document.getElementById('js-authorization-login');
    const userPassword = document.getElementById('js-authorization-password');

    // Удаление ошибки, вернувшейся с сервера при изменении любого инпута
    [userLogin, userPassword].forEach((e) => {
      e.addEventListener('input', () => {
        elemRemove('authorization__error');
      });
    });

    // Обработка события submit у формы
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const userLoginValue = userLogin.value;
      const userPasswordValue = userPassword.value;

      // Проверка присутствия ошибки на странице.
      // * Настройка lockForm у плагина just-validate работает не совсем
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
            router.navigate('accounts');
          } else if (value.error) {
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
          } else {
            const error = createError(value);
            mount(userLogin.parentNode, error);
          }
        });
      }
    });
  }

  // проверка на наличие ключа для авторизации (токена)
  function checkToken(main, app, token) {
    if (token === '') {
      createAuthorization(main, app);

      return true;
    } else {
      return false;
    }
  }

  function changeBtnSelected(btnName, status) {
    const btn = document.getElementById(`js-nav-${btnName}`);

    if (status === 'add') {
      btn.disabled = true;
      btn.classList.add('btn-selected');
    } else if (status === 'remove') {
      btn.disabled = false;
      btn.classList.remove('btn-selected');
    }
  }

  // Создание блока с навигацией
  function createNav(details = false) {
    if (!document.querySelector('.header__nav')) {
      const header = document.querySelector('.header');
      const headerContent = header.querySelector('.header__content');
      const headerNav = createHeaderNavDOM();
      mount(headerContent, headerNav);
      const modalExit = createExitModal(router).modal;
      const overlay = createExitModal(router).overlay;
      const wrapper = document.querySelector('.wrapper');
      const atmsBtn = document.getElementById('js-nav-atms');
      const accountsBtn = document.getElementById('js-nav-accounts');
      const currencyBtn = document.getElementById('js-nav-currency');
      const exitBtn = document.getElementById('js-nav-exit');
      const navBtns = [atmsBtn, accountsBtn, currencyBtn];
      const navBtnsLength = navBtns.length;
      const routes = ['atms', 'accounts', 'currency'];

      if (!details) {
        changeBtnSelected('accounts', 'add');
      } else {
        changeBtnSelected('accounts', 'remove');
      }

      for (let i = 0; i < navBtnsLength; ++i) {
        const btn = navBtns[i];
        btn.addEventListener('click', (e) => {
          e.preventDefault();

          if (header.querySelector('.btn-selected')) {
            const activeBtn = header.querySelector('.btn-selected');

            activeBtn.classList.remove('btn-selected');
            activeBtn.disabled = false;
          }

          btn.classList.add('btn-selected');
          btn.disabled = true;
          router.navigate(`${routes[i]}`);
        });
      }

      // создаем модальное окно при нажатии на кнопку "выйти"
      exitBtn.addEventListener('click', () => {
        openModal(wrapper, modalExit, overlay);

        const modalWrapper = document.querySelector('.modal-wrapper');
        const acceptBtn = document.getElementById('js-modal-accept');
        const refuseBtn = document.getElementById('js-modal-refuse');

        // обработчик кнопки выхода из аккаунта
        acceptBtn.addEventListener('click', () => {
          closeModal(modalWrapper, overlay);
          headerNav.remove();
          localStorage.setItem('token', '');
          router.navigate('/');
        });
        // обработчик кнопки отмены выхода из аккаунта
        refuseBtn.addEventListener('click', () => {
          closeModal(modalWrapper, overlay);
        });
      });
    }
  }

  // Главная страница (авторизация)
  router.on('/', () => {
    const main = document.querySelector('.main');
    const app = document.getElementById('app');
    const token = localStorage.getItem('token');

    if (document.querySelector('.header__nav')) {
      document.querySelector('.header__nav').remove();
    }

    if (checkToken(main, app, token)) return;

    router.navigate('accounts');
  });

  // Страница аккаунта
  router.on('/accounts', () => {
    const main = document.querySelector('.main');
    const app = document.getElementById('app');
    const containerError = el('.container.container-error');
    const token = localStorage.getItem('token');

    // Очищаем страницу с авторизацией
    app.innerHTML = '';
    main.classList.remove('authorization-main');
    app.classList.add('accounts');

    // если токен пустой, то пользователь не вошел в аккаунт
    if (!token) {
      const errorUserNotFound = createError('Вы не вошли в аккаунт');

      errorUserNotFound.classList.add('user-not-found');
      mount(app, containerError);
      mount(containerError, errorUserNotFound);
    }

    // добавляем навигацию на страницу аккаунта
    createNav();
    changeBtnSelected('accounts', 'add');

    Api.getAccounts(token).then((value) => {
      if (value.error === '') {
        const accounts = createAccounts(value.payload);
        mount(app, accounts);
        const accountBtns = document.querySelectorAll('.btn-blue');

        accountBtns.forEach((btn) => {
          btn.addEventListener('click', () => {
            const accountNumber = btn.parentNode.parentNode.dataset.number;
            changeBtnSelected('accounts', 'remove');
            router.navigate(`/accounts/${accountNumber}`);
          });
        });

        // Создаем новый счёт
        const newAccountBtn = document.querySelector('.accounts__btn');
        const accountsList = document.querySelector('.accounts__list');

        newAccountBtn.addEventListener('click', () => {
          Api.createAccount(token).then((value) => {
            if (value.error === '') {
              Api.getAccountId(token, value.payload.account).then((valueId) => {
                const newAccountDate = new Date()
                  .toLocaleString('ru', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                  .slice(0, -3);
                const dateSort = new Date();
                const newAccount = createAccount(
                  valueId.payload.account,
                  valueId.payload.balance,
                  newAccountDate,
                  dateSort,
                );

                newAccount.accountBtn.addEventListener('click', () => {
                  console.log('new btn');
                });

                mount(accountsList, newAccount.account);
              });
            } else {
              const newAccountError = new TypeError(value.error);
              throw newAccountError;
            }
          });
        });
      } else {
        console.error(value.error);
      }
    });
  });

  // Страница конкретного счёта
  router.on('/accounts/:id/', ({ data }) => {
    // console.log(data); // { id: 'xxx', action: 'save' }
    const main = document.querySelector('.main');
    const app = document.getElementById('app');
    const containerError = el('.container.container-error');
    const token = localStorage.getItem('token');
    let accounts = null;

    // Очищаем страницу с авторизацией
    app.innerHTML = '';
    main.classList.remove('authorization-main');
    app.classList.add('account');
    removeClass(app, 'accounts');

    // если токен пустой, то пользователь не вошел в аккаунт
    if (!token) {
      const errorUserNotFound = createError('Вы не вошли в аккаунт');
      errorUserNotFound.classList.add('user-not-found');
      mount(app, containerError);
      mount(containerError, errorUserNotFound);
    }

    // Создаём навигацию
    createNav(true);
    changeBtnSelected('accounts', 'remove');

    // Получаем все счета пользователей
    Api.getAccounts(token).then((dataAccounts) => {
      accounts = dataAccounts.payload;
    });

    // Получаем конкретный счёт пользователя
    Api.getAccountId(token, data.id).then((userData) => {
      if (userData.error) {
        console.error('Ошибка');
      } else {
        const container = el('.container');
        const accountContent = el('.account__content');
        const userDataPayload = userData.payload;
        let accountsArray = [];
        let sum = null;

        // Создаём массив из всех счетов пользователей кроме того, на который
        // пользователь перешёл
        if (accounts) {
          accounts.forEach((accountId) => {
            if (accountId.account !== userDataPayload.account) {
              accountsArray.push(accountId.account);
            }
          });
        }

        const accountTop =
          createAccountDetails().createAccountTop(userDataPayload);
        const accountNewTrans =
          createAccountDetails().createNewTrans(accountsArray);
        const accountHistory = createHistory(
          userDataPayload,
          userDataPayload.account,
        );
        const balanceDynamic =
          createAccountDetails().createBalanceDynamic(userDataPayload);

        setChildren(accountContent, [
          accountNewTrans,
          balanceDynamic,
          accountHistory,
        ]);
        setChildren(container, [accountTop, accountContent]);
        app.append(container);

        // Создаем график баланса
        createDynamicChart(userData.payload, 'six').then((chartData) => {
          drawChart(chartData, 'account-balance-chart');
        });

        // Кнопка "Вернуться назад"
        const returnBtn = document.querySelector('.btn-back');
        returnBtn.addEventListener('click', () => {
          router.navigate(`/accounts`);
        });

        // Отправляем перевод
        const accountBtn = document.querySelector('.account-form__btn');
        const accountInput = document.getElementById('account-form-amount');
        const accountSelectBtn = document.querySelector('.account-select');
        const accountTableTrs = document.querySelectorAll('.account-table__tr');
        const accountTableTbody = document.querySelector(
          '.account-table__tbody',
        );
        const acountTableContainer = document.querySelector(
          '.account-table-container',
        );
        const accountTableShowBtn = el(
          'button#account-table-btn.main-btn.account-table__btn',
          'Показать ещё',
        );

        acountTableContainer.append(accountTableShowBtn);

        accountInput.addEventListener('change', () => {
          sum = accountInput.value;
        });

        accountBtn.addEventListener('click', (e) => {
          e.preventDefault();

          const accountSelect = document.querySelector(
            '.account-select__placeholder',
          );

          if (accountFormValidation(accountSelectBtn, accountInput)) {
            Api.transferFunds(
              token,
              data.id,
              accountSelect.innerHTML,
              sum,
            ).then((userData) => {
              // console.log(userData);
              const balanceElem = document.querySelector(
                '.account-top__amount',
              );
              const accountFormItems = document.querySelectorAll(
                '.account-form__item',
              );
              const accountFormAmount = document.getElementById(
                'account-form-amount',
              );
              const trueValidate = el(
                'p.account-form__successful',
                'Перевод прошёл успешно',
              );

              accountFormItems[1].after(trueValidate);
              accountFormAmount.value = '';
              balanceElem.innerHTML = `${userData.payload.balance} ₽`;
            });
          }
        });

        if (accountTableTrs.length > 10) {
          showMore(
            accountTableTbody,
            accountTableTrs,
            accountTableShowBtn,
            10,
            10,
            'hidden',
          );
        }
      }
    });
  });

  router.resolve();
}

export { initRouting };
