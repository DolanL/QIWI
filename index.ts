const currencySelector: HTMLSelectElement = document.getElementById('currencySelector') as HTMLSelectElement;
const currencyIdElem: HTMLSpanElement = document.getElementById('currencyId') as HTMLSpanElement;
const currencyNameElem: HTMLSpanElement = document.getElementById('currencyName') as HTMLSpanElement;
const currencyValueElem: HTMLSpanElement = document.getElementById('currencyValue') as HTMLSpanElement;
const previousCurrencyValueElem: HTMLSpanElement = document.getElementById('previousCurrencyValue') as HTMLSpanElement;
const currencyAbbreviatedName: HTMLSpanElement = document.getElementById('currencyAbbreviatedName') as HTMLSpanElement;


interface CurrencyData {
  Valute: {
    [key: string]: {
      ID: string;
      Name: string;
      CharCode: string;
      Value: number;
      Previous: number;
    };
  };
  Date: string;
  PreviousDate: string;
  PreviousURL: string,
  "Timestamp": string,
}

let commonData: CurrencyData
// Функция для получения данных с API и создания списка валют в селекторе
async function fetchCurrencies() {
  try {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const data = await response.json();
    const currencies = data.Valute;

    for (const currency in currencies) {
      const option = document.createElement('option');
      option.value = currency;
      option.textContent = `${currencies[currency].ID} - ${currencies[currency].Name}`;
      currencySelector.appendChild(option);
    }

    return data
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Функция для обновления информации о выбранной валюте
function updateCurrencyInfo(currencyValue: string, data: CurrencyData) {
  const currencyInfo = data.Valute[currencyValue];
  console.log(currencyInfo)

  currencyIdElem.textContent = currencyInfo.ID
  currencyNameElem.textContent = currencyInfo.Name
  currencyValueElem.textContent = `${formatDate(data.Date)} - ${currencyInfo.Value}`;
  currencyAbbreviatedName.textContent = currencyInfo.CharCode
  previousCurrencyValueElem.textContent = `${formatDate(data.PreviousDate)} - ${currencyInfo.Previous}`
}

function formatDate(inputDate: string) {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}


// Обработчик события при выборе валюты из списка
currencySelector.addEventListener('change', (event) => {
  const target = event.target as HTMLSelectElement;
  updateCurrencyInfo(target.value, commonData as CurrencyData);
});

// Запускаем функцию для получения данных с API и создания списка валют
fetchCurrencies().then((data) => {
  commonData = data
  updateCurrencyInfo(currencySelector.value, commonData as CurrencyData);
})

// При первой загрузке страницы выбираем первую валюту из списка и обновляем информацию
currencySelector.selectedIndex = 0;

