const { Router } = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
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
  // const plus = google.plus("v1").people;
  // const loadTokens = promisify(oauth2Client.getToken, oauth2Client);
  // const loadUserProfile = promisify(plus.get, plus);

  const authorizationCode = req.body;

  const { tokens } = await oauth2Client.getToken(authorizationCode);
  oauth2Client.setCredentials({ access_token: tokens.access_token });

  try {
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const { data } = await oauth2.userinfo.get();
    const { token, user } = await login(simpleProfile(data));

    // const tokens = await loadTokens(authorizationCode);
    // oauth2Client.setCredentials(tokens);
    // const googleProfile = await loadUserProfile({
    //   userId: "me",
    //   auth: oauth2Client
    // });
    // const { token, user } = await login(simpleProfile(googleProfile));
    res.json({ token, user });
  } catch (error) {
    logger.error(error);
    res.status(500).send("Woopsy !");
  }
});

const simpleProfile = (data) => {
  return {
    name: data.given_name,
    avatarURL: data.picture || "",
    email: data.email,
  };
};

module.exports = loginRouter;
