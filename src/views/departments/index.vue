<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <template #header>
          <tree-tools :tree-node="company" :isRoot="true"></tree-tools>
        </template>
        <el-tree :data="departs" :props="defaultProps">
          <template slot-scope="{data}">
            <tree-tools :tree-node="data"></tree-tools>
          </template>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools.vue"
export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company:{name:'艾伦科技有限公司' , manager:'负责人'},
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],

      defaultProps: {
        label: "name",
        children: "children",
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 20px 140px;
  font-size: 14px;
}
.companyName {
  font-weight: bolder;
}
</style>
