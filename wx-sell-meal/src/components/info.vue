<template>
    <div class="info">
        <div class="infoTop"></div>
        <ul class="infoList">
            <li>
                <div class="infoL">住院号</div>
                <div class="infoR">{{ info.patNo }}</div>
            </li>
            <li>
                <div class="infoL">姓名</div>
                <div class="infoR">{{ info.patName }}</div>
            </li>
            <li>
                <div class="infoL">科室</div>
                <div class="infoR">{{ info.deptName }}</div>
            </li>
            <li>
                <div class="infoL">床号</div>
                <div class="infoR">{{ info.bedNo }}</div>
            </li>
            <li>
                <div class="infoL">饮食医嘱</div>
                <div class="infoR">{{ info.mealName }}</div>
            </li>
            <li>
                <div class="infoL">手机号</div>
                <div class="infoR">{{ info.mobile }}</div>
            </li>
        </ul>
        <p class="noteTxt">上述信息的更新可能延迟，请以实际为准！</p>
        <div class="UnboundBtn" @click="UnboundBtn">解除绑定</div>
    </div>
</template>

<script type="text/ecmascript-6">
import store from '../store'
import storage from '../common/js/storage'
import { encryption, formatDate, formatReq, defaultParam } from '../common/js/util'
export default {
    name: 'info',
    data() {
        return {
            info: ''
        }
    },
    created() {
        this.GetPatientInfo()
    },
    methods: {
        GetPatientInfo() {
            var _this = this
            let url = this.api.userApi.GetPatientInfo
			let parmas = defaultParam('', 102)
            console.log('提交参数--' + JSON.stringify(parmas))
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(resp => {
                    if (resp.data.code == 0) {
                        console.log(resp.data)
                        this.info = resp.data.data
                    } else {
                        this.$myToast.error(resp.data.msg)
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
        },
        UnboundBtn() {
            var _this = this
            let url = this.api.userApi.BindingDelete
			let parmas = defaultParam('', 120)
            console.log('提交参数--' + JSON.stringify(parmas))
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(resp => {
                    if (resp.data.code == 0) {
                        // 解除绑定成功
						storage.setObjItem('mycar1',[])
						storage.setObjItem('mycar2',[])
                        this.$myToast.success(resp.data.msg)
						storage.removeItem('userStatus')
						// storage.removeItem("YKOpenId")
                        this.$store.commit('changeIsLogin', false)
                        setTimeout(() => {
                            this.$router.push({
                                path: '/',
                                name: 'index'
                            })
                        }, 2000)
                    } else {
                        //解除绑定失败
                        this.$myToast.error(resp.data.msg)
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
        }
    }
}
</script>

<style lang="less">
.info {
	background: #fff;
    .infoTop {
        height: 80px;
        background: url(../assets/account/info@2x.png) center center no-repeat;
        background-size: 100% 100%;
    }
    .infoList {
        padding-left: 24px;
        li {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid rgba(216, 216, 228, 0.4);
            padding: 21px 24px 21px 0;
            font-size: 16px;
            .infoL {
                color: #aaaaaa;
            }
            .infoR {
                color: #3a3a3a;
            }
        }
    }
    .noteTxt {
        font-size: 14px;
        color: #aaaaaa;
        text-align: center;
        margin-top: 61px;
    }
    .UnboundBtn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #7574f5;
        border-radius: 27px;
        height: 46px;
        color: #fff;
        font-size: 16px;
        margin: 18px;
    }
}
</style>