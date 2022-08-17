<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!--工具栏-->
      <page-tools :show-before="true">
        <template #before>
          <span>共有16条数据</span>
        </template>
        <template #after>
          <el-button size="small" type="success">excel导入</el-button>
          <el-button size="small" type="success">excel导出</el-button>
          <el-button size="small" type="primary" icon="">新增员工</el-button>
        </template>
      </page-tools>
      <!--表格-->
      <el-card>
        <el-table border>
          <el-table-column label="序号" prop="" type="index" sortable=""></el-table-column>
          <el-table-column label="姓名" prop="" sortable=""></el-table-column>
          <el-table-column label="手机号" prop="" sortable=""></el-table-column>
          <el-table-column label="工号" prop="" sortable=""></el-table-column>
          <el-table-column label="聘用形势" prop="" sortable=""></el-table-column>
          <el-table-column label="部门" prop="" sortable=""></el-table-column>
          <el-table-column label="入职时间" prop="" sortable=""></el-table-column>
          <el-table-column label="是否在职" prop="" sortable=""></el-table-column>
          <el-table-column label="状态" prop="" sortable=""></el-table-column>
          <el-table-column label="操作" fixed="right" width="280">
            <el-button type="text">查看</el-button>
            <el-button type="text">转正</el-button>
            <el-button type="text">调岗</el-button>
            <el-button type="text">离职</el-button>
            <el-button type="text">角色</el-button>
            <el-button type="text">删除</el-button>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination layout="prev, pager, next"></el-pagination>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
