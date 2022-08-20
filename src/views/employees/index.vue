<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!--工具栏-->
      <page-tools :show-before="true">
        <template #before>
          <span>共有{{ total }}条数据</span>
        </template>
        <template #after>
          <el-button
            size="small"
            type="success"
            @click="$router.push('/import?type=user')"
            >excel导入</el-button
          >
          <el-button size="small" type="success" @click="exportData">excel导出</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!--表格-->
      <el-card>
        <el-table border :data="list" v-loading="loading">
          <el-table-column
            label="序号"
            type="index"
            sortable=""
            width="60"
            align="center"
          ></el-table-column>
          <el-table-column
            label="姓名"
            prop="username"
            sortable=""
          ></el-table-column>
          <el-table-column label="头像" sortable="" align="center" >
            <template v-slot="scope">
                <el-avatar >
                  <div @click="showQrCode(scope.row.staffPhoto)">
                    <img v-if="scope.row.staffPhoto" :src="scope.row.staffPhoto" alt="" style="width: 100%;">
                    <img v-else :src="require('@/assets/common/bigUserHeader.png')" alt="">
                  </div>

                </el-avatar>
                <!-- <img
                slot="reference"
                v-imageError="require('@/assets/common/bigUserHeader.png')"
                :src="scope.row.staffPhoto"
                style="border-radius: 50%; width: 80px; height: 80px; padding: 10px"
                alt=""
                -->
            </template>
          </el-table-column>
          <el-table-column
            label="手机号"
            prop="mobile"
            sortable=""
          ></el-table-column>
          <el-table-column
            label="工号"
            prop="workNumber"
            sortable=""
          ></el-table-column>
          <el-table-column
            label="聘用形势"
            prop="formOfEmployment"
            sortable=""
            :formatter="formatEmployment"
          ></el-table-column>
          <el-table-column
            label="部门"
            prop="departmentName"
            sortable=""
          ></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
            <template slot-scope="obj">
              {{ obj.row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            label="是否在职"
            prop="inServiceStatus"
            sortable=""
            :formatter="formatInServiceStatus"
          ></el-table-column>
          <el-table-column
            label="状态"
            prop="enableState"
            sortable=""
            align="center"
          >
            <template #default="scope">
              <el-switch
                :value="scope.row.enableState === 1"
                disabled
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="280">
            <template v-slot="scope">
              <el-button type="text" @click="$router.push(`/employees/detail/${scope.row.id}`)">查看</el-button>
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text">角色</el-button>
              <el-button type="text" @click="delEmployee(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            @current-change="currentChange"
          ></el-pagination>
        </el-row>
      </el-card>
    </div>
    <!-- 弹窗 -->
    <!-- 子组件改变父组件数据的语法糖 子组件里 this.$emit("update:showDialog" , false) -->
    <add-employee :show-dialog.sync="showDialog"></add-employee>
    <el-dialog title="图片二维码" :visible.sync="visible">
      <el-row type="flex" justify="center">
        <canvas ref="canvasRef"></canvas>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees.js";
import EmployeeEnum from "@/api/constant/employees.js"; // 枚举对象
import AddEmployee from "./components/add-employee.vue";
import { formatDate } from '@/filters';
import QrCode from "qrcode"

export default {
  components: {
    AddEmployee,
  },
  data() {
    return {
      list: [], // 列表数据 , 初始化值必须是 空数组[],
      loading: false, // 加载动画遮罩层
      pageInfo: {
        page: 1, // 页码
        size: 10, // 每页条数
      },
      total: 0, // 总数
      showDialog: false,
      visible:false // 二维码 dialog 显示隐藏
    };
  },
  methods: {
    async getEmployeeList() {
      // 列表数据
      this.loading = true;
      const result = await getEmployeeList(this.pageInfo);
      const { total, rows } = result;
      this.list = rows;
      this.total = total;
      this.loading = false;
      console.log(result);
    },
    async currentChange(currentPage) {
      this.pageInfo.page = currentPage;
      await this.getEmployeeList();
    },
    formatEmployment(row, column, cellValue, index) {
      // 去找 1或2 对应的值
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    formatInServiceStatus(row, column, cellValue, index) {
      // 去找 1 或 2 对应的值
      if (cellValue) {
        const obj = EmployeeEnum.workingState.find(
          (item) => item.id === cellValue.toString() ////////////
        );
        return obj ? obj.value : "未知";
      }
    },
    async delEmployee(id) {
      // 删除员工
      try {
        await this.$confirm("确定要删除此员工吗?");
        await delEmployee(id); // 调删除接口 , 会等到上面的 await 成功
        this.$message.success("操作成功"); // 提示成功
        this.getEmployeeList(); // 重新拉取数据
      } catch (err) {
        // 如果点击了 取消键 会来这儿捕获 cancel
        console.log("cancel");
      }
    },
    async exportData() {  // 导出 excel
      // 分析 : header 从哪里来 , data 从哪里来
      // 还有现在没有接口获取所有的数据 , 想办法获取所有数据
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const { rows } = await getEmployeeList({ page: 1, size: this.total })
      const data = this.formatJson(headers, rows)
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      import("@/vendor/Export2Excel").then((excel) => {
        excel.export_json_to_excel({
          header: Object.keys(headers), // [] 数组
          data,       // [[] , [] ,[]....]
          multiHeader,
          merges
        });
      });
    },
    formatJson(headers, rows) {  // 得到 data 数据结构  :  [{},{}]  ->  [[],[]]
      return rows.map(obj => {
        return Object.keys(headers).map(item => {
              // 时间格式话处理
          if (headers[item] === "timeOfEntry" || headers[item] === "correctionTime") {
              return formatDate(obj[headers[item]])
          } else if (headers[item] === "formOfEmployment") {
              // 聘用形式字段处理
              const target = EmployeeEnum.hireType.find(i => i.id === obj[headers[item]])
              return target ? target.value : "未知"
          }
            return obj[headers[item]]
          })
      })
    },
    showQrCode(url) {  // 显示 图片二维码的弹窗
      if (url) {
          // 显示弹窗
        this.visible = true
        // 数据更新了 , 但页面的渲染师异步的, 还没创建 ref
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.canvasRef , url)
        })
      } else {
        this.$message.error("该用户没有上传图片")
      }
    },
  },
  created() {
    this.getEmployeeList();
  },
};
</script>

<style></style>
1
