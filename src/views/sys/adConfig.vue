<template>
  <div>
    <el-button type="primary" @click="add()">新增</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column
        prop="linkPath"
        label="链接地址"
        width="200"
      ></el-table-column>
      <el-table-column prop="filePath" label="图片">
        <template slot-scope="scope">
          <el-button type="text" @click="fileLook(scope.row.filePath)"
            >查看</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" :formatter="typeFormat">
      </el-table-column>
      <el-table-column label="状态" align="center">
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
      width="600"
      center
      @close="close"
      v-if="editFlag"
    >
      <el-form :model="data_form" ref="data_form2" label-width="150px">
        <el-form-item label="链接地址">
          <el-input
            style="width: 400px"
            v-model.trim="data_form.linkPath"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model.trim="data_form.type" placeholder="请选择">
            <el-option label="横幅广告" :value="1"> </el-option>
            <el-option label="轮播广告" :value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="顺序" v-if="data_form.type == 2">
          <el-input
            style="width: 100px"
            v-model.trim="data_form.orders"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <imgUpload v-model.trim="data_form.filePath"></imgUpload>
        </el-form-item>
        <!-- <el-form-item label="是否有效">
          <el-switch
            v-model.trim="data_form.isEnabled"
            active-color="#36c6d3"
            :active-value="true"
            :inactive-value="false"
          >
          </el-switch>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFlag = false">取 消</el-button>
        <el-button type="primary" @click="sure()">确 定</el-button>
      </span>
    </el-dialog>

    <div style="text-align: right">
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

    <el-dialog
      title="图片预览"
      :visible.sync="preViewImgFlag"
      center
    >
      <img style="width:100%" :src="preViewImgSrc" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import imgUpload from "@/components/imgUpload";
import { upload, download } from "@/api/home";
import { list, changeStatus, update, deleteA, add } from "@/api/adConfig";
export default {
  components: {
    imgUpload,
  },
  data() {
    return {
      preViewImgFlag: false,
      preViewImgSrc: "",
      title: "",
      editFlag: false,
      tableData: [],
      paginationOption: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }, // 分页参数
      data_form: {
        filePath: null,
        id: null,
        isEnabled: null,
        linkPath: null,
        orders: null,
        type: null,
      },
    };
  },
  methods: {
    add() {
      this.title = "新增";
      this.data_form.filePath = null;
      this.data_form.id = null;
      this.data_form.isEnabled = null;
      this.data_form.linkPath = null;
      this.data_form.orders = null;
      this.data_form.type = null;
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
            this.editFlag = false;
            this.search();
            this.$message.success("操作成功");
          }
        });
      }
    },
    close() {
      this.$refs["data_form"].resetFields();
      console.log(this.data_form, "data_form");
    },
    typeFormat(row) {
      switch (row.type) {
        case 1:
          return "横幅广告";
          break;
        case 2:
          return "轮播广告";
          break;
      }
    },
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
    search() {
      list({ ...this.paginationOption }).then((res) => {
        if (res.success) {
          this.tableData = res.result.data;
        }
      });
    },
    changeStatus(id) {
      changeStatus(id).then((response) => {
        if (response.success == true) {
          this.search();
        }
      });
    },
    handleEdit(row) {
      console.log(row);
      this.title = "编辑";
      this.data_form.filePath = row.filePath;
      this.data_form.id = row.id;
      this.data_form.isEnabled = row.isEnabled;
      this.data_form.linkPath = row.linkPath;
      this.data_form.orders = row.orders;
      this.data_form.type = row.type;
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
