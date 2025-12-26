<template>
    <div class="sales_container">
        <van-cell-group inset>
            <van-collapse v-model="activeNames" :border="false">
                <van-collapse-item name="features">
                    <template #title>
                        <div class="collapse_title">功能设置</div>
                    </template>
                    <van-cell v-for="item in featureItems" :key="item.key" :title="item.title" :label="item.description"
                        center :border="false">
                        <template #right-icon>
                            <van-switch v-model="item.enabled" size="16" active-color="#1989fa" />
                        </template>
                    </van-cell>
                </van-collapse-item>
            </van-collapse>
            <van-cell v-for="item in localCustomers" :key="item.id" center :border="false">
                <template #title>
                    <!-- 失焦保存 -->
                    <van-field v-model="item.title" placeholder="请输入" @blur="saveCustomerTitle(item)" />
                </template>
                <template #label>
                    <van-field v-model="item.companyCode" placeholder="请输入" @blur="saveCustomerCode(item)" />
                </template>
                <template #right-icon>
                    <van-switch v-model="item.isshow" size="16" active-color="#1989fa"
                        @change="saveCustomerShow(item)" />
                    <van-icon name="minus" color="#F5222D" size="16" style="margin-left: 32px;"
                        @click="deleteCustomer(item)" />
                </template>
            </van-cell>
            <van-icon name="plus" color="#34C759" size="16" style="margin-top: 16px;" @click="addCustomer" />
            <div class="button_group">
                <van-button size="small" type="default" @click="resetSettings">重置</van-button>
                <van-button size="small" type="primary" @click="saveSettings">确定</van-button>
            </div>
        </van-cell-group>
        <van-cell-group inset style="margin-top: 20px;">
            <!-- 客户选择 -->
            <van-cell title="当前客户" :value="currentCostomer.title || '未选择客户'" is-link @click="showCustomerPicker = true"
                style=" font-weight: bold;" />
            <!-- 客户选择弹窗 只显示可见客户 -->
            <van-popup v-model:show="showCustomerPicker" position="bottom">
                <van-picker :columns="localCustomers.filter(c => c.isshow)"
                    :columns-field-names="{ text: 'title', value: 'id' }" @confirm="onCustomerConfirm"
                    @cancel="showCustomerPicker = false" />
            </van-popup>
            <!-- 销售备注 -->
            <van-cell title="Sales Note" :value="currentCostomer.updatedTime">
            </van-cell>
            <div class="editor_container">
                <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" />
                <Editor v-model="currentCostomer.salesNote" :defaultConfig="editorConfig" @onCreated="handleCreated" />
            </div>
            <div class="button_group">
                <van-button size="normal" type="success" @click="saveOnly">仅保存</van-button>
                <van-button size="normal" type="primary" @click="saveAndUpdate">保存并更新至看板</van-button>
            </div>
            <!-- 编辑记录 -->
            <van-collapse v-model="activeRecords" :border="false">
                <van-collapse-item name="records">
                    <template #title>
                        <div class="collapse-title">编辑记录</div>
                    </template>
                    <van-cell v-for="item in currentCostomer.editRecords" :key="item.id" :title="item.time"
                        :value="`(${item.operator})`" :label="item.text">
                    </van-cell>
                </van-collapse-item>
            </van-collapse>
        </van-cell-group>
    </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { showToast, showConfirmDialog } from 'vant';
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 定义 props，接收外部传入的 customers 数据
const props = defineProps<{
    customers: any[];
}>();

// 定义 emit，用于向父组件传递数据变化
const emit = defineEmits<{
    (e: 'update:customers', customers: any[]): void;
}>();

// 控制折叠面板展开状态
const activeNames = ref<string[]>([]);
const activeRecords = ref<string[]>([]);

