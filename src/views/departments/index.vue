<template>
  <div class="dashboard-container" v-loading="loading">
    <div class="app-container">
      <!--组织架构-->
      <el-card class="tree-card" >
        <template #header>
          <tree-tools :tree-node="company" :isRoot="true" @addDept="addDepartment"></tree-tools>
        </template>
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
              @editDept = "editDepartment"
            ></tree-tools>
          </template>
        </el-tree>
      </el-card>
      <add-dept ref="addDeptRef" :showDialog.sync="showDialog" :tree-node="node" @addDept="getDepartments"/>
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
      node: {},
      loading:false
    };
  },
  created() {
    this.getDepartments(); // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const result = await getDepartments();
      console.log(result)
      this.company = { name: '艾伦科技有限公司', manager: "负责人" ,id:""};
      this.departs = transListToTree(result.depts, ""); // 需要将其转化成树形结构
      this.loading = false
    },
    addDepartment(node) {
      this.showDialog = true  //  显示弹层
      this.node = node  // 因为 node 是当前的点击的部门， 此时这个部门应该记录下来
    },
    editDepartment(node) {
      this.showDialog = true  // 弹窗显示
      this.node = node   // 记录节点

      this.$refs.addDeptRef.getDepartDetail(node.id) // 直接调入子组件的方法 传入id
    }
  },
};1
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
