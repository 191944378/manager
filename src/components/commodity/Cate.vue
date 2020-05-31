<template>
  <div class="container">
      <!-- 操作栏 -->
    <el-row :gutter="0" type="flex" justify="space-between" class="operabar">
      <!-- 操作 -->
        <el-button type="primary" icon="el-icon-plus" class="btn-filst" @click="addDialogVisible = true">添加分类</el-button>
      <!-- 搜索 -->
    </el-row>
    
    <!-- 分类列表卡片   -->
    <el-card shadow="always" v-cloak>
      <el-table :data="cateData" style="width: 100%" row-key="cat_id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" v-loading="tableLoading" >
        <el-table-column label="分类名称" prop="cat_name" ></el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted" v-slot="tableData" align="center">
          <i v-if="tableData.row.cat_deleted = true" class="el-icon-success icon-status-useful" style="color: #417cb4"></i>
          <i v-else class="el-icon-error icon-status-unuseful" style="color: #adb5bd"></i>
        </el-table-column>
        <el-table-column label="等级" prop="cat_level" v-slot="tableData" align="center">
          <el-tag v-if="tableData.row.cat_level == 0" size="small" type="warning">一级</el-tag>
          <el-tag v-if="tableData.row.cat_level == 1" size="small" type="success">二级</el-tag>
          <el-tag v-if="tableData.row.cat_level == 2" size="small">三级</el-tag>
        </el-table-column>
        <el-table-column label="操作">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button icon="iconfont icon-bianji" circle  class="table-btn"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button icon="iconfont icon-lajitong" circle  class="table-btn"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
    </el-card>


     <!-- 添加窗口 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="400px" :close-on-click-modal="false">
      <el-form label-position="top" label-width="80px" :model="addCateForm" :rules="rules" ref="addCateFormRef" :status-icon="true" :hide-required-asterisk="true" >
        <el-form-item label="选择路径" prop="caterude" :inline-message="true">
          <el-cascader placeholder="选择 / 搜索添加路径"  v-model="addCateForm.caterude" :options="addCateForm.cateData" :props="addCateForm.props" filterable clearable @change="rudeChange" style="width: 100%"></el-cascader>
        </el-form-item>
        <el-form-item v-if="addCateForm.value != ''" label="新建分类名称" prop="cateName" :inline-message="true">
          <el-input v-model="addCateForm.cateName" placeholder="新增"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="yesAddCate">确 认</el-button>
      </span>
    </el-dialog>

  </div>
</template>


<script>
export default {
  data() {
    return {
      // table数据
      cateData: [],
      tableLoading: true,
      // 添加分类
      
      addDialogVisible: false,
      addCateForm: {
        caterude: '',
        cateData: [], 
        cateName: '',
        level: '',
        pid: '',
        props: {
          value: 'cat_id',
          label: 'cat_name',
          checkStrictly: true
        }
      },

      rules: {
        caterude: [
          { required: true, message: '请选择添加路径', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        cateName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
      },
      
     
    }
  },
  created(){
    this.getCateTable()
    this.getCascaderData()
  },
  methods: {
    // 获取分类表格数据
    async getCateTable(){
      const {data: res} = await this.axios.get('/categories')
      if(res.meta.status != 200) return this.$message.error('商品分类列表拉取失败')
      this.cateData = res.data
      this.tableLoading = false
      console.log('商品分类列表:', this.cateData)
    },
    // 获取添加时分类数据
    async getCascaderData(){
      const {data: res} = await this.axios.get('/categories', {params: {type: 2}})
      if(res.meta.status != 200) return this.getCascaderData()
      this.addCateForm['cateData'] = [{
        cat_id: 0,
        cat_name: '全类别',
        children: res.data,
        cat_pid: -1
      }]
      console.log('联级选择器:', this.addCateForm['cateData'] )
    },
    // 添加路径改变
    rudeChange(rude){
      this.addCateForm.level = rude.length - 1
      this.addCateForm.pid = rude[rude.length-1]
      console.log('层级和父id:', this.addCateForm.level, this.addCateForm.pid)
    },
    // 确认添加分类
    yesAddCate(){
      this.$refs.addCateFormRef.validate(async (boolean, object) => {
        if(!boolean) return false
        const {data: res} = await this.axios.post('/categories', {cat_pid: this.addCateForm['pid'], cat_name: this.addCateForm['cateName'], cat_level: this.addCateForm['level']})
        if(res.meta.status != 201) return this.$message.error(res.meta.msg)
        this.$message.success('分类添加成功')
        this.addDialogVisible = false
        this.getCateTable()
        this.getCascaderData()
        this.addCateForm.level = ''
        this.addCateForm.pid = ''
        this.addCateForm.cateName = ''
        this.addCateForm.caterude = ''

        })
     

    }



  }
}
</script>


<style lang="less" scoped>
  @import "../../assets/css/rule.less";

    /deep/.el-table {
      .el-table__row--level-1 {
        background: #f8f9fd;
      }


    }




</style>