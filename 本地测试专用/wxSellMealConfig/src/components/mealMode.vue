<template>
    <div>
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
    </div>
</template>

<script type="text/ecmascript-6">
import { encryption, formatDate, defaultParam } from '../common/js/util'
import store from '../store'
export default {
    name: 'mealMode',
    data() {
        return {
            nowIndex: 0,
            mealTypeItem: []
        }
    },
    props: {
        mealTypeItem: {
            type: Object
        }
    },
    created() {
        this.GetModuleList()
    },
    methods: {
        toggleTabs(index, id) {
            this.nowIndex = index
            this.$emit('mealTypeId', id)
            console.log(`点餐模式：${id}`)
        },
        showNoticeBtn() {
            this.$store.commit('ChangeFoldNotice', true)
        }
    }
}
</script>

<style lang="less">
@import '../common/less/mixin.less';
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
</style>