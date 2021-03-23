<template>
    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
        <!-- 按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialogVisible"
            >添加角色</el-button
          >
        </el-col>
      <!-- 表格数据模块 -->
      <el-table :data="roleList" stripe border>
          <!-- 展开列 -->
        <el-table-column type="expand"> 
            <template slot-scope="scope">
                <el-row v-for="(item1 ,index2) in scope.row.children" :key="item1.id" :class="['bdBottom',index2===0? 'bdTop':'','vcenter']">
                    <!-- 一级权限 -->
                    <el-col :span="5" >
                        <el-tag closable @close="removeRightById(scope.row,item1.id)" type="success" > {{item1.authName}} </el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                  
                    <el-col :span="19">
                          <!-- 二级权限 -->
                        <el-row :span='6' :class="[index===0? '':'bdTop','vcenter']" v-for="(item2,index) in item1.children" :key="item2.id" >
                            <el-col :span='6' >
                                <el-tag type='info' closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                        
                        <!-- 三级权限 -->
                            <el-col :span='18' >
                                <el-tag closable @close="removeRightById(scope.row,item3.id)" v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                
                            </el-col>
                       </el-row>

                    </el-col>
                </el-row>
            </template>
        </el-table-column>
          <!-- 索引列 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <!-- 数据显示 -->
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
            size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
            size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deletRoleConform(scope.row.id)"
            >删除</el-button>
              <!-- 分配角色按钮 -->
              <el-button type="info" icon="el-icon-search" size="mini" @click="setRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
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
        ref="addRoleRef"
        :model="addRoleForm"
        :rules="addRoleRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc" ></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        ref="editRoleFormRef"
        :model="editRoleForm"
        :rules="addRoleRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc" ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
    title="分配权限"
    :visible.sync="setRightDialogVisible"
     width="30%" @close='setRightDialogClosed'>
   <!-- 树形空间 -->
   <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all  :default-checked-keys="defKeys" ref="treeRef"></el-tree>
    <span slot="footer" class="dialog-footer" >
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRight()">确 定</el-button>
  </span>
    </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      roleList: {
      },
      addRoleRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 2, max: 5, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入描述信息', trigger: 'blur' }]

      },
      //   用户表单数据
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      //   修改用户表单
      editRoleForm: {

      },
      //   权限列表
      rightList: [],
      //   树形控件
      treeProps: {
        label: "authName",
        children: 'children'
      },
      //   默认勾选的权限
      defKeys: [],
      addDialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      // 即将分配权限的角色id
      roleId: '',
    }
  },
  created() {
    this.getRoleItem();

  },
  methods: {
    //   获得角色
    async getRoleItem() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error("获取用户角色失败");
      this.roleList = res.data
    },
    // 添加角色
    addRole() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRoleForm)

        if (res.meta.status !== 201) return this.$message.error("添加失败，请稍后重试")
        this.$message.success("添加成功！")
        // 隐藏对话框
        this.addDialogVisible = false
        this.getRoleItem()
      })
    },
    // 关闭增加对话框
    addDialogClosed() {
      this.$refs.addRoleRef.resetFields();
    },
    // 编辑角色
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get("roles/" + id)
      if (res.meta.status !== 200) return this.$message.error("获取用户信息失败，请稍后重试")
      this.editRoleForm = res.data;
    },
    // 关闭修改对话框重置
    editDialogClosed() {
      this.$refs.editRoleFormRef.resetFields();
    },
    // 修改角色并重置
    editRole() {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put("roles/" + this.editRoleForm.roleId, {
          roleName: this.editRoleForm.roleName, roleDesc: this.editRoleForm.roleDesc
        })
        if (res.meta.status !== 200) return this.$message.error("修改失败")
        this.$message.success("更新成功")
        // 隐藏对话框
        this.editDialogVisible = false
        this.getRoleItem()
      })

    },
    // 删除角色确认
    deletRoleConform(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete("roles/" + id)
        if (res.meta.status !== 200) return this.$message.error("删除失败")
        this.$message.success("删除成功")
        this.getRoleItem()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });

      });
    },
    // 删除权限
    removeRightById(role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) return this.$message.error("删除失败")
        this.$message.success("删除成功")
        role.children = res.data
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });

      });

    },
    // 分配权限
    async setRightDialog(role) {
      this.roleId = role.id
      console.log(this.roleId)
      //   获得分配权限列表
      this.setRightdialogVisible = true
      const { data: res } = await this.$http.get("rights/tree")
      if (res.meta.status !== 200) return this.$message.error("分配角色信息显示失败")
      this.rightList = res.data

      this.findThreeNode(role, this.defKeys)

      this.setRightDialogVisible = true

    },
    // 递归寻找三级节点并获取其id,将其保存于数组
    findThreeNode(node, arr) {
      //   没有孩子节点则为三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.findThreeNode(item, arr)
      });
    },
    // 关闭对话框权限ID重置
    setRightDialogClosed() {
      this.defKeys = []
      this.setRightDialogVisible = false
    },
    // 将分配权限数据传入后台
    async allotRight() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error("更新角色权限失败")
      this.$message.success("分配角色权限成功")
      this.getRoleItem();
      this.setRightDialogVisible = false
    }




  }

}
</script>
<style scoped>
.el-card {
    margin-top:15px;
}
.el-col {
    margin-bottom:10px;
}
.el-tag {
    margin: 7px;
}
.bdBottom {
    border-bottom: 1px solid #ddd;
}
.bdTop {
    border-top: 1px solid #ddd;
}
.vcenter {
display: flex;
align-items: center;
}
.el-col[data-v-08ac19b3] {
    margin-bottom: 0px!important;
}
</style>