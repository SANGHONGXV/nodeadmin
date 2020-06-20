/*
 * @Description: 
 * @Author: nardy.sanghx
 * @Date: 2019-08-01 21:48:34
 * @LastEditors: sanghx
 * @LastEditTime: 2020-06-20 20:58:59
 */
const express = require("express");
const router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const User = require("../../models/user");
const keys = require("../../config/index");
const passport = require("passport");

/**
 * @api {post} /api/user/register 新增
 * @apiGroup user
 * @apiParam {String}  name 姓名
 * @apiParam {String}  email 邮箱
 * @apiParam {String}  password 密码
 * @apiSuccess {json} result
 * @apiVersion 1.0.0 
 */
// passport.authenticate("jwt", { session: false }),
router.post("/register", (req, res) => {
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
                // password未进行加密
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



// welogin(req, res, next) {
//     const js_code = req.query.code
//     const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${Config.wechat.appid}&secret=${Config.wechat.secret}&js_code=${js_code}&grant_type=authorization_code`
//     console.log(url)
//     if (js_code) {
//       res.httpClient({
//         method: 'GET',
//         url: url
//       }).then(doc1 => {
//         if (doc1.openid) {
//           res.httpClient({
//             method: 'GET',
//             url: '/login/third',
//             params: { openId: doc1.openid, scid: scid }
//           }).then(doc2 => {
//             if (doc2.status == 200) {
//               res.tools.setJson(doc2.result, 'success')
//             }
//           })
//         } else {
//           res.tools.setJson(doc1.errmsg, '获取openid失败')
//         }
//       }).catch(err => {
//         console.log(err)
//       })
//     } else {
//       res.tools.setJson('', 'not found code')
//     }
// }

/**
 * @api {get} /api/user/list 
 * @apiGroup user
 * @apiSuccess {json} result
 * @apiVersion 1.0.0 
 */
// passport.authenticate("jwt", { session: false }),
router.get("/listAll", (req, res) => {
    User.find()
        .then(user => res.tools.setJson(user))
        .catch(err => res.tools.setJson('', err, 500, 500))
})

// $route POST api/user/login
// @desc  返回token jwt passpord
// @access public

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

// $route GET api/user/current
// @desc return current user
// @access Private

// router.get("/current","验证token",(req, res) => {
//     res.json({msg:"success"})
// })
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
 * @api {GET} /api/user/one 获取单个
 * @apiGroup user
 * @apiParam {String}  id id
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

// passport.authenticate("jwt", { session: false }),
router.get("/one", (req, res) => {
    User.findOne({ _id: req.query.id }, { password: 0, email: 0 }).populate('focus.rssId')
        .then(data => res.tools.setJson(data))
        .catch(err => res.tools.setJson(data,err,500,500))
})

/**
 * @api {post} /api/user/edit 修改
 * @apiGroup user
 * @apiParam {String} id 标识
 * @apiParam {String}  focus focus
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
router.post("/edit", (req, res) => {
    const newData = {}
    if (req.body.focus) newData.focus = req.body.focus;
    rss.findByIdAndUpdate(
        { _id: req.body._id },
        { $set: newData },
        { runValidators: false }
        // { new: true },
        // { versionKey: false }
    ).then(data => res.tools.setJson(data))
    .catch(err => res.tools.setJson(data,err,500,500))
})

// $route delete api/user/del/:id
// @desc  删除
// @access Privata
/**
 * @api {delete} /api/user/del 删除
 * @apiGroup user
 * @apiParam {String}  id 标识
 * @apiSuccess {json} result
 * @apiVersion 1.0.0 
 */
router.delete("/del", passport.authenticate("jwt", { session: false }), (req, res) => {
    User.remove({ _id: req.body.id }).then(user => res.tools.setJson(user))
    .catch(err => res.status(404).json(err))
})

module.exports = router;