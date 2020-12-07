// 引入数据模块
const db = require('../db/index.js');

// 获取用户信息
exports.getUserinfo = (req, res) => {
    const sql = 'SELECT id, username, nickname, email, user_pic FROM ev_users WHERE id=?';
    db.query(sql, req.user.id, (err, results) => { 
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('获取用户信息失败！');
        res.send({
            status: 0,
            message: '获取用户基本信息成功',
            data: results[0]
        })
    })
}

// 更新用户信息
exports.updateUserinfo = (req, res) => {
    const sql = 'UPDATE ev_users SET ? WHERE id=?';
    db.query(sql, [req.body, req.user.id], (err, results) => { 
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败!');
        return res.cc('修改用户基本信息成功!', 0);
    })
}
  
//重置密码
// 导入 bcryptjs 加密模块
const bcrypt = require('bcryptjs');

exports.updatePassword = (req, res) => {
    const userinfo = req.body;
    const sql = 'SELECT * FROM ev_users WHERE id=?';
    db.query(sql, req.user.id, (err, results) => { 
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('获取数据失败');
        const compareResult = bcrypt.compareSync(userinfo.oldPwd, results[0].password);
        if (!compareResult) return res.cc('原蜜码输入错误');
            // 对用户的密码，进行 bcrypt 加密
            userinfo.newPwd = bcrypt.hashSync(userinfo.newPwd, 10);
            // 定义插入新用户 SQL 语句
            const sql = 'UPDATE ev_users SET password=? WHERE id=?';
            // 执行 SQL 语句，插入新用户
            db.query(sql, [userinfo.newPwd, req.user.id], (err, results) => {
                if (err) return res.cc(err);
                if (results.affectedRows !== 1) {
                    return res.cc('更新密码失败！')
                }
                // 注册成功
                res.cc('更新密码成功',0);
            })
 });

}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    const sql = 'UPDATE ev_users SET user_pic=? WHERE id=?';
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => { 
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('更新头像失败');
        return res.cc('更新头像成功', 0);
    })
  }