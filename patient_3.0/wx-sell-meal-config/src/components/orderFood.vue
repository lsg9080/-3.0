<template>
  <div class="goods">
    <!-- <meal-mode
            :mealTypeItem="mealTypeItem"
            @mealTypeId="getMealTypeId"
    ></meal-mode>-->
    <div class="mealType">
      <div
        class="tab-item"
        :class="{ on: index === nowIndex }"
        @click="toggleTabs(index, item.id, item.name)"
        v-for="(item, index) in moduleList"
        :key="item.id"
      >{{ item.name }}</div>
    </div>
    <!-- 公告 -->
    <div class="mealNotice" @click="showNoticeBtn">
      <p>{{orderTime}}</p>
      <p>{{mealNoticeData}}</p>
    </div>
    <!-- 餐次分类 早中晚 -->
    <div class="mealTimesItem">
      <cube-scroll
        ref="mealScroll"
        :data="mealTimesList"
        direction="horizontal"
        class="horizontal-scroll-list-wrap"
      >
        <ul class="list-wrapper">
          <li
            v-if="currentRepastList"
            v-for="(item, index) in currentRepastList"
            :key="index"
            class="list-item"
            :class="{ active: index === currentIndex }"
            @click="toggleMTabs(index, item.repastId, item.repastName)"
          >
            <span>{{ item.repastName }}</span>
          </li>
        </ul>
      </cube-scroll>
    </div>
    <!-- 暂无配菜 -->
    <div class="noConfigure" v-if="configure == false">
      <img src="../assets/fw.png" />
      <p>{{configureMsg}}</p>
    </div>
    <div class="tab_content">
      <!-- 1：单点，2：套餐，3：N选M -->
      <!-- 单点模式 -->
      <template
        v-if="currentMenuList.orderingMode === 1"
        &#x26;#x26;#x26;#x26;#x26;#x26;#x26;#x26;&#x26;#x26;#x26;#x26;#x26;#x26;#x26;#x26;
        dandian
      >
        <div class="goodsMeal">
          <div class="menu-wrapper" ref="menuWrapper">
            <ul>
              <li
                v-for="(item,innerIndex) in currentMenuList.dataList[0].repastDataList"
                class="menu-item"
                :key="innerIndex"
                :class="{current:currentMealIndex === innerIndex}"
                @click.stop.prevent="selectMenu(innerIndex,$event)"
                ref="menuList"
              >
                <span class="text border-1px">{{ item.menuTypeName }}</span>
              </li>
            </ul>
          </div>

          <div class="foods-wrapper" ref="foodsWrapper">
            <ul ref="ulfoodsWrapper">
              <li
                v-for="item in currentMenuList
									.dataList[0].repastDataList"
                class="food-list"
                ref="foodList"
              >
                <h1 class="title">{{ item.menuTypeName }}</h1>
                <ul class="foodsWrapper">
                  <li class="food-item" v-for="food in item.menuList" :key="food.code">
                    <div class="foodContent">
                      <div class="icon" @click.stop.prevent="selectFood(food, $event)">
                        <template v-if="!food.picUrl">
                          <img width="80" height="80" src="../assets/images/timg.jpg" />
                        </template>
                        <template v-else>
                          <img v-lazy="food.picUrl" width="80" height="80" />
                        </template>
                      </div>
                      <div class="content">
                        <h2 class="name" @click="selectFood(food, $event)">{{ food.name }}</h2>
                        <p v-if="food.tabooTips" class="desc">{{ food.tabooTips }}</p>
                        <div class="price">￥{{ food.price }}</div>
                        <div class="cartcontrol-wrapper">
                          <cartcontrol @add="addFood" @decrease="decreaseFood" :food="food"></cartcontrol>
                        </div>
                      </div>
                    </div>
                    <div class="foodNutrient" @click="selectFood(food, $event)">
                      <div class="L">
                        <span>
                          能量:{{
                          food.Nutrients.能量
                          }}kcal
                        </span>
                        <span>
                          蛋白质:{{
                          food.Nutrients
                          .蛋白质
                          }}g
                        </span>
                      </div>
                      <div class="more">
                        了解更多
                        <i class="iconright"></i>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <!-- 套餐 -->
      <template v-else-if="currentMenuList.orderingMode === 2">
        <div v-for="(v, index) in currentRepastList" :key="v.repastId">
          <div v-show="currentIndex == index">
            <div class="foodScroll">
              <cube-scroll ref="scroll" :data="currentMenuList.dataList[0].menuList">
                <ul class="setMeal">
                  <li
                    v-for="(item, index) in currentMenuList
											.dataList[0].menuList"
                    :key="index"
                    class="setMealItem"
                  >
                    <div class="selBTn" @click.stop.prevent="choosedSetMeal(item)">
                      <i
                        :class="[
													'iconselectdefault2',
													item.count > 0
														? 'iconxuanze'
														: ''
												]"
                      ></i>
                    </div>
                    <div class="tag">套餐{{ index + 1 }}</div>
                    <template
                      v-if="
												currentMenuList.dataList[0]
													.isMultiPicture == 1
											"
                    >
                      <div class="dn">套餐多图模式</div>
                      <div class="mealMoreImg">
                        <h2 class="name" @click="selectFood(item, $event)">{{ item.name }}</h2>
                        <div class="imgArrScroll">
                          <cube-scroll
                            ref="scroll"
                            :data="item.picArr"
                            direction="horizontal"
                            nest-mode="free"
                            class="img-scroll-list-wrap"
                          >
                            <ul class="list-wrapper">
                              <li
                                v-for="(itemImg,
																index) in item.picUrlList"
                                :key="index"
                                class="list-item"
                              >
                                <img v-lazy="itemImg" />
                              </li>
                            </ul>
                          </cube-scroll>
                        </div>
                        <div class="price">￥{{ item.price }}</div>
                      </div>
                    </template>
                    <template
                      v-if="
												currentMenuList.dataList[0]
													.isMultiPicture == 0
											"
                    >
                      <div class="dn">套餐单图</div>
                      <div class="mealSingleImg">
                        <div class="img" @click="selectFood(item, $event)">
                          <img v-lazy="item.picUrl" />
                        </div>
                        <div class="content">
                          <h2 class="name" @click="selectFood(item, $event)">{{ item.name }}</h2>
                          <div class="price">￥{{ item.price }}</div>
                        </div>
                      </div>
                    </template>
                    <div class="dn">结束</div>
                    <div class="foodNutrientWrapper">
                      <div class="foodNutrient">
                        <div class="L">
                          <span>
                            能量:{{
                            item.Nutrients.能量
                            }}kcal
                          </span>
                          <span>
                            蛋白质:{{
                            item.Nutrients
                            .蛋白质
                            }}g
                          </span>
                        </div>
                        <div class="more" @click="selectFood(item, $event)">
                          了解更多
                          <i class="iconright"></i>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </cube-scroll>
            </div>
          </div>
        </div>
      </template>
      <!-- N选M -->
      <template v-else-if="currentMenuList.orderingMode === 3">
        <div v-for="(v, index) in currentRepastList" :key="v.repastId">
          <div v-show="currentIndex == index">
            <div class="foodScroll">
              <cube-scroll
                ref="scroll"
                :data="
									currentMenuList.dataList[0].repastDataList
								"
              >
                <div
                  v-for="(item, outIndex) in currentMenuList
										.dataList[0].repastDataList"
                  :key="outIndex"
                  class="NSelectMWrapper"
                >
                  <div class="NSelectMTitle">
                    {{ item.menuTypeName
                    }}
                    <span>（{{ item.nmName }}）</span>
                  </div>
                  <ul class="setMeal NSelectM">
                    <li
                      v-for="(mealItem,
											index) in item.menuList"
                      :key="index"
                      class="setMealItem"
                      @click="selectFood(mealItem, $event, outIndex, mealItem,currentMenuList.dataList[0].price, item.N, item.M, item.menuTypeName)"
                    >
                      <div
                        class="selBTn"
                        @click.stop.prevent="choosedMeal(outIndex,mealItem,currentMenuList.dataList[0].price,item.N,item.M,item.menuTypeName)"
                      >
                        <i
                          :class="[
														'iconselectdefault2',
														mealItem.count > 0
															? 'iconxuanze'
															: ''
													]"
                        ></i>
                      </div>
                      <div class="mealSingleImg">
                        <div class="img">
                          <img v-lazy="mealItem.picUrl" />
                        </div>
                        <div class="content">
                          <h2 class="name">{{ mealItem.name }}</h2>
                        </div>
                      </div>
                      <div class="foodNutrientWrapper">
                        <div class="foodNutrient">
                          <div class="L">
                            <span>
                              能量：{{
                              mealItem
                              .Nutrients
                              .能量
                              }}kcal
                            </span>
                            <span>
                              蛋白质：{{
                              mealItem
                              .Nutrients
                              .蛋白质
                              }}g
                            </span>
                          </div>
                          <div class="more">
                            了解更多
                            <i class="iconright"></i>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </cube-scroll>
            </div>
          </div>
        </div>
      </template>
      <!-- 不同点餐模式end -->
    </div>
    <shopcart
      v-if="reFresh"
      ref="shopcart"
      :selectFoods="selectFoods"
      :paymentList="paymentList"
      @totalPrice="totalPrice"
      @shopCarSingleFood="shopCarSingleFood"
      @shopCarDecreaseFood="shopCarDecreaseFood"
      @shopCarDecreaseNMFood="shopCarDecreaseNMFood"
      @emptyShopCar="emptyShopCar"
    ></shopcart>
    <pay-way
      v-if="paymentList.length > 1"
      :payPrice="payPrice"
      :paymentList="paymentList"
      :selectFoods="selectFoods"
      @emptyShopCar="emptyShopCar"
    ></pay-way>
    <!-- 公告 -->
    <meal-notice
      :showFold="$store.state.fold"
      :mealNoticeListData="mealNoticeListData"
      :mealNoticeData="mealNoticeData"
      @hideState="hideNotice"
    ></meal-notice>
    <!-- 选择疾病 -->
    <choose-diseases></choose-diseases>
    <food
      @add="addFood"
      @decrease="decreaseFood"
      :detailFood="detailFood"
      :foodInfo="foodInfo"
      :NMItemPrams="NMItemPrams"
      ref="food"
    ></food>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from "vue";
