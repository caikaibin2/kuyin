<template>
  <div class="personal">
    <div class="top">
      <van-nav-bar
        title="个人资料"
        @click-left="back"
        left-text="返回"
        left-arrow
      />
    </div>
    <van-uploader ref="upload" :after-read="changehead">
      <div></div>
    </van-uploader>
    <div class="content">
      <div class="img-box">
        <img :src="information.userImg" alt="" />
        <div class="change" @click="call">更改头像</div>
      </div>
      <div class="input-box">
        <van-field
          label-width="80px"
          v-for="(item, index) in informationArr"
          :key="index"
          v-model="item.value"
          :readonly="index == 0 || index == 1"
          :label="item.name + '：'"
          :placeholder="
            item.value > 0
              ? item.value
              : index == 3
              ? '这家伙很懒，什么也没留下！'
              : '昵称'
          "
          @blur="change(index, item.value)"
          @focus="tips()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/personal.less";
export default {
  name: "Personal",
  data() {
    return {
      // 个人信息
      information: {},
      //   个人信息拆成数组
      informationArr: [],
    };
  },
  created() {
    this.personal();
  },
  methods: {
    //   返回上一级
    back() {
      this.$router.go(-1);
    },
    //   个人资料
    personal() {
      this.axios({
        method: "get",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
        },
      }).then((res) => {
        if (res.data.code === "B001") {
          let arreng = ["nickName", "userId", "phone", "desc"];
          let arrText = ["用户Id", "手机号", "昵称", "个性签名"];
          let informationArr = [];
          this.information = res.data.result[0];
          for (let key in this.information) {
            if (arreng.indexOf(key) != -1) {
              informationArr.push(this.information[key]);
            }
          }
          //   存数据
          let arr = [];
          arrText.forEach((item, index) => {
            arr.push({ name: item, value: informationArr[index] });
          });
          this.informationArr = arr;
        }
      });
    },
    // 调出选择图片的方法
    call() {
      this.$refs.upload.chooseFile();
    },
    // 修改头像
    changehead(file) {
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
    // 修改昵称和个性签名
    change(index, value) {
      this.$toast("已退出编辑状态");
      if (index == 2) {
        this.changeName(value);
      } else if (index == 3) {
        this.changegxqm(value);
      }
    },
    // 提示进入编辑状态
    tips() {
      this.$toast("已进入编辑状态");
    },
    // 修改昵称
    changeName(nickName) {
      this.axios({
        method: "post",
        url: "/updateNickName",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
          nickName,
        },
      }).then((res) => {
        if (res.data.code == "C001") {
          if (res.data.result[0] == 1) {
            this.$toast(res.data.msg);
          }
        }
      });
    },
    // 修改个性签名
    changegxqm(desc) {
      this.axios({
        method: "post",
        url: "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
          desc,
        },
      }).then((res) => {
        if (res.data.code == "D001") {
          if (res.data.result[0] == 1) {
            this.$toast("修改个性签名成功");
          }
        }
      });
    },
  },
};
</script>