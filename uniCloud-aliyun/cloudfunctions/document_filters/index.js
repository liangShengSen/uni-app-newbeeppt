'use strict';
const db = uniCloud.database()
const dbCmd = db.command
const $ = db.command.aggregate
exports.main = async (event, context) => {
	let { _keys,stage,subject,version,book,chapter } = event
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
				obj.options = (await db.collection('stages').get()).data
				stage = stage || obj.options[0].id
				obj.value = stage
				break
			case 'subject':
				obj.name = '学科'
				obj.options = (await db.collection('subjects').where({
					stage_ids: stage
				}).get()).data
				subject = subject || obj.options[0].id
				obj.value = subject
				break
			case 'version':
				obj.name = '版本'
				obj.options = (await db.collection('versions').where({
					'stage.id': stage,
					'subject.id': subject
				}).get()).data
				version = version || obj.options[0].id
				obj.value = version
				// 查找对应版本的册别和章节并挂载到版本上
				let versionIds = obj.options.map(version =>{
					return version.id
				})
				let bookRecords = await db.collection('books').aggregate().match({
					'version.id': dbCmd.in(versionIds)
				}).project({
					id: 1,
					name: 1,
					version: 1
				}).end()
				let bookIds = bookRecords.data.map(book =>{
					return book.id
				})
				let chapterRecords = await db.collection('chapters').aggregate().match({
					'book.id': dbCmd.in(bookIds)
				}).project({
					chapters: 1,
					version: 1,
					book: 1
				}).end()
				obj.options.forEach(version => {
					let tempBooks = []
					bookRecords.data.forEach(item => {
						if(version.id === item.version.id) {
							tempBooks.push({
								id: item.id,
								name: item.name
							})
						}
					})
					version.books = tempBooks
					version.book_id = version.books.length ? version.books[0].id : ''
					let tempChapters = []
					chapterRecords.data.forEach(item => {
						if(version.id === item.version.id) {
							tempChapters.push({
								book_id: item.book.id,
								data: item.chapters
							})
						}
					})
					version.chapters = tempChapters
				})
				break
			case 'book':
				obj.name = '册别'
				obj.options = (await db.collection('books').where({
					'stage.id': stage,
					'subject.id': subject,
					'version.id': version
				}).get()).data
				book = book || obj.options[0].id
				obj.value = book
				break
			case 'chapter':
				obj.name = '章节'
				obj.options = (await db.collection('chapters').where({
					'stage.id': stage,
					'subject.id': subject,
					'version.id': version,
					'book.id': book
				}).get()).data[0].chapters
				chapter = chapter || obj.options[0].id
				obj.value = chapter
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
