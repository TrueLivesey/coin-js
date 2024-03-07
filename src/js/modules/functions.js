import { el, mount } from 'redom';

// Создание ошибки
function createError(errorText) {
  const error = el('span.authorization__error');
  error.textContent = errorText;

  if (document.querySelector('.authorization__error')) {
    document.querySelector('.authorization__error').remove();
  }

  return error;
}

// Переевод ошибки на русский язык
function errorTranslate(error) {
  if (error === 'Invalid password') {
    return {
      errorProblem: 'password',
      errorText: 'Неверный пароль',
    };
  } else if (error === 'No such user') {
    return {
      errorProblem: 'user',
      errorText: 'Пользователя с таким именем не существует',
    };
  }
}

// Сортировка счетов пользователя
function accountSort(field, method, reverse = false) {
  const accountList = field.querySelectorAll('.account');
  const accountArr = Array.from(accountList);
  let numberArr = [];
  let balanceArr = [];
  let dateArr = [];
  let accountArrSort = null;

  accountArr.forEach((account) => {
    numberArr.push(account.dataset.number);
    balanceArr.push(account.dataset.balance);
    dateArr.push(account.dataset.lastTransaction);
  });

  function sortNumber(reverseStatus = false) {
    if (!reverseStatus) {
      accountArrSort = accountArr.sort((a, b) => {
        return a.dataset.number - b.dataset.number;
      });
    } else {
      accountArrSort = accountArr.sort((a, b) => {
        return b.dataset.number - a.dataset.number;
      });
    }
  }

  function sortBalance(reverseStatus = false) {
    if (!reverseStatus) {
      accountArrSort = accountArr.sort((a, b) => {
        return a.dataset.balance - b.dataset.balance;
      });
    } else {
      accountArrSort = accountArr.sort((a, b) => {
        return b.dataset.balance - a.dataset.balance;
      });
    }
  }

  function sortTransaction(reverseStatus = false) {
    if (!reverseStatus) {
      accountArrSort = accountArr.sort((a, b) => {
        return a.dataset.lastTransaction - b.dataset.lastTransaction;
      });
    } else {
      accountArrSort = accountArr.sort((a, b) => {
        return b.dataset.lastTransaction - a.dataset.lastTransaction;
      });
    }
  }

  if (method === 'number' && reverse === false) {
    sortNumber();
  } else if (method === 'number' && reverse === true) {
    sortNumber(true);
  } else if (method === 'balance' && reverse === false) {
    sortBalance();
  } else if (method === 'balance' && reverse === true) {
    sortBalance(true);
  } else if (method === 'transaction' && reverse === false) {
    sortTransaction();
  } else if (method === 'transaction' && reverse === true) {
    sortTransaction(true);
  }

  return accountArrSort;
}

// Удаление элемента, если он существует на странице
function elemRemove(className) {
  if (document.querySelector(`.${className}`)) {
    document.querySelector(`.${className}`).remove();
  }
}

// Удаление класса
function removeClass(elem, className) {
  if (elem && elem.classList.contains(className)) {
    elem.classList.remove(className);
  }
}

export { createError, errorTranslate, accountSort, elemRemove, removeClass };
