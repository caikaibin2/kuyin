<template>
  <div class="home">
    <div class="top">
      <van-nav-bar left-text="返回" left-arrow>
        <template #left>
          <div class="time">你好</div>
          <div class="username">{{name}}</div>
        </template>
        <template #right>
          <van-search
            v-model="value"
            shape="round"
            placeholder="请输入搜索关键词"
            clearable
            @focus="focus"
          />
        </template>
      </van-nav-bar>
    </div>
    <div class="swipe">
      <van-swipe
        class="my-swipe"
        @change="changeActive"
        :autoplay="3000"
        indicator-color="white"
      >
        <van-swipe-item v-for="(item, index) in swipeInformation" :key="index">
          <img style="height: 300px" :src="item.bannerImg" alt="" @click="tiaozhuan(item)" />
        </van-swipe-item>

        <template #indicator>
          <div class="rectangle-box">
            <div
              class="rectangle"
              v-for="(v, i) in swipeInformation"
              :key="i"
              :class="{ active: activeIndex == i }"
            ></div>
          </div>
        </template>
      </van-swipe>
    </div>
    <h1 class="hotsell">热门推荐</h1>
    <div class="commodity">
      <Commodity
        class="one"
        v-for="(item, index) in hotInformation"
        :key="index"
        :commodity="item"
      >
        <template #hot>
          <div class="hot">hot</div>
        </template>
      </Commodity>
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";
import Commodity from "../components/Commoditys.vue";
export default {
  components: { Commodity },
  name: "Home",
  data() {
    return {
      value: "",
      swipeInformation: [],
      hotInformation: [],
      activeIndex: 0,
      name:'靓仔'
    };
  },
  created() {
    if(!localStorage.getItem('tokenString')){
      return this.$router.push({name:'Login'})
    }
    this.getPersonalData()
    this.axios({
      // 请求类型
      method: "get",
      url: "/banner",
      params: {
        appkey: this.appkey,
      },
    }).then((res) => {
      this.swipeInformation = res.data.result;
    });
    this.axios({
      // 请求类型
      method: "get",
      url: "/typeProducts",
      params: {
        appkey: this.appkey,
        key: "isHot",
        value: 1,
      },
    }).then((res) => {
      this.hotInformation = res.data.result;
    });
  },
  methods: {
    changeActive(index) {
      this.activeIndex = index;
    },
    tiaozhuan(item){
      this.$router.push({name:'Detail',params:{pid:item.pid}})
    },
    // 搜索关键字
    focus(){
      this.$router.push({name:'Search'})
    },
    // 获取个人资料
    getPersonalData(){
      this.axios({
        method:'get',
        url:"/findAccountInfo",
        params:{
          appkey:this.appkey,
          tokenString:localStorage.getItem('tokenString')
        }
      }).then(res => {
        if(res.data.code=="B001"){
          this.name = res.data.result[0].nickName
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
</style>