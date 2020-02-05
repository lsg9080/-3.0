import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'index',
			component: resolve => require(['@/components/index'], resolve),
			meta: {
				title: '营养订餐',
				// keepAlive: true // 需要缓存
			}
		},
		{
			path: '/choice',
			name: 'choice',
			component: resolve => require(['@/components/choice'], resolve),
			meta: {
				title: '营养订餐'
			}
		},
		{
			path: '/login',
			name: 'login',
			component: resolve => require(['@/components/login'], resolve),
			meta: {
				title: '绑定信息'
			}
		},
		{
			path: '/info',
			name: 'info',
			component: resolve => require(['@/components/info'], resolve),
			meta: {
				title: '个人信息'
			}
		},
		{
			path: '/recharge',
			name: 'recharge',
			component: resolve => require(['@/components/recharge'], resolve),
			meta: {
				title: '账户中心'
			}
		},
		{
			path: '/tradeDetails',
			name: 'tradeDetails',
			component: resolve => require(['@/components/tradeDetails'], resolve),
			meta: {
				title: '交易明细'
			}
		},
		{
			path: '/orderList',
			name: 'orderList',
			component: resolve => require(['@/components/orderList'], resolve),
			meta: {
				title: '我的订单'
			}
		},

		{
			path: '/myOrder',
			name: 'myOrder',
			component: resolve => require(['@/components/myOrder'], resolve),
			meta: {
				title: '我的订单'
			}
		},
		{
			path: '/retreat',
			name: 'retreat',
			component: resolve => require(['@/components/retreat'], resolve),
			meta: {
				title: '我要退餐'
			}
		},
		{
			path: '/evaluate',
			name: 'evaluate',
			component: resolve => require(['@/components/evaluate'], resolve),
			meta: {
				title: '我要评价'
			}
		},
		{
			path: '/orderFood',
			name: 'orderFood',
			component: resolve => require(['@/components/orderFood'], resolve),
			meta: {
				title: '明日订餐',
				keepAlive: true // 需要缓存
			}
		},
		{
			path: '/food',
			name: 'food',
			component: resolve => require(['@/components/food'], resolve),
			meta: {
				title: '详情'
			}
		},
		{
			//营养分析
			path: '/analysis',
			name: 'analysis',
			component: resolve => require(['@/components/analysis'], resolve),
		},
		{
			//营养分析
			path: '/analysisShare',
			name: 'analysisShare',
			component: resolve => require(['@/components/analysisShare'], resolve),
		},
		{
			//提交订单成功失败
			path: '/success',
			name: 'success',
			component: resolve => require(['@/components/success'], resolve)
		},
		{
			path: '/articleDetails',
			name: 'articleDetails',
			component: resolve => require(['@/components/articleDetails'], resolve),
			meta: {
				title: '饮食指导'
			}
		},
		{
			path: '/hosNotice',
			name: 'hosNotice',
			component: resolve => require(['@/components/hosNotice'], resolve),
			meta: {
				title: '公告'
			}
		},
		{
			path: '/test',
			name: 'test',
			component: resolve => require(['@/components/test'], resolve)
		},
		{
			path: '/orderFoodNew',
			name: 'orderFoodNew',
			component: resolve => require(['@/components/orderFoodNew'], resolve)
		},
		{
			path: '/success',
			name: 'success',
			component: resolve => require(['@/components/success'], resolve)
		},
    {
    	path: '/loading',
    	name: 'loading',
    	meta: {
    		title: 'loading'
    	}
    },
	]
})
