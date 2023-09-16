import { el, mount } from 'redom';

// Создание ошибки
function createError(errorText) {
  const error = el('span.account__error');
  error.textContent = errorText;

  if (document.querySelector('.account__error')) {
    document.querySelector('.account__error').remove();
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

// Удаление элемента, если он существует на странице
function elemRemove(elem) {
  if (document.querySelector(`.${elem}`)) {
    document.querySelector(`.${elem}`).remove();
  }
}

export { createError, errorTranslate, elemRemove };
