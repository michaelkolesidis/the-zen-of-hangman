export class Hangman {
  MAX_FAULTS = 9;

  #word;
  #targetLetters;
  #picked = new Set();
  #faults = 0;
  #onEnd;

  constructor(word, onEndGame) {
    this.#word = word.toUpperCase();
    this.#onEnd = onEndGame;
    this.#targetLetters = new Set(this.#word.match(/[A-Z]/g) || []);
  }

  get word()         { return this.#word; }
  get faults()       { return this.#faults; }
  get faultyLetters(){ return [...this.#picked].filter(c => !this.#targetLetters.has(c)); }
  get foundLetters() { return [...this.#picked].filter(c => this.#targetLetters.has(c)); }
  get isLost()       { return this.#faults >= this.MAX_FAULTS; }
  get isFinished()   { return this.isLost || this.isWon; }
  
  get isWon() {
    return this.#targetLetters.size > 0 && 
           [...this.#targetLetters].every(c => this.#picked.has(c));
  }

  get charList() {
    return [...this.#word].map(char => {
      const isLetter = /[A-Z]/.test(char);
      return { isLetter, show: !isLetter || this.#picked.has(char), value: char };
    });
  }

  guess(letter) {
    const char = letter.toUpperCase();
    
    if (this.isFinished || this.#picked.has(char)) return;

    this.#picked.add(char);
    
    if (!this.#targetLetters.has(char)) this.#faults++;
    if (this.isFinished) this.#onEnd?.();
  }
}