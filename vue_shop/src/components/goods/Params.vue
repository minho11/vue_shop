<template>
    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!-- 卡片区域 -->
    <el-card class="box-card">
        <!-- 警告区域 -->
     <el-alert :closable="false" show-icon
    title="注意：只允许为第三级分类修改参数！"
    type="warning">
  </el-alert>
  <!-- 选择商品分类区 -->
  <e-row class="chose">
      <e-col>
          <span>
              选择商品分类:
              <!-- 级联选择框 -->
              <el-cascader
                expand-trigger = 'hover'
                v-model="selected"
                :props="cateProps"
                :options="cateList"
                @change="cateListChange" clearable change-on-select></el-cascader>
          </span>
      </e-col>
  </e-row>
  <el-tabs v-model="manageName" @tab-click="handleTabClick">
      
      <!-- 动态参数 -->
    <el-tab-pane label="动态参数" name="many">
        <!-- 添加参数按钮 -->
        <el-button type="primary" :disabled='isBtnDisable' @click="addDialogVisible =true">添加参数</el-button>
        <!-- 动态参数表格 -->
        <el-table :data="activeData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-tag closable v-for="(item,index) in scope.row.attr_vals" :key="index" @close='closeParams(index,scope.row)'>{{item}}</el-tag>
                    <!-- 添加参数框 -->
                    <el-input class="input-new-tag"  v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                    </el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" >
            <template slot-scope="scope">
                <!-- 编辑按钮 -->
                <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <!-- 删除按钮 -->
                <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deletParamsConform(scope.row.attr_id)"
                >删除</el-button>
            </template> 
            </el-table-column>
        </el-table>
    </el-tab-pane>
    <!-- 静态管理 -->
    <el-tab-pane label="静态管理" name="only">
        <!-- 添加属性按钮 -->
        <el-button type="primary" :disabled='isBtnDisable' @click="addDialogVisible =true">添加属性</el-button>
        <!-- 静态参数表格 -->
        <el-table :data="drasticData" border stripe>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-tag closable v-for="(item,index) in scope.row.attr_vals" :key="index" @close='closeParams(index,scope.row)'>{{item}}</el-tag>
                    <!-- 添加参数框 -->
                    <el-input class="input-new-tag"  v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
                    </el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
            
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" >
            <template slot-scope="scope">
                <!-- 编辑按钮 -->
                <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <!-- 删除按钮 -->
                <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deletParamsConform(scope.row.attr_id)"
                >删除</el-button>
            </template> 
            </el-table-column>
        </el-table>
    </el-tab-pane>
  </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
  :title="'添加'+titleText"
  :visible.sync="addDialogVisible"
  width="30%" @closed="addFormClosed">
  <!-- 表单数据 -->
  <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name" ></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
 <!-- 修改对话框 -->
    <el-dialog
  :title="'修改'+titleText"
  :visible.sync="editDialogVisible"
  width="30%" @closed="editFormClosed">
  <!-- 表单数据 -->
  <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="editFormRules">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editForm.attr_name" ></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParamsForm">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      //   动态数据对象
      activeData: [],
      //   静态数据对象
      drasticData: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //   级联选择框选出来的分类
      selected: [],
      //   动态tab选择
      manageName: 'many',
      //   添加对话框的显示和隐藏
      addDialogVisible: false,
      //   添加表单
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' },
        { min: 1, max: 5, message: '长度在 1 到 10 个字符', trigger: 'blur' }]
      },
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' },
        { min: 1, max: 5, message: '长度在 1 到 10 个字符', trigger: 'blur' }]
      },
      //   修改表单
      editForm: {

      },
      //   编辑对话框的显示和隐藏
      editDialogVisible: false,


    }

  },
  created() {
    this.getCateItem()
  },
  methods: {
    async getCateItem() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error("获取商品分类数据列表失败！")
      this.attr_name = res.data.attr_name
      this.cateList = res.data
    },
    // 级联选择框变化
    async cateListChange() {

      // 选中不是三级
      if (this.selected.length !== 3) {
        this.selected = []
        this.activeData = []
        this.drasticData = []
      }
      //   选中三级
      const { data: res } = await this.$http.get(`categories/${this.getSelectedId}/attributes`, { params: { sel: this.manageName } })
      if (res.meta.status !== 200) return this.$message.error("获取失败")
      this.$message.success("获取成功")
      // 获得参数并分割成数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        //   添加参数框的显示和隐藏
        item.inputVisible = false
        item.inputValue = ''
      })
      //  判断当前数据属于哪个表格
      if (this.manageName === 'many') {
        this.activeData = res.data
      } else {
        this.drasticData = res.data
      }

    },
    // Tab点击
    handleTabClick() {
      this.cateListChange()
    },
    addFormClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 上传添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.getSelectedId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.manageName })
        if (res.meta.status !== 201) return this.$message.error("添加失败")
        this.$message.success("添加成功")
        this.cateListChange()
        // 隐藏对话框
        this.addDialogVisible = false
        this.getCateItem()

      })
    },
    // 编辑对话框
    async showEditDialog(attrId) {
      const { data: res } = await this.$http.get(`categories/${this.getSelectedId}/attributes/${attrId}`, { params: { attr_name: this.editForm.attr_name, attr_sel: this.manageName } })
      if (res.meta.status !== 200) return this.$message.error("获取商品分类数据列表失败！")
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 关闭重置编辑对话框
    editFormClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 上传并保存编辑后的信息
    editParamsForm() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.getSelectedId}/attributes/${this.editForm.attr_id
          }`, {
          attr_name: this.editForm.attr_name, attr_sel: this.manageName
        })
        if (res.meta.status !== 200) return this.$message.error("编辑失败")
        this.$message.success("编辑成功")
        this.cateListChange()
        // 隐藏对话框
        this.editDialogVisible = false

      })
    },
    // 删除对话框
    deletParamsConform(attrId) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.getSelectedId}/attributes/${attrId}`)
        if (res.meta.status !== 200) return this.$message.error("删除失败")
        this.$message.success("删除成功")
        this.cateListChange()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    async handleInputConfirm(object) {
      if (object.inputValue.trim().length === 0) {
        object.inputValue = ''
        object.inputVisible = false

      } else {
        // 使参数显示在tag里
        object.attr_vals.push(object.inputValue.trim())
        object.inputValue = ''
        object.inputVisible = false
        // 更新数据
        const { data: res } = await this.$http.put(`categories/${this.getSelectedId}/attributes/${object.attr_id}`, { attr_name: object.attr_name, attr_sel: object.attr_sel, attr_vals: object.attr_vals.join(' ') })
        if (res.meta.status !== 200) return this.$message.error("更新失败！")
        // this.cateListChange()

      }


    },
    // 展示输入框
    showInput(object) {
      object.inputVisible = true
      //   页面被重新渲染之后才会执行回调函数获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async closeParams(index, object) {
      object.attr_vals.splice(index, 1)
      // 更新数据
      const { data: res } = await this.$http.put(`categories/${this.getSelectedId}/attributes/${object.attr_id}`, { attr_name: object.attr_name, attr_sel: object.attr_sel, attr_vals: object.attr_vals.join(' ') })
      if (res.meta.status !== 200) return this.$message.error("更新失败！")
      //   this.cateListChange()

    }

  },
  computed: {
    // 判断按钮是否被禁用
    isBtnDisable() {
      if (this.selected.length !== 3) return true
      return false
    },
    // 计算选中的三级节点id
    getSelectedId() {
      if (this.selected.length !== 3) return null
      return this.selected[2]
    },
    // 确定添加对话框标题
    titleText() {
      if (this.manageName === 'many') return '动态参数'
      return '静态属性'
    }
  }
}
</script>
<style scoped>
.box-card{
    margin-top: 10px;
}
.el-alert {
    margin-bottom: 15px;
}
.chose {
    margin: 15px 0;
}
.el-tab-pane .el-button {
    margin-bottom: 10px;
}
.el-tag {
    margin: 10px;
}
.input-new-tag {
    width: 80px;
}
</style>