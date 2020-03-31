<template>
    <div class="retreat">
        <div class="retreatList">
            <div class="tag"><span>{{getOrderDetail.orderTypeName}}</span></div>
            <div class="orderBlock">
                <dl>
                    <dt>
                        <div>订餐时间：{{getOrderDetail.createTime}}</div>
                        <div class="money">¥{{getOrderDetail.amount}}</div>
                    </dt>
                    <dt>
                        <div>就餐日期：{{getOrderDetail.mealDate}}</div>
                    </dt>
                </dl>
            </div>
            <checkbox-all ref="checkboxAllChild" v-for="(item, index) in getOrderDetail.repastList" :key="index" :retreatList="item" @selectPriceData="selectPriceData"></checkbox-all>
        </div>
        <div class="retreatBottom">
            <div class="wrapper">
                <div class="L">退餐金额：<span class="price">¥ {{checkedPrice}}</span></div>
                <div class="R" @click="RetreatSubmit">确定退订</div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import checkboxAll from './checkboxAll';
import { formatDate, defaultParam } from '../common/js/util'
export default {
    name: 'retreat',
    components:{
        checkboxAll
    },
    data() {
        return {
            getOrderDetail: {},
            selectRepeastPriceArrData:[]
        }
    },
    created() {
        // 获取订餐明细
        this.GetOrderDetail()
    },
    methods: {
		//获取订餐明细
        GetOrderDetail() {
            var _this = this
            let url = this.api.GetOrderDetail
            let addParmas = {
				orderId: _this.$route.query.orderId,   //订单Id
				mergeMenu: 1   //是否合并菜肴  1:合并   0:不合并
			}
            let dParam = defaultParam('', 109)
            let parmas = Object.assign({}, dParam, addParmas)
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(resp => {
                    if (resp.data.code == 0) {
                        _this.getOrderDetail = resp.data.data
                    } else {
                        this.$myToast.error(resp.data.msg)
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
        },
        //退餐
        RetreatSubmit() {
            var _this = this
            //
            let repastList = []
            for(let childCheckbox in _this.$refs.checkboxAllChild){
                    let checkboxList = _this.$refs.checkboxAllChild[childCheckbox].checkboxList
                    if(checkboxList.length>0){
                        //表示选中了
                        repastList.push(_this.$refs.checkboxAllChild[childCheckbox].repastData)
                    }
            }
            if(repastList.length<=0){
                this.$myToast.error('请选择要退餐的菜肴')
            }
            let url = this.api.Retreat
            let addParmas = {
                orderId: _this.$route.query.orderId, //订单Id
                repastList : repastList
                // repastList: [
                //     {
                //         repastId: 1,
                //         menuList: [
                //             {
                //                 kind: '1',
                //                 code: '3008',
                //                 qty: 1
                //             }
                //         ]
                //     }
                // ]
            }
            let dParam = defaultParam('', 113)
			let parmas = Object.assign({}, dParam, addParmas)
			console.log('退餐参数：'+JSON.stringify(parmas))
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(resp => {
                  console.log(resp)
                    if (resp.data.code == 0) {
                        this.$myToast.success('退餐成功')
                        this.$router.go(-1)
                    } else {
                        this.$myToast.error(resp.data.msg)
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
        },
        selectPriceData(data){
            let _this = this
            let selectFoods = _this.selectRepeastPriceArrData.filter(n =>
                n.repastId == data.repastId);
            if(selectFoods.length<=0){
                _this.selectRepeastPriceArrData.push(data)
                return
            }else{
                 selectFoods[0].price = data.price
            }
        }
    },
    computed:{
        checkedPrice(){
            var _this=this
            let price = 0;
            for(let index in _this.selectRepeastPriceArrData){
                price += _this.selectRepeastPriceArrData[index].price
			}
			let realCount = parseFloat(price).toFixed(1);
            return realCount
        }
    }
}
</script>

<style lang="less">
.retreat {
    background: #fff;
    padding-bottom: 66px;
    .retreatList {
        padding: 0 0 5px;
        .tag {
			padding-top: 18px;
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
                    position: relative;
                    top: 12px;
                    font-family: Akrobat-ExtraBold;
                    font-size: 18px;
                    color: #ff8361;
                }
            }
        }
        .checkboxGroup {
            padding: 8px 18px 12px 12px;
            dt {
                font-size: 14px;
                color: #aaaaaa;
                height: 20px;
                display: flex;
                align-items: center;
            }
            dd {
                padding: 0 0 0 30px;
                font-size: 16px;
                color: #505050;
                .item {
                    height: 20px;
                    display: flex;
                    align-items: center;
                    padding-top: 14px;
                    justify-content: space-between;
                    .R {
                        font-size: 14px;
                        color: #aaaaaa;
                        width: 88px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                }
            }
            input {
                margin-right: 10px;
            }
            input[type='checkbox'] {
                width: 20px;
                height: 20px;
                -webkit-appearance: none;
                background-color: transparent;
                border: 0;
                outline: 0 !important;
                color: #d8d8d8;
                position: relative;
            }
            input[type='checkbox']:before {
                content: '';
                display: block;
                width: 20px;
                height: 20px;
                background: url(../assets/account/sel@2x.png) no-repeat center
                    center;
                background-size: 100% 100%;
                box-sizing: border-box;
                position: absolute;
                transform: scale(1);
                transition: all 0.1s;
            }
            input[type='checkbox']:checked:before {
                content: '';
                display: block;
                width: 20px;
                height: 20px;
                background: url(../assets/account/sel-on@2x.png) no-repeat
                    center center;
                background-size: 100% 100%;
                box-sizing: border-box;
                position: absolute;
                transform: scale(1);
            }
        }
    }
    .retreatBottom {
        background: #f6f6f6;
        font-size: 16px;
        color: #aaaaaa;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        .wrapper {
            display: flex;
            height: 54px;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px 0 18px;
            .L {
                line-height: 36px;
                .price {
                    font-family: Akrobat-ExtraBold;
                    font-size: 30px;
                    color: #ff6c42;
                    line-height: 30px;
                    display: inline-block;
                    vertical-align: top;
                }
            }
            .R {
                background: #7574f5;
                border-radius: 19px;
                font-size: 16px;
                color: #ffffff;
                padding: 11px 18px;
            }
        }
    }
}
</style>
