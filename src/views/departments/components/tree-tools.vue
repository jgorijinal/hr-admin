<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <span class="companyName">{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>
          <span>{{ treeNode.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                <el-dropdown-item v-if="!isRoot" command="edit"
                  >编辑部门</el-dropdown-item
                >
                <el-dropdown-item v-if="!isRoot" command="del"
                  >删除部门</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartment } from '@/api/departments';

export default {
  props: {
    treeNode: {
      type: Object,
      required: true,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 点击下拉菜单 删除, 编辑 , 新增时触发
    operateDepts(command) {
      if (command === "add") {
         // 添加子部门的操作
        // 告诉父组件 显示弹层
        this.$emit("addDept" , this.treeNode) // 为何传出treeNode 因为是添加子部门 需要当前部门的数据
      } else if (command === "edit") {
        // 编辑时
        this.$emit("editDept" , this.treeNode)
      } else if (command === "del") {
        this.$confirm("此操作将删除该部门数据, 是否继续?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(() => {
           // 如果点击了确定就会进入then
          return delDepartment(this.treeNode.id)   // 返回promise对象
        }).then(() => {
          //  如果删除成功了  就会进入这里
          this.$message.success("删除部门成功")
          // 只是调用了接口, 后端数据变了 , 但前端没变

          // emit 自定义事件 , 通知父组件更新数据
          this.$emit("delDepts")
        }).catch(err => {
           // request请求内部响应拦截器 reject了会走这里 , 因为里面会 Promise.reject
          console.log(err)
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.companyName {
  font-weight: bold;
}
</style>
