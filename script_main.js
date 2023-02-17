const searchBar = document.querySelector('.search-bar');
const btnSearch = document.querySelector('.btn-search');
const list = document.querySelector('.user-list');
const spinner = document.querySelector('.spinner-border');
let companyElement;
let companyObj;
function addClass(element, elemnentClass) {
  element.classList.add(elemnentClass);
}

function removeClass(element, elemnentClass) {
  element.classList.remove(elemnentClass);
}

addClass(spinner, 'hidden');

const baseUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com`;
let urlParams = new URLSearchParams(window.location.search);

async function main() {
  removeClass(spinner, 'hidden');

  let searchResult = await getSearchResult();
  searchResult = await getCompanyData(searchResult);
  await renderSearchResult(searchResult);
  addClass(spinner, 'hidden');
}
async function getSearchResult() {
  document.querySelector('.user-list').innerText = '';
  try {
    const response = await fetch(
      `${baseUrl}/api/v3/search?query=${searchBar.value}&limit=10&exchange=NASDAQ`
    );
    let data = await response.json();
    return data;
  } catch (error) {
    throw Error(`error:${error}`);
  }
}
async function getCompanyData(dataArray) {
  for (let i = 0; i < dataArray.length; i++) {
    const response = await fetch(
      `${baseUrl}/api/v3/company/profile/${dataArray[i].symbol}`
    );
    let companyData = await response.json();

    if (Object.keys(companyData).length !== 0) {
      if (companyData.profile.hasOwnProperty('image')) {
        dataArray[i].image = companyData.profile.image;
      } else {
        dataArray[i].image = '';
      }
      if (companyData.profile.hasOwnProperty('image')) {
        dataArray[i].changesPercentage = Number(
          companyData.profile.changesPercentage
        ).toFixed(2);
      } else {
        dataArray[i].percentage = '';
      }
    } else {
      dataArray[i].image = '';
      dataArray[i].percentage = '';
    }
  }
  return dataArray;
}
async function renderSearchResult(dataArray) {
  for (let i = 0; i < dataArray.length; i++) {
    let companyLogo = document.createElement('img');
    companyLogo.src = dataArray[i].image;

    let companyPercentage = document.createElement('span');
    companyPercentage.innerHTML = `<b>(${dataArray[i].changesPercentage}%)</b>`;
    companyPercentage.style.color =
      dataArray[i].changesPercentage < 0 ? 'red' : 'green';

    let listElement = `${dataArray[i].name} (${dataArray[i].symbol})`;

    let aTag = document.createElement('a');
    aTag.target = '_blank';
    aTag.href = `http://127.0.0.1:5500/assignments/Javascript%20Project%202%20-%20Stock%20Exchange/index_company.html?symbol=${dataArray[i].symbol}`;
    aTag.innerHTML = listElement;

    let liTag = document.createElement('li');

    liTag.append(companyLogo);
    liTag.append(aTag);
    liTag.append(companyPercentage);

    const temporaryListContainer = document.createDocumentFragment();

    temporaryListContainer.append(liTag);

    document.querySelector('.user-list').append(temporaryListContainer);
  }
}

btnSearch.addEventListener('click', main);

(async function getMarqueeData() {
  try {
    const response = await fetch(`${baseUrl}/api/v3/quotes/nyse`);
    const data = await response.json();

    for (let i = 0; i < 20; i++) {
      const marqueeElement = data[i];

      createMarqueeElement(marqueeElement);
    }
  } catch (error) {
    throw Error(`error:${error}`);
  }
})();

function createMarqueeElement(marqueeElement) {
  let symbolElement = marqueeElement.symbol;
  let priceElement = marqueeElement.price;
  let marqueeText = document.createElement('span');
  marqueeText.innerHTML = `${symbolElement} <span class="green">${priceElement}<span/>`;
  const temporaryMarqueeContainer = document.createDocumentFragment();
  temporaryMarqueeContainer.append(marqueeText);
  document
    .querySelector('.marquee-comtainer')
    .appendChild(temporaryMarqueeContainer);
}

function setFavicons(favImg) {
  let headTitle = document.querySelector('head');
  let setFavicon = document.createElement('link');
  setFavicon.setAttribute('rel', 'shortcut icon');
  setFavicon.setAttribute('href', favImg);
  headTitle.appendChild(setFavicon);
}
setFavicons('https://cdn-icons-png.flaticon.com/512/3781/3781628.png');
