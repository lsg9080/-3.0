export default {
    changeLoadingType(state, status) {
        state.showLoading = status
    },
    changepayWayShow(state, status) {
        state.payWayShow = status
    },
    changeresultsShow(state, status) {
        state.resultsShow = status
    },
    ChangeFoldNotice(state, status) {
        state.fold = status
    },
    changeIsLogin(state, status) {
        state.isLogin = status
    },
    setAnalysis(state, status) {
        state.getAnalysisData = status
        sessionStorage.setItem('getAnalysisData', JSON.stringify(state.getAnalysisData))
        sessionStorage.getItem('getAnalysisData')
    },
    indexNutritionEducation(state, status) {
        state.getNutritionEducation = status
    },
    settingSwitch(state, status) {
        state.setting = status
    },
}