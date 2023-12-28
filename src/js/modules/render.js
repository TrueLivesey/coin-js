// библиотеки
import { setChildren, mount, el, svg } from 'redom';

// функции приложения
import { MonthArray } from '../const';
import { accountSort } from './functions';

// страница с авторизацией
function createAuthorizationDOM() {
  // DOM
  const authorization = el('.authorization');
  const authorizationForm = el(
    'form#js-authorization-form.authorization__form',
  );
  const authorizationLoginBlock = el('.authorization__login-block');
  const authorizationLoginLabel = el('label.authorization__label');
  const authorizationLogin = el(
    'input#js-authorization-login.basic-input.authorization__login.authorization__input',
    {
      type: 'text',
    },
  );
  const authorizationLoginText = el('span.authorization__text');
  const authorizationPasswordLabel = el('label.authorization__label', {
    type: 'text',
  });
  const authorizationPassword = el(
    'input#js-authorization-password.basic-input.authorization__password.authorization__input',
  );
  const authorizationPasswordText = el('span.authorization__text');
  const authorizationBtn = el(
    'button#js-authorization-btn.btn.authorization__btn',
  );
  const authorizationTitle = el('h2.title-h2.authorization__title');

  // filling text fields
  authorizationTitle.textContent = 'Вход в аккаунт';
  authorizationLoginText.textContent = 'Логин';
  authorizationPasswordText.textContent = 'Пароль';
  authorizationBtn.textContent = 'Войти';

  // mounting
  setChildren(authorizationLoginLabel, [
    authorizationLoginText,
    authorizationLogin,
  ]);
  setChildren(authorizationPasswordLabel, [
    authorizationPasswordText,
    authorizationPassword,
  ]);
  setChildren(authorizationLoginBlock, [
    authorizationLoginLabel,
    authorizationPasswordLabel,
  ]);
  setChildren(authorizationForm, [
    authorizationTitle,
    authorizationLoginBlock,
    authorizationBtn,
  ]);
  mount(authorization, authorizationForm);

  return authorization;
}

// создание навигации в шапке
function createHeaderNavDOM() {
  const headerNav = el('.header__nav');
  const headerNavContents = ['Банкоматы', 'Счета', 'Валюта', 'Выйти'];
  const headerNavContentsLength = headerNavContents.length;
  const headerNavIds = [
    'js-nav-atms',
    'js-nav-accounts',
    'js-nav-currency',
    'js-nav-exit',
  ];

  for (let i = 0; i < headerNavContentsLength; ++i) {
    const headerBtn = el('button.header__btn');

    headerBtn.textContent = headerNavContents[i];
    headerBtn.id = headerNavIds[i];
    mount(headerNav, headerBtn);
  }

  return headerNav;
}

// создание счёта
function createAccount(number, amount, date, dateSort) {
  const account = el('.account');
  const accountNumber = el('span.account__number');
  const accountAmount = el('span.account__amount');
  const accountDateBottom = el('.account__bottom');
  const accountDateBlock = el('.account__date-block');
  const accountDateText = el('span.account__text');
  const accountDate = el('span.account__date');
  const accountBtn = el('button.account__btn');

  accountDateText.textContent = 'Последняя транзакция:';
  accountNumber.textContent = number;
  accountAmount.textContent = `${amount} ₽`;
  accountDate.textContent = date;
  accountBtn.textContent = 'Открыть';

  account.dataset.number = number;
  account.dataset.balance = amount;
  account.dataset.lastTransaction = dateSort;

  setChildren(accountDateBlock, [accountDateText, accountDate]);
  setChildren(accountDateBottom, [accountDateBlock, accountBtn]);
  setChildren(account, [accountNumber, accountAmount, accountDateBottom]);

  return { account, accountBtn };
}

