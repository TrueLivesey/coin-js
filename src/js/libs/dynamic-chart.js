import { Chart } from 'chart.js/auto';
import { MonthArray } from '../const';

async function createDynamicChart(data, mode) {
  const transactions = data.transactions;
  const currentDate = new Date();
  const monthlyExpenses = {};
  const monthsAgoDate = new Date();
  let chartData = [];
  let lastMonths = 12;

  if (mode === 'six') {
    monthsAgoDate.setMonth(currentDate.getMonth() - 5); // 6 месяцев назад
  } else if (mode === 'twelve') {
    monthsAgoDate.setMonth(currentDate.getMonth());
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
    if (mode === 'six') {
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
        month: MonthArray[month - 1],
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

async function drawChart(data, id) {
  // Плагин для обводки
  const chartAreaBorder = {
    id: 'chartAreaBorder',
    beforeDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { top, bottom, left, right, width, height },
      } = chart;
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(23, 23, 23, 1)';
      ctx.moveTo(left + 2, top);
      ctx.lineTo(right, top);
      ctx.lineTo(right, bottom);
      ctx.lineTo(left + 2, bottom);
      ctx.closePath();
      ctx.stroke();
    },
  };

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
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'rgba(23, 23, 23, 1)',
            font: {
              family: "'Noto Sans', sans-serif",
              size: 14,
              weight: 'bold',
            },
          },
        },
        y: {
          position: 'right',
          ticks: {
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
        },
      },
    },
    plugins: [chartAreaBorder],
  });

  // Скрываем легенду
  chartInstance.options.plugins.legend.display = false;
  chartInstance.update();
}

export { createDynamicChart, drawChart };
