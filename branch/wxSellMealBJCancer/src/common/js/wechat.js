import Vue from 'vue'
import router from '../../router'
import { encryption, formatDate, formatReq } from './util'

export function jsSDK(params) {
	if (typeof window.WeixinJSBridge === 'undefined') {
		if (document.addEventListener) {
			document.addEventListener('WeixinJSBridgeReady', function () { onBridgeReady(params) }, false)
		} else if (document.attachEvent) {
			document.attachEvent('WeixinJSBridgeReady', function () { onBridgeReady(params) })
			document.attachEvent('onWeixinJSBridgeReady', function () { onBridgeReady(params) })
		}
	} else {
		onBridgeReady(params)
	}
}

function onBridgeReady(params) {
	window.WeixinJSBridge.invoke(
		'getBrandWCPayRequest', {
		'appId': params.appId, // 公众号名称，由商户传入
		'timeStamp': params.timeStamp, // 时间戳，自1970年以来的秒数
		'nonceStr': params.nonceStr, // 随机串
		'package': params.package,
		'signType': params.signType, // 微信签名方式：
		'paySign': params.paySign // 微信签名
	},
		function (res) {
			console.log(JSON.stringify(res));
			if (res.err_msg === 'get_brand_wcpay_request:ok') {
				// alert('微信支付成功')
				window.history.back(-1);
			} else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
				alert('用户取消支付')
			} else if (res.err_msg === 'get_brand_wcpay_request:fail') {
				alert('网络异常，请重试')
			}
		}
	)
}
//提交订单使用
export function jsSDK2(params) {
	if (typeof window.WeixinJSBridge === 'undefined') {
		if (document.addEventListener) {
			document.addEventListener('WeixinJSBridgeReady', function () { onBridgeReady2(params) }, false)
		} else if (document.attachEvent) {
			document.attachEvent('WeixinJSBridgeReady', function () { onBridgeReady2(params) })
			document.attachEvent('onWeixinJSBridgeReady', function () { onBridgeReady2(params) })
		}
	} else {
		onBridgeReady2(params)
	}
}

function onBridgeReady2(params) {
	window.WeixinJSBridge.invoke(
		'getBrandWCPayRequest', {
		'appId': params.appId, // 公众号名称，由商户传入
		'timeStamp': params.timeStamp, // 时间戳，自1970年以来的秒数
		'nonceStr': params.nonceStr, // 随机串
		'package': params.package,
		'signType': params.signType, // 微信签名方式：
		'paySign': params.paySign // 微信签名
	},
		function (res) {
			console.log(JSON.stringify(res));
			if (res.err_msg === 'get_brand_wcpay_request:ok') {
				console.log('微信支付成功')
				router.push({
					name:'success'
				})
				console.log(window.location.href)
			} else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
				alert('用户取消支付')
			} else if (res.err_msg === 'get_brand_wcpay_request:fail') {
				alert('网络异常，请重试')
			}
		}
	)
}

