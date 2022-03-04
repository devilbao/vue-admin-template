<template>
  <div>
    <el-form
      :inline="true"
      :model="form"
      class="demo-form-inline"
      label-width="80px"
    >
      <el-form-item prop="entName" label="企业名称">
        <el-input
          v-model="form.entName"
          placeholder="关键词"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="province" label="省份">
        <el-select v-model="form.province" placeholder="请选择">
          <el-option
            v-for="item in provinceList"
            :key="item.value"
            :label="item.province"
            :value="item.province"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="clear">清空</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column
        prop="entName"
        label="企业名称"
        width="200"
      ></el-table-column>
      <el-table-column prop="introduction" label="企业简介"></el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="info(scope.row)" size="small"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align:right">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="paginationOption.total"
        :current-page="paginationOption.pageNum"
        :hide-on-single-page="true"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>


    <el-dialog :title="title" :visible.sync="infoFlag" width="800px" center @close="close" v-if="infoFlag" >
      <el-form :model="companyInfo" ref="data_form" label-width="150px">
        <el-form-item label="企业名称">
          <span>{{companyInfo.entName}}</span>
        </el-form-item>
        <el-form-item label="企业法人">
          <span>{{companyInfo.legalPerson}}</span>
        </el-form-item>
        <el-form-item label="所属行业">
          <span>{{companyInfo.industry}}</span>
        </el-form-item>
        <el-form-item label="开业状态">
          <span>{{companyInfo.openStatus}}</span>
        </el-form-item>
        <el-form-item label="所属省份">
          <span>{{companyInfo.province}}</span>
        </el-form-item>
        <el-form-item label="注册地址">
          <span>{{companyInfo.regAddr}}</span>
        </el-form-item>
        <el-form-item label="经营范围">
          <span>{{companyInfo.scope}}</span>
        </el-form-item>
        <el-form-item label="联系电话">
          <span>{{companyInfo.telephone}}</span>
        </el-form-item>
        <el-form-item label="邮箱地址">
          <span>{{companyInfo.email}}</span>
        </el-form-item>
        <el-form-item label="企业简介">
          <span>{{companyInfo.introduction}}</span>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="infoFlag = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listCompany,listProvince,getCompany } from "@/api/company";
export default {
  data() {
    return {
      title:'',
      infoFlag:false,
      tableData:[],
      paginationOption: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }, // 分页参数
      provinceList: [],
      form: {
        entName: null,
        province: null,
      },
      companyInfo:null
    };
  },
  methods: {
    info(row){
      this.title='企业详情'
      getCompany({id:row.id}).then(res=>{
          if(res.success){
            this.companyInfo=res.result;
            this.infoFlag=true;
          }
      })
    },
    close(){
      this.$refs['data_form'].resetFields();
    },
    clear(){
      Object.keys(this.form).forEach((key) => {
        this.form[key] = null;
      });
      this.paginationOption.currentPage = 1;
      this.search();
    },
    search() {
      listCompany({...this.form,...this.paginationOption}).then((res) => {
        if (res.success) {
          this.tableData = res.result.data;
          this.paginationOption.total = res.result.count;
        }
      });
    },
    pageChange(pageNum) {
      console.log(pageNum);
      this.paginationOption.pageNum = pageNum;
      this.search();
    },
  },
  created() {
    this.search();
    listProvince().then(res=>{
      if(res.success){
        this.provinceList = res.result;
      }
    })
  },
};
</script>

<style>
</style>
