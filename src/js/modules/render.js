// библиотеки
import { setChildren, mount, el, svg } from 'redom';

// функции приложения
import { Icons } from '../const';
import { accountSort, elemRemove } from './functions';
import { showMore } from './show-more';

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
  const accountBtn = el('button.btn-blue');

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
function createAccountsSelect(mode, data = null, iconId = null) {
  const select = el('.account-select');
  const selectBtn = el('.account-select__btn');
  const selectPlaceholder = el('span.account-select__placeholder');
  const options = el('ul.account-options');
  const optionNumber = el('span#js-account-option-number.account-option__text');
  const optionBalance = el(
    'span#js-account-option-balance.account-option__text',
  );
  const optionTransaction = el(
    'span#js-account-option-transaction.account-option__text',
  );
  let optionsArr = [];
  let selectIcon = null || Icons.selectArrow;
  selectIcon.classList.add('account-select__icon');

  if (mode === 'sort') {
    selectIcon.id = 'js-account-select-icon';
    optionNumber.textContent = 'По номеру';
    optionBalance.textContent = 'По балансу';
    optionTransaction.textContent = 'По последней транзакции';

    optionsArr = [optionNumber, optionBalance, optionTransaction];

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
  } else if (mode === 'account') {
    selectIcon = Icons.accountSelectArrow;
    selectIcon.id = 'js-account-select-icon-amount';
    selectIcon.classList.add('account-select__icon');
    selectPlaceholder.textContent = 'Выберите номер счёта';
    selectBtn.classList.add('account-form__select-btn');
    data.forEach((dataAmount) => {
      let optionAccount = el(
        `span#js-amount-${dataAmount}.account-option__text`,
      );
      optionAccount.textContent = dataAmount;
      optionsArr.push(optionAccount);
    });
  } else if (mode === 'currency-exchange') {
    const iconConstId = `exchange${iconId}`;
    selectIcon = Icons[iconConstId];
    selectIcon.id = `js-exchange-select-icon-amount-${iconId}`;
    selectIcon.classList.add('account-select__icon');
    selectPlaceholder.textContent = `${data[0]}`;
    selectBtn.classList.add('account-form__select-btn');
    data.forEach((dataAmount) => {
      let optionAccount = el(
        `span#js-amount-${dataAmount}.account-option__text`,
      );
      optionAccount.textContent = dataAmount;
      optionsArr.push(optionAccount);
    });
  }

  optionsArr.forEach((optionSpan) => {
    const option = el('li.account-option');

    option.addEventListener('click', () => {
      let selectedOption = option.querySelector(
        '.account-option__text',
      ).innerText;

      if (
        mode === 'account' &&
        select.parentElement.nextElementSibling.classList.contains(
          'account-error',
        )
      ) {
        elemRemove('account-error');
      }

      selectPlaceholder.innerText = selectedOption;
      selectPlaceholder.classList.add('account-select__placeholder--black');
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
  const accountsTitle = el('h2.main-title.accounts__title');
  const accountsBtn = el('button.main-btn.accounts__btn');
  const accountsContent = el('.accounts__content');
  const container = el('.container');
  const accountsList = el('.accounts__list');
  const select = createAccountsSelect('sort');

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
    let amount = dataValue.balance;

    if (lastTransaction) {
      date = new Date(`${lastTransaction.date}`).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      numberOfMilliseconds = new Date(`${lastTransaction.date}`).getTime();
      dateSort = numberOfMilliseconds;
      accountDate = `${date.slice(0, -3)}`;
      // amount = lastTransaction.amount;
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
function createAccountDetails() {
  function createAccountTop(data, title) {
    const accountTitleBlock = el('.account-top');
    const accountTitleAndBtn = el('.account-top__top');
    const accountNumberAndBalance = el('.account-top__bottom');
    const accountNumber = el('p.account-top__number', `№ ${data.account}`);
    const accountTitle = el('h2.main-title.account__title', `${title}`);
    const accountBtn = el('button.btn-back.btn-blue', 'Вернуться назад');
    const accountBalanceBlock = el('.account-top__balance-block');
    const accountBalance = el('span.account-top__balance', 'Баланс');
    const accountAmount = el(
      'span.account-top__amount',
      `${parseFloat(data.balance)} ₽`,
    );

    setChildren(accountBalanceBlock, [accountBalance, accountAmount]);
    setChildren(accountTitleAndBtn, [accountTitle, accountBtn]);
    setChildren(accountNumberAndBalance, [accountNumber, accountBalanceBlock]);
    setChildren(accountTitleBlock, [
      accountTitleAndBtn,
      accountNumberAndBalance,
    ]);

    return accountTitleBlock;
  }

  function createNewTrans(usersAmounts) {
    const newTransForm = el(
      'form#account-form.account__new-transaction.account-form',
    );
    const newTransTitle = el('h3.title-h3.account-form__title');
    const newTransSelectItem = el('.account-form__item');
    const newTransSelectText = el(
      'p.account-form__text-number',
      'Номер счёта получателя',
    );
    const newTransSelect = createAccountsSelect('account', usersAmounts);
    const newTransAmount = el('.account-form__item');
    const newTransLabelAmount = el(
      'label.account-form__label',
      'Сумма перевода',
      { for: 'account-form-amount' },
    );
    const newTransInputAmount = el('input.account-form__input', {
      id: 'account-form-amount',
      type: 'text',
    });
    const newTransBtn = el('button.btn-blue.account-form__btn');
    const newTransBtnIcon = Icons.accountEmailIcon;

    newTransAmount.addEventListener('input', () => {
      elemRemove('account-error-amount');
    });

    newTransBtnIcon.classList.add('account-form__btn-icon');
    newTransBtn.textContent = 'Отправить';
    newTransBtn.appendChild(newTransBtnIcon);
    newTransTitle.textContent = 'Новый перевод';
    newTransInputAmount.setAttribute('placeholder', 'Введите число');
    setChildren(newTransSelectItem, [newTransSelectText, newTransSelect]);
    setChildren(newTransAmount, [newTransLabelAmount, newTransInputAmount]);
    setChildren(newTransForm, [
      newTransTitle,
      newTransSelectItem,
      newTransAmount,
      newTransBtn,
    ]);

    return newTransForm;
  }

  // Динамика баланса
  function createBalanceDynamic(wrapperName, id, titleName) {
    const wrapper = el(wrapperName);
    const title = el('h3.title-h3.account-dynamic__title', `${titleName}`);
    const chartWrapper = el('.dynamic-chart');
    const canvas = el(`canvas#${id}.canvas.dynamic-chart__canvas`);

    wrapper.append(title);
    chartWrapper.append(canvas);
    wrapper.append(chartWrapper);

    return wrapper;
  }

  return { createAccountTop, createNewTrans, createBalanceDynamic };
}

// История переводов
function createHistory(data, userData, mode) {
  let caption = '';

  // Кликабельность заголовка
  if (mode === 'clickable') {
    caption = el(
      'button#history-btn.account-table__title.account-table__title-btn',
      'посмотреть историю',
    );
  }

  const tableContainer = el('.account-table-container');
  const tableWrapper = el('.account-wrapper');
  const table = el('table.account-table');
  const thead = el('thead.account-table__thead');
  const theadTr = el('tr.account-table__thead-tr');
  const theadThArray = ['Счёт отправителя', 'Счёт получателя', 'Сумма', 'Дата'];
  const tbody = el('tbody.account-table__tbody');
  const tableTitleBlock = el('.account-table__title-wrapper');
  const tableTitle = el(
    'h3.title-h3.account-table__title',
    'История переводов',
  );
  let i = 0;

  tableTitleBlock.append(tableTitle, caption);

  theadThArray.forEach((thName) => {
    const th = el('th.account-table__th', `${thName}`);

    theadTr.append(th);
  });

  data.transactions.forEach((transaction) => {
    const tr = el('tr.account-table__tr');
    const sendersAccount = el('td.account-table__td', `${transaction.from}`);
    const recipientsAccount = el('td.account-table__td', `${transaction.to}`);
    const amount = el('td.account-table__td', `${transaction.amount}`);
    const dateObj = new Date(transaction.date);
    const date = el(
      'td.account-table__td',
      `${dateObj.getDate()}.${(dateObj.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${dateObj.getFullYear()}`,
    );

    if (userData === transaction.to) {
      amount.textContent = `+ ${transaction.amount}`;
      amount.style.color = '#76CA66';
    } else {
      amount.textContent = `- ${transaction.amount}`;
      amount.style.color = '#FD4E5D';
    }

    if (i >= 10) {
      tr.classList.add('is-hidden');
    }

    i++;
    tr.append(sendersAccount, recipientsAccount, amount, date);
    tbody.append(tr);
  });

  thead.append(theadTr);
  table.append(thead, tbody);
  tableWrapper.append(tableTitleBlock, table);
  tableContainer.append(tableWrapper);

  return tableContainer;
}

// Валютный обмен
function createCurrency() {
  function createYourCurrencies(data, titleName) {
    const wrapper = el('.your-currencies.currency__your-currencies');
    const title = el('h3.title-h3.your-currencies__title', `${titleName}`);
    const list = el('ul.your-currencies__list');

    for (const key in data) {
      // console.log(`${key}: ${data[key].amount}`);

      const item = el('li.your-currencies__item');
      const param = el('.your-currencies-param');
      const paramValue = el(
        'span.your-currencies-param__value',
        `${data[key].amount}`,
      );
      const paramProp = el('.span.your-currencies-param__prop', `${key}`);

      param.append(paramValue, paramProp);
      item.append(param);
      list.append(item);
    }

    wrapper.append(title, list);

    return wrapper;
  }

  function createExchange(data) {
    let selectList = [];
    const form = el('form.exchange-form');
    const formTitle = el('h3.title-h3.exchange__title', 'Обмен валюты');
    const formSelectBlock = el('.exchange-form__text-block');
    const formSelectBlock2 = el('.exchange-form__text-block');
    const formSelectBlockText = el('span.exchange-form__text', 'Из');
    const formSelectBlock2Text = el('span.exchange-form__text', 'в');
    const formBtn = el('input.exchange-form__btn', {
      type: 'button',
      value: 'Обменять',
    });
    const formLabelSum = el('label.exchange-form__label');
    const formInputSum = el('input.exchange-form__input', {
      type: 'text',
      placeholder: 'введите сумму',
    });
    const formLabelSpan = el('span.exchange-form__text', 'Сумма');

    for (const key in data) {
      selectList.push(key);
    }

    const formSelect = createAccountsSelect('currency-exchange', selectList, 1);
    const formSelect2 = createAccountsSelect(
      'currency-exchange',
      selectList,
      2,
    );

    formSelectBlock.append(formSelectBlockText, formSelect);
    formSelectBlock2.append(formSelectBlock2Text, formSelect2);
    formLabelSum.append(formLabelSpan, formInputSum);
    form.append(
      formTitle,
      formSelectBlock,
      formSelectBlock2,
      formLabelSum,
      formBtn,
    );

    return form;
  }

  function createChangeRates(data) {
    const changeRates = el('.change-rates');
    const wrapper = el('.change-rates__wrapper');
    const title = el('h3.title-h3.change-rates__title', 'Изменение курсов в реальном времени');

    wrapper.append(title);
    changeRates.append(wrapper);
  }

  return { createYourCurrencies, createExchange };
}

export {
  createAuthorizationDOM,
  createHeaderNavDOM,
  createAccount,
  createAccounts,
  createAccountDetails,
  createHistory,
  createCurrency,
};
