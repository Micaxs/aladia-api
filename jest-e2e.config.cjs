const baseConfig = require('./jest.config.cjs');

module.exports = {
  ...baseConfig,
  // keep root at project root so <rootDir>/core etc. work
  roots: ['<rootDir>'],
  testRegex: 'test/.*\\.e2e-spec\\.ts$',
  moduleNameMapper: baseConfig.moduleNameMapper,
};
