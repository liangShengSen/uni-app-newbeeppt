(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/collect/collect"],{"0bdc":function(t,e,n){"use strict";var i=n("904f"),c=n.n(i);c.a},"212f":function(t,e,n){"use strict";n.d(e,"b",(function(){return c})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return i}));var i={uniIcons:function(){return Promise.all([n.e("common/vendor"),n.e("components/uni-icons/uni-icons")]).then(n.bind(null,"e99a"))}},c=function(){var t=this,e=t.$createElement;t._self._c},o=[]},2441:function(t,e,n){"use strict";n.r(e);var i=n("212f"),c=n("55b5");for(var o in c)"default"!==o&&function(t){n.d(e,t,(function(){return c[t]}))}(o);n("0bdc");var l,u=n("f0c5"),a=Object(u["a"])(c["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],l);e["default"]=a.exports},"55b5":function(t,e,n){"use strict";n.r(e);var i=n("e516"),c=n.n(i);for(var o in i)"default"!==o&&function(t){n.d(e,t,(function(){return i[t]}))}(o);e["default"]=c.a},"904f":function(t,e,n){},e516:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={props:{item:{type:Object,default:function(){return{}}},isDetail:{type:Boolean,default:null},collect:{type:Boolean,default:!1}},data:function(){return{isCollect:!1}},watch:{item:function(t){this.isCollect=this.item.is_collect}},created:function(){this.isCollect=this.item.is_collect},methods:{collecting:function(){var e=this;this.$utils.showLoading("加载中"),this.$api.collect_documents({document_id:this.item._id}).then((function(n){t.hideLoading(),0===n.code&&(e.isCollect=!e.isCollect,t.showToast({title:e.isCollect?"收藏成功":"取消收藏",icon:"none"}),(e.isDetail||e.collect)&&t.$emit("update_doc_status"),e.collect&&t.$emit("update_collected",{_id:e.item._id}))})).catch((function(){t.hideLoading()}))}}};e.default=n}).call(this,n("543d")["default"])}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/collect/collect-create-component',
    {
        'components/collect/collect-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("2441"))
        })
    },
    [['components/collect/collect-create-component']]
]);