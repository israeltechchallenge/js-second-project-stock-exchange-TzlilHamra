let marqueeClass = document.querySelector('.marquee-class');
//A class in charge for creating an element
class Marquee {
  constructor(containerItem) {
    this.container = containerItem;
    this.marqueeElement = [];
    this.getDataMarquee();
  }
  async getMarqueeData() {
    try {
      const response = await fetch(`${baseUrl}/api/v3/quotes/nyse`);
      this.data = await response.json();

      for (let i = 0; i < 20; i++) {
        this.marqueeElement = data[i];

        createMarqueeElement(marqueeElement);
      }
    } catch (error) {
      throw Error(`error:${error}`);
    }
  }

  createMarqueeElement(marqueeElement) {
    let symbolElement = marqueeElement.symbol;
    let priceElement = marqueeElement.price;
    let marqueeText = document.createElement('span');
    marqueeText.innerHTML = `${symbolElement} <span class='green'>${priceElement}<span/>`;
    const temporaryMarqueeContainer = document.createDocumentFragment();
    temporaryMarqueeContainer.append(marqueeText);
    this.container.appendChild(temporaryMarqueeContainer);
  }

  // createElement = () => {
  //   this.elem = document.createElement(this.tag);
  // };

  //   appendTo = (selector) => {
  //   const wrap = document.querySelector(selector);
  //   wrap.append(this.elem);
  // };
}

// const myMarquee = new Marquee();
