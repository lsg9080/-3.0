/**
 * 本地存储抽象，方便日后统一优化
 * Created by zhl
 */

const setItem = function (key, value) {
	if (!value) value = ''
	localStorage.setItem(key, value)
}

const getItem = function (key) {
	let value = localStorage.getItem(key)
	if (!value)
		value = ''
	if (key == 'userStatus')
		if (value == 'true')
			return true
		else
			return false
	return value;
}

const setObjItem = function (key, value) {
	if (!value) value = ''
	if (key == 'mycar') {
		// let date = '20191020235959'
		// let currentDate = formatDate(date, 'yyyyMMdd220601');//'yyyyMMdd213959');
		let currentDate = formatDate(new Date(), 'yyyyMMdd235959');//'yyyyMMdd213959');
		key += currentDate
	}
	localStorage.setItem(key, JSON.stringify(value))
}

const getObjItem = function (key) {
	if (key == 'mycar') {
		// let date = '20191020235959'
		let currentDate = formatDate(new Date(), 'yyyyMMdd235959');//'yyyyMMdd213959');
		// if(formatDate(date, 'yyyyMMddhhmmss')>currentDate)
		// 	return [];
		key += currentDate
		//--清空!mycar
		for(var stoKey in localStorage){
			if(stoKey.indexOf('mycar')!=-1&&stoKey!=key){
				localStorage.removeItem(stoKey)
			}
		}
		//end
	}
	let value = localStorage.getItem(key)
	if (!value || value == 'undefined')
		return [];
	// console.log(key)
	return JSON.parse(value)
}

const removeItem = function (key) {
	if (!key) {
		return
	}
	localStorage.removeItem(key)
}

const clearAll = function () {
	localStorage.clear()
}
function formatDate(date, fmt) {
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	};
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + '';
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
		}
	}
	return fmt;
}
function padLeftZero(str) {
	return ('00' + str).substr(str.length);
}

export default {
	setItem,
	getItem,
	removeItem,
	clearAll,
	setObjItem,
	getObjItem
}
