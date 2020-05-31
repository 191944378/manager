<template>
  <div class="container">
    <!-- 提示 -->
    <el-alert title="注意：只有三级分类可以设置参数" type="warning" show-icon style="margin-bottom: 20px;"></el-alert>
    <!-- 操作栏 -->
    <el-row :gutter="0" type="flex" justify="space-between" class="operabar">
      <el-col>
      <!-- 选择 -->
      <el-cascader v-model="cateCascader.value" :options="cateCascader.options" placeholder="选择 / 搜索分类" :props="cateCascader.props" filterable clearable @change="cateCascaderChange" style="width: 100%"></el-cascader>
      
      </el-col>
      
    </el-row>
    <!-- 卡片 -->
      <!-- 切签  -->
      <el-tabs v-model="activeName" @tab-click="tiggleTab" type="border-card" v-if="cateCascader.value != ''" >
        <!-- 标签1 -->
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" class="btn-filst" size="small" style="margin: 15px 0;">添加参数</el-button>
          <el-table :data="manyTable" style="width: 100%"> 
            <el-table-column type="expand" v-slot="manyTags">
              <el-tag :key="i" v-for="(v, i) in manyTags.row.attr_vals" closable @close="delTages(manyTags.row, i)"> {{v}} </el-tag>
              <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="sentTags(manyTags.row)" @blur="sentTags(manyTags.row)"></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加</el-button>
            </el-table-column> 
            <el-table-column type="index"></el-table-column> 
            <el-table-column label="参数名称" prop="attr_name"></el-table-column> 
            <el-table-column label="操作">
              <el-tooltip class="item" effect="dark" content="修改" placement="top">
                <el-button icon="iconfont icon-bianji" circle  class="table-btn"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button icon="iconfont icon-lajitong" circle  class="table-btn"></el-button>
              </el-tooltip>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 标签2 -->
        <el-tab-pane label="静态属性" name="second">配置管理</el-tab-pane>
      </el-tabs>
      
    </div>
</template>


<script>
export default {
  data(){
    return {
      cateCascader:{
        value: '',
        options: [],
        props: {
          value: 'cat_id',
          label: 'cat_name',
          expandTrigger: 'hover'
        }
      },
      activeName: 'first',
      manyTable: [],
      manyTags: [],
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: ''
    }
  },
  created(){
    this.getCascaderData()
  },
  methods: {

    // 获取联选数据
    async getCascaderData(){
      const {data: res} = await this.axios.get('/categories')
      if(res.meta.status != 200) return this.$message.error('商品分类列表拉取失败')
      res.data.forEach((item, idx) => {
        if(!item.children){
          item.disabled = true
        } else {
          item.children.forEach((item2, idx2) => {
            if(!item2.children){
              item2.disabled = true
            }
          })
        }
      })
      this.cateCascader.options = res.data
      console.log('选择器数据:', this.cateCascader.options)
    },
    // 获取表格数据
    async cateCascaderChange(v){
      const id = v[v.length-1]
      const { data: res } = await this.axios.get(`/categories/${id}/attributes`, {params: {sel: 'many'}})
      this.manyTable = res.data
      // 标签集转数组
      this.manyTable.forEach((item, idx) => {
        item.attr_vals = item.attr_vals.split(' ')
      })
      console.log('动态参数标签集:', this.manyTable)

    },
    // 切换标签
    tiggleTab(tab, event){
        console.log(tab, event);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加属性标签
    sentTags(row) {
      if (this.inputValue.trim().length == 0) return this.inputVisible = false
      if (this.inputValue.trim().length > 10) return this.$message.error('属性不可超过10个字符')
        let vals = row.attr_vals
        vals.push(this.inputValue)
        this.axios.put(`/categories/${row.cat_id}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name, 
          attr_sel: row.attr_sel, 
          attr_vals: vals.join(' ')
        }).then(res => {
          if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
          this.inputVisible = false;
          this.inputValue = '';
          this.$message.success('标签添加成功')
        })
    },
    // 删除属性标签
    delTages(row, i){
      console.log(row, i)
      let vals = row.attr_vals
      vals.splice(i, 1)
      this.axios.put(`/categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name, 
        attr_sel: row.attr_sel, 
        attr_vals: vals.join(' ')
      }).then(res => {
        if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
        this.inputVisible = false;
        this.inputValue = '';
        this.$message.success('标签删除成功')
      })
    }





  },

}
</script>


<style lang="less" scoped>
  @import "../../assets/css/rule.less";

  .el-cascader{
    box-shadow: 0 6px 10px -4px rgba(19, 29, 121, 0.15);
  }

  .el-tag {
    margin-right: 10px;
    margin-top: 10px;
  }
  .button-new-tag {
    margin-top: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 120px;
    vertical-align: bottom;
  }

</style>