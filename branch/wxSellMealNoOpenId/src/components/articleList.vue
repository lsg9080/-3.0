<template>
    <div class="articleList">
        <ul>
            <li
                @click="goArticleDetails(item.id)"
                class="item"
                v-for="item in newActicleListArr"
                :key="item.id"
            >
                <div class="icon">
                    <img v-lazy="item.img" />
                </div>
                <div class="text">
                    <h2 :class="{on: item.isClicked == true}">{{ item.title }}</h2>
                    <p>{{ item.detail.replace(/<[^>]+>/g, '') }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
import storage from '../common/js/storage'
export default {
    name: 'articleList',
    props: {
        acticleListArr: Array
    },
    data() {
        return {
		
		}
	},
	computed: {
		newActicleListArr(){
            let isCheckedNewIds = storage.getObjItem('isCheckedNewIds')
			this.acticleListArr.forEach(item => {
                let findId = isCheckedNewIds.indexOf(item.id)
                if(findId != -1) item.isClicked = true
            })
            return this.acticleListArr;
		}
	},
    methods: {
        goArticleDetails(id) {
            let isCheckedNewIds = storage.getObjItem('isCheckedNewIds')
			let findId = isCheckedNewIds.indexOf(id)
			if(findId == -1){
                //this.newIdArr.push(id)
                isCheckedNewIds.push(id);
                storage.setObjItem('isCheckedNewIds',isCheckedNewIds)
			}

            this.$router.push({
                path: '/articleDetails',
                name: 'articleDetails',
                query: {
                    id: id,
                    from: 'article'
                }
            })
        }
    }
}
</script>

<style lang="less">
.articleList ul li.item {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    padding: 20px 18px 0 0;
    .icon {
        flex: 0 0 104px;
        width: 104px;
        padding-right: 18px;
        img {
            width: 104px;
            height: 74px;
            border-radius: 8px;
        }
    }
    .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 22px;
        font-size: 12px;
        color: #aaaaaa;
        overflow: hidden;
        h2 {
            width: 100%;
            font-size: 16px;
            color: #3a3a3a;
            padding-bottom: 3px;
            display: -webkit-box;
            overflow: hidden;
            white-space: normal !important;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			&.on{
				color: #868686;
			}
        }
        p {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
</style>