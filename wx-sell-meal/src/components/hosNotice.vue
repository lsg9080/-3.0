<template>
    <div class="article">
        <div class="delete" @click="goBack"><i class="cubeic-close"></i></div>
        <h5>{{ articleInfo.title }}</h5>
        <div v-html="articleInfo.detail"></div>
    </div>
</template>

<script type="text/ecmascript-6">
import storage from '../common/js/storage'
import { encryption, formatDate, formatReq } from '../common/js/util'
export default {
    name: 'hosNotice',
    data() {
        return {
            articleInfo: ''
        }
    },
    created() {
        this.GetNotice()
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        GetNotice() {
            //医院公告和登录无关
            var _this = this
            let url = this.api.GetNotice
            let parmas = {
                authCode: encryption('wx_wincome', 304),
                noticeType: 2 //1订餐须知  2 订餐公告
            }
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(res => {
                    console.log(res.data.data)
                    _this.articleInfo = res.data.data
                })
                .catch(function(error) {
                    console.log(error)
                })
        }
    }
}
</script>

<style lang="less" scope>
.article {
	h5{
		font-weight: bold;
		font-size: 20px;
		padding-bottom: 20px;
	}
    padding: 18px;
    font-size: 15px;
    color: #3a3a3a;
    line-height: 22px;
    position: relative;
    .delete {
        position: absolute;
        right: 18px;
        top: 10px;
        font-size: 24px;
    }
}
</style>