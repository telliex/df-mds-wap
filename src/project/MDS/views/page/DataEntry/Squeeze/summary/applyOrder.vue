<template>
    <div>
        <mds-card title="原汁信息" name="summaryAppleOrder">
            <template slot="titleBtn">
                <el-button type="primary" style="float: right;" size="small" :disabled="!isRedact" @click="ApplyOrder">
                    申请订单
                </el-button>
            </template>
            <el-table ref="table1" class="newTable" :data="fumet" header-row-class-name="tableHead" border tooltip-effect="dark" @row-dblclick="GetLog" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :selectable="checkboxApply" width="50" />
                <el-table-column label="状态" width="95">
                    <template slot-scope="scope">
                        <span
                            :style="{
                                color: scope.row.status === 'noPass' ? 'red' : scope.row.status === 'checked' ? '#67C23A' : '',
                            }"
                        >{{ scope.row.status === 'noPass' ? '审核不通过' : scope.row.status === 'saved' ? '已保存' : scope.row.status === 'submit' ? '已提交' : scope.row.status === 'checked' ? '通过' : scope.row.status === '已同步' ? '未录入' : '未录入' }}</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="120">
                    <template slot="header">
                        <em class="reqI">*</em><span>原汁罐号</span>
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row.potNoName }}
                    </template>
                </el-table-column>
                <el-table-column label="是否混合罐" min-width="110">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.fullPort" placeholder="请选择" disabled size="small" @change="fullPortChange">
                            <el-option label="正常" value="正常" />
                            <el-option label="共用混合" value="共用混合" />
                            <el-option label="单用混合" value="单用混合" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="物料" min-width="220">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.material" filterable placeholder="请选择" disabled size="small" @change="setProVersion(scope.row)">
                            <el-option v-for="item in serchSapList" :key="item.code + ' ' + item.value" :label="item.code + ' ' + item.value" :value="item.code + ' ' + item.value" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="入罐数量" min-width="120" prop="inPotAmount" />
                <el-table-column label="满罐数量" min-width="140" prop="fullPotAmount" />
                <el-table-column label="单位" min-width="50" prop="unit" />
                <el-table-column label="满罐日期" min-width="140" prop="fullPotDate" />
                <el-table-column label="原汁批次" min-width="140" prop="batch" />
                <el-table-column label="订单类型" min-width="120">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.orderType" placeholder="请选择" disabled size="mini" style="width: 100px;">
                            <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.value" :value="item.code" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="生产版本" min-width="120">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.proVersion" placeholder="请选择" size="mini" style="width: 100px;" :disabled="true">
                            <el-option v-for="(item, index) in versionList" :key="index" :label="item.value" :value="item.code" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="生产订单" min-width="140" prop="orderNo" />
                <el-table-column label="操作" width="60" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.isVerBack !== '1')" @click="backIn(scope.row)">
                            退回
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log :table-data="orderAudit" />
    </div>
</template>

<script>
import { SQU_API } from '@/api/api';
export default {
    name: 'ApplyOrder',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    props: {
        isRedact: {
            type: Boolean
        },
        poTestVar: {
            type: Object,
            default: () => { return {} }
        },
        versionList: {
            type: Array,
            default() {
                return [];
            }
        },
        orderTypeList: {
            type: Array,
            default() {
                return [];
            }
        },
        fumet: {
            type: Array,
            default() {
                return [];
            }
        },
        serchSapList: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            multipleSelection: [],
            OrderDate: [{}],
            orderAudit: []
        };
    },
    computed: {},
    watch: {
        poTestVar(n) {
            if (n !== '') {
                const row = this.fumet.find(item => item.potNoName === n.potNoName);
                row.orderType = n.orderType;
            }
        }
    },
    methods: {
        // 申请订单
        ApplyOrder() {
            this.$emit('ApplyOrder', this.multipleSelection);
        },
        setProVersion(row) {
            if (row.material.substring(0, row.material.indexOf(' ')) === 'SS04010003') {
                if (row.workShopName.indexOf('压榨一') !== -1) {
                    row.proVersion = '01';
                } else if (row.workShopName.indexOf('压榨二') !== -1) {
                    row.proVersion = '02';
                }
            } else {
                row.proVersion = '';
            }
        },
        // 日志
        GetLog(row) {
            this.$http(`${SQU_API.SUM_LOG_FUM_API}`, 'POST', {
                orderId: row.orderId
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.orderAudit = data.listRecord;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        fullPortChange() {
            //
        },
        applyorderRul() {
            let ty = true;
            for (const item of this.fumet) {
                if (!item.orderNo) {
                    ty = false;
                    this.$warningToast('订单没有生产订单');
                    return false;
                }
            }
            return ty;
        },
        // 退回
        backIn(row) {
            this.$http(`${SQU_API.SUM_ORDER_BACK_API}`, 'POST', row).then(({ data }) => {
                if (data.code === 0) {
                    this.$notify({
                        title: '成功',
                        message: '退回成功',
                        type: 'success'
                    });
                    this.$emit('GetList');
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 修改订单
        UpdateOrder(str, resolve, reject, st = false) {
            this.fumet.forEach((item) => {
                if (item.status) {
                    if (item.status === 'saved') {
                        item.status = str;
                    } else if (item.status === 'noPass' && str === 'submit') {
                        item.status = str;
                    }
                } else {
                    item.status = str;
                }
                item.materialCode = item.material.substring(0, item.material.indexOf(' '));
                item.materialName = item.material.substring(item.material.indexOf(' ') + 1);
            });
            this.$http(`${st === false ? SQU_API.SUM_ORDERUPDATE_API : SQU_API.SUM_ORDER_SUBMIT_API}`, 'POST', this.fumet).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    if (reject) {
                        reject(data.msg);
                    }
                    this.$errorToast(data.msg);
                }
            });
        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item);
            });
        },
        // 审核通过禁用
        checkboxApply(row) {
            if (row.orderNo) {
                return 0;
            }
                return 1;

        }
    }
};
</script>

<style scoped></style>
