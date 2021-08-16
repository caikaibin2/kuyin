<template>
  <div class="shopbag" @click.self="regression($event)">
    <div class="top">
      <van-nav-bar
        title="购物袋"
        :left-text="isedit ? '编辑' : '完成'"
        @click-left="changeisedit"
      />
    </div>
    <div class="notshoplist" v-if="isnotshoplist">
      <van-empty description="空空如也，赶紧逛一逛吧！">
        <van-button round type="danger" @click="jumpmenu" class="bottom-button"
          >逛一逛</van-button
        >
      </van-empty>
    </div>
    <div class="shoplist" v-if="!isnotshoplist">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="哎呀！到底了呢！"
        offset="200"
        @load="onLoadShopcart"
      >
        <div
          class="shop-box"
          v-for="(item, index) in showShopcart"
          :key="index"
        >
          <div
            class="shop"
            :ref="arr[index]"
            :class="{ chmglo: !isedit }"
            @touchstart="touchstart($event, index)"
            @touchmove="touchmove($event, index)"
            @touchend="touchend($event, index)"
          >
            <div class="checkbox-box">
              <van-checkbox
                v-model="item.checked"
                checked-color="#c0550d"
                @click="changeSelectAll"
              ></van-checkbox>
            </div>
            <div class="img-box">
              <img :src="item.small_img" alt="" />
            </div>
            <div class="name-number">
              <div class="name">{{ item.name }}</div>
              <div class="rule">规格：{{ item.rule }}</div>
              <div class="price-number">
                <div class="price">&yen;{{ item.price * item.count }}</div>
                <div class="number">
                  <van-stepper
                    v-model="item.count"
                    @plus="changeCount(item.sid, item.count + 1)"
                    @minus="changeCount(item.sid, item.count - 1)"
                    theme="round"
                    button-size="22"
                    disable-input
                  />
                </div>
              </div>
            </div>
            <div class="delete" @click="deletes(item.sid)">删除</div>
          </div>
        </div>
      </van-list>
    </div>
    <div class="submits" v-show="!isedit">
      <van-submit-bar
        button-color="#c0550d"
        @submit="deleteSeleChecked"
        button-text="确定删除"
        ref="button"
      >
        <van-checkbox
          v-model="checked"
          checked-color="#c0550d"
          @click="changeAllcheckbox"
          >全选</van-checkbox
        >
      </van-submit-bar>
    </div>
    <div class="submits" v-show="isedit">
      <van-submit-bar
        :price="totalpricevalue * 100"
        button-color="#c0550d"
        button-text="提交订单"
        @submit="onSubmit"
      >
      </van-submit-bar>
    </div>
    
  </div>
</template>

