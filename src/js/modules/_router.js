// libraries
import Navigo from 'navigo';
import { el, setChildren, mount } from 'redom';

// app functions
import { addWrapper, createAccountDOM } from './_render';
import { formValidation } from './_validation';

function initRouting() {
  const router = new Navigo('/');
  const body = window.document.body;

  router.on('/', () => {
    const wrapper = addWrapper();
    const account = createAccountDOM();

    mount(wrapper, account);
    mount(body, wrapper);

    formValidation(
      'js-account-form',
      'js-account-login',
      'js-account-password',
    );
  });
  router.resolve();
}

export { initRouting };
