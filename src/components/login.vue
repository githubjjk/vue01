<template>
  <div class="loginBox">
    <div class="Ltitle LHeight">
      <strong>后台管理系统</strong>
    </div>
    <el-form :model="loginform" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item prop="username">
        <el-input placeholder="请输入用户名" v-model="loginform.username">
          <template slot="prepend">
            <i class="fa fa-user-circle-o" aria-hidden="true"></i> 账号:
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input placeholder="请输入密码" v-model="loginform.password" type="password">
          <template slot="prepend">
            <i class="fa fa-user-circle-o" aria-hidden="true"></i> 密码:
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="Lsubmit" type="primary" v-on:click="submitForm('ruleForm')">登陆</el-button>
        <el-button class="Lrest" v-on:click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginform: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "change" }]
      }
    };
  },
  methods: {
    //提交表单
    submitForm(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let Base64 = require("js-base64").Base64;
          this.$ajax({
            url: "/api/auth/login",
            method: "post",
            data: {
              username: this.loginform.username,
              password: Base64.encode(
                this.loginform.username + this.loginform.password
              )
            }
          }).then(function(response) {
            that.$cookie.set("AccessToken", response.data);
            that.$router.replace({ name: "index" });
          });
        } else {
          console.log(valid);
          return false;
        }
      });
    },
    // 重置表单的
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>
@import url(../../static/css/login.css);
</style>


