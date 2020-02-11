<template>
  <div :class="['recommend', flag ? 'bigSize' : '']">
    <div @click="switchModel" v-text="modelText" class="modelSwitch"></div>
    <div class="cube-slide-group">
      <div v-show="recommends && recommends.length == 0">
        <img src="../assets/images/dbanner.jpg" />
      </div>
      <cube-slide v-show="recommends && recommends.length > 0" ref="bannerslide">
        <cube-slide-item v-for="(item, index) in recommends" :key="index">
          <a :href="item.BannerSrc">
            <img :src="item.BannerImg" />
          </a>
        </cube-slide-item>
        <template slot="dots" slot-scope="props">
          <span
            class="dot"
            :class="{ active: props.current === index }"
            v-for="(item, index) in props.dots"
          ></span>
        </template>
      </cube-slide>
    </div>
    <!-- 医院公告 -->
    <div class="noticeIndex" @click="goNotice" v-if="HospitalNotice && HospitalNotice.length > 0">
      <marquee :lists="HospitalNotice"></marquee>
    </div>
    <!-- 未登录 -->
    <div class="loginModel" v-show="!isLogin">
      <div class="txt">
        <img class="img" src="../assets/images/icon1@2x.png" />绑定信息，即可轻松在线订餐
      </div>
      <div class="btn" @click="choiceBtn">立即绑定</div>
    </div>
    <!-- 已登陆 -->
    <div class="loginModel" v-show="isLogin">
      <div class="alreadyLogin">
        <!-- 不走充值结算模式，his计费等 -->
        <div class="Unbound" @click="UnboundInfo">解绑信息</div>
        <div class="main">
          <div class="media">
            <template v-if="info.sexName == '女'">
              <img src="../assets/images/woman@2x.png" />
            </template>
            <template v-if="info.sexName == '男'">
              <img src="../assets/images/man@2x.png" />
            </template>
            <div>{{ info.patName }}</div>
          </div>
          <div class="tagCon">
            <span class="tag">
              <span class="tagTxt">
                {{
                info.mealName
                }}
              </span>
            </span>
            <span
              v-show="info.nutritionEducation"
              class="more"
              @click="goArticle(info.nutritionEducation)"
            >
              <img src="../assets/images/icon1@2x.png" />了解你的饮食注意事项
            </span>
          </div>
        </div>
        <div class="account">
          <!-- 医院不走线上充值模式，仅能看交易明细 -->
          <div @click="tradeDetails()" class="account1" v-show="enableRecharge == '0'">交易明细</div>
          <!-- 显示余额 -->
          <!-- 0：未结算，1：已结算 -->
          <!-- isLeaveHospital （0：在院，1：出院） -->
          <div class="account2" v-show="enableRecharge == '1'">
            <!-- 0：未结算 -->
            <template v-if="isSettlement == 0">
              <div class="accountL">
                <span>账户余额：</span>
                <div class="numBox" v-if="info.balance > warningValue">
                  <span v-show="defaultType" class="num">
                    {{
                    info.balance
                    }}
                  </span>
                  <img v-show="!defaultType" src="../assets/images/pwd@2x.png" />
                  <i
                    @click="eyeStatus"
                    :class="
											defaultType ? 'iconeye' : 'iconeye2'
										"
                  ></i>
                </div>
                <div v-else class="notEnough">
                  <span class="num">{{ info.balance }}</span>
                  <div class="tips">余额不足!</div>
                </div>
              </div>
              <div class="accountR">
                <!-- isLeaveHospital （0：在院，1：出院） -->
                <template v-if="info.isLeaveHospital === 0">
                  <button
                    v-if="info.balance > warningValue"
                    class="accountBtn"
                    @click="goRecharge(info.balance)"
                  >账户中心</button>
                  <button v-else class="accountBtn" @click="goRecharge(info.balance)">去充值</button>
                </template>
                <template v-else>
                  <button class="accountBtn" @click="tradeDetails()">交易明细</button>
                </template>
              </div>
            </template>
            <!-- 1：已结算 -->
            <template v-else>
              <div class="accountL">
                <span>账户余额：</span>
                <div class="numBox" v-if="info.balance > warningValue">
                  <span v-show="defaultType" class="num">
                    {{
                    info.balance
                    }}
                  </span>
                  <img v-show="!defaultType" src="../assets/images/pwd@2x.png" />
                  <i
                    @click="eyeStatus"
                    :class="
											defaultType ? 'iconeye' : 'iconeye2'
										"
                  ></i>
                </div>
                <div v-else class="notEnough">
                  <span class="num">{{ info.balance }}</span>
                  <div class="tips">已结算</div>
                </div>
              </div>
              <div class="accountR">
                <template v-if="info.isLeaveHospital === 0">
                  <button class="accountBtn" @click="goRecharge(info.balance)">去充值</button>
                </template>
                <template v-else>
                  <button class="accountBtn" @click="tradeDetails()">交易明细</button>
                </template>
              </div>
            </template>
          </div>
          <!-- 刚入院，卡里没钱刚入院，卡里没钱 -->
        </div>
      </div>
    </div>
    <!-- 登陆end -->
    <!-- 模块 -->
    <!-- isSettlement 0：未结算，1：已结算 todo -->
    <!-- isLeaveHospital （0：在院，1：出院） -->
    <div class="menuList" :class="menuListClass">
      <ul>
        <li class="item" :class="itemClass" v-for="(item, index) in menuList" :key="index">
          <!-- 明日订餐 -->
          <template v-if="item.id==2">
            <router-link :to="{ name: 'orderFood', query: { id: item.id ,title:item.name} }">
              <img class="img" :src="item.picUrl" />
              <div class="txt primary-text">{{ item.name }}</div>
            </router-link>
          </template>
          <!-- 今日加餐 -->
          <template v-else-if="item.id==1">
            <router-link :to="{ name: 'orderFood', query: { id: item.id,title:item.name } }">
              <img class="img" :src="item.picUrl" />
              <div class="txt primary-text">{{ item.name }}</div>
            </router-link>
          </template>
          <template v-else-if="item.name == '我的订单'">
            <router-link to="/orderList">
              <img class="img" :src="item.picUrl" />
              <div class="txt">{{ item.name }}</div>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/">
              <img class="img" :src="item.picUrl" />
              <div class="txt">{{ item.name }}</div>
            </router-link>
          </template>
        </li>
      </ul>
    </div>
    <split></split>
    <div class="articleNavBar">
      <div class="title"></div>
      <!-- <sticky-slot class="stickyTop">
                <div class="articleScrollNav">
                    <cube-scroll-nav-bar
                        :current="current"
                        :labels="labels"
                        @change="changeHandler"
                    />
                </div>
      </sticky-slot>-->
      <sticky-slot class="stickyTop">
        <div class="articleScrollNav">
          <cube-scroll
            ref="scroll"
            :data="articlesType"
            direction="horizontal"
            class="horizontal-scroll-list-wrap"
          >
            <ul class="list-wrapper">
              <li
                v-for="(item, index) in articlesType"
                :key="index"
                class="list-item"
                :class="{ active: index === nowIndex }"
                @click="toggleTabs(index, item.code)"
              >
                <span>{{ item.name }}</span>
              </li>
            </ul>
          </cube-scroll>
        </div>
      </sticky-slot>
      <article-list :acticleListArr="acticleListArr"></article-list>
    </div>
  </div>
