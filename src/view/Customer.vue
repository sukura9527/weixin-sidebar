<template>
    <div class="customer_page">
        <!-- 客户基本信息 -->
        <van-cell-group inset>
            <van-cell :title="props.customer.companyName" :label="props.customer.companyCode" />
            <!-- 状态按钮 -->
            <van-cell title-style="flex: none; width: 0px;">
                <template #value>
                    <van-tag v-for="(statusText, index) in STATUSOPTIONS" :key="index" plain
                        :type="index === props.customer.status ? STATUSTYPES[props.customer.status] : 'default'"
                        size="large" style="margin-right: 8px;">
                        {{ statusText }}
                    </van-tag>
                </template>
            </van-cell>
            <!-- 标签 -->
            <van-cell title-style="flex: none; width: 0px;">
                <van-tag v-for="type in TYPES" :key="type" plain
                    :type="type === props.customer.type ? 'primary' : 'default'" size="large"
                    style="margin-right: 8px;">
                    {{ type }}
                </van-tag>
            </van-cell>
        </van-cell-group>
        <!-- 额度信息 -->
        <van-cell-group inset style="border: 1px solid #eee;position: relative;">
            <van-icon name="replay" @click="handleRefresh"
                style="position: absolute; top: 10px; right: 10px; z-index: 999; color: #1989fa;" />
            <van-cell title-style="flex: none; width: 0px;">
                <table style="width: 100%;text-align: left;">
                    <tbody>
                        <tr>
                            <td>日内授信: {{ props.customer.dailyCredit }}w</td>
                            <td>长期授信: {{ props.customer.longTermCredit }}w</td>
                        </tr>
                        <tr>
                            <td>香草额度: {{ props.customer.vanillaQuota }}w</td>
                            <td>可出资金: {{ props.customer.availableFunds.toFixed(2) }} </td>
                        </tr>
                        <tr>
                            <td>雪球额度: {{ props.customer.snowballQuota }}w</td>
                            <td>T-1追保: {{ props.customer.t1MarginCall }}</td>
                        </tr>
                    </tbody>
                </table>
            </van-cell>
        </van-cell-group>
        <!-- 交易下达人 -->
        <van-cell-group inset>
            <van-cell title-style="flex: none; width: 0px;">
                <van-tag v-for="trader in props.customer.traders" :key="trader.id"
                    :plain="!trader.realName || (trader.realName && !trader.verified)"
                    :type="trader.realName ? 'success' : 'default'" size="large" style="margin-right: 8px;">
                    {{ trader.name }}
                </van-tag>
            </van-cell>
        </van-cell-group>
        <!-- 成交统计 -->
        <van-cell-group inset>
            <van-cell title="成交笔数/名本/实现盈亏/胜率:">
                <template #label>
                    <div>T-3m: {{ props.customer.tradeStats.recent.trades }} /
                        {{ props.customer.tradeStats.recent.turnover.toLocaleString() }} /
                        {{ props.customer.tradeStats.recent.profitLoss.toLocaleString() }} /
                        {{ props.customer.tradeStats.recent.winRate }}%</div>
                    <div>Total: {{ props.customer.tradeStats.total.trades }} /
                        {{ props.customer.tradeStats.total.turnover.toLocaleString() }} /
                        {{ props.customer.tradeStats.total.profitLoss.toLocaleString() }} /
                        {{ props.customer.tradeStats.total.winRate }}%</div>
                </template>
            </van-cell>
        </van-cell-group>
        <!-- 销售备注 -->
        <van-cell-group inset>
            <van-cell title="Sales Note" :value="props.customer.updatedTime" value-class="text-align-right">
            </van-cell>
            <van-cell title-style="flex: none; width: 0px;" style="border: 1px solid #eee;">
                <template #value>
                    <div v-html="props.customer.salesNote"></div>
                </template>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script setup lang="ts">
import { showToast, closeToast } from 'vant';

// 定义 props 接收父组件传递的 customer 数据
const props = defineProps<{
    customer: {
        id: string;
        status: number; // 0: 正常, 1: 暂停交易, 2: 休眠, 3: 销户
        type: string; // 标签数组
        title: string; // 客户标题
        companyName: string; // 公司名称
        companyCode: string; // 公司编号
        dailyCredit: number; // 日内授信额度
        longTermCredit: number; // 长期授信额度
        vanillaQuota: number; // 香草额度
        snowballQuota: number; // 雪球额度
        availableFunds: number; // 可出资金
        t1MarginCall: number; // T-1日追保
        traders: Array<{
            name: string; // 交易下达人姓名
            id: string; // 交易下达人ID
            realName: boolean; // 实名认证
            verified: boolean; // 信息校验一致
        }>; // 交易下达人信息
        tradeStats: {
            recent: {
                trades: number;
                turnover: number;
                profitLoss: number;
                winRate: number;
            };
            total: {
                trades: number;
                turnover: number;
                profitLoss: number;
                winRate: number;
            };
        }; // 成交统计
        salesNote: string; // 销售备注
        updatedTime: string; // 更新时间
    };
}>();

// 状态类型
const STATUSTYPES: ('success' | 'danger' | 'primary' | 'warning')[] = [
    'success',   // 正常
    'danger',    // 暂停交易
    'primary',   // 休眠
    'warning'    // 销户
];
// 状态选项文本
const STATUSOPTIONS = ['正常', '暂停交易', '休眠', '销户'];

// 类型数组
const TYPES = ['商品', '权益互换', '权益期权'];

const handleRefresh = () => {
    showToast({
        type: 'loading',
        message: `正在刷新客户数据...`,
        duration: 0,
    });
    // 模拟刷新操作，实际应用中可调用接口获取最新数据
    console.log(`刷新客户的数据`);
    // 模拟异步操作
    setTimeout(() => {
        closeToast();
    }, 1000);
};
</script>

<style lang="scss" scoped>
.customer_page {

    // 公共单元格值样式
    :deep(.van-cell__value) {
        text-align: left;
    }

    :deep(.text-align-right) {
        text-align: right;
    }
}
</style>