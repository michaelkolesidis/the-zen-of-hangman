import './style.css';
import { wordList } from './wordList.js';
import { Hangman } from './Hangman.js';

let game = null;
let streak = 0;

const DOM = {
  modal: document.getElementById('modal'),
  modalContent: document.querySelector('#modal .modal_content'),
  drawingContainer: document.querySelector('#drawing .drawing_container'),
  drawingMessage: document.querySelector('#drawing .drawing_message'),
  keyboard: document.getElementById('keyboard'),
  chars: document.getElementById('chars'),
  newGameBtn: document.getElementById('new-game-button'),
};

const DRAWING_PARTS = [
  '<div class="drawing_part drawing_part-1"></div>',
  '<div class="drawing_part drawing_part-2"></div>',
  '<div class="drawing_part drawing_part-3"></div>',
  '<div class="drawing_part drawing_part-4">ツ</div>',
  '<div class="drawing_part drawing_part-5"></div>',
  '<div class="drawing_part drawing_part-6a"></div>',
  '<div class="drawing_part drawing_part-6b"></div>',
  '<div class="drawing_part drawing_part-7a"></div>',
  '<div class="drawing_part drawing_part-7b"></div>',
];

const MESSAGES = [
  'a journey of discovery awaits',
  'a wrong turn, still walking',
  'the mind clears',
  'no need to force',
  'uncertainty remains',
  'mountains do not hurry',
  'error returns to silence',
  'stillness reveals the way',
  'wind moves, mind is still',
  'in silence, beauty awaits anew',
];

const toggleModal = (show, content = '') => {
  if (content) DOM.modalContent.innerHTML = content;
  if (show) setTimeout(() => (DOM.modal.style.display = ''), 300);
  else DOM.modal.style.display = 'none';
};

const gameEndHandler = () => {
  const isWin = game.hasWon();
  streak = isWin ? streak + 1 : 0;

  toggleModal(
    true,
    isWin
      ? `<em>${game.getWord()}</em><br>The word reveals its beauty.<br><div class='modal_streak'>Streak: ${streak}</div>`
      : `Loss is but a fleeting moment. The word was <em>${game.getWord()}</em>.`,
  );
};

const initNewGame = () => {
  const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
  game = new Hangman(randomWord, gameEndHandler);
  toggleModal(false);
  drawGame();
};

const guessLetter = (letter) => {
  if (!game?.isFinished()) {
    game.pickedLetter(letter);
    drawGame();
  }
};

const drawGame = () => {
  const faults = game.getNumberOfFaults();

  DOM.drawingMessage.innerText = MESSAGES[faults];
  DOM.drawingContainer.innerHTML = DRAWING_PARTS.slice(0, faults).join('');

  DOM.chars.innerHTML = game
    .getCharList()
    .map(
      (char) =>
        `<div class="chars_char ${char.isLetter ? 'chars_char--is-letter' : ''}">${char.show ? char.value : ''}</div>`,
    )
    .join('');

  const found = game.getFoundLetters();
  const faulty = game.getFaultyLetters();

  DOM.keyboard.innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .map((letter) => {
      const isFound = found.includes(letter);
      const isFaulty = faulty.includes(letter);
      const classNames = `keyboard_key ${isFound ? 'keyboard_key--found' : ''} ${isFaulty ? 'keyboard_key--is-faulty' : ''}`;

      return `<button class="${classNames.trim()}" ${isFound || isFaulty ? 'disabled' : ''} data-letter="${letter}">${letter}</button>`;
    })
    .join('');
};

DOM.keyboard.addEventListener('click', (e) => {
  if (e.target.matches('button')) guessLetter(e.target.dataset.letter);
});

DOM.newGameBtn.addEventListener('click', initNewGame);

window.addEventListener('keydown', (e) => {
  const modalVisible = DOM.modal.style.display !== 'none';
  const canRestart = game?.isFinished() && modalVisible;

  // Handle Game Restart
  if (canRestart && (e.code === 'Space' || e.code === 'Enter')) {
    e.preventDefault();
    return initNewGame();
  }

  // Handle Letter Guessing
  const isModifier = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
  const key = e.key.toUpperCase();

  if (!modalVisible && !isModifier && /^[A-Z]$/.test(key)) {
    guessLetter(key);
  }
});

document.addEventListener('contextmenu', (e) => e.preventDefault());

initNewGame();
