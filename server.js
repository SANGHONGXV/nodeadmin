/*
 * @Description: -
 * @Author: sanghx
 * @Date: 2019-10-18 14:35:30
 * @LastEditors: sanghx
 * @LastEditTime: 2020-06-20 21:50:09
 */

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport")
const path = require('path')
const tools = require('./utils/tools')
const app = express();

const user = require("./routes/api/user");

// DB config
const db = require("./config/index").mongoUrl;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Mongodb 连接成功"))
    .catch(err => console.log(err));


// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport初始化
app.use(passport.initialize());
// 配置passport
require("./config/passport")(passport);

// 配置apidoc
app.use(express.static(path.join(__dirname, 'public')))
app.get('/apidoc',function(req,res){
    res.sendfile("./public/apidoc/index.html")
})

app.use('/tools', tools)

// 使用routes
app.use("/api/user", user);

const port = process.env.POST || 5000;

app.listen(port, () => {
    console.log(`运行的端口号:${port}`)
})