<template>
  <div class="boxContent">
    <div class="rHead">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="roleBreadcrumb">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="roleAdd">
        <el-button
          v-if="addRoleView && checkBtnPer('role:add')"
          type="primary"
          size="small"
          @click="roleAdd()"
        >
          <i class="fa fa-user-plus"></i>
          角色添加
        </el-button>
      </div>
    </div>
    <div class="rContent">
      <el-table :data="tableData" border style="width:100%" v-loading="loading" row-key="id">
        <el-table-column type="index" label="序号" width="180"></el-table-column>
        <el-table-column prop="rname" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="rsign" label="角色代号" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="updateRoleView && checkBtnPer('role:update')"
              size="small"
              @click="updateRoleWindow(scope.row)"
            >
              <i class="fa fa-user-circle"></i>
              &nbsp;
              修改
            </el-button>
            <el-button
              v-if="perRoleView && checkBtnPer('role:per')"
              size="small"
              @click="updatePermission(scope.row.rid)"
              type="primary"
            >
              <i class="fa fa-check-square"></i>
              &nbsp;
              授权
            </el-button>
            <el-button
              v-if="linkRoleView && checkBtnPer('role:user')"
              size="small"
              @click="linkRoleUser(scope.row.rid)"
              type="primary"
              plain
            >
              <i class="fa fa-link"></i>
              &nbsp;
              关联人员
            </el-button>
            <el-button
              v-if="deleteRoleView && checkBtnPer('role:delete')"
              size="small"
              @click="deleteRole(scope.row.rsign, scope.row.rid)"
              type="danger"
            >
              <i class="fa fa-user-times"></i>
              &nbsp;
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="pageSizeChange"
          @current-change="currentPageChange"
          :current-page="currPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
        ></el-pagination>
      </div>
    </div>
    <!--以下是其他模块加载时需要调用-->
    <!--角色添加表单调用-->
    <el-dialog
      title="角色添加"
      :visible.sync="dialogFormVisible"
      width="300px"
      custom-class="roleAddForm"
      @close="roleAddStop('addForm')"
    >
      <el-form :model="addForm" ref="addForm" :rules="rules" label-width="80px" size="mini">
        <el-form-item label="角色名称" prop="rname">
          <el-input class="addRoleName" v-model="addForm.rname" placeholder="请填写角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="rsign">
          <el-input class="addRoleName" v-model="addForm.rsign" placeholder="请填写角色代号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleAddStop('addForm')">取 消</el-button>
        <el-button type="primary" v-on:click="addRoleSure('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑角色表单-->
    <el-dialog
      title="角色修改"
      :visible.sync="updateFormVisible"
      width="300px"
      custom-class="roleAddForm"
      @close="roleUpdateStop('updateForm')"
    >
      <el-form
        :model="updateForm"
        ref="updateForm"
        :rules="updateRules"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="角色名称" prop="rname">
          <el-input
            class="addRoleName"
            v-model="updateForm.rname"
            :disabled="updateForm.rsign=='super'"
            placeholder="请填写角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色代号" prop="rsign">
          <el-input
            class="addRoleName"
            v-model="updateForm.rsign"
            :disabled="updateForm.rsign=='super'"
            placeholder="请填写角色代号"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleUpdateStop('updateForm')">取 消</el-button>
        <el-button
          type="primary"
          :disabled="updateForm.rsign=='super'"
          v-on:click="roleUpdateSure('updateForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!--修改权限菜单弹框-->
    <el-dialog
      title="菜单授权"
      :visible.sync="permissionsTreeUpdate"
      width="250px"
      custom-class="roleAddForm"
    >
      <el-tree
        :render-content="permissionRender"
        :data="permissionsTreeData"
        :props="permissionProp"
        @node-click="handleNodeClick"
        node-key="id"
        show-checkbox
        default-expand-all
        highlight-current
        :default-checked-keys="buttonPermissionId"
        @check="refreshTreeCheckId"
      ></el-tree>
      <div class="updatePermissionButton">
        <el-button type="primary" size="small" v-on:click="updatePermissionSure">确认修改</el-button>
      </div>
    </el-dialog>
    <!--人员关联选择弹框-->
    <el-dialog
      custom-class="roleAddForm"
      title="关联人员"
      :visible.sync="linkRoleUserVisible"
      width="450px"
      @close="linkRoleUserClose"
    >
      <el-form :inline="true" class="userTableInput">
        <el-form-item>
          <el-input v-model="userTableInput.name" placeholder="请输入姓名" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" size="mini" @click="utSearchAdmin">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        size="mini"
        :data="userTableData"
        @select="linkRoleUserCheckBox"
        @select-all="linkRoleUserCheckAll"
        ref="adminTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column property="name" label="姓名" width="180"></el-table-column>
        <el-table-column property="username" label="用户名"></el-table-column>
      </el-table>
      <div class="userTablePage" v-if="utTotal>0">
        <el-pagination
          small
          layout="prev, pager, next"
          @current-change="utCurrentChange"
          :current-page.sync="utCurrPage"
          :page-size="utPageSize"
          :total="utTotal"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="linkRoleUserClose">取 消</el-button>
        <el-button type="primary" size="mini" @click="adminRoleLinkSure">确 定</el-button>
      </div>
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
      //人员列表弹框默认分页条数
      utPageSize: 10,
      //人员列表弹框默认当前页
      utCurrPage: 1,
      //人员列表弹框默认总条数
      utTotal: 0,
      //关联人员弹窗姓名表单
      userTableInput: {
        name: ""
      },
      //角色人员关联弹框
      linkRoleUserVisible: false,
      //人员关联列表
      userTableData: [],
      tableData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      //修改权限弹框
      permissionsTreeUpdate: false,
      //修改角色弹框
      updateFormVisible: false,
      addForm: {
        rname: "",
        enable: "0",
        rsign: ""
      },
      //编辑角色信息
      updateForm: {
        rname: "",
        enable: "",
        rsign: ""
      },
      //当前页码
      currPage: 1,
      //默认分页个数
      pageSize: 10,
      //数据总数
      totals: 0,
      //添加角色表单验证规则
      rules: {
        rname: [{ required: true, message: "请输入角色名", trigger: "blur" }],
        rsign: [{ required: true, message: "请输入角色代号", trigger: "blur" }]
      },
      //修改角色表单验证
      updateRules: {
        rname: [{ required: true, message: "请输入角色名", trigger: "blur" }],
        rsign: [{ required: true, message: "请输入角色代号", trigger: "blur" }]
      },
      //权限树菜单对话框
      dialogPermissionsTree: false,
      //权限树菜单数据
      permissionsTreeData: [
        {
          lable: "一级 1",
          child: [
            {
              lable: "二级 1-1",
              child: [
                {
                  lable: "三级 1-1-1"
                }
              ]
            }
          ]
        }
      ],
      //树插件自定义属性
      permissionProp: {
        id: "id",
        lable: "lable",
        children: "child",
        icon: "icon"
      },
      //修改权限dialog弹出框显示控制
      dialogPermissionsTreeUpdate: false,
      //修改权限树的默认nodeid
      buttonPermissionId: [],
      //上一次默认的权限树
      oldPermissionId: [],
      //将要提交权限树nodeid
      sureButtonPermissionId: [],
      //当前选中角色id
      thatRoleId: null,
      //加载层
      loading: false,
      //添加角色按钮显示
      addRoleView: true,
      //编辑角色按钮显示
      updateRoleView: true,
      //删除角色按钮显示
      deleteRoleView: true,
      //授权菜单按钮显示
      perRoleView: true,
      //关联人员按钮显示
      linkRoleView: true,
      //被复选选中的admins
      adminCheck: []
    };
  },
  mounted() {
    //获取角色列表
    this.$ajax({
      url: "/api/authFun/role/pageRole",
      method: "post",
      data: {
        currPage: this.currPage + "",
        pageSize: this.pageSize + "",
        param: {}
      }
    }).then(res => {
      this.tableData = res.data.data;
      this.currPage = res.data.currPage;
      this.totals = res.data.totals;
      this.pageSize = res.data.pageSize;
    });
  },
  methods: {
    /**删除角色 */
    deleteRole(deleteSign, id) {
      this.$confirm("本操作将删除此角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          if (deleteSign == "super") {
            this.$message({
              type: "error",
              message: "此角色不能被删除!"
            });
          } else {
            this.$ajax({
              url: "/api/authFun/role/deleteRole/" + id,
              method: "get"
            }).then(res => {
              this.$options.methods.getRoleList(
                this.pageSize,
                this.currPage,
                this
              );
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
          }
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /**
     * 添加角色
     */
    roleAdd() {
      this.$confirm("您要添加一个角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.dialogFormVisible = true;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消添加"
          });
        });
    },

    /**角色添加确定 */
    addRoleSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$ajax({
            url: "/api/authFun/role/saveRole",
            method: "post",
            data: {
              rname: this.addForm.rname,
              rsign: this.addForm.rsign,
              enable: this.addForm.enable
            }
          }).then(res => {
            this.$options.methods.getRoleList(
              this.pageSize,
              this.currentPage,
              this
            );
            this.dialogFormVisible = false;
            this.$message({
              message: "角色添加成功！！",
              type: "success"
            });
          });
        } else {
          console.log(valid);
          return false;
        }
      });
    },

    /**获取角色列表 */
    getRoleList(pageSize, currentPage, that) {
      that
        .$ajax({
          url: "/api/authFun/role/pageRole",
          method: "post",
          data: {
            currPage: that.currPage + "",
            pageSize: that.pageSize + "",
            param: {}
          }
        })
        .then(res => {
          that.tableData = res.data.data;
          that.currPage = res.data.currPage;
          that.totals = res.data.totals;
          that.pageSize = res.data.pageSize;
        });
    },
    /**每页条数改变时候触发 */
    pageSizeChange(pageSizeNum) {
      this.$options.methods.getRoleList(pageSizeNum, 1, this);
    },
    /**跳转页面时候触发 */
    currentPageChange(currentPage) {
      this.$options.methods.getRoleList(this.pageSize, currentPage, this);
    },
    /**
     * 已授权查看
     *
     * */
    updatePermission(rid) {
      this.$ajax({
        url: "/api/authFun/role/findRoleResTree/" + rid,
        method: "get"
      }).then(res => {
        this.thatRoleId = rid;
        this.oldPermissionId = res.data.rids;
        this.buttonPermissionId = res.data.rids;
        this.permissionsTreeData = res.data.tree;
        this.permissionsTreeUpdate = true;
        this.sureButtonPermissionId = [];
        //当前权限更新
      });
    },
    //树组件点击
    handleNodeClick(data) {
      console.log(data);
    },
    /**自定义树渲染模板 */
    permissionRender(h, { node, data, store }) {
      return (
        <span>
          <i class={data.icon} />
          <span style="margin-left:5px">{data.lable}</span>
        </span>
      );
    },
    /**修改权限确定事件 */
    updatePermissionSure() {
      let that = this;
      if (this.sureButtonPermissionId.length == 0) {
        this.$message.error("您没有做任何改变！！");
      } else if (this.sureButtonPermissionId.length > 0) {
        let now = this.sureButtonPermissionId;
        let old = this.oldPermissionId;
        let hasLength = 0;
        if (old != null || old != undefined) {
          for (let a = 0; a < now.length; a++) {
            for (let b = 0; b < old.length; b++) {
              if (now[a] == old[b]) {
                hasLength++;
              }
            }
          }
        }
        if (hasLength == now.length) {
          this.$message.error("您没有做任何改变！！");
        } else {
          this.$ajax({
            url: "/api/authFun/role/saveRoleRes",
            method: "post",
            data: {
              resId: now,
              rid: this.thatRoleId
            }
          }).then(res => {
            //刷新角色列表
            this.$options.methods.getRoleList(
              this.pageSize,
              this.currPage,
              this
            );
            this.permissionsTreeUpdate = false;
            this.$message({
              message: "授权成功！",
              type: "success"
            });
          });
        }
      }
    },
    /**当修改权限树节点选中变化时候 */
    refreshTreeCheckId(checked, node) {
      this.sureButtonPermissionId = node.checkedKeys.concat(
        node.halfCheckedKeys
      );
    },
    /**
     * 角色修改取消重置表单
     */
    roleUpdateStop(formName) {
      this.$refs[formName].resetFields();
      this.updateFormVisible = false;
    },
    /**
     * 角色修改提交
     */
    roleUpdateSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$ajax({
            url: "/api/authFun/role/saveRole",
            method: "post",
            data: {
              rid: this.updateForm.rid,
              rname: this.updateForm.rname,
              rsign: this.updateForm.rsign,
              enable: this.updateForm.enable
            }
          }).then(res => {
            this.$options.methods.getRoleList(
              this.pageSize,
              this.currentPage,
              this
            );
            this.updateFormVisible = false;
            this.$message({
              message: "角色修改成功！！",
              type: "success"
            });
          });
        } else {
          console.log(valid);
          return false;
        }
      });
    },
    /**
     * 角色添加取消重置表单
     */
    roleAddStop(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    /**
     * 角色编辑弹窗
     */
    updateRoleWindow(role) {
      this.updateForm.rname = role.rname;
      this.updateForm.rsign = role.rsign;
      this.updateForm.enable = role.enable;
      this.updateForm.rid = role.rid;
      this.updateFormVisible = true;
    },
    /**
     * 打开人员选择弹窗
     */
    linkRoleUser(rid) {
      this.thatRoleId = rid;
      this.$ajax({
        url: "/api/authFun/admin/pageAdmin",
        method: "post",
        data: {
          currPage: this.utCurrPage + "",
          pageSize: this.utPageSize + "",
          param: {
            name: this.userTableInput.name
          }
        }
      }).then(res => {
        console.log(res);
        this.linkRoleUserVisible = true;
        let data = this.$options.methods.adminDataFilter(
          res.data.data,
          this,
          this.thatRoleId
        );
        this.userTableData = data;
        this.utCurrPage = res.data.currPage;
        this.utTotal = res.data.totals;
        this.$options.methods.adminCheckFun(this.thatRoleId, this, data);
      });
    },
    /**
     * 人员列表弹框当前页改变触发
     */
    utCurrentChange() {
      this.$ajax({
        url: "/api/authFun/admin/pageAdmin",
        method: "post",
        data: {
          currPage: this.utCurrPage + "",
          pageSize: this.utPageSize + "",
          param: {
            name: this.userTableInput.name
          }
        }
      }).then(res => {
        let data = this.$options.methods.adminDataFilter(
          res.data.data,
          this,
          this.thatRoleId
        );
        this.userTableData = data;
        this.utCurrPage = res.data.currPage;
        this.utTotal = res.data.totals;
        this.$options.methods.adminCheckFun(this.thatRoleId, this, data);
      });
    },
    /**
     * 点击搜索人员
     */
    utSearchAdmin() {
      this.$ajax({
        url: "/api/authFun/admin/pageAdmin",
        method: "post",
        data: {
          currPage: this.utCurrPage + "",
          pageSize: this.utPageSize + "",
          param: {
            name: this.userTableInput.name
          }
        }
      }).then(res => {
        let data = this.$options.methods.adminDataFilter(
          res.data.data,
          this,
          this.thatRoleId
        );
        this.userTableData = data;
        this.utCurrPage = res.data.currPage;
        this.utTotal = res.data.totals;
        this.$options.methods.adminCheckFun(this.thatRoleId, this, data);
      });
    },
    /**
     * 人员复选
     *
     */
    adminCheckFun(rid, that, data) {
      let admins = data;
      let hasRoleAdmin = [];
      for (let i in admins) {
        if (admins[i].role != null && admins[i].role.rid == rid) {
          hasRoleAdmin.push(admins[i]);
        }
      }
      that.$nextTick(() => {
        if (hasRoleAdmin.length > 0) {
          if (hasRoleAdmin) {
            hasRoleAdmin.forEach(row => {
              that.$refs.adminTable.toggleRowSelection(row);
            });
          } else {
            that.$refs.adminTable.clearSelection();
          }
        }
      });
    },
    /**
     * 人员列表数据过滤
     */
    adminDataFilter(data, that, rid) {
      let fData = [];
      data.forEach(admin => {
        if (admin.role == null) {
          fData.push(admin);
        } else {
          if (admin.role.rid == rid) {
            fData.push(admin);
          }
        }
      });
      return fData;
    },
    /**
     * 关闭关联人员弹框
     */
    linkRoleUserClose() {
      this.linkRoleUserVisible = false;
      this.userTableInput.name = "";
    },
    /**
     * 点击人员关联，人员复选框时触发
     */
    linkRoleUserCheckBox(selection) {
      this.adminCheck = selection;
    },
    /**
     * 点击人员关联，全选
     */
    linkRoleUserCheckAll(selection) {
      this.adminCheck = selection;
    },
    /**
     * 点击人员关联角色确定
     */
    adminRoleLinkSure() {
      let adminCheck = this.adminCheck;
      let admins = [];
      for (const key in adminCheck) {
        admins.push(adminCheck[key].id);
      }
      if (adminCheck.length > 0) {
        this.$ajax({
          url: "/api/authFun/admin/AdminLinkRole",
          method: "post",
          data: {
            rid: this.thatRoleId,
            aids: admins
          }
        }).then(res => {
          this.linkRoleUserVisible = false;
          this.userTableInput.name = "";
          this.$message({
            message: "关联成功！！",
            type: "success"
          });
        });
      } else {
        this.$message({
          message: "你没有做任何改变！！",
          type: "error"
        });
      }
    }
  }
};
</script>


<style >
@import url(../../../static/css/roleList.css);
</style>