import storage from "../common/js/storage";
import BScroll from "better-scroll";
import { defaultParam } from "../common/js/util";
import cartcontrol from "./cartcontrol";
import food from "./food";
import shopcart from "./shopcart";
import payWay from "./payWay";
import mealMode from "./mealMode";
import mealNotice from "./mealNotice";
import chooseDiseases from "./chooseDiseases";
import goodsData from "../data.json";
const goods = goodsData.goods;
// const food = goodsData.goods.food
export default {
  components: {
    mealMode,
    cartcontrol,
    food,
    shopcart,
    payWay,
    mealNotice,
    chooseDiseases
  },
  data() {
    return {
      dandian: true,
      mealNoticeData: "", //订餐公告  start
      orderTime: "", //订餐时间
      mealNoticeListData: [], //订餐公告弹窗   end
      moduleList: [], //最外侧模块数据
      newRepastList: [], //餐次数据(早中晚)，通过parentId区分
      menuList: [], //具体食谱数据，通过parentId区分
      currentModuleId: "", //当前模块Id
      oldCurrentModuleId: "", //当前模块Id
      currentModuleName: "", //当前模块name
      currentRepastId: "", //当前餐次Id
      currentRepastName: "", //当前餐次name
      selectSetFoods: [], //套餐选中项
      paymentList: [], //支付方式列表
      configure: true, //是否配置餐次，默认为是
      foodInfo: {}, //菜肴详情
      detailFood: {}, //当前菜肴传到详情页
      NMItemPrams: {}, //N选M传到详情页的参数
      configureMsg: "当前餐次未配餐",
      picArr: [
        "http://fuss10.elemecdn.com/f/28/a51e7b18751bcdf871648a23fd3b4jpeg.jpeg?imageView2/1/w/750/h/750",
        "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750",
        "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750",
        "http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114",
        "http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/114/h/114",
        "http://fuss10.elemecdn.com/f/28/a51e7b18751bcdf871648a23fd3b4jpeg.jpeg?imageView2/1/w/114/h/114"
      ],
      mainId: "", //首页模块传过来id
      mealTypeId: "", //点餐模式ID
      mealTypeItem: [], //点餐模式列表
      payPrice: 0,
      fold: false, //公告详细信息
      data: goods, //单点
      initialIndex: 0,
      currentFood: "", //单点当前导航 active 项的 key 值
      currentIndex: 0, //餐次默认选中
      mealTimesList: [], //餐次列表
      mealTimesID: "", //餐次id
      selectedFood: {},
      nowIndex: 0,
      reFresh: true,
      newMenuList: {}
    };
  },
  computed: {
    isNMDefaultSelect() {
      let setting = this.$store.state.setting;
      let NMDefault = setting.find(item => {
        return item.code === "004" && item.value == 1;
      });
      return NMDefault ? true : false;
    },
    currentRepastList() {
      let repastList = [];
      for (let i = 0; i < this.newRepastList.length; i++) {
        if (this.newRepastList[i].parentId == this.currentModuleId) {
          repastList.push(this.newRepastList[i]);
        }
      }
      return repastList;
    },
    currentMenuList() {
      // debugger
      for (let j = 0; j < this.menuList.length; j++) {
        if (
          this.menuList[j].parentId ==
          this.currentModuleId + "_" + this.currentRepastId
        ) {
          return this.menuList[j];
        }
      }
      return {};
    },
    currentKey() {
      return this.currentModuleId + "_" + this.currentRepastId;
    },
    currentMealIndex() {
      if (!this.currentMenuList) return 0;
      let listHeight = this.currentMenuList.listHeight;
      if (!listHeight) return 0;
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        let scrollY = this.currentMenuList.scrollY;
        if (!height2 || (scrollY >= height1 && scrollY < height2)) {
          this._followScroll(i);
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      if (this.$route.query.id == 1) {
        //今日加餐
        this.selectSetFoods = storage.getObjItem("mycar1");
      } else {
        //明日订餐
        this.selectSetFoods = storage.getObjItem("mycar2");
      }
      let foods = [];
      //单点1  套餐2  NM 3
      if (this.currentMenuList.orderingMode == 1) {
        if (this.selectSetFoods.length == 0) {
          return [];
        }
        // 若当前购物车中存在失效的菜品或菜品类型改变，则重新计算
        this.selectSetFoods.forEach(food => {
          foods.push(food);
        });
        return foods;
  
      } else if (this.currentMenuList.orderingMode == 2) {
        // debugger
        if (this.selectSetFoods.length == 0) {
          return [];
        }
        this.selectSetFoods.forEach(food => {
          foods.push(food);
        });
        return foods;
      } else if (this.currentMenuList.orderingMode == 3) {
        // debugger
        if (this.selectSetFoods.length == 0) {
          return [];
        }
        this.selectSetFoods.forEach(food => {
          foods.push(food);
        });
        return foods;
      }
    }
  },
  created() {
    this.mainId = this.$route.query.id; //接收主模块id
     const title = this.$route.query.title;
    document.title = title;
    // if (this.$route.query.id == 1) {
    //   document.title = "今日加餐";
    // } else {
    //   document.title = "明日订餐";
    // }
    this.GetModuleList(); //获取主模块
    this.GetPaymentList(); //获取支付方式列表
  },
  mounted() {
    // 1、挂载完成后，判断浏览器是否支持popstate
    // if (window.history && window.history.pushState) {
    // 	history.pushState(null, null, document.URL);
    // 	window.addEventListener('popstate', this.goBack, false)
    // }
  },
  methods: {
    // goBack(){
    // 	// 3、将监听操作写在methods里面，removeEventListener取消监听内容必须跟开启监听保持一致，所以函数拿到methods里面写
    // 	this.$router.replace({
    // 		path: '/',
    // 		name: 'index'
    // 	}); //replace替换原路由，作用是避免回退死循环
    // },
    //提交订单清空购物车
    emptyShopCar() {
      if (this.$route.query.id == 1) {
        //今日加餐
        storage.setObjItem("mycar1", []);
      } else {
        //明日订餐
        storage.setObjItem("mycar2", []);
      }

      this.selectSetFoods = [];
      // debugger
      for (let index in this.menuList) {
        if (this.menuList[index].orderingMode == 2) {
          // debugger
          // let repastDataList =
          let menuList = this.menuList[index].dataList[0].menuList;
          for (let menuIndex in menuList) {
            menuList[menuIndex].count = 0;
          }
        } else {
          let repastDataList = this.menuList[index].dataList[0].repastDataList;
          for (let repeatindex in repastDataList) {
            let menuList = repastDataList[repeatindex].menuList;
            for (let menuIndex in menuList) {
              menuList[menuIndex].count = 0;
            }
          }
        }
      }
    },
    //获取支付方式列表
    GetPaymentList() {
      var _this = this;
      let url = this.api.GetPaymentList;
      let parmas = defaultParam("", 153);
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          if (res.data.code == "0") {
            //成功
            _this.paymentList = res.data.data;
            // _this.paymentList = [{code: "002", name: "微信支付", balance: null, sortId: 6}]
          } else {
            alert(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // betterScroll
    selectMenu(index, event) {
      // 有事点击event._constructed不存在！！！只能注释这一判断条件
      // if (!event._constructed) {
      //   return;
      // }
      let foodList = this.$refs.foodList;
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    },
    _initScroll() {
      this.meunScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });
      // debugger
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      });

      var _this = this;
      this.foodsScroll.on("scroll", pos => {
        // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
        if (pos.y <= 0) {
          _this.currentMenuList.scrollY = Math.abs(Math.round(pos.y));
        }
      });
    },
    _calculateHeight() {
      let foodList = this.$refs.foodList;
      let height = 0;
      this.currentMenuList.listHeight = [];
      if (this.currentMenuList.listHeight.length <= 0)
        this.currentMenuList.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.currentMenuList.listHeight.push(height);
      }
    },
    _followScroll(index) {
      let menuList = this.$refs.menuList;
      let el = menuList[index];
      this.meunScroll.scrollToElement(el, 300, 0, -100);
    },
    // betterScroll end
    showNoticeBtn() {
      this.$store.commit("ChangeFoldNotice", true);
    },
    //获取点餐模式模块
    GetModuleList() {
      var _this = this;
      let url = this.api.GetModuleList;
      let addParmas = {
        mainId: this.mainId
      };
      let dParam = defaultParam("", 150);
      let parmas = Object.assign({}, dParam, addParmas);
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          if (res.data.code == "0") {
            //成功
            _this.moduleList = res.data.data;
            _this.currentModuleId = res.data.data[0].id;
            _this.currentModuleName = res.data.data[0].name;
            //订餐公告使用
            _this.mealNoticeData = res.data.data[0].notice; //公告
            _this.mealNoticeListData = res.data.data[0].repastList; //公告列表
            _this.orderTime = res.data.data[0].orderTime; //时间

            // _this.moduleList.push(res.data.data[1]);
            // _this.currentModuleId= res.data.data[1].id
            _this.GetRepastList();
          } else {
            alert(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //获取订餐公告
    GetMealNoticeCon(id) {
      var _this = this;
      let url = this.api.GetModuleList;
      let addParmas = {
        mainId: this.mainId
      };
      let dParam = defaultParam("", 150);
      let parmas = Object.assign({}, dParam, addParmas);
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          if (res.data.code == "0") {
            //成功
            let findId = res.data.data.find(item => {
              return item.id === id;
            });
            _this.mealNoticeData = findId.notice;
            _this.orderTime = findId.orderTime;
            _this.mealNoticeListData = findId.repastList;
          } else {
            alert(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //获取餐次列表
    GetRepastList() {
      var _this = this;
      let url = this.api.GetRepastList;
      let addParmas = {
        moduleId: _this.currentModuleId
      }; //模块Id
      let dParam = defaultParam("", 104);
      let parmas = Object.assign({}, dParam, addParmas);
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          console.log("=========++++++++++");
          console.log(res);
          console.log("=========++++++++++");
          if (res.data.code == "0") {
            //成功
            if (res.data.data.length == 0) {
              _this.configure = false;
              _this.configureMsg = "商家已打烊";
              return;
            }
            for (let i = 0; i < res.data.data.length; i++) {
              var tempRepeat = res.data.data[i];

              // some 实现
              let result = _this.newRepastList.some(item => {
                return (
                  item.repastId == tempRepeat.repastId &&
                  item.parentId == _this.currentModuleId
                );
              });
              if (result) {
                continue;
              }
              tempRepeat.parentId = _this.currentModuleId;
              _this.newRepastList.push(tempRepeat);
            }
            _this.currentRepastId = res.data.data[0].repastId; //默认值
            _this.currentRepastName = res.data.data[0].repastName; //默认餐次name
            _this.GetMenuList();
            _this.currentIndex = 0; //初始化餐次选中项
          } else {
            alert(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //食谱菜肴
    GetMenuList(index) {
      if (!index) index = 0;
      var _this = this;
      let url = this.api.GetMenuList;
      let addParmas = {
        moduleId: _this.currentModuleId,
        repastId: _this.currentRepastId
      }; //模块Id  餐次Id
      let dParam = defaultParam("", 105);
      let parmas = Object.assign({}, dParam, addParmas);
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          console.log("=========");
          console.log(res);
          console.log("=========");
          if (res.data.code == "0") {
            _this.configure = true;
            //成功
            let parentId = _this.currentModuleId + "_" + _this.currentRepastId;
            let tempMenu = res.data.data;
            // some 实现
            let result = _this.menuList.some(item => {
              return (
                item.cateringId == tempMenu.cateringId &&
                item.parentId == parentId
              );
            });
            if (!result) {
              tempMenu.scrollY = 0;
              tempMenu.listHeight = [];
              tempMenu.parentId = parentId;

              if (_this.$route.query.id == 1) {
                //今日加餐
                var myCarFoods = storage.getObjItem("mycar1");
              } else {
                //明日订餐
                var myCarFoods = storage.getObjItem("mycar2");
              }
              if (res.data.data.orderingMode === 1) {
                let repastList = tempMenu.dataList[0].repastDataList;
                for (let i = 0; i < repastList.length; i++) {
                  let foods = repastList[i].menuList;
                  for (let j = 0; j < foods.length; j++) {
                    foods[j].moduleId = _this.currentModuleId;
                    foods[j].repastId = _this.currentRepastId;
                    foods[j].moduleName = _this.currentModuleName;
                    foods[j].repastName = _this.currentRepastName;
                    foods[j].orderingMode = res.data.data.orderingMode;
                    foods[j].menuTypeName = repastList[i].menuTypeName;
                    foods[j].count = 0;
                    //提交订单使用
                    foods[j].mealDate = res.data.data.mealDate;
                    foods[j].cateringTypeId = res.data.data.cateringTypeId;
                    foods[j].cateringId = res.data.data.cateringId;
                    foods[j].cateringTime = res.data.data.cateringTime;
                    foods[j].dietAdviceId = res.data.data.dietAdviceId;

                    //遍历购物车缓存
                    let myCurrentCarFoods = myCarFoods.filter(
                      n =>
                        n.orderingMode == 1 &&
                        n.moduleId == _this.currentModuleId &&
                        n.repastId == _this.currentRepastId
                    );
                    var foodIndex = myCurrentCarFoods.findIndex(
                      n => n.code == foods[j].code
                    );
                    if (foodIndex != -1)
                      foods[j].count = myCurrentCarFoods[foodIndex].count;
                  }
                }
              } else if (res.data.data.orderingMode === 2) {
                for (let i = 0; i < tempMenu.dataList[0].menuList.length; i++) {
                  tempMenu.dataList[0].menuList[i].moduleId =
                    _this.currentModuleId;
                  tempMenu.dataList[0].menuList[i].repastId =
                    _this.currentRepastId;
                  tempMenu.dataList[0].menuList[i].orderingMode =
                    res.data.data.orderingMode;
                  tempMenu.dataList[0].menuList[i].count = 0;
                  //提交订单使用
                  tempMenu.dataList[0].menuList[i].mealDate =
                    res.data.data.mealDate;
                  tempMenu.dataList[0].menuList[i].cateringTypeId =
                    res.data.data.cateringTypeId;
                  tempMenu.dataList[0].menuList[i].cateringId =
                    res.data.data.cateringId;
                  tempMenu.dataList[0].menuList[i].cateringTime =
                    res.data.data.cateringTime;
                  tempMenu.dataList[0].menuList[i].dietAdviceId =
                    res.data.data.dietAdviceId;

                  //遍历购物车缓存
                  let myCurrentCarFoods = myCarFoods.filter(
                    n =>
                      n.orderingMode == 2 &&
                      n.moduleId == _this.currentModuleId &&
                      n.repastId == _this.currentRepastId
                  );
                  var foodIndex = myCurrentCarFoods.findIndex(
                    n => n.code == tempMenu.dataList[0].menuList[i].code
                  );
                  if (foodIndex != -1)
                    tempMenu.dataList[0].menuList[i].count =
                      myCurrentCarFoods[foodIndex].count;
                }
              } else if (res.data.data.orderingMode === 3) {
                let repastList = tempMenu.dataList[0].repastDataList;
                for (let i = 0; i < repastList.length; i++) {
                  let foods = repastList[i].menuList;
                  for (let j = 0; j < foods.length; j++) {
                    foods[j].moduleId = _this.currentModuleId;
                    foods[j].moduleName = _this.currentModuleName;
                    foods[j].repastId = _this.currentRepastId;
                    foods[j].repastName = _this.currentRepastName;
                    foods[j].orderingMode = res.data.data.orderingMode;
                    foods[j].count = 0;
                    foods[j].NMName = repastList[i].nmName;
                    //提交订单使用
                    foods[j].mealDate = res.data.data.mealDate;
                    foods[j].cateringTypeId = res.data.data.cateringTypeId;
                    foods[j].cateringId = res.data.data.cateringId;
                    foods[j].cateringTime = res.data.data.cateringTime;
                    foods[j].dietAdviceId = res.data.data.dietAdviceId;

                    //遍历购物车缓存
                    let myCurrentCarFoods = myCarFoods.filter(
                      n =>
                        n.orderingMode == 3 &&
                        n.moduleId == _this.currentModuleId &&
                        n.repastId == _this.currentRepastId
                    );
                    var foodIndex = myCurrentCarFoods.findIndex(
                      n => n.code == foods[j].code
                    );

                     // 若设置开关启用N选M,1选1则默认选中
                    if (
                      repastList[i].N == 1 &&
                      repastList[i].M == 1 &&
                      this.isNMDefaultSelect
                    ) {
                      foods[j].count = 1;
                      this.defaultSelect(
                        i,
                        foods[j],
                        tempMenu.dataList[0].price,
                        repastList[i].N,
                        repastList[i].M,
                        repastList[i].nmName
                      );
                    } else {
                      foods[j].count = 0;
                      if (foodIndex != -1)
                        foods[j].count = myCurrentCarFoods[foodIndex].count;
                    }
                 
                  }
                }
              }

              _this.menuList.push(tempMenu);
              if (res.data.data.orderingMode === 1) {
                _this.$nextTick(() => {
                  _this._initScroll();
                  _this._calculateHeight();
                });
              }
            } else {
              if (
                res.data.data.orderingMode === 1 &&
                _this.currentModuleId != _this.oldCurrentModuleId
              ) {
                _this.$nextTick(() => {
                  _this._initScroll();
                  _this._calculateHeight();
                });
              }
            }
          } else {
            _this.configure = false;
            _this.configureMsg = res.data.msg;
            console.log(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //点餐模式id
    toggleTabs(index, id, name) {
      // this.currentIndex=0;
      this.nowIndex = index;
      this.oldCurrentModuleId = this.currentModuleId;
      this.currentModuleId = id;
      this.currentModuleName = name;
      console.log(`当前点餐模式：${id}--${this.nowIndex}`);
      this.GetRepastList();
      this.GetMealNoticeCon(id);
    },
    //选择餐次
    toggleMTabs(index, id, name) {
      // this.mealTimesID = id
      this.oldCurrentModuleId = this.currentModuleId;
      this.currentRepastId = id;
      this.currentRepastName = name;
      this.currentIndex = index; //早中晚标签样式
      this.GetMenuList(index);

      //todo
      // if (
      //     this.currentMenuList &&
      //     this.currentMenuList.orderingMode != 1
      // ) {
      // } else this.GetMenuList(index)
    },
    //菜肴详情
    selectFood(
      food,
      event,
      outIndex,
      mealItem,
      price,
      itemN,
      itemM,
      itemMenuTypeName
    ) {
      // if (!event._constructed) {
      //   return;
      // }

      var _this = this;
      let url = this.api.GetMenuInfo;
      let dParam = defaultParam("", 156);
      let addParmas = {
        cateringTypeId: food.cateringTypeId,
        cateringId: food.cateringId,
        repastId: food.repastId,
        kind: food.kind,
        code: food.code
      };
      let parmas = Object.assign({}, dParam, addParmas);
      // console.log(JSON.stringify(parmas))
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          if (res.data.code == "0") {
            //成功
            // console.log(res.data.data)
            _this.foodInfo = res.data.data;
          } else {
            alert(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      this.detailFood = food;
      this.NMItemPrams = {
        outIndex: outIndex,
        mealItem: mealItem,
        price: price,
        itemN: itemN,
        itemM: itemM,
        itemMenuTypeName: itemMenuTypeName
      };
      this.$refs.food.show();
    },
    //单选加一
    addFood(target, food) {
      // debugger
      // console.log({food:food})
      // console.log(this.selectSetFoods)
      let filterGoods = this.selectSetFoods.filter(
        n =>
          n.moduleId == food.moduleId &&
          n.repastId == food.repastId &&
          n.code == food.code
      );
      // debugger
      if (filterGoods.length > 0) {
        filterGoods[0].count = food.count;
        // filterGoods[0].count++;
      } else this.selectSetFoods.push(food);
      // debugger
      this._drop(target);
      // debugger
      console.log("addFood" + food.count);
      if (this.$route.query.id == 1) {
        //今日加餐
        storage.setObjItem("mycar1", this.selectSetFoods);
      } else {
        //明日订餐
        storage.setObjItem("mycar2", this.selectSetFoods);
      }
    },
    //单选减一
    decreaseFood(food) {
      // debugger
      console.log("decreaseFood" + food.count);
      let filterGoods = this.selectSetFoods.filter(
        n =>
          n.moduleId == food.moduleId &&
          n.repastId == food.repastId &&
          n.code == food.code
      );
      if (filterGoods.length > 0) {
        filterGoods[0].count = food.count;
        if (food.count == 0) {
          // debugger
          let itemIndex = this.selectSetFoods.findIndex(
            n =>
              n.moduleId == food.moduleId &&
              n.repastId == food.repastId &&
              n.code == food.code
          );
          if (itemIndex != -1) {
            this.selectSetFoods.splice(itemIndex, 1);
          }
        }
      }
      if (this.$route.query.id == 1) {
        //今日加餐
        storage.setObjItem("mycar1", this.selectSetFoods);
      } else {
        //明日订餐
        storage.setObjItem("mycar2", this.selectSetFoods);
      }
    },
    updateMenuList(food) {
      //单点1  套餐2  NM 3
      if (food.orderingMode == 1) {
        // debugger
        let menuIndex = this.menuList.findIndex(
          n => n.parentId == food.moduleId + "_" + food.repastId
        );
        if (menuIndex != -1) {
          //找到了早中晚
          this.menuList[menuIndex].dataList[0].repastDataList.forEach(n => {
            let foodIndex = n.menuList.findIndex(n => n.code == food.code);
            if (foodIndex != -1) n.menuList[foodIndex].count = food.count;
            return;
          });
        }
      } else if (food.orderingMode == 2) {
        let menuIndex = this.menuList.findIndex(
          n => n.parentId == food.moduleId + "_" + food.repastId
        );
        if (menuIndex != -1) {
          //找到了早中晚
          let foodIndex = this.menuList[
            menuIndex
          ].dataList[0].menuList.findIndex(n => n.code == food.code);
          if (foodIndex != -1)
            this.menuList[menuIndex].dataList[0].menuList[foodIndex].count =
              food.count;
        }
      } else if (food.orderingMode == 3) {
        let menuIndex = this.menuList.findIndex(
          n => n.parentId == food.moduleId + "_" + food.repastId
        );
        if (menuIndex != -1) {
          //找到了早中晚
          let foodIndex = this.menuList[
            menuIndex
          ].dataList[0].repastDataList[0].menuList.findIndex(
            n => n.code == food.code
          );
          if (foodIndex != -1)
            this.menuList[menuIndex].dataList[0].repastDataList[0].menuList[
              foodIndex
            ].count = food.count;
        }
      }
    },
    //购物车中单点加减号回调
    shopCarSingleFood(food) {
      // debugger
      this.updateMenuList(food);
      //this.currentMenuList
      let filterGoods = this.selectSetFoods.filter(
        n =>
          n.moduleId == food.moduleId &&
          n.repastId == food.repastId &&
          n.code == food.code
      );
      if (filterGoods.length > 0) {
        filterGoods[0].count = food.count;
        if (food.count == 0) {
          let itemIndex = this.selectSetFoods.findIndex(
            n =>
              n.moduleId == food.moduleId &&
              n.repastId == food.repastId &&
              n.code == food.code
          );
          if (itemIndex != -1) {
            this.selectSetFoods.splice(itemIndex, 1);
          }
        }
      }
      console.log(this.selectSetFoods);
      if (this.$route.query.id == 1) {
        //今日加餐
        storage.setObjItem("mycar1", this.selectSetFoods);
      } else {
        //明日订餐
        storage.setObjItem("mycar2", this.selectSetFoods);
      }
    },
    //购物车中套餐减号
    shopCarDecreaseFood(food) {
      // debugger
      this.updateMenuList(food);
      let filterGoods = this.selectSetFoods.filter(
        n =>
          n.moduleId == food.moduleId &&
          n.repastId == food.repastId &&
          n.code == food.code
      );
      if (filterGoods.length > 0) {
        filterGoods[0].count = food.count;
        if (food.count == 0) {
          let itemIndex = this.selectSetFoods.findIndex(
            n =>
              n.moduleId == food.moduleId &&
              n.repastId == food.repastId &&
              n.code == food.code
          );
          if (itemIndex != -1) {
            this.selectSetFoods.splice(itemIndex, 1);
          }
        }
      }

      let menuIndex = this.menuList.findIndex(
        n => n.parentId == food.moduleId + "_" + food.repastId
      );
      if (menuIndex != -1) {
        // debugger
        // let menulistTemp1= this.menuList[0].dataList[0].repastDataList[0].menuList
        let menulistTemp = this.menuList[0].dataList[0].menuList;
        //= this.menuList[menuIndex].dataList[0].repastDataList[food.NMIndex].menuList
        let foodIndex = menulistTemp.findIndex(n => n.code == food.code);
        if (foodIndex != -1) menulistTemp[foodIndex].count = 0;
      }
      if (this.$route.query.id == 1) {
        //今日加餐
        storage.setObjItem("mycar1", this.selectSetFoods);
      } else {
        //明日订餐
        storage.setObjItem("mycar2", this.selectSetFoods);
      }
    },
    //购物车中N选M减号
    shopCarDecreaseNMFood(food) {
      this.updateMenuList(food);
      let itemIndex = this.selectSetFoods.findIndex(
        n =>
          n.moduleId == food.moduleId &&
          n.repastId == food.repastId &&
          n.code == food.code
      );
      if (itemIndex != -1) {
        // food.count=0
        // filterGoods[0].count = 0
        this.selectSetFoods.splice(itemIndex, 1);
      }
      // debugger
      let menuIndex = this.menuList.findIndex(
        n => n.parentId == food.moduleId + "_" + food.repastId
      );
      if (menuIndex != -1) {
        // debugger
        // let menulistTemp1= this.menuList[0].dataList[0].repastDataList[0].menuList
        // debugger
        let menulistTemp = this.menuList[menuIndex].dataList[0].repastDataList[
          food.NMIndex
        ].menuList;
        let foodIndex = menulistTemp.findIndex(n => n.code == food.code);
        if (foodIndex != -1) menulistTemp[foodIndex].count = 0;
      }
      if (this.$route.query.id == 1) {
        //今日加餐
        storage.setObjItem("mycar1", this.selectSetFoods);
      } else {
        //明日订餐
        storage.setObjItem("mycar2", this.selectSetFoods);
      }
    },
    _drop(target) {
      // 体验优化,异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target);
      });
    },
    //隐藏公告详细信息
    hideNotice(Value) {
      this.$store.commit("ChangeFoldNotice", Value);
    },
    //支付方式
    totalPrice(price) {
      this.payPrice = price;
      console.log(`需要支付的${price}元`);
    },
     defaultSelect(outIndex, item, price, N, M, NMName) {
      let itemIndex = this.selectSetFoods.findIndex(
        n =>
          n.moduleId == this.currentModuleId &&
          n.repastId == item.repastId &&
          n.NMIndex == outIndex &&
          n.code == item.code
      );
      if (itemIndex != -1) return;
      let food = {
        name: item.name,
        price: price,
        count: 1,
        orderingMode: item.orderingMode,
        moduleId: this.currentModuleId,
        moduleName: this.currentModuleName,
        repastId: item.repastId,
        repastName: item.repastName,
        code: item.code,
        kind: item.kind,
        NMIndex: outIndex,
        N: N,
        M: M,
        NMName: NMName,
        Nutrients: item.Nutrients,
        mealDate: item.mealDate,
        cateringTypeId: item.cateringTypeId,
        cateringId: item.cateringId,
        cateringTime: item.cateringTime,
        dietAdviceId: item.dietAdviceId
      };
      this.selectSetFoods.push(food);
      if (this.$route.query.id == 1) {
        //今日加餐
        storage.setObjItem("mycar1", this.selectSetFoods);
      } else {
        //明日订餐
        storage.setObjItem("mycar2", this.selectSetFoods);
      }
    },
    // NM选择菜
    choosedMeal(outIndex, item, price, N, M, NMName) {
      if (item.count === 1) {
        //取消选中
        item.count = 0;
        //移除
        // some 实现
        let itemIndex = this.selectSetFoods.findIndex(
          n =>
            n.moduleId == this.currentModuleId &&
            n.repastId == item.repastId &&
            n.NMIndex == outIndex &&
            n.code == item.code
        );
        // debugger
        if (itemIndex != -1) {
          this.selectSetFoods.splice(itemIndex, 1);
        }
      } else {
        let filterGoods = this.selectSetFoods.filter(
          n =>
            n.moduleId == this.currentModuleId &&
            n.repastId == item.repastId &&
            n.NMIndex == outIndex
        );
        if (filterGoods.length > 0 && filterGoods.length >= filterGoods[0].M) {
          if (filterGoods[0].M == 1) {
            // debugger
            this.currentMenuList.dataList[0].repastDataList[
              filterGoods[0].NMIndex
            ].menuList.forEach(function(value, index, array) {
              value.count = 0;
            });
            //this.currentMenuList
            // filterGoods.forEach(function(value, index, array) {
            //     value.count = 0
            // });
            let itemIndex = this.selectSetFoods.findIndex(
              n =>
                n.moduleId == this.currentModuleId &&
                n.repastId == item.repastId &&
                n.NMIndex == outIndex
            );
            if (itemIndex != -1) {
              this.selectSetFoods.splice(itemIndex, 1);
            }
          } else {
            this.$myToast.error("请取消后再添加");
            return;
          }
        }

        item.count = 1;
        let food = {
          name: item.name,
          price: price,
          count: 1,
          orderingMode: item.orderingMode,
          moduleId: this.currentModuleId,
          moduleName: this.currentModuleName,
          repastId: item.repastId,
          repastName: item.repastName,
          code: item.code,
          kind: item.kind,
          NMIndex: outIndex,
          N: N,
          M: M,
          NMName: NMName,
          Nutrients: item.Nutrients,
          mealDate: item.mealDate,
          cateringTypeId: item.cateringTypeId,
          cateringId: item.cateringId,
          cateringTime: item.cateringTime,
          dietAdviceId: item.dietAdviceId
        };
        console.log(food);
        // debugger
        this.selectSetFoods.push(food);
      }
      if (this.$route.query.id == 1) {
        //今日加餐
        storage.setObjItem("mycar1", this.selectSetFoods);
      } else {
        //明日订餐
        storage.setObjItem("mycar2", this.selectSetFoods);
      }
    },
    //选择套餐
    choosedSetMeal(item) {
      // debugger
      if (item.count === 1) {
        //取消选中
        item.count = 0;
        //移除
        // some 实现
        let itemIndex = this.selectSetFoods.findIndex(
          n => n.moduleId == this.currentModuleId && n.repastId == item.repastId
        );
        if (itemIndex != -1) {
          this.selectSetFoods.splice(itemIndex, 1);
        }
      } else {
        //选中
        this.currentMenuList.dataList[0].menuList.forEach(function(
          value,
          index,
          array
        ) {
          value.count = 0;
        });
        item.count = 1;
        //套餐
        let itemIndex = this.selectSetFoods.findIndex(
          n => n.moduleId == this.currentModuleId && n.repastId == item.repastId
        );
        if (itemIndex != -1) {
          this.selectSetFoods.splice(itemIndex, 1);
        }
        let food = {
          name: item.name,
          price: item.price,
          count: 1,
          orderingMode: item.orderingMode,
          moduleId: this.currentModuleId,
          moduleName: this.currentModuleName,
          repastId: item.repastId,
          repastName: this.currentRepastName,
          code: item.code,
          kind: item.kind,
          NMIndex: "",
          N: "",
          M: "",
          NMName: "",
          Nutrients: item.Nutrients,
          mealDate: item.mealDate,
          cateringTypeId: item.cateringTypeId,
          cateringId: item.cateringId,
          cateringTime: item.cateringTime,
          dietAdviceId: item.dietAdviceId
        };
        this.selectSetFoods.push(food);
      }
      if (this.$route.query.id == 1) {
        //今日加餐
        storage.setObjItem("mycar1", this.selectSetFoods);
      } else {
        //明日订餐
        storage.setObjItem("mycar2", this.selectSetFoods);
      }
    }
    //套餐多图点击图片预览
    // handleImgsClick(index) {
    //     this.initialIndex = index
    //     const params = {
    //         $props: {
    //             imgs: this.picArr,
    //             initialIndex: 'initialIndex', // 响应式数据的key名
    //             loop: false
    //         },
    //         $events: {
    //             change: i => {
    //                 // 必须更新 initialIndex
    //                 this.initialIndex = i
    //             }
    //         }
    //     }
    //     this.$createImagePreview({ ...params }).show()
    // }
  },
  destroyed() {
    // 2、页面销毁时，取消监听。否则其他vue路由页面也会被监听
    // window.removeEventListener('popstate', this.goBack, false);
  },
  //修改点餐页的meta值，false时再次进入页面会重新请求数据。
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false;
    next();
  }
};
</script>

<style lang="less">
@import "../common/less/mixin.less";

.goods {
  background: #ffffff;

  .noConfigure {
    padding-top: 120px;
    text-align: center;
    font-size: 16px;
    color: #505050;

    img {
      width: 90px;
      height: 90px;
    }

    p {
      padding-top: 20px;
    }
  }

  .mealType {
    display: flex;
    justify-content: space-between;
    padding: 16px 18px;

    .tab-item {
      .box-c();
      height: 32px;
      font-size: 16px;
      color: #ffffff;
      background: #dbdbea;
      border-radius: 16px;
      padding: 0 14px;

      &.on {
        background: #7574f5;
      }
    }
  }

  .mealNotice {
    padding: 2px 18px;
    font-size: 13px;
    color: #aaaaaa;

    p {
      padding-bottom: 8px;
      line-height: 16px;
      .ellipsis();
    }
  }

  .mealTimesItem {
    .border-1px(#e7e7f1);
    padding-left: 24px;
    padding-top: 10px;
    height: 34px;
    box-sizing: border-box;

    .horizontal-scroll-list-wrap {
      font-size: 0;
      background: #ffffff;
    }

    .cube-scroll-content {
      display: inline-block;
    }

    .list-wrapper {
      white-space: nowrap;
    }

    .list-item {
      display: inline-block;
      position: relative;
      font-weight: bold;
      font-size: 16px;
      color: #7a7a7a;
      padding: 0 0 8px;
      margin-right: 40px;
    }

    .cube-scroll-nav-bar-item {
      font-size: 16px;
      color: #7a7a7a;
      padding: 20px 15px 15px;
    }

    .active {
      position: relative;
      color: #7574f5;
      position: relative;

      ::after {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        background: #7574f5;
        border-radius: 2.5px;
        width: 100%;
        height: 3px;
        content: "";
      }
    }
  }

  .mealTimes {
    .border-1px(#e7e7f1);
    padding-left: 24px;
    padding-top: 10px;

    .cube-scroll-wrapper {
      flex: none;
    }

    .cube-scroll-nav-bar-item {
      font-weight: bold;
      font-size: 16px;
      color: #7a7a7a;
      padding: 0 0 8px;
      margin-right: 40px;
    }

    .cube-scroll-nav-bar-item_active {
      color: #7574f5;
      position: relative;

      ::after {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        background: #7574f5;
        border-radius: 2.5px;
        width: 100%;
        height: 3px;
        content: "";
      }
    }
  }

  .foodScroll {
    position: fixed;
    top: 152px;
    left: 0;
    bottom: 54px;
    width: 100%;
    background: #ffffff;

    .cube-scroll-nav-bar_vertical {
      background: #f9f9f9;
    }

    .cube-scroll-nav-bar-item {
      .box-c();
      .ellipsis2();
      padding: 16px 12px;
      text-align: left;
      width: 80px;
      box-sizing: border-box;
      font-size: 14px;
      line-height: 20px;

      span {
        .ellipsis2();
        .box-c();
      }
    }

    .cube-scroll-nav-bar-item_active {
      background: #fff;
      color: #7574f5;
    }

    .cube-scroll-nav-panel-title {
      background: #fff;
      font-size: 16px;
      color: #414141;
      padding: 16px 0 12px 10px;
    }

    .foodsWrapper {
      padding: 0 0 0 10px;

      .food-item {
        padding-bottom: 19px;

        &:last-child {
          border-bottom: 1px solid #efefef;
        }

        .foodContent {
          display: flex;

          .icon {
            flex: 0 0 80px;
            margin-right: 10px;

            img {
              border-radius: 4px;
            }
          }

          .content {
            position: relative;
            flex: 1;

            .name {
              font-size: 16px;
              color: #505050;
              margin: 6px 0;
            }

            .desc {
              background: #ff8361;
              border-radius: 4px;
              .box-c();
              font-size: 12px;
              color: #ffffff;
              padding: 4px 5px;
              width: 106px;
              box-sizing: border-box;
            }

            .price {
              position: absolute;
              left: 0;
              bottom: 5px;
              font-family: ArialMT;
              font-size: 18px;
              color: #ff8361;
            }

            .cartcontrol-wrapper {
              position: absolute;
              right: 4px;
              bottom: -5px;
            }
          }
        }

        .foodNutrient {
          font-size: 12px;
          box-sizing: border-box;
          margin: 7px 12px 0 0;
          color: #aaaaaa;
          background: rgba(219, 219, 234, 0.4);
          border-radius: 4px;
          position: relative;
          display: flex;
          justify-content: space-between;
          padding: 0 8px;
          box-sizing: border-box;
          height: 22px;
          line-height: 22px;
          align-items: center;

          &::after {
            content: "";
            width: 0;
            height: 0;
            border: 5px solid;
            position: absolute;
            top: -10px;
            left: 36px;
            border-color: transparent transparent rgba(219, 219, 234, 0.4)
              transparent;
          }
          .L {
            white-space: nowrap;
            span {
              padding-right: 6px;
              white-space: nowrap;
            }
          }
          .more {
            color: #7574f5;
            white-space: nowrap;
            i {
              font-weight: bold;
            }
          }
        }
      }
    }
  }

  //套餐
  .setMeal {
    padding: 12px;

    .setMealItem {
      position: relative;
      background: #ffffff;
      box-shadow: 0 2px 10px 0 rgba(117, 116, 245, 0.2);
      border-radius: 4px;
      margin-bottom: 12px;

      .tag {
        position: absolute;
        top: 0;
        left: 0;
        background: #ececf8;
        border-radius: 4px 0px 4px 0px;
        font-size: 14px;
        color: #9a9ace;
        width: 60px;
        height: 30px;
        .box-c();
      }

      .selBTn {
        position: absolute;
        z-index: 2;
        right: 0;
        top: 0;
        padding: 10px;

        i {
          font-size: 28px;
          color: #d8d8e4;

          &.iconxuanze {
            color: #7574f5;
          }
        }
      }

      .name {
        font-size: 16px;
        color: #505050;
        letter-spacing: 0;
        line-height: 24px;
        font-weight: 600;
      }

      .price {
        font-size: 24px;
        color: #ff8361;
        letter-spacing: 0;
        line-height: 24px;
        font-weight: normal;
      }

      .mealMoreImg {
        .name {
          padding: 48px 12px 12px;
        }

        .price {
          padding: 6px 12px;
        }
      }

      // 多图
      .imgArrScroll {
        padding: 0 12px;

        .img-scroll-list-wrap {
          border: 1px solid #fff;

          .cube-scroll-content {
            display: inline-block;

            .list-wrapper {
              white-space: nowrap;

              .list-item {
                display: inline-block;

                img {
                  width: 80px;
                  height: 80px;
                  border-radius: 4px;
                  display: block;
                  margin-right: 10px;
                }
              }
            }
          }
        }
      }

      // 单图
      .mealSingleImg {
        position: relative;
        padding: 48px 12px 10px;
        display: flex;

        .img {
          flex: 0 0 90px;
          margin-right: 12px;

          img {
            width: 90px;
            height: 90px;
            border-radius: 4px;
          }
        }

        .content {
          flex: 1;

          .name {
            padding: 6px 0;
          }

          .price {
            position: absolute;
            bottom: 10px;
          }
        }
      }

      .foodNutrientWrapper {
        padding: 0 12px 13px;
      }

      .foodNutrient {
        font-size: 12px;
        box-sizing: border-box;
        margin: 2px 0 0 0;
        color: #aaaaaa;
        background: rgba(219, 219, 234, 0.4);
        border-radius: 4px;
        position: relative;
        display: flex;
        justify-content: space-between;
        padding: 0 8px;
        box-sizing: border-box;
        height: 22px;
        line-height: 22px;
        align-items: center;

        .L {
          white-space: nowrap;
          span {
            padding-right: 15px;
            white-space: nowrap;
          }
        }

        &::after {
          content: "";
          width: 0;
          height: 0;
          border: 5px solid;
          position: absolute;
          top: -10px;
          left: 15px;
          border-color: transparent transparent rgba(219, 219, 234, 0.4)
            transparent;
        }

        .more {
          color: #7574f5;
          white-space: nowrap;
          i {
            font-weight: bold;
          }
        }
      }
    }
  }

  //N选M
  .NSelectMWrapper {
    &:last-child {
      padding-bottom: 10px;
    }

    .NSelectMTitle {
      padding: 18px 24px 6px;
      font-size: 16px;
      color: #505050;

      span {
        color: #ff8361;
      }
    }

    .NSelectM {
      &.setMeal {
        padding: 12px 12px 0;
      }

      .setMealItem {
        &:last-child {
          margin-bottom: 6px;
        }

        .mealSingleImg {
          padding: 12px 12px 10px;

          .content {
            .name {
              width: 80%;
              padding: 0;
              line-height: 24px;
            }
          }
        }
      }
    }
  }
}

.goodsMeal {
  background: #ffffff;
  display: flex;
  position: absolute;
  top: 151px;
  bottom: 54px;
  width: 100%;
  overflow: hidden;

  .menu-wrapper {
    flex: 0 0 70px;
    width: 70px;
    background: #f9f9f9;

    .menu-item {
      padding: 16px 7px;
      text-align: left;
      width: 70px;
      box-sizing: border-box;
      font-size: 14px;
      line-height: 20px;
      color: #505050;

      &.current {
        position: relative;
        z-index: 10;
        background: #fff;
        color: #7574f5;
      }

      .text {
        .ellipsis2();
        .box-c();
      }
    }
  }

  .foods-wrapper {
    flex: 1;

    .title {
      background: #fff;
      font-size: 16px;
      color: #414141;
      padding: 16px 0 12px 10px;
    }

    .foodsWrapper {
      padding: 0 0 5px 10px;

      .food-item {
        padding-bottom: 20px;

        &:last-child {
          border-bottom: 1px solid #efefef;
        }

        .foodContent {
          display: flex;

          .icon {
            flex: 0 0 80px;
            margin-right: 10px;

            img {
              border-radius: 4px;
            }
          }

          .content {
            position: relative;
            flex: 1;

            .name {
              font-size: 16px;
              color: #505050;
              margin: 6px 0;
            }

            .desc {
              background: #ff8361;
              border-radius: 4px;
              .box-c();
              font-size: 12px;
              color: #ffffff;
              padding: 4px 5px;
              width: 106px;
              box-sizing: border-box;
            }

            .price {
              position: absolute;
              left: 0;
              bottom: 5px;
              font-family: ArialMT;
              font-size: 18px;
              color: #ff8361;
            }

            .cartcontrol-wrapper {
              position: absolute;
              right: 4px;
              bottom: -5px;
            }
          }
        }

        .foodNutrient {
          font-size: 12px;
          box-sizing: border-box;
          margin: 7px 12px 0 0;
          color: #aaaaaa;
          background: rgba(219, 219, 234, 0.4);
          border-radius: 4px;
          position: relative;
          display: flex;
          justify-content: space-between;
          padding: 0 8px;
          box-sizing: border-box;
          height: 22px;
          line-height: 22px;
          align-items: center;

          &::after {
            content: "";
            width: 0;
            height: 0;
            border: 5px solid;
            position: absolute;
            top: -10px;
            left: 36px;
            border-color: transparent transparent rgba(219, 219, 234, 0.4)
              transparent;
          }
          .L {
            white-space: nowrap;
            span {
              padding-right: 6px;
              white-space: nowrap;
            }
          }
          .more {
            color: #7574f5;
            white-space: nowrap;
            i {
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>
