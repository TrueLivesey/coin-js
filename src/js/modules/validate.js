import JustValidate from 'just-validate';
import { el } from 'redom';
import { elemRemove } from './functions';

function formValidation(form = null, login = null, password = null) {
  const validation = new JustValidate(`#${form}`, {
    lockForm: true,
    validateBeforeSubmitting: true,
    errorFieldStyle: {
      backgroundColor: 'rgba(255, 105, 114, 1)', // red input
    },
    successFieldStyle: {
      backgroundColor: 'rgba(184, 236, 100, 1)', // green input
    },
  });

  validation
    .addField(`#${login}`, [
      {
        rule: 'required',
        errorMessage: 'Вы не ввели логин',
      },
      {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Недостаточное количество символов',
      },
      {
        rule: 'maxLength',
        value: 30,
        errorMessage: 'Вы ввели больше, чем положено',
      },
    ])
    .addField(`#${password}`, [
      {
        rule: 'required',
        errorMessage: 'Вы не ввели пароль',
      },
      {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Недостаточное количество символов',
      },
      {
        rule: 'maxLength',
        value: 30,
        errorMessage: 'Вы ввели больше, чем положено',
      },
    ]);
}

function accountFormValidation(number, amount) {
  function createError(message, additionalClass = null) {
    let error = null;
    if (additionalClass === null) {
      error = el('p.account-error');
    } else {
      error = el(`p.account-error.${additionalClass}`);
    }

    error.textContent = message;

    return error;
  }

  let numberStatus = false;
  let amountStatus = false;
  let error = null;

  if (!document.querySelector('.account-select__placeholder--black')) {
    if (
      !number.parentElement.nextElementSibling.classList.contains(
        'account-error',
      )
    ) {
      error = createError('Счёт не выбран');
      number.parentElement.after(error);
    }
  } else {
    numberStatus = true;
  }

  if (amount.value.length === 0 || parseInt(amount.value) === 0) {
    if (
      !amount.parentElement.nextElementSibling.classList.contains(
        'account-error',
      )
    ) {
      error = createError('Сумма не введена', 'account-error-amount');
      amount.parentElement.after(error);
    }
  } else if (amount.value.length > 20) {
    if (
      !amount.parentElement.nextElementSibling.classList.contains(
        'account-error',
      )
    ) {
      error = createError('Максимальное количество символов: 20');
      amount.parentElement.after(error);
    }
  } else {
    // elemRemove('account-error');
    if (
      amount.parentElement.nextElementSibling.classList.contains(
        'account-error',
      )
    ) {
      amount.parentElement.nextElementSibling.remove();
    }
    amountStatus = true;
  }

  if (numberStatus && amountStatus) {
    return true;
  } else {
    return false;
  }
}

export { formValidation, accountFormValidation };
