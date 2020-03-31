/**
 * 配置编译环境和线上环境之间的切换
 * 
 * homePage: 域名地址
 * wechatAppId: 微信公众号的AppId
 * authPageBaseUri: 微信oauth2授权的回调地址
 */

let homePage = '';
let wechatAppId = '';
let authPageBaseUri = '';
let webApi = '';
let SApi = ''
let PApi = ''

// 公司测试地址
if (process.env.NODE_ENV == 'development') {
    homePage = `http://weixin.wincome.group/`
    wechatAppId = 'wx99fcb86f4cb3700a'
    webApi = 'http://demobrc.wincome.group/patientOrderingNew.api' //微信相关
    SApi = 'http://demobrc.wincome.group/WeChatAPI_New' //外网
    PApi = 'http://192.172.1.50:5003'
        // PApi = 'http://wincome.f3322.net:5003'
}
if (process.env.NODE_ENV == 'production') {
    homePage = `http://weixin.wincome.group/`
    wechatAppId = 'wx99fcb86f4cb3700a'
    webApi = 'http://demobrc.wincome.group/patientOrderingNew.api' //微信相关
    SApi = 'http://demobrc.wincome.group/WeChatAPI_New' //外网
    PApi = 'http://192.172.1.50:5003'
}

// 医院正式地址
// if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'production') {
//     homePage = `http://patientservice.huashan.org.cn/`
//     wechatAppId = 'wx69c8ecd451e5dea4'
//     webApi = homePage + 'patientOrdering.api' //微信相关
//     SApi = homePage + 'WeChatAPI' //外网
//     PApi = homePage + 'PatientNew'
// }


authPageBaseUri = 'https://open.weixin.qq.com/connect/oauth2/authorize'

export {
    homePage,
    wechatAppId,
    authPageBaseUri,
    webApi,
    SApi,
    PApi
}