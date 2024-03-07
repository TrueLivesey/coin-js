import { svg } from 'redom';

const END_POINT = `http://localhost:3000`;
const WS_END_POINT = `ws://localhost:3000`;

const RequestMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const MonthArray = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const Icons = {
  selectArrow: svg(
    'svg',
    { width: 10, height: 5 },
    svg('use', { xlink: { href: 'images/sprite.svg#select-arrow' } }),
  ),

  accountSelectArrow: svg(
    'svg',
    { width: 10, height: 5 },
    svg('use', { xlink: { href: '../images/sprite.svg#select-arrow' } }),
  ),

  emailIcon: svg(
    'svg',
    { width: 20, height: 16 },
    svg('use', { xlink: { 'xlink:href': 'images/sprite.svg#btn-email' } }),
  ),

  accountEmailIcon: svg(
    'svg',
    { width: 20, height: 16 },
    svg('use', { xlink: { 'xlink:href': '../images/sprite.svg#btn-email' } }),
  ),

  plus: svg(
    'svg',
    { width: 20, height: 16 },
    svg('use', { xlink: { href: 'images/sprite.svg#plus' } }),
  ),
};

export { END_POINT, WS_END_POINT, Icons, RequestMethod, MonthArray };
