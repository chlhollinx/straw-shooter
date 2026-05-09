const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ViroReact ships its own nested copy of React which causes the
// "React element from an older version" error. Force every require('react')
// in the bundle to resolve to the single root copy regardless of caller location.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react') {
    return {
      filePath: require.resolve('react'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
