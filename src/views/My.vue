<template>
  <div class="my">
    <div
      class="background"
      :style="{ backgroundImage: `url(${information.userBg})` }"
    >
      <van-uploader :after-read="afchangeBg">
        <div class="bgImg"></div>
      </van-uploader>
    </div>
    <div class="content">
      <van-uploader :after-read="afterRead" capture :max-size="500 * 1024">
        <div class="preview-cover"></div>
      </van-uploader>
      <div class="head-box">
        <div class="head">
          <img :src="information.userImg" alt="" />
        </div>
        <div class="text">
          <div class="name">{{information.nickName}}</div>
          <div class="autograph">{{information.desc?information.desc:'这个家伙很懒，什么都没留下.'}}</div>
        </div>
      </div>
      <div class="list">
        <van-cell
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
          @click="goPage(item.name)"
          is-link
        />
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/my.less";
export default {
  name: "My",
  data() {
    return {
      information: {},
      list: [
        { title: "个人资料", name: "Personal" },
        { title: "我的订单", name: "Orderstatus" },
        { title: "我的收藏", name: "Collection" },
        { title: "收货地址", name: "Receivingaddress" },
        { title: "个人中心", name: "Core" },
      ],
    };
  },
  created() {
    this.personaldata();
  },
  methods: {
    //   换头像
    afterRead(file) {
      //   限制上传文件类型
      let types = ["png", "gif", "jpg", "jpeg"];
      // 截取上传图片类型
      let type = file.file.type.split("/")[1];
      if (types.indexOf(type) === -1) {
        return this.$toast({
          message: `文件类型只支持${types}`,
          duration: 2000,
        });
      }

      // 处理base64
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");
      this.axios({
        method: "post",
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
          imgType: type,
          serverBase64Img: base64,
        },
      }).then((res) => {
        if (res.data.code == "H001") {
          if (res.data.result[0] == 1) {
            this.$toast(res.data.msg);
            this.information.userImg = res.data.userImg;
          }
        }
      });
    },
    // 获取个人资料
    personaldata() {
      this.axios({
        method: "get",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
        },
      }).then((res) => {
        if (res.data.code == "A001") {
          this.information = res.data.result[0];
        }
      });
    },
    // 更改背景图像
    afchangeBg(file) {
      //   限制上传文件类型
      let types = ["png", "gif", "jpg", "jpeg"];
      // 截取上传图片类型
      let type = file.file.type.split("/")[1];
      if (types.indexOf(type) === -1) {
        return this.$toast({
          message: `文件类型只支持${types}`,
          duration: 2000,
        });
      }

      // 处理base64
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");
      this.axios({
        method: "post",
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
          imgType: type,
          serverBase64Img: base64,
        },
      }).then((res) => {
        if (res.data.code == "I001") {
          if (res.data.result[0] == 1) {
            this.$toast(res.data.msg);
            this.information.userBg = res.data.userBg;
          }
        }
      });
    },
    // 跳转页面
    goPage(name){
        this.$router.push({name})
    }
  },
};
</script>

