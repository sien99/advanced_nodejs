const mongoose = require("mongoose");
const redis = require("redis");

const client = redis.createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();
// store original function in exec
const exec = mongoose.Query.prototype.exec;

//* Method inheritance using prototype
// only cache query exec with .cache method
mongoose.Query.prototype.cache = function (options = {}) {
  //* Store new props in Query obj for caching logic
  this._useCache = true;
  this.hashKey = JSON.stringify(options.key || ""); // if no key is set, init as ''

  return this; // to make the function chainable
};

//* run Query functions with some additionals logic
mongoose.Query.prototype.exec = async function () {
  if (!this._useCache) {
    return exec.apply(this, arguments);
  }
  ` `;

  // generate a unique nested key for each query
  // on specific key (here is req.user.id - ../routes/blogRoutes.js)
  // { _user: req.user.id } + { collection: this.mongooseCollection.name }
  // "{\"_user\":\"62962ea0e6ca9937c45c9ded\",\"collection\":\"blogs\"}"
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // Check if we have a value for 'key' in Redis
  const cacheValue = await client.hGet(this.hashKey, key);

  // if key exist, return the value
  //TODO: Turn JSON representation of model into Mongoose model
  if (cacheValue) {
    console.log("Cache Hit");
    //* Idea: const data = new Blog({key:value})
    const doc = JSON.parse(cacheValue);

    //* Deal with single record | array of records
    return Array.isArray(doc)
      ? //is arr
        doc.map((d) => new this.model(d))
      : //is single obj
        new this.model(doc);
  }

  console.log("Cache Missed");
  // else issue a query & store result in redis
  const result = await exec.apply(this, arguments); // bind 'this' to exec & pass args to exec

  client.hSet(this.hashKey, key, JSON.stringify(result), { EX: 10 });

  return result;
  // console.log(result); // result is a mongoose document instance
};

//~ export module to call function in this module from other site
module.exports = {
  //* to flush data in specific hashKey
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
