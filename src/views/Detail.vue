<template>
  <div class="detail">
    <div class="nav">
      <van-nav-bar
        title="商品详情"
        left-text="返回"
        @click-left="shangyiji"
        left-arrow
      />
    </div>
    <div class="img-box">
      <img :src="productDetail.large_img" alt="" />
    </div>
    <div class="content">
      <div class="name-price">
        <div class="name">{{ productDetail.name }}</div>
        <div class="price">&yen; {{ productDetail.price }}</div>
      </div>
      <div
        class="temperature-box"
        v-for="(item, index) in productDetail.typeDetail"
        :key="index"
      >
        <div class="text">{{ item.title }}</div>
        <div class="temperature">
          <div
            class="one"
            :class="{ active: item.currenIndex === ind }"
            @click="changeCurrenIndex(index, ind)"
            v-for="(it, ind) in item.title_desc"
            :key="ind"
          >
            {{ it }}
          </div>
        </div>
      </div>
      <div class="number-price">
        <div class="totalprice">&yen;{{ number * productDetail.price }}.00</div>
        <div class="number">
          <van-stepper
            v-model="number"
            theme="round"
            button-size="22"
            disable-input
          />
        </div>
      </div>
      <div class="line"></div>
      <div class="describe">
        <div class="text">商品描述</div>
        <div class="text-box">
          <div
            class="first"
            v-for="(item, index) in productDetail.desc"
            :key="index"
          >
            {{ index + 1 }},{{ item }}
          </div>
        </div>
      </div>
      <div class="bottom">
        <van-goods-action>
          <van-goods-action-icon
            icon="bag"
            text="购物袋"
            :badge="Shoppingbagnum > 0 ? Shoppingbagnum : ''"
          ></van-goods-action-icon>
          <van-goods-action-icon
            icon="star"
            :color="iscollection ? '#ffeb3b' : ''"
            :text="iscollection ? '已收藏' : '收藏'"
            @click="likeAndnotlike"
          />
          <van-goods-action-button
            color="#b79a87"
            type="warning"
            text="加入购物袋"
            @click="addShopbag"
          />
          <van-goods-action-button
            color="#c0550d"
            type="danger"
            text="立即购买"
            @click="purchase"
          />
        </van-goods-action>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/detail.less";
