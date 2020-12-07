// 导入 express
const express = require('express');

// 创建服务器的实例对象
const app = express();

// 导入 cors 中间件
const cors = require('cors');

// 将 cors 注册为全局中间件
app.use(cors());

// 配置解析表单中的中间件
app.use(express.urlencoded({ extended: false }));

// 优化 res.send() 代码，声明一个全局中间件，为 res 对象挂载一个 res.cc() 函数
app.use((req, res, next) => { 
    // status=0 为成功；status=1 为失败；默认将 status 的值设置为 1，方便处理失败的情况
    res.cc = (err, status = 1) => {
        res.send({
            // 状态
            status,
            // 状态描述，判断 err 是错误对象 还是 字符串
            message: err instanceof Error ? err.message : err
        })
    };
    next();
});

// 配置解析 Token 的中间件
const config = require('./config.js');
const expressJWT = require('express-jwt');
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }));

// 导入并注册用户路由模块
const userRouter = require('./router/user.js');
app.use('/api', userRouter);
const userinfoRouter = require('./router/userinfo.js');
app.use('/my', userinfoRouter);

// 错误中间件
const joi = require('@hapi/joi');
app.use((err, req, res, next) => { 
    
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err);

    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')

    // 未知错误
    res.cc(err);
})

// 启动服务器
app.listen(3007, () => { 
    console.log('服务器已启动');
})