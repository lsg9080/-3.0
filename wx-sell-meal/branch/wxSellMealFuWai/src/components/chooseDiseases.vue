<template>
    <transition name="fade">
        <div class="chooseDiseases" v-show="DiseasesPopup">
            <div class="DiseasesContent">
                <div class="header">
                    <i class="iconclose" @click="hideDiseases"></i>
                </div>
                <div class="content">
                    <div class="tips">
                        为了帮您推荐更符合您的菜肴，<br />
                        请选择和您相关的疾病(可多选)
                    </div>
                    <div class="Diseases-scroll-list-wrap">
                        <cube-scroll ref="scroll" :data="DiseasesList">
                            <ul class="DiseasesItem" ref="conCon">
                                <li
                                    v-for="(item, index) in DiseasesList"
                                    :key="'info-' + index"
                                    :class="{
                                        active: classItem.includes(index)
                                    }"
                                    :data-value="item"
                                    @click="Change(index)"
                                >
                                    <div>{{ item }}</div>
                                </li>
                            </ul>
                        </cube-scroll>
                    </div>
                    <div class="dn">当前选择的是:{{ message }}</div>
                    <div class="tipsBtn">
                        <cube-checkbox v-model="checkedTips">
                            下次不再显示
                        </cube-checkbox>
                    </div>
                    <div class="bottomBtn">
                        <div>不用了，谢谢</div>
                        <div class="bottomBtnR">完成</div>
                    </div>
                </div>
            </div>
            <div class="Diseases-mask"></div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {
            DiseasesPopup: false,
            checkedTips: true,
            classItem: [], //选中项样式
            message: [], //选中项
            DiseasesList: [
                '糖尿病',
                '高血压',
                '肿瘤',
                '肥胖',
                '甲状腺结节',
                '高血糖',
                '巨幼红细胞性贫血',
                '慢性支气管炎',
                '冠状动脉硬化性心脏病',
                '大叶性肺炎',
                '糖尿病',
                '高血压',
                '肿瘤',
                '肥胖',
                '甲状腺结节',
                '高血糖',
                '巨幼红细胞性贫血',
                '慢性支气管炎',
                '冠状动脉硬化性心脏病',
                '大叶性肺炎',
                '甲状腺结节',
                '高血糖',
                '巨幼红细胞性贫血',
                '慢性支气管炎',
                '冠状动脉硬化性心脏病',
                '大叶性肺炎'
            ]
        }
    },
    methods: {
        // includes()方法判断是否包含某一元素,返回true或false表示是否包含元素，对NaN一样有效
        // filter()方法用于把Array的某些元素过滤掉，filter()把传入的函数依次作用于每个元素，然后根据返回值是true还是false决定保留还是丢弃该元素：生成新的数组
        Change(index) {
            var Li = this.$refs.conCon.querySelectorAll('li')
            if (this.classItem.includes(index)) {
                this.classItem = this.classItem.filter(function(ele) {
                    return ele !== index
                })
                this.message = this.message.filter(function(ele) {
                    return ele !== Li[index].dataset.value
                })
            } else {
                this.classItem.push(index)
                this.message.push(Li[index].dataset.value)
            }
        },
        hideDiseases() {
            this.DiseasesPopup = false
        }
    }
}
</script>

<style lang="less">
@import '../common/less/mixin.less';
.chooseDiseases {
    position: fixed;
    top: 60px;
    left: 0;
    z-index: 50;
    width: 100%;
    height: 100%;
    .DiseasesContent {
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 51;
        height: 100%;
        width: 100%;
        background: #ffffff;
        border-radius: 12px 12px 0 0;
        .header {
            padding: 17px 17px 0;
            text-align: right;
            i {
                color: #aaaaaa;
                font-size: 24px;
            }
        }
        .content {
            position: relative;
            top: -6px;
            padding: 0 18px 18px;
            .tips {
                font-size: 18px;
                color: #2a2a2a;
                line-height: 27px;
            }
            .Diseases-scroll-list-wrap {
                height: 408px;
            }
            .DiseasesItem {
                font-size: 0;
                margin-right: -12px;
                padding-top: 24px;
                li {
                    border: 1px solid #dbdbea;
                    border-radius: 18px;
                    font-size: 16px;
                    color: #a9aacd;
                    display: inline-block;
                    margin: 0 12px 10px 0;
                    div {
                        .box-c();
                        height: 36px;
                        padding: 0 15px;
                    }
                    &.active {
                        color: #7574f5;
                        border: 1px solid #7574f5;
                        position: relative;
                        &::after {
                            content: '';
                            position: absolute;
                            right: -2px;
                            top: -2px;
                            background: url(../assets/meal/sel@2x.png) center
                                center no-repeat;
                            background-size: 100% 100%;
                            width: 16px;
                            height: 16px;
                        }
                    }
                }
            }
            .tipsBtn {
                .cube-checkbox {
                    padding: 0;
                    font-size: 14px;
                    color: #aaaaaa;
                }
                .cube-checkbox-ui {
                    width: 20px;
                    height: 20px;
                    font-size: 20px;
                }
                .cube-checkbox_checked .cube-checkbox-ui i {
                    color: #7574f5;
                }
            }
            .bottomBtn {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 16px;
                color: #aaaaaa;
                & > div {
                    flex: 1;
                    text-align: center;
                }
                .bottomBtnR {
                    width: 163px;
                    height: 46px;
                    .box-c();
                    background: #7574f5;
                    border-radius: 27px;
                    color: #ffffff;
                }
            }
        }
    }
    &.fade-enter-active,
    &.fade-leave-active {
        transition: all 0.5s;
    }
    &.fade-enter,
    &.fade-leave-active {
        opacity: 0;
    }
}
.Diseases-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 50;
    backdrop-filter: blur(10px);
    opacity: 1;
    background: rgba(7, 17, 27, 0.5);
}
</style>