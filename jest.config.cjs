const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  roots: ['<rootDir>/apps', '<rootDir>/core', '<rootDir>/common', '<rootDir>/config'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\.spec\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/main.(t|j)s',
    '!**/*.d.(t|j)s',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};
