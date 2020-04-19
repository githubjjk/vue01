<template>
  <div class="boxContent">
    <div class="rHead">
      <div class="treeNav">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="treeAdd">
        <el-button
          type="primary"
          size="small"
          @click="menuAdd()"
          v-for="(button,key) in buttonView"
          :key="key"
          v-if="button.mName.indexOf('添加菜单')!=-1"
        >
          <i :class="button.mIcon"></i>
          &nbsp;{{button.mName}}
        </el-button>
      </div>
    </div>
    <el-container class="treeContent">
      <el-aside width="200px" class="menuTree">
        <el-tree
          @node-click="treeNodeClick"
          :expand-on-click-node="false"
          :render-content="permissionRender"
          :default-expand-all="true"
          :data="treeData"
          :props="treeProp"
        ></el-tree>
      </el-aside>
      <el-main>
        <el-table border :data="tableData" style="width: 100%" max-height="580" size="small">
          <el-table-column prop="mid" label="mid" width="60"></el-table-column>
          <el-table-column prop="mName" label="名称"></el-table-column>
          <el-table-column prop="mLevel" label="等级"></el-table-column>
          <el-table-column prop="mType" label="类型"></el-table-column>
          <el-table-column prop="mComponentName" label="组件名称"></el-table-column>
          <el-table-column fixed="right" prop="zip" label="编辑" width="160" v-if="editor">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="incident(scope.row,button.mUrl)"
                v-for="(button,key) in buttonView"
                :key="key"
                v-if="button.mName.indexOf('添加菜单')==-1"
              >
                <i :class="button.mIcon"></i>
                &nbsp;{{button.mName}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <!--编辑树菜单弹出框-->
    <el-dialog title="编辑资源" :visible.sync="editorResource" width="330px" custom-class="roleAddForm">
      <el-form
        :model="editorForm"
        :rules="editorRules"
        ref="editorForm"
        label-width="80px"
        class="demo-ruleForm"
        size="mini"
      >
        <el-form-item label="菜单名称" prop="mName" class="editorName">
          <el-input v-model="editorForm.mName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="mIcon">
          <el-input v-model="editorForm.mIcon" placeholder="请输入菜单图标"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editorSubmit('editorForm')">提交</el-button>
          <el-button @click="editorReset('editorForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加资源-->
    <el-dialog
      title="添加资源"
      :visible.sync="addResource"
      @close="addResourceClose('addResourceForm')"
      width="330px"
      custom-class="roleAddForm"
    >
      <el-form
        :model="menuAddForm"
        :rules="menuAddRules"
        ref="addResourceForm"
        label-width="80px"
        class="demo-ruleForm"
        size="mini"
        label-position="left"
      >
        <el-form-item label="类型" prop="menuTypeVal" class="editorName">
          <el-select v-model="menuAddForm.menuTypeVal" placeholder="请选择菜单类型" @change="menuType">
            <el-option
              v-for="(menu,index) in menuTypes"
              :key="index"
              :label="menu.name"
              :value="menu.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级菜单" prop="mFatherId" class="editorName" v-if="fNameSh">
          <el-select v-model="menuAddForm.mFatherId" placeholder="父级菜单名称">
            <el-option
              v-for="(menu2,key) in fatherMenus"
              :key="key"
              :label="menu2.name"
              :value="menu2.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="mName" class="editorName">
          <el-input placeholder="菜单名称" v-model="menuAddForm.mName"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="mIcon" class="editorName">
          <el-input placeholder="菜单图标" v-model="menuAddForm.mIcon"></el-input>
        </el-form-item>
        <el-form-item label="菜单路由" prop="mPage" class="editorName" v-if="mPageSh">
          <el-input placeholder="菜单路由" v-model="menuAddForm.mPage"></el-input>
        </el-form-item>
        <el-form-item label="菜单方法" prop="mUrl" class="editorName" v-if="mUrlSh">
          <el-input placeholder="菜单方法" v-model="menuAddForm.mUrl"></el-input>
        </el-form-item>
        <el-form-item label="组件名称" prop="mComponentName" class="editorName" v-if="mComponentNameSh">
          <el-input placeholder="组件名称" v-model="menuAddForm.mComponentName"></el-input>
        </el-form-item>
        <el-form-item label="按钮类型" prop="mButtonType" class="editorName" v-if="mButtonTypeSh">
          <el-select v-model="menuAddForm.mButtonType" placeholder="父级菜单名称">
            <el-option
              v-for="(btn,key) in buttonTypes"
              :key="key"
              :label="btn.name"
              :value="btn.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addResourceSubmit('addResourceForm')">提交</el-button>
          <el-button @click="addResourceReset('addResourceForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { judgeArgsIsNull } from "@/assets/utils/utils.js";
export default {
  data() {
    var mName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 7) {
        return callback(new Error("菜单名为2-7个字符"));
      } else {
        this.$ajax({
          url: "/role/checkMenuName.action",
          method: "post",
          params: {
            mName: value
          }
        })
          .then(res => {
            if (res.data.state != "ok") {
              console.log("state=", res.data.state);
              console.log("msg=", res.data.message);
              return callback(new Error("菜单名已经存在"));
            } else {
              return callback();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    };
    var mPage = (rule, value, callback) => {
      if (value.length > 30) {
        return callback(new Error("组件路径长度不能超过30"));
      } else {
        this.$ajax({
          url: "/role/checkMpageIsRepeat.action",
          method: "POST",
          params: {
            mPage: value
          }
        })
          .then(res => {
            if (res.data.state != "ok") {
              return callback(new Error(res.data.message));
            } else {
              return callback();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    };
    //检查方法名规则
    var mUrl = (rule, value, callback) => {
      this.$ajax({
        url: "/role/checkMurlIsRepeat.action",
        method: "POST",
        params: {
          mUrl: value
        }
      })
        .then(res => {
          if (res.data.state != "ok") {
            return callback(new Error(res.data.message));
          } else {
            return callback();
          }
        })
        .catch(error => {
          console.log(error);
        });
    };
    var mComponentName = (rule, value, callback) => {
      if (value.length > 20) {
        return callback(new Error("组件名长度不能超过20"));
      } else {
        this.$ajax({
          url: "/role/checkMurlIsRepeat.action",
          method: "POST",
          params: {
            mUrl: value
          }
        })
          .then(res => {
            if (res.data.state != "ok") {
              return callback(new Error(res.data.message));
            } else {
              return callback();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    };
    return {
      //按钮权限
      buttonView: [],
      //菜单树数据
      treeData: null,
      //父按钮id
      buttonId: null,
      //菜单树默认格式
      treeProp: {
        id: "id",
        label: "label",
        children: "children",
        icon: "icon"
      },
      //菜单细节表格
      tableData: null,
      //编辑栏目显示标识
      editor: false,
      //编辑菜单弹框
      editorResource: false,
      //编辑菜单表单
      editorForm: {
        mName: "",
        mIcon: "",
        mid: ""
      },
      editorRules: {
        mName: [{ validator: mName, trigger: "blur" }],
        mIcon: {
          required: true,
          message: "图标不能为空",
          trigger: "blur"
        }
      },
      //资源添加表单
      addResource: false,
      //添加菜单表单预选值
      menuAddForm: {
        mName: "",
        mIcon: "",
        mPage: "",
        mUrl: "",
        mComponentName: "",
        mButtonType: "",
        menuTypeVal: "",
        mFatherId: ""
      },
      //菜单添加验证规则
      menuAddRules: {
        menuTypeVal: [
          { required: true, message: "请选则菜单类型", trigger: "blur" }
        ],
        mFatherId: [
          { required: true, message: "请选则父菜单", trigger: "blur" }
        ],
        mName: [
          { validator: mName, trigger: "blur" },
          { required: true, message: "请填写组件名称", trigger: "blur" }
        ],
        mIcon: [
          { required: true, message: "图标样式不能为空", trigger: "blur" }
        ],
        mPage: [
          { validator: mPage, trigger: "blur" },
          { required: true, message: "请填路由路经", trigger: "blur" }
        ],
        mUrl: [
          { validator: mUrl, trigger: "blur" },
          { required: true, message: "请填写菜单方法", trigger: "blur" }
        ],
        mComponentName: [
          { validator: mComponentName, trigger: "blur" },
          { required: true, message: "请填写组件名称", trigger: "blur" }
        ],
        mButtonType: [
          { required: true, message: "请选择菜单类型", trigger: "blur" }
        ]
      },
      //菜单类型
      menuTypes: [
        { name: "导航菜单", value: 0 },
        { name: "树菜单", value: 1 },
        { name: "路由菜单", value: 2 },
        { name: "按钮菜单", value: 3 }
      ],
      //按钮类型
      buttonTypes: [
        { name: "新增按钮", value: 0 },
        { name: "修改按钮", value: 1 },
        { name: "删除按钮", value: 2 }
      ],
      //父级菜单
      fatherMenus: [{ mName: "父级菜单", mid: -1 }],
      //添加菜单弹框显示设置
      fNameSh: true,
      mPageSh: true,
      mUrlSh: true,
      mComponentNameSh: true,
      mButtonTypeSh: true
    };
  },
  mounted() {
    //进行button按钮加载
    this.buttonId = this.$route.query.childObj;
    console.log("buttonId=", this.buttonId);
    /**
     * 获取该登录用户的菜单树
     */
    this.getAdminPermissionAndDetail(this.buttonId, this);
  },
  methods: {
    /**
     * 获取该登录用户的菜单树
     */
    getAdminPermissionAndDetail(buttonId, that) {
      that
        .$ajax({
          url: "/role/getAdminPermissionAndDetail.action",
          method: "post",
          params: {
            buttonId: buttonId
          }
        })
        .then(function(response) {
          if (response.data.state == "ok") {
            console.log("state=", response.data.state);
            that.treeData = response.data.resultObj.treeMenus;
            that.buttonView = response.data.resultObj.buttonView;
            that.tableData = that.$options.methods.menusTypeClassify(
              response.data.resultObj.menus
            );
            let buttonView = that.buttonView;
            console.log(buttonView);
            if (buttonView.length > 0) {
              for (let i = 0; i < buttonView.length; i++) {
                if (!judgeArgsIsNull(buttonView[i].mButtonType)) {
                  if (
                    // eslint-disable-next-line eqeqeq
                    buttonView[i].mButtonType == "1" ||
                    buttonView[i].mButtonType == "2"
                  ) {
                    that.editor = true;
                  }
                }
              }
            }
          } else {
            console.log(response.data.state);
            console.log(response.data.messgae);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    /**自定义树渲染模板 */
    permissionRender(h, { node, data, store }) {
      return (
        <span>
          <i class={data.icon} />
          <span style="margin-left:5px">{node.label}</span>
        </span>
      );
    },
    /**菜单类型分类 */
    menusTypeClassify(menus) {
      if (menus.length > 0) {
        for (let i = 0; i < menus.length; i++) {
          if (menus[i].mLevel == "0") {
            menus[i].mType = "导航";
          } else if (menus[i].mLevel == "1") {
            menus[i].mType = "标题";
          } else if (menus[i].mLevel == "2") {
            menus[i].mType = "路由";
          } else if ((menus[i].mLevel = "3")) {
            menus[i].mType = "按钮";
          }
        }
      }
      return menus;
    },
    /**树节点击时间 */
    treeNodeClick(data) {
      console.log(data);
      if (judgeArgsIsNull(data)) {
        console.log("树id不能为空");
        return;
      }
      let id = data.id;
      this.$ajax({
        url: "/role/getMenusByFtherIdAndAid.action",
        method: "post",
        params: {
          mFatherId: id
        }
      })
        .then(res => {
          if (res.data.state == "ok") {
            this.tableData = this.$options.methods.menusTypeClassify(
              res.data.resultObj.menus
            );
          } else {
            console.log("state=", res.data.state);
            console.log("message=", res.data.messgae);
          }
        })
        .catch(error => {});
    },
    /**编辑删除按钮启动事件 */
    incident(data, methodName) {
      this.$options.methods[methodName](data, this);
    },
    /**编辑资源按钮 */
    updateMenu(data, that) {
      console.log(data);
      that.editorResource = true;
      that.editorForm.mName = data.mName;
      that.editorForm.mIcon = data.mIcon;
      that.editorForm.mid = data.mid;
    },
    /**提交编辑菜单表单 */
    editorSubmit(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          that
            .$ajax({
              url: "/role/updateMenu.action",
              method: "POST",
              params: {
                mid: that.editorForm.mid,
                mName: that.editorForm.mName,
                mIcon: that.editorForm.mIcon
              }
            })
            .then(res => {
              if (res.data.state != "ok") {
                console.log(res.data.state);
                console.log(res.data.message);
              } else {
                that.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "success"
                });
                that.editorResource = false;
                //更新菜单细节界面
                that.$options.methods.getAdminPermissionAndDetail(
                  that.buttonId,
                  that
                );
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**重置菜单表单 */
    editorReset(formName) {
      this.$refs[formName].resetFields();
      this.editorForm.mName = "";
      this.editorForm.mIcon = "";
    },
    /**删除菜单 */
    deleteMenu(data, that) {
      that
        .$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          that
            .$ajax({
              url: "/role/deleteMenu.action",
              method: "POST",
              params: {
                mid: data.mid
              }
            })
            .then(res => {
              console.log(res.data);
              if (res.data.state != "ok") {
                that.$message({
                  type: "error",
                  message: res.data.message
                });
              } else {
                that.$message({
                  type: "success",
                  message: "删除成功!"
                });
                //更新数据
                that.$options.methods.getAdminPermissionAndDetail(
                  that.buttonId,
                  that
                );
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //菜单类型选中
    menuType(value) {
      //在这里进行隐藏与显示操作
      this.menuAddForm.mName = "";
      this.menuAddForm.mIcon = "";
      this.menuAddForm.mPage = "";
      this.menuAddForm.mUrl = "";
      this.menuAddForm.mComponentName = "";
      this.menuAddForm.mButtonType = "";
      this.menuAddForm.mFatherId = "";
      if (value == 0) {
        //导航菜单
        this.fNameSh = false;
        this.mPageSh = false;
        this.mUrlSh = false;
        this.mComponentNameSh = false;
        this.mButtonTypeSh = false;
        return;
      } else if (value == 1) {
        //树菜单
        this.fNameSh = true;
        this.mPageSh = false;
        this.mUrlSh = false;
        this.mComponentNameSh = false;
        this.mButtonTypeSh = false;
      } else if (value == 2) {
        //路由菜单
        this.fNameSh = true;
        this.mPageSh = true;
        this.mUrlSh = false;
        this.mButtonTypeSh = false;
        this.mComponentNameSh = true;
      } else if (value == 3) {
        //按钮
        this.fNameSh = true;
        this.mPageSh = true;
        this.mButtonTypeSh = true;
        this.mComponentNameSh = false;
        this.mPageSh = false;
      }

      this.$ajax({
        url: "/role/getMenuTypeByMLevel.action",
        method: "post",
        params: {
          mLevel: value - 1
        }
      })
        .then(res => {
          console.log(res.data.resultObj);
          if (res.data.state == "ok") {
            if (res.data.resultObj.length > 0) {
              this.value1 = "";
              this.fatherMenus = res.data.resultObj;
            }
          } else {
            console.log(res.data.state);
            console.log(res.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //添加菜单弹框
    menuAdd() {
      this.addResource = true;
    },
    //添加菜单弹框关闭
    addResourceClose(formName) {
      this.menuAddForm = {
        mName: "",
        mIcon: "",
        mPage: "",
        mUrl: "",
        mComponentName: "",
        mButtonType: "",
        menuTypeVal: "",
        mFatherId: ""
      };
      this.$refs[formName].resetFields();
      this.fNameSh = true;
      this.mPageSh = true;
      this.mUrlSh = true;
      this.mComponentNameSh = true;
      this.mButtonTypeSh = true;
    },
    //添加菜单提交
    addResourceSubmit(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let mt = that.menuAddForm.menuTypeVal;
          let menu = {};
          for (let key in that.menuAddForm) {
            if (that.menuAddForm[key] != "") {
              menu[key] = that.menuAddForm[key];
            }
          }
          console.log(that.menuAddForm);
          that
            .$ajax({
              url: "/role/addMenus.action",
              methos: "post",
              params: {
                menuType: mt,
                menu: menu
              }
            })
            .then(res => {
              console.log(res);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加菜单重置
    addResourceReset(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
@import url(../../../static/css/treeList.css);
</style>