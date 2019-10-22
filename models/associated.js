/*
 * @Description: -
 * @Author: sanghx
 * @Date: 2019-10-21 14:11:31
 * @LastEditors: sanghx
 * @LastEditTime: 2019-10-21 14:14:20
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const associatedSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  rssId: {
    type: Schema.Types.ObjectId,
    ref: 'rss'
  },
  createTime: {
    type: Date,
    default: Date.now()
  }
})

module.exports = associated = mongoose.model("associated", associatedSchema);