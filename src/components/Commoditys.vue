<template>
  <div class="commoditys" >
    <div class="img-box">
      <img :src="commodity.smallImg" alt="" @click="jumpdetail(commodity.pid)" />
    </div>
    <div class="name">{{ commodity.name }}</div>
    <div class="price-box">
      <div class="price">&yen;{{ commodity.price }}</div>
      <div class="shanchu" @click="nolike(commodity.pid)"><slot name="shanchu"  ></slot></div>
    </div>
    <slot name="hot"></slot>
  </div>
</template>

<script>
import "../assets/less/commoditys.less";
export default {
  props: ["commodity"],
  methods: {
    jumpdetail(pid) {
      this.$router.push({ name: "Detail", params: { pid: pid } });
    },
    // 取消收藏
    nolike(pid){
        this.axios({
            method:'post',
            url:'/notlike',
            data:{
                appkey:this.appkey,
                tokenString:localStorage.getItem('tokenString'),
                pid
            }
        }).then(res => {
            if(res.data.code ===900){
                this.$toast("删除成功")
                this.$emit('detele',pid)
            }
        })
    }
  },
};
</script>

<style lang="less" scoped>
</style>