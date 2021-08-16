<template>
  <div class="search">
    <div class="top">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词"
        @cancel="back"
        @blur="search"
      />
    </div>
    <div class="list">
      <Commoditys
        v-for="(item, index) in list"
        :key="index"
        :commodity="item"
        class="produr"
      >
        <template #hot>
          <div v-if="item.isHot == 1" class="hot">hot</div>
        </template>
      </Commoditys>
    </div>
  </div>
</template>

<script>
import Commoditys from "../components/Commoditys";
export default {
  name: "Search",
  components: { Commoditys },
  data() {
    return {
      value: "",
      list: [],
    };
  },
  methods: {
    back() {
      this.list = [];
      this.$router.go(-1);
    },
    //   搜索关键字
    search() {
      if (this.value != 0) {
        this.axios({
          method: "get",
          url: "/search",
          params: {
            appkey: this.appkey,
            name: this.value,
          },
        }).then((res) => {
          if (res.data.code == "Q001") {
            if (res.data.result.length != 0) {
              this.list = res.data.result;
            } else {
              this.$toast("抱歉，没有你想要的商品，请试试输入其他关键字");
            }
          }
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  .list {
      display: flex;
      margin-top: 20px;
      flex-wrap: wrap;
    .produr {
        &:nth-of-type(2n-1){
            margin: 0 15px;
        }
    }
  }
}
</style>