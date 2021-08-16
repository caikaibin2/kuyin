<template>
  <div class="placeorder">
    <div class="top">
      <van-nav-bar
        title="提交订单"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <div class="content">
      <div class="address">
        <div class="first" @click="chengeshow">选择收货地址></div>
        <div class="second">
          <div class="name">{{ showaddress.name }}</div>
          <div class="phone">{{ showaddress.tel }}</div>
        </div>
        <div class="third">{{ showaddress.address }}</div>
      </div>
      <div class="commoditylist">
        <div class="text">订单信息</div>
        <div class="commoditycontent">
          <div class="one" v-for="(item, index) in commoditylist" :key="index">
            <div class="img-box">
              <img :src="item.small_img" alt="" />
            </div>
            <div class="name-price-number">
              <div class="name">{{ item.name }}</div>
              <div class="temperature">冷/全糖</div>
              <div class="price-number">
                <div class="price">￥{{ item.price }}</div>
                <div class="number">x{{ item.count }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="number-totalprice">
          <div class="number">共计{{ totalcount }}件商品</div>
          <div class="totalprice">合计 &yen;{{ totalprice }}</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <van-button
        style="width: 100%; height: 100%"
        @click="settlement"
        color="#c0550d"
        round
        block
        >立即结算</van-button
      >
    </div>
    <div class="address">
      <van-popup
        v-model="show"
        @close="close"
        round
        closeable
        position="bottom"
      >
        <h2>选择收货地址</h2>
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          @add="onAdd"
          @edit="editaddress"
        >
          <div class="button-box" v-if="list.length != 0">
            <van-button
              class="button"
              @click="determine"
              color="#c0550d"
              round
              block
              >确定</van-button
            >
          </div>
        </van-address-list>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/less/placeorder.less";
export default {
  name: "PlaceOrder",
  data() {
    return {
      show: false,
      chosenAddressId: 0,
      //   回复上次的选项
      code: 0,
      //   所有的地址
      list: [],
      //   显示默认地址
      showaddress: {},
      //   订单上的商品列表
      commoditylist: [],
      //   所有商品的数量
      totalcount: 0,
      // 所有商品的价钱合计
      totalprice: 0,
      sid: 0,
    };
  },
  created() {
    // 请求地址列表
    this.requestaddresslist();
    this.sid = this.$route.params.sid;
    if (!this.sid) {
      // 请求订单商品列表
      this.requestcommoditylist();

      // 请求所有商品的数量
      this.requestcommoditytotalcount();
    } else {
      this.singleCommodity(this.sid);
    }
  },
  methods: {
    onClickLeft() {
      if (this.sid != 0) {
        this.axios({
          method: "post",
          url: "/removeShopcart",
          data: {
            appkey: this.appkey,
            tokenString: localStorage.getItem('tokenString'),
            sids:JSON.stringify([this.sid])
          },
        }).then((res) => {
          if (res.data.code === 7000) {
            this.$router.go(-1);
          }
        });
      } else {
        this.$router.go(-1);
      }
    },
    // 请求单个商品
    singleCommodity(sid) {
      this.axios({
        method: "get",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
        },
      }).then((res) => {
        if (res.data.code === 5000) {
          let result = res.data.result;
          for (let i = 0; i < result.length; i++) {
            if (result[i].sid == sid) {
              this.commoditylist.push(result[i]);
              this.totalcount = result[i].count;
              this.totalprice = result[i].count * result[i].price;
            }
          }
        }
      });
    },
    // 请求所有商品的数量
    requestcommoditytotalcount() {
      this.axios({
        method: "get",
        url: "/shopcartCount",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
        },
      }).then((res) => {
        this.totalcount = res.data.result;
      });
    },
    // 请求商品列表
    requestcommoditylist() {
      this.axios({
        method: "get",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
        },
      }).then((res) => {
        if (res.data.code === 5000) {
          this.commoditylist = res.data.result;
          let totalprice = 0;
          this.commoditylist.forEach((item) => {
            totalprice += item.price * item.count;
          });
          this.totalprice = totalprice;
          // 如果没有商品就退出结算页面
          if (this.commoditylist.length == 0) {
            this.$router.push({ name: "Shopbag" });
          }
        }
      });
    },
    // 请求地址列表
    requestaddresslist() {
      this.axios({
        method: "get",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
        },
      }).then((res) => {
        let addresslist = res.data.result;
        addresslist.forEach((item, index) => {
          item.isDefault = !!item.isDefault;
          item.address = `${item.province}${item.city}${item.county}${item.addressDetail}`;
          if (item.isDefault) {
            this.chosenAddressId = item.id;
            this.code = item.id;
            this.showaddress = item;
          }
        });
        this.list = addresslist;
      });
    },
    // 显示地址列表
    chengeshow() {
      this.show = !this.show;
    },
    // 跳转新增地址页面
    onAdd() {
      this.$router.push({ name: "Newaddress" });
    },
    // 确定选择的地址
    determine() {
      this.code = this.chosenAddressId;
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].id == this.chosenAddressId) {
          this.showaddress = this.list[i];
          break;
        }
      }
      this.show = !this.show;
    },
    // 编辑(修改)地址
    editaddress(item) {
      this.$router.push({ name: "Newaddress", params: { aid: item.aid } });
    },
    // 遮罩层关闭时触发
    close() {
      this.chosenAddressId = this.code;
    },
    // 结算订单
    settlement() {
      if (this.showaddress.name) {
        let sids = [];
        this.commoditylist.forEach((element) => {
          sids.push(element.sid);
        });

        let data = {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
          sids: JSON.stringify(sids),
          phone: this.showaddress.tel,
          address: this.showaddress.address,
          receiver: this.showaddress.name,
        };
        this.axios({
          method: "post",
          url: "/pay",
          data,
        }).then((res) => {
          if (res.data.code == 60000) {
            this.sid = 0;
            this.$router.push({ name: "Orderstatus" });
          }
        });
      } else {
        this.$toast("请选择收货地址");
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>