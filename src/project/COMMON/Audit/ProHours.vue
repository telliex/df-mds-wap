<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="ckTimeQuery"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            :tabs="tabs"
            :selectable-fn="selectableFn"
            :show-index-column="true"
            :show-select-column="true"
            :show-operation-column="true"
            :operation-column-width="operationColumnWidth"
            @tab-click="() => { operationColumnWidth = $refs.queryTable.activeName === '0'? 140 : 86 }"
            @get-data-success="setData"
        >
            <template slot="tab-head0">
                <div class="tab__heads clearfix">
                    <em class="title-icon" />
                    <span>报工列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span>
                        <el-date-picker v-model="postingDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" style="width: 140px; margin-right: 10px;" />
                        <el-button v-if="isAuth('ckTimePost')" type="primary" size="small" @click="pass">
                            过账
                        </el-button>
                        <el-button v-if="isAuth('ckTimeReturn')" type="primary" size="small" class="sub-red" @click="refuseDialog">
                            退回
                        </el-button>
                    </div>
                </div>
            </template>
            <template slot="tab-head1">
                <div class="tab__heads clearfix">
                    <em class="title-icon" />
                    <span>报工列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span>
                        <el-date-picker v-model="postingDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" style="width: 140px; margin-right: 10px;" />
                        <el-button v-if="isAuth('ckTimeRevert')" type="primary" size="small" class="sub-yellow" @click="writeOffsDialog">
                            反审
                        </el-button>
                    </div>
                </div>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button v-if="isAuth('ckTimeEdit') && $refs.queryTable.activeName === '0'" class="ra_btn" type="text" round size="mini" @click="addOrupdate(scope.row)">
                    {{ scope.row.redact ? '保存' : '编辑' }}
                </el-button>
                <el-button v-if="isAuth('ckTimeRecord')" class="ra_btn" type="text" round size="mini" @click="AuditLog(scope.row)">
                    审核日志
                </el-button>
            </template>
        </query-table>
        <el-dialog title="退回原因" :close-on-click-modal="false" :visible.sync="visibleRefuse">
            <el-input v-model="ReText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="visibleRefuse = false">
                    取消
                </el-button>
                <el-button type="primary" @click="refuse()">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="反审原因" :close-on-click-modal="false" :visible.sync="visibleBack">
            <el-input v-model="BackText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="visibleBack = false">
                    取消
                </el-button>
                <el-button type="primary" @click="writeOffs()">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="审核日志" width="900px" :close-on-click-modal="false" :visible.sync="visibleAuditLog">
            <audit-log :table-data="auditLogData" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :pack-up="false" :status="true" />
            <div slot="footer" class="dialog-footer" />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API, AUDIT_API } from 'common/api/api';
import { dateFormat } from 'utils/utils';

@Component({
    components: {}
})
export default class ProInStore extends Vue {
    //表格数据
    Column = [
        {
            prop: 'status',
            label: '过账状态'
        },
        {
            prop: 'orderProductDate',
            label: '生产日期',
            width: '120'
        },
        {
            prop: 'orderNo',
            label: '生产订单',
            width: '120'
        },
        {
            prop: 'materialCode',
            label: '生产物料 ',
            width: '120',
            formatter: row => {
                return row.materialCode + ' ' + row.materialName;
            }
        },
        {
            prop: 'planOutput',
            label: '计划数量'
        },
        {
            prop: 'outputUnit',
            label: '单位'
        },
        {
            prop: 'carAmount',
            label: '入库数量（箱）',
            minwidth: '140',
            formatter: row => {
                if (row.carAmount === 0) {
                    return '';
                }
                return row.carAmount;
            }
        },
        {
            prop: 'yield',
            label: '入库数量'
        },
        {
            prop: 'countOutputUnit',
            label: '单位'
        },
        {
            prop: 'confActivity1',
            label: '准备工时'
        },
        {
            prop: 'confActiUnit1',
            label: '单位'
        },
        {
            prop: 'confActivity2',
            label: '机器工时'
        },
        {
            prop: 'confActiUnit2',
            label: '单位'
        },
        {
            prop: 'confActivity3',
            label: '人工工时'
        },
        {
            prop: 'confActiUnit3',
            label: '单位'
        },
        {
            type: 'date-picker',
            redact: true,
            header: true,
            valueFormat: 'yyyy-MM-dd',
            prop: 'execStartDate',
            label: '开始日期',
            width: '158'
        },
        {
            type: 'date-picker',
            redact: true,
            header: true,
            valueFormat: 'yyyy-MM-dd',
            prop: 'setupFinDate',
            label: '完成日期',
            width: '158'
        },
        {
            width: '120',
            prop: 'operation',
            label: '操作活动编号',
            type: 'input',
            header: true,
            redact: true
        },
        {
            type: 'select',
            redact: true,
            header: true,
            resVal: {
                label: 'label',
                value: 'value'
            },
            prop: 'finConf',
            label: '部分/最后确认',
            width: '120'
        },
        {
            type: 'input',
            redact: true,
            prop: 'remark',
            label: '备注'
        },
        {
            prop: 'interfaceMsg',
            label: '接口回写'
        }
    ];

