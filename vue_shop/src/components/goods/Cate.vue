<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
        <!-- 按钮 -->
      <el-row :gutter="20">
          <el-col>    
          <el-button type="primary" @click="showAddDialogVisible"
            >添加分类</el-button>
          </el-col>
      </el-row>
      <!-- 表格数据模块 -->
      <tree-table :data="GoodsList" :columns='columns' :selection-type='false' :expand-type='false' show-index index-text="#" border >
         <!-- 是否过期 -->
         <template slot='isok' slot-scope="scope"> 
             <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightblue;"></i>
             <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 等级 -->
        <template slot='sort' slot-scope="scope"> 
             <el-tag type="success"  v-if="scope.row.cat_level===0" >一级</el-tag>
              <el-tag type="warning"  v-else-if="scope.row.cat_level===1" >二级</el-tag>
               <el-tag type="danger"  v-else>三级</el-tag>
           </template>
    <!-- 操作 -->
            <!-- 编辑按钮 -->
            <template slot='opt' slot-scope="scope"> 
            <el-button
            size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editDialogShow(scope.row.id)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
            size="mini"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
           
             
           </template>
      </tree-table>
      <!-- 分页模块 -->
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
        </el-card>
          <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
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
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <!-- props用来指定配置对象 -->
        <el-form-item label="父级分类" >
        <el-cascader
        expand-trigger = 'hover'
        v-model="selectedPartent"
        :props="cascaderProps"
        :options="ParentList"
    @change="cateListChange" clearable change-on-select></el-cascader>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcate">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      GoodsList: [],
      queryInfo: {
        pagesize: 5,
        pagenum: 1,
      },
      //   列定义
      columns: [{
        label: "分类名称",
        prop: 'cat_name'
      }, {
        label: "是否有效",
        type: "template",
        template: 'isok'
      },
      {
        label: "排序",
        type: "template",
        template: 'sort'
      }, {
        label: "操作",
        type: "template",
        template: 'opt'
      }

      ],
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      //   添加分类规则
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],

      },
      // 父级分类列表
      ParentList: [],
      //   级联选择器配置
      cascaderProps: {
        value: 'cat_id',
        label: "cat_name",
        children: "children"
      },
      //   选中父类列表
      selectedPartent: [],

      //   总数据条数
      total: 1,
      addDialogVisible: false,

    }


  },
  created() {
    this.getGoodsItem();
  },
  methods: {
    // 获取商品列表
    async getGoodsItem() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error("获取商品失败，请稍后重试")
      this.GoodsList = res.data.result
      this.total = res.data.total
    },
    // 每页显示条数变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsItem()
    },
    // 页数变化
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getGoodsItem()
    },
    // 显示添加对话框
    showAddDialogVisible() {
      this.getParentList()
      this.addDialogVisible = true
    },
    // 获取父级分类列表
    async getParentList() {
      const { data: res } = await this.$http.get("categories", { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error("获取父级分类失败")
      this.ParentList = res.data
    },
    // 父级分类列表发生改变
    cateListChange() {
      // 如果selectedPartent大于0，则表示选中了分类，否则默认分类
      //   父类id
      if (this.selectedPartent.length > 0) {
        this.addForm.cat_pid = this.selectedPartent[this.selectedPartent.length - 1]
        //   当前分类等级等级
        this.addForm.cat_level = this.selectedPartent[this.selectedPartent.length]

      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0

      }

    },
    // 点击确认增加分类按钮触发事件
    addcate() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post("categories", this.addForm)
        if (res.meta.status !== 201) return this.$message.error("添加失败")
        this.$message.success("添加成功")
        // 隐藏对话框
        this.addDialogVisible = false
        this.getGoodsItem()

      })
    },
    // 关闭对话框的重置事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.selectedPartent = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0

    },
  }


}
</script>
<style scoped>
.el-card {
    margin-top: 10px;
}
.el-button {
  margin-bottom: 10px;
  margin-left: 10px;
}
.el-cascader{
width: 100%;
}
</style>