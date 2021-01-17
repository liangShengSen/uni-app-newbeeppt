const fs = require('fs');
const axios = require('axios');
const num = 100000

const sortTreeData = (Data) => {
    var T, F
    for (F = Data.length; F; ) {
      T = Data[--F]
	  delete T['label']
	  delete T['value']
	  T['id'] = String(T['id'])
      if (T['children']) {
        sortTreeData(T['children'])
      }
    }
    return Data
  }

(async () => {
	let params = {
		_keys:"chapter",
		stage: 1,
		subject: 2,
		version:141764,
		book: 160576
	}
	let res = await axios.get('https://www.51jiaoxi.com/api/documents/filters',{
		params
	})
	let data = res.data.data
	let chapters = data[0].options
	let arr = await sortTreeData(chapters)
	let chapterData = {
		stage_id:"1",
		subject_id:"2",
		version_id:"1000",
		book_id: "10011",
		chapters: arr,
		status: "1"
	}
	fs.writeFileSync('./json/chapters.json', JSON.stringify(chapterData));
	
})();
