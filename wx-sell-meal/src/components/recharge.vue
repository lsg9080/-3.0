<template>
  <div class="recharge">
    <div class="rechargeTop">
      <div class="transactionDetails" @click="tradeDetails">交易明细</div>
      <div class="outline">
        <div class="wrapper"></div>
      </div>
      <div class="balance">{{ CurrentBalance }}</div>
      <div class="balanceTxt">当前余额（元）</div>
    </div>
    <div class="rechargeCon">
      <div class="wrapper">
        <div class="title">充值金额</div>
        <div class="amountInput">
          <i></i>
          <input v-model.number="amount" type="tel" maxlength="4" class="input" placeholder="不少于10元" />
        </div>
        <div class="title">选择方式</div>
        <div class="Way">
          <ul>
            <li v-for="(item, index) in radios" :key="item.id">
              <div class="wayImg">
                <img src="../assets/account/wx@2x.png" />{{
                                    item.label
                                }}
              </div>
              <div class="waySel">
                <span class="radio" :class="{ on: item.isChecked }"></span>
                <input v-model="radio" :value="item.value" class="input-radio" :checked="item.isChecked" @click="check(index)"
                  type="radio" />
              </div>
            </li>
          </ul>
        </div>
        <div class="rechargeBtn" @click="rechargeBtn">充值</div>
      </div>
    </div>
    <div class="tip">出院时，请至人工窗口办理结算！</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {
    encryption,
    encryptionPay,
    formatDate,
    formatReq,
    encryptDes,
    decryptDes
  } from '../common/js/util'
  import {
    jsSDK
  } from '../common/js/wechat'
  import {
    wechatAppId
  } from '../common/env'
  import storage from '../common/js/storage'
  import '@/common/js/jweixin-1.4.0.js'
  export default {
    name: 'recharge',
    data() {
      return {
        CurrentBalance: '', //当前余额
        amount: '',
        radio: '4',
        radios: [{
            label: '微信支付',
            value: '4',
            isChecked: true
          }
          // {
          //     label: '支付宝',
          //     value: '5',
          //     isChecked: false
          // }
        ]
      }
    },
    created() {
      this.getParams()
    },
    methods: {
      getParams() {
        const balance = this.$route.query.balance
        console.log(balance)
        this.CurrentBalance = balance
      },
      //充值
      rechargeBtn() {
        let rechargeAmount = this.amount
        let reg = /^[0-9]*[1-9][0-9]*$/ //正整数
        if (!rechargeAmount || rechargeAmount < 10) {
          this.$myToast.error('充值金额单次不能少于10元')
          return
        } else if (!reg.test(rechargeAmount)) {
          this.$myToast.error('充值金额只能为整数')
          return
        } else if (rechargeAmount > 1000) {
          this.$myToast.error('充值金额单次不能多于1000元')
          return
        }
        var _this = this
        let url = this.api.userApi.GetPrepayid
        let weixinNo = storage.getItem('openId')
        let price = parseFloat(rechargeAmount).toFixed(2)
        let authCode = encryptionPay(weixinNo, 230, price)
        let currentDate = formatDate(new Date(), 'yyyyMMddhhmmss')
        let callTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        var str = 'wincome+' + currentDate + '+' + price
        var amountEncrypt = encryptDes(str)
        // console.log(`充值金额加密前串串：${str}`)
        // console.log(`充值金额加密后串串：${amountEncrypt}`)
        //获取body

        //
        var randomstr=(Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+'-'+Math.random().toString().substr(2,5);
        var orderCode='oc'+randomstr;
        var payId='pi'+orderCode
        //
        let body = '已充值' + price + '元'
        let parmas = {
          authCode: authCode,
          weixinNo: weixinNo,
          callFrom: 'wincome',
          appId: wechatAppId,
          body: body,
          callTime: callTime,
          price: price,
          payId: payId,
          orderCode: orderCode,
          paymentId: 0, //预支付充值
          amountEncrypt: amountEncrypt
        }
        console.log(JSON.stringify(parmas))
        _this.$ajax
          .post(url, _this.qs.stringify(parmas))
          .then(res => {
            console.log(res.data)
            console.log(payId)
            console.log(orderCode)
            // wx.miniProgram.navigateTo({
            //   url:'/pages/nhl_recharge/nhl_recharge?price='+price+'&merchantTradeId='+res.data.payId+'&amountEncrypt='+amountEncrypt+'&payId='+payId+'&orderCode='+orderCode,
            // });
            // return
            this.wxPay(res.data)
          })
          .catch(function(error) {
            console.log(error)
          })
      },
      wxPay(resolute) {
        console.log('微信支付')
        let opthions = {
          appId: wechatAppId,
          timeStamp: resolute.timeStamp,
          nonceStr: resolute.nonceStr,
          package: resolute.package,
          signType: 'MD5',
          paySign: resolute.paySign
        }
        console.log('从后端取到的微信参数：' + JSON.stringify(opthions))
        jsSDK(opthions)
      },
      //交易明细
      tradeDetails() {
        this.$router.push({
          name: 'tradeDetails'
        })
      },
      check(index) {
        // 先取消所有选中项
        this.radios.forEach(item => {
          item.isChecked = false
        })
        //再设置当前点击项选中
        this.radio = this.radios[index].value
        // 设置值，以供传递
        this.radios[index].isChecked = true
        console.log(this.radio)
      }
    }
  }
</script>

<style lang="less">
  @import '../common/less/mixin';

  .rechargeCon {
    input::placeholder {
      color: #aaaaaa;
      font-size: 14px;
    }
  }

  .rechargeTop {
    height: 220px;
    background-image: linear-gradient(-141deg, #6782ff 0%, #8268eb 100%);
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
    padding-top: 14px;

    .transactionDetails {
      position: absolute;
      top: 18px;
      right: 18px;
      font-size: 14px;
      color: #fff;
      background: url(../assets/account/trade@2x.png) left center no-repeat;
      background-size: 13px 15px;
      padding-left: 19px;
    }

    .outline {
      width: 74px;
      height: 74px;
      border-radius: 50%;
      margin: 4px;
      border: 1px solid rgba(255, 255, 255, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;

      .wrapper {
        width: 66px;
        height: 68px;
        background: url(../assets/account/icon@2x.png) center center no-repeat #fff;
        border-radius: 50%;
        background-size: 38px 32px;
      }
    }

    .balance {
      font-family: Akrobat-ExtraBold;
      font-size: 30px;
      color: #fff;
      padding: 5px 0 5px;
    }

    .balanceTxt {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .rechargeCon {
    position: relative;
    top: -50px;
    background: #ffffff;
    box-shadow: 0 2px 10px 0 rgba(117, 116, 245, 0.2);
    border-radius: 4px;
    margin: 0 18px;
    min-height: 339px;

    .wrapper {
      padding: 0 24px;

      .title {
        font-size: 16px;
        color: #505050;
        padding: 36px 0 19px;
      }

      .amountInput {
        position: relative;

        i {
          position: absolute;
          left: 0;
          bottom: 6px;
          background: url(../assets/account/money@2x.png) left center no-repeat;
          background-size: 100% 100%;
          width: 16px;
          height: 20px;
        }

        .input {
          .border-bottom();
          font-size: 20px;
          color: #3a3a3a;
          padding-left: 26px;
        }
      }

      .Way {
        ul li {
          display: flex;
          justify-content: space-between;
          padding-bottom: 18px;

          .wayImg {
            font-size: 16px;
            color: #505050;
            display: flex;
            align-items: center;

            img {
              width: 30px;
              height: 30px;
              margin-right: 8px;
            }
          }

          .waySel {
            position: relative;

            .radio {
              display: inline-block;
              width: 24px;
              height: 24px;
              vertical-align: middle;
              background: url(../assets/account/radio@2x.png) center center no-repeat;
              background-size: 100% 100%;
            }

            .input-radio {
              display: inline-block;
              position: absolute;
              opacity: 0;
              width: 24px;
              height: 24px;
              left: 0px;
              top: 0;
              outline: none;
              -webkit-appearance: none;
            }

            .on {
              background-image: url(../assets/account/radioOn@2x.png);
            }
          }
        }
      }

      .rechargeBtn {
        .submitBtn();
        margin-top: 33px;
      }
    }
  }

  .tip {
    font-size: 14px;
    color: #aaaaaa;
    text-align: center;
    margin-top: -15px;
  }
</style>
