<template>
    <div class="myOrder">
        <ul class="myOrderList">
            <li v-for="(item, index) in NewOrderDetailList" :key="index">
                <div class="tag">
                    <span>{{ item.orderTypeName }}</span>
                </div>
                <div class="orderBlock">
                    <dl>
                        <dt>
                            <div>订餐时间：{{ item.createTime }}</div>
                            <div class="money">¥{{ item.amount }}</div>
                        </dt>
                        <dt>
                            <div>就餐日期：{{ item.mealDate }}</div>
                            <div>订餐方式：{{ item.orderFromName }}</div>
                        </dt>
                    </dl>
                </div>
                <div class="mealTimesList">
                    <div
                        class="item"
                        v-for="(meal, index) in item.repastList"
                        :key="index"
                    >
                        <div class="tit">{{ meal.repastName }}</div>
                        <div
                            class="foodList"
                            v-for="(menu, index) in meal.menuList"
                            :key="index"
                        >
                            <div class="foodListL">
                                <span>{{ menu.name }}</span>
                                <span v-show="menu.statusText" class="retreatTag">{{menu.statusText}}</span>
                            </div>
                            <div class="foodListR">
                                <div class="num">×{{ menu.qty }}</div>
                                <div class="price">¥{{ menu.price }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 一个餐次结束 -->
                    <!-- 操作按钮start -->
                    <div class="operationBtn">
						<!--订单状态  0：有效，1：已退餐 -->
						<template v-if="item.status == 0">
							<button
								v-if="item.canEvaluate == 1"
								class="evaluateBtn"
								@click="evaluateBtn(item.orderId)"
							>
								我要评价
							</button>
							<template v-if="item.isShowBtn">
								<button
									v-if="item.canRetreat == 1"
									class="retreatBtn"
									@click="retreatBtn(item.orderId, item.retreatEndTime)"
								>
									我要退餐
								</button>
							</template>
							
							<button
								@click="lookEvaluate(item.orderId)"
								class="lookBtn"
								v-if="item.canEvaluate == 2"
							>
								查看评价
							</button>
						</template>
						<template v-else>
							<div class="retired">
								{{item.statusText}}
							</div>
						</template>
                    </div>
                    <!-- 操作按钮end -->
                </div>
            </li>
            <!-- 一个订单end -->
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
import { formatDate, defaultParam } from '../common/js/util'
export default {
    name: 'myOrder',
    data() {
        return {
            mealDate: '',
			orderList: [],
			retreatEndTime: ''
        }
	},
	computed: {
		NewOrderDetailList(){
			let orderArr = this.orderList
			let newOrderList = []
			var currentTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss').replace(/-/g, "/")
			for(let i =0;i<orderArr.length;i++){
				// debugger
				let retreatEndTime = orderArr[i].retreatEndTime.replace(/-/g, "/")
				let seconds= this.difference(currentTime,retreatEndTime)
				if(seconds == '2'){  //未超时
					orderArr[i].isShowBtn = true
				}else{
					orderArr[i].isShowBtn = false
				}
				newOrderList.push(orderArr[i])
			}
			return newOrderList
		}
	},
    created() {
        this.mealDate = this.$route.query.mealDate
        this.GetOrderDetailList()
    },
    methods: {
        GetOrderDetailList() {
            var _this = this
            let url = this.api.GetOrderDetailList
            let addParmas = { mealDate: _this.mealDate }
            let dParam = defaultParam('', 155)
            let parmas = Object.assign({}, dParam, addParmas)
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(resp => {
                    if (resp.data.code == 0) {
                        // console.log(resp.data.data)
						_this.orderList = resp.data.data
						resp.data.data.forEach(item => {
							this.$set(item, 'isShowBtn', false)
							// this.$set(item, 'retreatEndTime', '2019-10-26 16:00')
						})
                    } else {
                        this.$myToast.error(resp.data.msg)
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
		},
		difference: function (beginTime, endTime) {
			// debugger
			var dateBegin = new Date(beginTime);
			var dateEnd = new Date(endTime);
			var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
			var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
			var leave1 = dateDiff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
			var hours = Math.floor(leave1 / (3600 * 1000));//计算出小时数
			//计算相差分钟数
			var leave2 = leave1 % (3600 * 1000);   //计算小时数后剩余的毫秒数
			var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
			//计算相差秒数
			var leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数
			var seconds = Math.round(leave3 / 1000);

			if(dayDiff <= 0 && hours <= 0 && minutes <= 1){
				return '1'
			}
			return '2'
		},
		// 退餐 todo
		// 1、点击的时候比较一下  退餐截止时间和当前时间 之差
		// 2、进入页面后判断时间差，若小于1分钟则不显示
        retreatBtn(orderId, retreatEndTime) {
			//this.orderList.retreatEndTime  退餐截至时间
			let currentTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
			var time1 = new Date(currentTime).getTime();
			var time2 = new Date(retreatEndTime).getTime();
			if(time1 > time2){
				this.$myToast.error('超过退餐截止时间')
				return
			}

            this.$router.push({
				name: 'retreat',
				query: {
					orderId: orderId
				}
            })
        },
        //去评价
        evaluateBtn(orderId) {
            this.$router.push({
                name: 'evaluate',
				query: {
					orderId: orderId,
					from: 1
				}
            })
        },
        //查看评价
        lookEvaluate(orderId) {
            this.$router.push({
                name: 'evaluate',
				query: {
					orderId: orderId,
					from: 2
				}
            })
        }
    }
}
</script>

<style lang="less">
@import '../common/less/mixin';
.myOrder {
    background: #fff;
    .myOrderList {
        li {
            border-bottom: 10px solid #f6f6f6;
            padding: 18px 0;
            &:last-child {
                border: none;
            }
            .tag {
                span {
                    background: #7574f5;
                    border-radius: 11px;
                    color: #fff;
                    font-size: 14px;
                    padding: 4px 8px;
                    display: inline-block;
                    margin-left: 18px;
                }
            }
            .orderBlock {
                border-radius: 4px;
                background: rgba(219, 219, 234, 0.3);
                padding: 10px 12px;
                font-size: 12px;
                color: #aaaaaa;
                margin: 12px;
                dl dt {
                    display: flex;
                    justify-content: space-between;
                    line-height: 18px;
                    &:first-child {
                        padding-bottom: 4px;
                    }
                    .money {
                        font-family: Akrobat-ExtraBold;
                        font-size: 18px;
                        color: #ff8361;
                    }
                }
            }
            .mealTimesList {
                .item {
                    padding: 0 18px 18px;
                    .tit {
                        font-size: 14px;
                        color: #aaaaaa;
                    }
                    .foodList {
                        display: flex;
                        justify-content: space-between;
                        padding-top: 11px;
                        .foodListL {
                            width: 74%;
                            font-size: 16px;
                            color: #505050;
                            position: relative;
                            padding-right: 30px;
                            box-sizing: border-box;
                            .retreatTag {
                                background: url(../assets/account/retreat@2x.png)
                                    center center no-repeat;
                                background-size: 100% 100%;
                                width: 39px;
                                height: 20px;
                                font-size: 12px;
                                color: #ff8361;
                                display: inline-block;
                                text-align: center;
                                line-height: 22px;
                                margin-left: 4px;
                                // .BubbleFrame();
                                // background: #fff9f8;
                                // border: 1px solid #ffd6cb;
                                // &::after {
                                //     border-color: transparent #ffd6cb
                                //         transparent transparent;
                                // }
                            }
                        }
                        .foodListR {
                            width: 26%;
                            font-size: 14px;
                            line-height: 20px;
                            color: #aaaaaa;
                            display: flex;
                            justify-content: space-between;
                        }
                    }
                }
                .operationBtn {
                    position: relative;
                    margin-top: 1px;
                    padding-right: 18px;
                    display: flex;
					flex-direction: row-reverse;
					height: 30px;
                    button {
                        border: none;
                        background: none;
                        border: 1px solid #7574f5;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #7574f5;
                        min-width: 92px;
                        height: 30px;
                        padding-left: 28px;
                        margin-left: 12px;
                        &.evaluateBtn {
                            background: url(../assets/account/order2@2x.png) 8px
                                center no-repeat;
                            background-size: 14px 14px;
                        }
                        &.retreatBtn {
                            background: url(../assets/account/order3@2x.png) 8px
                                center no-repeat;
                            background-size: 16px 15px;
                        }
                        &.lookBtn {
                            background: url(../assets/account/order1@2x.png) 8px
                                center no-repeat;
                            background-size: 15px 16px;
                        }
                    }
                    .retired {
                        position: absolute;
                        left: 10px;
                        background: url(../assets/account/order4@2x.png) 8px
                            6px no-repeat;
                        background-size: 16px 15px;
                        font-size: 14px;
                        color: #aaaaaa;
                        width: 92px;
                        height: 30px;
                        padding-left: 28px;
                        display: flex;
                        align-items: center;
                    }
                }
            }
        }
    }
}
</style>