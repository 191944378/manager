<template>
  <div class="container">
          <editor  v-model="addContent" :api-key="tinymce.apiKey" :init="tinymce.init" />

    <!-- 操作栏 -->
    <el-row :gutter="0" type="flex" justify="space-between" class="operabar">
    
      <!-- 操作 -->
      <el-button type="primary" icon="el-icon-plus" class="btn-filst" @click="addDialogVisible = true">添加商品</el-button>
      <!-- 搜索 -->
      <el-col :span="8">
          <el-input placeholder="商品名称关键字" v-model="queryInfo.query" class="search-bg" clearable @keyup.enter.native="getGoodsTable" @clear="getGoodsTable">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsTable"></el-button>
          </el-input>
      </el-col>
    </el-row>
    <!-- 卡片 -->
    <el-card shadow="always">
      <el-table :data="getInfo.goodsTable" style="width: 100%"> 
        <el-table-column type="index"></el-table-column> 
        <el-table-column label="商品名称" prop="goods_name" width="650"></el-table-column> 
        <el-table-column label="商品价格" prop="goods_price" fixed="right"></el-table-column> 
        <el-table-column label="商品重量" prop="goods_weight" fixed="right"></el-table-column> 
        <el-table-column label="创建日期" prop="add_time" fixed="right" :formatter="formatDate" ></el-table-column> 
        <el-table-column label="操作" width="120" fixed="right" v-slot="tableData">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button icon="iconfont icon-bianji" circle  class="table-btn"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button icon="iconfont icon-lajitong" circle  class="table-btn" @click="delGoods(tableData.row.goods_id)"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page="getInfo.pagenum" :page-sizes="[10, 20, 30]" :page-size="100" layout=" sizes, prev, pager, next" :total="getInfo.total"></el-pagination>
    </el-card>



    <!-- 添加窗口 -->
    <el-dialog title="添加商品" :visible.sync="addDialogVisible" :fullscreen="true" center>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="16">
          <!-- 上传图片 -->
          <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" list-type="picture-card" :on-success="sendPicSuccess" :on-preview="picView" :on-remove="handleRemove" :headers="loadHeader" accept="image/png, image/jpeg" multiple>
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 富文本编辑器 1 -->
          <quill-editor v-model="addContent"/>
          <!-- 富文本编辑器 2 -->
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览窗口 -->
    <el-dialog :visible.sync="picDialogVisible">
      <img width="100%" :src="picViewUrl" alt="">
    </el-dialog>     



  </div>
</template>

<script>


export default {

  data(){
    return {
      addDialogVisible: false,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      getInfo: {
        pagenum: 1,
        pagesize: '',
        total: 0,
        goodsTable: [],
      },
      // 商品添加请求
      addGood: {
        pics: ''
      },
      // 缩略图
      picViewUrl: '',
      picDialogVisible: false,
      loadHeader: {
        Authorization: localStorage.getItem('token')
      },
      // 编辑器
      addContent: '',
      tinymce: {
        selector: 'textarea', 
        apiKey: 'x2mao2ge06xlmysnr2x89szgj8wqf5pgxvmrmbecaao5zk3m',
        init: {
          height: 500,
          menubar: true,
          language: 'zh_CN',
          branding: false,
          plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount codesample emoticons'
          ],
          toolbar: 'undo redo | formatselect | bold italic forecolor backcolor image emoticons | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',

          skin: 'naked',
          icons: 'small',
          statusbar: false,
          image_uploadtab: true,
          images_upload_url: 'http://127.0.0.1:8888/api/private/v1/upload'
        }
        
      }
     
    }
  },
  created(){
    this.getGoodsTable()
  },
  
  methods: {
    async getGoodsTable(){
      const {data: res} = await this.axios.get('/goods', {params: this.queryInfo})
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.getInfo.goodsTable = res.data.goods
      this.getInfo.total = res.data.total
      this.getInfo.pagenum = Number(res.data.pagenum) 
      console.log('商品表格数据:', this.getInfo)
    },
    currentPageChange(pagenum){
      this.queryInfo.pagenum = pagenum
      this.getGoodsTable()
    },
    pageSizeChange(pagesize){
      this.queryInfo.pagesize = pagesize
      this.getGoodsTable()
    },
    formatDate(row, column, cellValue, index){
      let date = cellValue * 1000
      if (date === undefined) return ""
      return this.$moment(date).format("YYYY-DD-MM HH:mm:ss")
    },
    delGoods(id){
      this.$confirm('商品删除后不可恢复，是否删除?', '删除商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data: res} = await this.axios.delete(`/goods/${id}`)
          if (res.meta.status != 200) return this.$message.error(res.meta.msg)
          this.getGoodsTable()
          this.$message.success('商品删除成功')
        }).catch(() => {})
    },
    sendPicSuccess(response, file, fileList){
      this.addGood.pics = response.data.tmp_path
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
    },
    picView(file) {
      this.picViewUrl = file.url;
      this.picDialogVisible = true;
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