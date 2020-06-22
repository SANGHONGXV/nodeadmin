/*
 * @Description: 
 * @Date: 2020-06-20 19:57:19
 * @LastEditors: sanghx
 * @LastEditTime: 2020-06-22 10:43:34
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