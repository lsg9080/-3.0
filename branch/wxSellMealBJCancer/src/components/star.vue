<!--星星评分-->
<template>
    <div class="rate" :class="{ disabled: disabled }">
        <div class="StarsWrap">
            <!--性能优化 track-by 数据不改变时不会重新渲染-->
            <div
                class="li"
                v-for="(i, index) in list"
                :key="index"
                track-by="index"
                @click="disabled ? '' : clickStars(index)"
            >
                <i
                    v-if="xing <= 2"
                    :class="[xing > index ? 'on1' : '', 'iconstar']"
                />
                <i
                    v-else-if="xing == 3"
                    :class="[xing > index ? 'on2' : '', 'iconstar']"
                />
                <i
                    v-else-if="xing > 3"
                    :class="[xing > index ? 'on3' : '', 'iconstar']"
                />
            </div>
        </div>
        <div v-if="xing <= 2" class="comment">
            {{ rateScoreText }}
        </div>
        <div v-else-if="xing == 3" class="comment on1">
            {{ rateScoreText }}
        </div>
        <div v-else-if="xing > 3" class="comment on2">
            {{ rateScoreText }}
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
/**
 * disabled(参数) 	Boolean(类型) 	(说明)是否只读，默认false，鼠标点击可以打分
 * score(参数) 	Number(类型) 	(说明)分数 ，默认0，
 */
export default {
    props: {
        itemaName: {
            type: Object
        },
        score: {
            type: Number,
            default: 0
            //required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            rateScoreText: '',
            rateScoreDesc: ['很差', '一般', '满意', '非常满意', '无可挑剔'],
            list: [0, 1, 2, 3, 4],
            xing: 0
        }
    },
    methods: {
        clickStars(i) {
            this.rateScoreText = this.rateScoreDesc[i]
            this.xing = i + 1
            if (this.xing <= 2) {
                this.starClass = 'on1'
            } else if (this.xing > 2) {
                this.starClass = 'on2'
            } else {
                this.starClass = 'on3'
            }
            this.itemaName.score = i + 1
            this.$emit('score', this.itemaName) //使用`.sync`修饰符，对score 进行“双向绑定

            // console.log('点击了' + (i + 1) + '颗星')
        }
    },
    created() {
        
    }
}
</script>

<style lang="less">
.rate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
}
.comment {
    font-size: 14px;
    color: #aaaaaa;
    padding-left: 11px;
    &.on1 {
        color: #ffd149;
    }
    &.on2 {
        color: #ff8361;
    }
}
.StarsWrap {
    overflow: hidden;
    .li {
        float: left;
        margin: 0;
        margin-right: 11px;
        i {
            display: block;
            font-size: 24px;
            color: #ededed;
            &.on1 {
                color: #aaaaaa;
            }
            &.on2 {
                color: #ffd149;
            }
            &.on3 {
                color: #ff8361;
            }
        }
    }
}
</style>