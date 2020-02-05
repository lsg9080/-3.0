<template>
    <div class="article">
        <!-- <div class="delete" @click="goBack"><i class="cubeic-close"></i></div> -->
        <!-- 了解你的饮食注意事项 -->
        <div v-if="from == 'mealNotice'" v-html="articleInfo"></div>
        <!-- 首页文章详情 -->
        <div v-else-if="from == 'article'">
            <h2>{{ articleInfo.ArticleTitle }}</h2>
            <p>来源：{{ articleInfo.ArticleSource }}</p>
            <hr />
            <div v-html="articleInfo.ArticleContent"></div>
        </div>
        <!-- 登录后订餐须知 -->
        <div v-else>
            <h2>入院营养订餐须知</h2>
            <div v-html="getMealsNoticeData.detail"></div>
            <div class="mealNoticeBtn" @click="mealNoticeBtn">知道了</div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import storage from '../common/js/storage'
import { encryption, formatDate, formatReq } from '../common/js/util'
export default {
    name: 'articleDetails',
    data() {
        return {
            articleId: '',
            articleInfo: '',
            from: '',
            getMealsNoticeData: '' //点餐须知
        }
    },
    created() {
        if (this.$route.query.from == 'mealNotice') {
            document.title = '饮食指导'
            this.articleInfo = this.$store.state.getNutritionEducation
        } else if (this.$route.query.from == 'article') {
            document.title = '文章'
            this.GetActriclDetails()
        } else {
			document.title = '订餐指南'
            this.GetMealsNotice()
        }
        this.getParams()
    },
    methods: {
        mealNoticeBtn() {
            let callbackUrl = storage.getItem('callbackUrl')
            if (callbackUrl) {
                storage.setItem('callbackUrl', '')
                this.$router.replace({
                    path: callbackUrl
                })
            } else {
                this.$router.replace({
                    path: '/',
                    name: 'index'
                })
            }
        },
        //订餐须知
        GetMealsNotice() {
            var _this = this
            let url = this.api.userApi.GetNotice
            let parmas = {
                authCode: encryption('wx_wincome', 304),
                noticeType: 1 //1订餐须知  2 订餐公告
            }
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(res => {
                    _this.getMealsNoticeData = res.data.data
                })
                .catch(function(error) {
                    console.log(error)
                })
        },
        goBack() {
            this.$router.go(-1)
        },
        getParams() {
            this.from = this.$route.query.from
            this.articleId = this.$route.query.id
        },
        GetActriclDetails() {
            var _this = this
            let url = this.api.userApi.GetActicleDetails
            let parmas = {
                authCode: encryption('wx_wincome', 305),
                articleID: this.$route.query.id
            }
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(res => {
                    console.log(res.data)
                    _this.articleInfo = res.data.data
                })
                .catch(function(error) {
                    console.log(error)
                })
        }
	},
	// beforeRouteLeave(to, from, next) {
    //   if (to.path == "/") {
    //     to.meta.keepAlive = true;
    //   } else {
    //     to.meta.keepAlive = false;
    //   }
    //   next();
    // }
}
</script>

<style lang="less" scope>
.mealNoticeBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #7574f5;
    border-radius: 27px;
    height: 46px;
    color: #fff;
    font-size: 16px;
	margin: 20px auto;
}
.article {
    h2 {
        font-weight: bold;
        font-size: 20px;
        line-height: 30px;
        padding: 15px 0;
    }
    padding: 18px;
    font-size: 16px;
    color: #3a3a3a;
    line-height: 22px;
    position: relative;
    .delete {
        position: absolute;
        right: 18px;
        top: 10px;
        font-size: 24px;
	}
	img{
		width: 100%;
	}
}
</style>