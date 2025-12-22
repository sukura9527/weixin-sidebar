<template>
    <div class="sales_container">
        <van-cell-group inset>
            <van-collapse v-model="activeNames" :border="false">
                <van-collapse-item name="features">
                    <template #title>
                        <div class="collapse-title">功能设置</div>
                    </template>
                    <van-cell v-for="item in featureItems" :key="item.key" :title="item.title" :label="item.description"
                        center :border="false">
                        <template #right-icon>
                            <van-switch v-model="item.enabled" size="16" active-color="#1989fa" />
                        </template>
                    </van-cell>
                    <div class="button_group">
                        <van-button size="small" type="default" @click="resetSettings">重置</van-button>
                        <van-button size="small" type="primary" @click="saveSettings">确定</van-button>
                    </div>
                </van-collapse-item>
            </van-collapse>
        </van-cell-group>
        <van-cell-group inset>
            <van-cell v-for="item in customers" :key="item.id" :title="item.title" :label="item.companyCode" center
                :border="false">
                <template #title>
                    <van-field v-model="item.title" placeholder="请输入" :disabled="item.isedit" />
                </template>
                <template #right-icon>
                    <van-switch v-model="item.isedit" size="16" active-color="#1989fa" />
                    <van-icon name="minus" color="#F5222D" size="16" style="margin-left: 32px;"
                        @click="deleteCustomer(item)" />
                </template>
            </van-cell>
            <van-icon name="plus" color="#34C759" size="16" style="margin-top: 16px;" @click="addCustomer" />
        </van-cell-group>
        <van-cell-group inset style="margin-top: 20px;">
            <!-- 客户选择 -->
            <van-cell title="当前客户" :value="currentCostomer.title" is-link @click="showCustomerPicker = true"
                style="font-size:14px; font-weight: bold;" />
            <!-- 客户选择弹窗 -->
            <van-popup v-model:show="showCustomerPicker" position="bottom">
                <van-picker :columns="customers" :columns-field-names="{ text: 'title', value: 'id' }"
                    @confirm="onCustomerConfirm" @cancel="showCustomerPicker = false" />
            </van-popup>
            <!-- 销售备注 -->
            <van-cell title="Sales Note" :value="currentCostomer.updatedTime">
            </van-cell>
            <div class="editor_container">
                <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" />
                <Editor v-model="currentCostomer.salesNote" :defaultConfig="editorConfig" @onCreated="handleCreated" />
            </div>
            <div class="button_group">
                <van-button size="small" type="success" @click="saveOnly">仅保存</van-button>
                <van-button size="small" type="primary" @click="saveAndUpdate">保存并更新至看板</van-button>
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
import { onBeforeUnmount, reactive, ref, shallowRef } from 'vue'
import { showToast, closeToast } from 'vant';
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 控制折叠面板展开状态
const activeNames = ref([]);
const activeRecords = ref([]);
// 功能项数据
const featureItems = ref([
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
// 新增客户
const addCustomer = () => {
    const newId = Math.max(...customers.map(c => c.id)) + 1;
    const newCustomer = {
        id: newId,
        title: '新客户',
        companyCode: 'CWX' + String(newId).padStart(10, '0'),
        isedit: true,
        updatedTime: new Date().toLocaleDateString('zh-CN').replace(/\//g, '/'),
        salesNote: '<p>请保持联系，欢迎下次光临！</p>',
        editRecords: []
    };
    customers.push(newCustomer);
    currentCostomer.value = newCustomer;
};
// 删除当前客户
const deleteCustomer = (item: any) => {
    if (customers.length <= 1) {
        return;
    }
    const currentIndex = customers.findIndex(c => c.id === currentCostomer.value.id);
    if (currentIndex !== -1) {
        customers.splice(currentIndex, 1);
        // 设置新的当前客户为第一个客户
        currentCostomer.value = customers[0];
    }
};
// 客户列表数据
const customers = reactive([
    {
        id: 1,
        title: '测试客户A',
        companyCode: 'CWX0000000058',
        isedit: true,
        updatedTime: '2023/07/01',
        salesNote: '<p>测试客户A请保持联系，欢迎下次光临！</p>',
        editRecords: [
            { id: 1, operator: '张三', time: '2023/06/25', text: "备注内容1" },
            { id: 2, operator: '李四', time: '2023/06/28', text: "备注内容2" },
            { id: 3, operator: '王五', time: '2023/06/30', text: "备注内容3" }
        ]
    },
    {
        id: 2,
        title: '测试客户B',
        companyCode: 'CWX0000000123',
        isedit: true,
        updatedTime: '2023/07/02',
        salesNote: '<p>测试客户B请保持联系，欢迎下次光临！</p>',
        editRecords: [
            { id: 1, operator: '张三', time: '2023/06/25', text: "备注内容1" },
            { id: 2, operator: '李四', time: '2023/06/28', text: "备注内容2" },
            { id: 3, operator: '王五', time: '2023/06/30', text: "备注内容3" }
        ]
    },
    {
        id: 3,
        title: '测试客户C',
        companyCode: 'CWX0000000456',
        isedit: false,
        updatedTime: '2023/07/03',
        salesNote: '<p>测试客户C请保持联系，欢迎下次光临！</p>',
        editRecords: [
            { id: 1, operator: '张三', time: '2023/07/01', text: "备注内容1" },
            { id: 2, operator: '李四', time: '2023/07/02', text: "备注内容2" },
            { id: 3, operator: '王五', time: '2023/07/03', text: "备注内容3" }
        ]
    }
]);
// 当前选择的客户
const currentCostomer = ref(customers[0]);
const showCustomerPicker = ref(false);
// 客户选择确认
const onCustomerConfirm = ({ selectedValues }) => {
    const selectedId = selectedValues[0];
    const selectedCustomer = customers.find(c => c.id === selectedId);
    if (selectedCustomer) {
        currentCostomer.value = selectedCustomer;
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
// 仅保存
const saveOnly = () => {
    showToast({
        type: 'success',
        message: '备注已保存',
    });
};
// 保存并更新至看板
const saveAndUpdate = () => {
    showToast({
        type: 'success',
        message: '备注已保存并更新至看板',
    });
};

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 工具栏配置 - 只保留颜色、加粗和下划线功能
const toolbarConfig = {
    toolbarKeys: [
        'bold',
        'underline',
        '|',
        'color',
        'bgColor',
        '|',
        'undo',
        'redo'
    ]
}

// 编辑器配置
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor
}
</script>

<style scoped lang="scss">
.sales_container {
    padding: 8px 0;

    :deep(.van-cell-group) {
        .van-cell {
            padding: 0;
            font-size: 12px;

            .van-cell__label {
                margin-top: 0;
            }
        }

        .van-collapse {
            margin-bottom: 16px;

            .collapse-title {
                font-weight: bold;
                font-size: 14px;
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
        height: 200px;
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        overflow: hidden;

        :deep(.w-e-toolbar) {
            border-bottom: 1px solid #e5e5e5;
        }

        :deep(.w-e-text-container) {
            height: calc(100% - 40px);
        }
    }
}
</style>