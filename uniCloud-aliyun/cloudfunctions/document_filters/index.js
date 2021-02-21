'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const { _keys,stage,subject,version,book,chapter } = event
	if(!_keys) {
		return {
			code: 1,
			msg: '_keys不能为空'
		}
	}
	let keys = _keys.split(','),data = []
	for(let i = 0; i < keys.length; i++) {
		let obj = {
			key: keys[i]
		}
		switch(keys[i]) {
			case 'stage':
				obj.name = '学段'
				obj.value = stage || ''
				obj.options = (await db.collection('stages').get()).data
				break
			case 'subject':
				obj.name = '学科'
				obj.value = subject || ''
				obj.options = (await db.collection('subjects').where({
					stage_ids: stage
				}).get()).data
				break
			case 'version':
				obj.name = '版本'
				obj.value = version || ''
				obj.options = (await db.collection('versions').where({
					'stage.id': stage,
					'subject.id': subject
				}).get()).data
				break
			case 'book':
				obj.name = '册别'
				obj.value = book || ''
				obj.options = (await db.collection('books').where({
					'stage.id': stage,
					'subject.id': subject,
					'version.id': version
				}).get()).data
				break
			case 'chapter':
				obj.name = '章节'
				obj.value = chapter || ''
				obj.options = (await db.collection('chapters').where({
					'stage.id': stage,
					'subject.id': subject,
					'version.id': version,
					'book.id': book
				}).get()).data
				break
		}
		data.push(obj)
	}
	return {
		code: 0,
		msg: 'success',
		data
	}
};
