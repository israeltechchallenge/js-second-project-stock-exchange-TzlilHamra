let urlParams = new URLSearchParams(window.location.search);
let symbol = urlParams.get('symbol');

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

  let companydescription = document.querySelector('.description');
  companydescription.innerHTML = data.profile.description;

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
