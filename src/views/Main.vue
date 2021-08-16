<template>
  <div class="home">
    <div class="router">
      <keep-alive>
        <router-view @changeNumber="changeNumber"></router-view>
      </keep-alive>
      
    </div>
    <div class="bottom-nav">
      <van-tabbar v-model="active" active-color="#c0550d" route>
        <van-tabbar-item
          v-for="(item, index) in navInformation"
          :key="index"
          :to="item.path"
          :badge="item.badge > 0 ? item.badge : ''"
        >
          <div>{{ item.text }}</div>
          <template #icon="props">
            <img
              style="width: 22px"
              :src="props.active ? item.active : item.inactive"
            />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      active: 0,
      navInformation: [
        {
          text: "首页",
          active: require("../assets/images/shouye-active.png"),
          inactive: require("../assets/images/shouye.png"),
          path: "/",
          badge: 0,
        },
        {
          text: "菜单",
          active: require("../assets/images/caidan-active.png"),
          inactive: require("../assets/images/caidan.png"),
          path: "/menu",
          badge: 0,
        },
        {
          text: "购物袋",
          active: require("../assets/images/gouwudai-active.png"),
          inactive: require("../assets/images/gouwudai.png"),
          path: "/shopbag",
          badge: 0,
        },
        {
          text: "我的",
          active: require("../assets/images/my-active.png"),
          inactive: require("../assets/images/my.png"),
          path: "/my",
          badge: 0,
        },
      ],
    };
  },
  created() {
    this.ShoppingbagCount();
  },
  methods: {
    // 查找购物袋的数量
    ShoppingbagCount() {
      if (localStorage.getItem('tokenString')) {
        this.axios({
          method: "get",
          url: "/findAllShopcart",
          params: {
            appkey: this.appkey,
            tokenString: localStorage.getItem('tokenString'),
          },
        }).then((res) => {
          this.navInformation[2].badge = res.data.result.length;
        });
      }
    },
    changeNumber(count){
      this.navInformation[2].badge = this.navInformation[2].badge-count
    },
  },
};
</script>
<style lang="less" scoped>
</style>
