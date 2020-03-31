<template>
    <div class="marquee-wrap">
        <!-- 滚动内容 -->
        <div class="scroll">
            <p class="marquee">{{ text }}</p>
            <!-- 文字副本 -->
            <p class="copy"></p>
        </div>
        <!-- 为了计算总文本宽度，通过css在页面中隐藏 -->
        <p class="getWidth">{{ text }}</p>
    </div>
</template>

<script>
export default {
    props: ['lists'], // 父组件传过来的数组
    data() {
        return {
            timer: null,
            text: ''
        }
    },
    created() {
        // 进入页面等一秒才开始滑动
        let timer = setTimeout(() => {
            this.move()
            clearTimeout(timer)
        }, 1000)
    },
    // 把父组件传入的arr转化成字符串
    mounted() {
        for (let item of this.lists) {
            this.text += ' ' + item
        }
    },
    methods: {
        move() {
            let maxWidth = document.querySelector('.marquee-wrap').clientWidth
            // 获取文字text 的计算后宽度 （由于overflow的存在，直接获取不到，需要独立的node计算）
            let width = document.querySelector('.getWidth').scrollWidth
            // 如果文本内容的宽度小于页面宽度，则表示文字小于等于一行，则不需要滚动
            if (width <= maxWidth) return
            let scroll = document.querySelector('.scroll')
            let copy = document.querySelector('.copy')
            copy.innerText = this.text // 文字副本填充
            let distance = 0 // 位移距离
            // 设置位移
            this.timer = setInterval(() => {
                distance -= 1
                // 如果位移超过文字宽度，则回到起点
                if (-distance >= width) {
                    distance = 16 // 距离必须与marquee的margin宽度相同
                }
                scroll.style.transform = 'translateX(' + distance + 'px)'
            }, 20)
        }
    },
    beforeDestroy() {
        // 清除计时器
        clearInterval(this.timer)
    }
}
</script>
<style scoped lang='less'>
.marquee-wrap {
	letter-spacing: -1.5px;
    width: 100%;
	overflow: hidden;
	height: 28px;
	line-height: 28px;
    position: relative;
    .scroll {
        display: flex;
        p {
            word-break: keep-all; // 不换行
            white-space: nowrap;
            /* 设置前后间隔 */
            &.marquee {
                margin-right: 16px;
            }
        }
    }
    /* 仅为了获取宽度，故隐藏掉 */
    .getWidth {
        word-break: keep-all; // 不换行
        white-space: nowrap;
        position: absolute;
        opacity: 0;
        top: 0;
    }
}
</style>
