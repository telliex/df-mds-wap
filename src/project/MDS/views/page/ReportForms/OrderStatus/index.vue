<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:formh:getAllStatusList'" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script>
import { REP_API, BASICDATA_API, SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            queryFormData: [
                {
                    type: 'select',
                    label: '生产工厂',
                    prop: 'factory',
                    defaultOptionsFn: () => {
                        return this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false);
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['workShop']
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workShop',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: val, deptName: '' });
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['productline']
                },
                {
                    type: 'select',
                    label: '生产产线',
                    prop: 'productline',
                    resVal: {
                        resData: 'childList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: val });
                    }
                },
                {
                    type: 'input',
                    label: '生产订单',
                    prop: 'orderNo'
                },
                {
                    type: 'select',
                    label: '订单状态',
                    prop: 'orderStatus',
                    defaultValue: '',
                    defaultOptionsFn: () => {
                        return this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { type: 'status_type' }, false, false, false);
                    },
                    resVal: {
                        resData: 'dicList',
                        label: ['value'],
                        value: 'code'
                    }
                },
                {
                    type: 'select',
                    label: '报工状态',
                    prop: 'timeStatus',
                    defaultValue: '',
                    defaultOptionsFn: () => {
                        return this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { type: 'status_type' }, false, false, false);
                    },
                    resVal: {
                        resData: 'dicList',
                        label: ['value'],
                        value: 'code'
                    }
                },
                {
                    type: 'select',
                    label: '入库状态',
                    prop: 'inStatus',
                    defaultValue: '',
                    defaultOptionsFn: () => {
                        return this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { type: 'status_type' }, false, false, false);
                    },
                    resVal: {
                        resData: 'dicList',
                        label: ['value'],
                        value: 'code'
                    }
                },
                {
                    type: 'select',
                    label: '发料状态',
                    prop: 'matStatus',
                    defaultValue: '',
                    defaultOptionsFn: () => {
                        return this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { type: 'status_type' }, false, false, false);
                    },
                    resVal: {
                        resData: 'dicList',
                        label: ['value'],
                        value: 'code'
                    }
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.ORDER_STATUS_LIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.ORDER_STATUS_OUT_API,
                auth: 'report:formh:getAllStatusList',
                text: '订单状态报表数据导出'
            },
            column: [
                {
                    prop: 'factoryName',
                    label: '工厂'
                },
                {
                    prop: 'workShopName',
                    label: '车间'
                },
                {
                    prop: 'productLineName',
                    label: '产线'
                },
                {
                    prop: 'productDate',
                    label: '生产日期'
                },
                {
                    prop: 'orderNo',
                    label: '生产订单'
                },
                {
                    prop: 'orderStatus',
                    label: '订单状态'
                },
                {
                    prop: 'timeStatus',
                    label: '报工审核状态'
                },
                {
                    prop: 'inStatus',
                    label: '入库审核状态'
                },
                {
                    prop: 'matStatus',
                    label: '发料审核状态'
                }
            ]
        };
    },
    computed: {},
    methods: {}
};
</script>

<style scoped></style>
