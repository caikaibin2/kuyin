<template>
  <div class="menu">
    <img
      style="width: 100%; height: 200px"
      src="../assets/images/coffee.png"
      alt=""
    />
    <van-tabs
      v-model="active"
      animated
      color="#c0550d"
      title-active-color="#c0550d"
    >
      <van-tab
        v-for="(item, index) in typelist"
        :key="index"
        :title="item.typeDesc"
        ><div class="small-box">
          <Commoditys
            class="assembly"
            v-for="(it, ind) in commoditylist[index]"
            :key="ind"
            :commodity="it"
          >
            <template #hot>
              <div v-if="it.isHot == 1" class="hot">hot</div>
            </template>
          </Commoditys>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import "../assets/less/menu.less";
import Commoditys from "../components/Commoditys";
export default {
  name: "Menu",
  components: { Commoditys },
  data() {
    return {
      typelist: [],
      active: 0,
      commoditylist: [],
    };
  },
  created() {
    // 商品类型
    this.gettypelist();
    // 热卖商品
    this.getHotlist();
  },
  methods: {
    //   获取商品类型
    gettypelist() {
      this.$toast.loading({
        message: "加载中...",
        duration: 0,
        forbidClick: true,
      });
      this.axios({
        method: "get",
        url: "/type",
        params: {
          appkey: this.appkey,
        },
      }).then((res) => {
        this.$toast.clear();
        if (res.data.code === 400) {
          this.typelist = res.data.result;
          this.typelist.unshift({ id: 5, type: "isHot", typeDesc: "热卖" });
        }
      });
    },
    // 热卖商品
    getHotlist() {
      this.axios({
        method: "get",
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      }).then((res) => {
        if (res.data.code === 500) {
          this.commoditylist.push(res.data.result);
          // 获取拿铁商品
          this.getLattelist();
        }
      });
    },
    // 拿铁商品
    getLattelist() {
      this.axios({
        method: "get",
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "type",
          value: "latte",
        },
      }).then((res) => {
        if (res.data.code === 500) {
          this.commoditylist.push(res.data.result);
          // 加载咖啡商品
          this.getCoffeelist();
        }
      });
    },
    // 咖啡商品
    getCoffeelist() {
      this.axios({
        method: "get",
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "type",
          value: "coffee",
        },
      }).then((res) => {
        if (res.data.code === 500) {
          this.commoditylist.push(res.data.result);
          // 瑞纳冰商品
          this.getRenalist();
        }
      });
    },
    // 瑞纳冰商品
    getRenalist() {
      this.axios({
        method: "get",
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "type",
          value: "rena_ice",
        },
      }).then((res) => {
        if (res.data.code === 500) {
          this.commoditylist.push(res.data.result);
          // 水果茶商品
          this.getFruitlist();
        }
      });
    },
    // 水果茶商品
    getFruitlist() {
      this.axios({
        method: "get",
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "type",
          value: "fruit_tea",
        },
      }).then((res) => {
        if (res.data.code === 500) {
          this.commoditylist.push(res.data.result);
          this.$toast.clear();
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>