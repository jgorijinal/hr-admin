<template>
  <el-dialog :visible="showDialog" title="新增员工" @close="btnCancel">
    <el-form label-width="120px" :model="formData" :rules="rules" ref="formRef">
      <el-form-item label="姓名">
        <el-input style="width: 60%" placeholder="请输入姓名" v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input style="width: 60%" placeholder="请输入手机号" v-model="formData.mobile"></el-input>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker
          style="width: 60%"
          placeholder="请选择日期"
          v-model="formData.timeOfEntry"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="聘用形式">
        <el-select style="width: 60%" placeholder="请选择" v-model="formData.formOfEmployment">
          <el-option v-for="item in EnumEmployee.hireType" :key="item.id" :value="item.id" :label="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号">
        <el-input style="width: 60%" placeholder="请选择工号" v-model="formData.workNumber"></el-input>
      </el-form-item>
      <el-form-item label="部门">  <!--展示 树形 部门数据 -->
        <el-input style="width: 60%" placeholder="请选择部门" v-model="formData.departmentName" @focus="getDepartments"></el-input>
        <el-tree v-if="showTree" :data="treeData" :props="{label:'name'}" default-expand-all @node-click="nodeClick"></el-tree>
      </el-form-item>
      <el-form-item label="转正时间">
        <el-date-picker
          style="width: 60%"
          placeholder="请选择日期"
          v-model="formData.correctionTime"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <!--底部f footer-->
    <el-row slot="footer" type="flex" justify="center">
      <el-button size="small" @click="btnCancel">取消</el-button>
      <el-button size="small" type="primary" @click="btnOK">确定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addEmployee } from "@/api/employees"
import { getDepartments } from "@/api/departments"
import { transListToTree } from "@/utils"
import EnumEmployee from "@/api/constant/employees"

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
          username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      treeData: [],  // 树形数据(部门)
      showTree: false, // 是否显示 el-tree
      EnumEmployee
    };
  },
  methods: {
    async getDepartments() {  // input 获取焦点时 , 获取树形部门数据
      const { depts } = await getDepartments()   // 获取全部部门
      this.treeData = transListToTree(depts, '') // 转为树形数据
      this.showTree = true                      // 显示 el-tree
    },
    nodeClick(node) {
      this.formData.departmentName = node.name  // 点击节点的 name , 赋值给表单
      this.showTree = false   // 点击了节点 , 就隐藏 el-tree
    },
    async btnOK() {
      try {
        await this.$refs.formRef.validate()
        await addEmployee(this.formData) // 调新增接口

        this.$parent.getEmployeeList()           //1. 让父组件重新更新数据
        this.$message.success("操作成功")        // 2. 提示成功
        this.$emit("update:showDialog" , false) // 3. 通知父组件关闭弹窗
      } catch (err) {
        // 校验没通过(捕获的是上面第一个 await, 也就是校验)
        console.log(err)
      }
    },
    btnCancel() {
      // 重置原来的数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.formRef.resetFields()         // 重置校验结果
      this.$emit("update:showDialog" , false)  // 关闭弹窗
    }
  },
};
</script>

<style></style>
