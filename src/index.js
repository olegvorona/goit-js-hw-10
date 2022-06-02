import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;

const refs = {
    searchInput: document.querySelector('input#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onSearch,DEBOUNCE_DELAY));


function onSearch(event) {
    event.preventDefault();

    const searchQuery = event.target.value.trim()
    if (searchQuery === '') {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        return;
    } else {
        return fetchCountries(searchQuery)
            .then(countries => renderCountries(countries))
            .catch(error => {
                Notify.failure('Oops, there is no country with that name');
                console.log(error);
            });
    }

    
}

function renderCountries(countries) {
    if (countries.length > 10) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        return Notify.info('Too many matches found. Please enter a more specific name.')
    };

    if (countries.length > 1 && countries.length <= 10) {
        const abbreviatedMarkup = countries.map(({ name, flags }) => {
        return `<li><img src="${flags.svg}" width="60" /> ${name.official}</li>`;
        }).join('')
        refs.countryList.innerHTML = abbreviatedMarkup;
        refs.countryInfo.innerHTML = '';
    }

    if (countries.length === 1) {
    const fullMarkup = countries.map(({ name, flags, capital, population, languages }) => {
        return `<li><img src="${flags.svg}" width="50" /> ${name.official}</li>
        <p> Capital: <span>${capital}</span></p>
        <p> Population: <span>${population}</span></p>
        <p> Languages: <span>${Object.values(languages)}</span></p>`;
    }).join('');
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = fullMarkup;
    }
}


