module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.{js,jsx,ts,tsx}'],
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/src/test/styleMock.cjs',
    '\\.(png|jpe?g|gif|svg|webp|ico|mp3|mp4)$': '<rootDir>/src/test/fileMock.cjs',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.js'],
};
