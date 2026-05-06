import './style.css';
import { wordList } from './wordList.js';
import { Hangman } from './Hangman.js';

let game;
let streak = 0;

const $ = selector => document.querySelector(selector);
const DOM = {
  modal: $('#modal'),
  modalContent: $('#modal .modal_content'),
  drawing: $('#drawing .drawing_container'),
  message: $('#drawing .drawing_message'),
  keyboard: $('#keyboard'),
  chars: $('#chars'),
};

const MESSAGES = [
  'a journey of discovery awaits', 'a wrong turn, still walking', 'the mind clears',
  'no need to force', 'uncertainty remains', 'mountains do not hurry',
  'error returns to silence', 'stillness reveals the way', 'wind moves, mind is still',
  'in silence, beauty awaits anew',
];

const DRAWING_PARTS = [1, 2, 3, 4, 5, '6a', '6b', '7a', '7b'].map(
  id => `<div class="drawing_part drawing_part-${id}">${id === 4 ? 'ツ' : ''}</div>`
);

const toggleModal = (show, content = '') => {
  if (content) DOM.modalContent.innerHTML = content;
  DOM.modal.classList.toggle('modal--is-open', show);
  DOM.modal.setAttribute('aria-hidden', show ? 'false' : 'true');
};

const handleGameEnd = () => {
  streak = game.isWon ? streak + 1 : 0;
  toggleModal(true, game.isWon
    ? `<em>${game.word}</em><br>The word reveals its beauty.<br><div class='modal_streak'>Streak: ${streak}</div>`
    : `Loss is but a fleeting moment. The word was <em>${game.word}</em>.`
  );
};

const initNewGame = () => {
  const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
  game = new Hangman(randomWord, handleGameEnd);
  toggleModal(false);
  render();
};

const render = () => {
  const { faults, charList, foundLetters, faultyLetters } = game;

  DOM.message.innerText = MESSAGES[faults];
  DOM.drawing.innerHTML = DRAWING_PARTS.slice(0, faults).join('');

  DOM.chars.innerHTML = charList.map(({ isLetter, show, value }) => 
    `<div class="chars_char ${isLetter ? 'chars_char--is-letter' : ''}">${show ? value : ''}</div>`
  ).join('');

  DOM.keyboard.innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => {
    const isFound = foundLetters.includes(char);
    const isFaulty = faultyLetters.includes(char);
    const stateClass = isFound ? 'keyboard_key--found' : isFaulty ? 'keyboard_key--is-faulty' : '';
    
    return `<button class="keyboard_key ${stateClass}" ${isFound || isFaulty ? 'disabled' : ''} data-key="${char}">${char}</button>`;
  }).join('');
};

DOM.keyboard.addEventListener('click', e => {
  if (e.target.matches('button') && !game?.isFinished) {
    game.guess(e.target.dataset.key);
    render();
  }
});

$('#new-game-button').addEventListener('click', initNewGame);

window.addEventListener('keydown', e => {
  const isModalOpen = DOM.modal.classList.contains('modal--is-open');

  if (isModalOpen && game?.isFinished && ['Space', 'Enter'].includes(e.code)) {
    e.preventDefault();
    return initNewGame();
  }

  if (!isModalOpen && /^[A-Z]$/i.test(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
    game.guess(e.key);
    render();
  }
});

document.addEventListener('contextmenu', e => e.preventDefault());

initNewGame();
