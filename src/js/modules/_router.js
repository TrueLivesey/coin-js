// libraries
import Navigo from 'navigo';
import { el, setChildren, mount } from 'redom';

// app functions
import { addWrapper, createAccountDOM } from './_render';

function initRouting() {
  const router = new Navigo('/');
  const body = window.document.body;

  router.on('/', () => {
    const account = createAccountDOM().account;
    const wrapper = addWrapper();

    mount(wrapper, account);
    mount(body, wrapper);
  });
  router.resolve();
}

export { initRouting };
