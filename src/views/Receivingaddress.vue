<template>
  <div class="receivingaddress">
    <div class="top">
      <van-nav-bar
        title="收货地址"
        @click-left="back"
        left-text="返回"
        left-arrow
      />
    </div>
    <div v-if="list.length == 0">
      <van-empty description="空空如也，赶快添加地址吧！" />
    </div>
    <div class="content">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        :switchable="false"
        @add="add"
        @edit="edit"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Receivingaddress",
  data() {
    return {
      chosenAddressId: "1",
      list: [],
    };
  },
  created() {
    this.addresslist();
  },
  methods: {
    //   返回上一级
    back() {
      this.$router.go(-1);
    },
    addresslist() {
      this.axios({
        method: "get",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
        },
      }).then((res) => {
        if (res.data.code === 20000) {
          let arr = res.data.result;
          arr.forEach((item, index) => {
            arr[
              index
            ].address = `${item.province}${item.city}${item.county}${item.addressDetail}`;
          });
          this.list = arr;
        }
      });
    },
    // 添加地址
    add(){
        this.$router.push({name:'Newaddress'})
    },
    edit(item){
        this.$router.push({name:'Newaddress',params:{aid:item.aid}})

    }
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
</style>