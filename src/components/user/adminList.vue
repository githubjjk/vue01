<template>
  <div class="boxContent">
    <div class="uHead">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="userBreadcrumb">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>人员列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="userAdd" v-if="checkBtnPer('admin:add')">
        <el-button type="primary" size="small" @click="userAdd">
          <i class="fa fa-user-plus"></i>
          人员添加
        </el-button>
      </div>
    </div>
    <div class="adminSearch">
      <el-form ref="adminSerchForm" :inline="true" :model="adminSearchForm">
        <el-form-item>
          <el-input placeholder="输入人员姓名" size="small" v-model="adminSearchForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="medium" placeholder="输入用户名" v-model="adminSearchForm.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" placeholder="输入手机号" v-model="adminSearchForm.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="adminSearch">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="small" @click="adminSearchReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="rContent">
      <el-table
        :header-cell-style="adminTableHead"
        :data="tableData"
        stripe
        border
        style="width:100%"
      >
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="name" label="人员名称" width="120"></el-table-column>
        <el-table-column prop="username" label="账户名" width="120"></el-table-column>
        <el-table-column prop="phone" label="电话号码" width="120"></el-table-column>
        <el-table-column label="人员拥有角色" width="150">
          <template slot-scope="scope">
            <p>{{ scope.row.role==null? "" : scope.row.role.rname }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              v-if="checkBtnPer('admin:update')"
              size="small"
              @click="updateAdminWindow(scope.row)"
            >
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i> 编辑
            </el-button>
            <el-button
              type="danger"
              v-if="checkBtnPer('admin:delete')"
              size="small"
              @click="adminDelete(scope.row.id)"
            >
              <i class="fa fa-trash" aria-hidden="true"></i> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="pageSizeChange"
          @current-change="currPageChange"
          :current-page="currPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
        ></el-pagination>
      </div>
    </div>
    <!--添加人员的表单框-->
    <el-dialog
      title="人员添加"
      @close="addAdminClose('addUserForm')"
      :visible.sync="userFormDialog"
      width="380px"
      custom-class="roleAddForm"
    >
      <el-form
        :model="addUserForm"
        ref="addUserForm"
        :rules="userRules"
        label-width="100px"
        size="mini"
        :label-position="formLabelPosition"
      >
        <el-form-item label="姓名" prop="name">
          <el-input class="addUserName" v-model="addUserForm.name" placeholder="请填写姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input class="addUserName" v-model="addUserForm.username" placeholder="请填写用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            class="addUserName"
            v-model="addUserForm.password"
            placeholder="请填写密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input
            type="password"
            class="addUserName"
            v-model="addUserForm.password2"
            placeholder="请填写密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="常用手机号" prop="phone">
          <el-input class="addUserName" v-model="addUserForm.phone" placeholder="请填写电话"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userFormDialog=false">取 消</el-button>
        <el-button type="primary" @click="addAdminSure('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--人员编辑弹框-->
    <el-dialog
      title="人员编辑"
      @close="updateAdminClose('updateAdminForm')"
      :visible.sync="updateAdminDialog"
      width="380px"
      custom-class="roleAddForm"
    >
      <el-form
        :model="updateAdminForm"
        ref="updateAdminForm"
        :rules="updateAdminRules"
        label-width="100px"
        size="mini"
        :label-position="formLabelPosition"
      >
        <el-form-item label="姓名" prop="name">
          <el-input class="addUserName" v-model="updateAdminForm.name" placeholder="请填写姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input class="addUserName" v-model="updateAdminForm.username" placeholder="请填写用户名"></el-input>
        </el-form-item>
        <el-form-item label="常用手机号" prop="phone">
          <el-input class="addUserName" v-model="updateAdminForm.phone" placeholder="请填写电话"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateAdminDialog=false">取 消</el-button>
        <el-button type="primary" @click="updateAdminSure('updateAdminForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //添加人员表单验证规则
    var password2 = (value, rule, callback) => {
      if (
        this.addUserForm.password2.length > 10 ||
        this.addUserForm.password2.length < 6
      ) {
        callback(new Error("密码长度6-10位"));
      } else if (this.addUserForm.password2 != this.addUserForm.password) {
        callback(new Error("与原密码不匹配"));
      } else {
        callback();
      }
    };
    return {
      //当前页
      currPage: 1,
      //默认条数
      pageSize: 10,
      //总条数
      totals: 0,
      //表格数据
      tableData: null,
      //人员搜索表单
      adminSearchForm: {
        username: "",
        name: "",
        phone: ""
      },
      //button按钮容器
      buttonView: [],
      //人员添加对话框
      userFormDialog: false,
      //添加人员form表单
      addUserForm: {
        username: "",
        password: "",
        password2: "",
        name: "",
        enable: "0",
        phone: ""
      },
      //添加人员form表单位置
      formLabelPosition: "left",
      //添加人员表单验证规则
      userRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 5, message: "姓名长度在3-5个字之间", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "用户名长度在6-10位之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "密码长度在6-10位之间",
            trigger: "blur"
          }
        ],
        password2: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: password2, trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { len: 11, message: "手机号不正确", trigger: "blur" }
        ]
      },
      //编辑人员表单验证条件
      updateAdminRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 5, message: "姓名长度在3-5个字之间", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "用户名长度在6-10位之间",
            trigger: "blur"
          }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { len: 11, message: "手机号不正确", trigger: "blur" }
        ]
      },
      //编辑人员表单信息
      updateAdminForm: {
        name: "",
        username: "",
        phone: "",
        id: -1
      },
      //编辑人员弹框显示标识
      updateAdminDialog: false
    };
  },
  mounted() {
    //获取人员数据
    this.$options.methods.getAdminList(this.pageSize, this.currPage, this);
  },
  methods: {
    /**获取人员列表 */
    getAdminList(pageSize, currPage, obj) {
      let that = obj;
      that
        .$ajax({
          url: "/api/authFun/admin/pageAdmin",
          method: "post",
          data: {
            currPage: that.currPage + "",
            pageSize: that.pageSize + "",
            param: {
              username: that.adminSearchForm.username,
              phone: that.adminSearchForm.phone,
              name: that.adminSearchForm.name
            }
          }
        })
        .then(res => {
          that.currPage = res.data.currPage;
          that.pageSize = res.data.pageSize;
          that.totals = res.data.totals;
          that.tableData = res.data.data;
        });
    },

    /**分页条数改变触发 */
    pageSizeChange(pageSize) {
      this.$options.methods.getAdminList(pageSize, this.currPage, this);
    },
    /**跳转页面时触发 */
    currPageChange(currentPage) {
      this.$options.methods.getAdminList(this.pageSize, currPage, this);
    },
    /**添加人员 */
    userAdd() {
      this.userFormDialog = true;
    },
    /**添加人员确认 */
    addAdminSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$ajax({
            url: "/api/authFun/admin/saveAdmin",
            method: "post",
            data: this.addUserForm
          }).then(res => {
            this.currPage = 1;
            this.adminSearchForm.name = "";
            this.adminSearchForm.username = "";
            this.adminSearchForm.phone = "";
            this.$options.methods.getAdminList(
              this.pageSize,
              this.currPage,
              this
            );
            this.$message({
              message: "添加人员成功！",
              type: "success"
            });
            this.userFormDialog = false;
          });
        } else {
          console.log("addUserError!!");
          return false;
        }
      });
    },
    /**删除人员 */
    deleteUser(lock, aid, that) {
      if (lock == "1") {
        that.$message.error("此人员不能删除！！");
      } else {
        that
          .$confirm("你确定要删除此人员吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            that
              .$ajax({
                url: "/user/deleteUser.action",
                method: "post",
                params: {
                  aid: aid,
                  alock: lock
                }
              })
              .then(function(res) {
                if (res.data == "ok") {
                  that.$message({
                    message: "删除人员成功！",
                    type: "success"
                  });
                  that.getUserList(that.pageSize, that.currentPage, that);
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          })
          .catch(() => {
            that.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    /**
     * 人员表格head样式
     */
    adminTableHead({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#e9e9e9;color:#000000;";
      }
    },
    /**
     * 人员搜索按钮点击事件
     */
    adminSearch() {
      this.currPage = 1;
      this.$options.methods.getAdminList(this.pageSize, this.currPage, this);
    },
    /**
     * 人员搜索重置方法
     */
    adminSearchReset() {
      this.currPage = 1;
      this.pageSize = 10;
      this.adminSearchForm.name = "";
      this.adminSearchForm.username = "";
      this.adminSearchForm.phone = "";
      this.$options.methods.getAdminList(this.pageSize, this.currPage, this);
    },
    /**
     * 关闭人员添加弹窗回调
     */
    addAdminClose(formName) {
      this.$refs[formName].resetFields();
      this.userFormDialog = false;
    },
    /**
     * 编辑人员弹框显示
     */
    updateAdminWindow(data) {
      this.updateAdminForm = data;
      this.updateAdminDialog = true;
    },
    /**
     * 人员编辑关闭
     */
    updateAdminClose(formName) {
      this.$refs[formName].resetFields();
      this.updateAdminDialog = false;
    },
    /**
     * 人员编辑提交
     */
    updateAdminSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$ajax({
            url: "/api/authFun/admin/saveAdmin",
            method: "post",
            data: this.updateAdminForm
          }).then(res => {
            this.currPage = 1;
            this.pageSize = 10;
            this.$options.methods.getAdminList(
              this.pageSize,
              this.currPage,
              this
            );
            this.$message({
              message: "保存成功！",
              type: "success"
            });
            this.updateAdminDialog = false;
          });
        } else {
          console.log("addUserError!!");
          return false;
        }
      });
    },
    /**
     * 人员删除
     */
    adminDelete(id) {
      this.$confirm("你将要删除此人员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$ajax({
            url: "/api/authFun/admin/deleteAdmin/" + id,
            method: "get"
          }).then(res => {
            this.$options.methods.getAdminList(
              this.pageSize,
              this.currPage,
              this
            );
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped>
@import url(../../../static/css/userList.css);
</style>
