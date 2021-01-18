<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <button type="default" @click="uploadImgs">上传图片</button>
  </view>
</template>

<script>
let jsonData = require("@/puppeteer/json/chapters.json");
export default {
  data() {
    return {
      title: "Hello",
    };
  },
  methods: {
    async uploadImgs() {
		uniCloud.callFunction({
			name: 'chapters',
			success(res) {
				console.log(res);
			}
		})
      // let { data } = jsonData;
      // let arr = [];
      // for (let i = 0; i < data.length; i++) {}
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
