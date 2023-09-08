import JustValidate from 'just-validate';

function formValidation(form = null, login = null, password = null) {
  const validation = new JustValidate(`#${form}`, {
    errorFieldStyle: {
      backgroundColor: 'rgba(255, 105, 114, 1)', // red_input
    },
    successFieldStyle: {
      backgroundColor: 'rgba(184, 236, 100, 1)', // green_input
    },
    validateBeforeSubmitting: true,
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

export { formValidation };
