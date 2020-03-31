<template>
    <div style="padding:20px;">
        <h1>{{ text }}</h1>
        <div>大家快来看呀,浪里个浪</div>
        <ul>
            <li v-for="(value, key) in m" :key="key">
                <div v-for="(value1, key1) in value">
                    {{ value1.a }}
                </div>
            </li>
        </ul>
        <div @click="test">测试弹窗</div>

        <div class="UnboundBtn" @click="UnboundBtn">解除绑定</div>

        <div
            @click="clBtn"
            style="font-size:20px;background:#f00;padding:10px;color:#fff;"
        >
            清空localStorage
        </div>
    </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import sdk from '../common/js/sdk' //引入sdk.js
import {
    encryption,
    formatDate,
    formatReq,
    defaultParam
} from '../common/js/util'
export default {
    data() {
        return {
            text: 'vue中map使用',
            m: {}
        }
    },
    created() {
        const m = new Map()
        m.set('0', { a: '0啦' })
        m.set('1', { a: '1啦啦' })
        m.set('2', { a: '2啦啦啦' })
        this.m = m
        console.log(m)
        //测试分享
        let url = this.api.GetSignature
        let authCode = encryption('wx_wincome', 306)
        let params = {
            authCode: authCode,
            weixinNo: 'wx_wincome',
            callFrom: 'wincome',
            pageURL: window.location.href
        }
        this.$ajax
            .post(url, this.qs.stringify(params))
            .then(res => {
                console.log(res.data)
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.data.appId, // 必填，公众号的唯一标识
                    timestamp: res.data.timeStamp, // 必填，生成签名的时间戳<?= $data['timestamp']?>
                    nonceStr: res.data.nonceStr, // 必填，生成签名的随机串<?= $data['noncestr']?>
                    signature: res.data.paySign, // 必填，签名<?= $data['signature']?>
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone'
                    ] // 必填，需要使用的JS接口列表
                })
            })
            .catch(function(error) {
                console.log(error)
            })
        // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
        wx.ready(function() {
            wx.onMenuShareAppMessage({
                title: '***分享了他的全天营养分析', // 分享标题
                desc: '点击查看', // 分享描述
                link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'https://yydc.bjcancer.org/img/share.png', // 分享图标
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    // 用户点击了分享后执行的回调函数
                    // 设置成功
                    console.log(res)
                },
                fail: function(res) {
                    console.log(res)
                    // alert(JSON.stringify(res));
                }
            })
        })
        //分享 end
        // var url = window.location.href.split('#')[0]
        // var obj = {
        //     title: '***分享了他的全天营养分析', //分享标题
        //     desc: '点击查看', //分享内容
        //     link: window.location.href.split('#')[0],
        //     imgUrl: 'https://yydc.bjcancer.org/img/share.png' // 分享图标分享内容显示的图片
        // }
        // sdk.getJSSDK(url, obj) //传入sdk.js需要的参数
    },
    methods: {
        test() {
            this.$createDialog({
                type: 'alert',
                content: '我是内容',
                onConfirm: () => {
                    this.$createToast({
                        type: 'warn',
                        time: 1000,
                        txt: '点击确认按钮'
                    }).show()
                }
            }).show()
        },
        clBtn() {
            localStorage.clear()
        },
        UnboundBtn() {
            var _this = this
            let url = this.api.BindingDelete
            let parmas = defaultParam('', 120)
            console.log('提交参数--' + JSON.stringify(parmas))
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(resp => {
                    if (resp.data.code == 0) {
                        // 解除绑定成功
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
h1 {
    color: #f00;
    font-size: 18px;
}
.UnboundBtn {
    margin: 20px auto 80px;
    background: #fff;
    border: 1px solid #ccc;
    padding: 20px;
    font-size: 20px;
}
</style>