import { isPromise } from "saboteur-shared/utils";

class eventsQueue {
  elements = [];

  playing = false;

  play = () => {
    if (this.playing) {
      return;
    }
    const element = this.elements[0];
    this.playing = true;
    const res = element.action(element.payload);
    if (!isPromise(res)) {
      return this.next();
    }
    res.then(this.next);
  };

  next = () => {
    this.playing = false;
    this.elements.shift();
    if (this.elements[0]) {
      this.play(this.elements[0]);
    }
  };

  queue(element) {
    this.elements.push(element);
    if (!this.playing) {
      this.play();
    }
  }
}

export default eventsQueue;
