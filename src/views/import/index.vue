<template>
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from "@/api/employees";
export default {
  data() {
    return {
      type: this.$route.query.type,
    };
  },
  methods: {
    async success({ header, results }) {
      if (this.type === "user") {
        // this.$router.push('/import?type=user')
        // header 和 results 里面属性全都是中文 , 想要掉接口必须改成对应的英文
        const userRelations = {
          // 哈希表
          入职日期: "timeOfEntry",
          手机号: "mobile",
          姓名: "username",
          转正日期: "correctionTime",
          工号: "workNumber",
        };
        const arr = [];
        results.forEach((item) => {
          const obj = {};
          Object.keys(item).forEach((key) => {
            if (userRelations[key] === "timeOfEntry" || userRelations[key] === "correctionTime") {
              obj[userRelations[key]] = new Date(
                this.formatDate(item[key], "/")
              ); // 只有这样, 才能入库
              return;
            }
            obj[userRelations[key]] = item[key];
          });
          arr.push(obj);
        });

        await importEmployee(arr); // 调批量导入接口
        this.$message.success("操作成功"); // 提示成功
      }
      this.$router.back(); // 返回上一页
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      );
    },
  },
};
</script>

<style></style>
