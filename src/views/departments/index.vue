<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!--组织架构-->
      <el-card class="tree-card" >
        <template #header>
          <tree-tools :tree-node="company" :isRoot="true" @addDept="addDepartment"></tree-tools>
        </template>.
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <template slot-scope="{ data }">
            <tree-tools
              :tree-node="data"
              @delDepts="getDepartments"
              @addDept = "addDepartment"
            ></tree-tools>
          </template>
        </el-tree>
      </el-card>
      <add-dept :showDialog="showDialog" :tree-node="node"/>
    </div>
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools.vue";
import AddDept from "./components/add-dept.vue"

import { getDepartments } from "@/api/departments";
import { transListToTree } from "@/utils";
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: "name",
        children: "children",
      },
      showDialog: false,
      node: {}
    };
  },
  created() {
    this.getDepartments(); // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      console.log(result)
      this.company = { name: result.companyName, manager: "负责人" ,id:""};
      this.departs = transListToTree(result.depts, ""); // 需要将其转化成树形结构
    },
    addDepartment(node) {
      this.showDialog = true  //  显示弹层
      this.node = node  // 因为 node 是当前的点击的部门， 此时这个部门应该记录下来
    }
  },
};
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 0 140px 20px 140px;
  font-size: 14px;
}
.el-card__header {
    padding-bottom: 0 !important;
  }
</style>
