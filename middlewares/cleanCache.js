const { clearHash } = require("../services/cache");

module.exports = async (req, res, next) => {
  //~ Awesome trick: to wait the logic of call site finish before proceed
  await next();
  clearHash(req.user.id);
};
