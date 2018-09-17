importScripts('https://unpkg.com/brain.js@1.1.2/browser.min.js');

const network = new brain.NeuralNetwork();

trainNN();

onmessage = function(event) {
  setFontColour(event.data);
}

function trainNN() {
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
  ]);
}

function formatForNN(input) {
  return {
    r: Math.round(input[0] / 2.55) / 100,
    g: Math.round(input[1] / 2.55) / 100,
    b: Math.round(input[2] / 2.55) / 100,
  }
}

function setFontColour(input = [255, 255, 255]) {
  const formatedInputList = formatForNN(input);
  const result = brain.likely(formatedInputList, network);
  const colour = result === 'dark' ? '#000' : '#fff';
  
  postMessage(colour);
}

