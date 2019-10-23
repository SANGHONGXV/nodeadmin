/*
 * @Description: -
 * @Author: sanghx
 * @Date: 2019-10-21 15:55:46
 * @LastEditors: sanghx
 * @LastEditTime: 2019-10-23 16:03:57
 */
const express = require("express"),
router = express.Router(),
associated = require('../../models/associated');

/**
 * @api {post} /api/associated/add 添加
 * @apiGroup associated
 * @apiParam {String}  userId 用户标识
 * @apiParam {String}  associatedId associated标识
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
// passport.authenticate("jwt", { session: false }),
router.post("/add", (req, res) => {
  const newData = new associated({
      userId: req.body.userId,
      rssId: req.body.rssId,
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
 * @api {get} /api/associated/listByPage 分页查询
 * @apiGroup associated
 * @apiParam {String} pageSize 每页显示条数
 * @apiParam {String} page 显示页
 * @apiParam {String} userId 用户标识
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

router.get('/listByPage', (req, res) => {
  let pageSize = req.query.pageSize || 10 //设置默认值
  let page = req.query.page || 1
  associated.find({ userId: req.query.userId }).populate('rssId').limit(Number(pageSize)).skip(Number((page - 1) * pageSize))
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