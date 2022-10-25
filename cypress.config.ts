const { defineConfig } = require('cypress');

module.exports = defineConfig({
  fixturesFolder: false,
  modifyObstructedCode: false,
  video: false,
  retries: 0,
  e2e: {
    specPattern: './cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: './cypress/support/index.ts',
    baseUrl: 'https://www.rezfusionhubdemo.com/hub-test-vacation-rentals',
  },
  viewPortWidth: 1920,
  viewPortHeight: 1080,
});
