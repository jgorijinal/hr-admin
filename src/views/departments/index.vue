<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <template #header>
          <tree-tools :tree-node="company" :isRoot="true"></tree-tools>
        </template>
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <template slot-scope="{ data }">
            <tree-tools :tree-node="data" @delDepts="getDepartments"></tree-tools>
          </template>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools.vue";
import { getDepartments } from '@/api/departments';
import { transListToTree}  from "@/utils"
export default {
  components: {
    TreeTools,
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: "name",
        children: "children",
      },
    };
  },
  created() {
    this.getDepartments()  // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人' }
      this.departs = transListToTree(result.depts,'')    // 需要将其转化成树形结构
    }
  }
};
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 20px 140px;
  font-size: 14px;
}
</style>
