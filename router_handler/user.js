// 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用

// 导入数据库操作模块
const db = require('../db/index');
// 导入 bcryptjs 加密模块
const bcrypt = require('bcryptjs');
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
    res.send('login OK');
}