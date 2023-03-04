'use strict';
class SearchResult {
  constructor(selector) {
    this.elContainer = document.querySelector(selector);
    this.resultList = document.createElement('ul');
    this.resultList.classList.add('result-list');
    this.elContainer.append(this.resultList);
  }

  renderSearchResult(dataArray) {
    this.resultList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < dataArray.length; i++) {
      const companyLogo = document.createElement('img');
      companyLogo.src = dataArray[i].image;

      const companyPercentage = document.createElement('span');
      companyPercentage.innerHTML = `<b>(${dataArray[i].changesPercentage})</b>`;
      companyPercentage.style.color =
        dataArray[i].changesPercentage < 0 ? 'red' : 'green';

      let inputElement = document.getElementById('search-input');

      let listElement = `${dataArray[i].name.replace(
        new RegExp(inputElement.value, 'gi'),
        (match) => `<mark>${match}</mark>`
      )} (${dataArray[i].symbol.replace(
        new RegExp(inputElement.value, 'gi'),
        (match) => `<mark>${match}</mark>`
      )}) `;

      let aTag = document.createElement('a');
      aTag.target = '_blank';
      aTag.href = `./index_company.html?symbol=${dataArray[i].symbol}`;
      aTag.innerHTML = listElement;

      const liTag = document.createElement('li');
      liTag.append(companyLogo);
      companyLogo.onerror = function () {
        this.src =
          ' https://www.clipartmax.com/png/middle/360-3605240_stocks-transparent-background-transparent-stock-icon-png.png';
      };
      liTag.append(aTag);
      liTag.append(companyPercentage);
      fragment.append(liTag);
    }
    this.resultList.append(fragment);
    spinner.classList.add('hidden');
    if (document.getElementById('search-input').value == 0) {
      this.resultList.innerHTML = '';
    }
  }
}
