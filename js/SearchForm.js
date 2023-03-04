'use strict';
class SearchForm {
  constructor(selector) {
    this.elContainer = document.querySelector(selector);
  }
  debounce(func, delay) {
    let timerId;

    return function () {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func();
      }, delay);
    };
  }

  onSearch(searchResultFunc) {
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.placeholder = 'Search';
    this.inputElement.id = 'search-input';

    this.searchBtn = document.createElement('button');
    this.searchBtn.textContent = 'Search';
    this.searchBtn.id = 'search-btn';

    this.spinner = document.createElement('div');
    this.spinner.classList.add('spinner-border');
    this.spinner.id = 'spinner';
    this.spinner.classList.add('hidden');

    this.resultList = document.createElement('ul');
    this.resultList.classList.add('result-list');

    this.elContainer.append(this.inputElement, this.searchBtn, this.spinner);

    document.querySelector('.results-container').append(this.resultList);

    this.inputElement.addEventListener(
      'input',
      this.debounce(() => {
        this.getSearchResult(searchResultFunc);
      }, 400)
    );

    this.searchBtn.addEventListener('click', () => {
      this.getSearchResult(searchResultFunc);
    });
  }

  async getSearchResult(searchResultFunc) {
    this.resultList.innerHTML = '';

    this.spinner.classList.remove('hidden');

    try {
      const response = await fetch(
        `${baseUrl}/api/v3/search?query=${this.inputElement.value}&limit=10&exchange=NASDAQ`
      );

      if (!response.ok) {
        throw new Error('Unable to fetch search results.');
      }

      const data = await response.json();
      const results = await this.getCompanyData(data);

      searchResultFunc(results);
    } catch (error) {
      console.error(error);
      this.resultList.innerHTML = `<b>An error occurred while fetching the data.</b>`;
    }
  }

  async getCompanyData(dataArray) {
    const promisesArray = dataArray.map((company) => {
      return fetch(`${baseUrl}/api/v3/company/profile/${company.symbol}`);
    });

    const responses = await Promise.all(promisesArray);
    let newData = await Promise.all(
      responses.map((response) => {
        return response.json();
      })
    );

    for (let i = 0; i < dataArray.length; i++) {
      if (Object.keys(newData[i]).length > 0) {
        dataArray[i].image = newData[i].profile.image;
        dataArray[i].changesPercentage = Number(
          newData[i].profile.changesPercentage
        ).toFixed(2);
      } else {
        dataArray[i].image =
          ' https://www.clipartmax.com/png/middle/360-3605240_stocks-transparent-background-transparent-stock-icon-png.png';
        dataArray[i].changesPercentage = '-';
      }
    }

    if (dataArray.length === 0) {
      this.spinner.classList.add('hidden');
      this.resultList.innerHTML = `<b>No results found.</b>`;
    }

    return dataArray;
  }
}
