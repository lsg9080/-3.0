<template>
  <div class="login">
    <div class="loginTop">
      为了能为患者准确供餐，
      <br />需要绑定与校验患者的身份信息
    </div>
    <div class="loginForm">
      <ul>
        <li>
          <div class="tit">住院号</div>
          <input
            :disabled="inputDisabled"
            :class="{ pointEventNone: inputDisabled }"
            class="input"
            v-model.trim="loginModel.hosNumber"
            placeholder="请输入住院号"
          />
        </li>
        <li>
          <div class="tit">姓名</div>
          <!-- weixin -->
          <input
            :disabled="inputDisabled"
            :class="{ pointEventNone: inputDisabled }"
            class="input"
            v-model.trim="loginModel.username"
            placeholder="请输入姓名"
          />
        </li>
        <li class="cbInput">
          <div class="tit">手机号</div>
          <div class="rel">
            <input
              class="input"
              type="tel"
              v-model.trim="loginModel.phone"
              placeholder="请输入手机号"
              @focus="focusShow"
            />
            <i v-show="blurHidden" class="clear cubeic-wrong" @click="clearInput"></i>
          </div>
          <div class="rel">
            <input class="input" type="tel" v-model="loginModel.messageCode" placeholder="请输入验证码" />
            <button :disabled="disabled" class="codeFn" @click="codeFn">{{ codeText }}</button>
          </div>
        </li>
      </ul>
      <div class="loginSubmit" @click.self="loginSubmit">绑定</div>
    </div>
    <!-- 住院信息未查到 -->
    <div class="dialog-tips-special" v-show="visible">
      <div class="header">
        <i class="iconjinggao"></i>住院信息未查到
      </div>
      <div class="content">
        <p>可能原因：</p>
        <p>1、住院号或姓名输入错误，请检查</p>
        <p>2、住院信息还未更新过来，请稍候再试！</p>
      </div>
    </div>
    <!-- 验证码错误 -->
    <div class="dialog-tips-special" v-show="visible2">
      <div class="header header2">
        <i class="iconjinggao"></i>验证码错误
      </div>
      <div class="content content2">请输入为【01】的验证码</div>
    </div>
    <!-- 提示框end -->
  </div>
</template>

