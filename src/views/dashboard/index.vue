<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <upload-excel />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PageTools from "@/components/PageTools/index.vue";

export default {
  name: "Dashboard",
  components: {
    PageTools,
  },
  computed: {
    ...mapGetters(["name"]),
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
