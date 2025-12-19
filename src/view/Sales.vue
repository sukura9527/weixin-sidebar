<template>
    <div class="sales_container">
        <van-cell-group inset>
            <van-cell v-for="item in featureItems" :key="item.key" :title="item.title" :label="item.description" center>
                <template #right-icon>
                    <van-switch v-model="item.enabled" size="16" active-color="#1989fa" />
                </template>
            </van-cell>
            <div class="button_group">
                <van-button size="small" type="default" @click="resetSettings">重置</van-button>
                <van-button size="small" type="primary" @click="saveSettings">确定</van-button>
            </div>
        </van-cell-group>
        <van-cell-group inset>
            <van-cell v-for="item in customers" :key="item.id" :title="item.title" :label="item.companyCode" center>
                <template #title>
                    <van-field v-model="item.title" placeholder="请输入" :disabled="item.isedit" />
                </template>
                <template #right-icon>
                    <van-switch v-model="item.isedit" size="16" active-color="#1989fa" />
                </template>
            </van-cell>
        </van-cell-group>
        <!-- 销售备注 -->
        <van-cell-group inset style="margin-top: 20px;">
            <van-cell title="Sales Note" :value="note.updatedTime">
            </van-cell>
            <div class="editor_container">
                <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" />
                <Editor v-model="note.salesNote" :defaultConfig="editorConfig" @onCreated="handleCreated" />
            </div>
            <div class="button_group">
                <van-button size="small" type="success" @click="saveOnly">仅保存</van-button>
                <van-button size="small" type="primary" @click="saveAndUpdate">保存并更新至看板</van-button>
            </div>
        </van-cell-group>
        <!-- 编辑记录 -->
        <van-cell-group inset style="margin-top: 20px;">
            <van-cell v-for="item in note.editRecords" :key="item.id" :title="item.time" :value="`(${item.operator})`"
                :label="item.text">
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, reactive } from 'vue'
import {
    CellGroup as VanCellGroup,
    Cell as VanCell,
    Switch as VanSwitch,
    Button as VanButton
} from 'vant';
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

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
// 客户列表数据
const customers = ref([
    {
        id: 1,
        title: '张三',
        companyCode: 'CWX0000000058',
        isedit: true
    },
    {
        id: 2,
        title: '李四',
        companyCode: 'CWX0000000123',
        isedit: true
    },
    {
        id: 3,
        title: '王五',
        companyCode: 'CWX0000000456',
        isedit: false
    }
]);
// 销售备注数据
const note = reactive({
    updatedTime: '2023/07/01',
    salesNote: '<p>请保持联系，欢迎下次光临！</p>',
    editRecords: [
        { id: 1, operator: '张三', time: '2023/06/25', text: "备注内容1" },
        { id: 2, operator: '李四', time: '2023/06/28', text: "备注内容2" },
        { id: 3, operator: '王五', time: '2023/06/30', text: "备注内容3" }
    ]
});

// 保存初始状态用于重置
const initialFeatureItems = JSON.parse(JSON.stringify(featureItems.value));

// 重置功能
const resetSettings = () => {
    featureItems.value = JSON.parse(JSON.stringify(initialFeatureItems));
};
// 保存功能
const saveSettings = () => {
    console.log('保存设置:', featureItems.value);
};
// 仅保存
const saveOnly = () => {
    console.log('仅保存设置:', featureItems.value);
    console.log('销售备注内容:', note.salesNote);
};

// 保存并更新至看板
const saveAndUpdate = () => {
    console.log('保存设置:', featureItems.value);
    console.log('销售备注内容:', note.salesNote);
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

    :deep(.van-cell) {
        padding: 0;
        font-size: 12px;

        .van-cell__label {
            margin-top: 0;
        }
    }

    .button_group {
        display: flex;
        justify-content: flex-end;
        margin: 16px 0;

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