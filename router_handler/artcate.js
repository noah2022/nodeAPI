// 导入数据库操作模块
const db = require('../db/index');

// 获取文章分类
exports.getArtCate = (req, res) => { 
    const sql = 'SELECT * FROM ev_article_cate WHERE is_delete=0 ORDER BY id';
    db.query(sql, (err, results) => { 
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: '获取文章分类列表成功',
            data: results
        })
    })
}

// 新增文章分类
exports.addArtCate = (req, res) => { 
    const sql = 'SELECT * FROM ev_article_cate WHERE name=? or alias=?';
    db.query(sql, [req.body.name, req.body.alias], (err, results) => { 
        if (err) return res.cc(err);
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！');
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！');
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！');
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！');

        // 插入文章分类
        const sql = 'INSERT INTO ev_article_cate (name, alias, is_delete) VALUES (?,?,0)';
        db.query(sql, [req.body.name, req.body.alias], (err, results) => { 
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('文章分类插入失败');
            res.cc('文章分类插入成功', 0);
        });
    });
}

// 根据 id 删除文章分类
exports.deleteCateById = (req, res) => { 
    const sql = 'UPDATE ev_article_cate SET is_delete=1 WHERE id=?';
    db.query(sql, req.params.id, (err, results) => { 
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败');
        res.cc('删除文章分类成功', 0);
    });
}

// 根据 id 获取文章分类
exports.getCateById = (req, res) => { 
    const sql = 'SELECT * FROM ev_article_cate WHERE id=?';
    db.query(sql, req.params.id, (err, results) => { 
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('获取文章分类失败');
        res.send({
            status: 0,
            message: '获取文章分类数据成功',
            data: results[0]
        });
    });
}

// 根据 id 更新文章分类
exports.updateCateById = (req, res) => { 
    const sql = 'SELECT * FROM ev_article_cate WHERE id<>? and (name=? or alias=?)';
    db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, results) => { 
        if (err) return res.cc(err);
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！');
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！');
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！');
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！');
        const sql = 'UPDATE ev_article_cate SET ? WHERE id=?';
        db.query(sql, [req.body, req.body.id], (err, results) => { 
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败');
            res.cc('更新文章分类成功', 0);
        })
    });
}