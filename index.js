const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

module.exports = function (hexo, pluginDir) {
  return {
    defaultConfigFile(key, file) {
      let defaultConfig = yaml.safeLoad(fs.readFileSync(this.getFilePath(file)));
      let data = hexo.locals.get('data');
      hexo.config[key] = Object.assign(defaultConfig, hexo.theme.config[key], hexo.config[key], data[key]);
      return hexo.config[key];
    },
    getFilePath(file) {
      if (pluginDir) {
        return path.join(pluginDir, file);
      }
      return file;
    },
    loadPlugin(name) {
      const plugin = hexo.resolvePlugin(name)
      hexo.loadPlugin(plugin).then(() => {
        hexo.log.debug(`Plugin loaded: ${name}`);
      }).catch(err => {
        hexo.log.error({ err }, `Plugin load failed: ${name}`);
      });
    }
  }
}
