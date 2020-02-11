<template>
    <div class="moreText">
        {{ showText }}
        <span class="moreToggle" :class="[toggleStatus ? 'on' : '']" v-if="needMore" @click="toggle"></span>
    </div>
</template>
<script type="text/babel">
export default {
    data() {
        return {
            text: '',
            toggleStatus: false
        }
    },
    props: ['moreLength'],
    mounted() {
        this.text = this.$slots.default[0].text //从默认插槽获取内容
    },
    computed: {
        //当内容超过指定的长度，才需要【更多】功能 str.replace(/[^\x00-\xff]/g,"aa").length
        needMore: function() {
            return this.text.length > this.moreLength
        },
        //展示的文本， 当前展开状态或者不需要【更多】功能时，展示原本内容，否则截取内容
        showText: function() {
            if (this.toggleStatus || !this.needMore) {
                return this.text
            } else {
                return this.text.substring(0, this.moreLength) + '...'
            }
        }
    },
    methods: {
        //切换状态
        toggle: function() {
            this.toggleStatus = !this.toggleStatus
        }
    }
}
</script>

<style lang="less">
.moreText {
    font-size: 13px;
    color: #505050;
	line-height: 18px;
	position: relative;
	word-wrap:break-word;
}
.moreToggle {
    display: inline-block;
    position: absolute;
    right: 0;
    bottom: 6px;
    width: 9px;
    height: 5px;
    background: url(../../assets/meal/icon03@2x.png) right center no-repeat;
    background-size: 100% 100%;
    transition: transform 0.2s;
    transform: rotate(0deg);
    &.on {
        background: url(../../assets/meal/icon03@2x.png) right center no-repeat;
        background-size: 100% 100%;
        transform: rotate(180deg);
        width: 9px;
        height: 5px;
    }
}
</style>
