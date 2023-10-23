import { el, setChildren, mount } from 'redom';

// открытие модального окна
function openModal(container, modal, overlay) {
  const modalWrapper = el('.modal-wrapper');

  mount(modalWrapper, modal);
  container.append(modalWrapper, overlay);
}

// закрытие модального окна
function closeModal(modalWrapper, overlay) {
  modalWrapper.remove();
  overlay.remove();
}

// создание модального окна для выхода из аккаунта
function createExitModal() {
  const modal = el('.modal.modal-exit');
  const overlay = el('.overlay');
  const text = el('p.modal-exit__text');
  const btnsBlock = el('.modal-exit__btns-block');
  const acceptBtn = el(
    'button#js-modal-accept.modal-exit__btn.modal-exit__accept',
  );
  const refuseBtn = el(
    'button#js-modal-refuse.modal-exit__btn.modal-exit__refuse',
  );

  text.textContent = 'Выйти из аккаунта?';
  acceptBtn.textContent = 'Да';
  refuseBtn.textContent = 'Нет';

  setChildren(btnsBlock, [acceptBtn, refuseBtn]);
  setChildren(modal, [text, btnsBlock]);

  return { modal, overlay };
}

export { openModal, closeModal, createExitModal };
