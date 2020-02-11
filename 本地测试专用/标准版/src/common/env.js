/**
 * 配置编译环境和线上环境之间的切换
 * 
 * homePage: 域名地址
 * wechatAppId: 微信公众号的AppId
 * authPageBaseUri: 微信oauth2授权的回调地址
 */

let homePage = '';
let wechatAppId = '';
let authPageBaseUri ='';

if (process.env.NODE_ENV == 'development') {
    homePage = `http://yydc.qiluhospital.com/login`
    wechatAppId = 'wx062045fbc13a9be1'
}
if (process.env.NODE_ENV == 'production') {
    homePage = `http://szsydc.wincome.group/login`
    wechatAppId = 'wxbb0d1ded52245c97'
}

authPageBaseUri = 'https://open.weixin.qq.com/connect/oauth2/authorize'

export {
    homePage,
    wechatAppId,
    authPageBaseUri
}