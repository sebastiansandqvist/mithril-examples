import m from 'mithril';

const morseMap = {
  'a': '.-',
  'b': '-...',
  'c': '-.-.',
  'd': '-..',
  'e': '.',
  'f': '..-.',
  'g': '--.',
  'h': '....',
  'i': '..',
  'j': '.---',
  'k': '-.-',
  'l': '.-..',
  'm': '--',
  'n': '-.',
  'o': '---',
  'p': '.--.',
  'q': '--.-',
  'r': '.-.',
  's': '...',
  't': '-',
  'u': '..-',
  'v': '...-',
  'w': '.--',
  'x': '-..-',
  'y': '-.--',
  'z': '--..',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  '0': '-----',
  ' ': ' ',
};

function charToMorse(char) {
  return morseMap[char.toLowerCase()] || ('[ILLEGAL CHARACTER ' + char + ']');
}

function morseModel() {
  const audioCtx = new AudioContext();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  oscillator.type = 'sine';
  oscillator.frequency.value = 850;
  oscillator.start();
  const model = {
    audioCtx,
    gainNode,
    text: '',
    isPlaying: false,
    morseArr() {
      return model.text.split('').map(charToMorse);
    },
    morseString() {
      return model.morseArr().join('');
    },
  };
  return model;
}

const BETWEEN_TIME = 50;
const DOT_TIME = 100;
const DASH_TIME = 300;
const LETTER_PAUSE = 100;
const WORD_PAUSE = 700;

const actions = {
  setText(model, text) {
    model.text = text;
  },
  setPlaying(model, value) {
    model.isPlaying = value;
  },
  startSound(model) {
    if (model.audioCtx.state !== 'closed') {
      model.gainNode.connect(model.audioCtx.destination);
    }
  },
  stopSound(model) {
    if (model.audioCtx.state !== 'closed') {
      model.gainNode.disconnect();
    }
  },
  destroy(model) {
    actions.stopSound(model);
    model.audioCtx.close();
  },
  wait(duration, cb) {
    setTimeout(cb, duration);
  },
  playDot(model, cb) {
    actions.startSound(model);
    setTimeout(function() {
      actions.stopSound(model);
      setTimeout(cb, BETWEEN_TIME);
    }, DOT_TIME);
  },
  playDash(model, cb) {
    actions.startSound(model);
    setTimeout(function() {
      actions.stopSound(model);
      setTimeout(cb, BETWEEN_TIME);
    }, DASH_TIME);
  },
  playLetter(model, morseLetter, cb) {
    const chars = morseLetter.split('');
    if (chars.length === 0) { cb(); return; }
    const char = chars.shift();
    switch (char) {
      case '.': actions.playDot(model, () =>
        actions.playLetter(model, chars.join(''), cb));
        return;
      case '-': actions.playDash(model, () =>
        actions.playLetter(model, chars.join(''), cb));
        return;
      case ' ': actions.wait(WORD_PAUSE, () =>
        actions.playLetter(model, chars.join(''), cb));
        return;
      default:
        alert('Unable to play character: ' + char); // eslint-disable-line no-alert
        cb();
    }
  },
  playAll(model, morseArr, cb) {
    if (morseArr.length === 0) { cb(); return; }
    const letter = morseArr.shift();
    actions.playLetter(model, letter, function() {
      actions.wait(LETTER_PAUSE, function() {
        actions.playAll(model, morseArr, cb);
      });
    });
  },
};

export default function MorsePlayer() {
  let hasError = false;
  let model;
  try { model = morseModel(); }
  catch (err) { hasError = true; }
  return {
    view() {
      return hasError ?
        m('p.errorMessage', '(Your browser does not support the web audio api.)') :
        [
          m('textarea.fullWidth', {
            placeholder: 'Enter some text',
            oninput(event) {
              actions.setText(model, event.target.value);
            },
          }),
          m('div', m('code', model.morseString())),
          m('button', {
            disabled: model.isPlaying,
            onclick() {
              actions.setPlaying(model, true);
              actions.playAll(model, model.morseArr(), function() {
                actions.setPlaying(model, false);
                m.redraw();
              });
            },
          }, 'Play'),
        ];
    },
    onremove() {
      actions.destroy(model);
    },
  };
}
