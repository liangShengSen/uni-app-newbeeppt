(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/personal/personal"],{"0ba0":function(e,n,t){"use strict";t.r(n);var i=t("4bd1"),o=t("a3ed");for(var s in o)"default"!==s&&function(e){t.d(n,e,(function(){return o[e]}))}(s);t("2a15");var u,a=t("f0c5"),r=Object(a["a"])(o["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],u);n["default"]=r.exports},"20f4":function(e,n,t){"use strict";(function(e){t("8321");i(t("66fd"));var n=i(t("0ba0"));function i(e){return e&&e.__esModule?e:{default:e}}e(n.default)}).call(this,t("543d")["createPage"])},"2a15":function(e,n,t){"use strict";var i=t("f542"),o=t.n(i);o.a},"4bd1":function(e,n,t){"use strict";t.d(n,"b",(function(){return o})),t.d(n,"c",(function(){return s})),t.d(n,"a",(function(){return i}));var i={uniIcons:function(){return Promise.all([t.e("common/vendor"),t.e("components/uni-icons/uni-icons")]).then(t.bind(null,"e99a"))},uniPopup:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uni-popup/components/uni-popup/uni-popup")]).then(t.bind(null,"bb88"))}},o=function(){var e=this,n=e.$createElement;e._self._c},s=[]},a3ed:function(e,n,t){"use strict";t.r(n);var i=t("c08e"),o=t.n(i);for(var s in i)"default"!==s&&function(e){t.d(n,e,(function(){return i[e]}))}(s);n["default"]=o.a},c08e:function(e,n,t){"use strict";(function(e,i){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=u(t("a34a")),s=t("6316");function u(e){return e&&e.__esModule?e:{default:e}}function a(e,n,t,i,o,s,u){try{var a=e[s](u),r=a.value}catch(c){return void t(c)}a.done?n(r):Promise.resolve(r).then(i,o)}function r(e){return function(){var n=this,t=arguments;return new Promise((function(i,o){var s=e.apply(n,t);function u(e){a(s,i,o,u,r,"next",e)}function r(e){a(s,i,o,u,r,"throw",e)}u(void 0)}))}}var c={data:function(){return{formType:"",userInfo:{username:"",nickname:"",gender:0,mobile:"",email:""},genderArr:[{name:"未设置",value:0},{name:"男",value:1},{name:"女",value:2}]}},computed:{isBindPhone:function(){return s.PHONE.test(this.userInfo.username)}},created:function(){this.getUserInfo()},methods:{showModal:function(e){switch(e){case"mobile":if(this.isBindPhone)return;break;case"email":if(this.userInfo.username&&!this.isBindPhone)return;break}this.formType=e,this.$refs.popup.open()},bindPickerChange:function(n){var t=this;this.userInfo.gender=n.detail.value,this.$utils.showLoading("加载中"),this.$api.updateUserInfo({gender:this.userInfo.gender}).then((function(n){0===n.code&&(e.hideLoading(),t.$utils.toast(n.msg))}))},getUserInfo:function(){var n=this,t=e.getStorageSync("uni_id_token")||"";t&&!this.userInfo._id&&(this.$utils.showLoading("加载中"),this.$api.getUserInfo().then((function(t){e.hideLoading(),0===t.code?n.userInfo=Object.assign(n.userInfo,t.userInfo):n.$utils.toast(t.msg)})).catch((function(n){e.hideLoading()})))},updateUser:function(){var n=this;if(this.userInfo.mobile&&!s.PHONE.test(this.userInfo.mobile))return this.$utils.toast("请输入正确的手机号");if(this.userInfo.email&&!s.EMAIL.test(this.userInfo.email))return this.$utils.toast("请输入正确的邮箱");var t={nickname:this.userInfo.nickname,gender:this.userInfo.gender,mobile:this.userInfo.mobile,email:this.userInfo.email};this.$refs.popup.close(),this.$utils.showLoading("加载中"),this.$api.updateUserInfo(t).then((function(t){0===t.code&&(e.hideLoading(),n.$utils.toast(t.msg))})).catch((function(n){e.hideLoading()}))},setUserAvatar:function(){var n=this;e.chooseImage({count:1,success:function(){var t=r(o.default.mark((function t(s){var u,a,r,c;return o.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return u=s.tempFilePaths[0].substring(s.tempFilePaths[0].lastIndexOf(".")+1),a=s.tempFilePaths[0],r=s.tempFiles[0].name||(new Date).getTime()+"."+u,n.$utils.showLoading("上传中"),t.next=5,i.uploadFile({filePath:a,cloudPath:r});case 5:c=t.sent,c.success&&n.$api.setUserAvatar({avatar:c.fileID}).then((function(t){e.hideLoading(),n.userInfo.avatar=c.fileID,n.$forceUpdate(),0===t.code&&n.$utils.toast(t.msg)}));case 7:case"end":return t.stop()}}),t)})));function s(e){return t.apply(this,arguments)}return s}()})}}};n.default=c}).call(this,t("543d")["default"],t("a9ff")["default"])},f542:function(e,n,t){}},[["20f4","common/runtime","common/vendor"]]]);