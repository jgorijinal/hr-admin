<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form ref="formRef" label-width="120px"  :model="userInfo" :rules="rules" style="margin-top:30px;margin-left: 300px;">
              <el-form-item label="姓名" prop="username">
                <el-input style="width:300px" v-model="userInfo.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input type="password" style="width:300px" v-model="userInfo.password2"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
                <el-button @click="$router.back()">取消</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- :is="" 必须是变量-->
            <component :is="userComponent"></component>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="jobComponent"></component>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from"@/api/user"
import { saveUserDetailById } from "@/api/employees"
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  components: {
    UserInfo: UserInfo,
    JobInfo:JobInfo
  },
  data() {
    return {
      userComponent: 'UserInfo',
      jobComponent: 'JobInfo',
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getUserDetailById() { // 获取用户详情
      this.userInfo = await getUserDetailById(this.userId)
    },
    saveUser() {  // 更新用户名/密码接口
      this.$refs.formRef.validate().then( async () => {
        // 表单校验通过
        // 调修改接口
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        // 提示成功
        this.$message.success("操作成功")
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    this.getUserDetailById()
  }
};
</script>

<style></style>
