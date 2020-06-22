/*
 * @Description: 
 * @Date: 2020-06-20 19:57:19
 * @LastEditors: sanghx
 * @LastEditTime: 2020-06-22 10:42:39
 */ 
const express = require("express"),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      passport = require("passport"),
      path = require('path'),
      tools = require('./utils');

const app = express();

const user = require("./routes/api/user");


// DB config
const db = require("./config/index").mongoUrl;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Mongodb连接成功"))
    .catch(err => console.log("Mongodb连接失败"+err));

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

app.use('/', tools)
// 使用routes
app.use("/api/user", user);

const port = process.env.POST || 5000;
app.listen(port, () => {
    console.log(`运行的端口号:${port}`)
})