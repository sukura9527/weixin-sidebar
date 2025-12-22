<!-- src/App.vue (无路由版本) -->
<template>
  <div class="container">
    <div v-if="loading" class="loading-container">
      <van-loading size="24px" vertical>加载中...</van-loading>
    </div>
    <!-- 数据加载完成后再渲染标签 -->
    <van-tabs v-else v-model:active="activeTab">
      <van-tab v-for="customer in customers" :key="customer.id" :title="customer.title" :name="customer.id">
        <Customer :customer="customer" />
      </van-tab>
      <van-tab title="Sales" name="Sales">
        <Sales />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { showToast, closeToast } from 'vant';
import { fetchCustomers } from '@/utils/mockData';
import Customer from '@/view/Customer.vue';
import Sales from '@/view/Sales.vue';

const activeTab = ref('');
const customers = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    showToast({
      type: 'loading',
      message: '加载客户数据中...',
      duration: 0,
    });
    customers.value = await fetchCustomers();
    activeTab.value = customers?.value[0].id;
  } catch (error) {
    showToast({
      type: 'fail',
      message: '加载客户数据失败，请重试。',
    });
  } finally {
    loading.value = false;
    closeToast();
  }
});
</script>
<style lang="scss">
.container {
  width: $sidebar-width;
  height: 100vh;
  padding: 0 8px;
  box-sizing: border-box;
}
</style>