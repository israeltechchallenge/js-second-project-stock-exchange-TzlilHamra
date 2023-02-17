let urlParams = new URLSearchParams(window.location.search);
let symbol = urlParams.get('symbol'); // "edit"

let baseUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com`;

(async function main() {
  let companyProfile = await getCompanyProfile();
  renderCompanyProfile(companyProfile);

  let stockPrice = await getStockPrice();
  renderChart(stockPrice);
})();
async function getCompanyProfile() {
  try {
    const response = await fetch(`${baseUrl}/api/v3/company/profile/${symbol}`);
    let data = await response.json();
    return data;
  } catch (error) {
    throw Error(`error:${error}`);
  }
}
async function renderCompanyProfile(data) {
  let companyImg = document.querySelector('.company-image');
  companyImg.src = data.profile.image;

  let companyName = document.querySelector('.company-name');
  companyName.text = data.profile.companyName;
  companyName.href = data.profile.website;

  let companydescription = (document.querySelector('.description').innerHTML =
    data.profile.description);

  let stockPrice = document.querySelector('.stock-price');
  stockPrice.innerText = data.profile.price;

  let percentagesChanges = document.querySelector('.percentages-changes');
  let companypercentagesChanges = Number(
    data.profile.changesPercentage
  ).toFixed(2);
  percentagesChanges.innerText = `(${companypercentagesChanges}%)`;
  percentagesChanges.style.color =
    data.profile.changesPercentage < 0 ? 'red' : 'green';
}

async function getStockPrice() {
  try {
    const response = await fetch(
      `${baseUrl}/api/v3/historical-price-full/${symbol}?serietype=line`
    );
    let data = await response.json();
    return data;
  } catch (error) {
    throw Error(`error:${error}`);
  }
}

function renderChart(data) {
  const ctx = document.getElementById('myChart');
  let XdateArr = [];
  let YpriceArr = [];
  for (let i = 0; i < data.historical.length; i++) {
    XdateArr.push(data.historical[i].date);
    YpriceArr.push(data.historical[i].close);
  }

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: XdateArr,
      datasets: [
        {
          label: 'Price',
          data: YpriceArr,
          borderWidth: 1,
          borderColor: '#DCDCDC',
          backgroundColor: '#DCDCDC',
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
function setFavicons(favImg) {
  let headTitle = document.querySelector('head');
  let setFavicon = document.createElement('link');
  setFavicon.setAttribute('rel', 'shortcut icon');
  setFavicon.setAttribute('href', favImg);
  headTitle.appendChild(setFavicon);
}
setFavicons(
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Info_Simple_bw.svg/1200px-Info_Simple_bw.svg.png'
);
