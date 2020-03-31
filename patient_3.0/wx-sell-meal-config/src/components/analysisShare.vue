<template>
    <div class="analysis">
        <div class="analysisTop">
            <div class="share" @click="shareGuide"></div>
            <h2>全天营养摄入量</h2>
            <p>仅分析病人餐&小锅菜的订餐内容，若非患者一人食用，则无参考意义</p>
        </div>
        <div class="content">
            <div
                class="card"
                v-for="(item, index) in analysisDataList.analysisResultList"
                :key="index"
            >
                <div class="analysisItem">
                    <div class="txt">{{ item.name }}</div>
                    <!-- （-1/0/1/-9）不合理/建议/合理/友情提醒 -->
                    <template v-if="item.result == '1'">
                        <div class="reasonable">{{ item.resultText }}</div>
                    </template>
                    <template v-else-if="item.result == '-1'">
                        <div class="reasonable Unreasonable">
                            {{ item.resultText }}
                        </div>
                    </template>
                    <template v-else-if="item.result == '-9'">
                        <div class=""></div>
                    </template>
                    <template v-else>
                        <div class="reasonable advise">
                            {{ item.resultText }}
                        </div>
                    </template>
                </div>
                <div class="explain" v-if="item.result != '1'">
                    <i class="iconwarning"></i>
                    <more-text more-length="40">{{ item.suggestion.join('；') }}</more-text>
                </div>
            </div>
            <div class="split1"></div>
            <div class="title title2">核心营养成分</div>
            <div class="mainNutritioPart">
                <ul>
                    <li
                        v-for="(item,
                        index) in analysisDataList.nutrientCoreList"
                        :key="index"
                    >
                        <h2>{{ item.value }}</h2>
                        <p>{{ item.name }}（{{ item.unit }}）</p>
                    </li>
                </ul>
            </div>
            <div class="split1"></div>
            <div class="title title3">
                三大能量来源比<span @click="moreMeaning" class="moreMeaning"
                    >了解它的意义</span
                >
            </div>
            <div class="EnergyRatio">
                <ul>
                    <li
                        v-for="(item,
                        index) in analysisDataList.energyOfSourcePercentList"
                        :key="index"
                        :style="{ width: item.value + '%' }"
                    >
                        <div class="number">{{ item.percent }}</div>
                        <div class="scale"></div>
                        <div class="txt">{{ item.name }}</div>
                    </li>
                </ul>
            </div>
            <div class="split1"></div>
            <div class="title title4">
                三餐供能比<span @click="moreMealMeaning" class="moreMeaning"
                    >了解它的意义</span
                >
            </div>
            <div class="EnergyRatio">
                <ul>
                    <li
                        v-for="(item,
                        index) in analysisDataList.energyOfMealPercentList"
                        :key="index"
                        :style="{ width: item.value + '%' }"
                    >
                        <div class="number">{{ item.percent }}</div>
                        <div class="scale"></div>
                        <div class="txt">{{ item.name }}</div>
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
                    <li
                        v-for="(item,
                        index) in analysisDataList.nutrientOtherList"
                        :key="index"
                    >
                        <div>{{ item.name }}</div>
                        <div class="R">{{ item.value }}{{ item.unit }}</div>
                    </li>
                </ul>
                <div v-if="analysisDataList.nutrientOtherList && analysisDataList.nutrientOtherList.length > 5" @click="nutritioPartBtn" class="nutritioPartBtn">
                    <span :class="[showAll ? 'on' : '']"
                        >{{ word }}<i></i
                    ></span>
                </div>
            </div>
            <!-- end -->
        </div>
        <!-- 分享引导弹层 -->
        <div class="shareGuideBox" @click="shareGuideBox" v-show="shareClass">
            <div class="txt">
                <img class="tit" src="../assets/meal/share4.png" />
                点击右上角
                <img class="tit" src="../assets/meal/share3.png" />
            </div>
            <div class="txt">
                <img class="tit" src="../assets/meal/share5.png" />
                选择
                <img class="share" src="../assets/meal/share1.png" />完成分享
            </div>
            <img class="arrow" src="../assets/meal/share2.png" />
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import store from '../store'
import storage from '../common/js/storage'
import moreText from './public/moreText'
// import sdk from '../common/js/sdk' //引入sdk.js
import wx from 'weixin-js-sdk'
import { encryption, defaultParam, extractQueryParams } from '../common/js/util'
export default {
    data() {
        return {
            showAll: false,
            analysisDataList: {},
            patId: '',
            mealDate: '',
            shareClass: false //弹层默认隐藏
        }
    },
    components: {
        moreText
    },
    created() {
        this.getUrlParms()
        this.GetDayNutrientInfo()
		this.shareFriend()
		//判断是否是IOS设备
		// IOS分享时的页面是首页，也就是进入页而不是当前页。所有可以采用刷新当前页，让进入页的链接改成当前页，再在页面卸载时删除缓存数据。
		let agent = navigator.userAgent
		let isIOS = !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
		if(isIOS && !sessionStorage.getItem('isShareState')){
			sessionStorage.setItem('isShareState',true)
			this.$router.go(0)
		}
        // var url = window.location.href.split('#')[0]
        // let patName = storage.getItem('patName')
        // var obj = {
        //     title: patName + '分享了他的全天营养分析', //分享标题
        //     desc: '点击查看', //分享内容
        //     link: 'https://yydc.bjcancer.org/analysis', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //     imgUrl: 'https://yydc.bjcancer.org/static/img/shareBack.png' // 分享图标分享内容显示的图片
        // }
        // sdk.getJSSDK(url, obj) //传入sdk.js需要的参数
    },
    computed: {
        word() {
            return this.showAll ? '收起' : '查看更多'
        }
    },
    methods: {
        getUrlParms() {
            const queryParams = extractQueryParams(window.location.href)
            this.patId = queryParams.patId
            this.mealDate = queryParams.mealDate
        },
        GetDayNutrientInfo() {
            var _this = this
            let url = this.api.GetDayNutrientInfo
            let dParam = defaultParam('', 157)
            let addParmas = {
                patId: this.patId,
                mealDate: this.mealDate
            }
            let parmas = Object.assign({}, dParam, addParmas)
            console.log('营养分析参数：' + JSON.stringify(parmas))
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(res => {
                    if (res.data.code == '0') {
                        //成功
                        _this.analysisDataList = res.data.data
                    } else {
                        alert(res.data.msg)
                    }
                })
                .catch(function(error) {
                    console.log(error)
                })
        },
        shareFriend() {
            var _this = this
            let url = this.api.GetSignature
            let authCode = encryption('wx_wincome', 306)
            let params = {
                authCode: authCode,
                weixinNo: 'wx_wincome',
                callFrom: 'wincome',
                pageURL: window.location.href.split('#')[0]
            }
            // console.log('获取签名提交参数：' + JSON.stringify(params))
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
            const patName = storage.getItem('patName')
            wx.ready(function() {
                // 分享给朋友
                wx.onMenuShareAppMessage({
                    title: patName + '分享了他的全天营养分析', // 分享标题
                    desc: '点击查看', // 分享描述
                    link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'https://yydc.bjcancer.org/img/share.png', // 分享图标
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function(res) {
                        // 用户点击了分享后执行的回调函数
                        // 设置成功
                        _this.$myToast.success('分享成功!')
                    },
                    fail: function(res) {
                        console.log(res)
                        // alert(JSON.stringify(res));
                    }
                })
                // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareTimeline({
                    title: patName + '分享了他的全天营养分析', // 分享标题
                    link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'https://yydc.bjcancer.org/img/share.png', // 分享图标
                    trigger: function trigger(res) {
                        // alert('用户点击分享到朋友圈');
                    },
                    success: function success(res) {
                        _this.$myToast.success('分享成功!')
                        //alert('已分享');
                    },
                    cancel: function cancel(res) {
                        //alert('已取消');
                    },
                    fail: function fail(res) {
                        alert(JSON.stringify(res))
                    }
                })
            })
        },
        shareGuide() {
            this.shareClass = true
        },
        shareGuideBox() {
            this.shareClass = false
        },
        moreMeaning() {
            window.open(
                'https://mp.weixin.qq.com/s/Qzn6THF1848bib6HxIh92w',
                '_blank'
            )
            // window.location.href = 'https://www.baikemy.com/jiankangkepu/2005208013569'
        },
        moreMealMeaning() {
            window.open(
                'https://mp.weixin.qq.com/s/SflT61omDtY3urxzHuE9Kw',
                '_blank'
            )
        },
        nutritioPartBtn() {
            this.showAll = !this.showAll
        }
	},
	destroyed(){
		sessionStorage.removeItem('isShareState');
	}
}
</script>