    $refs: {
        queryTable: HTMLFormElement;
    };

    operationColumnWidth = 140;
    auditLogData = []; // 审核日志
    ReText = ''; // 退回原因
    BackText = ''; // 反审原因
    postingDate = dateFormat(new Date(), 'yyyy-MM-dd'); // 过账日期
    visibleAuditLog = false; // 审核日志弹窗
    visibleRefuse = false; // 退回原因弹窗
    visibleBack = false; // 反审原因弹窗

    // 查询表头
    queryFormData = [
        {
            type: 'select',
            label: '生产车间',
            prop: 'workshop',
            defaultOptionsFn: () => {
                return COMMON_API.ORG_QUERY_WORKSHOP_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    deptType: ['WORK_SHOP']
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
            optionsFn: val => {
                return COMMON_API.ORG_QUERY_CHILDREN_API({
                    parentId: val || '',
                    deptType: 'PRODUCT_LINE'
                });
            },
            defaultValue: '',
            resVal: {
                resData: 'data',
                label: ['deptName'],
                value: 'id'
            }
        },
        {
            type: 'input',
            label: '生产订单',
            prop: 'orderNo'
        },
        {
            type: 'select',
            label: '订单类型',
            prop: 'orderType',
            defaultOptionsFn: () => {
                return COMMON_API.DICTQUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    dictType: 'ORDER_TYPE'
                });
            },
            defaultValue: '',
            resVal: {
                resData: 'data',
                label: ['dictValue'],
                value: 'dictCode'
            }
        },
        {
            type: 'select',
            label: '过账状态',
            prop: 'postingStatus',
            defaultOptionsFn: () => {
                return COMMON_API.DICTQUERY_API({
                    dictType: 'COMMON_CHECK_STATUS'
                }).then(data => {
                    data.data.data = data.data.data.filter(it => it.dictValue === '已审核' || it.dictValue === '已退回' || it.dictValue === '接口失败' || it.dictValue === '反审');
                    return data;
                });
            },
            defaultValue: '',
            resVal: {
                resData: 'data',
                label: ['dictValue'],
                value: 'dictCode'
            }
        },
        {
            type: 'date-interval',
            label: '生产日期',
            defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
            prop: 'produceStart',
            propTwo: 'produceEnd'
        }
    ];

    // tab页签
    tabs = [
        {
            label: '未过账',
            tableData: [],
            multipleSelection: [],
            pages: {
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            showOperationColumn: true,
            column: this.Column // eslint-disable-line
        },
        {
            label: '已过账',
            tableData: [],
            multipleSelection: [],
            pages: {
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            showOperationColumn: true,
            column: this.Column // eslint-disable-line
        }
    ];

    mounted() {
        // 消息管理跳转 url 传参判断
        if (window.location.href.indexOf('?') !== -1) {
            const url = window.location.href.split('?')[1].split('&');
            const urlData = {};
            for (let i = 0; i < url.length; i++) {
                urlData[url[i].split('=')[0]] = unescape(url[i].split('=')[1]);
            }

            // 切换页签
            if (urlData['orderStatus'] === 'P') {
                this.$refs.queryTable.activeName = '1';
            } else {
                this.$refs.queryTable.activeName = '0';
            }

            const paramsTemp = {
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: urlData['orderNo'],
                passStatus: Number(this.$refs.queryTable.activeName),
                current: 1,
                size: 10,
                total: 0
            };
            AUDIT_API.HOURS_LIST_API(paramsTemp).then(({ data }) => {
                console.log('data');
                console.log(data);
                // 显示内容
                this.setData(data, true);
                setTimeout(() => {
                    // 修正表单上呈现
                    this.queryFormData.forEach(item => {
                        this.$refs.queryTable.queryForm[item.prop] = '';
                    });
                    this.$refs.queryTable.queryForm.workshop = urlData['workShop'];
                    this.$refs.queryTable.queryForm.orderNo = urlData['orderNo'];
                }, 1000);
            });
        }
        this.$refs.queryTable.optionLists.finConf = [
            {
                label: '完全报工',
                value: 'X'
            },
            {
                label: '部分报工',
                value: ''
            }
        ];
    }

    // 查询请求
    listInterface = params => {
        params.passStatus = this.$refs.queryTable.activeName * 1; // eslint-disable-line
        params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage; // eslint-disable-line
        params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize; // eslint-disable-line
        params.total = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount; // eslint-disable-line
        params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        return AUDIT_API.HOURS_LIST_API(params);
    };

    // 表格复选框
    selectableFn = row => {
        if (row.status === '已退回') {
            return 0;
        }
        return 1;
    };

    // 设置数据
    setData(datas, st) {
        if (st) {
            this.tabs.forEach((item, index) => {
                if (index !== Number(this.$refs.queryTable.activeName)) {
                    const params = this.$refs.queryTable.queryForm;
                    params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                    params.passStatus = index;
                    params.current = 1;
                    params.size = this.$refs.queryTable.tabs[index].pages.pageSize;
                    params.total = this.$refs.queryTable.tabs[index].pages.totalCount;
                    AUDIT_API.HOURS_LIST_API(params).then(({ data }) => {
                        this.tabs[index].tableData = data.data.records;
                        this.setRedact(this.tabs[this.$refs.queryTable.activeName].tableData);
                        this.$refs.queryTable.tabs[index].pages.currPage = data.data.current;
                        this.$refs.queryTable.tabs[index].pages.pageSize = data.data.size;
                        this.$refs.queryTable.tabs[index].pages.totalCount = data.data.total;
                    });
                } else {
                    this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                    this.setRedact(this.tabs[this.$refs.queryTable.activeName].tableData);
                    this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                    this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                    this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
                }
            });
        } else {
            this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
            this.setRedact(this.tabs[this.$refs.queryTable.activeName].tableData);
            this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
            this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
            this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
        }
    }

    // 设置编辑
    setRedact(data) {
        data.forEach(item => {
            item.redact = false;
        });
    }

    // 保存修改
    addOrupdate(row) {
        if (!row.redact) {
            row.redact = true;
        } else {
            if (!row.execStartDate || !row.setupFinDate || !row.operation) {
                this.$warningToast('请填写必填项');
                return false;
            }
            row.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            AUDIT_API.HOURS_UPDATE_API(row).then(({ data }) => {
                this.$successToast(data.msg);
                row.redact = false;
            });
        }
    }

    // 审核日志
    AuditLog(row) {
        AUDIT_API.AUDIT_DIALOG_LOG_LIST_API({
            verifyId: row.id,
            verifyType: 'TIMESHEET'
        }).then(({ data }) => {
            this.auditLogData = data.data;
            this.visibleAuditLog = true;
        });
    }

    // 过账
    pass() {
        if (!this.postingDate) {
            this.$warningToast('请选择过账日期');
            return false;
        }
        if (this.$refs.queryTable.tabs[0].multipleSelection && this.$refs.queryTable.tabs[0].multipleSelection.length) {
            this.$confirm(`确定过账，是否继续？`, '过账确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const list = this.$refs.queryTable.tabs[0].multipleSelection;
                for (const item of list) {
                    if (!item.execStartDate || !item.setupFinDate || !item.operation || !(item.finConf === '' || item.finConf === 'X')) {
                        this.$warningToast('请填写数据必填项');
                        return false;
                    }
                    // item.workshop = this.$refs.queryTable.queryForm.workshop;
                }
                AUDIT_API.HOURS_PASS_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    list: this.$refs.queryTable.tabs[0].multipleSelection,
                    postingDate: this.postingDate
                })
                    .then(({ data }) => {
                        this.$successToast(data.msg);
                        this.$refs.queryTable.getDataList(true);
                    })
                    .catch(err => {
                        if (err.data.code === 201) {
                            this.$refs.queryTable.getDataList(true);
                        }
                    });
            });
        } else {
            this.$warningToast('请勾选数据');
        }
    }

    // 退回弹窗
    refuseDialog() {
        if (this.$refs.queryTable.tabs[0].multipleSelection && this.$refs.queryTable.tabs[0].multipleSelection.length) {
            if (this.postingDate) {
                this.visibleRefuse = true;
                this.ReText = '';
            } else {
                this.$warningToast('请选择过账日期');
            }
        } else {
            this.$warningToast('请勾选数据');
        }
    }

    // 退回确认
    refuse() {
        if (!this.ReText) {
            this.$warningToast('请填写原因');
            return false;
        }
        this.$confirm(`确定退回，是否继续？`, '退回确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            AUDIT_API.HOURS_REFUSE_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                list: this.$refs.queryTable.tabs[0].multipleSelection,
                reason: this.ReText
            }).then(({ data }) => {
                this.visibleRefuse = false;
                this.ReText = '';
                this.$successToast(data.msg);
                this.$refs.queryTable.getDataList();
            });
        });
    }

    // 反审弹窗
    writeOffsDialog() {
        if (this.$refs.queryTable.tabs[1].multipleSelection && this.$refs.queryTable.tabs[1].multipleSelection.length) {
            if (this.postingDate) {
                this.visibleBack = true;
                this.BackText = '';
            } else {
                this.$warningToast('请选择过账日期');
            }
        } else {
            this.$warningToast('请勾选数据');
        }
    }

    // 反审确认
    writeOffs() {
        if (!this.BackText) {
            this.$warningToast('请填写原因');
            return false;
        }
        this.$confirm(`数据已经调用SAP接口已报工，反审后将冲销SAP数据，是否反审`, '反审确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            AUDIT_API.HOURS_WRITEOFFS_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                list: this.$refs.queryTable.tabs[1].multipleSelection,
                postingDate: this.postingDate,
                reason: this.BackText
            }).then(({ data }) => {
                this.visibleBack = false;
                this.BackText = '';
                this.$successToast(data.msg);
                this.$refs.queryTable.getDataList();
            });
        });
    }
}
</script>

<style lang="scss" scoped>
.tab__heads {
    margin-bottom: 10px;
    line-height: 32px;
}
.title-icon {
    float: left;
    width: 4px;
    height: 12px;
    margin-top: 10px;
    margin-right: 5px;
    background: #487bff;
    border-radius: 2px;
}
</style>
