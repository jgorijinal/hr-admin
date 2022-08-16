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
              @click="showDialog = true"
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
                <template slot-scope="scope">
                  <el-button type="success" size="small">分配权限</el-button>
                  <el-button
                    type="primary"
                    size="small"
                    @click="editRole(scope.row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    size="small"
                    @click="deleteRole(scope.row.id)"
                    >删除</el-button
                  >
                </template>
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
                ></el-input> </el-form-item
              >-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!--编辑角色弹窗-->
    <el-dialog title="编辑角色" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!--footer 插槽-->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button @click="btnCancel">取 消</el-button>
          <el-button type="primary" @click="btnOK">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole
} from "@/api/setting";
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
      showDialog: false, // dialog 显示隐藏
      roleForm: {
        // 编辑角色表单
        name: '',
        description:''
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
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
    deleteRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return deleteRole(id);
        })
        .then(() => {
          this.getRoleList();
          this.$message.success("删除角色成功");
        });
    },
    async editRole(id) {     // 编辑角色功能
      this.roleForm = await getRoleDetail(id)  // 先调接口 , 获取数据
      this.showDialog = true;   // 显示弹窗 , 为了不出现闪烁的问题 先获取数据 再弹出层
    },
    async btnOK() {  // 点击了弹窗的 确定
      this.$refs.roleFormRef.validate(async (isOK) => {
        if (isOK) {
          // 校验通过
          // 有 id 是编辑 , 没 id 是新增
          if (this.roleForm.id) {
            // 编辑
            await updateRole(this.roleForm)
          } else {
            // 新增
            await addRole(this.roleForm)
          }
          this.getRoleList()  // 重新拉取数据
          this.$message.success("操作成功")
          this.showDialog = false   // 关闭弹层  =>  触发el-dialog的事件close事件, 相当于简介调用了 btnCancel方法
          // 要做的事总结:
          // 关闭弹层
          // 重新拉取数据
          // 表单数据清空
          // 校验要重置
        } else {
          //校验没通过
        }
        })
    },
    btnCancel() {
      this.showDialog = false
      this.$refs.roleFormRef.resetFields()

      this.roleForm = {
        name: '',
        description:''
      }
      console.log("执行了一次")
    }
  },

  created() {
    this.getRoleList(); // 获取角色列表
    this.getCompanyInfo(); // 获取公司信息
  },
};
</script>

<style></style>
