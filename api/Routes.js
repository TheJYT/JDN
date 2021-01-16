"use strict";

const cors = require('cors');

module.exports = (app) => {
  var api = require("./Controller");

  app.use(cors());
  app.route("/api/v1/files").post(api.upload);
  app.route("/files/:fileID").get(api.get);
};
