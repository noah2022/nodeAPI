// 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用

// 导入数据库操作模块
const db = require('../db/index');

// 导入 bcryptjs 加密模块
const bcrypt = require('bcryptjs');

// 导入 jsonwebtoken 模块
const jwt = require('jsonwebtoken');

// 导入密钥配置文件
const config = require('../config.js');

// 注册用户的处理函数
exports.regUser = (req, res) => { 
    // 接收表单数据
    const userinfo = req.body;
    // 判断用户名和密码是否为空
    
    // 定义查询 SQL 语句
    const sql = 'SELECT * FROM ev_users WHERE username=?';
    // 执行 SQL 语句并根据结果判断用户名是否被占用
    db.query(sql, [userinfo.username], (err, results) => { 
        if (err) { 
            return res.send({
                status: 1,
                message: err.message
            })
        }
        // 用户名被占用
        if (results.length > 0) { 
            return res.cc('用户名被占用，请更换其他用户名')
        }
        // 对用户的密码，进行 bcrypt 加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        // 定义插入新用户 SQL 语句
        const sql = 'INSERT INTO ev_users SET?';
        // 执行 SQL 语句，插入新用户
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => { 
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) { 
                return res.cc('注册用户失败，请稍后再试！')
            }
            // 注册成功
            res.cc('注册成功',0);
        });
    });
    
}

// 登录的处理函数
exports.login = (req, res) => { 
    const userinfo = req.body;
    const sql = 'SELECT * FROM ev_users WHERE username=?';
    db.query(sql, userinfo.username, (err, results) => { 
        if (err) return res.cc(err);

        // 执行 SQL 语句成功，但是查询到数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败');
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);

        // 如果对比的结果等于 false，则证明用户输入的密码错误
        if (!compareResult) { 
            return res.cc('登录失败');
        }

        // 在服务端生成 Token 字符串

        // user 中只保留用户 id, username, nickname, email 这四个属性的值
        const user = { ...results[0], password: '', user_pic: '' };

        // 生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });

        // 将生成的 Token 字符串响应给客户端
        res.send({
            status: 0,
            message: '登录成功！',

            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: 'Bearer ' + tokenStr
        })

    });
}