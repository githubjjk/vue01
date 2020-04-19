<template>
  <div class="resContent">
    <el-container>
      <el-aside id="treeAside" width="190px">
        <div>
          <el-tree
            :default-expanded-keys="expandArr"
            @node-collapse="nodeCollapse"
            @node-expand="nodeExpand"
            @node-click="treeClick"
            :data="treeData"
            node-key="id"
            :props="defaultProps"
          ></el-tree>
        </div>
      </el-aside>
      <el-main id="treeMain">
        <div v-if="addResBtn && checkBtnPer('res:add')" class="treeButton">
          <el-button type="primary" @click="addResDiglog" size="small">
            <i class="fa fa-plus" aria-hidden="true"></i>&nbsp;添加菜单
          </el-button>
        </div>
        <div class="treeTable">
          <el-table :data="tableData" :lazy="false" stripe style="width: 100%" row-key="id">
            <el-table-column type="index" label="序号" width="70"></el-table-column>
            <el-table-column prop="lable" label="菜单名称" width="170"></el-table-column>
            <el-table-column label="图标" width="120">
              <template slot-scope="scope">
                <i :class="scope.row.icon"></i>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="100">
              <template slot-scope="scope">
                <p>{{scope.row.type=='0'?"目录菜单":""}}</p>
                <p>{{scope.row.type=='1'?"路由菜单":""}}</p>
                <P>{{scope.row.type=='2'?"按钮菜单":""}}</P>
              </template>
            </el-table-column>
            <el-table-column prop="path" label="组件名" width="120"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  v-if="updateResBtn && checkBtnPer('res:update')"
                  size="mini"
                  @click="resUpdate(scope.row)"
                  type="primary"
                >
                  <i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp;&nbsp;编辑
                </el-button>
                <el-button
                  v-if="deleteResBtn && checkBtnPer('res:delete')"
                  size="mini"
                  @click="resDelete(scope.row)"
                  type="danger"
                >
                  <i class="fa fa-trash" aria-hidden="true"></i>&nbsp;&nbsp;删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
    <!--添加资源弹框-->
    <el-dialog
      title="添加资源"
      @close="addResClose('addResForm')"
      :visible.sync="addResFlag"
      width="330px"
      custom-class="roleAddForm"
    >
      <el-form
        :model="resAddForm"
        :rules="resAddRules"
        ref="addResForm"
        label-width="80px"
        class="demo-ruleForm"
        size="mini"
        label-position="left"
      >
        <el-form-item label="菜单名称" prop="name" class="editorName">
          <el-input placeholder="菜单名称" v-model="resAddForm.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路由" prop="path" class="editorName">
          <el-input placeholder="菜单路由" v-model="resAddForm.path"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type" class="editorName">
          <el-input placeholder="菜单类型" :disabled="true" v-model="resAddForm.type"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" class="editorName">
          <el-input placeholder="菜单图标" v-model="resAddForm.icon"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addResSubmit('addResForm')">提交</el-button>
          <el-button @click="addResReset('addResForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改资源form-->
    <el-dialog
      title="修改资源"
      @close="updateResClose('updateResForm')"
      :visible.sync="updateResFlag"
      width="330px"
      custom-class="roleUpdateForm"
    >
      <el-form
        :model="resUpdateForm"
        :rules="resUpdateRules"
        ref="updateResForm"
        label-width="80px"
        class="demo-ruleForm"
        size="mini"
        label-position="left"
      >
        <el-form-item label="菜单名称" prop="name" class="editorName">
          <el-input placeholder="菜单名称" v-model="resUpdateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路由" prop="path" class="editorName">
          <el-input placeholder="菜单路由" v-model="resUpdateForm.path"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" class="editorName">
          <el-input placeholder="菜单图标" v-model="resUpdateForm.icon"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateResSubmit('updateResForm')">提交</el-button>
          <el-button @click="updateResReset('updateResForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import store from "@/store";
