/**
 * Module dependencies.
 */
var mcache = require('memory-cache');


/**
 * Expose `cache()` function on requests.
 *
 * @return {Function}
 * @api public
 */
module.exports = function cache(duration) {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        if (duration) {
          mcache.put(key, body, duration * 1000);
        } else {
          mcache.put(key, body);
        }
        res.sendResponse(body)
      }
      next()
    }
  }
}
