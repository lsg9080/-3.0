/**
 * 读取build之后的代码 实现vue打包后生成配置文件用以外部修改公共路径
 * 
 */
import Vue from 'vue'
import axios from './http'

// 请求配置文件内容
export default () => {
	return new Promise((resolve, reject) => {
		axios.get('../static/serverConfig.json').then((result) => {
			console.log(result)
			let config = result.data;
			for (let key in config) {
				Vue.prototype[key] = config[key];
			}
			
			// 设置接口地址
			const webApi = config.webApi   //微信相关
			const SApi = config.SApi//外网
			const PApi = config.PApi
			const userApi = {
				GetSetting: PApi + '/api/PatientMeal/GetSetting',  //获取基本信息
				GetBanner: SApi + '/api/WeChat/GetBannerList',  //获取首页轮播图
				GetActicleList: SApi + '/api/WeChat/GetActicleList',  //获取营养宣教列表
				GetActicleDetails: SApi + '/api/WeChat/GetActicleDetails',  //获取获取文章详细信息
				GetMainModuleList: PApi + '/api/PatientMeal/GetMainModuleList',    //获取模块列表
				GetModuleList: PApi + '/api/PatientMeal/GetModuleList',   //获取点餐页面点餐模式
				GetIllness: SApi + '/api/WeChat/GetIllness',     //获取首页文章疾病分类
				GetNotice: SApi + '/api/WeChat/GetNotice',    //获取医院公告
				GetOpenid: webApi + '/api/Patient/GetOpenid',   //获取GetOpenid
				GetSignature: webApi + '/api/Patient/GetSignature',  //获取微信JSSDK签名
				GetSmsCode: PApi + '/api/PatientMeal/GetSmsCode',   //获取短信验证码
				BindingPatient: PApi + '/api/PatientMeal/BindingPatient',  //病人信息绑定
				GetPatientInfo: PApi + '/api/PatientMeal/GetPatientInfo', //查询病人信息
				BindingDelete: PApi + '/api/PatientMeal/BindingDelete',   //解除绑定
				GetAccountDetailList: PApi + '/api/PatientMeal/GetAccountDetailList',  //交易明细
				GetPrepayid: webApi + '/api/Patient/GetPrepayid',   //预支付
				GetRepastList: PApi + '/api/PatientMeal/GetRepastList', //获取餐次列表
				GetMenuList: PApi + '/api/PatientMeal/GetMenuList', //获取订餐食谱
				GetMenuInfo: PApi + '/api/PatientMeal/GetMenuInfo', //获取菜肴信息
				GetPatientName: PApi + '/api/PatientMeal/GetPatientName',   //获取腕带扫描后的信息

				CheckOrderExist: PApi + '/api/PatientMeal/CheckOrderExist', //检查是否已订餐
				SubmitOrder: PApi + '/api/PatientMeal/SubmitOrder', //提交订单
				GetPaymentList: PApi + '/api/PatientMeal/GetPaymentList',   //获取支付方式列表

				GetOrderList: PApi + '/api/PatientMeal/GetOrderList',   //获取订单列表（日期）
				GetOrderDetailList: PApi + '/api/PatientMeal/GetOrderDetailList',   //获取订单及明细列表
				GetOrderDetail: PApi + '/api/PatientMeal/GetOrderDetail',    //获取订餐明细
				Retreat: PApi + '/api/PatientMeal/Retreat',  //退餐
				GetOrderEvaluationItemList: PApi + '/api/PatientMeal/GetOrderEvaluationItemList',   //获取订单评价项目列表
				OrderEvaluation: PApi + '/api/PatientMeal/OrderEvaluation',   //订单评价
				GetOrderEvaluation: PApi + '/api/PatientMeal/GetOrderEvaluation',  //获取订单评价内容

				GetDayNutrientInfo: PApi + '/api/PatientMeal/GetDayNutrientInfo', //获取全天营养信息
				GetAllMenuNutrientInfo: PApi + '/api/PatientMeal/GetAllMenuNutrientInfo', //获取提交订单前营养信息

				OrderPaid: PApi + '/api/PatientMeal/OrderPaid',
			}
			Vue.prototype.api = userApi

			console.log(Vue.prototype.api)  // 验证是否已经把属性挂在了Vue上
			resolve();
		}).catch((error) => {
			console.log(error);
			reject()
		})
	})
}