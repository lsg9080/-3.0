<template>
    <transition name="move">
        <div v-show="showFlag" class="foodDesc">
            <cube-scroll ref="scrollFood">
                <div class="food-content">
                    <div class="image-header">
                        <div class="slideImgBox" v-if="foodInfo.picUrlList && foodInfo.picUrlList.length > 1">
							<cube-slide ref="bannerslide">
								<cube-slide-item
									v-for="(item, index) in foodInfo.picUrlList"
									:key="index"
								>
									<a :href="item.BannerSrc">
										<img :src="item" />
									</a>
								</cube-slide-item>
							</cube-slide>
						</div>
						<div v-else
                            class="img"
                            :style="{
                                backgroundImage: 'url(' + foodInfo.picUrlList + ')'
                            }"
                        ></div>
                        <div class="back" @click="hide">
                            <i class="icondelete"></i>
                        </div>
                        <div class="imgContent">
                            <h1 class="title">
                                {{ foodInfo.menuName }}
                            </h1>
                            <div v-if="detailFood.orderingMode == 1" class="cartcontrolContent">
                                <cartcontrol
                                    @add="addFood"
                                    :food="detailFood"
                                ></cartcontrol>
                            </div>
							<div v-else class="selBTn">
								<i v-show="detailFood.count == 0" @click="detailSelFood" class="iconselectdefault2"></i>
								<i v-show="detailFood.count > 0" @click="detailSelFood" class="inner iconjianshao"></i>
							</div>
                        </div>
                    </div>
                    <div v-if="foodInfo.menuDescription"
                        class="desc"
                        :class="[toggleStatus ? 'on' : '']"
                    >
                        {{ formatDescText }}
                        <span
							@click="toggleDesc"
                            v-if="needMore"
                            class="moreDesc"
                            :class="[toggleStatus ? 'on' : '']"
                        ></span>
                    </div>
                    <split></split>
                    <div class="content">
                        <div class="title title1">原料</div>
                        <div
                            class="rawMaterial"
                            :class="[showAll2 ? 'on' : '']"
                        >
                            <div v-show="foodInfo.foodList && foodInfo.foodList.length>2"
                                @click="rawMaterialMore"
                                class="more"
                                :class="[showAll2 ? 'on' : '']"
                            >
                                <i></i>{{ word2 }}
                            </div>
							<p v-for="(v,index) in foodInfo.foodList" :key="index">{{v}}</p>
                        </div>
                        <div :class="splitClass" class="split1"></div>
                        <div class="title title2">核心营养成分</div>
                        <div class="mainNutritioPart">
                            <ul>
                                <li v-for="(item, index) in foodInfo.nutrientCoreList" :key="index">
                                    <h2>{{item.value}}</h2>
                                    <p>{{item.name}}（{{item.unit}}）</p>
                                </li>
                            </ul>
                        </div>
                        <div class="split1"></div>
                        <div class="title title3">三大能量来源比<span @click="moreMeaning" class="moreMeaning">了解它的意义</span>
                        </div>
                        <div class="EnergyRatio">
                            <ul>
                                <li v-if="foodInfo.energyOfSourcePercentList" v-for="(item, index) in foodInfo.energyOfSourcePercentList" :key="index" :style="{ width: item.value + '%' }">
                                    <div class="number">{{item.percent}}</div>
                                    <div class="scale"></div>
                                    <div class="txt">{{item.name}}</div>
                                </li>
                            </ul>
                        </div>
                        <div class="split1"></div>
                        <div class="title">其他营养成分</div>
                        <div class="nutritioPart">
                            <ul :class="[showAll ? 'on' : '']">
                                <li class="top">
                                    <div>营养成分</div>
                                    <div class="R">含量</div>
                                </li>
                                <li v-for="(item, index) in foodInfo.nutrientOtherList" :key="index">
                                    <div>{{item.name}}</div>
                                    <div class="R">{{item.value}}{{item.unit}}</div>
                                </li>
                            </ul>
                            <div v-if="foodInfo.nutrientOtherList && foodInfo.nutrientOtherList.length > 5"
                                @click="nutritioPartBtn"
                                class="nutritioPartBtn"
                            >
                                <span :class="[showAll ? 'on' : '']"
                                    >{{ word }}<i></i
                                ></span>
                            </div>
                        </div>
                    </div>
                </div>
            </cube-scroll>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import { formatDate } from '../common/js/date'
