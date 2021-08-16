<template>
  <div class="login">
    <div class="top">
      <van-nav-bar left-text="返回" right-text="先逛一逛" left-arrow>
        <template #left>
          <div class="img">
            <img src="../assets/images/kafei.png" alt="" />
          </div>
          <div class="text">Cool Drink</div>
        </template>
      </van-nav-bar>
    </div>
    <div class="text-box">
      <div class="chinese">欢迎回来!</div>
      <div class="english">Please login to your accounts</div>
    </div>
    <div class="phone-pass">
      <van-form>
        <van-field
          name="手机号码"
          label="手机号码"
          placeholder="手机号码"
          v-model="userphone.phone"
          type="digit"
        />
        <van-field
          style="margintop: 10px"
          :type="bool ? 'password' : 'text'"
          name="密码"
          label="密码"
          placeholder="密码"
          v-model="userphone.password"
          :right-icon="bool ? 'closed-eye' : 'eye-o'"
          @click-right-icon="righticon"
        />

        <div style="margin: 16px">
          <van-button round block type="warning" @click="login"
            >登录</van-button
          >
          <van-button
            round
            block
            type="warning"
            style="marginTop: 20px"
            @click="zhuce"
            >注册</van-button
          >
        </div>
      </van-form>
    </div>
    <van-popup
      v-model="show"
      closeable
      close-icon="close"
      position="bottom"
      :style="{ height: '40%' }"
      round
    >
      <Zhuce @chengshow="zhuce"></Zhuce>
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/login.less";
import Zhuce from "../components/Zhuce.vue";
import { utils } from "../assets/js/utila";
export default {
  name: "Login",
  components: { Zhuce },
  data() {
    return {
      userphone: {
        phone: "",
        password: "",
      },
      bool: true,
      show: false,
    };
  },
  created() {
    
    
  },
  methods: {
    righticon() {
      this.bool = !this.bool;
    },
    zhuce() {
      this.show = !this.show;
    },
    login() {
      if (
        this.userphone.phone.length != 0 &&
        this.userphone.password.length != 0
      ) {
        let o = {
          phone: {
            value: this.userphone.phone,
            reg: /^1[3-9]\d{9}$/,
            errorMsg: "手机号码或者密码错误",
          },
          password: {
            value: this.userphone.password,
            reg: /^[A-Za-z]\w{5,15}$/,
            errorMsg: "手机号码或者密码错误",
          },
        };
        if (utils.validForm(o)) {
          let userInfo = Object.assign({}, this.userphone);
          userInfo.appkey = this.appkey;
          this.axios({
            // 请求类型
            method: "POST",
            // 请求路径
            url: "/login",
            // POST请求参数
            data: userInfo
          }).then(res => {
            this.$toast({
                    message:res.data.msg,
                    duration:2000,
                    forbidClick:true
            })
            if(res.data.code === 200){
              localStorage.setItem('tokenString',res.data.token)
              this.$router.push({path:'/'})
            }
          });
        }
      } else {
        this.$toast({
          message: "请填写手机号码和密码",
          duration: 2000,
          forbidClick: true,
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>
