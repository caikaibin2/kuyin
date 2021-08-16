<template>
  <div class="newaddress">
    <div class="top">
      <van-nav-bar
        :title="bool ? '修改地址' : '添加地址'"
        left-text="返回"
        @click-left="onClickLeft"
        left-arrow
      />
    </div>
    <div class="content">
      <van-address-edit
        :area-list="areaList"
        show-postal
        :address-info="bool ? addressinfo : {}"
        :show-delete="bool"
        @delete="deleteaddress"
        show-set-default
        show-search-result
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="save"
      />
    </div>
  </div>
</template>

<script>
import areaList from "../assets/js/area";
export default {
  name: "Newaddress",
  data() {
    return {
      areaList,
      bool: false,
      addressinfo: {},
      compareaddressinfo: {},
    };
  },
  created() {
    let aid = this.$route.params.aid;
    if (aid) {
      this.bool = true;
      this.queryaddress(aid);
    } else {
      this.bool = false;
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    save(value) {
      if (!this.bool) {
        var data = value;
        delete data.country;
        data.appkey = this.appkey;
        data.tokenString = localStorage.getItem('tokenString');
        data.isDefault = Number(data.isDefault);
        this.axios({
          method: "post",
          url: "/addAddress",
          data: data,
        }).then((res) => {
          if (res.data.code === 9000) {
            this.$toast({
              message: res.data.msg,
              duration: 1000,
            });
            this.$router.go(-1);
          } else {
            this.$toast({
              message: res.data.msg,
              duration: 1000,
            });
          }
        });
      } else {
        for (let key in this.compareaddressinfo) {
          if (this.compareaddressinfo[key] != value[key]) {
            console.log("不等于", value);
            // let addressinfo = Object.assign(value)
            //   请求修改地址
            this.changeaddress(value);
            return ;
          }
        }
      }
    },
    // 获取地址信息
    queryaddress(aid) {
      this.axios({
        method: "get",
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
          aid,
        },
      }).then((res) => {
        if (res.data.code === 40000) {
          var addressinfo = res.data.result[0];
          addressinfo.isDefault = Boolean(addressinfo.isDefault);
          this.addressinfo = addressinfo;
          //   用于比较是否有更改
          this.compareaddressinfo = addressinfo;
        }
      });
    },
    // 修改地址
    changeaddress(addressinfo) {
      addressinfo.isDefault = Number(addressinfo.isDefault);
      delete addressinfo.areaCode;
      delete addressinfo.createdAt;
      delete addressinfo.country;
      delete addressinfo.isRemove;
      delete addressinfo.updatedAt;
      delete addressinfo.userId;
      addressinfo.appkey=this.appkey;
      addressinfo.tokenString=localStorage.getItem('tokenString');;
      this.axios({
          method:'post',
          url:'/editAddress',
          data:addressinfo
      }).then(res => {
          if(res.data.code ==30000){
              this.$toast({
                  message:res.data.msg,
                  duration:1000
              })
              this.$router.go(-1)
          }
      })
    },
    // 删除地址
    deleteaddress(value){
       this.axios({
           method:'post',
           url:'/deleteAddress',
           data:{
               appkey:this.appkey,
               tokenString:localStorage.getItem('tokenString'),
               aid:value.aid
           }
       }).then(res => {
           if(res.data.code ===10000){
               this.$toast(res.data.msg)
               this.$router.go(-1)
           }
       })
    }
  },
};
</script>

<style lang="less" scoped>
.newaddress {
  /deep/ .van-switch--on {
    background-color: #c0550d;
  }
  /deep/.van-button--danger {
    background-color: #c0550d;
    border-color: #c0550d;
  }
  /deep/ .van-nav-bar__text {
    color: #c0550d;
  }
  /deep/ .van-nav-bar .van-icon {
    color: #c0550d;
  }
}
</style>