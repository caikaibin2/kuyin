<template>
  <div class="collection">
    <div class="top">
      <van-nav-bar
        title="个人收藏"
        @click-left="back"
        left-text="返回"
        left-arrow
      />
    </div>
    <van-empty v-if="list.length ==0" description="空空如也,赶紧去收藏吧" />
    <div class="list">
      <Commodity
        v-for="(item, index) in list"
        :key="index"
        :commodity="item"
        class="single"
        @detele = 'detele'
      >
        <template #shanchu>
          <div>
              <img :src="src" alt="" />
          </div>
          <!-- <div>1</div> -->
        </template>
      </Commodity>
    </div>
  </div>
</template>

<script>
import Commodity from "../components/Commoditys";
export default {
  name: "Collection",
  components: { Commodity },
  created() {
    this.allLike();
  },
  data() {
    return {
      list: [],
      src:require('../assets/images/lajitong.png')
    };
  },
  methods: {
    //   返回上一级
    back() {
      this.$router.go(-1);
    },
    // 所有获取收藏的信息
    allLike() {
      this.axios({
        method: "get",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
        },
      }).then((res) => {
        if (res.data.code == 2000) {
          this.list = res.data.result;
        }
      });
    },
    detele(pid){
        for (let i = 0; i < this.list.length; i++) {
            if(this.list[i].pid == pid){
                this.list.splice(i,1)
                return ;
            }
        }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar .van-icon {
  color: #c0550d;
}
/deep/.van-nav-bar__text {
  color: #c0550d;
}
.collection {
  .list {
    display: flex;
    flex-wrap: wrap;
    .single {
      width: 165px;
      // height: 200px;
      &:nth-of-type(2n-1) {
        margin: 0 15px;
      }
      &:nth-of-type(2n) {
        // margin-right: 15px;
      }
    }
  }
}
</style>