<!-- src/App.vue (无路由版本) -->
<template>
  <div class="container">
    <div v-if="loading" class="loading_container">
      <van-loading size="24px" vertical>加载中...</van-loading>
    </div>
    <!-- 数据加载完成后再渲染标签 -->
    <van-tabs v-else v-model:active="activeTab">
      <van-tab v-for="customer in showCustomers" :key="customer.id" :title="customer.title" :name="customer.id">
        <Customer :customer />
      </van-tab>
      <van-tab title="Sales" name="Sales">
        <Sales :customers @update:customers="handleCustomersUpdate" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { showToast, closeToast } from 'vant';
import { fetchCustomers } from '@/utils/mockData';
import Customer from '@/view/Customer.vue';
import Sales from '@/view/Sales.vue';

const activeTab = ref('');
const customers = ref<any[]>([]);
const showCustomers = computed(() => customers.value.filter(c => c.isshow === true));
const loading = ref(true);

const handleCustomersUpdate = (updatedCustomers: any[]) => {
  loading.value = true;
  // 处理客户数据更新
  customers.value = updatedCustomers;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};
onMounted(async () => {
  try {
    loading.value = true;
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

  .loading_container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>