
  const inputs = document.querySelectorAll('input');
  const wrapper = document.querySelector('.wrapper');
  const header = wrapper.querySelector('h1');
  const hexInput = document.querySelector('.hex');
  const rgbInput = document.querySelector('.rgb');
  let worker = null;

  if (window.Worker) {
    if (!worker) {
      worker = new Worker('worker.js');
    }
  }

void function main() {
  inputs.forEach(input => input.addEventListener('input', inputChange));
  worker.onmessage = setFont;
}();


function inputChange ({ target: input }) {
  const conversionType = input.dataset.type;
  const inputValue = input.value;
  conversionType === 'rgb' ? convertToHex(input.value) : convertToRGB(input.value);
}

function setFont (event) {
  const colour = event.data;

  header.style.color = colour;
  inputs.forEach(input => {
    input.style.color = colour;
    input.style.borderBottom = `2px solid ${colour}`;
  });
}

function convertToHex (input) {
  if (input !== '') {
    const RGBListValues = splitRGBString(input);
    const hexValue = `#${rgbToHex(RGBListValues)}`;

    updateDOM(hexInput, hexValue, RGBListValues);
  } else {
    updateDOM(hexInput, '', input);
  }
}

function splitRGBString(list) {
  const [r = '0', g = '0', b = '0'] = list.split(/,|\s/);

  return [r, g, b];
}

function rgbToHex(rgb) {
  return rgb.map(decimal => {
    const int = parseInt(decimal, 10);

    return !Number.isNaN(int) ?
      int.toString(16).padStart(2, '0')
      : '00';
  }).join('');
}

function convertToRGB(input) {
  if (input !== '') {
    const hexFromShortHand = convertFromShortHandHex(input);
    const hexList = splitHexToHexArray(hexFromShortHand);

    if (hexList) {
      const rgb = hexTorgb(hexList);
      const rgbString = `rgb(${rgb.join(',')})`;

      updateDOM(rgbInput, rgbString, rgb);
    }
  } else {
    updateDOM(rgbInput, '', rgb);
  }
}

function hexTorgb(hex) {
  return hex.map(d => parseInt(d, 16));
}

function convertFromShortHandHex(hex) {
  const re = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  return hex.replace(re, (m, r, g, b) => r + r + g + g + b + b);
}

function splitHexToHexArray(hex) {
  const hexList = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  Array.isArray(hexList) ? hexList.shift() : null;

  return hexList;
}

function updateDOM(input, colourStr = '', colourList) {
  input.value = colourStr 
  updateBackgroundColour(colourStr);
  worker.postMessage(colourList);
}

function updateBackgroundColour(colour = '#ebebeb') {
  wrapper.style.backgroundColor = colour;
}
