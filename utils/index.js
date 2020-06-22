/*
 * @Description: 
 * @Date: 2020-06-20 19:58:02
 * @LastEditors: sanghx
 * @LastEditTime: 2020-06-22 10:43:08
 */ 
const tools = require('./tools')

module.exports = function(req, res, next) {
  res.tools = new tools(req, res)
  next()
}
