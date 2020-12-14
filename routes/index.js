/*
 * @Description: 
 * @Author: sanghx
 * @Date: 2020-12-14 20:18:58
 * @LastEditors: sanghx
 * @LastEditTime: 2020-12-14 20:42:38
 */
const user = require("./api/user");

module.exports = app => {
	app.use('/api/user', user);
};