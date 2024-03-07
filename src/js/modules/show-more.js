import { removeClass } from './functions';

export function showMore(
  container,
  elems,
  showBtn,
  itemsAmount,
  countAmount,
  mode,
) {
  const elemsLength = elems.length;
  let items = itemsAmount;
  let count = countAmount;

  if (mode === 'not-hidden') {
    if (elemsLength > itemsAmount) {
      for (let i = itemsAmount + 1; i < elemsLength; ++i) {
        elems[i].classList.add('is-hidden');
      }
    }
  }

  showBtn.addEventListener('click', () => {
    items += count;
    const elemsArray = Array.from(container.children);
    const visibleItems = elemsArray.slice(0, items);

    visibleItems.forEach((e) => removeClass(e, 'is-hidden'));

    if (visibleItems.length === elemsLength) {
      showBtn.classList.add('is-hidden');
    }
  });
}
