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
            @data-action="dataAction"
            @value-change="valueChange"
        />

        <el-dialog title="异常明细" :close-on-click-modal="false" :visible.sync="isDialogVisible" width="70%" class="infoDialog">
            <div class="inner-area">
                <div class="inner-area__title">
                    <h3>异常汇总</h3>
                    <el-button type="primary" size="small" :disabled="dialogDataMainTable.length===0" @click="subTableExportExcel(dialogDataMainTable)">
                        导出
                    </el-button>
                </div>
                <div class="inner-area__body">
                    <el-table class="newTable" :data="dialogDataMainTable" header-row-class-name="tableHead" tooltip-effect="dark" border style="width: 100%; max-height: 150px; margin-bottom: 20px;" @row-dblclick="showDetailInfo">
                        <el-table-column label="项次" type="index" width="55px" />
                        <el-table-column label="生产线" prop="productLineName" min-width="250px" show-overflow-tooltip />
                        <el-table-column label="物料编码" prop="materialCode" min-width="350px" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{ scope.row.materialName }} {{ scope.row.materialCode }}
                            </template>
                        </el-table-column>
                        <el-table-column label="月/季" prop="productDate" width="120px" />
                        <el-table-column label="停机情况" prop="stopType" width="120px" show-overflow-tooltip />
                        <el-table-column label="停机时长(min)" prop="stopTime" width="120px" show-overflow-tooltip />
                    </el-table>
                    <el-table v-if="isShowSecondTable" class="newTable" :data="notReachInfoList" header-row-class-name="tableHead" tooltip-effect="dark" border style="width: 100%; max-height: 150px;">
                        <el-table-column label="项次" type="index" width="55px" />
                        <el-table-column label="生产日期" prop="productDate" width="120px" />
                        <el-table-column label="停机类型" prop="stopTypeName" min-width="120px" show-overflow-tooltip />
                        <el-table-column label="停机方式" prop="stopModeName" min-width="120px" show-overflow-tooltip />
                        <el-table-column label="停机开始时间" prop="startDate" width="200px" show-overflow-tooltip />
                        <el-table-column label="停机结束时间" prop="endDate" width="200px" show-overflow-tooltip />
                        <el-table-column label="停机时长(min)" prop="duration" width="120px" />
                        <el-table-column label="次数" prop="exceptionCount" width="120px" />
                        <el-table-column label="停机情况" prop="stopSituationName" min-width="120px" show-overflow-tooltip />
                        <el-table-column label="停机原因" prop="stopReasonName" min-width="200px" show-overflow-tooltip />
                    </el-table>
                </div>
                <div slot="footer" class="dialog-footer" />
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, REPORTS_API } from 'common/api/api';
    import { exportFileFor2ExcelMultiSheets } from 'utils/utils';
    // import { dateFormat } from 'utils/utils';

    @Component({
        components: {
        },
        name: 'ProductLineOEEReport'
    })
    export default class ProductLineOEEReport extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        };

        // ========dialog=======
        isDialogVisible=false
        currentQueryData: CurrentQueryData[]=[]
        dialogDataMainTable: DialogDataMainTable[]=[]
        dialogDataSecondTable: NotReachInfo[]=[]
        notReachInfoList=[]
        isShowSecondTable=false

        // query header area setting
        queryFormSetting= {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
                {
                    prop: 'workShop',
                    text: '请选择生产车间'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '产线OEE报表'
            }
        }

        // 查询表头
        queryFormData = [
            {
                type: 'select', // column type
                hide: false, // hide column
                label: '报表类型', // column title
                prop: 'formType',
                defaultValue: 'day',
                labelWidth: '80', // default 70px
                width: '60', // default 170px
                clearable: false,
                marked: false, // mark it
                disabled: false,
                defaultOptionsList: [ // options
                    { value: 'day', label: '日' },
                    { value: 'month', label: '月' },
                    { value: 'quarter', label: '季' }
                ],
                defaultDisabled: ['year'],
                changeToAction: val => {
                    return new Promise((resolve) => {
                        if (val === 'day') {
                            resolve(['year'])
                        } else {
                            resolve(['startDate'])
                        }
                    })
                }
            },
            {
                type: 'select', // column type
                hide: false, // hide column
                label: '生产车间', // column title
                prop: 'workShop',
                // defaultValue: '',
                labelWidth: '90',
                width: '140',
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
                type: 'select', // column type
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
                    return COMMON_API.ORG_QUERY_CHILDREN_API({ // /sysDept/childList
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
            {
                type: 'select', // column type
                hide: false, // hide column
                label: '生产物料',
                prop: 'materialCode',
                defaultValue: '',
                labelWidth: '80',
                width: '160',
                marked: false, // mark it
                clearable: true,
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
                type: 'date-picker',
                hide: false, // hide column
                label: '年度',
                defaultValue: '',
                labelWidth: '52', // default 70px
                width: '120', // default 70px
                valueFormat: 'yyyy',
                dataType: 'year',
                prop: 'year',
                marked: false, // mark it
                clearable: true,
                disabled: false
            },
            {
                type: 'date-interval',
                hide: false, // hide column
                label: '生产日期',
                defaultValue: '',
                labelWidth: '80', // default 70px
                width: '305', // default 305px
                marked: false, // mark it
                clearable: true,
                prop: 'startDate',
                propTwo: 'endDate',
                disabled: false
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
                    width: '350',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    subLabel: '',
                    dataType: 'default'
                },
                {
                    prop: 'materialName',
                    label: '物料',
                    width: '350',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'multi',
                    data: ['materialName', 'materialCode']
                },
                {
                    prop: 'productDate',
                    label: '日/月/季',
                    width: '160',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'timeCropRatio',
                    label: '时间嫁动率',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'performCropRatio',
                    label: '性能嫁动率',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'goodRatio',
                    label: '良品率',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'theOEERatio',
                    label: 'OEE',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'notReach',
                    label: '未达成原因',
                    minWidth: '240',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    custom: true,
                    dataType: 'list'
                }
            ],
            tableAttributes: {
                isShowSummary: true // 合计
            },
            dataChangeByAPI: false, // table data change by API
            tableHeightSet: 405

        }


        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            // search logic
            if (params.formType === 'day') {
                params.year = ''
            } else {
                params.startDate = ''
                params.endDate = ''
            }
            return REPORTS_API.REPORT_PACKAGING_PRODUCTLINE_OEE_QUERY_API(params);
        };

        valueChange(v) {
            if (v === 'day') {
                this.$refs.queryTable.clickAble = false
                return
            }
            this.$refs.queryTable.clickAble = true
        }


        dataAction(row, index) {
            console.log(row)
            console.log(index)
            this.isDialogVisible = true;
            this.dialogDataMainTable = this.currentQueryData[index].notReachInfo as DialogDataMainTable[]
            console.log('this.dialogDataMainTable')
            console.log(this.dialogDataMainTable)
            // if (this.dialogDataMainTable.length !== 0) {
            //     this.dialogDataSecondTable = this.dialogDataMainTable.notReachInfo as DialogDataSecondTable[]
            // }

        }

         // 表格双击
        showDetailInfo(val) {
            this.isShowSecondTable = true;
            console.log(val)
            this.notReachInfoList = val.notReachInfo
        }

        subTableExportExcel(data) {

            // var excelDatas = [
            //     {
            //     tHeader: ['Id', 'Title', 'Author', 'Readings', 'Date'], // sheet表一头部
            //     filterVal: ['id', 'title', 'author', 'pageviews', 'display_time'], // 表一的数据字段
            //     tableDatas: this.list, // 表一的整体json数据
            //     sheetName: 'sheet1'// 表一的sheet名字
            //     },
            //     {
            //     tHeader: ['序号', '标题', '作者', '服务'],
            //     filterVal: ['id', 'title', 'author', 'reviewer'],
            //     tableDatas: this.list,
            //     sheetName: 'sheet2'
            //     },
            //     {
            //     tHeader: ['序号', '名字', '描述'],
            //     filterVal: ['userId', 'userName', 'userDescription'],
            //     tableDatas: this.rolesList,
            //     sheetName: 'sheet5555'
            //     }
            // ]


            const excelDatas = [
                {
                    tHeader: ['生产线', '物料编码', '生产物料', '月/季', '停机情况', '停机时长（MIN)'],
                    filterVal: ['productLineName', 'materialCode', 'materialName', 'productDate', 'stopType', 'stopTime'],
                    tableDatas: data,
                    sheetName: '异常汇总'
                }
            ]


            data.forEach(item => {
                excelDatas.push({
                    tHeader: ['生产日期', '停机类型', '停机方式', '停机时间开始', '停机结束时间', '停机时长（MIN)', '次数', '停机情况', '停机原因'],
                    filterVal: ['productDate', 'stopTypeName', 'stopModeName', 'startDate', 'endDate', 'duration', 'exceptionCount', 'stopSituationName', 'stopReasonName'],
                    tableDatas: item.notReachInfo,
                    sheetName: item.stopType
                })
            })


            exportFileFor2ExcelMultiSheets(excelDatas, '异常明细', true, 'xlsx')
        }

        formatJson(column, jsonData) {
            return jsonData.map(v =>
                column.map(j => {
                    if (j.formatter && typeof j.formatter(v) === 'string') {
                        return j.formatter(v);
                    }
                    return v[j.prop];
                })
            );
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
            this.currentQueryData = []
            if (!data.data || data.data.length === 0) {
                this.$infoToast('查询无结果');

            }
            this.currentQueryData = data.data
            console.log('this.currentQueryData')
            console.log(this.currentQueryData)
        }

    }
    interface CurrentQueryData{
        googRatio?: string;
        materialCode?: string;
        materialName?: string;
        notReach?: string[];
        notReachInfo?: DialogDataMainTable[];
        performCropRatio?: string;
        productDate?: string;
        productLine?: string;
        productLineName?: string;
        theOEERatio?: string;
        timeCropRatio?: string;
        totalData?: TotalData[];
    }

    interface DialogDataMainTable{
        materialCode?: string;
        materialName?: string;
        notReachInfo?: NotReachInfo[];
        productDate?: string;
        productLine?: string;
        productLineName?: string;
        stopTime?: number;
        stopType?: string;
    }
    interface NotReachInfo{
        changed?: string;
        changer?: string;
        classes?: string;
        created?: string;
        creator?: string;
        delFlag?: number;
        duration?: number;
        durationUnit?: string;
        endDate?: string;
        exceptionCount?: number;
        exceptionInfo?: string;
        factory?: string;
        id?: string;
        orderId?: string;
        orderNo?: string;
        remark?: string;
        startDate?: string;
        stopMode?: string;
        stopReason?: string;
        stopSituation?: string;
        stopType?: string;
        version?: number;
    }
    interface TotalData{
        allBad?: string;
        allTolTime?: string;
        alltime?: string;
        avbRatio?: string;
        effecCapacity?: string;
        excptTime?: string;
        googRatio?: string;
        netOprTime?: string;
        netOprTimeHour?: string;
        outPutTime?: string;
        output?: string;
        performCropRatio?: string;
        planStopTime?: string;
        proDuctRatio?: string;
        removeTime?: string;
        theOEERatio?: string;
        timeCropRatio?: string;
    }
