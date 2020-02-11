<!--菜肴评价-->
<template>
    <div class="mealRadio">
        <span :class="['zan', isChecked ? 'on' : '']" @click="zan"></span>
        <span :class="['cai', isChecked2 ? 'on' : '']" @click="cai"></span>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    props: {
        meal: {
            type: Object
        }
    },
    data() {
        return {
            isChecked: false,
            isChecked2: false
        }
    },
    methods: {
        zan(event) {
            this.isChecked = true
            this.isChecked2 = false
            this.meal.score = 1
            this.$emit('mealScore', this.meal)
        },
        cai(event) {
            this.isChecked = false
            this.isChecked2 = true
            this.meal.score = -1
            this.$emit('mealScore', this.meal)
        }
    }
}
</script>

<style lang="less">
.mealRadio {
    span {
        display: inline-block;
        width: 19px;
        height: 18px;
        margin-left: 40px;
        &.zan {
            background: url(../assets/account/zan1@2x.png) center center
                no-repeat;
            background-size: 100% 100%;
            &.on {
                background: url(../assets/account/zan2@2x.png) center center
                    no-repeat;
                background-size: 100% 100%;
            }
        }
        &.cai {
            background: url(../assets/account/cai1@2x.png) center center
                no-repeat;
            background-size: 100% 100%;
            &.on {
                background: url(../assets/account/cai2@2x.png) center center
                    no-repeat;
                background-size: 100% 100%;
            }
        }
    }
}
</style>