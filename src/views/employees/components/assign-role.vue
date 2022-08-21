<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnClose">
    <!--多选框-->
    <el-checkbox-group border	 v-model="roleIds">
      <!--这里的 label 是要存储的值 id-->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{item.name}}
      </el-checkbox>
    </el-checkbox-group>
    <!--dialog的footer插槽-->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnClose">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting';
import { getUserDetailById } from '@/api/user';
import { assignRoles } from '@/api/employees'

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {  // 用户的id 用来查询当前用户的角色信息
      type: String,
      required: true
    },
  },
  data() {
    return {
      list: [],    // 全部角色列表
      roleIds:[]   // 当前 角色的 Id列表
    }
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({page:1 , pagesize:20})  // 默认是10条
      this.list = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    async assignRoles() {  // 保存
      await assignRoles({ id: this.userId, roleIds: this.roleIds })

      this.$message.success("操作成功")
    },
    btnOK() {
      this.assignRoles()
      this.$emit("update:showRoleDialog", false) // 关闭弹窗
    },
    btnClose() {
      this.roleIds = [] // 清空原来的数组
      this.$emit("update:showRoleDialog", false) // 关闭弹窗
    }
  },
  created() {
    this.getRoleList()
  }
};
</script>
