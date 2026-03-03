// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	/**
	 * 添加识别记录
	 * @param {Object} options 识别记录信息
	 * @param {string} options.药材名称 药材名称
	 * @param {number} options.匹配度 匹配度
	 * @param {string} options.用户ID 用户ID
	 * @param {string} options.用户昵称 用户昵称
	 * @param {string} options.图片URL 图片URL
	 * @param {string} options.拉丁名 拉丁名
	 * @returns {object} 返回添加结果
	 */
	async addRecord(options) {
		const { 药材名称, 匹配度, 用户ID, 用户昵称, 图片URL, 拉丁名 } = options;
		
		// 参数校验
		if (!药材名称 || !匹配度 || !用户ID) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '药材名称、匹配度和用户ID不能为空'
			};
		}
		
		const db = uniCloud.database();
		const result = await db.collection('shibie').add({
			"药材名称": 药材名称,
			"匹配度": 匹配度,
			"用户ID": 用户ID,
			"用户昵称": 用户昵称 || '用户',
			"图片URL": 图片URL || '',
			"拉丁名": 拉丁名 || '',
			"识别时间": Date.now()
		});
		
		return {
			code: 0,
			msg: 'success',
			data: {
				record_id: result.id
			}
		};
	},
	
	/**
	 * 获取用户识别记录列表
	 * @param {string} user_id 用户ID
	 * @param {number} limit 每页数量
	 * @param {number} offset 偏移量
	 * @returns {object} 返回记录列表
	 */
	async getUserRecords(user_id, limit = 20, offset = 0) {
		if (!user_id) {
			return {
				errCode: 'USER_ID_IS_NULL',
				errMsg: '用户ID不能为空'
			};
		}
		
		const db = uniCloud.database();
		const countResult = await db.collection('shibie').where({ "用户ID": user_id }).count();
		const result = await db.collection('shibie')
			.where({ "用户ID": user_id })
			.orderBy('识别时间', 'desc')
			.limit(limit)
			.skip(offset)
			.get();
		
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
	 * 获取识别记录详情
	 * @param {string} record_id 记录ID
	 * @returns {object} 返回记录详情
	 */
	async getRecordDetail(record_id) {
		if (!record_id) {
			return {
				errCode: 'RECORD_ID_IS_NULL',
				errMsg: '记录ID不能为空'
			};
		}
		
		const db = uniCloud.database();
		const result = await db.collection('shibie').doc(record_id).get();
		
		if (result.data && result.data.length > 0) {
			return {
				code: 0,
				msg: 'success',
				data: result.data[0]
			};
		}
		
		return {
			errCode: 'RECORD_NOT_FOUND',
			errMsg: '记录不存在'
		};
	},
	
	/**
	 * 删除识别记录
	 * @param {string} record_id 记录ID
	 * @param {string} user_id 用户ID
	 * @returns {object} 返回删除结果
	 */
	async deleteRecord(record_id, user_id) {
		if (!record_id || !user_id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '记录ID和用户ID不能为空'
			};
		}
		
		const db = uniCloud.database();
		const record = await db.collection('shibie').doc(record_id).get();
		
		if (!record.data || record.data.length === 0) {
			return {
				errCode: 'RECORD_NOT_FOUND',
				errMsg: '记录不存在'
			};
		}
		
		if (record.data[0]["用户ID"] !== user_id) {
			return {
				errCode: 'PERMISSION_DENIED',
				errMsg: '无权限删除此记录'
			};
		}
		
		await db.collection('shibie').doc(record_id).remove();
		
		return {
			code: 0,
			msg: 'success'
		};
	},
	
	/**
	 * 获取识别统计信息
	 * @param {string} user_id 用户ID
	 * @returns {object} 返回统计信息
	 */
	async getStatistics(user_id) {
		if (!user_id) {
			return {
				errCode: 'USER_ID_IS_NULL',
				errMsg: '用户ID不能为空'
			};
		}
		
		const db = uniCloud.database();
		const countResult = await db.collection('shibie').where({ "用户ID": user_id }).count();
		
		// 获取最近的识别记录
		const recentResult = await db.collection('shibie')
			.where({ "用户ID": user_id })
			.orderBy('识别时间', 'desc')
			.limit(5)
			.get();
		
		return {
			code: 0,
			msg: 'success',
			data: {
				total_records: countResult.total,
				recent_records: recentResult.data
			}
		};
	}
}
