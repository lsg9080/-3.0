<template>
    <div id="app">
        <!-- <router-view /> -->
        <loading v-if="showLoading"></loading>
        <!-- //这里需要缓存，使用keep-alive标签包裹 -->
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <!-- //这里不需要缓存 -->
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
import store from './store'
import loading from '@/components/public/loading'
export default {
    name: 'app',
    components: {
        loading
    },
    computed: {
        showLoading() {
            return this.$store.state.showLoading
        }
    }
}
</script>

<style>
#app{
	background-color: #ffffff;
}
</style>
