(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/personal/my_download"],{3782:function(n,t,o){"use strict";var e=o("3d54"),u=o.n(e);u.a},"3d54":function(n,t,o){},7774:function(n,t,o){"use strict";(function(n){o("8321");e(o("66fd"));var t=e(o("c199"));function e(n){return n&&n.__esModule?n:{default:n}}n(t.default)}).call(this,o("543d")["createPage"])},"8f6d":function(n,t,o){"use strict";o.r(t);var e=o("d918"),u=o.n(e);for(var i in e)"default"!==i&&function(n){o.d(t,n,(function(){return e[n]}))}(i);t["default"]=u.a},"9b20":function(n,t,o){"use strict";o.d(t,"b",(function(){return u})),o.d(t,"c",(function(){return i})),o.d(t,"a",(function(){return e}));var e={listScroll:function(){return o.e("components/list-scroll/list-scroll").then(o.bind(null,"522f"))},uniLoadMore:function(){return o.e("components/uni-load-more/uni-load-more").then(o.bind(null,"0f98"))},listCard:function(){return o.e("components/list-card/list-card").then(o.bind(null,"921e"))}},u=function(){var n=this,t=n.$createElement;n._self._c},i=[]},c199:function(n,t,o){"use strict";o.r(t);var e=o("9b20"),u=o("8f6d");for(var i in u)"default"!==i&&function(n){o.d(t,n,(function(){return u[n]}))}(i);o("3782");var c,a=o("f0c5"),l=Object(a["a"])(u["default"],e["b"],e["c"],!1,null,null,null,!1,e["a"],c);t["default"]=l.exports},d918:function(n,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var e={data:function(){return{loading:!1,downloadList:[]}},onLoad:function(){this.getDocuments()},methods:{getDocuments:function(){var n=this;this.loading=!0,this.$api.getDownloadAndCollected({type:"download"}).then((function(t){n.loading=!1,0===t.code&&(n.downloadList=t.data)})).catch((function(){n.loading=!1}))}}};t.default=e}},[["7774","common/runtime","common/vendor"]]]);