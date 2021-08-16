<template>
  <div class="core">
    <div class="top">
      <van-nav-bar
        title="个人中心"
        @click-left="back"
        left-text="返回"
        left-arrow
      />
    </div>
    <div class="content">
      <van-cell title="修改密码" @click="isshow" is-link />
      <van-cell title="注销账号" @click="cancella" is-link />
    </div>
    <van-popup
      v-model="show"
      closeable
      position="bottom"
      :style="{ height: '38%' }"
    >
      <div class="bigbox">
        <h2 style="marginleft: 10px">修改密码</h2>
        <div class="password-box" style="margintop: 30px">
          <van-field
            v-model="oldpassword"
            :type="isshowold ? 'text' : 'password'"
            placeholder="输入旧密码"
            label="旧密码"
            :right-icon="isshowold ? 'eye-o' : 'closed-eye'"
            @click-right-icon="old"
          />
          <van-field
            v-model="newpassword"
            :type="isshownew ? 'text' : 'password'"
            placeholder="输入新密码"
            label="新密码"
            :right-icon="isshownew ? 'eye-o' : 'closed-eye'"
            @click-right-icon="newpass"
          />
          <div
            class="buttom"
            style="margin: 30px auto; margintop: 30px; width: 90vw"
          >
            <van-button @click="changepassword" color="#c0550d" block round
              >确定修改</van-button
            >
          </div>
        </div>
      </div>
    </van-popup>
    <div class="button-box">
      <van-button @click="tuichu" color="#c0550d" round block
        >退出登录</van-button
      >
    </div>
  </div>
</template>

<script>
import { utils } from "../assets/js/utila";
export default {
  name: "Core",
  data() {
    return {
      show: false,
      oldpassword: "",
      newpassword: "",
      isshowold: false,
      isshownew: false,
    };
  },
  methods: {
    //   返回上一级
    back() {
      this.$router.go(-1);
    },
    isshow() {
      this.show = !this.show;
    },
    // 修改密码
    changepassword() {
      let o = {
        password: {
          value: this.newpassword,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "新密码格式错误，首字符为字母，可字母数字组合(6-16位)",
        },
      };
      if (this.oldpassword.length == 0 || this.newpassword.length == 0) {
        return this.$toast("输入框不能为空");
      }
      if (this.oldpassword == this.newpassword) {
        return this.$toast("所输入旧密码和新密码相同，请重新输入");
      }
      //   this.$toast.loading({
      //       message:'加载中...',
      //       duration:0,
      //       forbidClick:true
      //   })
      if (utils.validForm(o)) {
        this.axios({
          method: "post",
          url: "/updatePassword",
          data: {
            appkey: this.appkey,
            tokenString: localStorage.getItem('tokenString'),
            password: this.newpassword,
            oldPassword: this.oldpassword,
          },
        }).then((res) => {
          if (res.data.code == "E003") {
            this.$toast(res.data.msg);
          } else if (res.data.code == "E001") {
            if (res.data.result[0] == 1) {
              this.$toast(res.data.msg);
              this.newpassword = "";
              this.oldpassword = "";
              this.$router.push({ name: "Login" });
            }
          }
        });
      }
    },
    // 修改旧密码是否显示状态
    old() {
      this.isshowold = !this.isshowold;
    },
    // 修改新密码是否显示状态
    newpass() {
      this.isshownew = !this.isshownew;
    },
    // 注销账号
    cancella() {
      this.$dialog
        .confirm({
          title: "是否注销该账号",
        })
        .then(() => {
          this.axios({
            method: "post",
            url: "/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString: localStorage.getItem('tokenString'),
            },
          }).then((res) => {
            if (res.data.code == "G001") {
              this.$toast(res.data.msg);
              this.localStorage.getItem('tokenString')
              this.$router.push({ name: "Login" });
            } else {
              this.$toast("注册失败，请稍等再试");
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    // 退出登录
    tuichu() {
      this.$dialog
        .confirm({
          title: "是否退出登录"
        })
        .then(() => {
          this.axios({
            method: "post",
            url: "/logout",
            data: {
              appkey: this.appkey,
              tokenString: localStorage.getItem('tokenString'),
            },
          }).then((res) => {
            if(res.data.code =="F001"){
                this.$toast(res.data.msg)
                localStorage.removeItem("hou")
                this.$router.push({name:'Login'})
            }else{
                this.$toast('退出登录失败，请稍等再试')
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="less" scoped>
.core {
  .content {
  }
  .button-box {
    width: 90vw;
    position: fixed;
    bottom: 50px;
    left: 5vw;
  }
}
/deep/ .van-nav-bar .van-icon {
  color: #c0550d;
}
/deep/.van-nav-bar__text {
  color: #c0550d;
}
</style>