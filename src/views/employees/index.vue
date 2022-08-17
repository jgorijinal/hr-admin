<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!--工具栏-->
      <page-tools :show-before="true">
        <template #before>
          <span>共有{{total}}条数据</span>
        </template>
        <template #after>
          <el-button size="small" type="success">excel导入</el-button>
          <el-button size="small" type="success">excel导出</el-button>
          <el-button size="small" type="primary" icon="">新增员工</el-button>
        </template>
      </page-tools>
      <!--表格-->
      <el-card>
        <el-table border :data="list" v-loading="loading">
          <el-table-column label="序号"  type="index" sortable="" width="60" align="center"></el-table-column>
          <el-table-column label="姓名" prop="username" sortable=""></el-table-column>
          <el-table-column label="手机号" prop="mobile" sortable=""></el-table-column>
          <el-table-column label="工号" prop="workNumber" sortable=""></el-table-column>
          <el-table-column label="聘用形势" prop="formOfEmployment" sortable=""></el-table-column>
          <el-table-column label="部门" prop="departmentName" sortable=""></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry" sortable=""></el-table-column>
          <el-table-column label="是否在职" prop="inServiceStatus" sortable=""></el-table-column>
          <el-table-column label="状态" prop="enableState" sortable=""></el-table-column>
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
          <el-pagination layout="prev, pager, next" :total="total" @current-change="currentChange"></el-pagination>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeeList } from "@/api/employees.js"
export default {
  data() {
    return {
      list: [],  // 列表数据 , 初始化值必须是 空数组[],
      loading:false,  // 加载动画遮罩层
      pageInfo: {
        page:1 ,       // 页码
        size:10      // 每页条数
      },
      total : 0       // 总数
    }
  },
  methods: {
    async getEmployeeList() {   // 列表数据
      this.loading = true
      const result = await getEmployeeList(this.pageInfo)
      const { total, rows } = result
      this.list = rows
      this.total = total
      this.loading = false
    },
    async currentChange(currentPage) {
      this.pageInfo.page = currentPage
      await this.getEmployeeList()
    }
  },
  created() {
    this.getEmployeeList()
  }
};
</script>

<style></style>
