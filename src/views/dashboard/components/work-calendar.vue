<template>
  <div>
    <!--选择 年 / 月-->
    <el-row type="flex" justify="end">
      <!--年份-->
      <el-select size="small" style="width: 120px" v-model="currentYear" @change="dateChange">
        <el-option v-for="item in yearList" :key="item" :value="item" :label="`${item} 年`"
        ></el-option>
      </el-select>
      <!--月份-->
      <el-select size="small" style="width: 120px; margin-left: 10px" v-model="currentMonth" @change="dateChange">
        <el-option
          v-for="item in 12" :key="item" :value="item" :label="`${item} 月`"></el-option>
      </el-select>
    </el-row>
    <!--日历组件-->
    <el-calendar v-model="currentDate">
      <!--插槽-->
      <template v-slot:dateCell="{ date , data}">
        <div class="date-content">
          <span class="text"> {{ getDay(data.day)}}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentMonth: null, // 当前月份
      yearList: [], // 年份列表
      currentYear: null, // 当前月份
      currentDate: null,  // v-model 绑定到 el-calendar
    };
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  created() {
    // 初始化
    this.currentMonth = this.startDate.getMonth() + 1;
    this.currentYear = this.startDate.getFullYear();
    this.yearList = Array.from(Array(11), (value, index) => index + 2022 - 5);

    this.dateChange()  // 这里调一次
  },
  methods: {
    dateChange() {
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`) // 以当前月的1号为起始
    },
    getDay(day) {  // 处理 模板里的日期 比如 2022-02-22  ->  22
      const result = day.split('-')[2]
      return result.startsWith('0') ? result.substr(1) : result
    },
    isWeek(date) {  // 判断是否 周六周日 , 返回 true / false
      return date.getDay()=== 0 || date.getDay()=== 6
    }
  }
};
</script>

<style scoped>
/deep/ .el-calendar-day {
  height: auto;
}
/deep/ .el-calendar-table__row td,
/deep/ .el-calendar-table tr td:first-child,
/deep/ .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
/deep/ .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
/deep/ .el-calendar__header {
  display: none;
}
</style>
