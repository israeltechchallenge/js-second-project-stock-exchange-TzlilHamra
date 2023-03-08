'use strict';

const marqueeUrlSuffix = `/api/v3/quotes/nyse`;

class Marquee {
  constructor(marqueeContainer) {
    this.marqueeContainer = marqueeContainer;
    this.marqueeData = [];
  }

  async getMarqueeData(baseUrl) {
    try {
      const response = await fetch(baseUrl + marqueeUrlSuffix);
      const data = await response.json();
      this.marqueeData = data;
      this.render();
    } catch (error) {
      throw Error(`error:${error}`);
    }
  }

  render() {
    for (let i = 0; i < 30; i++) {
      let marqueeElement = this.marqueeData[i];
      let symbolElement = marqueeElement.symbol;
      let priceElement = marqueeElement.price;
      let marqueeText = document.createElement('span');
      marqueeText.innerHTML = `${symbolElement} <span class="green">${priceElement}<span/> ◽ `;
      const temporaryMarqueeContainer = document.createDocumentFragment();
      temporaryMarqueeContainer.append(marqueeText);
      this.marqueeContainer.appendChild(temporaryMarqueeContainer);
    }
  }
}
