<template>
    <div class="retreatList">
        <dl class="checkboxGroup"> 
            <dt>
                <div>
					<input
						type="checkbox"
						class="input-checkbox"
						v-model="checked"
						v-on:click="checkedAll"
					/><span>{{retreatList.repastName}}</span>
				</div>
            </dt>
            <dd>
                <div
                    class="item"
                    v-for="checkb in retreatList.menuList"
                    :key="checkb.code"
                >
                    <!--给每个复选按钮绑定同一个v-mode数组变量，数组里面有相应的value就被选中-->
                    <div>
                        <input
                            type="checkbox"
                            name="checkboxinput"
                            class="input-checkbox"
                            v-model="checkboxList"
                            :value="checkb.code"
                        /><span class="txt">{{ checkb.name }}</span>
                    </div>
                    <div class="R">
                        <span>×{{ checkb.qty }}</span>
                        <span>¥{{ checkb.price }}</span>
                    </div>
                </div>
            </dd>
        </dl>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: 'checkboxAll',
    props:{
        retreatList:{
            type: Object
        }
    },
    data() {
        return {
            checkboxData: this.retreatList.menuList,
            checkboxList: [],
            checked: true,
            repastData: {
                repastId: this.retreatList.repastId,
                menuList: [
                    // {
                    //     kind: '1',
                    //     code: '3008',
                    //     qty: 1
                    //     price:10
                    // }
                ]
            },
            selectRepeastPriceData:{
                repastId: this.retreatList.repastId,
                price:0
            }
            //  repastList: [
            //         {
            //             repastId: 1,
            //             menuList: [
            //                 {
            //                     kind: '1',
            //                     code: '3008',
            //                     qty: 1
            //                 }
            //             ]
            //         }
            //     ]
        }
    },
    created(){
        this.checkboxData.forEach(item => {
            this.checkboxList.push(item.code)
            this.repastData.menuList.push({
                        kind: item.kind,
                        code: item.code,
                        qty: item.qty
                    });
            this.selectRepeastPriceData.price += item.qty * item.price
			//todo 传值
			this.$emit('selectPriceData', this.selectRepeastPriceData)
        })
    },
    methods: {
        checkedAll: function() {
            if (this.checked) {
                //实现反选
                this.checkboxList = []
                this.repastData.menuList = []
                this.selectRepeastPriceData.price = 0
            } else {
                //实现全选
                this.checkboxList = []
                this.repastData.menuList = []
                this.selectRepeastPriceData.price = 0
                this.checkboxData.forEach(item => {
                    this.checkboxList.push(item.code)
                    this.repastData.menuList.push({
                        kind: item.kind,
                        code: item.code,
                        qty: item.qty
                    });
                    this.selectRepeastPriceData.price += item.qty * item.price
                })
            }
			//todo 传值
			this.$emit('selectPriceData', this.selectRepeastPriceData)
        },
    },
    watch: {
        //深度 watcher
        checkboxList: {
            handler: function(val, oldVal) {
                if (this.checkboxList.length === this.checkboxData.length) {
                    this.checked = true
                } else {
                    this.checked = false
                }

                this.repastData.menuList=[]
                this.selectRepeastPriceData.price = 0
                for(let i=0;i<=this.checkboxList.length;i++){
                    let code =this.checkboxList[i]
                     // some 实现
                    let filterGoods = this.checkboxData.filter(n =>  
                        n.code == code);
                    if(filterGoods.length<=0)
                        continue

                    this.repastData.menuList.push({
                        kind: filterGoods[0].kind,
                        code: filterGoods[0].code,
                        qty: filterGoods[0].qty
                    });
                    this.selectRepeastPriceData.price += filterGoods[0].qty * filterGoods[0].price
                }
			//todo 传值
			this.$emit('selectPriceData', this.selectRepeastPriceData)
            },
            deep: true
        }
    }
}
</script>

<style lang="less">
.retreatList {
    // padding: 18px 0;
    .tag {
        span {
            background: #7574f5;
            border-radius: 11px;
            color: #fff;
            font-size: 14px;
            padding: 4px 8px;
            display: inline-block;
            margin-left: 18px;
        }
    }
    .orderBlock {
        border-radius: 4px;
        background: rgba(219, 219, 234, 0.3);
        padding: 10px 12px;
        font-size: 12px;
        color: #aaaaaa;
        margin: 12px;
        dl dt {
            display: flex;
            justify-content: space-between;
            line-height: 18px;
            &:first-child {
                padding-bottom: 4px;
            }
            .money {
                position: relative;
                top: 12px;
                font-family: Akrobat-ExtraBold;
                font-size: 18px;
                color: #ff8361;
            }
        }
    }
    .checkboxGroup {
        padding: 8px 18px 12px 12px;
        dt {
            font-size: 14px;
            color: #aaaaaa;
			height: 20px;
			margin-bottom: 4px;
            // display: flex;
			// align-items: center;
			div{
				height: 20px;
				line-height: 20px;
				input, span{
					display: inline-block;
					vertical-align: middle;
				}
			}
        }
        dd {
            padding: 0 0 0 30px;
            font-size: 16px;
            color: #505050;
            .item {
                height: 20px;
                display: flex;
                align-items: center;
                padding-top: 14px;
				justify-content: space-between;
				.txt {
                    display: inline-block;
                    vertical-align: top;
					margin-top: 3px;
					max-width: 80%;
                }
                .R {
                    font-size: 14px;
                    color: #aaaaaa;
                    width: 88px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
            }
        }
        input {
            margin-right: 10px;
        }
        input[type='checkbox'] {
            width: 20px;
            height: 20px;
            -webkit-appearance: none;
            background-color: transparent;
            border: 0;
            outline: 0 !important;
            color: #d8d8d8;
            position: relative;
        }
        input[type='checkbox']:before {
            content: '';
            display: block;
            width: 20px;
            height: 20px;
            background: url(../assets/account/sel@2x.png) no-repeat center
                center;
            background-size: 100% 100%;
            box-sizing: border-box;
            position: absolute;
            transform: scale(1);
            transition: all 0.1s;
        }
        input[type='checkbox']:checked:before {
            content: '';
            display: block;
            width: 20px;
            height: 20px;
            background: url(../assets/account/sel-on@2x.png) no-repeat
                center center;
            background-size: 100% 100%;
            box-sizing: border-box;
            position: absolute;
            transform: scale(1);
        }
    }
}
</style>