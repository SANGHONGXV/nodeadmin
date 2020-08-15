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
 * @apiSampleRequest /api/user
 * @apiSuccessExample Success-Response:
 * {
 * 	"result": []
 *	"message": null,
 * 	"code": 0,
 * 	"status": 200
 * }
 */

router.get("/", async (req, res) => {
	const user = await User.find()
	res.tools.setJson(user)
})


/**
 * @api {post} /api/user 新增
 * @apiGroup user
 * @apiParam {String}  name 姓名
 * @apiParam {String}  email 邮箱
 * @apiParam {String}  password 密码
 * @apiSampleRequest /api/user
 * @apiSuccess {json} result
 * @apiVersion 1.0.0 
 */

router.post("/", async (req, res) => {
	// 查询数据库中是否拥有邮箱
	const user = await User.findOne({ email: req.body.email })
	if (user) return res.tools.setJson('', '邮箱已经存在', 20005)
	const newUser = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		createTime: req.body.createTime
	})
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, async (err, hash) => {
			// hash为加密后的密码
			if (err) throw err;
			newUser.password = hash;
			const saveUser = await newUser.save()
			res.tools.setJson(saveUser)
		});
	})
})



/**
 * @api {post} /api/user/login 登录
 * @apiGroup user
 * @apiParam {String}  email 邮箱
 * @apiParam {String}  password 密码
 * @apiSampleRequest /api/user/login
 * @apiSuccess {json} result
 * @apiVersion 1.0.0 
 */

router.post("/login", async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	// 查询数据库
	const user = await User.findOne({ email })
	if (!user) return res.tools.setJson('', '不存在', 20004)
	bcrypt.compare(password, user.password)
		.then(isMatch => {
			if (!isMatch) return res.tools.setJson('', '密码错误', 20002)
			const rule = {
				id: user.id,
				name: user.name,
				identity: user.identity
			};
			//  jwt.sign("规则","加密名字","过期时间","箭头函数")
			jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
				if (err) throw err;
				let data = {
					token: "Bearer " + token
				}
				res.tools.setJson(data)
			})
		})
})

/**
 * @api {GET} /api/user/current 获取用户信息
 * @apiGroup user
 * @apiHeader {String}  Authorization token
 * @apiSampleRequest /api/user/current
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
	const data = {
		id: req.user.id,
		name: req.user.name,
		email: req.user.email
	}
	res.tools.setJson(data)
})


/**
 * @api {GET} /api/user/:id 获取单个
 * @apiGroup user
 * @apiHeader {String}  Authorization token
 * @apiParam {String}  id 用户标识
 * @apiSampleRequest /api/user/:id
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
	const user = await User.findOne({ _id: req.params.id }, { password: 0, email: 0 })
	res.tools.setJson(user)
})

/**
 * @api {put} /api/user 修改
 * @apiGroup user
 * @apiHeader {String}  Authorization token
 * @apiParam {String} _id 标识
 * @apiParam {String}  name name
 * @apiParam {String}  email email
 * @apiSampleRequest /api/user
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
router.put("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
	const newData = {}
	if (req.body.name) newData.name = req.body.name;
	if (req.body.email) newData.email = req.body.email;
	const data = await User.findByIdAndUpdate(
		{ _id: req.body._id },
		{ $set: newData },
		{ runValidators: false }
	)
	res.tools.setJson(data,'修改成功')
})

/**
 * @api {delete} /api/user/:id 删除
 * @apiGroup user
 * @apiHeader {String}  Authorization token
 * @apiParam {String}  id 标识
 * @apiSampleRequest /api/user/:id
 * @apiSuccess {json} result
 * @apiVersion 1.0.0 
 */

router.delete("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
	const data = await User.remove({ _id: req.params.id })
	res.tools.setJson(data,'删除成功')
})


/**
 * @api {put} /api/user/changePassword 修改密码
 * @apiGroup user
 * @apiHeader {String}  Authorization token
 * @apiParam {String}  _id 标识
 * @apiParam {String}  oldPassword 旧密码
 * @apiParam {String}  newPassword 新密码
 * @apiSampleRequest /api/user/changePassword
 * @apiSuccess {json} result
 * @apiVersion 1.0.0 
 */

router.put("/changePassword", passport.authenticate("jwt", { session: false }), async (req, res) => {
	const _id = req.body._id;
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;
	const user = await User.findOne({ _id })
	if (!user) return res.tools.setJson('', '不存在', 20004)

	bcrypt.compare(oldPassword, user.password).then(isMatch => {
		if (!isMatch) return res.tools.setJson('', '旧密码错误', 20002)
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newPassword, salt, async (err, hash) => {
				if (err) throw err;
				const newData = {}
				if (req.body.password) newData.password = req.body.password;
				// hash为加密后的密码
				newData.password = hash;
				const data = await User.findByIdAndUpdate(
					{ _id: _id },
					{ $set: newData },
					{ runValidators: false }
				)
				res.tools.setJson(data,'修改成功')
			});
		});
	})
})

module.exports = router;