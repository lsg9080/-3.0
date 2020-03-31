<template>
    <div class="goods">
        <!-- <meal-mode
            :mealTypeItem="mealTypeItem"
            @mealTypeId="getMealTypeId"
        ></meal-mode> -->
        <div class="mealType">
            <div
                class="tab-item"
                :class="{ on: index === nowIndex }"
                @click="toggleTabs(index, item.id)"
                v-for="(item, index) in mealTypeItem"
                :key="item.id"
            >
                {{ item.name }}
            </div>
        </div>
        <!-- 公告 -->
        <div class="mealNotice" @click="showNoticeBtn">
            <p>时间：早餐 06:00-07:00 午餐 11:00-13:00 晚餐 17:00-21:00</p>
            <p>
                公告：小锅菜仅限病人，家属请订陪护餐，护工请订护工餐，病人不过吃可以点小锅菜
            </p>
        </div>
        <!-- 餐次分类 -->
        <div class="mealTimesItem">
            <cube-scroll
                ref="mealScroll"
                :data="mealTimesList"
                direction="horizontal"
                class="horizontal-scroll-list-wrap"
            >
                <ul class="list-wrapper">
                    <li
                        v-for="(item, index) in mealTimesList"
                        :key="index"
                        class="list-item"
                        :class="{ active: index === currentIndex }"
                        @click="toggleMTabs(index, item.repastId)"
                    >
                        <span>{{ item.repastName }}</span>
                    </li>
                </ul>
            </cube-scroll>
        </div>
        <!-- 暂无配菜 -->
        <div class="noConfigure" v-if="configure == false">
            <img src="../assets/fw.png" />
            <p>当前餐次未配餐</p>
        </div>
        <div class="tab_content" v-show="configure">
            <!-- 1：单点，2：套餐，3：N选M -->
            <!-- 单点模式 -->
            <template v-if="menuInfo.orderingMode === 1">
                <div class="goodsMeal">
                    <div class="menu-wrapper" ref="menuWrapper">
                        <ul>
                            <li
                                v-for="(item, index) in menuList.repastDataList"
                                class="menu-item"
                                :class="{
                                    current: currentIndex2 === index
                                }"
                                @click="selectMenu(index, $event)"
                                ref="menuList"
                            >
                                <span class="text border-1px">
                                    {{ item.menuTypeName }}
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div class="foods-wrapper" ref="foodsWrapper">
                        <ul>
                            <li
                                v-for="item in menuList.repastDataList"
                                class="food-list"
                                ref="foodList"
                            >
                                <h1 class="title">
                                    {{ item.menuTypeName }}
                                </h1>
                                <ul class="foodsWrapper">
                                    <li
                                        class="food-item"
                                        v-for="food in item.menuList"
                                        :key="food.code"
                                    >
                                        <div class="foodContent">
                                            <div
                                                class="icon"
                                                @click="
                                                    selectFood(food, $event)
                                                "
                                            >
                                                <img
                                                    width="80"
                                                    height="80"
                                                    :src="food.picUrl"
                                                />
                                            </div>
                                            <div class="content">
                                                <h2
                                                    class="name"
                                                    @click="
                                                        selectFood(food, $event)
                                                    "
                                                >
                                                    {{ food.name }}
                                                </h2>
                                                <p
                                                    v-if="food.tabooTips"
                                                    class="desc"
                                                >
                                                    {{ food.tabooTips }}
                                                </p>
                                                <div class="price">
                                                    ￥{{ food.price }}
                                                </div>
                                                <div
                                                    class="cartcontrol-wrapper"
                                                >
                                                    <cartcontrol
                                                        @add="addFood"
                                                        :food="food"
                                                    ></cartcontrol>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="foodNutrient">
                                            <div>
                                                能量：{{
                                                    food.Nutrients.能量
                                                }}kcl
                                            </div>
                                            <div>
                                                蛋白质：{{
                                                    food.Nutrients.蛋白质
                                                }}g
                                            </div>
                                            <div
                                                class="more"
                                                @click="
                                                    selectFood(food, $event)
                                                "
                                            >
                                                了解更多<i
                                                    class="iconright"
                                                ></i>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template v-else-if="menuInfo.orderingMode === 2">
                <div class="foodScroll">
                    <!-- 套餐 -->
                    <cube-scroll ref="scroll" :data="menuList.menuList">
                        <ul class="setMeal">
                            <li
                                v-for="(item, index) in menuList.menuList"
                                :key="index"
                                class="setMealItem"
                            >
                                <div class="selBTn" @click="choosedMeal(index)">
                                    <i
                                        :class="[
                                            'iconselectdefault2',
                                            chooseNum == index + 1
                                                ? 'iconxuanze'
                                                : ''
                                        ]"
                                    ></i>
                                </div>
                                <div class="tag">套餐{{ index + 1 }}</div>
                                <template v-if="menuList.isMultiPicture == 1">
                                    <div class="dn">套餐多图模式</div>
                                    <div class="mealMoreImg">
                                        <h2 class="name">
                                            {{ item.name }}
                                        </h2>
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
                                                        v-for="(item,
                                                        index) in item.picUrlList"
                                                        :key="item"
                                                        class="list-item"
                                                        @click="
                                                            handleImgsClick(
                                                                index
                                                            )
                                                        "
                                                    >
                                                        <img :src="item" />
                                                    </li>
                                                </ul>
                                            </cube-scroll>
                                        </div>
                                        <div class="price">
                                            ￥{{ item.price }}
                                        </div>
                                    </div>
                                </template>
                                <template v-if="menuList.isMultiPicture == 0">
                                    <div class="dn">套餐单图</div>
                                    <div class="mealSingleImg">
                                        <div class="img">
                                            <img src="../assets/1.jpg" />
                                        </div>
                                        <div class="content">
                                            <h2 class="name">
                                                {{ item.name }}
                                            </h2>
                                            <div class="price">
                                                ￥12
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <div class="dn">结束</div>
                                <div class="foodNutrientWrapper">
                                    <div class="foodNutrient">
                                        <div class="L">
                                            <span
                                                >能量：{{
                                                    item.Nutrients.能量
                                                }}kcl</span
                                            >
                                            <span
                                                >蛋白质：{{
                                                    item.Nutrients.蛋白质
                                                }}g</span
                                            >
                                        </div>
                                        <div class="more">
                                            了解更多<i class="iconright"></i>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </cube-scroll>
                </div>
            </template>
            <!-- N选M -->
            <template v-else-if="menuInfo.orderingMode === 3">
                <div class="foodScroll">
                    <cube-scroll ref="scroll" :data="menuList.repastDataList">
                        <div
                            v-for="(item, index) in menuList.repastDataList"
                            :key="index"
                            class="NSelectMWrapper"
                        >
                            <div class="NSelectMTitle">
                                {{ item.menuTypeName
                                }}<span>（{{ item.nmName }}）</span>
                            </div>
                            <ul class="setMeal NSelectM">
                                <li
                                    v-for="(mealItem, index) in item.menuList"
                                    :key="index"
                                    class="setMealItem"
                                >
                                    <div
                                        class="selBTn"
                                        @click="choosedMeal(index)"
                                    >
                                        <i
                                            :class="[
                                                'iconselectdefault2',
                                                chooseNum == index + 1
                                                    ? 'iconxuanze'
                                                    : ''
                                            ]"
                                        ></i>
                                    </div>
                                    <div class="mealSingleImg">
                                        <div class="img">
                                            <template v-if="!mealItem.picUrl">
                                                <img
                                                    src="../assets/images/timg.jpg"
                                                />
                                            </template>
                                            <template v-else>
                                                <img :src="mealItem.picUrl" />
                                            </template>
                                        </div>
                                        <div class="content">
                                            <h2 class="name">
                                                {{ mealItem.name }}
                                            </h2>
                                        </div>
                                    </div>
                                    <div class="foodNutrientWrapper">
                                        <div class="foodNutrient">
                                            <div class="L">
                                                <span
                                                    >能量：{{
                                                        mealItem.Nutrients.能量
                                                    }}kcl</span
                                                >
                                                <span
                                                    >蛋白质：{{
                                                        mealItem.Nutrients
                                                            .蛋白质
                                                    }}g</span
                                                >
                                            </div>
                                            <div class="more">
                                                了解更多<i
                                                    class="iconright"
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </cube-scroll>
                </div>
            </template>
            <!-- 不同点餐模式end -->
        </div>
        <shopcart
            ref="shopcart"
            :selectFoods="selectFoods"
            @totalPrice="totalPrice"
        ></shopcart>
        <pay-way :payPrice="payPrice"></pay-way>
        <success></success>
        <!-- 公告 -->
        <meal-notice
            :showFold="$store.state.fold"
            @hideState="hideNotice"
        ></meal-notice>
        <!-- 选择疾病 -->
        <choose-diseases></choose-diseases>
        <!-- <food @add="addFood" :food="selectedFood" ref="food"></food> -->
    </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { defaultParam } from '../common/js/util'