<script>
import store from "../store";
import storage from "../common/js/storage";
import {
  encryption,
  formatDate,
  formatReq,
  extractQueryParams,
  defaultParam,
  urlParse
} from "../common/js/util";
export default {
  name: "login",
  components: {},
  data() {
    return {
      getMealsNoticeData: "", //点餐须知
      inputDisabled: false, //不可输入
      showLogin: true,
      countDown: "60",
      loginModel: {
        hosNumber: "",
        username: "",
        phone: "",
        messageCode: ""
      },
      blurHidden: false,
      visible: false, //住院信息未查到
      visible2: false //验证码核验
    };
  },
  created() {
    this.inputDisabled = false;
    // this.GetOpenid();
    //调式 todo 2
    if (storage.getItem("patNo") && storage.getItem("patName")) {
      this.loginModel.hosNumber = storage.getItem("patNo");
      this.loginModel.username = storage.getItem("patName");
      storage.removeItem("patNo");
      storage.removeItem("patName");
      this.inputDisabled = true;
    }
    this.GetMealsNotice();
  },
  computed: {
    codeText() {
      if (this.countDown < 60) {
        return `${this.countDown}秒后重新获取`;
      } else {
        return "获取验证码";
      }
    },
    disabled() {
      return this.countDown != 60;
    }
  },
  methods: {
    //订餐须知
    GetMealsNotice() {
      var _this = this;
      let url = this.api.GetNotice;
      let parmas = {
        authCode: encryption("wx_wincome", 304),
        noticeType: 1 //1订餐须知  2 订餐公告
      };
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(res => {
          // console.log('订餐须知'+res.data.data.title)
          _this.getMealsNoticeData = res.data.data.title;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    loginSubmit() {
      // this.$myToast.success('绑定成功')
      // this.$myToast.error('住院号不能为空')
      // 不同提示消息
      // this.visible = true
      // setTimeout(() => {
      //     this.visible = false
      // }, 2000)
      if (!this.loginModel.hosNumber) {
        this.$myToast.error("住院号不能为空");
        return false;
      } else if (!this.loginModel.username) {
        this.$myToast.error("姓名不能为空");
        return false;
      } else if (!this.loginModel.phone) {
        this.$myToast.error("手机号不能为空");
        return false;
      } else if (!this.loginModel.messageCode) {
        this.$myToast.error("验证码不能为空");
        return false;
      }
      var _this = this;
      let url = this.api.BindingPatient;
      let openid = storage.getItem("YKOpenId");
      let authCode = encryption(openid, 101);
      let callTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      let parmas = {
        authCode: authCode,
        terminalNo: openid,
        callFrom: "yk_wx_brc",
        callTime: callTime,
        hospitalId: 0,
        patNo: this.loginModel.hosNumber,
        patName: this.loginModel.username,
        mobile: this.loginModel.phone,
        smsCode: this.loginModel.messageCode
      };
      // console.log('提交参数--' + JSON.stringify(parmas))
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(resp => {
          if (resp.data.code == 0) {
            this.$myToast.success("绑定成功");
            storage.setItem("userStatus", true);
            storage.setObjItem("mycar1", []);
            storage.setObjItem("mycar2", []);
            _this.$store.commit("changeIsLogin", true);
            setTimeout(() => {
              if (!_this.getMealsNoticeData) {
                let callbackUrl = storage.getItem("callbackUrl");
                if (callbackUrl) {
                  storage.setItem("callbackUrl", "");
                  _this.$router.replace({
                    path: callbackUrl
                  });
                } else {
                  _this.$router.replace({
                    path: "/",
                    name: "index"
                  });
                }
              } else {
                this.$router.replace({
                  path: "/articleDetails",
                  name: "articleDetails",
                  query: {
                    from: "loginMealNotice"
                  }
                });
              }
            }, 1000);
          } else if (resp.data.code == 2) {
            // 未找到病人信息
            this.visible = true;
            setTimeout(() => {
              this.visible = false;
            }, 1000);
          } else {
            // 失败验证码不正确
            _this.toast = _this.$createToast({
              txt: "！" + resp.data.msg,
              type: "txt"
            });
            _this.toast.show();
            // this.$myToast.error(resp.data.msg)
            // this.visible2 = true
            // setTimeout(() => {
            //     this.visible2 = false
            // }, 2000)
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    clearInput() {
      if (this.loginModel.phone) {
        this.loginModel.phone = "";
        this.loginModel.messageCode = "";
      }
    },
    // //@blur.prevent="blurHiddens"
    // blurHiddens() {
    //     this.blurHidden = false
    // },
    focusShow() {
      this.blurHidden = true;
    },
    codeFn() {
      if (!this.loginModel.phone) {
        this.$myToast.error("手机号不能为空");
        return;
      }
      //校验手机号格式
      if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.loginModel.phone)) {
        this.$myToast.error("手机号格式不正确");
        return;
      }
      var _this = this;
      let url = this.api.GetSmsCode;
      let openid = storage.getItem("YKOpenId");
      let authCode = encryption(openid, 110);
      let callTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      console.log(`参数值--${callTime}=====${authCode}`);
      let parmas = {
        authCode: authCode,
        terminalNo: openid,
        callFrom: "yk_wx_brc",
        callTime: callTime,
        mobile: this.loginModel.phone
      };
      console.log(parmas);
      _this.$ajax
        .post(url, _this.qs.stringify(parmas))
        .then(resp => {
          if (resp.data.code == 0) {
            this.$myToast.success(resp.data.msg);
            let t = window.setInterval(() => {
              if (this.countDown == 0) {
                window.clearInterval(t);
                this.countDown = 60;
              } else {
                this.countDown--;
              }
            }, 1000);
          } else {
            this.$myToast.error(resp.data.msg);
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    GetOpenid() {
      let openid = storage.getItem("YKOpenId");
      if (!openid) {
        var queryParams = extractQueryParams(window.location.href);
        var _this = this;
        let authCode = encryption("wincome", 230);
        let callTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
        let url = this.api.GetOpenid;
        let parmas = {
          authCode: authCode,
          code: queryParams.code,
          pageURL: "/login"
        };
        _this.$ajax
          .post(url, _this.qs.stringify(parmas))
          .then(res => {
            storage.setItem("YKOpenId", res.data.openid);
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
input::placeholder,
textarea::placeholder {
  color: #aaaaaa;
  font-size: 14px;
}

.rel {
  position: relative;
}

.cube-toast-tip {
  color: #fff;
  font-size: 16px;
}

.loginTop {
  height: 110px;
  background: url(../assets/images/account@2x.png);
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  font-size: 17px;
  color: #fff;
  padding-left: 18px;
  line-height: 24px;
}

.loginForm {
  padding: 0 24px;

  ul li {
    padding: 36px 0 6px;

    .tit {
      font-size: 16px;
      color: #505050;
    }

    .input {
      width: 100%;
      display: block;
      font-size: 20px;
      color: #3a3a3a;
      border-bottom: 1px solid #d8d8e4;
      margin-top: 14px;
      padding-bottom: 2px;
      outline: none;

      &.pointEventNone {
        pointer-events: none;
        background: none;
      }
    }

    .clear {
      position: absolute;
      color: #999;
      right: 10px;
      bottom: 6px;
      font-size: 18px;
    }

    .codeFn {
      position: absolute;
      right: 10px;
      top: 0;
      background: none;
      border: none;
      font-size: 14px;
      color: #7574f5;

      &::before {
        content: "";
        position: absolute;
        left: -12px;
        top: 4px;
        background: #dde5ed;
        width: 1px;
        height: 14px;
      }
    }
  }

  .loginSubmit {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #7574f5;
    border-radius: 27px;
    height: 46px;
    color: #fff;
    font-size: 16px;
    margin-top: 70px;
  }
}

.dialog-tips-special {
  position: fixed;
  top: 50%;
  margin-top: -70px;
  bottom: inherit;
  left: 50%;
  box-sizing: border-box;
  max-width: 81%;
  line-height: 20px;
  padding: 10px 15px 10px 11px;
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  text-align: center;
  z-index: 9999;
  font-size: 16px;
  color: #fff;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.8);
  animation: show-toast 0.5s;
  -webkit-animation: show-toast 0.5s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .header {
    padding-top: 12px;
    font-size: 16px;
    line-height: 20px;
    width: 100%;
    overflow: hidden;

    i {
      display: inline-block;
      vertical-align: top;
      font-size: 20px;
    }
  }

  .content {
    &.content2 {
      padding: 6px 17px 10px 15px;
    }

    padding: 16px 17px 10px 15px;

    p {
      line-height: 21px;
      text-align: left;
      font-size: 14px;
    }
  }
}

@-webkit-keyframes show-toast {
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
    -webkit-transform: translate(-50%, -10px);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
  }
}
</style>
