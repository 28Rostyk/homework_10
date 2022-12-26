import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;
let formValue = '';

const refs = {
  input: document.querySelector('#search-box'),
  countryListUi: document.querySelector('.country-list'),
  countryInfoUi: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.preventDefault();
  formValue = refs.input.value.trim();
  if (formValue === '') {
    clearRender();
    return;
  }
  fetchCountries(formValue)
    .then(countries => {
      if (countries.length === 1) {
        clearRender();
        renderCountryListUi(countries);
        renderCountryInfoUi(countries);
      } else if (countries.length > 1 && countries.length <= 10) {
        clearRender();
        renderCountryListUi(countries);
      } else if (countries.length > 10) {
        clearRender();
        Notify.info(
          'Too many mathces found. Please enter a more spesific name',
          {
            timeout: 100,
            cssAnimationDuration: 1000,
          }
        );
      }
    })
    .catch(error => {
      clearRender();
      Notify.failure('Oops, there is no country with that name', {
        timeout: 100,
        cssAnimationDuration: 1000,
      });
    });
}

function renderCountryListUi(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-item">
      <img class='country-img' src="${country.flags.svg}" alt="flag">
      <p class="country-name">${country.name.official}</p>
    </li>`;
    })
    .join('');
  refs.countryListUi.insertAdjacentHTML('beforeend', markup);
}
function renderCountryInfoUi(countries) {
  const langs = countries.map(({ languages }) =>
    Object.values(languages).join(', ')
  );
  const markup = countries
    .map(country => {
      return `<p class="info-text">Capital: <span class="value">${country.capital}</span></p>
      <p class="info-text">Population: <span class="value">${country.population}</span></p>
      <p class="info-text">languages: <span class="value">${langs}</span></p>`;
    })
    .join('');
  refs.countryInfoUi.insertAdjacentHTML('beforeend', markup);
}

function clearRender() {
  refs.countryListUi.innerHTML = '';
  refs.countryInfoUi.innerHTML = '';
}
