<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{ highlight: totalCount > 0 }"></div>
            <div class="num" v-show="totalCount > 0">{{ totalCount }}</div>
          </div>
          <div class="price" :class="{ highlight: totalPrice > 0 }">{{ priceDesc }}</div>
        </div>
        <div class="content-right">
          <div :class="analysisClass" class="analysis" @click.stop.prevent="analysis">营养分析</div>
          <div :class="payClass" class="pay" @click.stop.prevent="pay">去下单</div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition
            name="drop"
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop"
          >
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <!-- 购物车列表 -->
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <span class="empty" @click="empty">清空购物车</span>
          </div>
          <div class="list-content">
            <cube-scroll ref="scrollCar" :data="selectFoods">
              <ul v-for="(item,index) in SingleSelectFoods" :key="index">
                <div class="carTag">{{item.moduleName|replace}}</div>
                <template v-for="repeatItem in item.repeatList">
                  <div class="carMealTimes">{{repeatItem.repeatName|replace}}</div>
                  <li
                    v-for="(food, foodIndex) in repeatItem.food"
                    :key="food.code+foodIndex"
                    class="food"
                  >
                    <span class="name">{{ food.name }}</span>
                    <div class="price">
                      <span>
                        ￥{{
                        food.price
                        }}
                      </span>
                    </div>
                    <div class="cartcontrol-wrapper singleCartcontrol">
                      <cartcontrol @add="addFood" @decrease="decreaseFood" :food="food"></cartcontrol>
                    </div>
                  </li>
                </template>
              </ul>
              <!-- 套餐 -->
              <ul v-for="item in SetMealSelectFoods">
                <div class="carTag">{{item.moduleName|replace}}</div>
                <template v-for="repeatItem in item.repeatList">
                  <div class="carMealTimes">{{repeatItem.repeatName|replace}}</div>
                  <li class="food selMealFood">
                    <span class="name">{{repeatItem.food.name}}</span>
                    <div class="price">
                      <span>￥{{repeatItem.food.price}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                      <div class="cartcontrol">
                        <div class="cart-decrease">
                          <span @click="removeFood(repeatItem.food)" class="inner iconjianshao"></span>
                        </div>
                      </div>
                    </div>
                  </li>
                </template>
              </ul>
              <!-- N选M -->
              <ul v-for="item in NMSelectFoods">
                <div class="carTag">{{item.moduleName|replace}}</div>
                <template v-for="repeatItem in item.repeatList">
                  <div class="carMealTimes NSelectMFoodTimes">{{repeatItem.repeatName|replace}}</div>
                  <template v-for="NMItem in repeatItem.NMList">
                    <div
                      class="carMealTimes carMealTimes2"
                    >（{{NMItem.menuList[0].N}}选{{NMItem.menuList[0].M}}）</div>
                    <!--注释：不知道为什么要这个，这的作用 提示 N选M {{NMItem.nmName|replace}} -->
                    <li
                      v-for="(food,index) in NMItem.menuList"
                      :key="index"
                      class="food selMealFood NSelectMFood"
                    >
                      <span class="name">{{food.name}}</span>
                      <div class="cartcontrol-wrapper">
                        <div class="cartcontrol">
                          <div class="cart-decrease">
                            <span @click="removeFood(food)" class="inner iconjianshao"></span>
                          </div>
                        </div>
                      </div>
                    </li>
                  </template>
                </template>
              </ul>
              <!-- end -->
            </cube-scroll>
          </div>
        </div>
      </transition>
    </div>
    <!-- 营养素摄入量进度条 start -->
    <div class="progress-wrapper" :class="progressClass">
      <div class="progress">
        <div class="progressBg">
          <ul>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div class="ball" :style="{ left: ballLeft + '%' }">
          <div class="counter" :class="counterClass">
            {{totalProgress}}
            <span>kcal</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 营养素摄入量进度条 end -->
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
    <div class>{{newSelectFoods}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
import store from "../store";
import storage from "../common/js/storage";
import { jsSDK2 } from "../common/js/wechat";
import { wechatAppId } from "../common/env";
import cartcontrol from "./cartcontrol";
import {
  encryption,
  encryptionPay,
  formatDate,
  formatReq,
  encryptDes,
  decryptDes,
  defaultParam,
  groupBy
} from "../common/js/util";

export default {
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [
          {
            NMName: "", //N选M使用
            name: "",
            price: 0,
            count: 0,
            orderingMode: 1,
            moduleId: 23,
            moduleName: "",
            repastId: 1,
            repastName: "",
            NMIndex: 0,
            N: 0,
            M: 0,
            code: "" //n选m用
          }
        ];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    paymentList: {
      type: Array,
      default() {
        return {
          code: "001",
          name: "膳食账户",
          balance: "0.00",
          sortId: 4
        };
      }
    }
  },
  data() {
    return {
      enableRecharge: "", // 是否启用充值
      // ballLeft: '30',
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: true,
      NMSelectFoods: [], //N选M
      SetMealSelectFoods: [], //套餐
      SingleSelectFoods: [] //单选
    };
  },
  
  computed: {
    newSelectFoods() {
      let singleData = [];
      let NMData = [];
      let setMealData = [];
      // this.NMData=[]
      //单点1  套餐2  NM 3
      let orderingModeGroup = groupBy(this.selectFoods, food => {
        return food.orderingMode;
      });
      for (let orderingMode in orderingModeGroup) {
        if (orderingMode == 1) {
          let moduleIdGroup = groupBy(orderingModeGroup[orderingMode], food => {
            return food.moduleName;
          });
          for (let index in moduleIdGroup) {
            let module = {
              moduleName: index,
              repeatList: []
            };
            let repastIdGroup = groupBy(moduleIdGroup[index], food => {
              return food.repastName;
            });
            for (let index in repastIdGroup) {
              let repeat = {
                repeatName: index,
                food: repastIdGroup[index]
              };
              module.repeatList.push(repeat);
            }
            singleData.push(module);
          }
          console.log(singleData);
        } else if (orderingMode == 2) {
          let moduleIdGroup = groupBy(orderingModeGroup[orderingMode], food => {
            return food.moduleName;
          });
          for (let index in moduleIdGroup) {
            let module = {
              moduleName: index,
              repeatList: []
            };
            let repastIdGroup = groupBy(moduleIdGroup[index], food => {
              return food.repastName;
            });
            for (let index in repastIdGroup) {
              let repeat = {
                repeatName: index,
                food: repastIdGroup[index][0]
              };
              module.repeatList.push(repeat);
            }
            setMealData.push(module);
          }
        } else if (orderingMode == 3) {
          /**
           * {moduleName} 如：病人餐
           *      {repastName} 如:早餐
           *            {NM}  如：3选1
           */
          let moduleIdGroup = groupBy(orderingModeGroup[orderingMode], food => {
            return food.moduleName;
          });
          for (let index in moduleIdGroup) {
            let module = {
              moduleName: index,
              repeatList: []
            };
       
            let repastIdGroup = groupBy(moduleIdGroup[index], food => {
              return food.repastName;
            });
           for (let index in repastIdGroup) {
              let repeat = {
                repeatName: index,
                NMList: []
              };
              let NMNameGroup = groupBy(repastIdGroup[index], food => {
                return (food.NMName?food.NMName:food.N+'选'+food.M) + food.repastId;
              });
              for (let index in NMNameGroup) {
                let nm = {
                  nmName: NMNameGroup[index][0].NMName,
                  menuList: NMNameGroup[index]
                };
             
                repeat.NMList.push(nm);
              }
              module.repeatList.push(repeat);
            }
            NMData.push(module);
          }
        }
        this.NMSelectFoods = NMData;
        this.SetMealSelectFoods = setMealData;
        this.SingleSelectFoods = singleData;
        console.log({ "this.SingleSelectFoods": this.SingleSelectFoods });
        // console.log('单点1  套餐2  NM 3---- '+orderingMode,orderingModeGroup[orderingMode]);
      }
      //  console.log(NMData)
    },
    totalPrice() {
      // debugger
      let total = 0;
      //单点1  套餐2  NM 3
      let orderingModeGroup = groupBy(this.selectFoods, food => {
        return food.orderingMode;
      });
      for (let orderingMode in orderingModeGroup) {
        if (orderingMode == 3) {
          //  debugger
          let moduleIdGroup = groupBy(orderingModeGroup[orderingMode], food => {
            return food.moduleName;
          });
          for (let index in moduleIdGroup) {
            //遍历多个n选M
            let repeastGroup = groupBy(moduleIdGroup[index], food => {
              return food.repastId;
            });
            for (let index in repeastGroup) {
              // if(repeastGroup[index][0].count==1)
              total += repeastGroup[index][0].price;
            }
            // for(let foodIndex in moduleIdGroup[index])
            // 	if(moduleIdGroup[index][foodIndex].count==1)
            // 	total += moduleIdGroup[index][foodIndex].price
          }
        } else {
          orderingModeGroup[orderingMode].forEach(food => {
            total += food.price * food.count;
          });
        }
      }
      // this.selectFoods.forEach(food => {
      //     total += food.price * food.count
      // })
      return total;
    },
    totalCount() {
      let count = 0;
      console.log(count);
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    //能量进度条
    totalProgress() {
      // 低、正常、高：0-800kcal（不含），800-2700kcal，2700（不含）-4000kcal
      //单点1  套餐2  NM 3
      //这里只统计病人和小锅
      let count = 0;
      // if(type!='今日')
      // return count;
      let filterGoods = this.selectFoods.filter(
        n => n.moduleName == "病人餐" || n.moduleName == "小锅菜"
      );
      filterGoods.forEach(food => {
        if (food.Nutrients && food.Nutrients.能量)
          count += food.Nutrients.能量 * food.count;
      });
      let realCount = parseFloat(count).toFixed(1);
      return realCount;
    },
    //进度条小球位置
    ballLeft() {
      var left = Math.round((this.totalProgress / 4000) * 10000) / 100.0;
      if (left > 100) {
        return 99;
      }
      return left;
    },
    priceDesc() {
      if (this.selectFoods.length === 0) {
        return "未选购";
      } else {
        let realVal = parseFloat(this.totalPrice).toFixed(1);
        return `￥${realVal}`;
      }
    },
    // 营养分析
    analysisClass() {
      if (!this.totalCount) {
        return "not-enough";
      } else {
        return "enough";
      }
    },
    //结算
    payClass() {
      // his计费时菜品可能没有金额 ,所以不用金额判断
      if (this.totalCount === 0) {
        return "not-enough";
      } else {
        return "enough";
      }
    },
    progressClass() {
      if (!this.totalCount) {
        return "hidden";
      } else {
        return "";
      }
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          this.refreshCar();
        });
      }
      return show;
    },
    counterClass() {
      if (this.ballLeft < 5) {
        return "counterDefaultLeft";
      } else if (this.ballLeft < 20) {
        return "";
      } else if (this.ballLeft < 67.5) {
        return "counter2";
      } else if (this.ballLeft < 89.5) {
        return "counter3";
      } else if (this.ballLeft <= 100) {
        return "counterDefault";
      }
    },
    getSubmitData() {
      //返回值对应接口中的dataList
      var submitData = [];
      //单点1  套餐2  NM 3
      //debugger
      let moduleIdGroup = groupBy(this.selectFoods, food => {
        return food.moduleId;
      });
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
        };
        // debugger
        let repastIdGroup = groupBy(moduleIdGroup[index], food => {
          return food.repastId;
        });
        for (let index in repastIdGroup) {
          let repeat = {
            repastId: index,
            menuList: []
          };
          //repastIdGroup[index]

          let menuList = repastIdGroup[index];
          for (let menu in menuList) {
            let food = {
              kind: menuList[menu].kind,
              code: menuList[menu].code,
              qty: menuList[menu].count
            };
            repeat.menuList.push(food);
          }
          module.repastList.push(repeat);
        }
        submitData.push(module);
      }
      return submitData;
    },
    //获取营养分析参数
    getAnalysisSubmitData() {
      //返回值对应接口中的dataList
      var submitAnalysisData = [];
      //单点1  套餐2  NM 3
      //debugger
      let moduleIdGroup = groupBy(this.selectFoods, food => {
        return food.moduleId;
      });
      for (let index in moduleIdGroup) {
        let module = {
          moduleId: index,
          repastList: []
        };
        // debugger
        let repastIdGroup = groupBy(moduleIdGroup[index], food => {
          return food.repastId;
        });
        for (let index in repastIdGroup) {
          let repeat = {
            repastId: index,
            menuList: []
          };

          let menuList = repastIdGroup[index];
          for (let menu in menuList) {
            let food = {
              kind: menuList[menu].kind,
              code: menuList[menu].code,
              qty: menuList[menu].count
            };
            repeat.menuList.push(food);
          }
          module.repastList.push(repeat);
        }
        submitAnalysisData.push(module);
      }
      return submitAnalysisData;
    }
  },
  created() {
    console.log(this.selectFoods);
    this.enableRecharge = storage.getItem("enableRecharge");
  },
  filters: {
    replace: function(value) {
      if (!value) return "";
      return value.replace(/\"/g, "");
    }
  },
  methods: {
    //N选M移除&&套餐移除
    removeFood(food) {
      food.count = 0;
      if (food.orderingMode == 2)
        //套餐
        this.$emit("shopCarDecreaseFood", food);
      else this.$emit("shopCarDecreaseNMFood", food); //N选M
      // debugger

      //  let filterGoods = this.selectFoods.filter(n =>
      //             n.moduleId == food.moduleId &&
      //             n.repastId == food.repastId &&
      //             n.code == food.code)
      // if(filterGoods.length>0){
      //     filterGoods[0].count=0
      //      let itemIndex = this.selectFoods.findIndex(n =>
      //                 n.moduleId == food.moduleId &&
      //                 n.repastId == food.repastId &&
      //                 n.code == food.code);
      //     if(itemIndex!=-1){
      //         debugger
      //         this.selectFoods.splice(itemIndex, 1)
      //     }
      //     // food.count=0
      //     // if(food.count == 0){

      //     // }
      // }
    },
    //单选减一
    decreaseFood(food) {
      // debugger
      this.$emit("shopCarSingleFood", food);
    },
    refreshCar() {
      this.$refs.scrollCar.refresh();
    },
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    hideList() {
      this.fold = true;
    },
    empty() {
      this.$emit("emptyShopCar", event);

      this.selectFoods.forEach(food => {
        food.count = 0;
      });
      this.NMSelectFoods = [];
      this.SetMealSelectFoods = [];
      this.SingleSelectFoods = [];
    },
    /**
     *  1. his收费（支付方式为空时代表his收费）
     *  2. 只有1种支付方式： 默认自动下单
     *  3. 多种支付方式： 弹出支付方式弹窗 使选择
     * */

    pay() {
      if (
        this.paymentList.length &&
        (!this.totalCount || this.totalPrice === 0)
      ) {
        return;
      }
      console.log(this.paymentList);
      // 1、
      if (this.paymentList == null || !this.paymentList.length) {
        this.CheckOrderExist();
      } else if (this.paymentList.length == 1) {
        // 2、
        if (this.paymentList[0].code == "001") {
          this.CheckOrderExist();
          return;
        }
        this.getwxPaySign(this.totalPrice); //微信支付获取微信签名
      } else {
        // 3、弹出支付方式弹窗
        //1、获取购物车金额
        //this.totalPrice
        //2、和余额判断
        // 如果有一个选中不做判断
        var findRadio = this.paymentList.find(v => {
          return v.isChecked == true;
        });
        // debugger
        if (!findRadio) {
          let yue = this.paymentList.filter(n => n.code == "001");
          if (yue.length > 0) {
            if (yue[0].balance >= this.totalPrice) {
              //选中余额支付方式
              yue[0].isChecked = true;
            } else {
              let weChatPay = this.paymentList.filter(n => n.code != "001");
              if (weChatPay.length > 0) weChatPay[0].isChecked = true;
            }
          }
        }

        this.fold = true;
        this.$store.commit("changepayWayShow", true);
        this.$emit("totalPrice", this.totalPrice);
      }
    },
    getwxPaySign(payPrice) {
      var _this = this;
      let url = this.api.userApi.GetPrepayid;
      let weixinNo = storage.getItem("YKOpenId");
      let price = parseFloat(payPrice).toFixed(2);
      let authCode = encryptionPay(weixinNo, 230, price);
      let currentDate = formatDate(new Date(), "yyyyMMddhhmmss");
      let callTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      var str = "wincome+" + currentDate + "+" + price;
      var amountEncrypt = encryptDes(str);
      console.log(`支付金额加密前串串：${str}`);
      console.log(`支付金额加密后串串：${amountEncrypt}`);
      //获取body
      let body = "已支付" + price + "元";
      let parmas = {
        authCode: authCode,
        weixinNo: weixinNo,
        callFrom: "wincome",
        appId: wechatAppId,
        body: body,
        callTime: callTime,
        price: price,
        payId: "",
        orderCode: "",
        paymentId: 3, //预支付微信订单
        amountEncrypt: amountEncrypt
      };
      console.log(JSON.stringify(parmas));
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          console.log(`预支付微信签名参数：${res.data}`);
          this.wxPayParmas(res.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    wxPayParmas(resolute) {
      let opthions = {
        appId: resolute.appId,
        timeStamp: resolute.timeStamp,
        nonceStr: resolute.nonceStr,
        package: resolute.package,
        signType: "MD5",
        paySign: resolute.paySign,
        payId: resolute.payId
      };
      console.log("从后端取到的微信参数：" + JSON.stringify(opthions));
      this.CheckOrderExist(opthions);
    },
    jsSDK2(params, isShowFenXi) {
      var _this = this;
      if (typeof window.WeixinJSBridge === "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            function() {
              _this.onBridgeReady2(params);
            },
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", function() {
            _this.onBridgeReady2(params);
          });
          document.attachEvent("onWeixinJSBridgeReady", function() {
            _this.onBridgeReady2(params);
          });
        }
      } else {
        _this.onBridgeReady2(params, isShowFenXi);
      }
    },
    onBridgeReady2(params, isShowFenXi) {
      var _this = this;
      window.WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: params.appId, // 公众号名称，由商户传入
          timeStamp: params.timeStamp, // 时间戳，自1970年以来的秒数
          nonceStr: params.nonceStr, // 随机串
          package: params.package,
          signType: params.signType, // 微信签名方式：
          paySign: params.paySign // 微信签名
        },
        function(res) {
          console.log(JSON.stringify(res));
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            if (_this.$route.query.id == 1) {
              //今日加餐
              storage.setObjItem("mycar1", []);
            } else {
              //明日订餐
              storage.setObjItem("mycar2", []);
            }

            _this.$router.push({
              path: "success",
              query: { isShowFenXi: isShowFenXi }
            });
          } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
            alert("用户取消支付");
          } else if (res.err_msg === "get_brand_wcpay_request:fail") {
            alert("网络异常，请重试");
          }
        }
      );
    },

    // 检查是否已订餐
    // 点击“去结算“时，先调用"CheckOrderExist"方法，返回0，再正常提交，返回非0，显示提示信息，点击"继续"时提交订单
    CheckOrderExist(opthions) {
      var _this = this;
      let mealListArr = this.getSubmitData;
      let url = this.api.userApi.CheckOrderExist;
      let dParam = defaultParam("", 161);
      if (this.paymentList == null || !this.paymentList.length) {
        var addParmas = {
          merchantTradeId: "",
          tempOrder: 0, //0：正常订单，1：临时订单
          dataList: mealListArr
        };
      } else if (this.paymentList[0].code == "001") {
        var addParmas = {
          // mealDate: this.selectFoods[0].mealDate,
          merchantTradeId: "",
          tempOrder: 0, //0：正常订单，1：临时订单
          dataList: mealListArr
        };
      } else {
        //微信支付
        var addParmas = {
          // mealDate: this.selectFoods[0].mealDate,
          merchantTradeId: opthions.payId,
          tempOrder: 1, //0：正常订单，1：临时订单
          dataList: mealListArr
        };
      }
      let parmas = Object.assign({}, dParam, addParmas);
      // debugger
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          if (res.data.code == "0") {
            //成功
            this.submitOrder(opthions);
          } else if (res.data.code == "9") {
            this.$store.commit("changepayWayShow", false);
            let dialogContent = `${res.data.msg}<p class="red">下单后仅病人餐可退餐</p>`;
            this.$createDialog({
              type: "confirm",
              content: dialogContent,
              confirmBtn: {
                text: "确认下单",
                active: true,
                disabled: false,
                href: "javascript:;"
              },
              cancelBtn: {
                text: "再看看",
                active: false,
                disabled: false,
                href: "javascript:;"
              },
              onConfirm: () => {
                _this.submitOrder(opthions);
              },
              onCancel: () => {
                console.log("点击取消按钮");
              }
            }).show();
          } else {
            _this.toast = _this.$createToast({
              txt: res.data.msg,
              type: "txt"
            });
            _this.toast.show();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //提交订单
    submitOrder(opthions) {
      storage.setItem("mealDate", this.selectFoods[0].mealDate);
      // let mealListArr1 = [
      //     {
      //         moduleId: 23, //模块Id
      //         cateringTypeId: 3, //食谱类型Id
      //         cateringId: 2319, //食谱Id
      //         cateringTime: '2019-09-24 08:57:08', //食谱时间
      //         dietAdviceId: 707, //饮食医嘱Id
      //         orderingMode: 1, //点餐模式
      //         repastList: [
      //             {
      //                 repastId: 1, //餐次Id
      //                 menuList: [
      //                     {
      //                         kind: '1', //菜肴种类
      //                         code: '3008', //菜肴编码
      //                         qty: 1 //菜肴数量
      //                     }
      //                 ]
      //             }
      //         ]
      //     }
      // ]

      var _this = this;
      let mealListArr = this.getSubmitData;
      let url = this.api.userApi.SubmitOrder;
      let dParam = defaultParam("", 106);
      if (
        this.paymentList == null ||
        !this.paymentList.length ||
        (this.paymentList && this.paymentList[0].code == "001")
      ) {
        var addParmas = {
          // mealDate: this.selectFoods[0].mealDate,
          merchantTradeId: "",
          tempOrder: 0, //0：正常订单，1：临时订单
          dataList: mealListArr
        };
      } else {
        //微信支付
        var addParmas = {
          // mealDate: this.selectFoods[0].mealDate,
          merchantTradeId: opthions.payId,
          tempOrder: 1, //0：正常订单，1：临时订单
          dataList: mealListArr
        };
      }
      //start --判断是否显示营养分析按钮
      let isShowFenXi = 0;
      for (let m of mealListArr) {
        let result = parseInt(m.moduleId) % 10;
        if (result == 0 || result == 3) isShowFenXi = 1;
      }
      //end --判断是否显示营养分析按钮
      let parmas = Object.assign({}, dParam, addParmas);
      // console.log('提交订单参数：'+JSON.stringify(parmas))
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          if (res.data.code == "0") {
            //成功
            // console.log(res.data.data)
            if (
              this.paymentList == null ||
              !this.paymentList.length ||
              this.paymentList[0].code == "001"
            ) {
              //1、跳页面
              if (_this.$route.query.id == 1) {
                //今日加餐
                storage.setObjItem("mycar1", []);
              } else {
                //明日订餐
                storage.setObjItem("mycar2", []);
              }
              _this.$router.push({
                path: "success",
                query: { isShowFenXi: isShowFenXi }
              });
            } else {
              //微信支付
              _this.jsSDK2(opthions, isShowFenXi);
            }
          } else if (res.data.code == "7") {
            // 返回值7为医嘱变更，8为余额不足
            // todo
            // enableRecharge 启用充值
            this.$createDialog({
              content: res.data.msg,
              confirmBtn: {
                text: "好的",
                active: true
              },
              onConfirm: () => {
                _this.empty();
              }
            }).show();
          } else if (res.data.code == "8") {
            // 返回值7为医嘱变更，8为余额不足
            // todo
            // enableRecharge 启用充值
            // debugger
            let chaPrice = (
              parseFloat(_this.totalPrice) -
              parseFloat(_this.paymentList[0].balance)
            ).toFixed(1);
            let dialogCon = `当前最新余额￥${parseFloat(
              _this.paymentList[0].balance
            ).toFixed(1)}<br/>还差￥${chaPrice}`;
            if (_this.enableRecharge == "1") {
              //启用充值
              _this
                .$createDialog({
                  type: "confirm",
                  title: "膳食账户余额不足",
                  content: dialogCon,
                  confirmBtn: {
                    text: "去充值",
                    active: true,
                    disabled: false,
                    href: "javascript:;"
                  },
                  cancelBtn: {
                    text: "放弃订餐",
                    active: false,
                    disabled: false,
                    href: "javascript:;"
                  },
                  onConfirm: () => {
                    _this.$router.push({
                      path: "/recharge",
                      name: "recharge"
                    });
                  },
                  onCancel: () => {
                    _this.empty();
                  }
                })
                .show();
            } else {
              //不启用充值
              _this
                .$createDialog({
                  type: "confirm",
                  title: "膳食账户余额不足",
                  content: dialogCon,
                  confirmBtn: {
                    text: "修改订单",
                    active: true,
                    disabled: false,
                    href: "javascript:;"
                  },
                  cancelBtn: {
                    text: "放弃订餐",
                    active: false,
                    disabled: false,
                    href: "javascript:;"
                  },
                  onConfirm: () => {
                    //修改订单，回到订餐页面
                  },
                  onCancel: () => {
                    _this.empty();
                  }
                })
                .show();
            }
          } else {
            // alert(res.data.msg)
            this.$createDialog({
              content: res.data.msg,
              confirmBtn: {
                text: "好的",
                active: true
              },
              onConfirm: () => {}
            }).show();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //营养分析
    analysis() {
      if (!this.totalCount) {
        return;
      }
      // let dataListArr = [
      // 	{
      // 		moduleId: 23,
      // 		repastList: [
      //             {
      //                 repastId: 3, //餐次Id
      //                 menuList: [
      //                     {
      //                         kind: '1', //菜肴种类
      //                         code: '1659', //菜肴编码
      //                         qty: 1 //菜肴数量
      //                     }
      //                 ]
      //             }
      //         ]
      // 	}
      // ]
      var _this = this;
      let dataListArr = this.getAnalysisSubmitData;
      let url = this.api.userApi.GetAllMenuNutrientInfo;
      let dParam = defaultParam("", 160);
      let addParmas = {
        merchantTradeId: "",
        tempOrder: 0,
        dataList: this.getSubmitData
      };
      let parmas = Object.assign({}, dParam, addParmas);
      // console.log('营养分析参数：'+JSON.stringify(parmas))
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          if (res.data.code == "0") {
            //成功
            console.log(res.data.data);
            this.$store.commit("setAnalysis", res.data.data);
            this.$router.push({
              path: "analysis"
            });
          } else {
            alert(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    addFood(target, food) {
      this.drop(target);
      // debugger
      this.$emit("shopCarSingleFood", food);
    },
    beforeDrop(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = "";
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName("inner-hook")[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    dropping(el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight;
      this.$nextTick(() => {
        el.style.webkitTransform = "translate3d(0,0,0)";
        el.style.transform = "translate3d(0,0,0)";
        let inner = el.getElementsByClassName("inner-hook")[0];
        inner.style.webkitTransform = "translate3d(0,0,0)";
        inner.style.transform = "translate3d(0,0,0)";
        el.addEventListener("transitionend", done);
      });
    },
    afterDrop(el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = "none";
      }
    }
  },
  components: {
    cartcontrol
  }
};
</script>

<style lang="less">
.red {
  color: #f00;
  text-align: center;
  font-size: 10px;
  padding-top: 10px;
}
.cube-dialog-btns {
  border-top: 1px solid #ebebeb;
}
.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 54px;
  .content {
    display: flex;
    background: #ffffff;
    border-top: 1px solid #e7e7f1;
    font-size: 0;
    color: #ff6c42;
    .content-left {
      display: flex;
      flex: 1;
      .logo-wrapper {
        display: inline-block;
        vertical-align: top;
        position: relative;
        top: 12px;
        margin: 0 5px 0 18px;
        width: 30px;
        height: 30px;
        box-sizing: border-box;
        .logo {
          width: 29px;
          height: 28px;
          background: url(../assets/car1@2x.png) center center no-repeat;
          background-size: 100% 100%;
          &.highlight {
            background: url(../assets/car2@2x.png) center center no-repeat;
            background-size: 100% 100%;
          }
        }
        .num {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 16px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: normal;
          color: #fff;
          background: #ff6c42;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }
      .price {
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        line-height: 24px;
        padding-right: 12px;
        box-sizing: border-box;
        font-family: Akrobat-ExtraBold;
        font-size: 16px;
        color: #aaaaaa;
        line-height: 26px;
        &.highlight {
          color: #ff6c42;
          font-size: 26px;
        }
      }
    }
    .content-right {
      margin: 6px 10px 7px 0;
      flex: 0 0 208px;
      display: flex;
      justify-content: space-between;
      & > div {
        width: 104px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        font-size: 16px;
        text-align: center;
        box-sizing: border-box;
        position: relative;
      }
      .analysis,
      .pay {
        &.not-enough {
          background: #dbdbea;
        }
      }
      .analysis {
        &.enough {
          background: #484848;
        }
      }
      .pay {
        &.not-enough {
          &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 12px;
            width: 1px;
            height: 16px;
            background: rgba(255, 255, 255, 0.5);
          }
        }
        &.enough {
          background: #7574f5;
        }
      }
      &.not-enough {
        .analysis,
        .pay {
          background: #dbdbea;
        }
        .pay {
          &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 12px;
            width: 1px;
            height: 16px;
            background: rgba(255, 255, 255, 0.5);
          }
        }
      }
      &.enough {
        .analysis {
          background: #484848;
        }
        .pay {
          background: #7574f5;
        }
      }
      .analysis {
        border-radius: 100px 0 0 100px;
        padding-left: 10px;
      }
      .pay {
        border-radius: 0 100px 100px 0;
        padding-right: 10px;
      }
    }
  }
  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: rgb(117, 116, 245);
        transition: all 0.4s linear;
      }
    }
  }
  .shopcart-list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    transform: translate3d(0, -100%, 0);
    &.fold-enter-active,
    &.fold-leave-active {
      transition: all 0.5s;
    }
    &.fold-enter,
    &.fold-leave-active {
      transform: translate3d(0, 0, 0);
    }
    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 12px;
      background: #f6f6f6;
      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .empty {
        float: right;
        font-size: 14px;
        color: #505050;
        background: url(../assets/meal/empty@2x.png) left center no-repeat;
        background-size: 14px 14px;
        padding-left: 17px;
      }
    }

    .list-content {
      padding: 12px 5px 0 18px;
      max-height: 326px;
      height: 326px;
      overflow: hidden;
      background: #fff;
      .carTag {
        background: #7574f5;
        border-radius: 11px;
        font-size: 14px;
        color: #ffffff;
        width: 58px;
        height: 22px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
      }
      .carMealTimes {
        padding-top: 8px;
        font-size: 14px;
        color: #aaaaaa;
        padding-bottom: 10px;
        &.NSelectMFoodTimes {
          color: #7574f5;
        }
        &.carMealTimes2 {
          padding-top: 0;
        }
      }
      .food {
        position: relative;
        padding: 0 0 11px;
        box-sizing: border-box;
        .name {
          line-height: 22px;
          font-size: 16px;
          color: #414141;
        }
        .price {
          position: absolute;
          right: 120px;
          bottom: 12px;
          line-height: 24px;
          font-weight: 700;
          font-size: 18px;
          color: #ff8361;
          width: 40px;
          text-align: left;
        }
        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
          .cartcontrol {
            font-size: 22px;
          }
          &.singleCartcontrol {
            bottom: 0;
          }
        }
        &.selMealFood {
          display: flex;
          align-items: flex-start;
          .name {
            width: 215px;
            display: inline-block;
          }
          .price {
            right: 86px;
            top: 0;
          }
          .cartcontrol-wrapper {
            top: -5px;
            .inner {
              color: #7574f5;
            }
          }
        }
        &.NSelectMFood {
          &:last-child {
            padding-bottom: 24px;
          }
        }
      }
    }
  }
}
.list-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  backdrop-filter: blur(10px);
  opacity: 1;
  background: rgba(7, 17, 27, 0.6);
  &.fade-enter-active,
  &.fade-leave-active {
    transition: all 0.5s;
  }
  &.fade-enter,
  &.fade-leave-active {
    opacity: 0;
    background: rgba(7, 17, 27, 0);
  }
}
//营养素进度条
.progress-wrapper {
  position: fixed;
  left: 0;
  bottom: 53px;
  z-index: 50;
  width: 100%;
  &.hidden {
    display: none;
  }
  .progress {
    height: 6px;
    position: relative;
    .progressBg {
      ul {
        height: 6px;
        display: flex;
        li:nth-child(1) {
          width: 20%;
          background: #ffd149;
        }
        li:nth-child(2) {
          width: 47.5%;
          background: #21c67f;
        }
        li:nth-child(3) {
          width: 32.5%;
          background: #ff8361;
        }
      }
    }
    .ball {
      position: absolute;
      top: 1px;
      width: 4px;
      height: 4px;
      background: #fff;
      border-radius: 50%;
      .counter {
        span {
          font-size: 12px;
          padding-left: 2px;
        }
        position: absolute;
        top: -41px;
        left: -37px;
        font-size: 14px;
        color: #ffc109;
        background: url(../assets/meal/progress1@2x.png) center center no-repeat;
        background-size: 100% 100%;
        min-width: 68px;
        height: 34px;
        padding: 0 7px;
        text-align: center;
        padding-top: 12px;
        &.counter2 {
          color: #6fc8a2;
          background: url(../assets/meal/progress2@2x.png) center center
            no-repeat;
          background-size: 100% 100%;
          white-space: nowrap;
        }
        &.counter3 {
          color: #ff8361;
          background: url(../assets/meal/progress3@2x.png) center center
            no-repeat;
          background-size: 100% 100%;
        }
        &.counterDefault {
          color: #ff8361;
          background: url(../assets/meal/progress3@2x.png) center center
            no-repeat;
          background-size: 100% 100%;
          left: -70px;
        }
        &.counterDefaultLeft {
          left: -15px;
        }
      }
    }
  }
}
</style>