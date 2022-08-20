// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from "@/components/PageTools/index.vue";
import UploadExcel from "@/components/UploadExcel/index.vue"
import ImageUpload from "@/components/ImageUpload/index.vue"
import Print from "vue-print-nb"
export default {
  install(Vue) {
    // 注册全局的通用栏组件对象
    Vue.component("PageTools", PageTools);
    Vue.component("UploadExcel", UploadExcel);
    Vue.component("ImageUpload", ImageUpload);
    Vue.use(Print)
  },
};
