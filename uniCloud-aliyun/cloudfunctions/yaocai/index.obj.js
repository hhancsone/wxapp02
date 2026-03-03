// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
'use strict';
module.exports = {
	_before: function () { // 通用预处理器
		
	},
	/**
	 * 获取药材列表
	 * @param {Object} options 查询参数
	 * @param {string} options.category 分类筛选
	 * @param {string} options.keyword 关键词搜索
	 * @param {number} options.limit 每页数量
	 * @param {number} options.offset 偏移量
	 * @returns {object} 返回药材列表
	 */
	async getList(options = {}) {
		const { category, keyword, offset = 0 } = options;
		
		const db = uniCloud.database();
		let query = db.collection('yaocai');
		
		if (category && category !== 'all') {
			query = query.where({
				category: category
			});
		}
		
		if (keyword) {
			query = query.where({
				name: new RegExp(keyword, 'i')
			});
		}
		
		const countResult = await query.count();
		const result = await query.orderBy('views', 'desc').limit(1000).skip(offset).get();
		
		return {
			code: 0,
			msg: 'success',
			data: {
				list: result.data,
				total: countResult.total
			}
		};
	},
	
	/**
	 * 获取单个药材详情
	 * @param {string} id 药材ID
	 * @returns {object} 返回药材详情
	 */
	async getDetail(id) {
		if (!id) {
			return {
				errCode: 'ID_IS_NULL',
				errMsg: '药材ID不能为空'
			};
		}
		
		const db = uniCloud.database();
		const result = await db.collection('yaocai').doc(id).get();
		
		if (result.data && result.data.length > 0) {
			await db.collection('yaocai').doc(id).update({
				views: db.command.inc(1)
			});
			
			return {
				code: 0,
				msg: 'success',
				data: result.data[0]
			};
		}
		
		return {
			errCode: 'NOT_FOUND',
			errMsg: '药材不存在'
		};
	},
	
	/**
	 * 获取热门药材
	 * @param {number} limit 返回数量
	 * @returns {object} 返回热门药材列表
	 */
	async getHotList(limit = 20) {
		const db = uniCloud.database();
		const result = await db.collection('yaocai')
			.orderBy('views', 'desc')
			.limit(limit)
			.get();
		
		return {
			code: 0,
			msg: 'success',
			data: result.data
		};
	},
	
	/**
	 * 搜索药材
	 * @param {string} keyword 搜索关键词
	 * @returns {object} 返回搜索结果
	 */
	async search(keyword) {
		if (!keyword) {
			return {
				errCode: 'KEYWORD_IS_NULL',
				errMsg: '搜索关键词不能为空'
			};
		}
		
		const db = uniCloud.database();
		const result = await db.collection('yaocai')
			.where({
				$or: [
					{ name: new RegExp(keyword, 'i') },
					{ latin_name: new RegExp(keyword, 'i') }
				]
			})
			.get();
		
		return {
			code: 0,
			msg: 'success',
			data: result.data
		};
	},
	
	/**
	 * 根据名称获取药材详情
	 * @param {Object} options 查询参数
	 * @param {string} options.name 药材名称
	 * @returns {object} 返回药材详情
	 */
	async getDetailByName(options) {
		const { name } = options;
		if (!name) {
			return {
				errCode: 'NAME_IS_NULL',
				errMsg: '药材名称不能为空'
			};
		}
		
		const db = uniCloud.database();
		const result = await db.collection('yaocai')
			.where({
				name: name
			})
			.get();
		
		if (result.data && result.data.length > 0) {
			const herbData = result.data[0];
			
			// 增加浏览量
			await db.collection('yaocai').doc(herbData._id).update({
				views: db.command.inc(1)
			});
			
			return {
				code: 0,
				msg: 'success',
				data: herbData
			};
		}
		
		return {
			code: 0,
			msg: 'success',
			data: null
		};
	}
}