import cartcontrol from './cartcontrol'
import food from './food'
import shopcart from './shopcart'
import payWay from './payWay'
import success from './success'
import mealMode from './mealMode'
import mealNotice from './mealNotice'
import chooseDiseases from './chooseDiseases'
import goodsData from '../data.json'
const goods = goodsData.goods
// const food = goodsData.goods.food
export default {
    components: {
        mealMode,
        cartcontrol,
        food,
        shopcart,
        payWay,
        success,
        mealNotice,
        chooseDiseases
    },
    data() {
        return {
            listHeight: [],
            scrollY: 0,
            mainId: '', //首页模块传过来id
            mealTypeId: '', //点餐模式ID
            mealTypeItem: [], //点餐模式列表
            payPrice: '',
            fold: false, //公告详细信息
            chooseNum: '', //选择默认值
            data: goods, //单点
            setMeal: [
                {
                    id: 1,
                    name: '清蒸鲈鱼块+什锦炒蔬+凉拌苦瓜+紫菜虾米汤+薏仁紫米饭',
                    price: '12',
                    picArr: [
                        'http://fuss10.elemecdn.com/f/28/a51e7b18751bcdf871648a23fd3b4jpeg.jpeg?imageView2/1/w/750/h/750',
                        'http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750',
                        'http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750',
                        'http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114',
                        'http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/114/h/114',
                        'http://fuss10.elemecdn.com/f/28/a51e7b18751bcdf871648a23fd3b4jpeg.jpeg?imageView2/1/w/114/h/114'
                    ]
                },
                {
                    id: 2,
                    name: '苦瓜+紫菜虾米汤+薏仁紫米饭',
                    price: '12',
                    picArr: [
                        'http://fuss10.elemecdn.com/f/28/a51e7b18751bcdf871648a23fd3b4jpeg.jpeg?imageView2/1/w/750/h/750',
                        'http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750'
                    ]
                }
            ], //套餐
            NSelectM: [
                {
                    id: 1,
                    sortName: '荤菜',
                    option: '2选1',
                    list: [
                        {
                            name: '清蒸鲈鱼块粉丝鱼丸汤长文案示例长文案示例',
                            img:
                                'http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750'
                        },
                        {
                            name: '玉米排骨汤',
                            img:
                                'http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750'
                        }
                    ]
                },
                {
                    id: 2,
                    sortName: '蔬菜',
                    option: '3选1',
                    list: [
                        {
                            name: '什锦炒素菜',
                            img:
                                'http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750'
                        },
                        {
                            name: '鱼香茄子',
                            img:
                                'http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750'
                        },
                        {
                            name: '娃娃菜炖豆腐',
                            img:
                                'http://fuss10.elemecdn.com/d/2d/b1eb45b305635d9dd04ddf157165fjpeg.jpeg?imageView2/1/w/750/h/750'
                        }
                    ]
                }
            ], //N选M
            picArr: [
                'http://fuss10.elemecdn.com/f/28/a51e7b18751bcdf871648a23fd3b4jpeg.jpeg?imageView2/1/w/750/h/750',
                'http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/750/h/750',
                'http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/750/h/750',
                'http://fuss10.elemecdn.com/c/cd/c12745ed8a5171e13b427dbc39401jpeg.jpeg?imageView2/1/w/114/h/114',
                'http://fuss10.elemecdn.com/c/6b/29e3d29b0db63d36f7c500bca31d8jpeg.jpeg?imageView2/1/w/114/h/114',
                'http://fuss10.elemecdn.com/f/28/a51e7b18751bcdf871648a23fd3b4jpeg.jpeg?imageView2/1/w/114/h/114'
            ],
            initialIndex: 0,
            currentFood: '', //单点当前导航 active 项的 key 值
            currentIndex: 0, //餐次默认选中
            mealTimesList: [], //餐次列表
            mealTimesID: '', //餐次id
            selectedFood: {},
            nowIndex: 0,
            menuList: {}, //菜谱
            menuInfo: {}, //菜谱全部信息
            configure: true, //是否配菜
            firstLoad: 0 //第一次加载
        }
    },
    computed: {
        currentIndex2() {
            for (let i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i]
                let height2 = this.listHeight[i + 1]
                if (
                    !height2 ||
                    (this.scrollY >= height1 && this.scrollY < height2)
                ) {
                    this._followScroll(i)
                    return i
                }
            }
            return 0
        },
        selectFoods() {
            let foods = []
            this.data.forEach(good => {
                good.foods.forEach(food => {
                    if (food.count) {
                        foods.push(food)
                    }
                })
            })
            return foods
        }
    },
    created() {
        this.mainId = this.$route.query.id //接收主模块id
        this.GetModuleList()
        this.GetMenuList()
    },
    methods: {
        // 测试
        selectMenu(index, event) {
            if (!event._constructed) {
                return
            }
            let foodList = this.$refs.foodList
            let el = foodList[index]
            this.foodsScroll.scrollToElement(el, 300)
        },
        _initScroll() {
  debugger
            this.meunScroll = new BScroll(this.$refs.menuWrapper, {
                click: true
            })

            this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                click: true,
                probeType: 3
            })

            this.foodsScroll.on('scroll', pos => {
                // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
                if (pos.y <= 0) {
                    this.scrollY = Math.abs(Math.round(pos.y))
                }
            })
        },
        _calculateHeight() {
            debugger
            let foodList = this.$refs.foodList
            let height = 0
            this.listHeight.push(height)
            for (let i = 0; i < foodList.length; i++) {
                let item = foodList[i]
                height += item.clientHeight
                this.listHeight.push(height)
            }
        },
        _followScroll(index) {
            let menuList = this.$refs.menuList
            let el = menuList[index]
            this.meunScroll.scrollToElement(el, 300, 0, -100)
        },
        // 测试end
        showNoticeBtn() {
            this.$store.commit('ChangeFoldNotice', true)
        },
        //获取点餐模式模块
        GetModuleList() {
            var _this = this
            let url = this.api.GetModuleList
            let addParmas = { mainId: this.mainId }
            let dParam = defaultParam('', 150)
            let parmas = Object.assign({}, dParam, addParmas)
            console.log('提交参数--' + JSON.stringify(parmas))
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(res => {
                    if (res.data.code == '0') {
                        //成功
                        console.log(res.data.data)
                        _this.mealTypeItem = res.data.data
                        _this.mealTypeId = res.data.data[0].id
                        console.log('默认第一个模式：' + res.data.data[0].id)
                        _this.GetRepastList()
                    } else {
                        alert(res.data.msg)
                    }
                })
                .catch(function(error) {
                    console.log(error)
                })
        },
        //点餐模式id
        toggleTabs(index, id) {
            this.nowIndex = index
            this.mealTypeId = id
            console.log(`当前点餐模式：${id}`)
            this.GetRepastList()
        },
        //选择餐次
        toggleMTabs(index, id) {
            this.currentIndex = index
            this.mealTimesID = id
            console.log(`当前餐次的id：${this.mealTimesID}`)
            this.GetMenuList()
            // if (this.menuInfo.orderingMode == 1) {
            //     this.$nextTick(() => {
            //         this.$refs.menuScroll.refresh()
            //     })
            // }
        },
        //获取餐次列表
        GetRepastList() {
            var _this = this
            let url = this.api.GetRepastList
            let addParmas = { moduleId: _this.mealTypeId } //模块Id
            let dParam = defaultParam('', 104)
            let parmas = Object.assign({}, dParam, addParmas)
            console.log('获取餐次列表参数：--' + JSON.stringify(parmas))
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(res => {
                    if (res.data.code == '0') {
                        //成功
                        console.log(res.data.data)
                        this.mealTimesList = res.data.data
                        this.mealTimesID = res.data.data[0].repastId //默认值
                        console.log(
                            '首次进入页面取得餐次id：' + this.mealTimesID
                        )
                        _this.GetMenuList()
                        _this.currentIndex = 0 //初始化餐次选中项
                    } else {
                        alert(res.data.msg)
                    }
                })
                .catch(function(error) {
                    console.log(error)
                })
        },
        //食谱菜肴
        GetMenuList() {
            var _this = this
            let url = this.api.GetMenuList
            let addParmas = {
                moduleId: _this.mealTypeId,
                repastId: _this.mealTimesID
            } //模块Id  餐次Id
            let dParam = defaultParam('', 105)
            let parmas = Object.assign({}, dParam, addParmas)
            console.log('获取菜谱参数--' + JSON.stringify(parmas))
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(res => {
                    if (res.data.code == '0') {
                        //成功
                        console.log(res.data.data)
                        _this.menuInfo = res.data.data
                        _this.menuList = res.data.data.dataList[0]
                        console.log(res.data.data.dataList[0])
                        _this.configure = true
                        _this.currentFood =
                            res.data.data.dataList[0].repastDataList[0].menuTypeName
                        if (res.data.data.orderingMode === 1) {
                            _this.$nextTick(() => {
                                _this._initScroll()
                                _this._calculateHeight()
                            })
                        }
                    } else {
                        console.log(res.data.msg)
                        _this.configure = false
                        console.log('暂无配餐：' + this.configure)
                    }
                })
                .catch(function(error) {
                    console.log(error)
                })
        },
        selectFood(food, event) {
            if (!event._constructed) {
                return
            }
            this.$router.push({
                path: 'food',
                name: 'food',
                query: {
                    id: 1
                }
            })
            // this.selectedFood = food
            // this.$refs.food.show()
        },
        addFood(target) {
            this._drop(target)
        },
        _drop(target) {
            // 体验优化,异步执行下落动画
            this.$nextTick(() => {
                this.$refs.shopcart.drop(target)
            })
        },
        //隐藏公告详细信息
        hideNotice(Value) {
            this.$store.commit('ChangeFoldNotice', Value)
        },
        //支付方式
        totalPrice(price) {
            this.payPrice = price
            console.log(`需要支付的${price}元`)
        },
        // 选择菜
        choosedMeal(index) {
            this.chooseNum = index + 1
        },
        changeHandler(label) {
            console.log('changed to:', label)
        },
        stickyChangeHandler(current) {
            console.log('sticky-change', current)
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
    }
}
</script>

