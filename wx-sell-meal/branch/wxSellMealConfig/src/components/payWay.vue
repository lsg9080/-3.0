<template>
  <div>
    <!-- 选择支付方式 -->
    <transition name="payWay-fade">
      <div class="paymentMethod" v-show="$store.state.payWayShow">
        <div class="Payheader">
          <i class="iconclose" @click="closePayWay"></i>
        </div>
        <h2>选择支付方式</h2>
        <div class="Way">
          <ul>
            <li v-for="(item, index) in rePaymentList" :key="index">
              <label :for="'way' + index">
                <div v-if="item.name === '膳食账户'" class="wayImg">
                  <img v-if="item.balance < payPrice" src="../assets/account/account2@2x.png" /><img v-else src="../assets/account/account1@2x.png" />{{ item.name
                                    }}<span
                    :class="classObject">（余额 ¥{{ item.balance }}）</span>
                </div>
                <div v-else class="wayImg">
                  <img src="../assets/account/wx@2x.png" />{{
                                        item.name
                                    }}
                </div>
                <div class="waySel" v-if="
                                        item.balance < payPrice &&
                                            item.code == '001'
                                    "></div>
                <div v-else class="waySel">
                  <span class="radio" :class="{ on: item.isChecked }"></span>
                  <input :id="'way' + index" v-model="radio" :value="item.code" class="input-radio" :checked="item.isChecked"
                    @click="checkPayWay(index, item.code)" type="radio" />
                </div>
              </label>
            </li>
          </ul>
        </div>
        <div class="bottom">
          <div class="L">
            需支付：<span class="price">¥ {{ payPrice.toFixed(1) }}</span>
          </div>
          <div class="sureBtn" @click="submitOrderBtn">确 定</div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div @click="closePayWay" class="list-mask" v-show="$store.state.payWayShow"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import store from '../store'
  import storage from '../common/js/storage'
  import {
    jsSDK2
  } from '../common/js/wechat'
  import {
    wechatAppId
  } from '../common/js/config'
  import {
    encryption,
    encryptionPay,
    formatDate,
    formatReq,
    encryptDes,
    decryptDes,
    defaultParam,
    groupBy
  } from '../common/js/util'
  import '@/common/js/jweixin-1.4.0.js'
  export default {
    props: {
      paymentList: {
        type: Array,
        default () {
          return {
            code: '001',
            name: '膳食账户',
            balance: '0.00',
            sortId: 4
          }
        }
      },
      payPrice: {
        type: Number,
        default: 0
      },
      selectFoods: {
        type: Array,
        default () {
          return [{
            NMName: '', //N选M使用
            name: '',
            price: 0,
            count: 0,
            orderingMode: 1,
            moduleId: 23,
            moduleName: '',
            repastId: 1,
            repastName: '',
            NMIndex: 0,
            N: 0,
            M: 0,
            code: '' //n选m用
          }]
        }
      }
    },
    data() {
      return {
        foldPayWay: false, //显示方式弹窗
        radio: '001',
        radios: [{
            code: '001',
            name: '膳食账户',
            balance: '10.00',
            sortId: 1,
            isChecked: true //自己添加
          },
          {
            code: '002',
            name: '微信支付',
            balance: null,
            sortId: 2,
            isChecked: false
          }
        ],
        balance: 10 //余额
      }
    },
    computed: {
      rePaymentList() {
        this.paymentList.forEach(item => {
          this.$set(item, 'isChecked', false)
        })
        return this.paymentList
      },
      payWayShow() {
        if (this.payPrice == 0) {
          // let show = !this.foldPayWay
          // return show
          return false
        }
      },
      classObject() {
        if (this.balance < this.payPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      getSubmitData() {
        //返回值对应接口中的dataList
        var submitData = []
        //单点1  套餐2  NM 3
        // debugger
        let moduleIdGroup = groupBy(this.selectFoods, food => {
          return food.moduleId
        })
        for (let index in moduleIdGroup) {
          let module = {
            mealDate: moduleIdGroup[index][0].mealDate,
            moduleId: index,
            cateringTypeId: moduleIdGroup[index][0].cateringTypeId,
            cateringId: moduleIdGroup[index][0].cateringId,
            cateringTime: moduleIdGroup[index][0].cateringTime,
            dietAdviceId: moduleIdGroup[index][0].dietAdviceId,
            orderingMode: moduleIdGroup[index][0].orderingMode,
            repastList: []
          }
          // debugger
          let repastIdGroup = groupBy(moduleIdGroup[index], food => {
            return food.repastId
          })
          for (let index in repastIdGroup) {
            let repeat = {
              repastId: index,
              menuList: []
            }
            //repastIdGroup[index]

            let menuList = repastIdGroup[index]
            for (let menu in menuList) {
              let food = {
                kind: menuList[menu].kind,
                code: menuList[menu].code,
                qty: menuList[menu].count
              }
              repeat.menuList.push(food)
            }
            module.repastList.push(repeat)
          }
          submitData.push(module)
        }
        return submitData
      },
      // disabled() {
      //     if (this.balance < this.payPrice) {
      //         return true
      //     } else {
      //         return false
      //     }
      // }
    },
    created() {

    },
    methods: {
      //提交按钮选择支付方式
      submitOrderBtn() {
        const radioCode = this.paymentList.filter(n => n.isChecked == true)
        this.radio = radioCode[0].code
        // debugger
        //001  膳食账户   002  微信支付
        if (this.radio == '001') {
          this.CheckOrderExist()
        } else {
          this.getwxPaySign(this.payPrice)
        }
      },
      // 检查是否已订餐
      // 点击“去结算“时，先调用"CheckOrderExist"方法，返回0，再正常提交，返回非0，显示提示信息，点击"继续"时提交订单
      CheckOrderExist(opthions, payPrice, orderCode, payId) {
        var _this = this
        let mealListArr = this.getSubmitData
        let url = this.api.userApi.CheckOrderExist
        let dParam = defaultParam('', 161)
        if (_this.radio == '001') {
          var addParmas = {
            // mealDate: this.selectFoods[0].mealDate,
            merchantTradeId: '',
            tempOrder: 0, //0：正常订单，1：临时订单
            dataList: mealListArr
          }
        } else {
          //微信支付
          var addParmas = {
            // mealDate: this.selectFoods[0].mealDate,
            merchantTradeId: opthions.payId,
            tempOrder: 1, //0：正常订单，1：临时订单
            dataList: mealListArr
          }
        }
        let parmas = Object.assign({}, dParam, addParmas)
        // debugger
        _this.$ajax
          .post(url, _this.qs.stringify(parmas))
          .then(res => {
            if (res.data.code == '0') {
              //成功
              this.submitOrder(opthions, payPrice, orderCode, payId)
            } else if (res.data.code == '9') {
              // 返回值是9，显示确认下单，其它值不显示确认下单
              this.$store.commit('changepayWayShow', false)
              let dialogContent = `${res.data.msg}<p class="red">下单后仅病人餐可退餐</p>`
              this.$createDialog({
                type: 'confirm',
                content: dialogContent,
                confirmBtn: {
                  text: '确认下单',
                  active: true,
                  disabled: false,
                  href: 'javascript:;'
                },
                cancelBtn: {
                  text: '再看看',
                  active: false,
                  disabled: false,
                  href: 'javascript:;'
                },
                onConfirm: () => {
                  _this.submitOrder(opthions)
                },
                onCancel: () => {
                  console.log('点击取消按钮')
                }
              }).show()
            } else {
              _this.toast = _this.$createToast({
                txt: res.data.msg,
                type: 'txt'
              })
              _this.toast.show()
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      },
      //提交订单
      submitOrder(opthions, payPrice, orderCode, payId) {
        storage.setItem('mealDate', this.selectFoods[0].mealDate)
        // debugger
        var _this = this
        let mealListArr = this.getSubmitData
        let url = this.api.userApi.SubmitOrder
        let dParam = defaultParam('', 106)
        if (_this.radio == '001') {
          var addParmas = {
            // mealDate: this.selectFoods[0].mealDate,
            merchantTradeId: '',
            tempOrder: 0, //0：正常订单，1：临时订单
            dataList: mealListArr
          }
        } else {
          //微信支付
          var addParmas = {
            // mealDate: this.selectFoods[0].mealDate,
            merchantTradeId: opthions.payId,
            tempOrder: 1, //0：正常订单，1：临时订单
            dataList: mealListArr
          }
        }
        //start --判断是否显示营养分析按钮
        let isShowFenXi = 0
        for (let m of mealListArr) {
          let result = parseInt(m.moduleId) % 10
          if (result == 0 || result == 3)
            isShowFenXi = 1
        }
        //end --判断是否显示营养分析按钮
        // alert(isShowFenXi)
        let parmas = Object.assign({}, dParam, addParmas)
        // console.log('提交订单参数：' + JSON.stringify(parmas))
        _this.$ajax
          .post(url, _this.qs.stringify(parmas))
          .then(res => {
            if (res.data.code == '0') {
              //成功
              // console.log(res.data.data)
              this.$store.commit('changepayWayShow', false)
              if (_this.radio == '001') {
                if (_this.$route.query.id == 1) {
                  //今日加餐
                  storage.setObjItem('mycar1', [])
                } else {
                  //明日订餐
                  storage.setObjItem('mycar2', [])
                }
                _this.$emit('emptyShopCar', 1)
                //1、跳页面
                _this.$router.push({
                  path: 'success',
                  query: {
                    isShowFenXi: isShowFenXi
                  }
                })
              } else {
                //微信支付
                console.log(opthions)
                // _this.$route.query.id
                // return
                // payPrice
                payPrice = _this.numFilter(payPrice)
                console.log(payPrice)
                //,orderCode,payId
                // return
                // window.orderCode=orderCode;
                // // window.payId=payId;
                // wx.miniProgram.navigateTo({
                //   url: '/pages/mealsSubmit/mealsSubmit?price=' + payPrice + '&merchantTradeId=' + opthions.payId +
                //     '&type=' + _this.$route.query.id + '&ordercode=' + window.orderCode + '&payid=' + window.payId,
                // });
                _this.jsSDK2(opthions, isShowFenXi)
              }
            } else if (res.data.code == '7') {
              // 返回值7为医嘱变更
              _this.$createDialog({
                content: res.data.msg,
                confirmBtn: {
                  text: '好的',
                  active: true
                },
                onConfirm: () => {
                  _this.empty()
                  _this.$store.commit('changepayWayShow', false)
                }
              }).show()
            } else {
              // alert(res.data.msg)
              this.$createDialog({
                content: res.data.msg,
                confirmBtn: {
                  text: '好的',
                  active: true
                },
                onConfirm: () => {

                }
              }).show()
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      },
      numFilter(value) {
        const realVal = parseFloat(value).toFixed(2);
        return realVal;
      },
      empty() {
        this.$emit('emptyShopCar', event)
        this.selectFoods.forEach(food => {
          food.count = 0
        })
      },
      //微信支付参数
      getwxPaySign(payPrice) {
        var _this = this
        let url = this.api.userApi.GetPrepayid
        let weixinNo = storage.getItem('openId')
        let price = parseFloat(payPrice).toFixed(2)
        let authCode = encryptionPay(weixinNo, 230, price)
        let currentDate = formatDate(new Date(), 'yyyyMMddhhmmss')
        let callTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        var str = 'wincome+' + currentDate + '+' + price
        var amountEncrypt = encryptDes(str)
        // console.log(`支付金额加密前串串：${str}`)
        // console.log(`支付金额加密后串串：${amountEncrypt}`)
        //获取body
        let body = '已支付' + price + '元'
        var randomstr = (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' +
          Math.random().toString().substr(2, 5);
        var orderCode = 'oc' + randomstr;
        var payId = 'pi' + orderCode
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
          paymentId: 3, //预支付微信订单
          amountEncrypt: amountEncrypt
        }
        console.log(JSON.stringify(parmas))
        _this.$ajax
          .post(url, _this.qs.stringify(parmas))
          .then(res => {
            console.log(`预支付微信签名参数：${res.data}`)
            window.orderCode = orderCode;
            window.payId = payId;
            this.wxPayParmas(res.data, payPrice, orderCode, payId)
          })
          .catch(function(error) {
            console.log(error)
          })
      },
      wxPayParmas(resolute, payPrice, orderCode, payId) {
        let opthions = {
          appId: resolute.appId,
          timeStamp: resolute.timeStamp,
          nonceStr: resolute.nonceStr,
          package: resolute.package,
          signType: 'MD5',
          paySign: resolute.paySign,
          payId: resolute.payId
        }
        console.log('从后端取到的微信参数：' + JSON.stringify(opthions))
        this.CheckOrderExist(opthions, payPrice)
      },
      jsSDK2(params, isShowFenXi) {
        var _this = this
        if (typeof window.WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', function() {
              _this.onBridgeReady2(params)
            }, false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', function() {
              _this.onBridgeReady2(params)
            })
            document.attachEvent('onWeixinJSBridgeReady', function() {
              _this.onBridgeReady2(params)
            })
          }
        } else {
          _this.onBridgeReady2(params, isShowFenXi)
        }
      },

      onBridgeReady2(params, isShowFenXi) {
        var _this = this
        window.WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': params.appId, // 公众号名称，由商户传入
            'timeStamp': params.timeStamp, // 时间戳，自1970年以来的秒数
            'nonceStr': params.nonceStr, // 随机串
            'package': params.package,
            'signType': params.signType, // 微信签名方式：
            'paySign': params.paySign // 微信签名
          },
          function(res) {
            console.log(JSON.stringify(res));
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              if (_this.$route.query.id == 1) {
                //今日加餐
                storage.setObjItem('mycar1', [])
              } else {
                //明日订餐
                storage.setObjItem('mycar2', [])
              }
              _this.$router.push({
                path: 'success',
                query: {
                  isShowFenXi: isShowFenXi
                }
              })
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              alert('用户取消支付')
            } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
              alert('网络异常，请重试')
            }
          }
        )
      },
      balanceJudge() {
        if (this.balance < this.payPrice) {
          this.radios.forEach(item => {
            item.isChecked = true
          })
        }
      },
      checkPayWay(index, code) {
        // 先取消所有选中项
        this.rePaymentList.forEach(item => {
          item.isChecked = false
        })
        //再设置当前点击项选中
        this.radio = this.rePaymentList[index].value
        // 设置值，以供传递
        this.rePaymentList[index].isChecked = true
        this.radio = code
      },
      closePayWay() {
        this.foldPayWay = !this.foldPayWay
        this.$store.commit('changepayWayShow', false)
      }
    },
    created() {
      this.balanceJudge()
      console.log('我是store中的购物车状态：' + this.$store.state.payWayShow)
    },
    destroyed() {
      this.$store.commit('changepayWayShow', false)
    }
  }
