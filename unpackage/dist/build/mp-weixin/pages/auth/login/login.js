(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/auth/login/login"],{"0e3d":function(t,n,e){"use strict";e.r(n);var i=e("0e77"),a=e("c697");for(var o in a)"default"!==o&&function(t){e.d(n,t,(function(){return a[t]}))}(o);e("76ac");var s,u=e("f0c5"),c=Object(u["a"])(a["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],s);n["default"]=c.exports},"0e77":function(t,n,e){"use strict";e.d(n,"b",(function(){return a})),e.d(n,"c",(function(){return o})),e.d(n,"a",(function(){return i}));var i={navbar:function(){return e.e("components/navbar/navbar").then(e.bind(null,"30cc"))}},a=function(){var t=this,n=t.$createElement;t._self._c},o=[]},"76ac":function(t,n,e){"use strict";var i=e("981a"),a=e.n(i);a.a},"981a":function(t,n,e){},b023:function(t,n,e){"use strict";(function(t){e("4b8d");i(e("66fd"));var n=i(e("0e3d"));function i(t){return t&&t.__esModule?t:{default:t}}t(n.default)}).call(this,e("543d")["createPage"])},c697:function(t,n,e){"use strict";e.r(n);var i=e("d4ae"),a=e.n(i);for(var o in i)"default"!==o&&function(t){e.d(n,t,(function(){return i[t]}))}(o);n["default"]=a.a},d4ae:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i=e("31f6"),a={data:function(){return{username:"",password:"",id:""}},onLoad:function(t){this.id=t.id||""},methods:{go_register:function(){t.navigateTo({url:"/pages/auth/register/register"})},login:function(){var n=this;return this.username?i.PHONE.test(this.username)||i.EMAIL.test(this.username)?this.password.length<6||this.password.length>20?(this.$utils.toast("请输入6-20位密码"),!1):(this.$utils.showLoading("登录中"),void this.$api.login({username:this.username,password:this.password}).then((function(e){t.hideLoading(),0===e.code?(t.setStorageSync("uni_id_token",e.token),n.$utils.toast("登录成功",(function(){t.navigateBack({delta:1})}))):n.$utils.toast(e.msg)})).catch((function(e){t.hideLoading(),n.$utils.toast(e.msg)}))):(this.$utils.toast("账号格式错误"),!1):(this.$utils.toast("请输入账号"),!1)},getLoginCode:function(){var n=this;this.$utils.showLoading("微信登录中"),t.login({provider:"weixin",success:function(e){var i=e.code;i&&n.$api.loginByWeixin({code:i}).then((function(e){t.hideLoading(),0===e.code&&(t.setStorageSync("uni_id_token",e.token),t.$emit("subjectChange"),n.$utils.toast("登录成功",(function(){t.navigateBack({delta:1})})))})).catch((function(){t.hideLoading()}))},fail:function(){t.hideLoading()}})}}};n.default=a}).call(this,e("543d")["default"])}},[["b023","common/runtime","common/vendor"]]]);