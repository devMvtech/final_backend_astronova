const passport = require("passport");
const { Strategy } = require("passport-jwt");
const { SECRET } = require("../constants");
// const db = require("../db");
const db = require("../../database.js");

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) token = req.cookies["token"];
  return token;
};

const opts = {
  secretOrKey: SECRET,
  jwtFromRequest: cookieExtractor,
};

passport.use(
  new Strategy(opts, async ({ id }, done) => {
    try {
      const {
        rows,
      } = await db.query(
        "SELECT donator_id, email FROM donators WHERE donator_id = $1",
        [id]
      );

      if (!rows.length) {
        throw new Error("401 not authorized");
      }

      let donator = { id: rows[0].donator_id, email: rows[0].email };

      return await done(null, donator);
    } catch (error) {
      console.log(error.message);
      done(null, false);
    }
  })
);
