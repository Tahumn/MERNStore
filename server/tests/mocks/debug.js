const noop = () => {};

const createDebug = () => {
  const debug = () => noop;
  debug.log = noop;
  debug.formatArgs = noop;
  debug.save = noop;
  debug.load = noop;
  debug.useColors = () => false;
  debug.destroy = noop;
  return debug;
};

module.exports = createDebug();
