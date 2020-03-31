<template>
  <div class="choice">
    <div class="wrapper">
      <h2>请选择绑定方式</h2>
      <div class="choiceBtn" @click="Scan">
        <i class="iconsaomiao"></i>扫描腕带
      </div>
      <div class="choiceBtn" @click="go">
        <i class="iconshou"></i>手工绑定
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import wx from 'weixin-js-sdk'
  // import wechat from '../common/js/wechat'
  import storage from '../common/js/storage'
  // import {
  //   authPageBaseUri,
  //   homePage,
  //   wechatAppId
  // } from '../common/env'
  import {
    encryption,
    formatDate,
    formatReq,
    extractQueryParams,
    defaultParam
  } from '../common/js/util'
  export default {
    name: 'choice',
    data() {
      return {
        config: {
          appid: this.$wechatAppId,
          responseType: 'code',
          scope: 'snsapi_userinfo',
          state: '',
          homePage:this.$homePage
        },
        code: '',
        InitConfig: {}
      }
    },
    created() {

    },
    mounted() {
      this.RegisterWxJsApi(["scanQRCode"])
    },
    methods: {
      RegisterWxJsApi(jsApiList) {
        // let url = this.api.Signature;
        let url = this.api.GetSignature
        let authCode = encryption('wx_wincome', 306)
        let params = {
          authCode: authCode,
          weixinNo: 'wx_wincome',
          callFrom: 'wincome',
          callTime:formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          pageURL: window.location.href.split('#')[0]
        }
        this.$ajax
          .post(url, this.qs.stringify(params))
          .then(res => {
            wx.config({
              debug: false,
              appId: res.data.appId, // 必填,公众号的唯一标识
              timestamp: res.data.timeStamp, // 必填,生成签名的时间戳
              nonceStr: res.data.nonceStr, // 必填,生成签名的随机串
              signature: res.data.paySign, // 必填,签名
              jsApiList: jsApiList // 必填,需要使用的JS接口列表
            })
          })
          .catch(function(error) {
            console.log(error)
          })
      },
      Scan() {
        
        var _this = this
        wx.ready(function() {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
            success: function(res) {
              if (res.errMsg == 'scanQRCode:ok') {
                var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                console.log('扫描结果：' + result)
                _this.GetPatientName(result)
              } else {
                console.log(res.errMsg)
                _this.$myToast.error('扫描出错，请重新扫描！');
              }
            },
            error: function(data) {
              _this.$myToast.error('扫描出错，请重新扫描！');
            }
          })
          wx.error(function(res) {
            var str = JSON.stringify(res);
            alert('报错提示123：' + str);
          })
        });
      },
      go() {
        // this.getAuthCode()
        //调式 todo 1
        // storage.setItem("YKOpenId", 'ocWCVwkas3DM6IQhJrpwTonAbTFc')
        storage.removeItem('patNo')
        storage.removeItem('patName')
        this.$router.push({
          path: '/login',
          name: 'login'
        })
      },
      async getAuthCode() {
        /**
         * 此处换种方式获取openid，具体方式为2.0版本获取openid的方式
         * 此页面获取code，然后跳转到login页面，login页面根据code获取openid
         */
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.config.appid + '&redirect_uri=' +
        	this.config.homePage + 'login&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
      },



      GetPatientName(patNo) {
        var _this = this
        let url = this.api.GetPatientName
        let addParmas = {
          hospitalId: 0,
          patNo: patNo
        }
        let dParam = defaultParam('', 151)
        let parmas = Object.assign({}, dParam, addParmas)
        console.log('提交参数--' + JSON.stringify(parmas))
        _this.$ajax
          .post(url, _this.qs.stringify(parmas))
          .then(res => {
            if (res.data.code == '0') {
              //成功
              console.log(res.data)
              //名字获取成功，存入localstorage
              storage.setItem('patNo', patNo)
              storage.setItem('patName', res.data.data.patName)
              _this.getAuthCode()
            } else {
              alert(res.data.msg)
              return
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      }
    },
    beforeRouteEnter(to, from, next) {
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // XXX: 修复iOS版微信HTML5 History兼容性问题
      if (isiOS && to.path !== location.pathname) {
        // 此处不可使用location.replace
        location.assign(to.fullPath)
      } else {
        next()
      }
    }
  }
</script>

<style lang="less">
  .choice {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    .wrapper {
      width: 89%;
      position: absolute;
      left: 50%;
      top: 45%;
      transform: translate(-50%, -45%);
      text-align: center;

      h2 {
        font-size: 22px;
        color: #2a2a2a;
        font-weight: normal;
        padding-bottom: 30px;
      }

      .choiceBtn {
        background: #7574f5;
        border-radius: 27px;
        font-size: 16px;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 24px 0;
        height: 46px;

        i {
          font-size: 20px;
          margin-right: 8px;
        }
      }
    }
  }
</style>
