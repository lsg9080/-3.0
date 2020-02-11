<template>
    <div class="evaluate">
        <div class="evaluateTop">
            <ul>
				<!-- 去评价 -->
                <template v-if="$route.query.from == 1">
					<li
						v-for="itemaName in reEvaluationItemList"
						:key="itemaName.id"
					>
						<div class="tit">{{ itemaName.name }}</div>
						<star :itemaName="itemaName" @score="getScore"></star>
					</li>
				</template>
				<!-- 查看评价内容 -->
				<template v-if="$route.query.from == 2">
					<li
						v-for="item in newEvaluationItemList"
						:key="item.id"
					>
						<div class="tit">{{ item.name }}</div>
						<div class="rate">
							<div class="StarsWrap">
								<div class="li" v-for="(star,index) in 5" :key="star">
                                     <i
                                        v-if="item.score <= 2"
                                        :class="[item.score > index ? 'on1' : '', 'iconstar']"
                                    />
                                    <i
                                        v-else-if="item.score == 3"
                                        :class="[item.score > index ? 'on2' : '', 'iconstar']"
                                    />
                                    <i
                                        v-else-if="item.score > 3"
                                        :class="[item.score > index ? 'on3' : '', 'iconstar']"
                                    />
									<!-- <i class="iconstar"></i> -->
								</div>
							</div>
							<div class="comment">{{ rateScoreText[item.score-1] }}</div>
						</div>
					</li>
				</template>
            </ul>
        </div>
        <div class="evaluateMeal">
            <div class="tit">此次菜肴好与不好，请您留下建议</div>
            <ul>
				<template v-if="$route.query.from == 1">
					<li
						v-for="(item, index) in getOrderDetailRepastList"
						:key="index"
					>
						<div class="title">{{ item.repastName }}</div>
						<div
							class="mealItem"
							v-for="(meal, mealIndex) in item.menuList"
							:key="mealIndex"
						>
							<div>{{ meal.name }}</div>
							<div class="mealP">
								<meal-radio
									:meal="meal"
									@mealScore="mealScore"
								></meal-radio>
							</div>
						</div>
					</li>
				</template>
				<template v-else>
					<li
						v-for="(item, index) in newGetOrderDetailRepastList"
						:key="index"
					>
						<div class="title">{{ item.repastName }}</div>
						<div
							class="mealItem"
							v-for="(meal, mealIndex) in item.menuList"
							:key="mealIndex"
						>
							<div>{{ meal.name }}</div>
							<div class="mealP">
								<div class="mealRadio" v-if="meal.score==1">
                                    <span class="zan on"></span>
                                    <span class="cai"></span>
								</div>
                                <div class="mealRadio" v-else-if="meal.score==-1">
                                    <span class="zan"></span>
                                    <span class="cai on"></span>
								</div>
                                <div class="mealRadio" v-else>
                                    <span class="zan"></span>
                                    <span class="cai"></span>
								</div>
							</div>
						</div>
					</li>
				</template>
            </ul>
        </div>
        <div class="textarea" :class="textareaClass">
            <textarea
				:readonly="readonly"
                maxlength="200"
                v-model="textareaValue"
                placeholder="请填写您的评价"
            ></textarea>
        </div>
        <div v-show="$route.query.from == 1">
            <template v-if="starScoreArr.length < 4">
                <div class="submit noSubmit">提交评价</div>
            </template>
            <template v-else>
                <div class="submit" @click="submitEvaluate">提交评价</div>
            </template>
        </div>
		<div v-show="$route.query.from == 2">
			<div class="submit" @click="goBack">返回</div>
		</div>
    </div>
</template>

