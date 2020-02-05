import wx from 'weixin-js-sdk'			//微信sdk依赖
import http from '../../request/http'		// 封装的axios
import api from '../../request/api'		// 封装的axios
const jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
//要用到微信API
import { encryption } from './util'
import qs from 'qs'

function getJSSDK(pageURL, dataForWeixin) {
	let url = api.userApi.GetSignature
	let authCode = encryption('wx_wincome', 306)
	let params = {
		authCode: authCode,
		weixinNo: 'wx_wincome',
		callFrom: 'wincome',
		pageURL: pageURL
	}
	http.post(url, qs.stringify(params)).then(res => {
		console.log(`获取微信签名参数：${res.data.nonceStr}`)
		wx.config({
			debug: true,
			appId: res.data.appId, // 必填,公众号的唯一标识
			timestamp: res.data.timeStamp, // 必填,生成签名的时间戳
			nonceStr: res.data.nonceStr, // 必填,生成签名的随机串
			signature: res.data.paySign, // 必填,签名
			jsApiList: jsApiList // 必填,需要使用的JS接口列表
		})
		wx.ready(function () {
			//分享给朋友
			wx.onMenuShareAppMessage({
				title: dataForWeixin.title,
				desc: dataForWeixin.desc,
				link: dataForWeixin.linkurl,
				imgUrl: dataForWeixin.img,
				trigger: function trigger(res) { },
				success: function success(res) {
					console.log('已分享');
				},
				cancel: function cancel(res) {
					console.log('已取消');
				},
				fail: function fail(res) {
					alert(JSON.stringify(res));
				}
			});
			// 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
			wx.onMenuShareTimeline({
				title: dataForWeixin.title,
				link: dataForWeixin.linkurl,
				imgUrl: dataForWeixin.img,
				trigger: function trigger(res) {
					// alert('用户点击分享到朋友圈');
				},
				success: function success(res) {
					//alert('已分享');
				},
				cancel: function cancel(res) {
					//alert('已取消');
				},
				fail: function fail(res) {
					alert(JSON.stringify(res));
				}
			});
			// 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
			wx.onMenuShareQQ({
				title: dataForWeixin.title,
				desc: dataForWeixin.desc,
				link: dataForWeixin.linkurl,
				imgUrl: dataForWeixin.img,
				trigger: function trigger(res) {
					//alert('用户点击分享到QQ');
				},
				complete: function complete(res) {
					alert(JSON.stringify(res));
				},
				success: function success(res) {
					//alert('已分享');
				},
				cancel: function cancel(res) {
					//alert('已取消');
				},
				fail: function fail(res) {
					//alert(JSON.stringify(res));
				}
			});
			// 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
			wx.onMenuShareWeibo({
				title: dataForWeixin.title,
				desc: dataForWeixin.desc,
				link: dataForWeixin.linkurl,
				imgUrl: dataForWeixin.img,
				trigger: function trigger(res) {
					//alert('用户点击分享到微博');
				},
				complete: function complete(res) {
					// alert(JSON.stringify(res));
				},
				success: function success(res) {
					//alert('已分享');
				},
				cancel: function cancel(res) {
					// alert('已取消');
				},
				fail: function fail(res) {
					// alert(JSON.stringify(res));
				}
			});
		})
		wx.error(function (res) {
			alert("微信验证失败");
		});
	})
}
export default {
	// 获取JSSDK
	getJSSDK: getJSSDK
}