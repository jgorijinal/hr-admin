<template>
  <!--新增部门 弹窗-->
  <el-dialog title="新增部门" :visible="showDialog">
    <!--表单数据-->
    <el-form label-width="120px" :rules="rules" :model="formData">
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.code"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-input
          style="width: 80%"
          placeholder="请选择"
          type="select"
          v-model="formData.manager"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300字符"
          type="textarea"
          :rows="4"
          v-model="formData.introduce"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <!--确定, 取消按钮-->
    <template slot="footer">
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button>取消</el-button>
          <el-button type="primary">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from "@/api/departments"
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 当前操作的节点 
    treeNode: {
      type: Object,
      required:true
    }
  },
  data() {
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async (rules , value , callback) => {
      const result = await getDepartments()
      const { depts } = result
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      const isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      console.log(isRepeat)
      isRepeat ? callback(new Error(`同级部门下已经存在${value}的部门了`)) : callback()
    }

    // 检查编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      const isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      rules: {
        name: [
          { min: 1,max: 50,message: "部门名称要求1-50个字符",trigger: "blur",},
          { required: true, message: '部门名称不能为空', trigger: "blur" },
          { validator:checkNameRepeat , trigger: "blur" },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "部门编码要求1-50个字符", trigger: "blur"},
          {validator:checkCodeRepeat , trigger: "blur" }
        ],
        manager: [{ required: true, message: "部门负责人不能为空", trigger: "blur" },],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {trigger: "blur",min: 1,max: 300, message: "部门介绍要求1-50个字符",
          },
        ],
      },
    };
  },
};
</script>

<style></style>

<!--checkNameRepeat 函数的升级版-->
     <!-- const result = await getDepartments()
      const { depts } = result
      console.log(this.treeNode)
      if (this.treeNode.manager === "负责人") {
        const isRepeat = depts.filter(item => item.pid === "").some(item => item.name === value)
        isRepeat ? callback(new Error(`部门下已经存在${value}, 请重新输入`)) : callback()
      } else {
        const isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
        isRepeat ? callback(new Error(`部门下已经存在${value}, 请重新输入`)) : callback()
      } -->
