<template>
    <div>
        <el-form ref="timesForm" :inline="true" :model="readyTimeDate" size="small" label-width="125px">
            <mds-card :title="'准备工时 (单位:min)'" :name="'ready'">
                <template slot="titleBtn">
                    <el-form-item label="班次：" style="float: right;">
                        <el-select v-model="readyTimeDate.classes" placeholder="请选择" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))">
                            <el-option label="白班" value="白班" />
                            <el-option label="中班" value="中班" />
                            <el-option label="夜班" value="夜班" />
                            <el-option label="多班" value="多班" />
                        </el-select>
                    </el-form-item>
                </template>
                <el-row v-if="readyTimeDate.classes === '白班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
                    <el-form-item label="交接班（白班）：">
                        <el-input v-model="readyTimeDate.dayChange" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                    </el-form-item>
                    <el-form-item label="班前会：" label-width="80px">
                        <el-input v-model="readyTimeDate.dayChangeBefore" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                    </el-form-item>
                    <el-form-item label="生产前准备：" label-width="100px">
                        <el-input v-model="readyTimeDate.dayChangePre" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                    </el-form-item>
                    <el-form-item label="生产后清场：" label-width="100px">
                        <el-input v-model="readyTimeDate.dayChangeAfter" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                    </el-form-item>
                </el-row>
                <el-row v-if="readyTimeDate.classes === '中班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
                    <el-form-item label="交接班（中班）：">
                        <el-input v-model="readyTimeDate.midChange" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                    </el-form-item>
                    <el-form-item label="班前会：" label-width="80px">
                        <el-input v-model="readyTimeDate.midChangeBefore" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                    </el-form-item>
                    <el-form-item label="生产前准备：" label-width="100px">
                        <el-input v-model="readyTimeDate.midChangePre" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                    </el-form-item>
                    <el-form-item label="生产后清场：" label-width="100px">
                        <el-input v-model="readyTimeDate.midChangeAfter" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                    </el-form-item>
                </el-row>
                <el-row v-if="readyTimeDate.classes === '夜班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
                    <el-form-item label="交接班（夜班）：">
                        <el-input v-model="readyTimeDate.nightChange" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                    </el-form-item>
                    <el-form-item label="班前会：" label-width="80px">
                        <el-input v-model="readyTimeDate.nightChangeBefore" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                    </el-form-item>
                    <el-form-item label="生产前准备：" label-width="100px">
                        <el-input v-model="readyTimeDate.nightChangePre" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                    </el-form-item>
                    <el-form-item label="生产后清场：" label-width="100px">
                        <el-input v-model="readyTimeDate.nightChangeAfter" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                    </el-form-item>
                </el-row>
            </mds-card>
        </el-form>
        <mds-card :title="'机器工时 (单位:min)'" :name="'machine'" :icon-bg="'#ffbf00'">
            <el-row :gutter="10" class="forColor">
                <el-col v-for="(item, index) in Machine" :key="index" :span="6" class="colorItem" style="margin-bottom: 15px;">
                    <div class="machineBox_item clearfix colorContainer">
                        <div class="clearfix machinediv">
                            <p class="machineBox_item_title">
                                <em class="iconfont factory-zhizaozhuisu" />{{ item.deviceName }}
                            </p>
                            <p class="machineBox_item_text">
                                点击下方开始按钮设备开始运转，<br>点击结束按钮设备停止工作。
                            </p>
                        </div>
                        <div style="float: right;">
                            <el-button class="machineBtn" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" @click="machineStartOrEnd(true, item)">
                                开始
                            </el-button>
                            <el-button class="machineBtn" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" @click="machineStartOrEnd(false, item)">
                                结束
                            </el-button>
                            <el-button class="machineBtn" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" @click="machineTest(item)">
                                检测
                            </el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-table class="newTable" :data="machineTimeData" header-row-class-name="tableHead" border tooltip-effect="dark" :row-class-name="RowDelFlag" style="margin-bottom: 10px;" @row-dblclick="rowUpdateMachine">
                <el-table-column label="日期" width="120" prop="productDate" />
                <el-table-column label="炒麦机" width="120" prop="deviceName" />
                <el-table-column label="开始时间" prop="openTime" />
                <el-table-column label="开始人" width="140" prop="openMan" />
                <el-table-column label="结束时间" prop="closeTime" />
                <el-table-column label="结束人" width="140" prop="closeMan" />
                <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" @click="delmachine(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log :table-data="timeAuditlog" :name="'audit1'" />
        <machine-time v-if="visible" ref="machinetime" @changeMachineTime="changeMachineTime" />
        <machine-test v-if="visible1" ref="machinetest" />
        <machineUpdate v-if="visible2" ref="machinetimeupdate" @updateRow="updateRow" />
    </div>
</template>

<script>
import { BASICDATA_API, WHT_API } from '@/api/api';
import MachineTime from './machineTime';
import MachineTest from './machineTest';
import MachineUpdate from './machineUpdate';
export default {
    name: 'ReadyTime',
    components: {
        MachineTime,
        MachineTest,
        MachineUpdate,
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    props: {
        isRedact: {
            type: Boolean
        },
        formHeader: {
            type: Object,
            default: function() { return {} }
        }
    },
    data() {
        return {
            orderId: '',
            visible: false,
            visible1: false,
            visible2: false,
            readyTimeDate: {
                id: '',
                status: '',
                classes: '多班',
                dayChange: '',
                dayChangeBefore: '',
                dayChangePre: '',
                dayChangeAfter: '',
                midChange: '',
                midChangeBefore: '',
                midChangePre: '',
                midChangeAfter: '',
                nightChange: '',
                nightChangeBefore: '',
                nightChangePre: '',
                nightChangeAfter: ''
            },
            Machine: [],
            rows: {},
            timeAuditlog: [],
            machineTimeData: []
        };
    },
    computed: {},
    watch: {
        'readyTimeDate.classes'(val) {
            if (val === '白班') {
                this.readyTimeDate.midChange = null;
                this.readyTimeDate.midChangeBefore = null;
                this.readyTimeDate.midChangePre = null;
                this.readyTimeDate.midChangeAfter = null;
                this.readyTimeDate.nightChange = null;
                this.readyTimeDate.nightChangeBefore = null;
                this.readyTimeDate.nightChangePre = null;
                this.readyTimeDate.nightChangeAfter = null;
            } else if (val === '中班') {
                this.readyTimeDate.dayChange = null;
                this.readyTimeDate.dayChangeBefore = null;
                this.readyTimeDate.dayChangePre = null;
                this.readyTimeDate.dayChangeAfter = null;
                this.readyTimeDate.nightChange = null;
                this.readyTimeDate.nightChangeBefore = null;
                this.readyTimeDate.nightChangePre = null;
                this.readyTimeDate.nightChangeAfter = null;
            } else if (val === '夜班') {
                this.readyTimeDate.dayChange = null;
                this.readyTimeDate.dayChangeBefore = null;
                this.readyTimeDate.dayChangePre = null;
                this.readyTimeDate.dayChangeAfter = null;
                this.readyTimeDate.midChange = null;
                this.readyTimeDate.midChangeBefore = null;
                this.readyTimeDate.midChangePre = null;
                this.readyTimeDate.midChangeAfter = null;
            }
        }
    },
    methods: {
        // 获取准备时间数据
        /* eslint-disable @typescript-eslint/camelcase */
        GetReadyList(id) {
            let status = '';
            this.$http(
                `${WHT_API.READYTIMELIST_API}`,
                'POST',
                {
                    order_id: id
                },
                false,
                false,
                false
            )
                .then(({ data }) => {
                    if (data.code === 0) {
                        if (data.listForm[0]) {
                            this.readyTimeDate = data.listForm[0];
                            status = data.listForm[0].status;
                        }
                        this.machineTimeData = data.listFormMachine;
                        this.timeAuditlog = data.listApproval;
                    } else {
                        this.$errorToast(data.msg);
                    }
                })
                .finally(() => {
                    this.$emit('SetReadyStatus', status);
                });
        },
        /* eslint-enable @typescript-eslint/camelcase */
        // 准备时间修改
        UpdateReady(str, resolve, reject) {
            this.readyTimeDate.orderId = this.formHeader.orderId;
            this.readyTimeDate.dayChange = this.readyTimeDate.dayChange || this.readyTimeDate.dayChange === 0 ? String(this.readyTimeDate.dayChange) : this.readyTimeDate.dayChange;
            this.readyTimeDate.dayChangeBefore = this.readyTimeDate.dayChangeBefore || this.readyTimeDate.dayChangeBefore === 0 ? String(this.readyTimeDate.dayChangeBefore) : this.readyTimeDate.dayChangeBefore;
            this.readyTimeDate.dayChangePre = this.readyTimeDate.dayChangePre || this.readyTimeDate.dayChangePre === 0 ? String(this.readyTimeDate.dayChangePre) : this.readyTimeDate.dayChangePre;
            this.readyTimeDate.dayChangeAfter = this.readyTimeDate.dayChangeAfter || this.readyTimeDate.dayChangeAfter === 0 ? String(this.readyTimeDate.dayChangeAfter) : this.readyTimeDate.dayChangeAfter;
            this.readyTimeDate.midChange = this.readyTimeDate.midChange || this.readyTimeDate.midChange === 0 ? String(this.readyTimeDate.midChange) : this.readyTimeDate.midChange;
            this.readyTimeDate.midChangeBefore = this.readyTimeDate.midChangeBefore || this.readyTimeDate.midChangeBefore === 0 ? String(this.readyTimeDate.midChangeBefore) : this.readyTimeDate.midChangeBefore;
            this.readyTimeDate.midChangePre = this.readyTimeDate.midChangePre || this.readyTimeDate.midChangePre === 0 ? String(this.readyTimeDate.midChangePre) : this.readyTimeDate.midChangePre;
            this.readyTimeDate.midChangeAfter = this.readyTimeDate.midChangeAfter || this.readyTimeDate.midChangeAfter === 0 ? String(this.readyTimeDate.midChangeAfter) : this.readyTimeDate.midChangeAfter;
            this.readyTimeDate.nightChange = this.readyTimeDate.nightChange || this.readyTimeDate.nightChange === 0 ? String(this.readyTimeDate.nightChange) : this.readyTimeDate.nightChange;
            this.readyTimeDate.nightChangeBefore = this.readyTimeDate.nightChangeBefore || this.readyTimeDate.nightChangeBefore === 0 ? String(this.readyTimeDate.nightChangeBefore) : this.readyTimeDate.nightChangeBefore;
            this.readyTimeDate.nightChangePre = this.readyTimeDate.nightChangePre || this.readyTimeDate.nightChangePre === 0 ? String(this.readyTimeDate.nightChangePre) : this.readyTimeDate.nightChangePre;
            this.readyTimeDate.nightChangeAfter = this.readyTimeDate.nightChangeAfter || this.readyTimeDate.nightChangeAfter === 0 ? String(this.readyTimeDate.nightChangeAfter) : this.readyTimeDate.nightChangeAfter;
            if (!this.readyTimeDate.status) {
                this.readyTimeDate.status = str;
            } else if (this.readyTimeDate.status === 'saved') {
                    this.readyTimeDate.status = str;
                } else if (this.readyTimeDate.status === 'noPass' && str === 'submit') {
                    this.readyTimeDate.status = str;
                }
            this.$http(`${WHT_API.READYTIMEUPDATE_API}`, 'POST', this.readyTimeDate)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$errorToast(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        // 机器工时修改
        UpdateMachine(str, resolve) {
            this.machineTimeData.forEach(item => {
                item.orderId = this.formHeader.orderId;
                if (item.status) {
                    if (item.status === 'saved') {
                        item.status = str;
                    } else if (item.status === 'noPass' && str === 'submit') {
                        item.status = str;
                    }
                } else {
                    item.status = str;
                }
            });
            this.$http(`${WHT_API.MACHINETIMEUPDATE_API}`, 'POST', this.machineTimeData).then(({ data }) => {
                if (data.code !== 0) {
                    this.$errorToast(data.msg);
                }
                if (resolve) {
                    resolve('resolve');
                }
            });
        },
        // 校验
        Readyrul() {
            let ty = true;
            const day =
                (this.readyTimeDate.dayChange || this.readyTimeDate.dayChange === 0) &&
                (this.readyTimeDate.dayChangeBefore || this.readyTimeDate.dayChangeBefore === 0) &&
                (this.readyTimeDate.dayChangePre || this.readyTimeDate.dayChangePre === 0) &&
                (this.readyTimeDate.dayChangeAfter || this.readyTimeDate.dayChangeAfter === 0);
            const mid =
                (this.readyTimeDate.midChange || this.readyTimeDate.midChange === 0) &&
                (this.readyTimeDate.midChangeBefore || this.readyTimeDate.midChangeBefore === 0) &&
                (this.readyTimeDate.midChangePre || this.readyTimeDate.midChangePre === 0) &&
                (this.readyTimeDate.midChangeAfter || this.readyTimeDate.midChangeAfter === 0);
            const night =
                (this.readyTimeDate.nightChange || this.readyTimeDate.nightChange === 0) &&
                (this.readyTimeDate.nightChangeBefore || this.readyTimeDate.nightChangeBefore === 0) &&
                (this.readyTimeDate.nightChangePre || this.readyTimeDate.nightChangePre === 0) &&
                (this.readyTimeDate.nightChangeAfter || this.readyTimeDate.nightChangeAfter === 0);
            if (this.readyTimeDate.classes === '白班') {
                if (day) {
                    //
                } else {
                    ty = false;
                    this.$warningToast('准备时间白班必填项未填写完全');
                    return false;
                }
            } else if (this.readyTimeDate.classes === '中班') {
                if (mid) {
                    //
                } else {
                    ty = false;
                    this.$warningToast('准备时间中班必填项未填写完全');
                    return false;
                }
            } else if (this.readyTimeDate.classes === '夜班') {
                if (night) {
                    //
                } else {
                    ty = false;
                    this.$warningToast('准备时间夜班必填项未填写完全');
                    return false;
                }
            } else if (this.readyTimeDate.classes === '多班') {
                if (day && night) {
                    //
                } else {
                    ty = false;
                    this.$warningToast('准备时间多班必填项未填写完全');
                    return false;
                }
            }
            // if (this.machineTimeData.length > 0) {
            if (this.machineTimeData.filter(item => item.delFlag === '0').length > 0) {
                this.machineTimeData.forEach((item) => {
                    if (!item.closeTime) {
                        ty = false;
                        this.$warningToast('机器工时没结束，请结束后提交');
                        return false;
                    }
                });
            } else {
                ty = false;
                this.$warningToast('机器工时为空数据');
                return false;
            }
            return ty;
        },
        // 机器列表双击
        rowUpdateMachine(row) {
            if (!(this.isRedact && (this.readyTimeDate.status === 'noPass' || this.readyTimeDate.status === 'saved' || this.readyTimeDate.status === ''))) {
                return false;
            }
            this.rows = row;
            this.visible2 = true;
            this.$nextTick(() => {
                this.$refs.machinetimeupdate.init(row);
            });
        },
        updateRow(row) {
            Object.keys(row).forEach(key => {
                this.rows[key] = row[key];
            });
            this.visible2 = false;
        },
        // 机器删除
        delmachine(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        //  RowDelFlag
        RowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        },
        // 炒麦机
        GetMachine(productLine) {
            this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
                param: '炒麦机',
                deptId: productLine,
                currPage: '1',
                pageSize: '50'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.Machine = data.list.list;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 开始结束按钮
        machineStartOrEnd(st, me) {
            let tmp = st;
            this.machineTimeData.forEach((item) => {
                if (item.deviceId === me.deviceId && item.openTime && !item.closeTime) {
                    if (st) {
                        tmp = false;
                        this.$warningToast('请结束后开始');
                    } else {
                        tmp = true;
                    }
                }
            });
            if (tmp) {
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs.machinetime.init(me, st);
                });
            } else if (!st && !tmp) {
                this.$warningToast('请开始后结束');
            }
        },
        // 检测
        machineTest(me) {
            this.visible1 = true;
            this.$nextTick(() => {
                this.$refs.machinetest.init(me, this.formHeader.orderId);
            });
        },
        // 更新机器工时
        changeMachineTime(date) {
            this.visible = false;
            if (date.endDate) {
                this.machineTimeData.forEach((item) => {
                    if (item.deviceId === date.deviceId && !item.closeTime) {
                        item.closeTime = date.endDate;
                        item.closeMan = date.changer;
                        item.closeOperateTime = '';
                        item.delFlag = '0';
                    }
                });
            } else if (date.startDate) {
                this.machineTimeData.push({
                    delFlag: '0',
                    id: '',
                    productDate: this.formHeader.productDate,
                    deviceName: date.deviceName,
                    deviceId: date.deviceId,
                    openTime: date.startDate,
                    openOperateTime: '',
                    openMan: date.changer,
                    closeTime: '',
                    closeOperateTime: '',
                    closeMan: ''
                });
            }
        }
    }
};
</script>

<style lang="scss">
@mixin ready-css($base-sise) {
    .box-card {
        .el-form-item__label {
            font-size: $base-sise;
        }
        .el-form-item {
            margin-bottom: 10px;
        }
    }
    .readyBox {
        .el-form-item {
            margin-bottom: 10px !important;
        }
        input {
            width: 153px;
        }
    }
    .readyshiftBtn {
        margin-left: 15px;
        padding: 0;
        line-height: 32px;
    }
    .machineBox {
        color: white;
        &_item {
            padding: 10px;
            border-radius: 8px;
            box-shadow: 2px 2px 4px 0 rgba(232, 232, 232, 1);
            &_title {
                margin-bottom: 5px;
                font-size: $base-sise + 2;
                em {
                    margin-right: 5px;
                }
            }
            &_text {
                margin-bottom: 5px;
                padding-left: 20px;
                font-size: $base-sise;
                line-height: 22px;
            }
        }
        .machineBtn {
            width: 65px;
            height: 32px;
            padding: 0;
            font-size: $base-sise;
            line-height: 32px;
        }
        .machineBtn:first-child {
            color: white;
            background-color: #487bff;
            border: none;
        }
    }
}

@media (max-width: 1600px) {
    $base-sise: 12px;

    @include ready-css($base-sise);
}

@media (min-width: 1600px) {
    $base-sise: 14px;

    @include ready-css($base-sise);
}
</style>
