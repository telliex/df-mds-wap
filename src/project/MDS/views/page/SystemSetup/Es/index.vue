<template>
    <div class="header_main">
        <query-table ref="queryTable" :rules="rules" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'esCommon:iot'" :column="column" @get-data-success="getDataSuccess">
            <template slot="mds-button-middle">
                <div class="box-card-title clearfix">
                    <h3> <em class="title-icon" style="background: #487bff;" />ES报表</h3>
                </div>
            </template>
        </query-table>
    </div>
</template>

<script>
import { SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            rules: [
                {
                    prop: 'werks',
                    text: '请填写生产工厂'
                },
                {
                    prop: 'workShop',
                    text: '请填写生产车间'
                },
                {
                    prop: 'startDate',
                    text: '请选择时间'
                },
                {
                    prop: 'endDate',
                    text: '请选择时间'
                }
            ],
            queryFormData: [
                {
                    type: 'input',
                    label: '生产工厂',
                    prop: 'werks'
                },
                {
                    type: 'input',
                    label: '生产车间',
                    prop: 'workShop'
                },
                {
                    type: 'input',
                    label: '名称',
                    prop: 'name'
                },
                {
                    type: 'date-interval',
                    label: '时间',
                    dataType: 'datetime',
                    prop: 'startDate',
                    propTwo: 'endDate',
                    valueFormat: 'yyyy-MM-dd HH:mm:ss'
                }
            ],
            listInterface: params => {
                // params.werks = this.$refs.queryTable.optionLists.factory.filter(it => it.deptId === params.factory)[0].deptCode
                // params.workShop = this.$refs.queryTable.optionLists.workShopid.filter(it => it.deptId === params.workShopid)[0].deptCode
                // params.werks = '7101'
                // params.workShop = 'BZ1'
                return this.$http(`${SYSTEMSETUP_API.ES_LIST_API}`, 'POST', params);
            },
            column: [
                {
                    prop: 'name',
                    label: '名称'
                },
                {
                    prop: 'v',
                    label: '数值',
                    width: '120'
                },
                {
                    prop: 'datetime',
                    label: '时间'
                }
            ]
        };
    },
    computed: {},
    mounted() {
    //    mounted
    },
    methods: {}
};
</script>

<style scoped></style>
