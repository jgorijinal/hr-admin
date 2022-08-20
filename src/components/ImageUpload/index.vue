<template>
  <div>
    <!--先给 action 一个 # , 防止报错-->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="remove"
      :on-change="change"
      :class="{ disabled: fileComputed }"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercentage" :percentage="percentage" style="width:180px"></el-progress>
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>
<script>
import COS from "cos-js-sdk-v5";
const cos = new COS({
  // cos对象
  SecretId: "AKIDMXR5SZQzIK5ZnkQovlKbbLo0uc3E8m9E",
  SecretKey: "pNfgPr2xc08zZomUv5xZtwiDQM0NTIq7",
});
export default {
  data() {
    return {
      fileList: [],// 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: "", // img 标签里的 src属性值
      currentFileUid: null, // 上传文件时的当前文件 uid
      percentage: 0, //进度条百分比 0-100
      showPercentage:false  // 显示 或 隐藏 进度条
    };
  },
  computed: {
    // 设定一个计算属性, 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1;
    },
  },
  methods: {
    preview(file) {
      // 点击预览触发
      console.log(file);
      this.imgUrl = file.url; // 给 el-dialog 里 img 标签赋值 url
      this.showDialog = true; // 显示弹窗
    },
    remove(file, fileList) {
      // 删除操作
      // file 删除的那个文件
      // fileList 删除之后的文件数组
      // this.fileList 原来组件内的文件数组
      // console.log(file)
      // console.log(fileList)
      // console.log(this.fileList)
      // this.fileList = fileList 或者 下面代码
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
    },
    change(file, fileList) {
      // 修改文件时触发
      // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
      // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
      // [] => [...fileList] [] => fileList.map()
      // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
      this.fileList = fileList.map((item) => item);
    },
    beforeUpload(file) {
      console.log(file);
      // 1. 先检查文件类型
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.includes(file.type)) {
        this.$message.error("上传图片只能是 JPG、GIF、BMP、PNG 格式");
        return false;
      }
      // 2. 检查图片的大小, 不能超过5M    1M = 1024kb , 1kb = 1024b
      const maxSize = 5 * 1024 * 1024; // 这里的单位是 b
      if (file.size > maxSize) {
        this.$message.error("图片大小最大不能超过5M");
        return false;
      }
      this.currentFileUid = file.uid; // 已经确定当前上传的就是当前的这个file了
      this.showPercentage = true  // 显示进度条
      return true; //  最后一定要 return true
    },
    upload(params) {
      cos.putObject(
        {
          Bucket: "xiaocui2822-1313403793", // 存储桶
          Region: "ap-beijing", //地域
          Key: params.file.name, // 文件名
          StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
          Body: params.file, // 上传文件对象
          onProgress: progressData => { // 箭头函数
            console.log(progressData)
            this.percentage = progressData.percent*100
          }
        },
        (err, data)=> {  // 箭头函数
          // data返回数据之后 应该如何处理
          console.log(err || data);
          // data中有 statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            this.fileList.map((item) => {
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性 , 前面要加 "http://"
                return { url: "http://" + data.Location, upload: true };
              }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              return item
            });
            // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图

            // 最后隐藏进度条
            // 把this.percentage 重置为 0
            setTimeout(() => {
              this.showPercentage = false
              this.percentage = 0
            },800)
          }
        }
      );
    },
  },
};
</script>

<style lang="scss">
.disabled {
  > .el-upload--picture-card {
    display: none;
  }
}
</style>
