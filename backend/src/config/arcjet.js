const ENV_VARIABLES = require("./env");
const { tokenBucket, shield, detectBot } = require("@arcjet/node");
const arcjet = require("@arcjet/node").default;

//initialize arcjet with security rules
const aj = arcjet({
  key: ENV_VARIABLES.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }), // for secure app from attacks
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 10,
      capacity: 15,
    }),
  ],
});

module.exports = aj;
