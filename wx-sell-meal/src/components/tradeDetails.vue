<template>
    <div class="tradeList">
        <ul>
            <li v-for="(item, index) in tradeList" :key="index">
                <div class="txt">
                    <div>{{ item.dataFromName }}</div>
                    <div v-if="item.dataType == 1" class="txtR income">
                        {{ item.amount_str }}
                    </div>
                    <div v-else class="txtR">
                        {{ item.amount_str }}
                    </div>
                </div>
                <div class="date">{{ item.createTime }}</div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
import storage from '../common/js/storage'
import { encryption, formatDate, formatReq } from '../common/js/util'
export default {
    name: 'tradeDetails',
    data() {
        return {
            income: true,
            tradeList: []
        }
    },
    computed: {
        accountClass(type) {
            if (type == 1) {
                return 'income'
            } else {
                return ''
            }
        }
    },
    created() {
        this.GetAccountDetailList()
    },
    methods: {
        GetAccountDetailList() {
            var _this = this
            let url = this.api.userApi.GetAccountDetailList
            let openid = storage.getItem('openId')
            let authCode = encryption(openid, 145)
            let callTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
            let parmas = {
                authCode: authCode,
                terminalNo: openid,
                callFrom: 'yk_wx_brc',
                callTime: callTime,
                startDate: '',
                endDate: '',
                dataType: 0 //0:全部(默认),1:充值数据,2:消费数据
            }
            console.log('提交参数--' + JSON.stringify(parmas))
            _this.$ajax
                .post(url, _this.qs.stringify(parmas))
                .then(resp => {
                    if (resp.data.code == 0) {
                        console.log(resp.data)
                        _this.tradeList = resp.data.data
                    } else {
                        _this.$myToast.error(resp.data.msg)
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
        }
    }
}
</script>

<style lang="less">
@import '../common/less/mixin';
@font-face {
    font-family: Akrobat-ExtraBold;
    src: url('../assets/Akrobatextrabold.woff.ttf');
}
.tradeList {
    ul {
        padding-left: 24px;
    }
    ul li {
        .border-bottom();
        padding: 24px 24px 20px 0;
        .txt {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            color: #505050;
            .txtR {
                font-family: Akrobat-ExtraBold;
                font-size: 22px;
                color: #fcb557;
                &.income {
                    color: #55cb7f;
                }
            }
        }
        .date {
            font-size: 12px;
            color: #aaaaaa;
        }
    }
}
</style>