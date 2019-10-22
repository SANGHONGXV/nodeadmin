/*
 * @Description: -
 * @Author: nardy.sanghx
 * @Date: 2019-10-18 14:40:17
 * @LastEditors: sanghx
 * @LastEditTime: 2019-10-21 14:12:26
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const userSchema = new Schema({
  // 姓名
  name: {
    type: String,
    required: true
  },
  // 邮箱
  email: {
    type: String,
    required: true
  },
  // 密码
  password: {
    type: String,
    required: true
  },
  createTime: {
    type: Date,
    default: Date.now()
  }
})

module.exports = user = mongoose.model("user", userSchema);