// 功能项数据
const featureItems = ref<any[]>([
    {
        key: 'autoReply',
        title: '自动回复',
        description: '开启后系统将自动回复客户消息',
        enabled: true
    },
    {
        key: 'expireReminder',
        title: '到期提醒',
        description: '在服务到期前发送提醒通知',
        enabled: false
    },
    {
        key: 'futureSend',
        title: '远期发送',
        description: '支持定时发送消息功能',
        enabled: true
    },
    {
        key: 'manualPush',
        title: '人工推送',
        description: '允许销售人员手动推送消息',
        enabled: false
    },
    {
        key: 'expireNotice',
        title: '到期通知',
        description: '服务到期后发送通知消息',
        enabled: true
    }
]);

// 使用计算属性创建可修改的 customers 副本
const localCustomers = ref<any[]>([]);
// 当前选择的客户
const currentCostomer = ref<any | null>(null);
// 初始化当前客户
if (localCustomers.value.length > 0) {
    currentCostomer.value = localCustomers.value[0];
}
const showCustomerPicker = ref(false);
// 监听 props.customers 的变化，同步更新本地副本
watch(
    () => props.customers,
    (newCustomers) => {
        localCustomers.value = JSON.parse(JSON.stringify(newCustomers)); // 深拷贝避免引用问题
        // 更新当前客户引用
        if (localCustomers.value.length > 0 && !currentCostomer.value) {
            currentCostomer.value = localCustomers.value[0];
        }
    },
    { immediate: true, deep: true }
);
// 保存客户标题更改
const saveCustomerTitle = (item: any) => {
    const customer = localCustomers.value.find(c => c.id === item.id);
    if (customer) {
        customer.title = item.title;
        // 通知父组件数据变更
        emit('update:customers', localCustomers.value);
        showToast({
            type: 'success',
            message: '客户标题已保存',
        });
    }
};
const saveCustomerCode = (item: any) => {
    const customer = localCustomers.value.find(c => c.id === item.id);
    if (customer) {
        customer.companyCode = item.companyCode;
        // 通知父组件数据变更
        emit('update:customers', localCustomers.value);
        showToast({
            type: 'success',
            message: '公司编号已保存',
        });
    }
};
const saveCustomerShow = (item: any) => {
    const customer = localCustomers.value.find(c => c.id === item.id);
    if (customer) {
        customer.isshow = item.isshow;
        // 通知父组件数据变更
        emit('update:customers', localCustomers.value);
        showToast({
            type: 'success',
            message: '客户可见性已保存',
        });
    }
};
// 新增客户
const addCustomer = () => {
    const newId = Date.now() + Math.floor(Math.random() * 1000);
    const newCustomer: any = {
        id: newId,
        title: '新客户',
        companyCode: 'CWX' + String(newId).padStart(10, '0'),
        isshow: true,
        updatedTime: new Date().toLocaleDateString('zh-CN').replace(/\//g, '/'),
        salesNote: '<p>请保持联系，欢迎下次光临！</p>',
        editRecords: []
    };
    localCustomers.value.push(newCustomer);
    currentCostomer.value = newCustomer;
    // 通知父组件数据变更
    emit('update:customers', localCustomers.value);
};
// 删除当前客户
const deleteCustomer = (item: any) => {
    if (localCustomers.value.length <= 1) {
        showToast({
            type: 'fail',
            message: '至少保留一个客户',
        });
        return;
    }
    showConfirmDialog({
        title: '确认删除',
        message: `确定要删除客户 "${item.title}" 吗？`,
        showCancelButton: true,
    }).then(() => {
        const currentIndex = localCustomers.value.findIndex(c => c.id === item.id);
        if (currentIndex !== -1) {
            localCustomers.value.splice(currentIndex, 1);

            // 如果删除的是当前客户，切换到下一个客户或者上一个客户
            if (currentCostomer.value?.id === item.id) {
                if (localCustomers.value.length > currentIndex) {
                    // 优先选择下一个客户
                    currentCostomer.value = localCustomers.value[currentIndex];
                } else if (localCustomers.value.length > 0) {
                    // 如果没有下一个客户，选择最后一个客户
                    currentCostomer.value = localCustomers.value[localCustomers.value.length - 1];
                } else {
                    // 没有剩余客户
                    currentCostomer.value = null;
                }
            }

            emit('update:customers', localCustomers.value);
            showToast({ type: 'success', message: '删除成功' });
        }
    }).catch(() => {
        // 用户取消删除
    });
};
// 客户选择确认
const onCustomerConfirm = ({ selectedValues }: { selectedValues: (number | string)[] }) => {
    const selectedId = selectedValues[0];
    // 只查找可见客户
    const selectedCustomer = localCustomers.value
        .filter(c => c.isshow)
        .find(c => c.id === selectedId);

    if (selectedCustomer) {
        currentCostomer.value = selectedCustomer;
    } else {
        showToast({
            type: 'fail',
            message: '选择的客户不可用'
        });
    }
    showCustomerPicker.value = false;
};

// 保存初始状态用于重置
const initialFeatureItems = JSON.parse(JSON.stringify(featureItems.value));

// 重置功能
const resetSettings = () => {
    featureItems.value = JSON.parse(JSON.stringify(initialFeatureItems));
    showToast({
        type: 'success',
        message: '设置已重置',
    });
};

// 保存功能
const saveSettings = () => {
    showToast({
        type: 'success',
        message: '设置已保存',
    });
};

// 统一的保存方法
const saveCustomerData = (updateToBoard = false) => {
    if (!currentCostomer.value) return;

    const now = new Date();
    const timeString = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;
    const operator = '当前用户'; // 应从全局状态获取

    // 添加编辑记录
    currentCostomer.value.editRecords.unshift({
        id: Date.now(), // 使用时间戳作为唯一ID更可靠
        operator: operator,
        time: timeString,
        text: currentCostomer.value.salesNote
    });

    // 限制编辑记录数量
    if (currentCostomer.value.editRecords.length > 10) {
        currentCostomer.value.editRecords = currentCostomer.value.editRecords.slice(0, 10);
    }

    // 更新时间
    currentCostomer.value.updatedTime = timeString;

    // 如果需要更新到看板，则通知父组件
    if (updateToBoard) {
        emit('update:customers', [...localCustomers.value]);
        showToast({
            type: 'success',
            message: '备注已保存并更新至看板',
        });
    } else {
        showToast({
            type: 'success',
            message: '备注已保存',
        });
    }
};

// 仅保存
const saveOnly = () => saveCustomerData(false);
// 保存并更新
const saveAndUpdate = () => saveCustomerData(true);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 工具栏配置
const toolbarConfig = {
    toolbarKeys: [
        'headerSelect',
        'lineHeight',
        'fontSize',
        'bold',
        'underline',
        'color',
        'bgColor',
        'undo',
        'redo'
    ]
};

// 编辑器配置
const editorConfig = {
    placeholder: '请输入内容...',
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

const handleCreated = (editor: any) => {
    editorRef.value = editor;
};
</script>

<style scoped lang="scss">
.sales_container {
    padding: 8px 0;

    :deep(.van-cell-group) {
        .van-cell {
            padding: 0;

            .van-cell__label {
                margin-top: 0;
            }
        }

        .van-collapse {
            margin-bottom: 16px;

            .collapse_title {
                font-weight: bold;
                font-size: 16px;
            }

            .van-collapse-item__content {
                padding: 0 8px;
            }
        }
    }

    .button_group {
        display: flex;
        justify-content: flex-end;
        margin: 8px 0;

        .van-button {
            margin: 0 8px;
            height: 32px;
        }
    }

    .editor_container {
        height: 340px;
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        overflow: hidden;

        :deep(.w-e-toolbar) {
            border-bottom: 1px solid #e5e5e5;

            .w-e-bar-item {
                padding: 0;
            }
        }

        :deep(.w-e-text-container) {
            height: calc(100% - 40px);

            p {
                margin: 0;
            }
        }
    }
}
</style>