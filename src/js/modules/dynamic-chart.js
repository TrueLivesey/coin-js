import { Chart } from 'chart.js/auto';
import { MonthArray } from '../const';

let months = [];

async function createDynamicChart(data, mode) {
  const transactions = data.transactions;
  const currentDate = new Date();
  const monthlyExpenses = {};
  const monthsAgoDate = new Date();
  let chartData = [];
  let lastMonths = 12;

  if (mode === 6) {
    // страница счёта
    // Обрезаем названия месяцев до 3 символов (авг, сен, окт)
    months = MonthArray.map((month) => {
      return month.slice(0, 3);
    });

    monthsAgoDate.setMonth(currentDate.getMonth() - 5); // 6 месяцев назад
  } else if (mode === 12) {
    // страница истории счёта
    months = MonthArray;
    monthsAgoDate.setMonth(currentDate.getMonth() - 11); // 12 месяцев назад
  }

  // Фильтруем записи о затратах, чтобы оставить только те, которые произошли в
  // течение последних 12 месяцев
  const last12MonthsExpenses = transactions.filter((transaction) => {
    const expenseDate = new Date(transaction.date);
    return expenseDate >= monthsAgoDate && expenseDate <= currentDate;
  });

  // Проходимся по каждой записи о затратах
  last12MonthsExpenses.forEach((transaction) => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // Формируем строку вида "MM-YYYY" для идентификации месяца
    const monthKey = `${month}-${year}`;

    // Если запись о затратах для данного месяца уже существует, добавляем к
    // ней сумму
    if (monthlyExpenses[monthKey]) {
      monthlyExpenses[monthKey] += transaction.amount;
    } else {
      // Иначе создаем новую запись о затратах для данного месяца
      monthlyExpenses[monthKey] = transaction.amount;
    }
  });

  // Создаем массив с последними 6-ю месяцами chartData
  if (monthlyExpenses) {
    if (mode === 6) {
      lastMonths = 6;
    }

    for (let i = 0; i < lastMonths; ++i) {
      const date = new Date();
      date.setMonth(monthsAgoDate.getMonth() + i);
      let year = date.getFullYear();
      if (date.getMonth() < monthsAgoDate.getMonth()) {
        year -= 1;
      }

      const month = date.getMonth() + 1;
      const monthKey = `${month}-${year}`;

      const amount = monthlyExpenses[monthKey]
        ? monthlyExpenses[monthKey].toFixed(2)
        : 0;

      chartData.push({
        month: months[month - 1],
        amount: amount,
      });
    }

    return chartData;
  } else {
    return {
      error: 0,
      errorMessage: 'Нет данных за последние 6 месяцев',
    };
  }
}

// Плагин для обводки
const chartAreaBorder = {
  id: 'chartAreaBorder',
  beforeDraw(chart, args, options) {
    const {
      ctx,
      chartArea: { top, bottom, left, right },
    } = chart;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(23, 23, 23, 1)';
    ctx.moveTo(left - 18, top);
    ctx.lineTo(right + 18, top);
    ctx.lineTo(right + 18, bottom);
    ctx.lineTo(left - 18, bottom);
    ctx.closePath();
    ctx.stroke();
  },
};