<style lang="less">
@import '../common/less/mixin.less';
.analysis {
    .hidden {
        opacity: 0;
    }
    .shareGuideBox {
        background: rgba(0, 0, 0, 0.8);
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 10;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        font-size: 20px;
        color: #fff;
        .arrow {
            width: 66px;
            height: 66px;
            position: absolute;
            right: 30px;
            top: 35px;
        }
        .txt {
            &:first-child {
                padding-top: 95px;
            }
            display: flex;
            padding: 0 0 50px 40px;
            align-items: center;
            .tit {
                width: 45px;
                height: 40px;
                margin: 0 10px;
            }
            .share {
                width: 71px;
                height: 35px;
                margin: 0 10px;
            }
        }
    }
    .split1 {
        height: 1px;
        background: #e7e7f1;
        margin-top: 30px;
        margin-left: 18px;
    }
    .analysisTop {
        background: url(../assets/meal/top@2x.png) center center no-repeat;
        background-size: 100% 100%;
        height: 150px;
        color: #fff;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        padding: 0 14px;
        position: relative;
        h2 {
            font-size: 20px;
            padding: 24px 0 12px;
        }
        .share {
            position: absolute;
            top: 24px;
            right: 14px;
            width: 19px;
            height: 19px;
            background: url(../assets/meal/share@2x.png) center center no-repeat;
            background-size: 100% 100%;
        }
    }
    .content {
        position: relative;
        top: -40px;
        .card {
            margin: 0 18px 10px;
            background: #ffffff;
            box-shadow: 0 2px 10px 0 rgba(117, 116, 245, 0.2);
            border-radius: 4px;
            .analysisItem {
                display: flex;
                padding: 18px;
                justify-content: space-between;
                align-items: center;
                .txt {
                    font-size: 18px;
                    color: #2a2a2a;
                }
                .reasonable {
                    background-image: linear-gradient(
                        45deg,
                        #63d8a6 0%,
                        #21c67f 100%
                    );
                    box-shadow: 0 2px 10px 0 rgba(33, 198, 127, 0.25);
                    border-radius: 14px;
                    font-size: 16px;
                    color: #ffffff;
                    width: 80px;
                    height: 28px;
                    .box-c();
                    &.Unreasonable {
                        background-image: linear-gradient(
                            45deg,
                            #ff9262 0%,
                            #ff6a42 100%
                        );
                        box-shadow: 0 2px 10px 0 rgba(255, 131, 97, 0.25);
                        border-radius: 14px;
                    }
                    &.advise {
                        background-image: linear-gradient(
                            45deg,
                            #ffca51 0%,
                            #ffbf2d 100%
                        );
                        box-shadow: 0 2px 10px 0 rgba(253, 191, 50, 0.25);
                        border-radius: 14px;
                    }
                }
            }
            .explain {
                display: flex;
                padding: 8px 18px 7px;
                background: #f8f8f8;
                font-size: 13px;
                color: #505050;
                line-height: 18px;
                i {
                    color: #ff8361;
                    font-size: 18px;
                    margin-right: 6px;
                    display: block;
                    flex: 0 0 18px;
                    &.advise {
                        color: #ffd149;
                    }
                }
            }
        }
        .title {
            font-size: 18px;
            color: #2a2a2a;
            background: url(../assets/meal/food4@2x.png) no-repeat left center;
            background-size: 18px 18px;
            padding-left: 24px;
            margin: 30px 18px 24px 18px;
            // overflow: hidden;
			height: 18px;
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
            &.title4 {
                background: url(../assets/meal/food5@2x.png) no-repeat left
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
                margin: 2px 0 2px 0;
            }
        }
        .mainNutritioPart {
            padding: 0 18px;
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
            padding: 0 18px;
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
                            &.meal {
                                color: #21c67f;
                            }
                        }
                        .txt {
                            color: #ff8361;
                            padding-top: 12px;
                            &.meal {
                                color: #21c67f;
                            }
                        }
                        .scale {
                            background-image: linear-gradient(
                                45deg,
                                #ffaa85 0%,
                                #ff8361 100%
                            );
                            box-shadow: 0 2px 10px 0 rgba(255, 131, 97, 0.25);
                            &.meal {
                                background-image: linear-gradient(
                                    45deg,
                                    #7cdbb2 0%,
                                    #21c67f 100%
                                );
                                box-shadow: 0 2px 10px 0
                                    rgba(33, 198, 127, 0.25);
                            }
                        }
                    }
                    &:nth-child(3) {
                        text-align: right;
                        .number {
                            color: #73acff;
                            padding-bottom: 8px;
                            &.meal {
                                color: #7574f5;
                            }
                        }
                        .txt {
                            color: #73acff;
                            padding-top: 12px;
                            &.meal {
                                color: #7574f5;
                            }
                        }
                        .scale {
                            background-image: linear-gradient(
                                45deg,
                                #aad5ff 0%,
                                #72acff 100%
                            );
                            box-shadow: 0 2px 10px 0 rgba(115, 172, 255, 0.25);
                            border-radius: 0px 4px 4px 0px;
                            &.meal {
                                background-image: linear-gradient(
                                    45deg,
                                    #adacfb 0%,
                                    #7574f5 100%
                                );
                                box-shadow: 0 2px 10px 0
                                    rgba(117, 116, 245, 0.25);
                                border-radius: 0px 4px 4px 0px;
                            }
                        }
                    }
                }
            }
        }
        .nutritioPart {
            padding: 0 18px;
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
    }
}
</style>