</script>

<style lang="scss" scoped>

.inner-area {
    .inner-area__title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        h3 {
            font-weight: bold;
            font-size: 14px !important;
            line-height: 32px;
            .title-icon {
                display: inline-block;
                width: 4px;
                height: 12px;
                margin-top: 10px;
                margin-right: 5px;
                background: #487bff;
                border-radius: 2px;
            }
            .point-icon {
                width: 5px;
                height: 5px;
                margin-top: 13px;
                margin-right: 5px;
                background: #487bff;
                border-radius: 3px;
            }
        }
    }
    .inner-area__body {
        .table-style-light {
            .el-table__header {
                th {
                    color: white;
                    text-align: center;
                    background: #e8e8e8;
                    background-color: #e8e8e8 !important;
                    border-top: none;
                    border-right: none;
                    border-bottom: none;
                    border-left: none;
                }
            }
            .el-table__body {
                td {
                    padding: 0;
                }
            }
            tr:nth-child(even) {
                background-color: #f7f7f7;
            }
            .el-table__row {
                td:first-child {
                    border-left: 2px solid transparent;
                }
            }
            .hover-row {
                td:first-child {
                    border-left: 2px solid #e8e8e8;
                }
            }
            .el-table__row:hover {
                td:first-child {
                    border-left: 2px solid #e8e8e8;
                }
            }

            .el-input.is-disabled .el-input__inner {
                width: 100%;
                overflow: hidden;
                color: #666 !important;
                background: none;
                border: none;
            }
        }
    }
}
.dialog-footer {
    margin-top: 10px;
    text-align: right;
}


</style>
<style scoped>
.infoDialog >>> .el-dialog .el-dialog__body {
    padding: 20px;
}
</style>
