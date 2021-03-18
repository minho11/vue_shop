<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像模块 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单模块 -->
      <el-form class="login_form" label-width="80px">
        <el-form-item>
          <el-input> </el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
    </div>
  </div>
</template>


<script>
export default {};
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
}
</style>