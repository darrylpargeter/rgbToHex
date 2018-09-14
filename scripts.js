const network = new brain.NeuralNetwork();

const inputs = document.querySelectorAll('input');
const wrapper = document.querySelector('.wrapper');
const header = wrapper.querySelector('h1');
const hexInput = document.querySelector('.hex');
const rgbInput = document.querySelector('.rgb');

void function main() {
  inputs.forEach(input => input.addEventListener('input', inputChange));

  network.train([
    { input: { r: 1, g: 1, b: 1 }, output: { dark: 1 }},
    { input: { r: 0, g: 0, b: 0 }, output: { light: 1 }},
    { input: { r: 0.62, g: 0.72, b: 0.88 }, output: { light: 1 }},
    { input: { r: 0.1, g: 0.84, b: 0.72 }, output: { light: 1 }},
    { input: { r: 0.33, g: 0.24, b: 0.29 }, output: { dark: 1 }},
    { input: { r: 0.74, g: 0.78, b: 0.86 }, output: { light: 1 }},
    { input: { r: 0.31, g: 0.35, b: 0.41 }, output: { dark: 1 }},
    { input: { r: 1, g: 0.99, b: 0 }, output: { light: 1 }},
    { input: { r: 1, g: 0.42, b: 0.52 }, output: { dark: 1 }},
    { input: { r: 1, g: 1, b: 0.84 }, output: { dark: 1 }},
    { input: { r: 1, g: 1, b: 0.08 }, output: { dark: 1 }},
    { input: { r: 1, g: 0.94, b: 1 }, output: { dark: 1 }},
    { input: { r: 1, g: 0.94, b: 0.01 }, output: { dark: 1 }},
    { input: { r: 0.04, g: 0.08, b: 0.24 }, output: { light: 1 }},
    { input: { r: 1, g: 1, b: 0.01 }, output: { dark: 1 }},
    { input: { r: 0.08, g: 0.2, b: 0.04 }, output: { light: 1 }},
    { input: { r: 0.87, g: 0.9, b: 0.87 }, output: { light: 1 }},
    { input: { r: 1, g: 1, b: 1 }, output: { dark: 1 }},
    { input: { r: 0.35, g: 0.98, b: 1 }, output: { dark: 1 }},
  ])
}();

function setFontColour(input = [255, 255, 255]) {
  const formatedInputList = formatForNN(input);
  const result = brain.likely(formatedInputList, network);
  const colour = result === 'dark' ? '#000' : '#fff';

  header.style.color = colour;
  inputs.forEach(input => {
    input.style.color = colour;
    input.style.borderBottom = `2px solid ${colour}`;
  })
}

function formatForNN(input) {
  return {
    r: Math.round(input[0] / 2.55) / 100,
    g: Math.round(input[1] / 2.55) / 100,
    b: Math.round(input[2] / 2.55) / 100,
  }
}

function inputChange ({ target: input }) {
  const conversionType = input.dataset.type;
  const inputValue = input.value;
  conversionType === 'rgb' ? convertToHex(input.value) : convertToRGB(input.value);
}

function convertToHex (input) {
  if (input !== '') {
    const RGBListValues = splitRGBString(input);
    const hexValue = `#${rgbToHex(RGBListValues)}`;

    setFontColour(RGBListValues);
    updateBackgroundColour(hexValue);
    hexInput.value = hexValue;
  } else {
    setFontColour();
    updateBackgroundColour();
    hexInput.value = input;
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
      rgbInput.value = rgbString;
      updateBackgroundColour(rgbString);
      setFontColour(rgb);
    // } else {
    //   rgbInput.value = '';
    //   updateBackgroundColour();
    }
  } else {
    rgbInput.value = '';
    updateBackgroundColour();
    setFontColour();
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


function updateBackgroundColour(colour = '#ebebeb') {
  wrapper.style.backgroundColor = colour;
}
