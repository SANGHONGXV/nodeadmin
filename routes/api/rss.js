/*
 * @Description: -
 * @Author: sanghx
 * @Date: 2019-10-19 11:34:25
 * @LastEditors: sanghx
 * @LastEditTime: 2019-10-21 16:06:16
 */
const express = require("express"),
rsj = require('rsj'),
router = express.Router();
const rss = require('../../models/rss');
// 测试
router.get("/test", (req, res) => {
    res.json({ msg: "data works" })
})

/**
 * @api {post} /api/rss/add 添加
 * @apiGroup rss
 * @apiParam {String}  name 名称
 * @apiParam {String}  url 地址
 * @apiParam {String}  icon 图标
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
// passport.authenticate("jwt", { session: false }),
router.post("/add", (req, res) => {
    const newData = new rss({
        name: req.body.name,
        url: req.body.url,
        icon: req.body.icon,
        createTime: req.body.createTime
    })
    newData.save()
        .then(data => res.json({
            status: 200,
            code: 0,
            data: data
        }))
        .catch(err => console.log(err))
})

/**
 * @api {post} /api/rss/listByPage 分页查询
 * @apiGroup rss
 * @apiParam {String} pageSize 每页显示条数
 * @apiParam {String} page 显示页
 * @apiParam {String} name 名称
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

router.get('/listByPage', (req, res) => {
    let pageSize = req.query.pageSize || 5 //设置默认值
    let page = req.query.page || 1
    rss.find({ name: { $regex: req.query.name } }).limit(Number(pageSize)).skip(Number((page - 1) * pageSize))
        .then((data) => {
            if (!data) {
                return res.json({ "code": 404, "status": 200, "message": "暂无数据" });
            }
            res.json({
                status: 200,
                code: 0,
                data: {
                    pageSize: pageSize,
                    page: page,
                    list: data
                }
            });
        })
        .catch(err => res.status(403).json(err))
})

/**
 * @api {GET} /api/rss/one 获取单个
 * @apiGroup rss
 * @apiParam {String}  _id 
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

// passport.authenticate("jwt", { session: false }),
router.get("/one", (req, res) => {
    rss.findOne({ _id: req.query._id })
        .then(data => {
            if (!data) {
                return res.json({ "code": 404, "status": 200, "message": "暂无数据" });
            }
            rsj.r2j(data.url,json =>　{
                res.json({
                    status: 200,
                    code: 0,
                    data: eval('(' + json + ')')
                })
            })
        })
        .catch(err => res.status(403).json(err))
})

/**
 * @api {post} /api/rss/edit 修改
 * @apiGroup rss
 * @apiParam {String} id 标识
 * @apiParam {String}  name 名称
 * @apiParam {String}  url 地址
 * @apiParam {String}  icon 图标
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
// passport.authenticate("jwt", { session: false }),
router.post("/edit", (req, res) => {
    const newData = {}
    if (req.body.name) newData.name = req.body.name;
    if (req.body.url) newData.url = req.body.url;
    if (req.body.icon) newData.icon = req.body.icon;
    rss.updateOne(
        { _id: req.body._id },
        { $set: newData },
        { runValidators: false }
        // { new: true },
        // { versionKey: false }
    ).then(data => {
        res.json({
            status: 200,
            message: "成功",
            data: data
        })
    }).catch(err => res.status(403).json(err))
})


/**
 * @api {delete} /api/rss/del 删除
 * @apiGroup rss
 * @apiParam {String} id 标识
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

//  passport.authenticate("jwt", { session: false }),
router.delete("/del", (req, res) => {
    rss.findOneAndRemove({ _id: req.query.id }).then(data => {
        data.save().then(data => res.json({
            status: 200,
            code: 0,
            message: "删除成功"
        }))
    }).catch(err => res.status(404).json(err))
})

module.exports = router;