export default {
  computed: {
    ...mapGetters(["per_btn"])
  },
  data() {
    return {
      //菜单树
      treeData: [],
      defaultProps: {
        children: "child",
        label: "lable"
      },
      //表格数据
      tableData: [],
      //资源添加表单
      addResFlag: false,
      //编辑菜单表单
      updateResFlag: false,
      //被点击的节点
      nodeFlag: null,
      //添加菜单表单预选值
      resAddForm: {
        name: "",
        icon: "",
        path: "",
        type: ""
      },
      //添加菜单表单预选值
      resUpdateForm: {
        id: "",
        name: "",
        icon: "",
        path: "",
        type: "",
        enable: "",
        parentId: ""
      },
      //添加资源按钮标识
      addResBtn: false,
      //编辑菜单按钮标识
      updateResBtn: true,
      //删除菜单按钮标识
      deleteResBtn: true,
      //菜单添加验证规则
      resAddRules: {
        name: [{ required: true, message: "请填菜单名称", trigger: "blur" }],
        icon: [
          { required: true, message: "图标样式不能为空", trigger: "blur" }
        ],
        path: [{ required: true, message: "请填路由路经", trigger: "blur" }]
      },
      //菜单编辑验证规则
      resUpdateRules: {
        name: [{ required: true, message: "请填菜单名称", trigger: "blur" }],
        icon: [
          { required: true, message: "图标样式不能为空", trigger: "blur" }
        ],
        path: [{ required: true, message: "请填路由路经", trigger: "blur" }]
      },
      //被点击展开的树节点id
      expandArr: []
    };
  },
  mounted() {
    //获取菜单树
    let that = this;
    this.$ajax({
      url: "/api/authFun/res/findResTree",
      method: "get"
    }).then(res => {
      this.treeData = res.data;
      this.tableData = null;
    });
  },
  methods: {
    /**
     * 树节点点击事件
     */
    treeClick: function(data) {
      if (data.type == "2") {
        this.addResBtn = false;
      } else {
        this.addResBtn = true;
        this.nodeFlag = data;
        this.tableData = data.child;
      }
    },
    /**
     * 添加菜单弹窗
     */
    addResDiglog: function() {
      let type = this.nodeFlag == null ? null : this.nodeFlag.type;
      if (type == -1) {
        this.resAddForm.type = "目录菜单";
      } else if (type == "0") {
        this.resAddForm.type = "路由菜单";
      } else if (type == "1") {
        this.resAddForm.type = "按钮";
      }
      this.addResFlag = true;
    },
    /**
     * 添加菜单弹窗
     */
    updateResDiglog: function() {
      this.updateResFlag = true;
    },
    /**
     * 重置菜单表单
     */
    addResReset(formName) {
      this.$refs[formName].resetFields();
    },
    /**
     * 重置菜单表单
     */
    updateResReset(formName) {
      this.resUpdateForm = {
        id: this.resUpdateForm.id,
        name: "",
        icon: "",
        path: ""
      };
      this.$refs[formName].resetFields();
    },
    /**
     * 添加菜单提交
     */
    addResSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //数据处理
          if (this.nodeFlag == null) {
            this.resAddForm.parentId = 0;
            this.resAddForm.level = 0;
            this.resAddForm.enable = 0;
            this.resAddForm.type = 0;
          } else {
            this.resAddForm.parentId = this.nodeFlag.id;
            this.resAddForm.level = this.nodeFlag.level + 1;
            this.resAddForm.enable = 0;
            this.resAddForm.type = parseInt(this.nodeFlag.type) + 1;
          }
          this.$ajax({
            url: "/api/authFun/res/saveRes",
            method: "post",
            data: this.resAddForm
          }).then(res => {
            if (
              null == this.nodeFlag.child ||
              this.nodeFlag.child == undefined
            ) {
              this.nodeFlag.child = [];
              this.nodeFlag.child.push(res.data);
            } else {
              this.nodeFlag.child.push(res.data);
            }
            //菜单更新
            this.$ajax({
              url: "/api/authFun/res/findResTree",
              method: "get"
            }).then(res => {
              this.treeData = res.data;
            });
            this.addResFlag = false;
            //提示
            this.$message({
              message: res.msg,
              type: "success"
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 编辑菜单提交
     */
    updateResSubmit: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //数据处理
          this.$ajax({
            url: "/api/authFun/res/saveRes",
            method: "POST",
            data: this.resUpdateForm
          }).then(res => {
            //菜单更新
            this.$ajax({
              url: "/api/authFun/res/findResTree",
              method: "get"
            }).then(res => {
              //更新被选中的菜单table
              let treeData = res.data;
              this.$ajax({
                url: "/api/authFun/res/findNextRes/" + this.nodeFlag.id,
                method: "get"
              }).then(res => {
                this.treeData = treeData;
                this.tableData = res.data;
                this.nodeFlag.child = res.data;
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.updateResFlag = false;
              });
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 添加菜单弹框关闭
     */
    addResClose(formName) {
      this.resAddForm = {
        name: "",
        icon: "",
        path: "",
        type: ""
      };
      this.$refs[formName].resetFields();
    },
    /**
     * 添加菜单弹框关闭
     */
    updateResClose(formName) {
      this.resUpdateForm = {
        id: this.resUpdateForm.id,
        name: "",
        icon: "",
        path: "",
        type: ""
      };
      this.$refs[formName].resetFields();
    },
    /**
     * 删除菜单
     */
    resDelete(data) {
      this.$confirm("确认删除菜单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$ajax({
            url: "/api/authFun/res/deleteRes/" + data.id,
            method: "get"
          }).then(res => {
            //更新树
            this.$ajax({
              url: "/api/authFun/res/findResTree",
              method: "get"
            }).then(res => {
              this.treeData = res.data;
              let treeChild = this.nodeFlag.child;
              let index = -1;
              for (let i in treeChild) {
                if (treeChild[i].id == data.id) {
                  index = i;
                }
              }
              treeChild.splice(index, 1);
              this.tableData = treeChild;
              this.$message({
                type: "success",
                message: res.msg + "!"
              });
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * 编辑菜单
     */
    resUpdate: function(data) {
      let id = data.id;
      let child = this.nodeFlag.child;
      for (let i in child) {
        if (child[i].id == id) {
          this.resUpdateForm.id = id;
          this.resUpdateForm.name = child[i].lable;
          this.resUpdateForm.path = child[i].path;
          this.resUpdateForm.icon = child[i].icon;
          this.resUpdateForm.type = child[i].type;
          this.resUpdateForm.enable = "0";
          this.resUpdateForm.parentId = this.nodeFlag.id;
        }
      }
      this.updateResFlag = true;
    },
    /**
     * 节点展开事件
     */
    nodeExpand: function(myNodeObj) {
      let id = myNodeObj.id;
      let arr = this.expandArr;
      //true数组不存在id,false存在
      let flag = true;
      if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] == id) {
            flag = false;
          }
        }
      }
      if (flag) {
        arr.push(id);
      }
    },
    /**
     * 树组件闭合事件
     */
    nodeCollapse: function(myNodeObj) {
      let id = myNodeObj.id;
      let arr = this.expandArr;
      let index = -1;
      if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] == id) {
            index = i;
          }
        }
        arr.splice(index, 1);
      }
    }
  }
};
</script>


<style>
@import url(../../../static/css/resList.css);
</style>

