const baseConfig = require('./jest.config.cjs');

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>'],
  testRegex: 'test/.*\\.e2e-spec\\.ts$',
  moduleNameMapper: baseConfig.moduleNameMapper,
};
