const passport = require("passport");

module.exports = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect('/chat')
    }
  );

  app.get(
    "/auth/facebook",
    passport.authenticate("facebook")
  );

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook"),
    (req, res) => {
      res.redirect('/chat')
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout();
    req.user = null;
    res.redirect('/');
  });

  app.get("/api/current_user", (req, res) => {
    res.send(`<img src=${req.user.pic}>`);
  });
};