<script>
import "../assets/less/shopbag.less";
export default {
  name: "Shopbag",
  data() {
    return {
      // 购物车是否有数据
      // isnotshoplist:true,
      start: 0,
      count: 7,
      checked: false,
      isedit: true,
      loading: false,
      finished: false,
      value: 5,
      clientX: 0,
      arr: [],
      arr1: ["on1", "tw2"],
      AllShopcart: [],
      showShopcart: [],
      totalpricevalue: 0,
      
      
    };
  },
  created() {
    this.$toast.loading({
      message: "加载中...",
      duration: 0,
      forbidClick: true,
    });
    this.axios({
      method: "get",
      url: "/findAllShopcart",
      params: {
        appkey: this.appkey,
        tokenString: localStorage.getItem('tokenString'),
      },
    }).then((res) => {
      if (res.data.code === 5000) {
        this.$toast.clear();
        var result = res.data.result;
        var arr = [];
        result.forEach((item, index) => {
          item.checked = false;
        });
        this.AllShopcart = result;
        // 总价钱
        this.totalPrice();
        this.AllShopcart.forEach((item, index) => {
          let ref = "ref" + index;
          arr.push(ref);
        });;
        this.arr = arr;
        if (this.AllShopcart.length <= this.count) {
          setTimeout(() => {
            this.finished = true;
          }, 1900);
        }
      } else {
        this.$toast({
          message: "加载失败，请稍等再试重新",
          duration: 1000,
          forbidClick: true,
        });
      }
    });
  },
  methods: {
    // 修改编辑状态
    changeisedit() {
      if (this.isedit) {
        this.isedit = false;
        // 修改全部复选框的状态
        this.AllShopcart.forEach((element) => {
          element.checked = false;
        });
      } else {
        this.isedit = true;
        this.arr.forEach((item, i) => {
          this.$refs[item][0].style.marginLeft = -30 + "px";
        });
      }
    },
    // 购物车回归正常
    regression(e) {
      this.showShopcart.forEach((item, index) => {
        this.$refs[this.arr[index]][0].style.marginLeft = -30 + "px";
      });
    },
    touchstart(e, index) {
      if (this.isedit) {
        this.regression();
        this.clientX = e.changedTouches[0].clientX;  
      }
    },
    touchmove(e, index) {
      if (this.isedit) {
        let clientX = e.changedTouches[0].clientX;
        if (this.clientX - clientX > 0) {
          let number =
            -30 - this.clientX + clientX < -70
              ? -70
              : -30 - this.clientX + clientX;
          this.$refs[this.arr[index]][0].style.marginLeft = number + "px";
        }
      }
    },
    touchend(e, index) {
      if (this.isedit) {
        let number = e.changedTouches[0].clientX - this.clientX;
        if (number > -20) {
          this.$refs[this.arr[index]][0].style.marginLeft = -30 + "px";
        } else {
          this.$refs[this.arr[index]][0].style.marginLeft = -70 + "px";
        }
      }
    },
    // 懒加载
    onLoadShopcart() {
      setTimeout(() => {
        // //   加载状态结束
        this.loading = false;
        if (this.start > this.AllShopcart.length) {
          this.finished = true;
        } else {
          let showShopcart = this.AllShopcart.slice(
            this.start,
            this.start + this.count
          );
          this.start = this.start + this.count;
          this.showShopcart.push(...showShopcart);
        }
      }, 2000);
    },
    // 修改商品的数量
    changeCount(sid, count) {
      this.axios({
        method: "post",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
          sid,
          count: count,
        },
      }).then((res) => {
        if (res.data.code === 6000) {
          this.totalPrice();
          // this.$toast(res.data.msg);
          this.axios({
            method: "get",
            url: "/findAllShopcart",
            params: {
              appkey: this.appkey,
              tokenString: localStorage.getItem('tokenString'),
            },
          }).then((res) => {
          });
        } else {
          this.$toast("修改数量失败，请稍等再试！");
        }
      });
    },
    // 修改全部单个复选框的状态
    changeAllcheckbox() {
      this.AllShopcart.forEach((element) => {
        element.checked = this.checked;
      });
    },
    //  修改全选的复选框状态
    changeSelectAll() {
      for (let i = 0; i < this.showShopcart.length; i++) {
        if (!this.showShopcart[i].checked) {
          this.checked = false;
          return;
        } else {
          this.checked = true;
        }
      }
    },
    // 单个删除购物车
    deletes(sid) {
      this.axios({
        method: "post",
        url: "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
          sids: JSON.stringify([sid]),
        },
      }).then((res) => {
        if (res.data.code == 7000) {
          this.$toast.clear();
          this.$emit("changeNumber", 1);
          this.$toast("删除成功");
          for (let i = 0; i < this.showShopcart.length; i++) {
            if (this.showShopcart[i].sid == sid) {
              this.showShopcart.splice(i, 1);
              this.AllShopcart.splice(i, 1);

              return;
            }
          }
          this.totalPrice();
          // this.showShopcart.some((item, i) => {
          //   if (item.sid == sid) {
          //     this.showShopcart.splice(i, 1);
          //     this.AllShopcart.splice(i, 1); //在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
          //     return true;
          //   }
          // });
        }
      });
    },
    // 删除所选购物车条
    deleteSeleChecked() {
      let arr = [];
      this.showShopcart.forEach((item) => {
        if (item.checked) {
          arr.push(item.sid);
        }
      });
      this.axios({
        method: "post",
        url: "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString: localStorage.getItem('tokenString'),
          sids: JSON.stringify(arr),
        },
      }).then((res) => {
        if (res.data.code == 7000) {
          this.$toast("批量删除成功");
          let count = 0;
          for (let i = 0; i < this.showShopcart.length; i++) {
            for (let j = 0; j < arr.length; j++) {
              if (this.showShopcart[i].sid == arr[j]) {
                this.showShopcart.splice(i, 1);
                this.AllShopcart.splice(i, 1);
                this.arr.splice(0, 1);

                count++;
              }
            }
          }
          this.totalPrice();
          this.$emit("changeNumber", count);
          // this.showShopcart.some((item, i) => {
          //   if (item.sid == sid) {
          //     this.showShopcart.splice(i, 1);
          //     this.AllShopcart.splice(i, 1); //在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
          //     return true;
          //   }
          // });
        }
      });
    },
    // 计算总价钱
    totalPrice() {
      let allprice = 0;
      this.AllShopcart.forEach((item) => {
        var price = item.price - 0;
        allprice = allprice + item.count * price;
      });
      this.totalpricevalue = allprice;
    },
    // 跳转到菜单页面
    jumpmenu() {
      this.$router.push({ name: "Menu" });
    },
    // 提交订单
    onSubmit() {
      if(this.AllShopcart.length != 0){

        this.$router.push({name:'PlaceOrder'})
      }else{
        this.$toast({
          message:'请将商品添加到购物车在进行结算',
          duration:2000
        })
      }
      // this.show = !this.show
    },
  },
  computed: {
    // 购物车是否有数据
    isnotshoplist() {
      if (this.AllShopcart.length == 0) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style lang="less" scoped>
</style>