// Основной график (синий)
async function drawChart(data, id, width) {
  const chartElement = document.getElementById(id);
  const maxY = Math.max(...data.map((row) => row.amount));

  // Инициализация Chart.js
  const chartInstance = new Chart(document.getElementById(id), {
    type: 'bar',
    data: {
      labels: data.map((row) => row.month),
      datasets: [
        {
          data: data.map((row) => row.amount),
          backgroundColor: 'rgba(72, 117, 230, 1)',
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 20,
        },
      },
      scales: {
        x: {
          ticks: {
            color: 'rgba(23, 23, 23, 1)',
            font: {
              family: "'Noto Sans', sans-serif",
              size: 14,
              weight: 'bold',
            },
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          max: maxY,
          position: 'right',
          ticks: {
            padding: 20,
            beginAtZero: true,
            maxTicksLimit: 2,
            color: 'rgba(23, 23, 23, 1)',
            font: {
              family: "'Noto Sans', sans-serif",
              size: 14,
              weight: 'bold',
            },
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
      },
    },
    plugins: [chartAreaBorder],
  });

  // Устанавливаем высоту графика
  chartElement.style.height = `${width}px`;

  // Скрываем легенду
  chartInstance.options.plugins.legend.display = false;
  chartInstance.update();
}

// График с разницей в суммах
async function createDynamicChartRatio(data) {
  const transactions = data.transactions;
  const currentDate = new Date();
  const monthlyIncoming = {};
  const monthlyOutgoing = {};
  const monthsAgoDate = new Date();
  monthsAgoDate.setMonth(currentDate.getMonth() - 11);
  let chartData = [];
  let lastMonths = 12;

  // Фильтруем записи о затратах, чтобы оставить только те, которые произошли в
  // течение последних 12 месяцев
  const last12MonthsTransactions = transactions.filter((transaction) => {
    const expenseDate = new Date(transaction.date);
    return expenseDate >= monthsAgoDate && expenseDate <= currentDate;
  });

  // Проходимся по каждой записи о транзакции
  last12MonthsTransactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // Формируем строку вида "MM-YYYY" для идентификации месяца
    const monthKey = `${month}-${year}`;

    // Если транзакция входящая, добавляем сумму в monthlyIncoming
    if (transaction.to === data.account) {
      if (monthlyIncoming[monthKey]) {
        monthlyIncoming[monthKey] += transaction.amount;
      } else {
        monthlyIncoming[monthKey] = transaction.amount;
      }
    }

    // Если транзакция исходящая, добавляем сумму в monthlyOutgoing
    if (transaction.from === data.account) {
      if (monthlyOutgoing[monthKey]) {
        monthlyOutgoing[monthKey] += transaction.amount;
      } else {
        monthlyOutgoing[monthKey] = transaction.amount;
      }
    }
  });

  // Создание массива данных за последний год
  for (let i = 0; i < lastMonths; ++i) {
    const date = new Date();
    date.setMonth(monthsAgoDate.getMonth() + i);
    let year = date.getFullYear();
    if (date.getMonth() < monthsAgoDate.getMonth()) {
      year -= 1;
    }

    const month = date.getMonth() + 1;
    const monthKey = `${month}-${year}`;

    const incomingAmount = monthlyIncoming[monthKey]
      ? monthlyIncoming[monthKey].toFixed(2)
      : 0;
    const outgoingAmount = monthlyOutgoing[monthKey]
      ? monthlyOutgoing[monthKey].toFixed(2)
      : 0;

    chartData.push({
      month: months[month - 1],
      incomingAmount: incomingAmount,
      outgoingAmount: outgoingAmount,
    });

    console.log(chartData);
  }

  return chartData;
}

// График с соотношением расходов и доходов (зелено-красный)
async function drawChartRatio(data, id, width) {
  const chartElement = document.getElementById(id);
  let maxY = Math.max(...data.map((row) => row.incomingAmount));
  let minY = -Math.max(...data.map((row) => row.outgoingAmount));

  // Инициализация Chart.js
  const chartInstance = new Chart(chartElement, {
    type: 'bar',
    data: {
      labels: data.map((row) => row.month),
      datasets: [
        {
          label: 'Outgoing Amount',
          data: data.map((row) => row.outgoingAmount),
          backgroundColor: 'rgba(255, 99, 132, 1)',
          stack: 'combined',
        },
        {
          label: 'Incoming Amount',
          data: data.map((row) => row.incomingAmount),
          backgroundColor: 'rgba(118, 202, 102, 1)',
          stack: 'combined',
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 20,
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            backdropPadding: 0,
            color: 'rgba(23, 23, 23, 1)',
            font: {
              family: "'Noto Sans', sans-serif",
              size: 14,
              weight: 'bold',
            },
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          offset: true,
        },
        y: {
          max: maxY,
          beginAtZero: true,
          position: 'right',
          ticks: {
            padding: 20,
            maxTicksLimit: 2,
            color: 'rgba(23, 23, 23, 1)',
            font: {
              family: "'Noto Sans', sans-serif",
              size: 14,
              weight: 'bold',
            },
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        offset: false,
      },
    },
    plugins: [chartAreaBorder],
  });

  // Устанавливаем высоту графика
  chartElement.style.height = `${width}px`;

  // Скрываем легенду
  chartInstance.options.plugins.legend.display = false;
  chartInstance.update();
}

export {
  createDynamicChart,
  createDynamicChartRatio,
  drawChartRatio,
  drawChart,
};
