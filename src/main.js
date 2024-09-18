import { wordList } from './wordList.js';
import { Hangman } from './Hangman.js';

let game = null;

const reinitGame = () => {
  game = initNewGame();
};

const hideModal = () => {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
};

const showModal = (content) => {
  const modal = document.getElementById('modal');
  const modalContent = modal.querySelector('.modal__content');
  modalContent.innerHTML = content;
  setTimeout(() => (modal.style.display = ''), 300);
};

const gameEndHandler = () => {
  const content = game.hasWon()
    ? `Great, you are a winner!`
    : `Oh no, you fucked up! We were looking for <em>${game.getWord()}</em>.`;
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
    '<div class="drawing__part drawing__part-1"></div>',
    '<div class="drawing__part drawing__part-2"></div>',
    '<div class="drawing__part drawing__part-3"></div>',
    '<div class="drawing__part drawing__part-4">ツ</div>',
    '<div class="drawing__part drawing__part-5"></div>',
    `<div class="drawing__part drawing__part-6a"></div>`,
    `<div class="drawing__part drawing__part-6b"></div>`,
    `<div class="drawing__part drawing__part-7a"></div>`,
    `<div class="drawing__part drawing__part-7b"></div>`,
  ];

  const visibleParts = parts.splice(0, faults);
  const parent = document.querySelector('#drawing .drawing__container');
  parent.innerHTML = visibleParts.join('');
};

const drawResult = (faults) => {
  const texts = [
    /* 0 */ "Let's find that word!",
    /* 1 */ 'Oops, wrong letter. Try again!',
    /* 2 */ "Don't worry, everything is fine.",
    /* 3 */ "It's alright, you got this.",
    /* 4 */ 'Careful now, getting risky!',
    /* 5 */ 'Things are heating up.',
    /* 6 */ "Uh-oh! It's getting serious.",
    /* 7 */ "Danger! You're on thin ice!",
    /* 7 */ 'You are playing with fire...',
    /* 9 */ 'R.I.P.',
  ];

  const container = document.querySelector('#drawing .drawing__message');
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
    el.className = 'keyboard__key';
    key.found && el.classList.add('keyboard__key--found');
    key.faulty && el.classList.add('keyboard__key--is-faulty');

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
    charEl.className = `chars__char ${
      char.isLetter ? 'chars__char--is-letter' : ''
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
    const pressedOtherKey = event.altKey || event.ctrlKey || event.metaKey; // Shift key is allowed
    const key = event.key.toUpperCase();
    const isLetter = key.match(/[A-Z]/);
    !pressedOtherKey && isLetter && callback(key);
  });
};

game = initNewGame();
listenForInputs((letter) => {
  guessLetter(letter);
});

const newGameButton = document.getElementById('new-game-button');
newGameButton.addEventListener('click', reinitGame);
