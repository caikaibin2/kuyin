<template>
  <div class="orderstatus">
    <div class="top">
      <van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="back" />
    </div>
    <div class="content-box">
      <van-tabs v-model="active" color="#c0550d" title-active-color="#c0550d">
        <van-tab title="全部">
          <van-empty v-if="orderlist.length ==0" description="空空如也,赶紧去购买商品吧" />
          <div class="content" v-for="(item, index) in orderlist" :key="index">
            <div class="order-status">
              <div class="ordernumber">{{ item[0].oid }}</div>
              <div class="status-delete">
                <div
                  class="status"
                  @click="item[0].status == 1 ? receiving(item[0].oid) : ''"
                >
                  {{ item[0].status == 1 ? "确定收货" : "已完成" }}
                </div>
                <div class="delete" v-if="item[0].status == 2" @click="deleteorder(item[0].oid)">删除</div>
              </div>
            </div>
            <div class="commoditylist">
              <div class="commodity" v-for="(it, ind) in item" :key="ind">
                <div class="img-box">
                  <img :src="it.smallImg" alt="" />
                </div>
                <div class="nama-number">
                  <div class="name">{{ it.name }}</div>
                  <div class="guige">{{ it.rule }}</div>
                  <div class="price-number">
                    <div class="price">&yen;{{ it.price }}</div>
                    <div class="number">x{{ it.count }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="data">{{item[0].updatedAt}}</div>
            <div class="number-price">
              <div class="number">
                共计{{ totalpricelist[index].totalcount }}件商品
              </div>
              <div class="totalprice">
                &yen;{{ totalpricelist[index].totalprice }}
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="进行中">
          <van-empty v-if="conduct.length ==0" description="空空如也,赶紧去购买商品吧" />
          <div class="content" v-for="(item, index) in conduct" :key="index">
            <div class="order-status">
              <div class="ordernumber">{{ orderlist[item][0].oid }}</div>
              <div class="status-delete">
                <div
                  class="status"
                  @click="
                    orderlist[item][0].status == 1
                      ? receiving(orderlist[item][0].oid)
                      : ''
                  "
                >
                  {{ orderlist[item][0].status == 1 ? "确定收货" : "已完成" }}
                </div>
                <div class="delete" v-if="orderlist[item][0].status == 2">
                  删除
                </div>
              </div>
            </div>
            <div class="commoditylist">
              <div
                class="commodity"
                v-for="(it, ind) in orderlist[item]"
                :key="ind"
              >
                <div class="img-box">
                  <img :src="it.smallImg" alt="" />
                </div>
                <div class="nama-number">
                  <div class="name">{{ it.name }}</div>
                  <div class="guige">{{ it.rule }}</div>
                  <div class="price-number">
                    <div class="price">&yen;{{ it.price }}</div>
                    <div class="number">x{{ it.count }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="data">{{orderlist[item][0].updatedAt}}</div>
            <div class="number-price">
              <div class="number">
                共计{{ totalpricelist[item].totalcount }}件商品
              </div>
              <div class="totalprice">
                &yen;{{ totalpricelist[item].totalprice }}
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="已完成">  
          <van-empty v-if="complete.length ==0" description="空空如也,赶紧去购买商品吧" />
          <div class="content" v-for="(item, index) in complete" :key="index">
            <div class="order-status">
              <div class="ordernumber">{{ orderlist[item][0].oid }}</div>
              <div class="status-delete">
                <div
                  class="status"
                  @click="
                    orderlist[item][0].status == 1
                      ? receiving(orderlist[item][0].oid)
                      : ''
                  "
                >
                  {{ orderlist[item][0].status == 1 ? "确定收货" : "已完成" }}
                </div>
                <div class="delete" v-if="orderlist[item][0].status == 2" @click="deleteorder(orderlist[item][0].oid)">
                  删除
                </div>
              </div>
            </div>
            <div class="commoditylist">
              <div
                class="commodity"
                v-for="(it, ind) in orderlist[item]"
                :key="ind"
              >
                <div class="img-box">
                  <img :src="it.smallImg" alt="" />
                </div>
                <div class="nama-number">
                  <div class="name">{{ it.name }}</div>
                  <div class="guige">{{ it.rule }}</div>
                  <div class="price-number">
                    <div class="price">&yen;{{ it.price }}</div>
                    <div class="number">x{{ it.count }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="data">{{orderlist[item][0].updatedAt}}</div>
            <div class="number-price">
              <div class="number">
                共计{{ totalpricelist[item].totalcount }}件商品
              </div>
              <div class="totalprice">
                &yen;{{ totalpricelist[item].totalprice }}
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/less/orderstatus.less";
export default {
  name: "Orderstatus",
  data() {
    return {
      active: 0,
      // 全部订单列表
      orderlist: [],
      // 正在进行的订单列表
      ingorder: [],
      // 已完成列表
      edorder: [],
      totalpricelist: [],
    };
  },
  created() {
    // 获取全部列表
    this.getorderlist();
    // 获取进行中列表
    // this.getingorder()
  },
  methods: {
    //   获取全部订单订单列表
    getorderlist() {
      this.axios({
        method: "get",
        url: "findOrder",
        params: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
          status: 0,
        },
      }).then((res) => {
        if (res.data.code === 70000) {
          let data = res.data.result;
          if (data.length != 0) {
            let typearr = [];
            let typelist = [];
            // 总价钱列表
            let totalpricelist = [];
            data.forEach((item) => {
              if (typearr.indexOf(item.oid) == -1) {
                typearr.push(item.oid);
                typelist.push([]);
              }
            });
            typearr.forEach((item, index) => {
              data.forEach((element) => {
                if (item == element.oid) {
                  typelist[index].push(element);
                }
              });
            });
            typelist.forEach((element) => {
              let totalprice = 0;
              let totalcount = 0;
              element.forEach((item, index) => {
                totalprice += item.count * item.price;
                totalcount += item.count;
                item.updatedAt = item.updatedAt.slice(0,10)+' '+item.updatedAt.slice(11,19)
              });
              totalpricelist.push({ totalprice, totalcount });
            });
            this.orderlist = typelist;
            this.totalpricelist = totalpricelist;
          }else{
            this.orderlist = []
            this.totalpricelist=[]
          }
        }
      });
    },
    
    // 确定收货
    receiving(oid) {
      this.axios({
        method: "post",
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
          oid,
        },
      }).then((res) => {
        if (res.data.code === 80000) {
          this.$toast(res.data.msg);
          // 获取全部列表，更改数据
          this.getorderlist();
        }
      });
    },
    deleteorder(oid){
      this.axios({
        method:'post',
        url:'/removeOrder',
        data:{
          appkey:this.appkey,
          tokenString:localStorage.getItem('tokenString'),
          oid
        }
      }).then(res =>{
        if(res.data.code ==90000){
          this.getorderlist()
        }
      })
    },
    // 返回上一级
    back(){
      this.$router.go(-1)
    }
  },
  computed: {
    // 正在进行列表
    conduct() {
      // 正在进行索引值数组
      let indexArr = [];
      this.orderlist.forEach((item, index) => {
        if (item[0].status === 1) {
          indexArr.push(index);
        }
      });
      return indexArr;
    },
    complete() {
      let indexArr = [];
      this.orderlist.forEach((item, index) => {
        if (item[0].status === 2) {
          indexArr.push(index);
        }
      });
      return indexArr;
    },
  },
};
</script>

<style lang="less" scoped>
</style>