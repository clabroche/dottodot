(function(e){function t(t){for(var r,o,s=t[0],u=t[1],c=t[2],l=0,f=[];l<s.length;l++)o=s[l],a[o]&&f.push(a[o][0]),a[o]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);p&&p(t);while(f.length)f.shift()();return i.push.apply(i,c||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,o=1;o<n.length;o++){var s=n[o];0!==a[s]&&(r=!1)}r&&(i.splice(t--,1),e=u(u.s=n[0]))}return e}var r={},o={app:0},a={app:0},i=[];function s(e){return u.p+"js/"+({about:"about"}[e]||e)+"."+{about:"55aae1ec"}[e]+".js"}function u(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.e=function(e){var t=[],n={about:1};o[e]?t.push(o[e]):0!==o[e]&&n[e]&&t.push(o[e]=new Promise(function(t,n){for(var r="css/"+({about:"about"}[e]||e)+"."+{about:"d2351a35"}[e]+".css",a=u.p+r,i=document.getElementsByTagName("link"),s=0;s<i.length;s++){var c=i[s],l=c.getAttribute("data-href")||c.getAttribute("href");if("stylesheet"===c.rel&&(l===r||l===a))return t()}var f=document.getElementsByTagName("style");for(s=0;s<f.length;s++){c=f[s],l=c.getAttribute("data-href");if(l===r||l===a)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var r=t&&t.target&&t.target.src||a,i=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");i.request=r,delete o[e],p.parentNode.removeChild(p),n(i)},p.href=a;var d=document.getElementsByTagName("head")[0];d.appendChild(p)}).then(function(){o[e]=0}));var r=a[e];if(0!==r)if(r)t.push(r[2]);else{var i=new Promise(function(t,n){r=a[e]=[t,n]});t.push(r[2]=i);var c,l=document.createElement("script");l.charset="utf-8",l.timeout=120,u.nc&&l.setAttribute("nonce",u.nc),l.src=s(e),c=function(t){l.onerror=l.onload=null,clearTimeout(f);var n=a[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src,i=new Error("Loading chunk "+e+" failed.\n("+r+": "+o+")");i.type=r,i.request=o,n[1](i)}a[e]=void 0}};var f=setTimeout(function(){c({type:"timeout",target:l})},12e4);l.onerror=l.onload=c,document.head.appendChild(l)}return Promise.all(t)},u.m=e,u.c=r,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)u.d(n,r,function(t){return e[t]}.bind(null,r));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="",u.oe=function(e){throw console.error(e),e};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=t,c=c.slice();for(var f=0;f<c.length;f++)t(c[f]);var p=l;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"4cc9":function(e,t,n){"use strict";var r=n("e9e8"),o=n.n(r);o.a},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var r=n("2b0e"),o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},a=[],i=(n("5c0b"),n("2877")),s={},u=Object(i["a"])(s,o,a,!1,null,null,null),c=u.exports,l=n("8c4f"),f=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{},[n("div",{staticClass:"navbar"},[e._v("\n    Dot to Dot\n  ")]),n("div",{staticClass:"draws"},[n("button",{staticClass:"button-add-draw",on:{click:function(t){e.showPopup=!0}}},[n("i",{staticClass:"fas fa-plus"})]),e.showPopup?n("div",{staticClass:"popup"},[n("div",{staticClass:"popup-content"},[n("div",{staticClass:"close",on:{click:function(t){t.stopPropagation(),e.showPopup=!1}}},[n("i",{staticClass:"fas fa-times"})]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.name,expression:"name"}],attrs:{type:"text",placeholder:"Name of this drawing..."},domProps:{value:e.name},on:{input:function(t){t.target.composing||(e.name=t.target.value)}}}),e.name?n("input",{ref:"file",attrs:{type:"file",id:"file"},on:{change:function(t){return e.handleFileUpload()}}}):e._e(),e.name&&e.file?n("button",{on:{click:function(t){return e.submitFile()}}},[e._v("Submit")]):e._e()])]):e._e(),e._l(e.draws,function(t){return n("div",{key:t.id,staticClass:"draw-container",on:{click:function(n){return n.stopPropagation(),e.$router.push("/draws/"+t.id)}}},[n("div",{staticClass:"actions"},[n("button",{on:{click:function(n){return n.stopPropagation(),e.deleteDraw(t)}}},[n("i",{staticClass:"fas fa-times"})]),n("button",{on:{click:function(n){return n.stopPropagation(),e.$router.push("/draws/"+t.id+"/edit")}}},[n("i",{staticClass:"fas fa-edit"})])]),n("img",{attrs:{src:"http://corentinlabroche.fr:2006"+t.dots,alt:""}})])})],2)])},p=[],d=(n("7f7f"),n("96cf"),n("3b8d")),h=n("bc3a"),m=n.n(h),v={name:"home",data:function(){return{draws:[],name:"",file:null,showPopup:!1}},mounted:function(){var e=Object(d["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.getDraws();case 2:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),methods:{getDraws:function(){var e=Object(d["a"])(regeneratorRuntime.mark(function e(){var t,n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,m.a.get("http://corentinlabroche.fr:2006/api/v1/draws",{responseType:"json"});case 2:t=e.sent,n=t.data,this.draws=n;case 5:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),deleteDraw:function(){var e=Object(d["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,m.a.delete("http://corentinlabroche.fr:2006/api/v1/draws/"+t.id);case 2:return e.abrupt("return",this.getDraws());case 3:case"end":return e.stop()}},e,this)}));function t(t){return e.apply(this,arguments)}return t}(),openPopup:function(){this.showPopup=!0},submitFile:function(){if(this.name){var e=new FormData;e.append("file",this.file);var t="http://corentinlabroche.fr:2006/api/v1/draws/"+this.name,n={headers:{"Content-Type":"multipart/form-data"}};m.a.post(t,e,n).then(function(){console.log("SUCCESS!!")}).catch(function(){console.log("FAILURE!!")}),this.file=null,this.name=""}},handleFileUpload:function(){this.file=this.$refs.file.files[0],this.$forceUpdate()}}},g=v,b=(n("4cc9"),Object(i["a"])(g,f,p,!1,null,"11f085d1",null)),w=b.exports;r["a"].use(l["a"]);var y=new l["a"]({mode:"hash",base:"",routes:[{path:"/",name:"home",component:w},{path:"/draws/:id",name:"draw",component:function(){return n.e("about").then(n.bind(null,"5178"))}},{path:"/draws/:id/edit",name:"draw-edit",props:{edit:!0},component:function(){return n.e("about").then(n.bind(null,"5178"))}}]}),k=n("9483");Object(k["a"])("".concat("","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}}),r["a"].config.productionTip=!1,new r["a"]({router:y,render:function(e){return e(c)}}).$mount("#app")},"5c0b":function(e,t,n){"use strict";var r=n("5e27"),o=n.n(r);o.a},"5e27":function(e,t,n){},e9e8:function(e,t,n){}});
//# sourceMappingURL=app.b56e7a09.js.map