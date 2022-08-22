<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!--靠右的按钮-->
      <page-tools>
        <template v-slot:after>
          <el-button size="small" type="primary" @click="addPermission(1 ,'0')">添加权限</el-button>
        </template>
      </page-tools>
      <!--表格-->
      <!--指定 row-key="id"为为唯一属性-->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称"  prop="name" />
        <el-table-column label="标识" align="center"  prop="code"/>
        <el-table-column label="描述" align="center" prop="description"/>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <!--添加按钮 只在访问权的层级为 type === 1的时候材显示,  说明 2 就不显示添加按钮-->
            <el-button v-if="scope.row.type === 1" type="text" size="small" @click="addPermission(2 ,scope.row.id)">添加</el-button>
            <el-button type="text" size="small" @click="editPermission(scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" @click="delPermission(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--新增 / 编辑 弹窗-->
      <el-dialog :visible="showDialog" @close="btnCancel">
        <!-- 表单 -->
        <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
        <!--footer插槽-->
        <template v-slot:footer>
          <el-row type="flex" justify="center">
              <el-button size="small" @click="btnCancel">取消</el-button>
              <el-button type="primary" size="small" @click="btnOK">确定</el-button>
          </el-row>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList,addPermission,delPermission,getPermissionDetail,updatePermission } from "@/api/permission"
import { transListToTree } from "@/utils"
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules:{
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
    }
  },
  methods: {
    async getPermissionList() {
      this.list = transListToTree(await getPermissionList(), '0')
    },
    delPermission(id) {
      this.$confirm('确定要删除权限吗?').then(async () => {
        await delPermission(id)
        this.$message("删除成功")
        this.getPermissionList()  // 重新啦数据
      }).catch(err => {
        console.log(err)  // cancel
      })
    },
    addPermission(type, pid) { // 添加权限 (实际页面的ui的表单里没有type 和 pid , 所以要手动赋值)
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true    // 显示弹窗
    },
    async editPermission(id) {  // 编辑权限
      this.formData = await getPermissionDetail(id) // 回显
      this.showDialog = true                        // 显示弹窗
    },
    async btnOK() {
      // 要判断是狗新增 / 编辑权限 : 判断依据是 this.formData 里是否有 id 数据
      // 在表单里 , 编辑是有 id 数据 , 新增没有 id 数据
      try {
        await this.$refs.perForm.validate()
        if (this.formData.id) {
          //编辑
          await updatePermission(this.formData)
          this.$message.success("编辑权限成功")
        } else {
          // 新增
          await addPermission(this.formData)
          this.$message.success("添加权限成功")
        }
      } catch (err) {
        console.log(err)
      }
      this.getPermissionList()  // 重新拉取数据
      this.showDialog = false   // 关掉弹窗
    },
    btnCancel() {
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0' // 开启
      }
      this.showDialog = false
      this.$refs.perForm.resetFields()
    }
  },
  created() {
    this.getPermissionList()
  }
}
</script>
