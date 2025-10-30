const ENV_VARIABLES = require("./env");
const { tokenBucket, shield, detectBot } = require("@arcjet/node");
const arcjet = require("@arcjet/node").default;

//initialize arcjet with security rules
const aj = arcjet({
  key: ENV_VARIABLES.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: ENV_VARIABLES.NODE_ENV === "production" ? "LIVE" : "DRY_RUN" }), // for secure app from attacks
    detectBot({
      mode: ENV_VARIABLES.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
    }),

    tokenBucket({
      mode: ENV_VARIABLES.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      refillRate: 20, // Increased for development
      interval: 10,
      capacity: 30, // Increased for development
    }),
  ],
});

module.exports = aj;
