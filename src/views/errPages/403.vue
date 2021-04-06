<template>
  <a-result status="403" title="403" sub-title="对不起，你没有访问页面的权限">
    <template #extra>
      <a href="/sendStatistical">
        返回首页
      </a>
    </template>
  </a-result>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>