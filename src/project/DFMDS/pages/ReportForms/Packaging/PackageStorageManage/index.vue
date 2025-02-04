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
        name: 'PackageStorageReport'
    })
    export default class PackageStorageReport extends Vue {
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
                },
                {
                    prop: 'moveType',
                    text: '请输入属性'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '包材库存管理报表'
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
                linkageProp: ['productLine', 'materialCode', 'manufactor']
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
                }
            },
            // TODO
            {
                type: 'select',
                hide: false, // hide column
                label: '组件物料',
                prop: 'materialCode',
                defaultValue: '',
                labelWidth: '80',
                width: '160',
                clearable: true,
                marked: false, // mark it
                disabled: false,
                optionsFn: val => {
                    return REPORTS_API.REPORT_PACKAGING_MATERIAL_QUERY_API({
                        workShop: val || ''
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['dictValue', 'dictCode'],
                    value: 'dictCode'
                },
                linkageProp: ['batch']
            },
            // TODO
             {
                type: 'select',
                hide: false, // hide column
                label: '批次',
                prop: 'batch',
                defaultValue: '',
                labelWidth: '80',
                width: '160',
                clearable: true,
                marked: false, // mark it
                disabled: false,
                // returnValue: {
                //     findList: 'workShop',
                //     findId: 'deptCode',
                //     findField: 'deptName'
                // },
                optionsFn: val => {
                    return new Promise(resolve => {
                        REPORTS_API.REPORT_PACKAGING_MATERIAL_BATCH_QUERY_API({
                        // eslint-disable-next-line no-invalid-this
                        workShop: this.$refs.queryTable.queryForm.workShop,
                        materialCode: val
                    }).then(res => {
                            const objTemp: object[] = []
                            res.data.data.forEach(item => {
                                objTemp.push({ 'batch': item })
                            })
                            res.data.data = objTemp
                            resolve(res);
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['batch'],
                    value: 'batch'
                }
            },
            // TODO
            {
                type: 'select',
                hide: false, // hide column
                label: '厂家',
                prop: 'manufactor',
                defaultValue: '',
                labelWidth: '80',
                width: '160',
                clearable: true,
                marked: false, // mark it
                disabled: false,
                optionsFn: val => {
                    return new Promise(resolve => {
                        REPORTS_API.REPORT_PACKAGING_MATERIAL_FACTORY_QUERY_API({
                            workShop: val || ''
                        }).then(res => {
                            const objTemp: object[] = []
                            res.data.data.forEach(item => {
                                objTemp.push({ 'vender': item })
                            })
                            res.data.data = objTemp
                            resolve(res);
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['vender'],
                    value: 'vender'
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
            },
            // TODO
            {
                type: 'select',
                hide: false, // hide column
                label: '属性',
                prop: 'moveType',
                defaultValue: 'BAD_REJECTED',
                labelWidth: '80',
                width: '160',
                clearable: true,
                marked: true, // mark it
                disabled: false,
                defaultOptionsList: [ // options
                    { value: 'BAD_REJECTED', label: '不良退料' },
                    { value: 'NORMAL_REJECTED', label: '正常退料' },
                    { value: 'GOOD', label: '良品' }
                ],
                changeToAction: val => {
                    return new Promise((resolve) => {
                        if (val === 'BAD_REJECTED') {
                            // eslint-disable-next-line no-invalid-this
                            this.queryFormData[5].marked = true;
                            // eslint-disable-next-line no-invalid-this
                            this.setRules()
                            resolve([''])
                        } else {
                            // eslint-disable-next-line no-invalid-this
                            this.queryFormData[5].marked = false;
                            // eslint-disable-next-line no-invalid-this
                            this.setRules()
                            resolve(['startDate'])
                        }
                    })
                }
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
                    label: '生产产线',
                    width: '250',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'materialName',
                    label: '组件物料',
                    minWidth: '350',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'multi',
                    data: ['materialName', 'materialCode']
                },
                {
                    prop: 'moveTypeName',
                    label: '属性',
                    width: '160',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'amount',
                    label: '数量',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'batch',
                    label: '批次',
                    width: '140',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'storageUnitName',
                    label: '单位',
                    width: '90',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'manufactor',
                    label: '厂家',
                    width: '200',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'remark',
                    label: '原因',
                    width: '200',
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

        mounted() {
            this.setRules();
        }

        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            if (params.moveType !== 'BAD_REJECTED') {
                params.startDate = ''
                params.endDate = ''
            }
            return REPORTS_API.REPORT_PACKAGING_STORAGE_QUERY_API(params);
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

        setRules() {
            this.queryFormSetting.rules = [];
            this.queryFormData.forEach(item => {
                if (item.marked === true) {
                    this.queryFormSetting.rules.push({
                        prop: item.prop,
                        text: `请输入${item.label}`
                })
                }
            })
        }

    }
</script>