</script>

<style lang="less">
  @import '../common/less/mixin.less';

  .red {
    color: #f00;
    text-align: center;
    font-size: 10px;
    padding-top: 10px;
  }

  .cube-dialog-btns {
    border-top: 1PX solid #f5f5f5;
  }

  .paymentMethod {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 51;
    background: #fff;
    border-radius: 12px 12px 0 0;
    width: 100%;
    transform: translate3d(0, 0, 0);

    &.payWay-fade-enter-active,
    &.payWay-fade-leave-active {
      transition: all 0.5s;
    }

    &.payWay-fade-enter,
    &.payWay-fade-leave-active {
      transform: translate3d(0, 100%, 0);
    }

    .Payheader {
      padding: 17px 17px 12px;
      text-align: right;

      i {
        color: #aaaaaa;
        font-size: 24px;
      }
    }

    h2 {
      position: relative;
      top: -10px;
      font-size: 18px;
      color: #505050;
      padding: 0 0 0 24px;
    }

    .Way {
      padding: 14px 18px 14px 24px;

      ul li {
        &>label {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

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

          span {
            &.enough {
              color: #ff8361;
            }

            &.not-enough {
              color: #aaaaaa;
            }
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
            background-image: url(../assets/account/radioOn2@2x.png);
          }
        }
      }
    }

    .bottom {
      height: 54px;
      border-top: 1px solid #e7e7f1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px 0 24px;
      font-size: 16px;
      color: #aaaaaa;

      .L {
        line-height: 30px;
        display: flex;
        align-items: center;
        height: 30px;

        .price {
          font-family: Akrobat-ExtraBold;
          font-size: 30px;
          color: #ff6c42;
          position: relative;
          top: -3px;
        }
      }

      .sureBtn {
        background: #7574f5;
        border-radius: 100px;
        font-size: 16px;
        color: #ffffff;
        width: 104px;
        height: 40px;
        .box-c();
      }
    }
  }
</style>
