<!-- 产量汇总 -->
<template>
    <div class="header_main">
        <report-query-table
            ref="queryTable"
            :span-method="spanMethod"
            :query-form-setting="queryFormSetting"
            :query-form-data="queryFormData"
            :data-table-setting="dataTableSetting"
            :list-interface="listInterface"
            :get-summaries="getSummaries"
            :custom-data="true"
            :query-table-type="'report'"
            @get-data-success="setData"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, REPORTS_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';

    @Component({
        components: {
        },
        name: 'OutputSummary'
    })
    export default class OutputSummary extends Vue {

        // query header area setting
        queryFormSetting= {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
                {
                    prop: 'granularity',
                    text: '请选择月报/季报'
                },
                // {
                //     prop: 'workShop',
                //     text: '请选择生产车间'
                // },
                {
                    prop: 'year',
                    text: '请选择年度'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '产量汇总数据'
            }
        }

        // data table area setting
        dataTableSetting={
            showIt: true, // showit or not
            showSelectColumn: false,
            showIndexColumn: false,
            showOperationColumn: false,
            showPagination: false,
            //表格数据
            column: [
                {
                    prop: 'workShopName',
                    label: '生产车间',
                    minWidth: '120'
                },
                {
                    prop: 'unitName',
                    label: '单位',
                    minWidth: '120'
                },
                {
                    prop: 'yearId',
                    label: '年度',
                    minWidth: '120'
                },
                {
                    prop: 'timeName',
                    label: '月/季',
                    minWidth: '120'
                },
                {
                    prop: 'effectiveCapacity',
                    label: '有效产能',
                    minWidth: '120'
                },
                {
                    prop: 'actualCapacity',
                    label: '实际产能',
                    minWidth: '120'
                },
                {
                    prop: 'capacityRatio',
                    label: '产能利用率',
                    minWidth: '120'
                }
            ],
            tableAttributes: {
                isShowSummary: true // 合计
            },
            dataChangeByAPI: false, // table data change by API
            tableHeightSet: 405
        }

        $refs: {
            queryTable: HTMLFormElement;
        };

        // 查询表头
        queryFormData = [
            {
                type: 'radio',
                prop: 'granularity',
                radioArr: [
                    { label: '月报', val: 'MONTH' },
                    { label: '季报', val: 'QUARTER' }
                ],
                rule: [{ required: true, message: '请选择月报/季报' }]
            },
            {
                type: 'select',
                label: '生产车间',
                labelWidth: '120',
                prop: 'workShop',
                defaultValue: '',
                clearable: true,
                rule: [{ required: false, message: '请选择生产车间', trigger: 'blur' }],
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '包装'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'date-picker',
                label: '年度',
                prop: 'year',
                dataType: 'year',
                defaultValue: '',
                labelWidth: '100',
                rule: [{ required: true, message: '请选择年度', trigger: 'blur' }],
                valueFormat: 'yyyy'
            }
        ];

        // 查询请求
        listInterface(params) {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_OUTPUT_SUMMARY_QUERY_API(params);
        }

        exportOption= {
            exportInterface: '',
            auth: '',
            text: '产量汇总 报表'
        }

        setData(data) {
            if (!data.data.length) {
                this.$infoToast('暂无任何内容');
            }
        }

        spanMethod({ row, /* column, rowIndex, */ columnIndex }) {
            if (row.isSum) {
                if (columnIndex === 0) {
                    return {
                        rowspan: 1,
                        colspan: 4
                    }
                } else if (columnIndex < 4) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
        }

        /**
         * @description: data 表单 合计
         * @param1 {*}
         * @param2 {*}
         * @param3 {*}
         * @return {*}
         * @example: 示例代码
         * @param {*} getSummaries
         */
        getSummaries = param => {
            const { columns, data } = param;
            const sums: string[] = []
            const target = data[0]
            console.log(param)
            if (target) {
                columns.forEach((column, index) => {
                    if (Object.prototype.hasOwnProperty.call(target.totalData, column.property)) {
                        sums[index] = target.totalData[column.property]
                    } else {
                        sums[index] = ''
                    }
                });
                sums[0] = '合计';
                sums[1] = ''
                sums[2] = ''
                sums[3] = ''
            }
            return sums
        };
    }
</script>