<script type="text/ecmascript-6">
import { defaultParam } from '../common/js/util'
import star from './star'
import mealRadio from './mealRadio'
export default {
    name: 'evaluate',
    data() {
        return {
            orderId: 1, //订单id
            from: 1, //评价来源
            getOrderDetail: [], //订餐明细
            getOrderDetailRepastList: [], //订餐明细列表
            newGetOrderDetailRepastList:[],
            menuList:[],
            textareaValue: '', //评价文本框
            selectMenuListArr: [], //接收菜肴评分
            newEvaluationItemList:[],
            rateScoreText: ['很差', '一般', '满意', '非常满意', '无可挑剔'],
            evaluationItemList: [
                // { id: 1, name: '治疗效果', score: 1 },
                // { id: 2, name: '膳食质量', score: 2 },
                // { id: 3, name: '配送时间', score: 3 },
                // { id: 4, name: '服务态度', score: 4 }
            ],
            starScoreArr: [], //定义新数组接收星评分数
			lookOrderEvaluation: {}, //查看评价内容
			readonly: false,  //禁用不可编辑
			isChecked: false,
			isChecked2: false
        }
    },
    computed: {
        reEvaluationItemList() {
            this.evaluationItemList.forEach(item => {
                    this.$set(item, 'score', 0)
            })
            return this.evaluationItemList
		},
		textareaClass(){
			if(this.$route.query.from == 2 && !this.textareaValue){
				return 'dn'
			}else{
				return ''
			}
		},
		titClass(){
			if(this.$route.query.from == 2){
				return 'dn'
			}else{
				return ''
			}
		},
		//查看星星评价
		lookStarEvaluation(){
			return this.lookOrderEvaluation.evaluationList
		}
    },
    created() {
		// textarea.value = textarea.value.slice(0,101)  //控制100字
		this.getParams() //获取参数
		
        if (this.$route.query.from == 1) {
            this.GetOrderDetail()  //获取订餐明细
            this.GetOrderEvaluationItemList() //获取评价项目列表
        }else if (this.$route.query.from == 2) {
            document.title = '查看评价'
			this.GetOrderEvaluation() //查看评价内容
			this.readonly = true
        }
    },
    methods: {
		goBack(){
			this.$router.go(-1)
		},
        //获取评价的来源  1:去评价  2:查看评价
        getParams() {
            const orderId = this.$route.query.orderId
            const from = this.$route.query.from
            this.orderId = orderId
            this.from = from
            if (from == 1) {
            }
        },
        // 获取星评评价项目列表
        GetOrderEvaluationItemList() {
            var _this = this
            let url = this.api.GetOrderEvaluationItemList
            let parmas = defaultParam('', 148)
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(resp => {
                    if (resp.data.code == 0) {
                        if(_this.from == 2){
                            for(let i=0;i<resp.data.data.length;i++){
                                let evalData =  _this.lookOrderEvaluation.evaluationList.filter(n =>  
                                    n.id == resp.data.data[i].id);
                                if(evalData.length>0){
                                    let newEval={
                                        id:resp.data.data[i].id,
                                        name:resp.data.data[i].name,
                                        score:evalData[0].score
                                    }
                                    _this.newEvaluationItemList.push(newEval)    
                                }
                            }
                            // console.log({'_this.newEvaluationItemList':_this.newEvaluationItemList})

                        }else{
                            _this.evaluationItemList = resp.data.data       
                        }
                    } else {
                        this.$myToast.error(resp.data.msg)
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
        },
        //获取订餐明细
        GetOrderDetail() {
            var _this = this
            let url = this.api.GetOrderDetail
            let addParmas = {
                orderId: _this.orderId, //订单Id
                mergeMenu: 0 //是否合并菜肴  1:合并   0:不合并
            }
            let dParam = defaultParam('', 109)
            let parmas = Object.assign({}, dParam, addParmas)
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(resp => {
                    if (resp.data.code == 0) {
                        let newOrderDetail = resp.data.data
                        newOrderDetail.repastList.forEach(repastList => {
                            repastList.menuList.forEach(item => {
                                this.$set(item, 'repastId', repastList.repastId)
                                    let menuData =  _this.menuList.filter(n =>  
                                    n.repastId == repastList.repastId
                                    && n.code==item.code);
                                let score = 0 
                                if(menuData.length>0){
                                    score=menuData[0].score
                                }                                    
                                //find food score
                                this.$set(item, 'score', score)
                            })
                        })

                        _this.getOrderDetail.push(newOrderDetail)

                        if(_this.from == 1){
                            _this.getOrderDetailRepastList = _this.getOrderDetail[0].repastList
                        }else{
                            _this.newGetOrderDetailRepastList = _this.getOrderDetail[0].repastList
                            console.log({'_this.newGetOrderDetailRepastList':_this.newGetOrderDetailRepastList})
                        }
                    } else {
                        this.$myToast.error(resp.data.msg)
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
		},
		//获取订单评价内容
        GetOrderEvaluation() {
            var _this = this
            let url = this.api.GetOrderEvaluation
            let addParmas = { orderId: _this.$route.query.orderId } //订单Id
            let dParam = defaultParam('', 149)
			let parmas = Object.assign({}, dParam, addParmas)
			// debugger
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(resp => {
                    if (resp.data.code == 0) {
						console.log(resp.data.data)
                        // debugger
                        _this.lookOrderEvaluation = resp.data.data
                        _this.menuList=resp.data.data.menuList
                        _this.textareaValue = resp.data.data.content
                        // debugger
                        _this.GetOrderDetail()  //获取订餐明细
                        _this.GetOrderEvaluationItemList() //获取评价项目列表
                    } else {
                        this.$myToast.error(resp.data.msg)
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
        },
        //获取星星分数
        getScore(data) {
            console.log('星星分数:' + JSON.stringify(data))
            let _this = this
            let selectItems = _this.starScoreArr.filter(n => n.id == data.id)
            if (selectItems.length <= 0) {
                _this.starScoreArr.push({
                    id: data.id,
                    score: data.score
                })
                return
            } else {
                selectItems[0].score = data.score
            }
        },
        //菜肴分数
        mealScore(data) {
            // debugger
            console.log('菜肴分数:' + JSON.stringify(data))
            let _this = this
            let selectMeals = _this.selectMenuListArr.filter(
                n => n.repastId == data.repastId && n.code == data.code
            )
            if (selectMeals.length <= 0) {
                _this.selectMenuListArr.push({
                    repastId: data.repastId,
                    kind: data.kind,
                    code: data.code,
                    score: data.score,
                    content: ''
                })
                return
            } else {
                selectMeals[0].score = data.score
            }
        },
        //提交
        submitEvaluate() {
            var _this = this
            let url = this.api.OrderEvaluation
            let addParmas = {
                orderId: _this.$route.query.orderId,
                content: _this.textareaValue,
                evaluationList: _this.starScoreArr,
                menuList: _this.selectMenuListArr
            }
            let dParam = defaultParam('', 147)
            let parmas = Object.assign({}, dParam, addParmas)
            console.log('提交评价参数：'+JSON.stringify(parmas))
            // debugger
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(resp => {
                    // debugger
                    if (resp.data.code == 0) {
                        _this.$myToast.success('评价成功')
                        _this.$router.go(-1)
                    } else {
                        this.$myToast.error(resp.data.msg)
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
        }
    },
    components: {
        star,
        mealRadio
    }
}
</script>

<style lang="less">
@import '../common/less/mixin';
input::placeholder,
textarea::placeholder {
	-webkit-text-size-adjust: none;
    color: #aaaaaa;
    font-size: 14px;
    font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial,
        sans-serif, 'Droid Sans Fallback';
}
.evaluate {
	background: #ffffff;
    .evaluateTop {
        border-bottom: 10px solid #f6f6f6;
        padding: 33px 18px 14px;
        ul li {
            display: flex;
            align-items: center;
            height: 24px;
            overflow: hidden;
            margin-bottom: 14px;
            .tit {
                font-size: 16px;
                color: #505050;
                padding-right: 30px;
            }
        }
    }
    .evaluateMeal {
        padding: 24px 40px 24px 18px;
        .tit {
            font-size: 18px;
            color: #505050;
        }
        ul li {
            .title {
                font-size: 14px;
                color: #aaaaaa;
                padding-top: 21px;
            }
            .mealItem {
                display: flex;
                justify-content: space-between;
                font-size: 16px;
                color: #505050;
                margin-top: 14px;
                height: 18px;
            }
        }
    }
    .textarea {
        padding: 8px 18px 0;
        textarea {
            border: 1px solid #dbdbea;
            border-radius: 4px;
            width: 100%;
            outline: none;
            padding: 10px;
            box-sizing: border-box;
            height: 120px;
            font-size: 16px;
            color: #505050;
        }
    }
}
.submit {
    margin: 36px 18px;
    .submitBtn();
    &.noSubmit {
        background: #dbdbea;
    }
}
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
.rate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
}
.comment {
    font-size: 14px;
    color: #aaaaaa;
    padding-left: 11px;
    &.on1 {
        color: #ffd149;
    }
    &.on2 {
        color: #ff8361;
    }
}
.StarsWrap {
    overflow: hidden;
    .li {
        float: left;
        margin: 0;
        margin-right: 11px;
        i {
            display: block;
            font-size: 24px;
            color: #ededed;
            &.on1 {
                color: #aaaaaa;
            }
            &.on2 {
                color: #ffd149;
            }
            &.on3 {
                color: #ff8361;
            }
        }
    }
}
</style>