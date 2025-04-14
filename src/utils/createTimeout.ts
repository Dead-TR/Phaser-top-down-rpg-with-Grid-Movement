export const createTimeouts = () => {
  const timeouts: NodeJS.Timeout[] = [];

  const pushTimeout = (f: () => void, time: number = 0) => {
    const t = setTimeout(() => {
      f();
    }, time);

    timeouts.push(t);
  };

  const clearTimeouts = () => {
    timeouts.forEach((t) => {
      clearTimeout(t);
    });
    timeouts.length = 0;
  };

  return {
    pushTimeout,
    clearTimeouts,
  };
};
