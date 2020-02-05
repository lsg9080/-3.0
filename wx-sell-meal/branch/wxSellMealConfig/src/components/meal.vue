<!--单点模式-->
<template>
    <cube-scroll-nav
        ref="foodsWrapper"
        :side="true"
        :data="menuList.repastDataList"
        :current="currentFood"
        @change="changeHandler"
        @sticky-change="stickyChangeHandler"
    >
        <cube-scroll-nav-panel
            v-for="item in menuList.repastDataList"
            :key="item.menuTypeName"
            :label="item.menuTypeName"
            :title="item.menuTypeName"
        >
            <ul class="foodsWrapper">
                <li class="food-item" v-for="food in item.menuList">
                    <div class="foodContent">
                        <div class="icon" @click="selectFood(food, $event)">
                            <img width="80" height="80" :src="food.picUrl" />
                        </div>
                        <div class="content">
                            <h2 class="name" @click="selectFood(food, $event)">
                                {{ food.name }}
                            </h2>
                            <p v-if="food.tabooTips" class="desc">
                                {{ food.tabooTips }}
                            </p>
                            <div class="price">￥{{ food.price }}</div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol
                                    @add="addFood"
                                    :food="food"
                                ></cartcontrol>
                            </div>
                        </div>
                    </div>
                    <div class="foodNutrient">
                        <div>能量：{{ food.Nutrients.能量 }}kcl</div>
                        <div>蛋白质：{{ food.Nutrients.蛋白质 }}g</div>
                        <div class="more" @click="selectFood(food, $event)">
                            了解更多<i class="iconright"></i>
                        </div>
                    </div>
                </li>
            </ul>
        </cube-scroll-nav-panel>
    </cube-scroll-nav>
</template>

<script type="text/ecmascript-6">
import cartcontrol from './cartcontrol'
export default {
    components: {
        cartcontrol
    },
    props: {
        menuList: {
            type: Object
        }
    },
    data() {
        return {
            currentFood: '' //单点当前导航 active 项的 key 值
        }
	},
	created(){
		this.$refs.foodsWrapper.refresh()
	},
    methods: {
        addFood(target) {
            this._drop(target)
        },
        changeHandler(label) {
            console.log('changed to:', label)
        },
        stickyChangeHandler(current) {
            console.log('sticky-change', current)
        }
    },
    created() {}
}
</script>

<style lang="less">
</style>