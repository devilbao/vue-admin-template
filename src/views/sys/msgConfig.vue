<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="#"
      :http-request="httpRequest"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
    >
      <div  v-if="imageUrl" style="position:relative" @click.stop="imageUrl=''">
        <img  :src="imageUrl" class="avatar" />  
        <div class="del">X</div>
      </div>
      
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>

</template>

<script>
import { upload, download } from "@/api/home";
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,

      imageUrl: "",
    };
  },
  methods: {
    beforeAvatarUpload() {},
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {},

    httpRequest(data) {
      var file = data.file;
      let fd = new FormData();
      fd.append("file", file); //传文件
      console.log(fd, "fd");
      upload(fd).then((res) => {
        if (res.success) {
          download({ fileName: res.result }).then((res) => {
            const blob = new Blob([res], {
              type: "application/png;charset=utf-8",
            });
            const url = window.URL.createObjectURL(blob);
            this.imageUrl = url;
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
 .el-upload{
   border: 1px dashed #d9d9d9 !important;
} 
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
     border: 1px dashed #d9d9d9 !important;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
.del{
  position: absolute;
  right: -6px;
  top: -6px;
  z-index: 2;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: lightcoral;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color:white;
}
</style>
