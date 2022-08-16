<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!--角色管理-->
          <el-tab-pane label="角色管理">
            <!--新建按钮-->
            <el-row style="height: 60px">
              <el-button type="primary" icon="el-icon-plus" size="small"
                >新建角色</el-button
              >
            </el-row>
            <!--表格-->
            <el-table border :data="roleList">
              <el-table-column
                label="序号"
                width="120"
                type="index"
                align="center"
              ></el-table-column>
              <el-table-column
                label="角色名称"
                width="240"
                prop="name"
              ></el-table-column>
              <el-table-column
                label="描述"
                prop="description"
              ></el-table-column>
              <el-table-column label="操作" width="360" align="center">
                <el-button type="success" size="small">分配权限</el-button>
                <el-button type="primary" size="small">编辑</el-button>
                <el-button type="danger" size="small">删除</el-button>
              </el-table-column>
            </el-table>
            <!--分液器-->
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
          </el-tab-pane>
          <!--公司信息-->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              :closable="false"
              show-icon
              effect="dark"
            >
            </el-alert>
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  style="width: 400px"
                  disabled
                  v-model="companyInfo.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  style="width: 400px"
                  disabled
                  v-model="companyInfo.companyAddress"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  style="width: 400px"
                  disabled
                  v-model="companyInfo.mailbox"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  style="width: 400px"
                  disabled
                  :rows="3"
                  v-model="companyInfo.remarks"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo } from "@/api/setting";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      roleList: [], // 角色列表
      pageInfo: {
        page: 1, // 页码
        pagesize: 10, // 每页条数
      },
      total: 0, // 总数,
      companyInfo: {}, // 公司信息系
    };
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.pageInfo);
      this.total = total;
      this.roleList = rows;
    },
    async currentChange(currentPage) {
      this.pageInfo.page = currentPage; // 将当前页码赋值给当前的最新页码
      this.getRoleList(this.pageInfo);
    },
    async getCompanyInfo() {
      const result = await getCompanyInfo(this.companyId);
      this.companyInfo = result;
    },
  },

  created() {
    this.getRoleList(); // 获取角色列表
    this.getCompanyInfo(); // 获取公司信息
  },
};
</script>

<style></style>