</template>

<script>
import marquee from "./public/marquee";
import split from "./split";
import store from "../store";
import articleList from "./articleList";
import { authPageBaseUri, homePage, wechatAppId } from "../common/env";
import {
  encryption,
  encryptionRechange,
  formatDate,
  formatReq,
  defaultParam,
  extractQueryParams,
  defaultParam2
} from "../common/js/util";
import CryptoJS from "../common/js/triplede123456s";

import stickySlot from "./public/stickySlot.vue";
import storage from "../common/js/storage";

export default {
  name: "index",
  components: {
    split,
    articleList,
    stickySlot,
    marquee
  },
  inject: ["reload"],
  data() {
    return {
      isLogin: false,
      HospitalNotice: "",
      // HospitalNotice: '医院国庆放假通知：于2019-10-1至2019年10-3放假', //医院公告
      info: "",
      account: 1500,
      defaultType: false, //控制眼睛图片
      flag: false, //切换开关
      modelText: "敬老模式", //模式切换
      recommends: [], //轮播图
      menuList: [], //模块
      current: "高血压",
      labels: ["高血压", "糖尿病", "心脏病", "高血糖", "冠心病", "慢性气管炎"],
      nowIndex: 0,
      articlesType: [],
      articleTypeId: "",
      openid: "",
      acticleListArr: [],
      warningValue: "", //预警值
      enableRecharge: "", //启用充值
      isSettlement: "", //结算 0：未结算，1：已结算
      paymentList: [], //支付方式
      currentPage: 1, //当前页码
      pageSize: 20, //每一页的页数
      totalRecord: 0, //总条数
      nextPageIds: [] //文章已加载id
    };
  },
  computed: {
    //主模块
    menuListClass() {
      //根据支付方式  病人已结算显示模块
      //2中显示模块 可以点餐   1种余额不可以：微信可以
      // isLeaveHospital （0：在院，1：出院）
      if (this.isLogin) {
        if (this.info.isLeaveHospital === 0) {
          if (this.paymentList.length == 1) {
            if (this.paymentList[0].code == "001" && this.isSettlement != 0) {
              //余额支付  不可以点餐
              return "dn";
            }
            return "";
          } else {
            return "";
          }
        } else {
          return "dn";
        }
      } else {
        return "";
      }
    },
    //总页码
    totalPage() {
      return (this.totalRecord + this.pageSize - 1) / this.pageSize;
    },
    /*
              isLogin() {
                  if (storage.getItem('userStatus')) {
                      this.$store.commit('changeIsLogin', true)
                  } else {
                      this.$store.commit('changeIsLogin', false)
      			}
      			console.log('isLogin'+
      			this.$store.state.isLogin +
                      '----是否登陆状态------判断的----' +
                      storage.getItem('userStatus'))
                  return this.$store.state.isLogin
              },*/
    itemClass() {
      console.log("fin");
      if (this.menuList.length === 1) {
        return "w10";
      } else if (this.menuList.length === 2) {
        return "";
      } else if (
        this.menuList.length === 3 ||
        this.menuList.length % 3 === 0 ||
        this.menuList.length === 5
      ) {
        return "itemOdd";
      } else if (
        this.menuList.length === 4 ||
        this.menuList.length % 4 === 0 ||
        this.menuList.length === 7
      ) {
        return "itemEven";
      }
    }
  },
  created() {
    var $this = this;

    // 测试
    storage.setItem("openId", "ocWCVwjK_kseL-qYB83YuQYk6l3Q");
    storage.setItem("userStatus", true);

    var getopenid = storage.getItem("openId");
    /*  if (getopenid == null || getopenid == undefined || getopenid == "") {
      //无openid，或无正确的openid，此时获取openid
      var queryParams = extractQueryParams(window.location.href);
      var opencode = queryParams.code;
      if (opencode == null || opencode == undefined || opencode == "") {
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechatAppId}&redirect_uri=${homePage}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
      } else {
        var _this = this;
        let authCode = encryption("wincome", 230);
        let callTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
        let url = _this.api.userApi.GetOpenid;
        let parmas = {
          authCode: authCode,
          code: opencode,
          pageURL: "/index"
        };
        _this.$ajax
          .post(url, _this.qs.stringify(parmas))
          .then(res => {
            console.log("授权后取到的openid：" + res.data.openid);
            console.log(res);
            // ocWCVwkas3DM6IQhJrpwTonAbTFc
            storage.setItem("openId", res.data.openid);
            // 静默状态刷新页面
            $this.reload();
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }*/

    console.log(
      "----是否登陆状态------判断的----" + storage.getItem("userStatus")
    );
    if (storage.getItem("userStatus")) {
      this.isLogin = true;
      this.$store.commit("changeIsLogin", true);
    } else {
      this.$store.commit("changeIsLogin", false);
      this.isLogin = false;
    }

    this.GetNotice();
    this.GetSetting();
    this.GetPaymentList();
    this.getBanner();
    this.GetModuleList();
    this.GetIllness();
    this.openid = storage.getItem("openId");
    this.GetPatientInfo();

    // switchModel 1：小字 2:大字
    let storageFlag = storage.getItem("switchModel");
    if (storageFlag == "" || storageFlag == 1) {
      storageFlag = 1;
      this.modelText = "敬老模式";
    } else if (storageFlag == 2) {
      this.modelText = "普通模式";
    }

    this.flag = storageFlag == 2;
    storage.setItem("switchModel", storageFlag);
  },
  mounted() {
    // 1、挂载完成后，判断浏览器是否支持popstate
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  methods: {
    goBack() {
      // 3、将监听操作写在methods里面，removeEventListener取消监听内容必须跟开启监听保持一致，所以函数拿到methods里面写
      this.$router.replace({
        path: "/",
        name: "index"
      }); //replace替换原路由，作用是避免回退死循环
    },
    //获取支付方式列表
    GetPaymentList() {
      if (!storage.getItem("userStatus")) return;
      var _this = this;
      let url = this.api.userApi.GetPaymentList;
      let parmas = defaultParam("", 153);
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          if (res.data.code == "0") {
            //成功
            _this.paymentList = res.data.data;
            // _this.paymentList = [{code: "002", name: "微信支付", balance: null, sortId: 6}]
          } else if (resp.data.code == 4) {
            _this.isLogin = false;
            console.log("修改登录框");
            storage.setItem("userStatus", false);
          } else {
            alert(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    GetNotice() {
      //医院公告和登录无关
      var _this = this;
      let url = this.api.userApi.GetNotice;
      // let parmas = defaultParam2('wx_wincome', 101)
      let parmas = {
        authCode: encryption("wx_wincome", 304),
        noticeType: 2 //1订餐须知  2 订餐公告
      };
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          _this.HospitalNotice = res.data.data.title;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //饮食注意事项
    goArticle(nutritionEducation) {
      this.$store.commit("indexNutritionEducation", nutritionEducation);
      this.$router.push({
        path: "/articleDetails",
        name: "articleDetails",
        query: {
          from: "mealNotice"
        }
      });
    },
    goNotice() {
      this.$router.push({
        path: "/hosNotice",
        name: "hosNotice"
      });
    },
    GetSetting() {
      if (!storage.getItem("userStatus")) return;
      var _this = this;
      let url = this.api.userApi.GetSetting;
      let openid = storage.getItem("openId");
      let parmas = defaultParam("", 103);
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(resp => {
          if (resp.data.code == 0) {
            console.log(resp.data.data);
            let findVal = resp.data.data.find(item => {
              return item.code === "003";
            });
            let findVal2 = resp.data.data.find(item => {
              return item.code === "002";
            });
            _this.enableRecharge = findVal2.value; //启用充值
            storage.setItem("enableRecharge", _this.enableRecharge);
            _this.warningValue = findVal.value; //余额预警值
          } else {
            this.$myToast.error(resp.data.msg);
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    //病人信息
    GetPatientInfo() {
      if (!this.openid || !storage.getItem("userStatus")) {
        return false;
      }
      var _this = this;
      let url = this.api.userApi.GetPatientInfo;
      let parmas = defaultParam("", 102);

      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(resp => {
          console.log("修改登录框srart");
          if (resp.data.code == 0) {
            this.info = resp.data.data;
            this.isSettlement = resp.data.data.isSettlement;
            storage.setItem("patName", resp.data.data.patName);
            storage.setItem("patId", resp.data.data.patId); //病人id
          } else if (resp.data.code == 4) {
            console.log("修改登录框");
            _this.isLogin = false;
            storage.setItem("userStatus", false);
          } else {
            this.$myToast.error(resp.data.msg);
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    toggleTabs(index, id) {
      this.nowIndex = index;
      this.articleTypeId = id;
      this.GetActicleList();
      console.log(`点击的文章id:${id}`);
    },
    //文章标签
    GetIllness() {
      var _this = this;
      let url = this.api.userApi.GetIllness;
      let parmas = {
        authCode: encryption("wx_wincome", 303)
      };
      _this.$ajax
        .post(url, parmas)
        .then(res => {
          _this.articlesType = res.data.data;
          this.$nextTick(() => {
            this.$refs.scroll.refresh();
          });
          _this.articleTypeId = res.data.data[0].code;
          _this.GetActicleList();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //文章列表
    // vue 中监测滚动条加载数据（懒加载数据）
    // 获取滚动条当前的位置
    getScrollTop() {
      let scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop;
    },
    // 获取当前可视范围的高度
    getClientHeight() {
      let clientHeight = 0;
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
      }
      return clientHeight;
    },

    // 获取文档完整的高度
    getScrollHeight() {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
    },
    // 滚动事件触发下拉加载
    onScroll() {
      if (
        this.getScrollHeight() - this.getClientHeight() - this.getScrollTop() <=
        0
      ) {
        if (this.currentPage <= this.totalPage) {
          this.currentPage++;
          // 调用请求函数
          this.GetActicleList();
        } else {
          // this.$myToast.error('没有更多内容了');
          this.toast = this.$createToast({
            txt: "没有更多内容了！",
            type: "txt"
          });
          this.toast.show();
        }
      }
    },
    //end
    GetActicleList() {
      var _this = this;
      let url = this.api.userApi.GetActicleList;
      let parmas = {
        wexinNo: "wx_wincome",
        authCode: encryption("wx_wincome", 302),
        IllnessCode: this.articleTypeId,
        pageSize: _this.pageSize, //每次获取数量
        currentPage: _this.currentPage, //当前页数
        ids: _this.nextPageIds.join(",") //已加截过的文章id,id用,隔开
      };
      // console.log('参数：'+JSON.stringify(parmas))
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          _this.acticleListArr = res.data.data;
          res.data.data.forEach(item => {
            _this.$set(item, "isClicked", false);
          });

          // mounted钩子函数监听滚动事件
          this.$nextTick(() => {
            window.addEventListener("scroll", _this.onScroll);
          });
          // _this.acticleListArr = _this.acticleListArr.concat(res.data.data)
          // _this.totalRecord = res.data.count
          // let getNextPageIds = []
          // for (let i = 0; i < res.data.data.length; i++) {
          // 	getNextPageIds.push(res.data.data[i].id)
          // }
          // _this.nextPageIds = _this.nextPageIds.concat(getNextPageIds)
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    GetModuleList() {
      var _this = this;
      let url = this.api.userApi.GetMainModuleList;
      let parmas = defaultParam("wincome", 154);
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          if (res.data.code == "0") {
            //成功
            let data = res.data.data;
            let newData = data.map(item => {
              if (item.id == 1) {
                return { ...item, name: "今日订餐" };
              } else {
                return item;
              }
            });
            this.menuList = newData;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getBanner() {
      var _this = this;
      let url = this.api.userApi.GetBanner;
      let parmas = defaultParam2("wx_wincome", 301);
      _this.$ajax
        .post(url, parmas)
        .then(res => {
          _this.recommends = res.data.data;
          this.$nextTick(() => {
            _this.$refs.bannerslide.refresh();
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //绑定
    choiceBtn() {
      storage.setItem("callbackUrl", "");
      this.$router.push({
        path: "choice"
      });
    },
    //解绑信息
    UnboundInfo() {
      this.$router.push({
        path: "info"
      });
    },
    //去充值  账户中心
    goRecharge(val) {
      this.$router.push({
        path: "recharge",
        query: {
          balance: val
        }
      });
    },
    //交易明细
    tradeDetails(val) {
      this.$router.push({
        name: "tradeDetails"
      });
    },
    //密码type切换
    eyeStatus() {
      if (this.defaultType) {
        this.defaultType = false;
      } else {
        this.defaultType = true;
      }
    },
    changeHandler(cur) {
      this.current = cur;
    },
    //系统弹窗
    aa() {
      this.$myToast.success("成功啦丫丫");
    },
    //切换模式
    switchModel() {
      let switchModel = 1; // this.flag ? 1 : 2;
      this.flag = !this.flag;
      if (this.flag == true) {
        switchModel = 2;
        this.modelText = "普通模式";
      } else if (this.flag == false) {
        this.modelText = "敬老模式";
        switchModel = 1;
      }
      storage.setItem("switchModel", switchModel);
    }
  },
  // beforeRouteLeave(to, from, next) {
  //     from.meta.keepAlive = false;
  //     next();
  // },
  destroyed() {
    // 2、页面销毁时，取消监听。否则其他vue路由页面也会被监听
    window.removeEventListener("popstate", this.goBack, false);
    window.removeEventListener("scroll", this.onScroll);
  }
};
</script>

<style lang="less">
@import "../common/less/mixin.less";

.stickyTop {
  top: 0;
  z-index: 10;
}

.recommend {
  position: relative;
  background: #fff;
}

.bigSize {
  .alreadyLogin .main .tagCon .tag .tagTxt {
    font-size: 15px;
  }

  .alreadyLogin .account .account2 .accountR .accountBtn {
    font-size: 15px;
  }

  .articleNavBar .articleScrollNav .list-item {
    font-size: 17px;
  }

  .alreadyLogin .account .account2 .accountL {
    font-size: 15px;
  }

  .alreadyLogin .main .tagCon .more {
    font-size: 13px;
  }

  .noticeIndex,
  .menuList ul .item .txt {
    font-size: 17px;
  }

  .loginModel {
    font-size: 18px;
    padding: 6px 0;
  }

  .cube-scroll-nav-bar-item {
    font-size: 18px;
  }

  .articleList ul li.item .text p {
    font-size: 16px;
  }

  .articleNavBar .articleScrollNav .cube-scroll-nav-bar-item,
  .articleList ul li.item .text h2 {
    font-size: 17px;
  }

  .cube-slide-group {
    img {
      width: 100%;
      height: 130px;
      max-height: 130px;
      display: block;
    }
  }
}

.modelSwitch {
  z-index: 2;
  position: absolute;
  right: 0;
  top: 15px;
  background: url(../assets/images/model@2x.png) no-repeat center center;
  background-size: 100% 100%;
  width: 88px;
  height: 25px;
  font-size: 15px;
  color: #ffffff;
  letter-spacing: 0;
  text-align: center;
  line-height: 25px;
}

.cube-slide-group {
  img {
    width: 100%;
    height: 120px;
    max-height: 120px;
    display: block;
  }
}

.recommend {
  .cube-slide-dots {
    bottom: 6px;
  }

  .cube-slide-dots span.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    opacity: 0.2;
    background: #505050;
    margin: 0 6px;
  }

  .cube-slide-dots span.dot.active {
    background: #7574f5;
    opacity: 1;
  }
}

.noticeIndex {
  display: flex;
  align-items: center;
  background: url(../assets/images/notice@2x.png) no-repeat left center #fdf1ed;
  background-size: 28px 28px;
  padding: 0 15px 0 38px;
  height: 28px;
  border-radius: 17px;
  margin: 12px;
  font-size: 14px;
  color: #ff8361;
  // letter-spacing: -1.5px;
  line-height: 14px;
}

.loginModel {
  opacity: 0.85;
  background-image: linear-gradient(-141deg, #6782ff 0%, #8268eb 100%);
  box-shadow: 0 2px 15px 0 rgba(117, 116, 245, 0.7);
  border-radius: 8px;
  margin: 12px;
  text-align: center;
  font-size: 16px;
  position: relative;

  .txt {
    padding-top: 18px;
    color: #fff;
    line-height: 16px;

    .img {
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: top;
      margin-right: 7px;
      margin-top: -1px;
    }
  }

  .btn {
    display: inline-block;
    background: #ffffff;
    border-radius: 15px;
    color: #7574f5;
    width: 98px;
    padding: 7px 0;
    margin: 15px 0;
  }
}

//已经登陆模块
.alreadyLogin {
  height: 144px;
  box-sizing: border-box;
  padding: 12px;

  .Unbound {
    z-index: 3;
    position: absolute;
    right: -4px;
    top: 7px;
    color: #fff;
    font-size: 15px;
    width: 88px;
    height: 31px;
    background: url(../assets/images/icon2@2x.png) no-repeat center center;
    background-size: 100% 100%;
    line-height: 25px;
  }

  .main {
    .media {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;

      img {
        float: left;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #fff;
      }

      div {
        font-size: 22px;
        color: #fff;
        margin-left: 10px;
      }
    }

    .tagCon {
      display: flex;
      align-items: center;
      padding-top: 10px;

      .tag {
        position: relative;

        &::before {
          content: "";
          position: absolute;
          left: 0.7px;
          top: 0;
          background: url(../assets/images/icon3@2x.png) center no-repeat;
          background-size: 100% 100%;
          width: 15px;
          height: 20px;
        }

        .tagTxt {
          // .box-c();
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 0 4px 4px 0;
          color: #7574f5;
          font-size: 12px;
          height: 20px;
          line-height: 22px;
          min-width: 50px;
          font-weight: bold;
          margin-left: 14px;
          padding: 0 7px 0 0;
        }
      }

      .more {
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 12px;

        img {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin: 0 5px 0 18px;
        }
      }
    }
  }

  .account {
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    padding: 11px 0 0;
    margin-top: 10px;

    .account1 {
      width: 74px;
      padding: 6px 0;
      background: #fff;
      border-radius: 13px;
      font-size: 14px;
      color: #7574f5;
      position: relative;
      left: 50%;
      margin-left: -37px;
      font-weight: bold;
    }

    .account2 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;

      .accountL {
        font-size: 14px;
        color: #fff;
        display: flex;
        height: 30px;
        align-items: center;

        .num {
          font-family: Akrobat-ExtraBold;
          font-size: 30px;
          color: #ffffff;
          line-height: 26px;
        }

        .numBox {
          line-height: 22px;

          img {
            width: 44px;
            height: 9px;
            display: inline-block;
            vertical-align: top;
            margin-top: 8px;
          }

          i {
            font-size: 22px;
            display: inline-block;
            vertical-align: top;
            margin-top: 3px;
            margin-left: 10px;
          }
        }

        .notEnough {
          position: relative;

          .tips {
            display: inline-block;
            background: #fff;
            border-radius: 4px;
            // padding: 4px 6px;
            padding: 0 6px;
            font-size: 12px;
            // line-height: 12px;
            height: 20px;
            line-height: 22px;
            color: #ff8361;
            font-weight: bold;
            position: relative;
            top: -6px;
            left: 6px;

            &::after {
              content: "";
              width: 0;
              height: 0;
              border: 4px solid;
              position: absolute;
              top: 6px;
              left: -8px;
              border-color: transparent #fff transparent transparent;
            }
          }
        }
      }

      .accountR {
        .accountBtn {
          border: none;
          padding: 4px 9px;
          background: #fff;
          border-radius: 13px;
          font-size: 14px;
          color: #7574f5;
          font-weight: bold;
        }
      }
    }
  }
}

.menuList {
  padding: 5px 0 0;
}

.menuList ul {
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  align-items: center;

  .item {
    width: 50%;
    margin-bottom: 22px;
    text-align: center;

    .img {
      width: 48px;
      height: 48px;
    }

    .txt {
      font-size: 14px;
      color: #3a3a3a;
      &.primary-text {
        font-weight: 600;
      }
    }
  }

  .itemOdd {
    width: 33.3%;
  }

  .itemEven {
    width: 25%;
  }

  .w10 {
    width: 100%;
  }
}

.tem-flex ul:after {
  content: "";
  width: 30%;
  border: 1px solid transparent;
}

.articleNavBar {
  padding: 20px 0 20px 18px;

  .title {
    position: rlative;
    background: url(../assets/images/title@2x.png) no-repeat left center;
    background-size: 100% 100%;
    width: 97px;
    height: 17px;
  }

  .articleScrollNav {
    .horizontal-scroll-list-wrap {
      font-size: 0;
      background: #ffffff;
    }

    border-bottom: 1px solid #e7e7f1;

    .cube-scroll-content {
      display: inline-block;
    }

    .list-wrapper {
      white-space: nowrap;
    }

    .list-item {
      display: inline-block;
      font-size: 16px;
      color: #7a7a7a;
      padding: 20px 15px 15px;
      position: relative;
    }

    .cube-scroll-nav-bar-item {
      font-size: 16px;
      color: #7a7a7a;
      padding: 20px 15px 15px;
    }

    .active {
      font-size: 16px;
      color: #7574f5;
      position: relative;

      ::after {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        background: #7574f5;
        border-radius: 2.5px;
        width: 15px;
        height: 4px;
        content: "";
      }
    }

    .cube-scroll-nav-bar-item_active {
      font-size: 16px;
      color: #7574f5;
      position: relative;

      ::after {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        background: #7574f5;
        border-radius: 2.5px;
        width: 15px;
        height: 4px;
        content: "";
      }
    }
  }
}
</style>
