const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const mergeLang = (ctx, lang, target) => {
  if (!target) return;
  let i18n = ctx.theme.i18n;
  let source = i18n.get(lang);
  Object.keys(target).forEach(key => {
    if (source[key]) return;
    source[key] = target[key];
    i18n.set(lang, source);
  })
}

module.exports = function (hexo, pluginDir) {
  return {
    defaultConfigFile(key, file) {
      let defaultConfig = file ? yaml.safeLoad(fs.readFileSync(this.getFilePath(file))) : {};
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
    },
    i18n(langs) {
      hexo.extend.filter.register('before_generate', function () {
        let lang = hexo.config.language;
        if (Array.isArray(lang)) {
          lang.forEach(item => mergeLang(hexo, item, langs[item]));
        } else {
          mergeLang(hexo, lang, langs[lang]);
        }
      });
    }
  }
}
