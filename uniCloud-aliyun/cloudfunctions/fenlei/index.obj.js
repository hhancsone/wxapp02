'use strict';
module.exports = {
	_before: function () {
		
	},
	
	async getList() {
		const db = uniCloud.database();
		const collection = db.collection('fenlei');
		
		const result = await collection.orderBy('sort', 'asc').get();
		
		return {
			code: 0,
			msg: 'success',
			data: result.data
		};
	},
	
	async getDetail(fenlei_id) {
		if (!fenlei_id) {
			return {
				errCode: 'ID_NULL',
				errMsg: '分类ID不能为空'
			};
		}
		
		const db = uniCloud.database();
		const collection = db.collection('fenlei');
		
		const result = await collection.doc(fenlei_id).get();
		
		if (result.data && result.data.length > 0) {
			return {
				code: 0,
				msg: 'success',
				data: result.data[0]
			};
		} else {
			return {
				errCode: 'NOT_FOUND',
				errMsg: '分类不存在'
			};
		}
	},
	
	async add(fenleiData) {
		const { name, description, sort } = fenleiData;
		
		if (!name) {
			return {
				errCode: 'NAME_NULL',
				errMsg: '分类名称不能为空'
			};
		}
		
		const db = uniCloud.database();
		const collection = db.collection('fenlei');
		
		const addRes = await collection.add({
			name: name,
			description: description || '',
			sort: sort || 0
		});
		
		return {
			code: 0,
			msg: 'success',
			data: addRes
		};
	},
	
	async update(fenlei_id, fenleiData) {
		if (!fenlei_id) {
			return {
				errCode: 'ID_NULL',
				errMsg: '分类ID不能为空'
			};
		}
		
		const db = uniCloud.database();
		const collection = db.collection('fenlei');
		
		const updateData = {};
		if (fenleiData.name !== undefined) updateData.name = fenleiData.name;
		if (fenleiData.description !== undefined) updateData.description = fenleiData.description;
		if (fenleiData.sort !== undefined) updateData.sort = fenleiData.sort;
		
		const updateRes = await collection.doc(fenlei_id).update(updateData);
		
		return {
			code: 0,
			msg: 'success',
			data: updateRes
		};
	},
	
	async delete(fenlei_id) {
		if (!fenlei_id) {
			return {
				errCode: 'ID_NULL',
				errMsg: '分类ID不能为空'
			};
		}
		
		const db = uniCloud.database();
		const collection = db.collection('fenlei');
		
		const delRes = await collection.doc(fenlei_id).remove();
		
		return {
			code: 0,
			msg: 'success',
			data: delRes
		};
	}
}
