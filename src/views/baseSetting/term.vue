<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="createdTime" label="创建日期" width="200"> </el-table-column>
      <el-table-column prop="word" label="关键词" width="200"> </el-table-column>
      <el-table-column prop="icon" label="图标"> </el-table-column>
      <el-table-column label="状态">
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
    </el-table>
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
    //搜索方法
    search() {
      list({...this.form, ...this.paginationOption}).then(response => {
        if(response.success==true){
            this.tableData = response.result.data
            this.paginationOption.total = response.result.count;
        }
      })
    },
  },
  created() {
    this.search()
  },
};
</script>

<style>
</style>
