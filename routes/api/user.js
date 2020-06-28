"use strict";

const express = require("express");
const router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const User = require("../../models/user");
const keys = require("../../config/index");
const passport = require("passport");

/**
 * @api {get} /api/user 获取全部
 * @apiGroup user
 * @apiSuccess {json} result
 * @apiVersion 1.0.0 
 */

router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
	User.find()
		.then(user => res.tools.setJson(user))
		.catch(err => res.tools.setJson('', err, 500, 500))
})


/**
 * @api {post} /api/user 新增
 * @apiGroup user
 * @apiParam {String}  name 姓名
 * @apiParam {String}  email 邮箱
 * @apiParam {String}  password 密码
 * @apiSuccess {json} result
 * @apiVersion 1.0.0 
 */

router.post("/", (req, res) => {
	// 查询数据库中是否拥有邮箱
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				return res.tools.setJson('', '邮箱已经存在', 20005)
			} else {
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password,
					createTime: req.body.createTime
				})
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						// hash为加密后的密码
						if (err) throw err;
						newUser.password = hash;
						newUser.save()
							.then(user => res.tools.setJson(user))
							.catch(err => console.log(err))
					});
				});
			}
		})
})



/**
 * @api {post} /api/user/login 登录
 * @apiGroup user
 * @apiParam {String}  email 邮箱
 * @apiParam {String}  password 密码
 * @apiSuccess {json} result
 * @apiVersion 1.0.0 
 */

router.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	// 查询数据库
	User.findOne({ email })
		.then(user => {
			if (!user) {
				return res.tools.setJson('', '不存在', 20004)
			}
			//密码匹配
			bcrypt.compare(password, user.password)
				.then(isMatch => {
					if (isMatch) {
						const rule = {
							id: user.id,
							name: user.name,
							identity: user.identity
						};
						//   jwt.sign("规则","加密名字","过期时间","箭头函数")
						jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
							if (err) throw err;
							let data = {
								token: "Bearer " + token
							}
							res.tools.setJson(data)
						})
					} else {
						return res.tools.setJson('', '密码错误', 20002)
					}
				})
		})
})

/**
 * @api {GET} /api/user/current 获取用户信息
 * @apiGroup user
 * @apiParam {String}  id id
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
	const data = {
		id: req.user.id,
		name: req.user.name,
		email: req.user.email,
		identity: req.user.identity
	}
	res.tools.setJson(data)
})



/**
 * @api {GET} /api/user/:id 获取单个
 * @apiGroup user
 * @apiParam {String}  id 用户标识
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
	User.findOne({ _id: req.params.id }, { password: 0, email: 0 }).populate('focus.rssId')
		.then(data => res.tools.setJson(data))
		.catch(err => res.tools.setJson(data, err, 500, 500))
})

/**
 * @api {put} /api/user 修改
 * @apiGroup user
 * @apiParam {String} _id 标识
 * @apiParam {String}  focus focus
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
router.put("/", passport.authenticate("jwt", { session: false }), (req, res) => {
	const newData = {}
	if (req.body.focus) newData.focus = req.body.focus;
	User.findByIdAndUpdate(
		{ _id: req.body._id },
		{ $set: newData },
		{ runValidators: false }
		// { new: true },
		// { versionKey: false }
	).then(data => res.tools.setJson(data))
		.catch(err => res.tools.setJson(data, err, 500, 500))
})

/**
 * @api {delete} /api/user/:id 删除
 * @apiGroup user
 * @apiParam {String}  id 标识
 * @apiSuccess {json} result
 * @apiVersion 1.0.0 
 */

router.delete("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
	User.remove({ _id: req.params.id }).then(user => res.tools.setJson(user))
		.catch(err => res.tools.setJson(data, err, 500, 500))
})


/**
 * @api {put} /api/user/changePassword 修改密码
 * @apiGroup user
 * @apiParam {String}  _id 标识
 * @apiParam {String}  oldPassword 旧密码
 * @apiParam {String}  newPassword 新密码
 * @apiSuccess {json} result
 * @apiVersion 1.0.0 
 */

router.put("/changePassword", passport.authenticate("jwt", { session: false }), (req, res) => {
	const _id = req.body._id;
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;
	User.findOne({ _id }).then(user => {
		if (!user) return res.tools.setJson('', '不存在', 20004)
		bcrypt.compare(oldPassword, user.password).then(isMatch => {
			if (isMatch) {
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newPassword, salt, (err, hash) => {
						if (err) throw err;
						const newData = {}
						if (req.body.password) newData.password = req.body.password;
						// hash为加密后的密码
						newData.password = hash;
						User.findByIdAndUpdate(
							{ _id: _id },
							{ $set: newData },
							{ runValidators: false }
						).then(data => res.tools.setJson(data))
							.catch(err => res.tools.setJson(data, err, 500, 500))
					});
				});
			} else {
				return res.tools.setJson('', '旧密码错误', 20002)
			}
		})
	})
})

module.exports = router;