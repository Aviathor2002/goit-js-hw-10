import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetch';

const DEBOUNCE_DELAY = 300;

const search = document.querySelector('#search-box');
const countryInfoList = document.querySelector(`.country-list`);
const oneCountryInfoCard = document.querySelector('.country-info');

search.addEventListener('input', debounce(onInputText, DEBOUNCE_DELAY));

function onInputText() {
  countryInfoList.innerHTML = '';
  oneCountryInfoCard.innerHTML = '';

  const searchCuntry = search.value.trim();

  reviseWritingCountry(searchCuntry);
  reviseCountCountriesRender(searchCuntry);
}

function reviseWritingCountry(country) {
    if (!country) {
        return Notify.failure('Oops, there is no country with that name');
      }
      
  if (search.value.length === 0) {
    return Notify.info('Please start entering some country for searching');
  }
}


function reviseCountCountriesRender(country) {
  fetchCountries(country)
    .then(data => {
      if (data.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        return renderCountryCards(data);
      } else {
        return renderOneCountryCard(data);
      }
    })
    .catch(error => console.log(error));
}

function renderOneCountryCard(country) {
  oneCountryInfoCard.innerHTML = '';

  const card = country.map(
    ({ name, capital, population, flags, languages }) => {
      return `<img class='big_img' src="${flags.svg}" alt="flag">
        <h1 >${name.official}</h1>
        <P><span class="title">Capital:</span> ${capital}</P>
        <P><span class="title">Population:</span> ${population}</P>
        <P><span class="title">Languages:</span> ${Object.values(
          languages
        )}</P>`;
    }
  );
  oneCountryInfoCard.insertAdjacentHTML('beforeend', card.join(''));
}

function renderCountryCards(countries) {
  countryInfoList.innerHTML = '';

  const cards = countries.map(({ name, flags }) => {
    return ` <li class="item" >
    <img src="${flags.svg}" alt="flag">
    <p>${name.official}</p>
  </li>`;
  });
  countryInfoList.insertAdjacentHTML('beforeend', cards.join(''));
}
