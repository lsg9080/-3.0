<template>
    <div class="orderList">
        <!-- 没有订单 -->
        <div v-show="orderList.length == 0" class="noOrder">
            <img src="../assets/account/no@2x.png" width="220" height="220" />
            <p>您还没有订单！</p>
            <div class="goOrder" @click="goOrder">去下单</div>
        </div>
        <div v-show="orderList.length > 0">
			<div class="account">
				<span>截至目前消费：</span>
				<span class="num">¥{{ orderTimeList.amountTotal }}</span>
			</div>
			<div class="orderItem">
				<div class="orderTop" id="boxFixed" :class="{ is_fixed: isFixed }">
					<div>就餐日期</div>
					<div class="orderTopR">金额</div>
				</div>
				<ul>
					<li
						@click="myOrder(item.mealDate)"
						v-for="(item, index) in orderTimeList.orderList"
						:key="index"
					>
						<div class="itemL">
							{{ item.mealDate }}
							<span class="tips" v-if="item.canRetreat == 1"
								>可退订</span
							>
						</div>
						<div class="itemR">¥{{ item.amount }}</div>
						<i class="more"></i>
					</li>
				</ul>
			</div>
		</div>
    </div>
</template>

<script type="text/ecmascript-6">
import { formatDate, defaultParam } from '../common/js/util'
export default {
    data() {
        return {
            isFixed: false,
            offsetTop: 0,
            orderList: [],
            orderTimeList: []
        }
    },
    created() {
        this.GetOrderList()
    },
    mounted() {
		window.addEventListener('scroll', this.initHeight)
		// 1、挂载完成后，判断浏览器是否支持popstate
		if (window.history && window.history.pushState) { 
			history.pushState(null, null, document.URL); 
			window.addEventListener('popstate', this.goBack, false)
		}
    },
    methods: {
		goBack(){ 
			// 3、将监听操作写在methods里面，removeEventListener取消监听内容必须跟开启监听保持一致，所以函数拿到methods里面写
			this.$router.replace({
				path: '/',
				name: 'index'
			}); //replace替换原路由，作用是避免回退死循环 
		},
        goOrder() {
            this.$router.push({
                path: '/'
            })
        },
        GetOrderList() {
            var _this = this
            let url = this.api.GetOrderList
            let parmas = defaultParam('', 108)
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(resp => {
                    if (resp.data.code == 0) {
                        // console.log(resp.data.data)
						this.orderTimeList = resp.data.data
						this.orderList = resp.data.data.orderList
                        this.$nextTick(() => {
                            this.offsetTop = document.querySelector('#boxFixed').offsetTop
                        })
                    } else {
                        this.$myToast.error(resp.data.msg)
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
        },
        myOrder(mealDate) {
            this.$router.push({
                path: 'myOrder',
                query: {
                    mealDate: mealDate
                }
            })
        },
        initHeight() {
            var scrollTop =
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop
            this.isFixed = scrollTop > this.offsetTop ? true : false
        }
    },
    destroyed() {
		// 2、页面销毁时，取消监听。否则其他vue路由页面也会被监听
		window.removeEventListener('popstate', this.goBack, false);
        window.removeEventListener('scroll', this.handleScroll)
    },
    components: {}
}
</script>

<style lang="less">
@import '../common/less/mixin';
.is_fixed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background: #f4f4f8;
    // color: #505050 !important;
    height: 30px;
    width: 100%;
    padding-bottom: 0 !important;
    padding-left: 24px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
}
/* 
    通过设置top的值，控制固定的位置，0是顶部，值为number(px)
*/
.stickyTop {
    top: 0;
    z-index: 10;
    background: rgba(219, 219, 234, 0.3);
}
.orderList {
    .noOrder {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        font-size: 18px;
        color: #505050;
        margin: 18px;
        padding-top: 75px;
        p {
            padding: 33px 0 99px;
        }
        .goOrder {
            width: 100%;
            .submitBtn();
        }
    }
    .account {
        height: 36px;
        padding-left: 36px;
        border-radius: 4px;
        background: url(../assets/account/total@2x.png) 12px center no-repeat
            rgba(219, 219, 234, 0.3);
        background-size: 18px 18px;
        margin: 12px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #505050;
        .num {
            font-family: Akrobat-ExtraBold;
            font-size: 22px;
            color: #ff8361;
        }
    }
    .orderItem {
        padding: 12px 0 0 24px;
        .orderTop {
            font-size: 14px;
            color: #aaaaaa;
            .border-bottom();
            display: flex;
            justify-content: space-between;
            padding-bottom: 7px;
            .orderTopR {
                position: relative;
                right: 96px;
            }
        }
        ul li {
            .border-bottom();
            padding: 17px 24px 17px 0;
            display: flex;
            justify-content: space-between;
            line-height: 22px;
            position: relative;
            .itemL {
                position: relative;
                font-size: 16px;
                color: #505050;
                .tips {
					background: url(../assets/meal/tip1@2x.png) no-repeat center center;
					background-size: 100% 100%;
					width: 51px;
					height: 20px;
					font-size: 12px;
					display: inline-block;
                    top: -1.5px;
                    height: 20px;
                    line-height: 21px;
                    color: #fff;
					vertical-align: middle;
					padding-left: 9px;
					box-sizing: border-box;
                }
            }
            .itemR {
                min-width: 34px;
                text-align: left;
                position: relative;
                right: 69px;
                font-family: Akrobat-ExtraBold;
                font-size: 22px;
                color: #ff8361;
            }
            .more {
                position: absolute;
                right: 24px;
                top: 16px;
                background: url(../assets/more@2x.png) center center no-repeat;
                background-size: 100% 100%;
                width: 24px;
                height: 24px;
            }
        }
    }
}
</style>