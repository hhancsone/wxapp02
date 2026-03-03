'use strict';
module.exports = {
	_before: function () {
		
	},
	
	async addCollection(herbInfo) {
		const { herb_id, herb_name, herb_image, user_id, user_nickname } = herbInfo;
		
		if (!herb_id) {
			return {
				errCode: 'HERB_ID_NULL',
				errMsg: '药材ID不能为空'
			};
		}
		
		if (!user_id) {
			return {
				errCode: 'NOT_LOGGED_IN',
				errMsg: '请先登录'
			};
		}
		
		const db = uniCloud.database();
		const collection = db.collection('shoucang');
		
		const checkRes = await collection.where({
			user_id: user_id,
			herb_id: herb_id
		}).get();
		
		if (checkRes.data && checkRes.data.length > 0) {
			return {
				errCode: 'ALREADY_COLLECTED',
				errMsg: '已经收藏过了'
			};
		}
		
		const addRes = await collection.add({
			user_id: user_id,
			user_nickname: user_nickname || '用户',
			herb_id: herb_id,
			herb_name: herb_name,
			herb_image: herb_image,
			create_date: Date.now()
		});
		
		return {
			code: 0,
			msg: 'success',
			data: addRes
		};
	},
	
	async removeCollection(herb_id, user_id) {
		if (!herb_id) {
			return {
				errCode: 'HERB_ID_NULL',
				errMsg: '药材ID不能为空'
			};
		}
		
		if (!user_id) {
			return {
				errCode: 'NOT_LOGGED_IN',
				errMsg: '请先登录'
			};
		}
		
		const db = uniCloud.database();
		const collection = db.collection('shoucang');
		
		const delRes = await collection.where({
			user_id: user_id,
			herb_id: herb_id
		}).remove();
		
		return {
			code: 0,
			msg: 'success',
			data: delRes
		};
	},
	
	async getMyCollections(user_id) {
		if (!user_id) {
			return {
				errCode: 'NOT_LOGGED_IN',
				errMsg: '请先登录',
				data: []
			};
		}
		
		const db = uniCloud.database();
		const collection = db.collection('shoucang');
		
		const result = await collection.where({
			user_id: user_id
		}).orderBy('create_date', 'desc').get();
		
		return {
			code: 0,
			msg: 'success',
			data: result.data
		};
	},
	
	async checkIsCollected(herb_id, user_id) {
		if (!herb_id) {
			return {
				errCode: 'HERB_ID_NULL',
				errMsg: '药材ID不能为空',
				data: false
			};
		}
		
		if (!user_id) {
			return {
				code: 0,
				msg: 'success',
				data: false
			};
		}
		
		const db = uniCloud.database();
		const collection = db.collection('shoucang');
		
		const result = await collection.where({
			user_id: user_id,
			herb_id: herb_id
		}).get();
		
		return {
			code: 0,
			msg: 'success',
			data: result.data && result.data.length > 0
		};
	}
}
