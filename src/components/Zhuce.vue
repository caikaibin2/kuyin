<template>
  <div class="zhuce">
    <h1>注册</h1>
    <van-field
      v-model="zhuce.phone"
      label="手机号"
      type="digit"
      placeholder="11位手机号码"
    ></van-field>

    <van-field
      v-model="zhuce.name"
      label="昵称"
      placeholder="1-10位昵称"
    ></van-field>

    <van-field
      v-model="zhuce.password"
      label="密码"
      :type="isencryption ? 'password' : 'text'"
      placeholder="6-16位密码且以字母开头"
      :right-icon="isencryption ? 'closed-eye' : 'eye-o'"
      @click-right-icon="isencryption = !isencryption"
    ></van-field>
    <div style="margintop: 10px; padding: 0 10px">
      <van-button @click="yanzheng" type="warning" block round>注册</van-button>
    </div>
  </div>
</template>

<script>
import { utils } from "../assets/js/utila";
export default {
  data() {
    return {
      zhuce: {
        phone: "",
        name: "",
        password: "",
      },
      isencryption: true,
    };
  },
  methods: {
    closes() {
      this.$emit("close");
    },
    yanzheng() {
      let o = {
        phone: {
          value: this.zhuce.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机格式错误，请重新输入",
        },
        password: {
          value: this.zhuce.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式错误，首字符为字母，可字母数字组合(6-16位)",
        },
        name: {
          value: this.zhuce.name,
          reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
          errorMsg: "昵称格式错误，支持汉字字母数字组合",
        },
      };
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      if (utils.validForm(o)) {
        let userInfo = Object.assign({}, this.zhuce);
        userInfo.appkey = this.appkey;
        this.axios({
          // 请求类型
          method: "POST",
          // 请求路径
          url: "/register",
          // POST请求参数
          data: userInfo,
        })
          .then((res) => {
            this.$toast.clear();
            // 注册成功的数据
            if (res.data.code == 100) {
              this.$toast({
                message: res.data.msg,
                duration: 2000,
              });
              this.$emit('chengshow')
              // 手机号已被注册的数据
            } else if (res.data.code == 102) {
              this.$toast({
                message: res.data.msg,
                duration: 2000,
              });
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.zhuce {
  h1 {
    margin-left: 20px;
  }
}
</style>