// создание кастомного селекта
function createAccountsSelect() {
  const select = el('.account-select');
  const selectBtn = el('.account-select__btn');
  const selectIcon = svg(
    'svg#js-account-select-icon.account-select__icon',
    { width: 10, height: 5 },
    svg('use', { xlink: { href: 'images/sprite.svg#select-arrow' } }),
  );
  const selectPlaceholder = el('span.account-select__placeholder');
  const options = el('ul.account-options');
  const optionNumber = el('span#js-account-option-number.account-option__text');
  const optionBalance = el(
    'span#js-account-option-balance.account-option__text',
  );
  const optionTransaction = el(
    'span#js-account-option-transaction.account-option__text',
  );

  optionNumber.textContent = 'По номеру';
  optionBalance.textContent = 'По балансу';
  optionTransaction.textContent = 'По последней транзакции';

  const optionsArr = [optionNumber, optionBalance, optionTransaction];

  // сортировка по номеру счёта
  optionNumber.addEventListener('click', () => {
    const accountField = document.querySelector('.accounts__list');
    let accountFieldSort = null;

    accountField.dataset.sortBalance = false;
    accountField.dataset.sortTransaction = false;

    if (accountField.dataset.sortNumber === 'false') {
      accountFieldSort = accountSort(accountField, 'number', true);
      accountField.dataset.sortNumber = true;
    } else {
      accountFieldSort = accountSort(accountField, 'number');
      accountField.dataset.sortNumber = false;
    }

    accountField.innerHTML = '';

    accountFieldSort.forEach((account) => {
      accountField.append(account);
    });
  });

  // сортировка по балансу
  optionBalance.addEventListener('click', () => {
    const accountField = document.querySelector('.accounts__list');
    let accountFieldSort = null;

    accountField.dataset.sortNumber = false;
    accountField.dataset.sortTransaction = false;

    if (accountField.dataset.sortBalance === 'false') {
      accountFieldSort = accountSort(accountField, 'balance', true);
      accountField.dataset.sortBalance = true;
    } else {
      accountFieldSort = accountSort(accountField, 'balance');
      accountField.dataset.sortBalance = false;
    }

    accountField.innerHTML = '';

    accountFieldSort.forEach((account) => {
      accountField.append(account);
    });
  });

  // сортировка по последней транзакции
  optionTransaction.addEventListener('click', () => {
    const accountField = document.querySelector('.accounts__list');
    let accountFieldSort = null;

    accountField.dataset.sortNumber = false;
    accountField.dataset.sortBalance = false;

    if (accountField.dataset.sortTransaction === 'false') {
      accountFieldSort = accountSort(accountField, 'transaction', true);
      accountField.dataset.sortTransaction = true;
    } else {
      accountFieldSort = accountSort(accountField, 'transaction');
      accountField.dataset.sortTransaction = false;
    }

    accountField.innerHTML = '';

    accountFieldSort.forEach((account) => {
      accountField.append(account);
    });
  });

  selectPlaceholder.textContent = 'Сортировка';

  optionsArr.forEach((optionSpan) => {
    const option = el('li.account-option');

    option.addEventListener('click', () => {
      let selectedOption = option.querySelector(
        '.account-option__text',
      ).innerText;

      selectPlaceholder.innerText = selectedOption;
      select.classList.remove('active');
    });
    mount(option, optionSpan);
    mount(options, option);
  });

  selectBtn.addEventListener('click', () => {
    select.classList.toggle('active');
  });

  window.addEventListener('click', (e) => {
    const targetElem = e.target;

    if (
      !targetElem.closest('.account-options') &&
      !targetElem.closest('.account-select__btn')
    ) {
      select.classList.remove('active');
    }
  });

  setChildren(selectBtn, [selectPlaceholder, selectIcon]);
  setChildren(select, [selectBtn, options]);

  return select;
}

// создание страницы со счетами
function createAccounts(data) {
  const accountsTitleBlock = el('.accounts__top');
  const titleAndSelect = el('.accounts__title-block');
  const accountsTitle = el('h2.accounts__title');
  const accountsBtn = el('button.main-btn.accounts__btn');
  const accountsContent = el('.accounts__content');
  const container = el('.container');
  const accountsList = el('.accounts__list');
  const select = createAccountsSelect();

  accountsList.dataset.sortNumber = false;
  accountsList.dataset.sortBalance = false;
  accountsList.dataset.sortTransaction = false;
  accountsTitle.textContent = 'Ваши счета';
  accountsBtn.innerHTML = `Создать новый счёт`;

  mount(accountsContent, container);
  setChildren(titleAndSelect, [accountsTitle, select]);
  setChildren(accountsTitleBlock, [titleAndSelect, accountsBtn]);

  // создание элемента со всеми счетами
  data.forEach((dataValue) => {
    const lastTransaction =
      dataValue.transactions[dataValue.transactions.length - 1];
    let date = null;
    let numberOfMilliseconds = null;
    let accountDate = '—';
    let dateSort = 0;
    let amount = 0;

    if (lastTransaction) {
      date = new Date(`${lastTransaction.date}`).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      numberOfMilliseconds = new Date(`${lastTransaction.date}`).getTime();
      dateSort = numberOfMilliseconds;
      accountDate = `${date.slice(0, -3)}`;
      amount = lastTransaction.amount;
    }

    const account = createAccount(
      dataValue.account,
      amount,
      accountDate,
      dateSort,
    ).account;

    mount(accountsList, account);
  });

  setChildren(container, [accountsTitleBlock, accountsList]);

  return accountsContent;
}

// Создание страницы конкретного счёта (просмотр счёта)
function createAccountDetails(data) {}

export {
  createAuthorizationDOM,
  createHeaderNavDOM,
  createAccount,
  createAccounts,
};
