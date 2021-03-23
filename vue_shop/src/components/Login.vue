<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像模块 -->
      <div class="avatar_box">
        <img src="../assets/aoao.jpeg" alt="" />
      </div>
      <!-- 表单模块 -->
      <el-form
        :model="loginForm"
        class="login_form"
        ref="loginFormref"
        :rules="loginFormRules"
        label-width="0px"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont iconuser"
          >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont iconpassword"
            type="password"
          >
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="loginFormReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 数据绑定模块
      loginForm: {
        username: "admin",
        password: "123456"
      },
      //   登陆验证模块
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]



      }

    }
  },
  methods: {
    //   表单重置
    loginFormReset() {
      console.log(this.$refs)
      this.$refs.loginFormref.resetFields()

    },
    // 登陆验证
    login() {
      this.$refs.loginFormref.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm)
        if (res.meta.status !== 200) return this.$message.error("登录失败")
        this.$message.success("登录成功")
        console.log(res.data.to)
        window.sessionStorage.setItem("token", res.data.token)
        this.$router.push("/home")
      })
    }
  }
}
</script>

<style Lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  position: absolute;
  width: 450px;
  height: 300px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 3px;
}
.avatar_box {
  width: 130px;
  height: 130px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
  padding: 10px;
  border-radius: 50%;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px #ddd;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form {
  position: absolute;
  width: 400px;
  left: 50%;
  bottom: 0;
  transform: translate(-50%);
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
