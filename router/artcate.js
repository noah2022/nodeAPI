const express = require('express');
// 创建路由对象
const router = express.Router();

// 导入用户信息的处理函数模块
const userinfo_handler = require('../router_handler/artcate.js');

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入需要的验证规则对象
const { add_cate_schema } = require('../schema/artcate.js');
const { delete_cate_schema } = require('../schema/artcate');
const { update_cate_schema } = require('../schema/artcate');

// 获取文章分类
router.get('/cates', userinfo_handler.getArtCate);

// 新增文章分类
router.post('/addcates', expressJoi(add_cate_schema), userinfo_handler.addArtCate);

// 根据 id 删除文章分类
router.get('/deletecate/:id', expressJoi(delete_cate_schema), userinfo_handler.deleteCateById);

// 根据 id 获取文章分类
router.get('/cates/:id', expressJoi(delete_cate_schema), userinfo_handler.getCateById);

// 根据 id 更新文章分类
router.post('/updatecate', expressJoi(update_cate_schema), userinfo_handler.updateCateById);

// 向外共享路由对象
module.exports = router;