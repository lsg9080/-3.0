<template>
    <div class="cartcontrol">
        <transition name="move">
            <div
                class="cart-decrease"
                v-show="food.count > 0"
                @click.stop.prevent="decreaseCart"
            >
                <span class="inner decrease"></span>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count > 0">{{ food.count }}</div>
        <div class="cart-add add" @click.stop.prevent="addCart"></div>
    </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
export default {
    props: {
        food: {
            type: Object
        }
    },
    methods: {
        addCart(event) {
            // if (!event._constructed) {
            //     return
			// }
            if (!this.food.count) {
                this.food.count=1
                // Vue.set(this.food, 'count', 1)
            } else {
                this.food.count++
            }
            //给父组件data赋值
            // selectSetFoods
            // debugger
            this.$emit('add', event.target,this.food)
        },
        decreaseCart(event) {
            // if (!event._constructed) {
            //     return
            // }
            
            if (this.food.count) {
                this.food.count--
            }
            this.$emit('decrease', this.food)
        }
    }
}
</script>

<style lang="less">
.cartcontrol {
    font-size: 0;
    .cart-decrease {
        display: inline-block;
        opacity: 1;
        transform: translate3d(0, 0, 0);
        .inner {
            display: inline-block;
			margin: 7px 6px;
            color: #dbdbea;
            transition: all 0.4s linear;
            width: 24px;
            height: 24px;
            transform: rotate(0);
            &.decrease {
                background: url(../assets/meal/jian@2x.png) center center
                    no-repeat;
                background-size: 100% 100%;
            }
        }
        &.move-enter-active,
        &.move-leave-active {
            transition: all 0.4s linear;
        }
        &.move-enter,
        &.move-leave-active {
            opacity: 0;
            transform: translate3d(24px, 0, 0);
            .inner {
                transform: rotate(180deg);
            }
        }
    }
    .cart-count {
        display: inline-block;
        vertical-align: top;
        min-width: 12px;
        padding-top: 9px;
        line-height: 22px;
        text-align: center;
        font-size: 16px;
        color: #505050;
    }
    .cart-add {
        display: inline-block;
        color: #7574f5;
        width: 24px;
        height: 24px;
        margin: 7px 6px;
        &.add {
            background: url(../assets/meal/jia@2x.png) center center no-repeat;
            background-size: 100% 100%;
        }
    }
}
</style>