<style lang="less">
@import '../common/less/mixin.less';
.goods {
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
                content: '';
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
                content: '';
            }
        }
    }
    .foodScroll {
        position: fixed;
        top: 152px;
        left: 0;
        bottom: 54px;
        width: 100%;
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
            padding: 16px 0 12px 18px;
        }
        .foodsWrapper {
            padding: 0 0 0 18px;
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
                        content: '';
                        width: 0;
                        height: 0;
                        border: 5px solid;
                        position: absolute;
                        top: -10px;
                        left: 36px;
                        border-color: transparent transparent
                            rgba(219, 219, 234, 0.4) transparent;
                    }
                    .more {
                        color: #7574f5;
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
                right: 10px;
                top: 10px;
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
                    span {
                        padding-right: 15px;
                    }
                }
                &::after {
                    content: '';
                    width: 0;
                    height: 0;
                    border: 5px solid;
                    position: absolute;
                    top: -10px;
                    left: 15px;
                    border-color: transparent transparent
                        rgba(219, 219, 234, 0.4) transparent;
                }
                .more {
                    color: #7574f5;
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
    display: flex;
    position: absolute;
    top: 151px;
    bottom: 54px;
    width: 100%;
    overflow: hidden;
    .menu-wrapper {
        flex: 0 0 80px;
        width: 80px;
        background: #f9f9f9;
        .menu-item {
            padding: 16px 12px;
            text-align: left;
            width: 80px;
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
            padding: 16px 0 12px 18px;
        }
        .foodsWrapper {
            padding: 0 0 5px 18px;
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
                        content: '';
                        width: 0;
                        height: 0;
                        border: 5px solid;
                        position: absolute;
                        top: -10px;
                        left: 36px;
                        border-color: transparent transparent
                            rgba(219, 219, 234, 0.4) transparent;
                    }
                    .more {
                        color: #7574f5;
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