import cartcontrol from './cartcontrol'
import split from './split'

const ALL = 2

export default {
    props: {
        foodInfo: {
            type: Object
        },
        detailFood: {
            type: Object
		},
		NMItemPrams: {
			type: Object
		}
    },
    data() {
        return {
            // food: {},
            showFlag: false,
            selectType: ALL,
            onlyContent: true,
            imgUrl:
                'http://fuss10.elemecdn.com/9/b5/469d8854f9a3a03797933fd01398bjpeg.jpeg?imageView2/1/w/750/h/750',
            showAll: false, //标记数据是否需要完全显示的属性
            showAll2: false,
            toggleStatus: false,
            maxLength: 40,
            descText:
                '秋葵炒鸡蛋非常适合在炎热的夏季吃，营养清爽美味，尤其适合体质虚弱、营养不良、贫血及妇女产后病后调养,适宜婴幼儿发育期补养,具有养心安神，补血，滋阴润燥之功效。这样的食疗方法可以有滋补的作用，还可以补充丰富的营养元素，对于缓解肾虚啊或者是神经衰弱有好吃，还可以促进发育。秋葵软脆清香，鸡蛋松软嫩滑，绿黄搭配，也会让人产生食欲，是一道既简单又营养，同时也十分好吃的菜肴，现在即将下市，喜欢吃或者还没有吃过的朋友赶快抓紧时间了！秋葵的口感清脆，营养价值丰富。含有蛋白质、钙、锌、铁等营养成份。经常食用还能够提高人体免疫力、保护肝脏、降低血糖、壮阳补肾，对于咽喉肿痛、胃黏膜的保护起着很重要的作用。是货真价实的健康食材。'
        }
	},
	created(){
		if(this.foodInfo.picUrlList && this.foodInfo.picUrlList.length > 1){
			this.$nextTick(() => {
				this.$refs.bannerslide.refresh()
			})
		}
	},
    mounted() {},
    computed: {
		splitClass(){
			if(this.foodInfo.foodList && this.foodInfo.foodList.length == 1 && this.showAll2 == false){
				return 'split1N'
			}
		},
		picUrlListLength(){
			return this.foodInfo.picUrlList.length
		},
        //当内容超过指定的长度，才需要【更多】功能
        needMore() {
            return this.foodInfo.menuDescription.length > this.maxLength
        },
        //展示的文本， 当前展开状态或者不需要【更多】功能时，展示原本内容，否则截取内容
        formatDescText() {
            if (this.toggleStatus || !this.needMore) {
                return this.foodInfo.menuDescription
            } else {
                return this.foodInfo.menuDescription.substring(0, this.maxLength) + '...'
            }
        },
        word() {
            return this.showAll ? '收起' : '查看更多'
        },
        word2() {
            return this.showAll2 ? '收起' : '更多'
        }
    },
    watch: {
        // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
        $route: 'getParams'
    },
    methods: {
		//调用父组件方法
		detailSelFood(){
			if(this.detailFood.orderingMode == 2){
				//套餐
				this.$parent.choosedSetMeal(this.detailFood)
			}else{
				// N选M 
				this.$parent.choosedMeal(this.NMItemPrams.outIndex,this.NMItemPrams.mealItem,this.NMItemPrams.price,this.NMItemPrams.itemN,this.NMItemPrams.itemM,this.NMItemPrams.itemMenuTypeName)
			}
		},
		moreMeaning(){
			window.open('https://www.baikemy.com/jiankangkepu/2005208013569',"_blank");
			// window.location.href = 'https://www.baikemy.com/jiankangkepu/2005208013569'
		},
        getParams() {
            // 取到路由带过来的参数
            let routerParams = this.$route.params.dataobj
            // 将数据放在当前组件的数据内
            this.food = routerParams
        },
        toggleDesc() {
            this.toggleStatus = !this.toggleStatus
        },
        nutritioPartBtn() {
            this.showAll = !this.showAll
        },
        rawMaterialMore() {
            this.showAll2 = !this.showAll2
        },
        refreshCar() {
            this.$refs.scrollFood.refresh()
        },
        show() {
            this.showFlag = true
            this.selectType = ALL
            this.onlyContent = true
            this.$nextTick(() => {
                this.refreshCar()
            })
        },
        hide() {
			this.showFlag = false
			this.showAll2 = false
        },
        addFirst(event) {
            if (!event._constructed) {
                return
            }
            this.$emit('add', event.target)
            // Vue.set(this.food, 'count', 1)
        },
        needShow(type, text) {
            if (this.onlyContent && !text) {
                return false
            }
            if (this.selectType === ALL) {
                return true
            } else {
                return type === this.selectType
            }
        },
        addFood(target) {
            this.$emit('add', event.target,this.detailFood)
        }
    },
    filters: {
        formatDate(time) {
            let date = new Date(time)
            return formatDate(date, 'yyyy-MM-dd hh:mm')
        }
    },
    components: {
        cartcontrol,
        split
    }
}
</script>

