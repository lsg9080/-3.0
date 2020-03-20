import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex);

const state = {
    fold: false,
    showLoading: false,
    payWayShow: false,
    resultsShow: false,
    isLogin: false,
    car: [],
    getAnalysisData: JSON.parse(sessionStorage.getItem('getAnalysisData')) || {}, //全天营养素分析结果
    getNutritionEducation: '了解你的饮食注意事项',
    setting: []
};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
})