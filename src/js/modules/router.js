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
  createHistoryTr,
  createHistory,
  createCurrency,
  initSocket,
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
import {
  createDynamicChart,
  createDynamicChartRatio,
  drawChart,
  drawChartRatio,
} from './dynamic-chart';
import { parse } from 'postcss';

// Инициализация роутера
function initRouting() {
  const router = new Navigo('/');
  const body = window.document.body;
  let socket = null; // Глобальная переменная для хранения текущего сокета
  let onMessageHandler = null; // Глобальная переменная для обработчика сообщений

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
      const currentUrl = window.location.pathname.slice(1);
      console.log('currentUrl', currentUrl);

      // Проверка на выбранный раздел
      function selectBtn(e, btn) {
        if (e === btn.id.slice(7)) {
          btn.classList.add('btn-selected');
          btn.disabled = true;
        }
      }

      if (!details) {
        changeBtnSelected('accounts', 'add');
      } else {
        changeBtnSelected('accounts', 'remove');
      }

      for (let i = 0; i < navBtnsLength; ++i) {
        const btn = navBtns[i];

        selectBtn(currentUrl, btn);

        btn.addEventListener('click', (e) => {
          if (header.querySelector('.btn-selected')) {
            const activeBtn = header.querySelector('.btn-selected');

            activeBtn.classList.remove('btn-selected');
            activeBtn.disabled = false;
          }

          selectBtn(btn.id.slice(7), btn);
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

  // Очистка сокета и удаление его обработчика
  function cleanupSocket() {
    if (socket) {
      socket.removeEventListener('message', onMessageHandler); // Удаление обработчика
      socket.close(); // Закрытие сокета
      socket = null; // Очистка ссылки на сокет
      onMessageHandler = null; // Очистка ссылки на обработчик
      console.log('clean up socket');
      console.log('socket', socket);
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
      const errorUserNotFound = createError(
        'Вы не вошли в аккаунт',
        'authorization__error',
      );

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

        const accountTop = createAccountDetails().createAccountTop(
          userDataPayload,
          'Просмотр счета',
        );
        const accountNewTrans =
          createAccountDetails().createNewTrans(accountsArray);
        const accountHistory = createHistory(
          userDataPayload,
          userDataPayload.account,
          'clickable',
        );

        // Динамика баланса
        const balanceDynamic = createAccountDetails().createBalanceDynamic(
          '.account-dynamic',
          'account-balance-chart',
          'Динамика баланса',
        );

        setChildren(accountContent, [
          accountNewTrans,
          balanceDynamic,
          accountHistory,
        ]);
        setChildren(container, [accountTop, accountContent]);
        app.append(container);

        // Клик по "истории переводов"
        const historyBtn = document.getElementById('history-btn');
        historyBtn.addEventListener('click', () => {
          const currentUrl = window.location.pathname;
          const newUrl = currentUrl + '/history';
          router.navigate(`accounts/${data.id}/history`);
        });

        // Создаем график баланса
        createDynamicChart(userData.payload, 6).then((chartData) => {
          drawChart(chartData, 'account-balance-chart', 195);
        });

        // Кнопка "Вернуться назад"
        const returnBtn = document.querySelector('.btn-back');
        returnBtn.addEventListener('click', () => {
          history.back();
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

        if (accountTableTrs.length > 9) {
          acountTableContainer.append(accountTableShowBtn);
        }

        accountInput.addEventListener('change', () => {
          sum = accountInput.value;
        });

        accountBtn.addEventListener('click', (e) => {
          e.preventDefault();

          elemRemove('account-form__successful');
          elemRemove('account-form__error');

          const accountSelect = document.querySelector(
            '.account-select__placeholder',
          );

          if (accountFormValidation(accountSelectBtn, accountInput)) {
            Api.transferFunds(token, data.id, accountSelect.innerHTML, sum)
              .then((userData) => {
                if (userData.error) {
                  elemRemove('account-form__error');

                  let accountError = '';
                  const accountFormItems = document.querySelectorAll(
                    '.account-form__item',
                  );
                  const userDataError = userData.error;

                  console.log(document.querySelector('account-error'));
                  if (!document.querySelector('account-error')) {
                    switch (userDataError) {
                      case 'Overdraft prevented':
                        accountError = createError(
                          'Недостаточно средств для перевода',
                        );
                        break;
                      case 'Invalid amount':
                        accountError = createError(
                          'Сумма перевода либо не указана, либо она отрицательная',
                        );
                        break;
                      case 'Invalid account from':
                        accountError = createError(
                          'Адрес счёта списания либо не указан, либо вам не принадлежит',
                        );
                        break;
                      case 'Invalid account to':
                        accountError = createError(
                          'Счёт зачисления либо не указан, либо его не существует',
                        );
                        break;
                    }
                  }
                  accountError.classList.add(
                    'account-form__item',
                    'account-form__error',
                  );
                  accountFormItems[1].after(accountError);
                } else {
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

                  // console.log(data.id);

                  const newTransaction =
                    userData.payload.transactions.slice(-1)[0];
                  const newTr = createHistoryTr(data.id, newTransaction);

                  accountTableTbody.prepend(newTr);
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });

        // Показать ещё
        if (accountTableTrs.length > 10) {
          showMore(
            accountTableTbody,
            accountTableTrs,
            accountTableShowBtn,
            10,
            10,
            'not-hidden',
          );
        }
      }
    });
  });

  // Страница истории
  router.on('/accounts/:id/history', ({ data }) => {
    const main = document.querySelector('.main');
    const app = document.getElementById('app');
    const containerError = el('.container.container-error');
    const token = localStorage.getItem('token');
    const container = el('.container');
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

    // Получаем данные о счете пользователя
    Api.getAccountId(token, data.id).then((dataAccount) => {
      const historyTop = createAccountDetails().createAccountTop(
        dataAccount.payload,
        'Просмотр счета',
      );
      const historyContent = el('.history-content');
      const accountsHistory = createHistory(
        dataAccount.payload,
        dataAccount.payload.account,
      );
      const historyTableShowBtn = el(
        'button#history-table-btn.main-btn.account-table__btn',
        'Показать ещё',
      );
      const accountTableTrs =
        accountsHistory.querySelectorAll('.account-table__tr');
      const accountTableTbody = accountsHistory.querySelector(
        '.account-table__tbody',
      );
      // Динамика баланса
      const balanceDynamic = createAccountDetails().createBalanceDynamic(
        '.history-dynamic',
        'history-balance-chart',
        'Динамика баланса',
      );
      // Динамика соотношения
      const balanceDynamicRatio = createAccountDetails().createBalanceDynamic(
        '.history-dynamic.history-dynamic-chart',
        'history-balance-ratio',
        'Соотношение входящих исходящих транзакций',
      );

      // Показать ещё
      if (accountTableTrs.length > 10) {
        accountsHistory.append(historyTableShowBtn);
        showMore(
          accountTableTbody,
          accountTableTrs,
          historyTableShowBtn,
          10,
          10,
          'not-hidden',
        );
      }

      historyContent.append(balanceDynamic, balanceDynamicRatio);
      container.append(historyTop, historyContent, accountsHistory);
      app.append(container);

      const btnBack = container.querySelector('.btn-back');

      btnBack.addEventListener('click', () => {
        history.back();
      });

      createDynamicChart(dataAccount.payload, 12).then((chartData) => {
        drawChart(chartData, 'history-balance-chart', 300);
      });

      createDynamicChartRatio(dataAccount.payload).then((chartData) => {
        // console.log('chartData:', chartData);
        drawChartRatio(chartData, 'history-balance-ratio', 300);
      });
    });
  });

  // Страница валют
  router.on(
    '/currency',
    ({ data }) => {
      const main = document.querySelector('.main');
      const app = document.getElementById('app');
      const containerError = el('.container.container-error');
      const token = localStorage.getItem('token');
      const container = el('.container');
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

      // DOM
      const mainTitle = el('h2.main-title.currency-title', 'Валютный обмен');
      const currencyWrapper = el('.currency');

      // Получаем все счета пользователя
      Api.getCurrencies(token).then((data) => {
        const payload = data.payload;
        const yourCurrencies = createCurrency().createYourCurrencies(
          payload,
          'Ваши валюты',
        );

        const exchangeForm = createCurrency().createExchange(payload);
        const changeRates = createCurrency().createChangeRates();

        currencyWrapper.append(yourCurrencies, exchangeForm, changeRates);
        container.append(mainTitle, currencyWrapper);

        exchangeForm.addEventListener('submit', (e) => {
          e.preventDefault();

          const from = exchangeForm
            .querySelector('#js-exchange-from')
            .querySelector('.account-select__placeholder').textContent;
          const to = exchangeForm
            .querySelector('#js-exchange-to')
            .querySelector('.account-select__placeholder').textContent;
          const amount =
            parseInt(exchangeForm.querySelector('#js-exchange-sum').value) || 0;

          // Отправялем перевод
          Api.currencyBuy(token, from, to, amount).then((currencyData) => {
            const errorCode = currencyData.error;
            let error = null;
            // Ловим ошибки
            switch (errorCode) {
              case 'Unknown currency code':
                error = createError('Передан неверный валютный код');
                break;
              case 'Invalid amount':
                error = createError('Не указана сумма перевода');
                break;
              case 'Not enough currency':
                error = createError('На валютном счёте списания нет средств');
                break;
              case 'Overdraft prevented':
                error = createError('Не хватает средств');
                break;
              default:
                error = createError('Перевод выполнен успешно', 'successful');
                const yourCurrencies =
                  document.querySelector('.your-currencies');
                const fromEl = yourCurrencies.querySelector(
                  `[data-code="${from}"]`,
                );
                const toEl = yourCurrencies.querySelector(
                  `[data-code="${to}"]`,
                );

                // Обновляем значения валют пользователя
                fromEl.innerHTML = currencyData.payload[from].amount;
                toEl.innerHTML = currencyData.payload[to].amount;
            }

            exchangeForm.querySelector('.exchange-form__content').append(error);
          });
        });

        socket = Api.getChangedCurrency(); // Получение сокета из API
        onMessageHandler = initSocket(socket); // Функция для обработчика
        // сокета

        // Прослушивание вебсокета
        socket.addEventListener('message', onMessageHandler);
      });
      app.append(container);
    },
    {
      leave(done) {
        cleanupSocket(); // При переходе на другую страницу очищаем сокет
        done();
      },
    },
  );

  router.resolve();
}

export { initRouting };
