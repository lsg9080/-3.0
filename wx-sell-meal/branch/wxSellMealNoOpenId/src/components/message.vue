<template>
    <div>
        <!-- 全局提示框 -->
        <div v-show="visible && type == 1" class="dialog-tips dialog-center" style="padding:10px 15px;">
            <div><i :class="icon" style="margin-right:5px;"></i>{{ message }}</div>
        </div>

        <div v-show="visible && type == 2" class="dialog-tips dialog-center">
            <div><i :class="icon"></i>{{ message }}</div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            visible: false,
            message: '',
			type: 1,
			icon:'iconchenggong'
        }
    }
}
</script>
<style lang="less">
.dialog-tips {
    position: fixed;
    top: 50%;
    margin-top: -20px;
    bottom: inherit;
    left: 50%;
    box-sizing: border-box;
	max-width: 90%;
	height: auto;
    min-height: 40px;
    line-height: 20px;
    padding: 10px 15px 10px 11px;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    text-align: center;
    z-index: 9999;
    font-size: 16px;
    color: #fff;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.8);
    animation: show-toast 0.5s;
    -webkit-animation: show-toast 0.5s;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    div {
		// word-wrap: break-word;
		// white-space: normal;
        font-size: 16px;
        line-height: 20px;
        width: 100%;
        overflow: hidden;
        i {
            display: inline-block;
            vertical-align: top;
            font-size: 22px;
        }
    }
}
@-webkit-keyframes show-toast {
    from {
        opacity: 0;
        transform: translate(-50%, -10px);
        -webkit-transform: translate(-50%, -10px);
    }
    to {
        opacity: 1;
        transform: translate(-50%, 0);
        -webkit-transform: translate(-50%, 0);
    }
}
</style>