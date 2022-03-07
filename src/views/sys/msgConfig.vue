<template>
  <div>
    <el-button type="primary" @click="add()">新增</el-button>
    <el-table :data="tableData" style="width: 100%" >
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      
      <el-table-column prop="signName" label="签名公司"></el-table-column>
      <el-table-column prop="sendTimeInterval" width="190" label="短信发送最小间隔（毫秒）"></el-table-column>
      <el-table-column prop="expirationTimeInterval" width="190" label="验证码过期时间（毫秒）"></el-table-column>
      <el-table-column prop="accessKeyId" label="accessKeyId"></el-table-column>
      <el-table-column prop="accessKeySecret" label="accessKeySecret"></el-table-column>
       <el-table-column label="是否有效" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model.trim="scope.row.isEnabled"
            active-color="#36c6d3"
            :active-value="true"
            :inactive-value="false"
            @change="changeStatus(scope.row.id)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
          
            type="text"
            @click="handleEdit(scope.row)"
            size="small"
            >编辑</el-button
          >
          <el-button
            style="color: red"
            v-if="scope.row.isEnabled"
            type="text"
            @click="del(scope.row)"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

     <el-dialog
      :title="title"
      :visible.sync="editFlag"
      width="800px"
      center
      @close="close()"
      v-if="editFlag"
    >

      <el-form :model="data_form" ref="data_form" label-width="300px">
        <el-form-item label="AccessKey Id" prop="accessKeyId">
          <el-input style="width:400px" v-model.trim="data_form.accessKeyId"></el-input>
        </el-form-item>
        <el-form-item label="AccessKey Secret" prop="accessKeySecret">
          <el-input style="width:400px" v-model.trim="data_form.accessKeySecret"></el-input>
        </el-form-item>
        <el-form-item label="阿里短信站点" prop="aliEndpoint">
          <el-input style="width:400px" v-model.trim="data_form.aliEndpoint"></el-input>
        </el-form-item>
        <el-form-item label="短信过期间隔（毫秒）" prop="expirationTimeInterval">
          <el-input style="width:400px" v-model.trim="data_form.expirationTimeInterval"></el-input>
        </el-form-item>
        <el-form-item label="模板CODE" prop="messageModelCode">
          <el-input style="width:400px" v-model.trim="data_form.messageModelCode"></el-input>
        </el-form-item>
        <el-form-item label="协议" prop="protocol">
          <el-input style="width:400px" v-model.trim="data_form.protocol"></el-input>
        </el-form-item>
        <el-form-item label="短信发送最小间隔（毫秒）" prop="sendTimeInterval">
          <el-input style="width:400px" v-model.trim="data_form.sendTimeInterval"></el-input>
        </el-form-item>
        <el-form-item label="	签名公司" prop="signName">
          <el-input style="width:400px" v-model.trim="data_form.signName"></el-input>
        </el-form-item>
    
     
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFlag = false">取 消</el-button>
        <el-button type="primary" @click="sure()">确 定</el-button>
      </span>
    </el-dialog>

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
  </div>
</template>

<script>
import { list,changeStatus,add,update,deleteA } from "@/api/msgConfig";
export default {
  data() {
    return {
       paginationOption: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }, // 分页参数
      tableData:[],
      title:'',
      editFlag:false,
      data_form:{
        accessKeyId:null,
        accessKeySecret:null,
        aliEndpoint:null,
        expirationTimeInterval:null,
        id:null,
        messageModelCode:null,
        protocol:null,
        sendTimeInterval:null,
        signName:null,
        isEnabled:null,
      }
    };
  },
  methods: {
    pageChange(pageNum) {
      console.log(pageNum);
      this.paginationOption.pageNum = pageNum;
      this.search();
    },
    del(row) {
      this.$confirm("确定要删除吗？", "确认框", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteA(row.id).then((res) => {
            if (res.success) {
              this.search();
              this.$message.success("删除成功");
            }
          });
        })
        .catch(() => {});
    },
    sure(){
      if ((this.title == "新增")) {
        add(this.data_form).then((res) => {
          if (res.success) {
            this.editFlag = false;
            this.search();
            this.$message.success("操作成功");
          }
        });
      } else {
        update(this.data_form).then((res) => {
          if (res.success) {
            this.editFlag = false;
            this.search();
            this.$message.success("操作成功");
          }
        });
      }
    },
    handleEdit(row) {
      console.log(row);
      this.title = "编辑";
      this.data_form.accessKeyId=row.accessKeyId
        this.data_form.accessKeySecret=row.accessKeySecret
        this.data_form.aliEndpoint=row.aliEndpoint
        this.data_form.expirationTimeInterval=row.expirationTimeInterval
        this.data_form.id=row.id
        this.data_form.messageModelCode=row.messageModelCode
        this.data_form.protocol=row.protocol
        this.data_form.sendTimeInterval=row.sendTimeInterval
        this.data_form.signName=row.signName
        this.data_form.isEnabled=row.isEnabled
      this.editFlag = true;
    },
    close(){
      this.$refs["data_form"].resetFields();
    },
    add(){
      this.title="新增"
      this.editFlag = true;
      this.data_form={
        accessKeyId:null,
        accessKeySecret:null,
        aliEndpoint:null,
        expirationTimeInterval:null,
        id:null,
        messageModelCode:null,
        protocol:null,
        sendTimeInterval:null,
        signName:null,
        isEnabled:null,
      }
    },
    changeStatus(id) {
      changeStatus(id).then((response) => {
        this.search();
      }).catch((e)=>{
        this.search();
      })
    },
    search() {
      list({...this.paginationOption}).then((res) => {
        if (res.success) {
          this.tableData=res.result.data;
        }
      });
    },
  },
  created() {
    this.search();
  },
};
</script>

<style>
</style>