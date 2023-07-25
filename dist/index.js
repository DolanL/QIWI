"use strict";
const currencySelector = document.getElementById('currencySelector');
const currencyIdElem = document.getElementById('currencyId');
const currencyNameElem = document.getElementById('currencyName');
const currencyValueElem = document.getElementById('currencyValue');
const previousCurrencyValueElem = document.getElementById('previousCurrencyValue');
const currencyAbbreviatedName = document.getElementById('currencyAbbreviatedName');
let commonData;
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
        return data;
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}
// Функция для обновления информации о выбранной валюте
function updateCurrencyInfo(currencyValue, data) {
    const currencyInfo = data.Valute[currencyValue];
    console.log(currencyInfo);
    currencyIdElem.textContent = currencyInfo.ID;
    currencyNameElem.textContent = currencyInfo.Name;
    currencyValueElem.textContent = `${formatDate(data.Date)} - ${currencyInfo.Value}`;
    currencyAbbreviatedName.textContent = currencyInfo.CharCode;
    previousCurrencyValueElem.textContent = `${formatDate(data.PreviousDate)} - ${currencyInfo.Previous}`;
}
function formatDate(inputDate) {
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
    const target = event.target;
    updateCurrencyInfo(target.value, commonData);
});
// Запускаем функцию для получения данных с API и создания списка валют
fetchCurrencies().then((data) => {
    commonData = data;
    updateCurrencyInfo(currencySelector.value, commonData);
});
// При первой загрузке страницы выбираем первую валюту из списка и обновляем информацию
currencySelector.selectedIndex = 0;
