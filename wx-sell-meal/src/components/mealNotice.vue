<template>
    <div class="mealNoticeContent" v-show="showFold">
        <transition name="fold">
            <div class="NoticeContent" v-show="showFold">
                <div class="header">
                    <i @click="hideNotice" class="iconclose"></i>
                </div>
                <div class="content">
                    <div class="tit">时间</div>
                    <div class="timeList">
                        <table width="100%">
                            <tr>
                                <td></td>
                                <td class="txt1">订餐时间</td>
                                <td class="txt1">修改时间</td>
                            </tr>
                            <tr v-for="(item, index) in mealNoticeListData" :key="index">
                                <td class="txt1">{{item.repastName}}</td>
                                <td>{{item.orderTime}}</td>
                                <td>{{item.retreatTime}}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="tit tit2">公告</div>
                    <div class="txt">
                        {{mealNoticeData}}
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="notice-mask" v-show="showFold"></div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
	props: ['showFold','mealNoticeListData','mealNoticeData'],
	methods:{
		hideNotice(){
			this.$emit('hideState',false)
		}
	}
}
</script>

<style lang="less">
@import '../common/less/mixin.less';
.mealNoticeContent {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    width: 100%;
    height: 100%;
    .NoticeContent {
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 51;
        min-height: 360px;
        width: 100%;
        background: #ffffff;
        border-radius: 12px 12px 0 0;
        transform: translate3d(0, 0, 0);
        &.fold-enter-active,
        &.fold-leave-active {
            transition: all 0.5s;
        }
        &.fold-enter,
        &.fold-leave-active {
            transform: translate3d(0, 100%, 0);
        }
        .header {
            padding: 17px 17px 12px;
            text-align: right;
            i {
                color: #aaaaaa;
                font-size: 24px;
            }
        }
        .content {
            padding: 0 0 0 24px;
            .tit {
                font-size: 16px;
                color: #7574f5;
                background: url(../assets/meal/icon02@2x.png) left center
                    no-repeat;
                background-size: 16px 16px;
                padding-left: 22px;
            }
            .tit2 {
                background: url(../assets/meal/icon01@2x.png) left center
                    no-repeat;
                background-size: 16px 17px;
            }
            .timeList {
                .border-bottom();
                padding: 14px 0 15px;
                font-size: 14px;
                color: #505050;
                margin-bottom: 19px;
                table tr td {
                    line-height: 28px;
                }
                .txt1 {
                    color: #aaaaaa;
                }
            }
            .txt {
                font-size: 14px;
                color: #505050;
                line-height: 22px;
                padding: 16px 24px 50px 0;
            }
        }
    }
}
.notice-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 50;
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
</style>