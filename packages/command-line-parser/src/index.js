function normalizeOptionName(option) {
  return option.split(/[-_]+|(?<=[a-z])(?=[A-Z])/)
    .map((s, i) => (i ? s.slice(0, 1).toUpperCase() : s.slice(0, 1).toLowerCase()) + s.slice(1).toLowerCase())
    .join('');
}

function commandLineParser(argv) {
  const options = {};
  const arguments = [];
  let foundStopper = false;

  argv.forEach(arg => {
    if (arg === '--') {
      foundStopper = true;
    } else if (foundStopper) {
      arguments.push(arg);
    } else {
      const matches = /^--([^=]+?)(=(.*))?$/.exec(arg);
      if (matches) {
        const names = matches[1].split(/\.+/).map(normalizeOptionName);
        const isFlag = matches[2] === undefined;
        const value = matches[3];
        names.slice(0, -1).reduce((ref, name) => ref[name] = ref[name] || {}, options)[names.slice(-1)] = isFlag ? true : value;
      } else {
        arguments.push(arg);
      }
    }
  });

  return { ...options, $: arguments };
}

module.exports = commandLineParser;
