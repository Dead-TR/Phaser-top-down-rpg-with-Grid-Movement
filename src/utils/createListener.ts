import EventEmitter from "events";


export const createListener = (
  emitter: EventEmitter,
  event: string,
  callBack: (value: any) => void,
) => {
  emitter.addListener(event, callBack);

  return () => {
    emitter.removeListener(event, callBack);
  };
};
