<template>
    <div class="header_main">
        <report-query-table
            ref="queryTable"
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
        name: 'SemiFinishedProductsDetailsReport'
    })
    export default class SemiFinishedProductsDetailsReport extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        // query header area setting
        queryFormSetting= {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
                {
                    prop: 'workShop',
                    text: '请输入生产车间'
                },
                            {
                    prop: 'startDate',
                    text: '请输入生产时间'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '半成品使用明细报表'
            }
        }

        // 查询表头
        queryFormData = [
            {
                type: 'select',
                hide: false, // hide column
                label: '生产车间',
                prop: 'workShop',
                // defaultValue: '',
                labelWidth: '90', // default 70px
                width: '150',
                clearable: true,
                marked: true, // mark it
                disabled: false,
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
                },
                linkageProp: ['productLine', 'materialCode']
            },
            {
                type: 'select',
                hide: false, // hide column
                label: '生产产线',
                prop: 'productLine',
                defaultValue: '',
                labelWidth: '80',
                width: '200',
                clearable: true,
                marked: false, // mark it
                disabled: false,
                optionsFn: val => {
                    return COMMON_API.ORG_QUERY_CHILDREN_API({
                        parentId: val || '',
                        deptType: 'PRODUCT_LINE'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                },
                linkageProp: ['bottleLine']
            },
            {
                type: 'input',
                hide: false, // hide column
                label: '生产订单',
                prop: 'orderNo',
                defaultValue: '',
                labelWidth: '80',
                width: '160',
                clearable: true,
                marked: false, // mark it
                disabled: false
            },
            {
                type: 'select',
                hide: false, // hide column
                label: '生产物料',
                prop: 'materialCode',
                defaultValue: '',
                labelWidth: '80',
                width: '160',
                clearable: true,
                marked: false, // mark it
                disabled: false,
                optionsFn: val => {
                    return REPORTS_API.REPORT_PACKAGING_OEE_MATERIAL_QUERY_API({ // /pkgReportForm/material/query
                            workShop: val || '',
                            productLine: ''
                        })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialName', 'materialCode'],
                    value: 'materialCode'
                }
            },
             {
                type: 'select',
                hide: false, // hide column
                label: '灌装线',
                prop: 'bottleLine',
                defaultValue: '',
                labelWidth: '75',
                width: '160',
                clearable: true,
                marked: false, // mark it
                disabled: false,
                returnValue: {
                    findList: 'productLine',
                    findId: 'id',
                    findField: 'bottleLineNum'
                },
                optionsFn: (val, secondVal) => {
                    return new Promise((resolve) => {
                        const listTemp: object[] = [];
                        for (let i = 1; i <= secondVal; i++) {
                            listTemp.push({ value: `${i}`, label: `${i}` })
                        }
                        resolve({ data: { data: listTemp } });
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['label'],
                    value: 'value'
                }
            },
            {
                type: 'select',
                hide: false, // hide column
                label: '领用物料',
                prop: 'useMaterial',
                defaultValue: '',
                labelWidth: '80',
                width: '160',
                clearable: true,
                marked: false, // mark it
                disabled: false,
                defaultOptionsFn: () => {
                    return COMMON_API.ALLMATERIAL_API({
                        materialTypes: ['ZHAL'] // 物料类型列表 - 半成品
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialName', 'materialCode'],
                    value: 'materialCode'
                }
            },
            {
                type: 'date-interval',
                hide: false, // hide column
                label: '生产日期',
                defaultValue: '',
                labelWidth: '100',
                width: '305',
                marked: true, // mark it
                clearable: true,
                disabled: false,
                prop: 'startDate',
                propTwo: 'endDate'
            }
        ];

        // data table area setting
        dataTableSetting={
            type: 'default', // default/multiHeader
            showIt: true, // showit or not
            showSelectColumn: false,
            showIndexColumn: false,
            showOperationColumn: false,
            showPagination: true,
            //表格数据
            column: [
                {
                    prop: 'productLineName',
                    label: '生产线',
                    width: '260',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'bottleLine',
                    label: '灌装线',
                    width: '80',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'materialName',
                    label: '品项',
                    width: '350',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'multi',
                    data: ['materialName', 'materialCode']
                },
                {
                    prop: 'useMaterialName',
                    label: '领用物料',
                    width: '350',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'multi',
                    data: ['useMaterialName', 'useMaterialCode']
                },
                {
                    prop: 'orderNo',
                    label: '订单',
                    width: '120',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'useMaterialUnit',
                    label: '单位',
                    width: '80',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'productDate',
                    label: '日期',
                    subLabel: '',
                    width: '140',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'needNum',
                    label: '需求用量',
                    width: '80',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'potOrder',
                    label: '锅序',
                    width: '80',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'realUsed',
                    label: '实际用量',
                    width: '80',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                 {
                    prop: 'startDate',
                    label: '开始使用时间',
                    subLabel: '',
                    width: '160',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                 {
                    prop: 'endDate',
                    label: '用完时间',
                    subLabel: '',
                    width: '160',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'duration',
                    label: '时长',
                    subLabel: '(min)',
                    width: '80',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                }
            ],
            tableAttributes: {
                isShowSummary: false // 合计
            },
            dataChangeByAPI: false, // table data change by API
            tableHeightSet: 405

        }

        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_PACKAGING_SEMI_FINISHED_PRODUCTIONS_DETAILS_QUERY_API(params);
        };

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
            if (target) {
                columns.forEach((column, index) => {
                    if (Object.prototype.hasOwnProperty.call(target.totalData, column.property)) {
                        sums[index] = target.totalData[column.property]
                    } else {
                        sums[index] = ''
                    }
                });
                sums[0] = '合计';
            }
            return sums
        };

        // 设置数据
        setData(data) {
            console.log('查找回传结果');
            console.log(data);
            if (!data.data || data.data.length === 0) {
                this.$infoToast('查询无结果');

            }
        }

    }
</script>
