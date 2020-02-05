<template>
    <div class="PaymentResults">
        <!-- 支付成功 -->
        <div class="success">
            <img src="../assets/meal/success@2x.png" class="img" />
            <h3>支付成功</h3>
            <div class="operationBtn">
                <div class="home" @click="goHome"></div>
                <div class="btn" v-show="isShowFenXi" @click="analysis">当日营养分析</div>
                <div class="btn" @click="orderList">查看订单</div>
            </div>
        </div>
        <!-- 支付失败 -->
        <!-- <div class="success">
            <img src="../assets/meal/fail@2x.png" class="img" />
            <h3>支付失败</h3>
            <p>网络连接超时</p>
            <div class="operationBtn fail">
                <div class="btn btn2">回首页</div>
                <div class="btn w162">继续支付</div>
            </div>
        </div> -->
        <!-- end -->
    </div>
</template>

<script type="text/ecmascript-6">
import store from '../store'
import storage from '../common/js/storage'
export default {
    data() {
        return {
            patId: '',
            mealDate: '',
            isShowFenXi:false
        }
    },
    created() {
        this.isShowFenXi = this.$route.query.isShowFenXi==1
        // debugger
        this.patId = storage.getItem('patId')
        this.mealDate = storage.getItem('mealDate')
    },
    methods: {
        goHome() {
            this.$router.replace({
                path: '/'
            })
        },
        analysis() {
            this.$router.replace({
                path: 'analysisShare',
                query: {
                    patId: this.patId,
                    mealDate: this.mealDate
                }
            })
        },
        orderList() {
            this.$router.replace({
                path: 'orderList'
            })
        }
    }
    // destroyed(){
    // 	this.$store.commit('changeresultsShow', false)
    // }
}
</script>

<style lang="less" scope>
@import '../common/less/mixin.less';
.PaymentResults {
    position: fixed;
    z-index: 52;
    top: 0;
    left: 0;
	height: 100%;
	width: 100%;
    background: #ffffff;
    padding-top: 66px;
    text-align: center;
    h3 {
        font-size: 18px;
        color: #505050;
        padding-top: 24px;
    }
    p {
        font-size: 18px;
        color: #aaaaaa;
        padding-top: 12px;
    }
    img {
        width: 220px;
        height: 220px;
    }
    .operationBtn {
        display: flex;
        justify-content: space-between;
        margin-top: 99px;
        padding: 0 18px;
        &.fail {
            margin-top: 69px;
        }
        .home {
            width: 57px;
            height: 46px;
            border: 1px solid #d8d8e4;
            border-radius: 27px;
            background: url(../assets/meal/home@2x.png) center center no-repeat;
            background-size: 24px 23px;
        }
        .btn {
            background: #7574f5;
            border-radius: 27px;
            width: 126px;
            height: 46px;
            font-size: 16px;
            color: #ffffff;
            margin-left: 15px;
            .box-c();
            &.btn2 {
                border: 1px solid #d8d8e4;
                background: #ffffff;
                color: #aaaaaa;
                width: 162px;
                margin-left: 0;
            }
            &.w162 {
                width: 162px;
            }
        }
    }
}
</style>