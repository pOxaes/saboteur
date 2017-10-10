const { Router } = require("express");
const bodyParser = require("body-parser");
const google = require("googleapis");
const { promisify } = require("saboteur-shared/src/utils");
const logger = require("./logger");

const { login } = require("./services/user");

const loginRouter = new Router();

loginRouter.use(bodyParser.text());

loginRouter.post("/login", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL || ""
  );
  const plus = google.plus("v1").people;
  const loadTokens = promisify(oauth2Client.getToken, oauth2Client);
  const loadUserProfile = promisify(plus.get, plus);

  const authorizationCode = req.body;

  try {
    const tokens = await loadTokens(authorizationCode);
    oauth2Client.setCredentials(tokens);
    const googleProfile = await loadUserProfile({
      userId: "me",
      auth: oauth2Client
    });
    const { token, user } = await login(simpleProfile(googleProfile));
    res.json({ token, user });
  } catch (error) {
    logger.error(error);
    res.status(500).send("Woopsy !");
  }
});

const simpleProfile = googleProfile => {
  const email = googleProfile.emails.find(
    email => email.type === "account"
  ) || {
    value: ""
  };

  return {
    name: googleProfile.displayName,
    avatarUrl: googleProfile.image ? googleProfile.image.url : "",
    email: email.value
  };
};

module.exports = loginRouter;
