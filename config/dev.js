// require("dotenv").config();
module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  // "70265989829-0t7m7ce5crs6scqd3t0t6g7pv83ncaii.apps.googleusercontent.com",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // "8mkniDQOqacXtlRD3gA4n2az",
  mongoURI: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.ea91s.mongodb.net:27017,cluster0-shard-00-01.ea91s.mongodb.net:27017,cluster0-shard-00-02.ea91s.mongodb.net:27017/blogDb?ssl=true&replicaSet=atlas-b2nst6-shard-0&authSource=admin&retryWrites=true&w=majority`,
  cookieKey: "123123123",
};
