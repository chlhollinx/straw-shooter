const { createRunOncePlugin, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// ViroReact's config plugin inserts its import before the `package` declaration,
// which is invalid Kotlin. This plugin runs after ViroReact and moves it to the
// correct position.
const withViroMainApplicationFix = (config) => {
  return withDangerousMod(config, [
    'android',
    (config) => {
      const filePath = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/java/is/gamegarden/glitchraid/MainApplication.kt'
      );
      if (!fs.existsSync(filePath)) return config;

      let contents = fs.readFileSync(filePath, 'utf8');
      const viroImport = 'import com.viromedia.bridge.ReactViroPackage';

      if (contents.startsWith(viroImport)) {
        contents = contents.replace(viroImport + '\n', '');
        contents = contents.replace(
          /^(package .+\n)/m,
          `$1\nimport com.viromedia.bridge.ReactViroPackage`
        );
        fs.writeFileSync(filePath, contents);
      }

      return config;
    },
  ]);
};

module.exports = createRunOncePlugin(withViroMainApplicationFix, 'viro-main-application-fix');
