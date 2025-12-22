export const mockCustomers = [
    {
        id: 'CWX0000000056',
        status: 0,
        type: '商品',
        title: '测试客户A',
        companyName: 'XXXXXXXXXX有限公司',
        companyCode: 'CWX0000000056',
        dailyCredit: 200,
        longTermCredit: 250,
        vanillaQuota: 200,
        snowballQuota: 200,
        availableFunds: 156872.56,
        t1MarginCall: 0,
        traders: [
            { name: '交易下达人-张三', id: '1', realName: true, verified: true },
            { name: '张三', id: '2', realName: true, verified: false },
            { name: '张三', id: '3', realName: false, verified: false }
        ],
        tradeStats: {
            recent: {
                trades: 16,
                turnover: 25686320,
                profitLoss: 896321,
                winRate: 68.5
            },
            total: {
                trades: 156,
                turnover: 356253254,
                profitLoss: 4523698,
                winRate: 62.3
            }
        },
        salesNote: '#关联主体:\nXXXXXX\nYYYYyy\n#跨境费率:\nLME铜 8bp',
        updatedTime: '2025/11/11',
        isshow: true,
        editRecords: [
            { id: 1, operator: '张三', time: '2023/06/25', text: "备注内容1" },
            { id: 2, operator: '李四', time: '2023/06/28', text: "备注内容2" },
            { id: 3, operator: '王五', time: '2023/06/30', text: "备注内容3" }
        ]
    },
    {
        id: 'CWX0000000057',
        status: 1,
        type: '权益期权',
        title: '测试客户B',
        companyName: 'YYYYYYYYYY有限公司',
        companyCode: 'CWX0000000057',
        dailyCredit: 150,
        longTermCredit: 200,
        vanillaQuota: 150,
        snowballQuota: 150,
        availableFunds: 89432.10,
        t1MarginCall: 5000,
        traders: [
            { name: '李四', id: '3', realName: true, verified: true },
            { name: '王五', id: '4', realName: true, verified: false }
        ],
        tradeStats: {
            recent: {
                trades: 12,
                turnover: 18563210,
                profitLoss: 654321,
                winRate: 65.2
            },
            total: {
                trades: 120,
                turnover: 289456321,
                profitLoss: 3214567,
                winRate: 60.1
            }
        },
        salesNote: '#关联主体:\nZZZZZZZZZZ\nWWWWWWWW\n#跨境费率:\nLME铝 10bp',
        updatedTime: '2025/11/10',
        isshow: false,
        editRecords: [
            { id: 1, operator: '赵六', time: '2023/07/01', text: "备注内容A" },
            { id: 2, operator: '钱七', time: '2023/07/03', text: "备注内容B" }
        ]
    },
    {
        id: 'CWX0000000058',
        status: 2,
        type: '权益互换',
        title: '测试客户C',
        companyName: 'ZZZZZZZZZZ有限公司',
        companyCode: 'CWX0000000058',
        dailyCredit: 100,
        longTermCredit: 150,
        vanillaQuota: 100,
        snowballQuota: 100,
        availableFunds: 45678.90,
        t1MarginCall: 0,
        traders: [
            { name: '赵六', id: '5', realName: false, verified: true },
            { name: '钱七', id: '6', realName: true, verified: true }
        ],
        tradeStats: {
            recent: {
                trades: 8,
                turnover: 12345678,
                profitLoss: 345678,
                winRate: 62.5
            },
            total: {
                trades: 80,
                turnover: 156789012,
                profitLoss: 2345678,
                winRate: 58.7
            }
        },
        salesNote: '#关联主体:\nAAAAAAA\nBBBBBBB\n#跨境费率:\nLME铜 9bp',
        updatedTime: '2025/11/09',
        isshow: false,
        editRecords: [
            { id: 1, operator: '赵六', time: '2023/07/01', text: "备注内容A" },
            { id: 2, operator: '钱七', time: '2023/07/03', text: "备注内容B" }
        ],
    }
];

// 模拟 API 请求
export const fetchCustomers = (): Promise<any[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockCustomers);
        }, 500); // 模拟网络延迟
    });
};