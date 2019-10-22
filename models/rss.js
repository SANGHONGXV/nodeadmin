/*
 * @Description: -
 * @Author: nardy.sanghx
 * @Date: 2019-10-18 14:40:17
 * @LastEditors: sanghx
 * @LastEditTime: 2019-10-19 11:33:18
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const rssSchema = new Schema({
  // 姓名
  name: {
    type: String
  },
  // 地址
  url: {
    type: String
  },
  // 图标
  icon: {
    type: String
  },
  createTime: {
    type: Date,
    default: Date.now()
  }
})

module.exports = rss = mongoose.model("rss", rssSchema);