export default {
  name: "Detail",
  data() {
    return {
      number: 1,
      productDetail: {},
      iscollection: false,
      Shoppingbagnum: 0,
    };
  },
  created() {
    if (this.$route.params.pid) {
      this.axios({
        method: "get",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.$route.params.pid,
        },
      }).then((res) => {
        if (res.data.code == 600) {
          this.productDetail = res.data.result[0];
          let productDetail = res.data.result[0];
          let typelist = ["cream", "milk", "sugar", "tem"];
          let typeDetail = [];
          typelist.forEach((item) => {
            if (productDetail[item].length != 0) {
              let type = item + "_desc";
              //   切割成数组
              let optionArr = productDetail[item].split("/");
              let obj = {
                title: productDetail[type],
                title_desc: optionArr,
                currenIndex: 0,
              };
              typeDetail.push(obj);
            }
          });
          this.productDetail.typeDetail = typeDetail;
          this.productDetail.desc = this.productDetail.desc.split("\n");
        }
      });
      this.ShoppingbagCount();
      if (localStorage.getItem('tokenString')) {
        this.axios({
          method: "get",
          url: "/findlike",
          params: {
            appkey: this.appkey,
            pid: this.$route.params.pid,
            tokenString: localStorage.getItem('tokenString'),
          },
        }).then((res) => {
          if (res.data.result.length != 0) {
            this.iscollection = true;
          } else {
            this.iscollection = false;
          }
        });
      }
    }else{
      this.$router.go(-1)
    }
  },
  methods: {
    shangyiji() {
      this.$router.go(-1);
    },
    // 查找购物袋的数量
    ShoppingbagCount() {
      if (localStorage.getItem('tokenString')) {
        this.axios({
          method: "get",
          url: "/findAllShopcart",
          params: {
            appkey: this.appkey,
            tokenString: localStorage.getItem('tokenString'),
          },
        }).then((res) => {
          if (res.data.code == 5000) {
            this.Shoppingbagnum = res.data.result.length;
          }
        });
      }
    },
    // 添加到购物袋
    addShopbag() {
      this.$toast.loading({
        message: "加入购物车中...",
        forbidClick: true,
        duration: 0,
      });
      if (!localStorage.getItem('tokenString')) {
        this.$toast.clear();
        this.$dialog
          .confirm({
            title: "用户未登录，登录后才可以进行操作",
            message: "是否返回登录页面",
          })
          .then(() => {
            this.$router.push({ name: "Login" });
          })
          .catch(() => {});
      } else if (localStorage.getItem('tokenString')) {
        let typeDetail = this.productDetail.typeDetail;
        let rule = [];
        typeDetail.forEach((item) => {
          rule.push(item.title_desc[item.currenIndex]);
        });
        //   查询所选规格是否已经存在,如果存在,提醒用户是否继续添加
        this.axios({
          method: "get",
          url: "/findAllShopcart",
          params: {
            appkey: this.appkey,
            tokenString: localStorage.getItem('tokenString'),
          },
        }).then((res) => {
          if (res.data.code === 5000) {
            //   购物袋所有的数据
            let arr = res.data.result;
            // 如果购物车的数量为0，就直接添加
            if (arr.length == 0) {
              this.axios({
                method: "post",
                url: "/addShopcart",
                data: {
                  pid: this.productDetail.pid,
                  count: this.number,
                  rule: rule.join("/"),
                  appkey: this.appkey,
                  tokenString: localStorage.getItem('tokenString'),
                },
              }).then((res) => {
                this.$toast.clear();
                if (res.data.code === 3000) {
                  this.ShoppingbagCount();
                  this.$toast({
                    message: "加入购物车成功",
                    duration: 1500,
                    forbidClick: true,
                  });
                }
              });
              return;
            } else {
              for (var i = 0; i < arr.length; i++) {
                if (arr[i].pid === this.productDetail.pid) {
                  //   规格存在,提醒用户是否继续添加
                  if (arr[i].rule === rule.join("/")) {
                    this.$toast.clear();
                    this.$dialog
                      .confirm({
                        title: "购物袋已有相应的规格",
                        message: "是否继续添加数量",
                      })
                      .then(() => {
                        this.axios({
                          method: "post",
                          url: "/addShopcart",
                          data: {
                            pid: this.productDetail.pid,
                            count: this.number,
                            rule: rule.join("/"),
                            appkey: this.appkey,
                            tokenString: localStorage.getItem('tokenString'),
                          },
                        }).then((res) => {
                          this.number = 1;
                          this.$toast.clear();
                          if (res.data.code === 3000) {
                            this.ShoppingbagCount();
                            this.$toast({
                              message: "加入购物车成功",
                              forbidClick: true,
                              duration: 1000,
                            });
                          } else {
                            this.$toast({
                              message: "加入购物车失败,请稍等再试！",
                              forbidClick: true,
                              duration: 1000,
                            });
                          }
                        });
                      });
                    return;
                  } else {
                    this.$toast.clear();
                    this.axios({
                      method: "post",
                      url: "/addShopcart",
                      data: {
                        pid: this.productDetail.pid,
                        count: this.number,
                        rule: rule.join("/"),
                        appkey: this.appkey,
                        tokenString: localStorage.getItem('tokenString'),
                      },
                    }).then((res) => {
                      this.number = 1;
                      this.$toast.clear();
                      if (res.data.code === 3000) {
                        this.ShoppingbagCount();
                        this.$toast({
                          message: "加入购物车成功",
                          forbidClick: true,
                          duration: 1000,
                        });
                      } else {
                        this.$toast({
                          message: "加入购物车失败,请稍等再试！",
                          forbidClick: true,
                          duration: 1000,
                        });
                      }
                    });
                    return;
                  }
                } else if (i == arr.length - 1) {
                  this.$toast.clear();
                  this.axios({
                    method: "post",
                    url: "/addShopcart",
                    data: {
                      pid: this.productDetail.pid,
                      count: this.number,
                      rule: rule.join("/"),
                      appkey: this.appkey,
                      tokenString: localStorage.getItem('tokenString'),
                    },
                  }).then((res) => {
                    this.number = 1;
                    if (res.data.code === 3000) {
                      this.ShoppingbagCount();
                      this.$toast({
                        message: "加入购物车成功",
                        forbidClick: true,
                        duration: 1000,
                      });
                    } else {
                      this.$toast({
                        message: "加入购物车失败,请稍等再试！",
                        forbidClick: true,
                        duration: 1000,
                      });
                    }
                  });
                  return;
                }
              }
            }
          }
        });
      }

      //
    },
    changeCurrenIndex(index, ind) {
      //   let typeDetail = this.productDetail.typeDetail
      //   let obj = typeDetail[index]
      //   obj.currenIndex = ind
      //   this.productDetail.typeDetail.splice(index,1,obj)
      this.$forceUpdate();
      // 参数一：想要修改的对象（数组），参数二：对象属性（数组索引值） 参数三：想要修改成怎样的值
      this.$set(this.productDetail.typeDetail[index], "currenIndex", ind);
    },
    likeAndnotlike() {
      let tokenString = localStorage.getItem('tokenString');
      if (!tokenString) {
        this.$dialog
          .confirm({
            title: "用户未登录，登录后才可以进行操作",
            message: "返回登录页面",
          })
          .then(() => {
            this.$router.push({ name: "Login" });
          })
          .catch(() => {});
        return;
      }
      if (!this.iscollection) {
        this.like();
      } else {
        this.notlike();
      }
    },
    // 收藏
    like() {
      if (localStorage.getItem('tokenString')) {
        this.$toast.loading({
          message: "收藏中...",
          duration: 0,
          forbidClick: true,
        });
        this.axios({
          method: "POST",
          url: "/like",
          data: {
            appkey: this.appkey,
            pid: this.productDetail.pid,
            tokenString: localStorage.getItem('tokenString'),
          },
        }).then((res) => {
          this.$toast.clear();
          if (res.data.code == 800) {
            this.iscollection = true;
          } else {
            this.$toast({
              message: "收藏失败",
              forbidClick: true,
            });
          }
        });
      }
    },
    // 取消收藏
    notlike() {
      this.$toast.loading({
        message: "取消收藏中...",
        duration: 0,
        forbidClick: true,
      });
      this.axios({
        method: "POST",
        url: "/notlike",
        data: {
          appkey: this.appkey,
          pid: this.productDetail.pid,
          tokenString: localStorage.getItem('tokenString'),
        },
      }).then((res) => {
        this.$toast.clear();
        if (res.data.code == 900) {
          this.iscollection = false;
        } else {
          this.$toast({
            message: "收藏失败",
            forbidClick: true,
          });
        }
      });
    },
    // 修改一条购物车数据
    // 立即结算
    purchase() {
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
            if (result[i].pid === this.productDetail.pid) {
              this.$toast("购物车存在该产品，不能直接购买");
              return;
            }
          }
          let typeDetail = this.productDetail.typeDetail;
          let rule = [];
          typeDetail.forEach((item) => {
            rule.push(item.title_desc[item.currenIndex]);
          });
          this.axios({
            method: "post",
            url: "/addShopcart",
            data: {
              pid: this.productDetail.pid,
              count: this.number,
              rule,
              appkey: this.appkey,
              tokenString: localStorage.getItem('tokenString'),
            },
          }).then((res) => {
            if (res.data.code === 3000) {
              if (res.data.status === 1) {
                this.$router.push({
                  name: "PlaceOrder",
                  params: { sid: res.data.sid },
                });
              }
            }
          });
        }
      });
      //
    },
  },
};
</script>

<style lang="scss" scoped>
</style>