<style lang="less">
@import '../common/less/mixin.less';
.foodDesc {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 51;
    width: 100%;
    height: 100%;
    background: #fff;
    transform: translate3d(0, 0, 0);
    &.move-enter-active,
    &.move-leave-active {
        transition: all 0.2s linear;
    }
    &.move-enter,
    &.move-leave-active {
        transform: translate3d(100%, 0, 0);
    }
    .image-header {
        position: relative;
        width: 100%;
		height: 225px;
		.slideImgBox{
			.cube-slide-group {
				img {
					width: 100%;
					height: 225px;
					max-height: 225px;
					display: block;
				}
			}
		}
        & .img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            height: 225px;
            background-position: center center;
            background-repeat: no-repeat;
            background-origin: content-box;
            background-clip: content-box;
			background-size: cover;
			background-color: rgba(117, 116, 245, 0.25);
        }
        .back {
            position: absolute;
            top: 10px;
            left: 10px;
            i {
                font-size: 30px;
				color: rgba(117, 116, 245, 0.9);
				box-shadow: 0 0 15px rgba(117, 116, 245, 1);
                width: 20px;
                height: 20px;
                border-radius: 50%;
            }
        }
        .imgContent {
            // background: rgba(0, 0, 0, 0.2);
            position: absolute;
            bottom: 12px;
            // padding-bottom: 12px;
            padding: 0 10px 0 18px;
            font-size: 22px;
            color: #ffffff;
            display: flex;
            justify-content: space-between;
            width: 100%;
            box-sizing: border-box;
            .title {
                flex: 0 0 238px;
                line-height: 28px;
            }
            .cartcontrolContent {
                font-size: 16px;
                .cart-count {
                    color: #fff;
                }
            }
        }
    }
    .desc {
        margin: 18px;
        font-size: 16px;
        color: #505050;
        line-height: 24px;
        height: 48px;
        overflow: hidden;
        position: relative;
        &.on {
            height: auto;
        }
        .moreDesc {
            display: inline-block;
            position: absolute;
            right: 0;
            bottom: 9px;
            width: 9px;
            height: 5px;
            background: url(../assets/meal/icon03@2x.png) right center no-repeat;
            background-size: 100% 100%;
            transition: transform 0.2s;
            transform: rotate(0deg);
            &.on {
                background: url(../assets/meal/icon03@2x.png) right center
                    no-repeat;
                background-size: 100% 100%;
                transform: rotate(180deg);
                width: 9px;
                height: 5px;
            }
        }
    }
    .content {
        padding: 0 0 0 18px;
        .title {
			font-size: 18px;
			height: 18px;
            color: #2a2a2a;
            background: url(../assets/meal/food4@2x.png) no-repeat left center;
            background-size: 18px 18px;
            padding-left: 24px;
            margin-top: 30px;
            margin-bottom: 24px;
            overflow: hidden;
            &.title1 {
                background: url(../assets/meal/food1@2x.png) no-repeat left
                    center;
                background-size: 18px 18px;
            }
            &.title2 {
                background: url(../assets/meal/food2@2x.png) no-repeat left
                    center;
                background-size: 18px 18px;
            }
            &.title3 {
                background: url(../assets/meal/food3@2x.png) no-repeat left
                    center;
                background-size: 18px 18px;
            }
            .moreMeaning {
                color: rgba(117, 116, 245, 0.8);
                font-size: 14px;
                font-weight: 600;
                background: url(../assets/meal/icon04@2x.png) left center
                    no-repeat;
                background-size: 14px 14px;
                padding-left: 19px;
                .fr();
                margin: 2px 18px 2px 0;
            }
        }
        .rawMaterial {
            font-size: 15px;
            color: #505050;
            line-height: 21px;
            height: 54px;
            overflow: hidden;
            position: relative;
            &.on {
                height: auto;
            }
            .more {
                font-size: 14px;
                color: #7574f5;
                display: inline-block;
                position: absolute;
                right: 33px;
                bottom: -1px;
                i {
                    position: absolute;
                    right: -15px;
                    top: 8px;
                    width: 9px;
                    height: 5px;
                    background: url(../assets/meal/icon03@2x.png) right center
                        no-repeat;
                    background-size: 100% 100%;
                    transition: transform 0.2s;
                    transform: rotate(0deg);
                }
                &.on {
                    i {
                        transform: rotate(180deg);
                    }
                }
            }
            p {
                padding-bottom: 12px;
                span {
                    background: #ff8361;
                    border-radius: 4px;
                    font-size: 12px;
                    color: #ffffff;
                    width: 34px;
                    height: 20px;
                    .box-c();
                    float: left;
                    margin-right: 6px;
				}
				&:last-child{
					padding-bottom: 0;
				}
            }
        }
        .mainNutritioPart {
            ul {
                margin-right: -10px;
                font-size: 0;
                li {
                    width: 106px;
                    height: 60px;
                    margin-right: 10px;
                    display: inline-block;
                    font-size: 12px;
                    color: #fff;
                    padding: 7px 0 0 12px;
                    box-sizing: border-box;
                    margin-bottom: 10px;
                    & > h2 {
                        font-family: Akrobat-ExtraBold;
                        font-size: 28px;
                        padding-bottom: 5px;
                    }
                    &:nth-child(1) {
                        background-image: linear-gradient(
                            45deg,
                            #7cdbb2 0%,
                            #21c67f 100%
                        );
                        box-shadow: 0 2px 10px 0 rgba(33, 198, 127, 0.25);
                        border-radius: 4px;
                    }
                    &:nth-child(2) {
                        background-image: linear-gradient(
                            45deg,
                            #ffd678 0%,
                            #fdbf32 100%
                        );
                        box-shadow: 0 2px 10px 0 rgba(253, 191, 50, 0.25);
                        border-radius: 4px;
                    }
                    &:nth-child(3) {
                        background-image: linear-gradient(
                            45deg,
                            #ffaa85 0%,
                            #ff8361 100%
                        );
                        box-shadow: 0 2px 10px 0 rgba(255, 131, 97, 0.25);
                        border-radius: 4px;
                    }
                    &:nth-child(4) {
                        background-image: linear-gradient(
                            45deg,
                            #aad5ff 0%,
                            #72acff 100%
                        );
                        box-shadow: 0 2px 10px 0 rgba(115, 172, 255, 0.25);
                        border-radius: 4px;
                    }
                    &:nth-child(5) {
                    }
                    background-image: linear-gradient(
                        45deg,
                        #adacfb 0%,
                        #7574f5 100%
                    );
                    box-shadow: 0 2px 10px 0 rgba(117, 116, 245, 0.25);
                    border-radius: 4px;
                    &:nth-child(4),
                    &:nth-child(5) {
                        margin-bottom: 0;
                    }
                }
            }
        }
        .EnergyRatio {
            padding: 0 18px 0 0;
            ul {
                display: flex;
                margin-left: -3px;
                li {
                    font-size: 14px;
                    margin-right: 3px;
                    .number {
                        font-size: 28px;
                        font-family: Akrobat-ExtraBold;
                    }
                    .scale {
                        height: 22px;
                    }
                    &:nth-child(1) {
                        text-align: left;
                        .number {
                            color: #fdbf33;
                            padding-bottom: 8px;
                        }
                        .txt {
                            color: #fdbf33;
                            padding-top: 12px;
                        }
                        .scale {
                            background-image: linear-gradient(
                                45deg,
                                #ffd678 0%,
                                #fdbf32 100%
                            );
                            box-shadow: 0 2px 10px 0 rgba(253, 191, 50, 0.25);
                            border-radius: 4px 0px 0px 4px;
                        }
                    }
                    &:nth-child(2) {
                        text-align: center;
                        .number {
                            color: #ff8361;
                            padding-bottom: 8px;
                        }
                        .txt {
                            color: #ff8361;
                            padding-top: 12px;
                        }
                        .scale {
                            background-image: linear-gradient(
                                45deg,
                                #ffaa85 0%,
                                #ff8361 100%
                            );
                            box-shadow: 0 2px 10px 0 rgba(255, 131, 97, 0.25);
                        }
                    }
                    &:nth-child(3) {
                        text-align: right;
                        .number {
                            color: #73acff;
                            padding-bottom: 8px;
                        }
                        .txt {
                            color: #73acff;
                            padding-top: 12px;
                        }
                        .scale {
                            background-image: linear-gradient(
                                45deg,
                                #aad5ff 0%,
                                #72acff 100%
                            );
                            box-shadow: 0 2px 10px 0 rgba(115, 172, 255, 0.25);
                            border-radius: 0px 4px 4px 0px;
                        }
                    }
                }
            }
        }
        .nutritioPart {
            padding: 0 18px 0 0;
            ul {
                height: 250px;
                overflow: hidden;
                &.on {
                    height: auto;
                }
                li {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 14px;
                    color: #505050;
                    border-bottom: 1px solid rgba(216, 216, 228, 0.4);
                    padding: 15px 0 15px 6px;
                    &.top {
                        background: rgba(219, 219, 234, 0.3);
                        font-size: 14px;
                        color: #aaaaaa;
                        height: 30px;
                        border: none;
                        padding: 0 0 0 6px;
                    }
                    .R {
                        flex: 0 0 96px;
                    }
                }
            }
            .nutritioPartBtn {
                text-align: center;
                padding: 17px 0 27px;
                span {
                    font-size: 14px;
                    color: #7574f5;
                    display: inline-block;
                    position: relative;
                    i {
                        position: absolute;
                        right: -15px;
                        top: 4px;
                        width: 9px;
                        height: 5px;
                        background: url(../assets/meal/icon03@2x.png) right
                            center no-repeat;
                        background-size: 100% 100%;
                        transition: transform 0.2s;
                        transform: rotate(0deg);
                    }
                    &.on {
                        i {
                            transform: rotate(180deg);
                        }
                    }
                }
            }
        }
        .split1 {
            height: 1px;
            background: #e7e7f1;
			margin-top: 30px;
			&.split1N{
				margin-top: 0;
			}
        }
	}
	.selBTn {
		position: absolute;
		z-index: 2;
		right: 5px;
		bottom: -8px;
		padding: 10px;
		i {
			font-size: 28px;
			color: #d8d8e4;
			&.iconxuanze {
				color: #7574f5;
			}
			&.inner{
				font-size: 25px;
				color: #7574f5;
			}
			&.iconjianshao{
				background: url(../assets/meal/iconjian@2x.png) no-repeat center center;
				background-size: 28px 28px;
				width: 28px;
				height: 28px;
			}
		}
	}
}
</style>