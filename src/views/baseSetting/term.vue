<template>
  <div>
    
    <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="关键词">
                <el-input v-model="form.word" placeholder="关键词" style="width:300px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态">
                <el-select v-model="form.enabled" placeholder="状态">
                  <el-option label="启用" :value="true"></el-option>
                  <el-option label="失效" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button @click="clear">清空</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="word" label="关键词" width="200"> </el-table-column>
      <el-table-column prop="icon" label="图标" align='center'> </el-table-column>
      <el-table-column label="状态" align='center'>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isEnabled"
            active-color="#36c6d3"
            active-text="启用"
            inactive-text="关闭"
            :active-value="true"
            :inactive-value="false"
            @change="changeStatus(scope.row.id)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建日期" width="200" align='center'> </el-table-column>
      <el-table-column label="操作" align='center'>
        <template slot-scope="scope">
          <el-button v-if="scope.row.isEnabled" type="text" @click="handleEdit(scope.row)" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="float:right;position:absolute;right:30px;bottom:50px;"
      background
      layout="prev, pager, next"
      :total="paginationOption.total"
      :current-page="paginationOption.pageNum"
      :hide-on-single-page="true"
      @current-change="pageChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import {
  list,
  changeStatus,
} from '@/api/term'

export default {
  data() {
    return {
      tableData: [],
      paginationOption: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }, // 分页参数
      form: {
        enabled: null, // 是否生效
        word: null, // 关键词
      },
    };
  },
  methods: {
    changeStatus(id) {
      changeStatus(id).then(response => {
        if(response.success==true){
          this.search();
        }
      })
    },
    pageChange(pageNum){
      console.log(pageNum);
      this.paginationOption.pageNum = pageNum;
      this.search();
    },
    //搜索方法
    search() {
      list({...this.form, ...this.paginationOption}).then(response => {
        if(response.success==true){
            this.tableData = response.result.data
            this.paginationOption.total = response.result.count;
        }
      })
    },
    clear() {
        Object.keys(this.form).forEach(key => {
          this.form[key] = null;
        });
        this.paginationOption.currentPage = 1
        this.search()
    },
    handleEdit(row){
      
    }, 
  },
  created() {
    this.search()
  },
};
</script>

<style>
</style>
