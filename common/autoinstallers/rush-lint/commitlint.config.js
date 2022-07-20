const rushLib = require('@microsoft/rush-lib');

const rushConfiguration = rushLib.RushConfiguration.loadFromDefaultLocation();

const packageNames = [];

rushConfiguration.projects.forEach((project) => {
  packageNames.push(project.packageName.replace('@designer/', ''));
});
// 保证 scope 只能为 all/package name/package dir name
const allScope = ['all', ...packageNames];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', allScope],
    'scope-empty': [2, 'never'],
  },
};
