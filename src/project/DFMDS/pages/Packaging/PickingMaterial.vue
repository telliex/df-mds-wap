<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :factory-type="1"
            :column="column"
            :rules="rules"
            :custom-data="true"
            :show-index-column="true"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :show-fold="false"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, PKG_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';

    @Component
    export default class PickingMaterial extends Vue {
        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '包装'
                    });
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                },
                linkageProp: ['productLine']
            },
            {
                type: 'select',
                label: '生产产线',
                prop: 'productLine',
                filterable: true,
                optionsFn: val => {
                    return COMMON_API.ORG_QUERY_CHILDREN_API({
                        parentId: val || '',
                        deptType: 'PRODUCT_LINE'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'date-interval',
                label: '生产日期',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'productStartDate',
                propTwo: 'productEndDate'
            },
            {
                type: 'select',
                label: '领料状态',
                filterable: true,
                prop: 'useMaterialStatus',
                options: [
                    { label: '已领料', value: '1' },
                    { label: '未领料', value: '0' }
                ],
                resVal: {
                    label: ['label'],
                    value: 'value'
                }
            },
            // {
            //     type: 'select',
            //     label: '订单状态',
            //     prop: 'orderStatus',
            //     defaultOptionsFn: () => {
            //         return COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CHECK_STATUS' });
            //     },
            //     defaultValue: '',
            //     resVal: {
            //         resData: 'data',
            //         label: ['dictValue'],
            //         value: 'dictCode'
            //     }
            // },
            {
                type: 'input',
                label: '生产订单',
                prop: 'orderNo'
            }
        ]

        rules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ];

        column = [
            {
                label: '订单状态',
                prop: 'orderStatusName',
                minwidth: '80'
            },
            {
                label: '领料状态',
                prop: 'useMaterialStatus',
                minwidth: '80',
                formatter: (row) => {
                    if (row.useMaterialStatus === '1') {
                        return '已领料'
                    }
                    return '未领料'
                }
            },
            {
                label: '生产日期',
                prop: 'productDate',
                minwidth: '100'
            },
            {
                label: '生产产线',
                prop: 'productLineName',
                minwidth: '130'
            },
            {
                label: '生产订单',
                prop: 'orderNo',
                formatter: (row) => {
                    const h = this.$createElement; // eslint-disable-line
                    return h('div', {
                        style: {
                            color: '#45c2b5',
                            cursor: 'pointer'
                        },
                        on: {
                            click: () => {
                                this.goDetail(row); // eslint-disable-line
                            }
                        }
                    }, row.orderNo);
                },
                minwidth: '120'
            },
            {
                label: '生产物料',
                prop: 'materialCode;',
                minwidth: '180',
                formatter: (row) => {
                    return row.materialName + ' ' + row.materialCode;
                }
            },
            {
                label: '计划数量',
                prop: 'planOutput',
                minwidth: '80'
            },
            {
                label: '入库数量',
                prop: 'realOutput',
                minwidth: '80'
            },
            {
                label: '单位',
                prop: 'outputUnit',
                minwidth: '50'
            }
        ]

        listInterface(params) {
            if ((params.productStartDate === '' || !params.productStartDate) && params.orderNo === '') {
                this.$warningToast('日期或订单请选填一项');// eslint-disable-line
                return new Promise((resolve, reject) => {
                    reject('error') // eslint-disable-line
                });
            }
            return PKG_API.PKG_PICKING_MATERIAL_LIST_API(params);
        }

        goDetail(row) {
            this.$store.commit('packaging/updatePickingDetail', row);
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Packaging-PickingMaterialDetail'))
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Packaging-PickingMaterialDetail`
                });
            }, 100);
        }
    }
</script>

<style scoped>

</style>
