const aj = require("../config/arcjet");

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    //handle denied request
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too Many Requests",
          message: "rate limit exceeded . Please try again later.",
        });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Access denied for bots.",
        });
      } else {
        return res.status(403).json({
          error: "Forbidden",
          message: "Access denied.",
        });
      }
    }

    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Access denied for spoofed bots.",
      });
    }

    next();
  } catch (error) {
    console.log("Arcjet Middleware Error:", error);

    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing your request.",
    });
  }
};

module.exports = arcjetMiddleware;
