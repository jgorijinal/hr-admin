<template>
  <!--新增部门 弹窗-->
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    destroy-on-close
    @close="btnCancel"
  >
    <!--表单数据-->
    <el-form label-width="120px" :rules="rules" :model="formData" ref="formRef">
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
        <el-select
          style="width: 80%"
          placeholder="请选择"
          v-model="formData.manager"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="p in people"
            :key="p.id"
            :value="p.username"
            :label="p.username"
          >
          </el-option>
        </el-select>
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
    <!-- el-dialog有专门放置底部操作栏的 插槽 具名插槽 -->
    <!--确定, 取消按钮-->
    <template slot="footer">
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button @click="btnCancel">取消</el-button>
          <el-button type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartment,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments";
import { getEmployeeSimple } from "@/api/employees";

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      required: true,
    },
  },
  data() {
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async (rules, value, callback) => {
      const result = await getDepartments();
      const { depts } = result;
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      let isRepeat;
      if (this.formData.id) {
        // 编辑场景
        // 条件: 统计部门下 名字 不能重复与其他的部门(要排除自己)
        isRepeat = depts
          .filter(
            (item) =>
              item.pid === this.formData.pid && item.id !== this.formData.id
          )
          .some((item) => item.name === value);
      } else {
        // 新增场景
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value);
      }
      isRepeat
        ? callback(new Error(`同级部门下已经存在${value}的部门了`))
        : callback();
    };
    // 检查编码重复
    const checkCodeRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments();
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      let isRepeat
      if (this.formData.id) {
        // 编辑
        //= 因为编辑模式下 不能算自己
        isRepeat = depts.filter(item => item.id !== this.formData.id ).some(item=> (item.code === value) && value)
      } else {
        // 新增
        isRepeat = depts.some((item) => item.code === value && value); // 这里加一个 value不为空 因为我们的部门有可能没有code
      }

      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback();
    };
    return {
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      rules: {
        name: [
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          { validator: checkNameRepeat, trigger: "blur" },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          { validator: checkCodeRepeat, trigger: "blur" },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            trigger: "blur",
            min: 1,
            max: 300,
            message: "部门介绍要求1-50个字符",
          },
        ],
      },
      people: [],
    };
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增子部门";
    },
  },
  methods: {
    async getEmployeeSimple() {
      const result = await getEmployeeSimple();
      this.people = result;
    },
    btnOK() {
      this.$refs.formRef.validate(async (isOK) => {
        if (isOK) {
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData);
          } else {
            // 新增
            await addDepartment({ ...this.formData, pid: this.treeNode.id });
          }
          // 通知父组件, 更新数据
          this.$emit("addDept");
          // 关闭弹窗 , 用了 .sync 修饰符
          this.$emit("update:showDialog", false);
        }
      });
    },
    btnCancel() {
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      this.$emit("update:showDialog", false); // 关闭弹窗
      this.$refs.formRef.resetFields(); // 重置校验字段
      // 清除之前的校验  可以重置数据 只能重置 定义在data中的数据
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id);
    },
  },
};
</script>

<style></style>
