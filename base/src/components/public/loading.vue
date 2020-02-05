<template>
    <div>
        <div class="loading">
            <span></span>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {}
    },
    created() {}
}
</script>

<style scoped lang="less">
.loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 9999;
    span {
        margin: 70% auto;
        display: block;
        width: 3rem;
        height: 3rem;
        background-size: 100%;
        background-image: url('../../assets/loading.gif');
        background-repeat: no-repeat;
        background-position: center;
        position: relative;
        z-index: 99;
    }
}
</style>
