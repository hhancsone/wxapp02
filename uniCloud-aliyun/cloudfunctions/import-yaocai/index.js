'use strict';
const xlsx = require('xlsx');

exports.main = async (event, context) => {
	const db = uniCloud.database();
	const dbCmd = db.command;
	
	const {
		action
	} = event;

	if (action === 'deleteAll') {
		try {
			while (true) {
				const res = await db.collection('yaocai').limit(100).get();
				if (res.data.length === 0) {
					break;
				}
				const allIds = res.data.map(item => item._id);
				await db.collection('yaocai').where({
					_id: dbCmd.in(allIds)
				}).remove();
			}
			
			return {
				success: true,
				message: '删除成功'
			};
		} catch (e) {
			return {
				success: false,
				message: e.message || '删除失败'
			};
		}
	}
	
	if (action === 'importExcelBase64') {
		const fileName = event.fileName;
		const base64Data = event.base64Data;
		
		if (!base64Data || !fileName) {
			return {
				success: false,
				message: '文件数据不能为空'
			};
		}
		
		try {
			const buffer = Buffer.from(base64Data, 'base64');
			const workbook = xlsx.read(buffer, { type: 'buffer' });
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const data = xlsx.utils.sheet_to_json(worksheet);
			
			if (!data || data.length === 0) {
				return {
					success: false,
					message: 'Excel文件为空'
				};
			}
			
			const validData = [];
			for (const item of data) {
				if (item['药材名称']) {
					validData.push({
						name: item['药材名称'] || '',
						latin_name: item['拉丁学名'] || '',
						medicinal_part: item['药用部位'] || '',
						taste: item['性味'] || '',
						meridian: item['归经'] || '',
						efficacy: item['功效'] || '',
						indication: item['主治'] || '',
						category: item['分类'] || '',
						views: item['浏览量'] || 0,
						images: [],
						create_date: Date.now()
					});
				}
			}
			
			const batchSize = 50;
			let successCount = 0;
			
			for (let i = 0; i < validData.length; i += batchSize) {
				const batch = validData.slice(i, i + batchSize);
				try {
					await db.collection('yaocai').add(batch);
					successCount += batch.length;
				} catch (e) {
					for (const item of batch) {
						try {
							await db.collection('yaocai').add(item);
							successCount++;
						} catch (e2) {}
					}
				}
			}
			
			return {
				success: true,
				successCount,
				total: validData.length
			};
		} catch (e) {
			return {
				success: false,
				message: e.message || '导入失败'
			};
		}
	}
	
	if (action === 'importExcel') {
		const filePath = event.filePath;
		
		if (!filePath) {
			return {
				success: false,
				message: '文件路径不能为空'
			};
		}
		
		try {
			const res = await uniCloud.downloadFile({
				fileID: filePath
			});
			
			const workbook = xlsx.readFile(res.tempFilePath);
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const data = xlsx.utils.sheet_to_json(worksheet);
			
			if (!data || data.length === 0) {
				return {
					success: false,
					message: 'Excel文件为空'
				};
			}
			
			const validData = [];
			for (const item of data) {
				if (item['药材名称']) {
					validData.push({
						name: item['药材名称'] || '',
						latin_name: item['拉丁学名'] || '',
						medicinal_part: item['药用部位'] || '',
						taste: item['性味'] || '',
						meridian: item['归经'] || '',
						efficacy: item['功效'] || '',
						indication: item['主治'] || '',
						category: item['分类'] || '',
						views: item['浏览量'] || 0,
						images: [],
						create_date: Date.now()
					});
				}
			}
			
			const batchSize = 50;
			let successCount = 0;
			
			for (let i = 0; i < validData.length; i += batchSize) {
				const batch = validData.slice(i, i + batchSize);
				try {
					await db.collection('yaocai').add(batch);
					successCount += batch.length;
				} catch (e) {
					for (const item of batch) {
						try {
							await db.collection('yaocai').add(item);
							successCount++;
						} catch (e2) {}
					}
				}
			}
			
			return {
				success: true,
				successCount,
				total: validData.length
			};
		} catch (e) {
			return {
				success: false,
				message: e.message || '导入失败'
			};
		}
	}
	
	return {
		success: false,
		message: '未知操作'
	};
};
