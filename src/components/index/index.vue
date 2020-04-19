<template>
  <el-container v-bind:style="{height:boxHeight+'px'}">
    <el-header class="header">
      <div class="logo">
        <img src="../../assets/logo.png" />
      </div>
      <div class="h-navigation"></div>
      <div class="h-userMsg">
        <div class="hu-content">
          <div class="hu-userName">
            <i class="fa fa-address-card-o fa-1x"></i>
            &nbsp;
            姓名：{{name}}
          </div>
          <div class="hu-userRole">
            <i class="fa fa-user-o fa-1x"></i>
            &nbsp;&nbsp;
            角色：{{roleName}}
          </div>
          <div class="hu-loginOut" @click="loginOut()">
            <i class="fa fa-window-close-o fa-2x" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside class="left" v-bind:style="{width:leftWidth}">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu>
              <el-submenu
                v-for="(leftM,key1) in resList"
                :key="key1"
                default-openeds="['0']"
                :index="key1+''"
              >
                <template slot="title">
                  <i :class="leftM.icon"></i>
                  <span>{{leftM.lable}}</span>
                </template>
                <el-menu-item-group
                  v-if="leftM.child!=null"
                  v-for="(treeC,key) in leftM.child"
                  :key="key"
                >
                  <el-menu-item
                    :index="key1+'-'+key"
                    @click="treeClick(key,treeC.type,treeC.path,treeC.lable,treeC.child)"
                  >
                    <i :class="treeC.icon"></i>
                    {{treeC.lable}}
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-main class="content">
          <div class="tagTitle">
            <el-tag
              v-for="(tag, key) in tags"
              :key="tag.name"
              closable
              :type="tag.type"
              hit
              class="indexTag"
              @click="tagClick(key)"
              @close="tagClose(key)"
              :class="{tagFocus:tag.focus}"
            >{{tag.name}}</el-tag>
          </div>
          <el-container class="tagView">
            <transition
              mode="out-in"
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <router-view></router-view>
            </transition>
          </el-container>
        </el-main>
        <el-footer class="footer">Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import store from "../../store";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["per_btn", "resList"])
  },
  data() {
    return {
      boxHeight: "",
      leftWidth: "250px",
      //标签导航初始化
      tags: [{ name: "首页", type: "", focus: true, path: "default1" }],
      //头部菜单初始化
      titleMenu: true,
      //默认的菜单
      defaultMenu: [],
      //用户姓名
      name: "你好",
      //用户角色
      roleName: "测试角色"
    };
  },
  mounted() {
    // let url = "ws://127.0.0.1:8081/myWebSocket/123n";
    // let ws = null;
    // try {
    //   ws = new WebSocket(url);
    // } catch (e) {
    //   console.log(e);
    // }
    // ws.onclose = function() {
    //   console.log("链接关闭");
    // };
    // ws.onerror = function() {
    //   console.log("发生异常了");
    // };
    // ws.onopen = function() {
    //   //心跳检测重置
    //   console.log("开始连接");
    // };
    // ws.onmessage = function(event) {
    //   //拿到任何消息都说明当前连接是正常的
    //   console.log("接收到消息");
    // };

    var that = this;
    //动态获取高度
    this.boxHeight = document.documentElement.clientHeight;
    //挂载屏幕监听事件
    window.onresize = () => {
      return (() => {
        if (document.body.clientWidth > 1080) {
          that.leftWidth = "250px";
        }
      })();
    };
    //在这里将user信息赋值给对应变量
    this.$router.replace({ name: "default1" });
    //获取用户信息(角色，菜单)
    this.$ajax({
      url: "/api/authFun/admin/findAdminRole",
      method: "POST",
      data: {
        token: that.$cookie.get("AccessToken")
      }
    }).then(res => {
      this.name = res.data.name;
      this.roleName = res.data.roles[0];
    });
    store.dispatch("per_btn/findResByAdmin", that.$cookie.get("AccessToken"));
  },
  methods: {
    // 导航路由
    checkRouter(url, key) {
      console.log(url);
      let tag = new Object();
      tag.name = "标签";
      tag.type = "";
      tag.focus = false;
      tag.path = "";
      tag.children = {};
      this.tags.push(tag);
    },

    //导航被按下的时候
    tagClick(index) {
      //获取上次被选中的页签
      let tagFocus = sessionStorage.getItem("tagFocus");
      for (let i = 0; i < this.tags.length; i++) {
        this.tags[i].focus = false;
      }
      console.log(this.tags[index]);
      this.tags[index].focus = true;
      this.$router.replace({
        name: this.tags[index].path
      });
    },

    //标签关闭事件
    tagClose(key) {
      console.log(key);
      if (key != 0) {
        this.tags.splice(key, 1);
        //聚焦
        sessionStorage.setItem("tagFocus", this.tags.length - 1);
        this.tags[this.tags.length - 1].focus = true;
        console.log("query=", this.tags[this.tags.length - 1].childObj);
        //跳转
        this.$router.replace({
          name: this.tags[this.tags.length - 1].path
        });
      }
    },
    //导航菜单点击事件
    navTitle(index) {
      console.log(index);
      //在这里进行defaultMenu菜单栏切换
      this.defaultMenu = this.loginUser.menus[index].childM;
      console.log(this.defaultMenu);
    },

    //树菜单点击事件
    treeClick(index, type, path, title, children) {
      //是否功能菜单
      if (type === "1") {
        //标签渲染
        let repeat = false;
        for (let a = 0; a < this.tags.length; a++) {
          this.tags[a].focus = false;
        }
        for (var i = 0; i < this.tags.length; i++) {
          if (this.tags[i].name.search(title) == -1) {
            repeat = true;
          } else {
            repeat = false;
            break;
          }
        }
        if (repeat) {
          this.tags.push({
            type: type,
            focus: true,
            path: path,
            name: title
          });
          sessionStorage.setItem("tagFocus", this.tags.length - 1);
        } else {
          for (var i = 0; i < this.tags.length; i++) {
            if (title.indexOf(this.tags[i].name) != -1) {
              this.tags[i].focus = true;
            }
          }
        }
        //跳转
        this.$router.replace({
          name: path
        });
      }
    },

    /*系统退出*/
    loginOut() {
      let that = this;
      this.$confirm("你要退出系统吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$ajax({
            url: "/api/auth/loginOut",
            method: "post",
            data: {
              token: that.$cookie.get("AccessToken")
            }
          })
            .then(res => {
              that.$cookie.delete("AccessToken");
              that.$router.replace({
                name: "login"
              });
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出！"
          });
        });
    }
  }
};
</script>

<style scoped>
@import url(../../../static/css/index.css);
</style>
