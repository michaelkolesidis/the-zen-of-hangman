export class Hangman {
  MAX_FAULTS = 9;

  constructor(word, onEndGame) {
    this.word = word.toUpperCase();
    this.pickedLetters = [];
    this.faults = 0;
    this.onEndGame = onEndGame;
  }

  getWord() {
    return this.word;
  }

  getCharsOfWord() {
    return this.word.split('');
  }

  getLettersOfWord() {
    const chars = this.getCharsOfWord();
    return chars
      .filter((char) => char.match(/[A-Z]/))
      .filter((char, index, list) => list.indexOf(char) === index);
  }

  getNumberOfFaults() {
    return this.faults;
  }

  getFaultyLetters() {
    return this.pickedLetters.filter((letter) => {
      return !this.word.includes(letter);
    });
  }

  getFoundLetters() {
    return this.pickedLetters.filter((letter) => {
      return this.word.includes(letter);
    });
  }

  getCharList() {
    const chars = this.getCharsOfWord();
    return chars.map((char) => {
      const isLetter = char.match(/[A-z]/);
      const pickedLetterAlready = this.pickedLetters.includes(char);
      const show = pickedLetterAlready || !isLetter;
      return { isLetter, show, value: char };
    });
  }

  pickedLetter(letter) {
    const alreadyPicked = this.pickedLetters.includes(letter);
    const contains = this.word.includes(letter);

    if (alreadyPicked) {
      return;
    }

    this.pickedLetters.push(letter);

    if (!contains) {
      this.pickedLetters.push(letter);
      this.faults += 1;
    }

    if (this.isFinished()) {
      this.onEndGame();
    }
  }

  hasWon() {
    const letters = this.getLettersOfWord();
    return (
      !this.hasLost() &&
      letters.every((char) => {
        return this.pickedLetters.includes(char);
      })
    );
  }

  hasLost() {
    return this.faults >= this.MAX_FAULTS;
  }

  isFinished() {
    return this.hasLost() || this.hasWon();
  }
}
