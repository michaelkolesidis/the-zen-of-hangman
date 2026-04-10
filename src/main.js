import './style.css';
import { wordList } from './wordList.js';
import { Hangman } from './Hangman.js';

let game = null;
let streak = 0;

const reinitGame = () => {
  game = initNewGame();
};

const hideModal = () => {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
};

const showModal = (content) => {
  const modal = document.getElementById('modal');
  const modalContent = modal.querySelector('.modal_content');
  modalContent.innerHTML = content;
  setTimeout(() => (modal.style.display = ''), 300);
};

const gameEndHandler = () => {
  streak = game.hasWon() ? streak + 1 : 0;

  const content = game.hasWon()
    ? `<em>${game.getWord()}</em><br>The word reveals its beauty.<br><div class='modal_streak'>Streak: ${streak}<div>`
    : `Loss is but a fleeting moment. The word was <em>${game.getWord()}</em>.`;

  showModal(content);
};

const initNewGame = () => {
  const hangman = new Hangman(getRandomWord(), gameEndHandler);
  hideModal();
  drawGame(hangman);
  return hangman;
};

const getRandomWord = () => {
  const index = Math.floor(Math.random() * wordList.length);
  return wordList[index];
};

const guessLetter = (letter) => {
  if (game && !game.isFinished()) {
    game.pickedLetter(letter);
    drawGame(game);
  }
};

const drawHangman = (faults) => {
  const parts = [
    '<div class="drawing_part drawing_part-1"></div>',
    '<div class="drawing_part drawing_part-2"></div>',
    '<div class="drawing_part drawing_part-3"></div>',
    '<div class="drawing_part drawing_part-4">ツ</div>',
    '<div class="drawing_part drawing_part-5"></div>',
    `<div class="drawing_part drawing_part-6a"></div>`,
    `<div class="drawing_part drawing_part-6b"></div>`,
    `<div class="drawing_part drawing_part-7a"></div>`,
    `<div class="drawing_part drawing_part-7b"></div>`,
  ];

  const visibleParts = parts.splice(0, faults);
  const parent = document.querySelector('#drawing .drawing_container');
  parent.innerHTML = visibleParts.join('');
};

const drawResult = (faults) => {
  const texts = [
    /* 0 */ 'a journey of discovery awaits',
    /* 1 */ 'a wrong turn, still walking',
    /* 2 */ 'the mind clears',
    /* 3 */ 'no need to force',
    /* 4 */ 'uncertainty remains',
    /* 5 */ 'mountains do not hurry',
    /* 6 */ 'error returns to silence',
    /* 7 */ 'stillness reveals the way',
    /* 8 */ 'wind moves, mind is still',
    /* 9 */ 'in silence, beauty awaits anew',
  ];

  const container = document.querySelector('#drawing .drawing_message');
  container.innerText = texts[faults];
};

const drawKeyboard = (foundLetters, faultyLetters) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const keys = letters.map((letter) => {
    const found = foundLetters.includes(letter);
    const faulty = faultyLetters.includes(letter);
    return { letter, found, faulty };
  });

  const parent = document.getElementById('keyboard');
  parent.innerHTML = '';
  keys.map((key) => {
    const el = document.createElement('button');
    el.innerText = key.letter;
    el.disabled = key.found || key.faulty;
    el.className = 'keyboard_key';
    key.found && el.classList.add('keyboard_key--found');
    key.faulty && el.classList.add('keyboard_key--is-faulty');

    el.onclick = () => {
      guessLetter(key.letter);
    };

    parent.appendChild(el);
  });
};

const drawCharList = (chars) => {
  const parent = document.getElementById('chars');
  parent.innerHTML = '';

  chars.forEach((char) => {
    const charEl = document.createElement('div');
    charEl.className = `chars_char ${
      char.isLetter ? 'chars_char--is-letter' : ''
    }`;
    charEl.innerText = char.show ? char.value : '';
    parent.appendChild(charEl);
  });
};

const drawGame = (hangman) => {
  drawResult(hangman.getNumberOfFaults());
  drawHangman(hangman.getNumberOfFaults());
  drawCharList(hangman.getCharList());
  drawKeyboard(hangman.getFoundLetters(), hangman.getFaultyLetters());
};

const listenForInputs = (callback) => {
  window.addEventListener('keydown', (event) => {
    const pressedOtherKey =
      event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
    const key = event.key.toUpperCase();
    const isLetter = /^[A-Z]$/.test(key);

    if (!pressedOtherKey && isLetter) {
      callback(key);
    }
  });
};

const canRestart = () => {
  const modal = document.getElementById('modal');
  return game && game.isFinished() && modal.style.display !== 'none';
};

game = initNewGame();
listenForInputs((letter) => {
  guessLetter(letter);
});

const newGameButton = document.getElementById('new-game-button');
newGameButton.addEventListener('click', reinitGame);

window.addEventListener('keydown', (event) => {
  if (!canRestart()) return;

  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault();
    reinitGame();
  }
});

document.addEventListener('contextmenu', (event) => event.preventDefault());
