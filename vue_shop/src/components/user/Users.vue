<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 输入框 -->
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserItem()"
          >
            <!-- 搜索按钮 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserItem()"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格数据模块 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 数据显示 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->

            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deletUserConform(scope.row.id)"
            ></el-button>

            <el-tooltip effect="dark" content="分配角色" placement="top">
              <!-- 分配角色按钮 -->
              <el-button type="info" icon="el-icon-message" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页模块 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotle"
      >
      </el-pagination>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示框 -->
  </div>
</template>
  


<script>
export default {
  data() {
    //   验证邮箱
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-z0-9A-Z_-])+@([a-z0-9A-Z_-])+(\.[a-z0-9 A-Z])+/
      if (regEmail.test(value)) return cb()
      cb(new Error("请输入合法邮箱！"))
    }
    // 验证手机号
    var checkMobile = (rule, value, cb) => {
      const regEmail = /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57]|19[0762])[0-9]{8}$/
      if (regEmail.test(value)) return cb()
      cb(new Error("请输入合法手机号！"))
    }

    return {
      // 获取用户列表参数
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前页条数
        pagesize: 5,
      },
      //   添加用户表单数据
      addForm: {
        username: "",
        mobile: "",
        email: "",
        password: "",

      },
      //   添加用户规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      //   修改用户表单数据
      editForm: {
      },


      userList: [],
      pageTotle: 0,
      addDialogVisible: false,
      editDialogVisible: false,
    }
  },
  created() {
    this.getUserItem();

  },
  methods: {
    async getUserItem() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error("获取用户列表失败！")
      this.userList = res.data.users
      this.pageTotle = res.data.total


    },
    // 监听pagesize
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserItem()
    },
    // 监听页数改变
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getUserItem()
    },
    // 监听状态变化,并传回后端
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      console.log(userInfo)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(" 更新用户状态失败")
      }
      this.$message.success(" 更新用户状态成功")

    },
    // 关闭对话框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error("添加失败，请稍后重试")
        this.$message.success("添加成功！")
        // 隐藏对话框
        this.addDialogVisible = false
        this.getUserItem()
      })
    },
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get("users/" + id)
      if (res.meta.status !== 200) return this.$message.error("获取用户信息失败，请稍后重试")
      this.editForm = res.data;
    },
    // 关闭修改对话框重置表单操作
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户数据并提交
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put("users/" + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) return this.$message.error("修改失败")
        this.$message.success("更新成功")
        // 隐藏对话框
        this.editDialogVisible = false
        this.getUserItem()
      })
    },
    // 删除用户确认
    deletUserConform(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete("users/" + id)
        console.log(id)
        if (res.meta.status !== 200) return this.$message.error("删除失败")
        this.$message.success("删除成功")
        this.getUserItem()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });

      });
    }
  }


}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-table {
  margin-top: 10px;
}
div .cell {
  width: 100%;
  display: flex !important;
}
.el-table-column .el-button {
  flex: 1;
}
</style>