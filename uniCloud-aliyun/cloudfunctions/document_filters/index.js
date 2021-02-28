'use strict';
const db = uniCloud.database()
const dbCmd = db.command
const $ = db.command.aggregate
exports.main = async (event, context) => {
	let {
		_keys,
		stage,
		subject,
		version,
		grade
	} = event
	if (!_keys) {
		return {
			code: 1,
			msg: '_keys不能为空'
		}
	}
	let keys = _keys.split(','),
		data = [];
	for (let i = 0; i < keys.length; i++) {
		let res = null,
			obj = {
				key: keys[i]
			}
		switch (keys[i]) {
			case 'stage':
				res = await db.collection('stages').get()
				obj.options = res.data
				obj.value = stage || obj.options[0]._id
				stage = obj.value
				break
			case 'subject':
				res = await db.collection('subjects').where({
					stage_ids: stage,
					status: 1
				}).orderBy('order', 'asc').get()
				obj.options = res.data
				obj.value = subject || obj.options[0]._id
				subject = obj.value
				break
			case 'version':
				res = await db.collection('versions').where({
					'stage.value': stage,
					'subject.value': subject
				}).orderBy('order', 'asc').get()
				obj.options = res.data
				obj.value = version || (obj.options[0] && obj.options[0]._id)
				version = obj.value
				// 给版本添加对应章节
				let allBooks = await db.collection('books').get(),
					allChapters = await db.collection('chapters').get()
				obj.options.forEach(v => {
					v.books = []
					v.chapters = []
					v.index = 0
					allBooks.data.forEach(b => {
						if(v._id === b.version.value) {
							v.books.push(b)
						}
					})
					v.books.forEach(b => {
						allChapters.data.forEach(c => {
							if(b._id === c.book.value) {
								v.chapters.push(c)
							}
						})
					})
				})
				break
			case 'grade':
				res = await db.collection('grades').where({
					'stage.value': stage
				}).orderBy('order', 'asc').get()
				obj.options = res.data
				obj.value = grade || (obj.options[0] && obj.options[0]._id)
				grade = obj.value
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
