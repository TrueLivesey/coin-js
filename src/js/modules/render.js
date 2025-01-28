// библиотеки
import { setChildren, mount, el, svg } from 'redom';

// функции приложения
import { Icons } from '../const';
import { accountSort, elemRemove, removeClass } from './functions';
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
      selectPlaceholder.classList.add(
        'account-select__placeholder--black',
        'account-select__placeholder-active',
      );
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

// Создание строки для таблицы в истории переводов
function createHistoryTr(userData, transaction, i = null) {
  const tr = el('tr.account-table__tr');
  const sendersAccount = el('td.account-table__td', `${transaction.from}`);
  const recipientsAccount = el('td.account-table__td', `${transaction.to}`);
  const amount = el('td.account-table__td', `${transaction.amount}`);
  const dateObj = new Date(transaction.date);
  const date = el(
    'td.account-table__td',
    `${dateObj.getDate().toString().padStart(2, '0')}.${(dateObj.getMonth() + 1)
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

  if (i && i >= 10) {
    tr.classList.add('is-hidden');
  }

  i++;
  tr.append(sendersAccount, recipientsAccount, amount, date);

  return tr;
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

  const dataTransactions = data.transactions.reverse();
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

  dataTransactions.forEach((transaction) => {
    const tr = createHistoryTr(userData, transaction, i);

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
      const paramProp = el('.span.your-currencies-param__prop', `${key}`);
      const paramValue = el(
        'span.your-currencies-param__value',
        `${data[key].amount}`,
      );

      paramValue.dataset.code = key;

      param.append(paramValue, paramProp);
      item.append(param);
      list.append(item);
    }

    wrapper.append(title, list);

    return wrapper;
  }

  // Форма с обменом валют
  function createExchange(data) {
    let selectList = [];
    const form = el('form.exchange-form');
    const formContent = el('.exchange-form__content');
    const formTitle = el('h3.title-h3.exchange__title', 'Обмен валюты');
    const formSelectBlock = el('.exchange-form__text-block');
    const formSelectBlock2 = el('.exchange-form__text-block');
    const formSelectBlockText = el('span.exchange-form__text', 'Из');
    const formSelectBlock2Text = el('span.exchange-form__text', 'В');
    const formBtn = el('input#js-exchange-btn.exchange-form__btn', {
      type: 'submit',
      value: 'Обменять',
    });
    const formLabelSum = el('label.exchange-form__label');
    const formInputSum = el('input#js-exchange-sum.exchange-form__input', {
      type: 'number',
      min: '0',
      onkeypress: 'return event.charCode >= 48 && event.charCode <= 57',
      placeholder: 'введите сумму',
    });
    const formLabelSpan = el('span.exchange-form__text', 'Сумма');

    // Ввод только чисел (запрещается + и -, но "e" остается)
    formInputSum.addEventListener('keydown', (e) => {
      if (e.key === '-' || e.key === '+') {
        e.preventDefault();
      }

      elemRemove('error');
    });

    for (const key in data) {
      selectList.push(key);
    }

    const formSelect = createAccountsSelect('currency-exchange', selectList, 1);
    const formSelect2 = createAccountsSelect(
      'currency-exchange',
      selectList,
      2,
    );

    formSelect.id = 'js-exchange-from';
    formSelect2.id = 'js-exchange-to';

    formSelectBlock.append(formSelectBlockText, formSelect);
    formSelectBlock2.append(formSelectBlock2Text, formSelect2);
    formLabelSum.append(formLabelSpan, formInputSum);
    formContent.append(
      formSelectBlock,
      formSelectBlock2,
      formLabelSum,
      formBtn,
    );
    form.append(formTitle, formContent);

    return form;
  }

  // Форма с изменением курсов валют в реальном времени
  function createChangeRates() {
    const changeRates = el('#js-change-rates.change-rates');
    const content = el('.change-rates__content');
    const title = el(
      'h3.title-h3.change-rates__title',
      'Изменение курсов в реальном времени',
    );
    const list = el('ul#js-change-rates-list.change-rates__list');

    content.append(list);
    changeRates.append(title, content);

    return changeRates;
  }

  // Создание нового элемента li для курсов валют
  function createChangeRatesItem(data, mode) {
    const item = el('li.change-rates__item');
    const param = el('.change-rates-param');
    const value = el('span.change-rates-param__value', data.rate);
    const prop = el('.change-rates-param__prop');
    const text = el('span.change-rates-param__text', `${data.from}/${data.to}`);

    mode === 1 ? param.classList.add('green') : param.classList.add('red');

    prop.append(text);
    param.append(value, prop);
    item.append(param);

    return item;
  }

  return {
    createYourCurrencies,
    createExchange,
    createChangeRates,
    createChangeRatesItem,
  };
}

// Инициализация сокета (возвращает функцию для обработчика сокета)
function initSocket() {
  const onMessageHandler = (event) => {
    let changeRatesList = document.querySelector('#js-change-rates-list');
    let changeRatesChildren = Array.from(changeRatesList.children);
    const socketData = JSON.parse(event.data);

    if (socketData) {
      // Созданный DOM-элемент курса валют (условно BTC/GBP.....25)
      const item = createCurrency().createChangeRatesItem(
        socketData,
        socketData.change,
      );

      if (changeRatesChildren.length === 0) {
        changeRatesList.append(item);
        return;
      }

      // Сортировка
      const paramText = `${socketData.from}/${socketData.to}`;
      const paramTextPrefix = socketData.from;
      let isInserted = false;

      // Поиск полного совпадения названия валют, чтобы обновить
      // существующий DOM-элемент
      const isMatch = changeRatesChildren.find(
        (e) =>
          e.querySelector('.change-rates-param__text').textContent ===
          paramText,
      );

      if (isMatch) {
        const valueEl = isMatch.querySelector('.change-rates-param__value');
        const param = valueEl.parentElement;
        const paramClass = param.classList[1];

        if (socketData.change === -1) {
          console.log(valueEl.parentElement.classList[1]);
          console.log(param);
        }

        if (socketData.change === 1 && paramClass === 'red') {
          param.classList.remove(paramClass);
          param.classList.add('green');
        } else if (socketData.change === -1 && paramClass === 'green') {
          param.classList.remove(paramClass);
          param.classList.add('red');
        }

        valueEl.innerHTML = socketData.rate;
        isInserted = true;

        return;
      }

      // Проходим по всем DOM-элементам и сравниваем их с созданным
      for (let itemEl of changeRatesChildren) {
        const paramItemEl = itemEl.querySelector('.change-rates-param__text');
        const paramTextEl = paramItemEl.textContent;
        const paramTextElPrefix = paramTextEl.slice(0, 3);

        if (paramTextPrefix === paramTextElPrefix) {
          itemEl.after(item);
          isInserted = true;
          break;
        }
      }

      // Если не найдено совпадений, добавляем новый элемент в конец списка
      if (!isInserted) {
        changeRatesList.append(item);
      }
    }
  };

  return onMessageHandler;
}

export {
  createAuthorizationDOM,
  createHeaderNavDOM,
  createAccount,
  createAccounts,
  createAccountDetails,
  createHistoryTr,
  createHistory,
  createCurrency,
  initSocket,
};
