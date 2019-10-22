/*
 * @Description: -
 * @Author: sanghx
 * @Date: 2019-10-18 14:35:30
 * @LastEditors: sanghx
 * @LastEditTime: 2019-10-22 17:59:33
 */

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport")
const app = express();

const user = require("./routes/api/user");
const rss = require("./routes/api/rss");
// DB config
const db = require("./config/index").mongoUrl;

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Mongodb 连接成功"))
    .catch(err => console.log(err));

// passport初始化
app.use(passport.initialize());
// 配置passport
require("./config/passport")(passport);

// // 配置apidoc
// app.use(express.static(path.join(__dirname, 'public')))
// app.get('/apidoc',function(req,res){
//     res.sendfile("./public/apidoc/index.html")
// })

// 使用routes
app.use("/api/user", user);
app.use("/api/rss", rss);

const port = process.env.POST || 5000;

app.listen(port, () => {
    console.log(`运行的端口号:${port}`)
})