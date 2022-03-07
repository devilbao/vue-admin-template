<template>
  <div>
    <div>
      <el-form
        :inline="true"
        :model="form"
        class="demo-form-inline"
        label-width="80px"
      >
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input
                v-model="form.word"
                placeholder="关键词"
                style="width: 300px"
              ></el-input>
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

    <el-button type="primary" @click="add()">新增</el-button>

    <el-table v-loading="loading" :data="tableData" style="width: 100%" >
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="word" label="关键词" width="200">
      </el-table-column>
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.icon!=null" type="text" @click="fileLook(scope.row.icon)"
            >查看</el-button
          >
          <p v-else>--</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isEnabled"
            active-color="#36c6d3"
            :active-value="true"
            :inactive-value="false"
            @change="changeStatus(scope.row.id)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdTime"
        label="创建日期"
        width="200"
        align="center"
      >
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isEnabled"
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
      width="30%"
      center
      @close="close"
    >
      <el-form :model="data_form" ref="data_form">
        <el-form-item label="关键词">
          <el-input
            :disabled="title == '编辑'"
            v-model="data_form.word"
          ></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <imgUpload v-model="data_form.icon"></imgUpload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFlag = false">取 消</el-button>
        <el-button type="primary" @click="sure()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <el-pagination
      style="float: right; position: absolute; right: 30px; bottom: 50px"
      background
      layout="prev, pager, next"
      :total="paginationOption.total"
      :current-page="paginationOption.pageNum"
      :hide-on-single-page="true"
      @current-change="pageChange"
    >
    </el-pagination> -->

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

    <el-dialog title="图片预览" :visible.sync="preViewImgFlag" center>
      <img style="width: 100%" :src="preViewImgSrc" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { upload, download } from "@/api/home";
import { list, changeStatus, update, deleteA, add } from "@/api/term";
import imgUpload from "@/components/imgUpload";
export default {
  components: {
    imgUpload,
  },
  data() {
    return {
      loading:false,
      data_form: {
        word: null, // 关键词
        icon: null,
      },
      title: "",
      editFlag: false,
      tableData: [],
      paginationOption: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }, // 分页参数
      form: {
        enabled: null, // 是否生效
        word: null, // 关键词
      },
      preViewImgSrc: "",
      preViewImgFlag: false,
    };
  },
  methods: {
    fileLook(filePath) {
      download({ fileName: filePath }).then((res) => {
        const blob = new Blob([res], {
          type: "application/png;charset=utf-8",
        });
        const url = window.URL.createObjectURL(blob);
        this.preViewImgSrc = url;
        this.preViewImgFlag = true;
      });
    },
    add() {
      this.title = "新增";
      this.data_form = {
        word: null, // 关键词
        icon: null,
      };
      this.editFlag = true;
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
    close() {
      this.$refs["data_form"].resetFields();
      console.log(this.data_form, "data_form");
    },
    sure() {
      if (this.title == "新增") {
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
            this.$message.success("操作成功");
            this.search();
            this.editFlag = false;
          }
        });
      }
    },
    changeStatus(id) {
      changeStatus(id).then((response) => {
        if (response.success == true) {
          this.search();
        }
      });
    },
    pageChange(pageNum) {
      console.log(pageNum);
      this.paginationOption.pageNum = pageNum;
      this.search();
    },
    //搜索方法
    search() {
      this.loading=true;
      list({ ...this.form, ...this.paginationOption }).then((response) => {
         this.loading=false;
        if (response.success == true) {
          this.tableData = response.result.data;
          this.paginationOption.total = response.result.count;
        }
      });
    },
    clear() {
      Object.keys(this.form).forEach((key) => {
        this.form[key] = null;
      });
      this.paginationOption.currentPage = 1;
      this.search();
    },
    handleEdit(row) {
      console.log(row);
      this.title = "编辑";
      this.data_form.word = row.word;
      this.data_form.icon = row.icon;
      this.data_form.id = row.id;
      this.editFlag = true;
    },
  },
  created() {
    this.search();
  },
};
</script>

<style>
</style>
