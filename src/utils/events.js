import mitt from 'mitt';

export const lottery = mitt();

export const emitArray = (array) => {
  array.forEach((event) => {
    lottery.emit(event.event, event);
  });
}