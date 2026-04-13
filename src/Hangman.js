export class Hangman {
  MAX_FAULTS = 9;

  #word;
  #targetLetters;
  #pickedLetters = new Set();
  #faults = 0;
  #onEndGame;

  constructor(word, onEndGame) {
    this.#word = word.toUpperCase();
    this.#onEndGame = onEndGame;

    const lettersOnly = this.#word.match(/[A-Z]/g) || [];
    this.#targetLetters = new Set(lettersOnly);
  }

  getWord() {
    return this.#word;
  }

  getCharsOfWord() {
    return [...this.#word];
  }

  getLettersOfWord() {
    return [...this.#targetLetters];
  }

  getNumberOfFaults() {
    return this.#faults;
  }

  getFaultyLetters() {
    return [...this.#pickedLetters].filter(
      (letter) => !this.#targetLetters.has(letter),
    );
  }

  getFoundLetters() {
    return [...this.#pickedLetters].filter((letter) =>
      this.#targetLetters.has(letter),
    );
  }

  getCharList() {
    return [...this.#word].map((char) => {
      const isLetter = /[A-Z]/.test(char);
      const show = this.#pickedLetters.has(char) || !isLetter;
      return { isLetter, show, value: char };
    });
  }

  pickedLetter(letter) {
    const char = letter.toUpperCase();

    if (this.isFinished() || this.#pickedLetters.has(char)) {
      return;
    }

    this.#pickedLetters.add(char);

    if (!this.#targetLetters.has(char)) {
      this.#faults++;
    }

    if (this.isFinished()) {
      this.#onEndGame?.();
    }
  }

  hasWon() {
    if (this.hasLost() || this.#targetLetters.size === 0) return false;

    for (const char of this.#targetLetters) {
      if (!this.#pickedLetters.has(char)) return false;
    }
    return true;
  }

  hasLost() {
    return this.#faults >= this.MAX_FAULTS;
  }

  isFinished() {
    return this.hasLost() || this.hasWon();
  }
}
