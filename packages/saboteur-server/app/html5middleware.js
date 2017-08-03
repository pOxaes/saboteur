const path = require("path");

const HTML5_ROUTES_BLACKLIST = ["/static", "/api"];

const indexFile = path.join(
  __dirname,
  "../",
  process.env.DIST_PATH,
  "index.html"
);

const handleHTML5Mode = (req, res, next) => {
  const url = req.originalUrl;
  const isHtml5Route = HTML5_ROUTES_BLACKLIST.every(
    base => url.indexOf(base) !== 0
  );
  if (isHtml5Route) {
    res.sendFile(indexFile);
    return;
  }
  next();
};

module.exports = handleHTML5Mode;
