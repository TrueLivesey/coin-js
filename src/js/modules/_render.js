import { setChildren, mount, el } from 'redom';

function addWrapper() {
  const wrapper = el('.wrapper');
  return wrapper;
}

function createAccountDOM() {
  // DOM
  const account = el('.account');
  const accountForm = el('form#js-account-form.account__form');
  const accountLoginBlock = el('.account__login-block');
  const accountLoginLabel = el('label.account__label');
  const accountLogin = el('input#js-account-login.basic-input.account__login', {
    type: 'text',
  });
  const accountLoginText = el('span.acccount__text');
  const accountPasswordLabel = el('label.account__label', {
    type: 'text',
  });
  const accountPassword = el(
    'input#js-account-password.basic-input.account__password',
  );
  const accountPasswordText = el('span.account__text');
  const accountBtn = el('button.btn.account__btn');
  const accountTitle = el('h2.account__title');

  // filling text fields
  accountTitle.textContent = 'Вход в аккаунт';
  accountLoginText.textContent = 'Логин';
  accountPasswordText.textContent = 'Пароль';
  accountBtn.textContent = 'Войти';

  // mounting
  setChildren(accountLoginLabel, [accountLoginText, accountLogin]);
  setChildren(accountPasswordLabel, [accountPasswordText, accountPassword]);
  setChildren(accountLoginBlock, [accountLoginLabel, accountPasswordLabel]);
  setChildren(accountForm, [accountTitle, accountLoginBlock, accountBtn]);
  mount(account, accountForm);

  return account;
}

export { addWrapper, createAccountDOM };
