/**
 * 配置编译环境和线上环境之间的切换
 * 
 * homePage: 域名地址
 * wechatAppId: 微信公众号的AppId
 * authPageBaseUri: 微信oauth2授权的回调地址
 * 
 * 接口地址：
 * webApi 、SApi 、PApi
 */

let homePage = '';
let wechatAppId = '';
let authPageBaseUri = '';
let webApi = '';
let SApi = '';
let PApi = '';

if (process.env.NODE_ENV == 'development') {
    homePage = `http://weixin.wincome.group/login`
    wechatAppId = 'wx99fcb86f4cb3700a'
    
    webApi = 'http://demobrc.wincome.group'   //微信相关;//测试
    SApi = 'http://demobrc.wincome.group/WeChatAPI_New'//外网;//测试
    PApi = 'http://192.172.1.50:5003';//内网测试
    // const PApi = 'http://wincome.f3322.net:5003';//外网测试
}
if (process.env.NODE_ENV == 'production') {
    homePage = `域名/login`
    wechatAppId = 'wxbb0d1ded52245c97'

    webApi = '域名'   //微信相关
    SApi = '域名/WeChatAPI'//外网
    PApi = '域名/PatientNew';
}

authPageBaseUri = 'https://open.weixin.qq.com/connect/oauth2/authorize'

export {
    homePage,
    wechatAppId,
    authPageBaseUri,
    webApi,
    SApi,
    PApi
}