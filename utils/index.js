/*
 * @Description: 
 * @Date: 2020-06-20 17:30:41
 * @LastEditors: sanghx
 * @LastEditTime: 2020-06-20 19:57:47
 */ 
const tools = require('./tools')

module.exports = function(req, res, next) {
  res.tools = new tools(req, res)
  next()
}
