import { defineConfig } from "cypress";
require("dotenv").config();

export default defineConfig({
  e2e: {
    // setupNodeEvents(on, config) {
    //     implement node event listeners here
    // },
    baseUrl: "http://localhost:3000",
  },

  viewportWidth: 1280,
  viewportHeight: 800,

  env: {
    testUsername: "danielTestUser",
    testPassword: "Password!",
    testEmail: "danielTestUser@gmail.com",
    testInvalidUsername: "danielTestUser1",
    testInvalidPassword: "Password!!",
    testInvalidEmail: "danielTestUser1@gmail.com",
    testLongUsername: "danielTestingUser",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
