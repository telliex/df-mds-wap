<!--生产入库-->
<template>
    <div>
        <!--数据录入-->
        <mds-card :title="'物料领用'" :name="'pwmateriel'">
            <template slot="titleBtn">
                <div class="btn" style="float: right; margin-bottom: 10px;">
                    <el-button type="primary" size="small" :disabled="!isRedact || appyMaterielState == 'submit' || appyMaterielState == 'checked'" @click="addNewRecord">
                        新增
                    </el-button>
                    <el-button type="primary" style="margin-left: 10px;" size="small" :disabled="!isRedact || !enableSubmit" @click="saveOrderMateriel">
                        申请订单
                    </el-button>
                </div>
                <el-form ref="form" label-width="100px" size="small" style="float: right; margin-right: 5px; margin-bottom: 10px;">
                    <el-form-item label="生产调度员：" style="margin-bottom: 0;">
                        <el-select v-model="dispatcherCode" size="small" value-key="dispatcherCode" placeholder="请选择生产调度员" :disabled="!isRedact || appyMaterielState == 'submit' || appyMaterielState == 'checked'">
                            <el-option v-for="(item, index) in dictListObj['PW_FEVOR']" :key="index" :label="item.code" :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </template>
            <el-row>
                <el-col :span="24">
                    <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :data="materielDataList" :row-class-name="rowDelFlag" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                        <el-table-column min-width="200">
                            <template slot="header">
                                <em class="reqI">*</em> 生产物料
                            </template>
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.productCode" value-key="productCode" placeholder="请选择生产物料" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" size="small" @change="changeProduct(scope.row)">
                                    <el-option v-for="(item, index) in dictListObj['CM_material_prd']" :key="index" :label="item.code + ' ' + item.value" :value="item.code" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="100" label="">
                            <template slot="header">
                                <em class="reqI">*</em> 生产数
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model.number="scope.row.productWeight" type="number" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" size="small" placeholder="手工录入" @input="changeProductWeight(scope.row)" />
                            </template>
                        </el-table-column>
                        <el-table-column width="60" label="单位">
                            <template slot-scope="scope">
                                {{ (scope.row.productUnit = 'KG') }}
                            </template>
                        </el-table-column>
                        <el-table-column min-width="200">
                            <template slot="header">
                                <em class="reqI">*</em> 发料料号
                            </template>
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.issueCode" value-key="issueCode" placeholder="请选择发料料号" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" size="small" @change="changeIssue(scope.row)">
                                    <el-option v-for="(item, index) in dictListObj['CM_material']" :key="index" :label="item.code + ' ' + item.value" :value="item.code" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="90" label="小麦数量">
                            <template slot-scope="scope">
                                {{ (scope.row.issueWeight = Number(scope.row.branWeight) + Number(scope.row.granuleWeight) + Number(scope.row.scrappedWeight) + Number(scope.row.inStorageWeight)) }}
                            </template>
                        </el-table-column>
                        <el-table-column min-width="100" label="麸皮">
                            <template slot-scope="scope">
                                <el-input v-model.number="scope.row.branWeight" type="number" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" size="small" placeholder="手工录入" />
                            </template>
                        </el-table-column>
                        <el-table-column min-width="100" label="小颗粒">
                            <template slot-scope="scope">
                                <el-input v-model.number="scope.row.granuleWeight" type="number" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" size="small" placeholder="手工录入" />
                            </template>
                        </el-table-column>
                        <el-table-column min-width="100" label="报废小麦">
                            <template slot-scope="scope">
                                <el-input v-model.number="scope.row.scrappedWeight" type="number" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" size="small" placeholder="手工录入" />
                            </template>
                        </el-table-column>
                        <el-table-column width="100" label="剩余量(KG)">
                            <template slot-scope="scope">
                                {{ scope.row.shengyu }}
                            </template>
                        </el-table-column>
                        <el-table-column min-width="130">
                            <template slot="header">
                                <em class="reqI">*</em> 发料批次
                            </template>
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.issueBatch" placeholder="请选择发料批次" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" size="small" @change="changeBatch(scope.row)">
                                    <el-option v-for="(item, index) in CangList" :key="index" :label="item.batch" :value="item.batch" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="100">
                            <template slot="header">
                                <em class="reqI">*</em> 入库数
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model.number="scope.row.inStorageWeight" type="number" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" size="small" placeholder="手工录入" />
                            </template>
                        </el-table-column>
                        <el-table-column width="140">
                            <template slot="header">
                                <em class="reqI">*</em> 入库批次
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.inStorageBatch" maxlength="10" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" size="small" placeholder="手工录入" />
                            </template>
                        </el-table-column>
                        <el-table-column min-width="100" label="库存数">
                            <template slot-scope="scope">
                                <el-input v-model.number="scope.row.storageWeight" type="number" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" size="small" placeholder="手工录入" />
                            </template>
                        </el-table-column>
                        <el-table-column min-width="120" label="备注">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" size="small" placeholder="手工录入" />
                            </template>
                        </el-table-column>
                        <el-table-column min-width="120" label="生产订单">
                            <template slot-scope="scope">
                                {{ scope.row.orderNo }}
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="70">
                            <template slot-scope="scope">
                                <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" @click="dellistbomS(scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </mds-card>
        <!--审批-->
        <el-row>
            <el-col :span="24">
                <audit-log :table-data="readAudit" :name="'audit1'" />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { WHT_API, SYSTEMSETUP_API } from '@/api/api';
import { dateFormat } from '@/net/validate';
// const DICT_PW_FEVOR = 'PW_FEVOR'
// const DICT_CM_material_prd = 'CM_material_prd'
// const DICT_CM_material = 'CM_material'
export default {
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    props: {
        isRedact: Boolean,
        appyMaterielState: {
            type: String,
            default: ''
        },
        order: {
            type: Object,
            default: function() { return {} }
        }
    },
    data() {
        return {
            dictListObj: {},
            dispatcherCode: '',
            // dispatcherName: '',
            materielDataList: [],
            readAudit: [],
            CangList: [],
            BatchTotal: []
        };
    },
    computed: {
        enableSubmit: function() {
            // 只有进来没订单号的请况下可以提交订单
            return typeof this.order === 'undefined' || typeof this.order.orderId === 'undefined' || this.order.orderId.trim().length === 0;
        }
    },
    watch: {
        'order.productDate'(n) {
            // 监听头部生产日期
            this.materielDataList.forEach(item => {
                if (item.status !== 'submit' && item.status !== 'checked') {
                    item.productDate = n;
                }
            });
        },
        dispatcherCode(n) {
            // 调度员切换
            this.materielDataList.forEach(item => {
                if (item.status !== 'submit' && item.status !== 'checked') {
                    item.dispatchMan = n;
                }
            });
        }
    },
    mounted() {
        // this.getDictList()
        // this.getMaterielDataList()
    },
    methods: {
        // 保存、提交 物料订单号校验
        saveAndSubmitRule(state) {
            if (this.materielDataList.length === 0) {
                this.$warningToast('请先新增订单');
                return false;
            }
            for (const item of this.materielDataList) {
                if (!item.orderNo || item.orderNo === '') {
                    this.$warningToast('生产订单号不能为空');
                    return false;
                }
            }
            if (state === 'submit') {
                for (const item of this.materielDataList) {
                    if (!item.inStorageBatch || item.inStorageBatch === '') {
                        this.$warningToast('入库批次不能为空');
                        return false;
                    }
                }
            }
            return true;
        },
        // 申请订单
        saveOrderMateriel() {
            if (this.materielDataList.length === 0) {
                this.$warningToast('请先新增订单');
                return false;
            }
            this.BatchTotal = [];
            for (const sole of this.materielDataList) {
                if (typeof this.BatchTotal.find(item => item === sole.issueBatch) === 'undefined') {
                    this.BatchTotal.push(sole.issueBatch);
                }
            }
            if (this.materielDataList.length > 0) {
                // 数据验证
                if (this.validate('apply')) {
                    let abc = 0;
                    this.BatchTotal.map(itemc => {
                        const shengyu = this.CangList.find(itema => itema.batch === itemc).currentQuantity;
                        let total = 0;
                        this.materielDataList.map(items => {
                            if (itemc === items.issueBatch) {
                                total += items.issueWeight;
                            }
                        });
                        if (total > shengyu) {
                            abc = 1;
                            this.$warningToast(itemc + '批次领取量不能大于剩余量');
                            return false;
                        }
                    });
                    if (abc === 1) {
                        return false;
                    }
                        for (const item of this.materielDataList) {
                            item.status = 'submit';
                            // item.productDate = this.order && this.order.productDate
                        }
                        this.$http(`${WHT_API.MATERIELSAVEORDER_API}`, 'POST', this.materielDataList)
                            .then(({ data }) => {
                                if (data.code === 0) {
                                    // 申请订单成功，订单号回写，触发全局刷新
                                    this.$emit('updateOrderInfo', {
                                        orderId: data.orderId,
                                        orderNo: data.orderNo
                                    });
                                } else {
                                    this.$notify.error({
                                        title: '错误',
                                        message: data.msg || '申请订单失败，请稍后尝试'
                                    });
                                }
                            })
                            .catch(error => {
                                console.log('catch data::', error);
                            });

                }
            }
        },
        // 保存/提交
        saveMateriel(resolve) {
            if (this.materielDataList.length > 0) {
                this.BatchTotal = [];
                for (const sole of this.materielDataList) {
                    if (typeof this.BatchTotal.find(item => item === sole.issueBatch) === 'undefined') {
                        this.BatchTotal.push(sole.issueBatch);
                    }
                }
                let abc = 0;
                this.BatchTotal.map(itemc => {
                    let shengyu = 0;
                    if (this.CangList.length !== 0) {
                        shengyu = this.CangList.find(itema => itema.batch === itemc).currentQuantity;
                    }
                    let total = 0;
                    this.materielDataList.map(items => {
                        if (itemc === items.issueBatch) {
                            total += items.issueWeight;
                        }
                    });
                    if (total > shengyu) {
                        abc = 1;
                        this.$warningToast('批次领取量不能大于剩余量');
                        return false;
                    }
                });
                if (abc === 1) {
                    return false;
                }
                    this.materielDataList.forEach(item => {
                        // 应产品要求，如果对不通过数据做修改保存操作，页签状态还是未通过，故此处不做状态赋值。
                        // if (item.status !== 'submit' || item.status !== 'checked') {
                        //   item.status = 'saved'
                        // }
                        // 新增行赋值saved
                        if (typeof item.status === 'undefined' || item.status === null || item.status.trim() === '') {
                            item.status = 'saved';
                        }
                    });
                    this.$http(WHT_API.MATERIELSAVE_API, 'POST', this.materielDataList)
                        .then(({ data }) => {
                            if (data.code !== 0) {
                                this.$errorToast(data.msg);
                            }
                            if (resolve) {
                                resolve('resolve');
                            }
                        })
                        .catch(error => {
                            console.log('catch data::', error);
                        });

            } else if (resolve) {
                    resolve('resolve');
                }
        },
        submitMateriel(resolve) {
            if (this.materielDataList.length > 0) {
                this.materielDataList.forEach(item => {
                    if (item.status !== 'checked') {
                        item.status = 'submit';
                    }
                });
                this.$http(WHT_API.MATERIELSUBMIT_API, 'POST', this.materielDataList)
                    .then(({ data }) => {
                        if (data.code !== 0) {
                            this.$errorToast(data.msg);
                        }
                        if (resolve) {
                            resolve('resolve');
                        }
                    })
                    .catch(error => {
                        console.log('catch data::', error);
                    });
            } else if (resolve) {
                    resolve('resolve');
                }
        },
        validate(flag) {
            for (const item of this.materielDataList) {
                if (item.delFlag === '0') {
                    if (item.dispatchMan === null || item.dispatchMan.trim() === '') {
                        this.$warningToast('生产调度员不能为空');
                        return false;
                    }
                    if (item.productCode === null || item.productCode.trim() === '') {
                        this.$warningToast('生产物料不能为空');
                        return false;
                    }
                    if (item.issueCode === null || item.issueCode.trim() === '') {
                        this.$warningToast('发料料号不能为空');
                        return false;
                    }
                    if (item.productWeight === '') {
                        this.$warningToast('生产数不能为空');
                        return false;
                    }
                    if (item.issueBatch === null || item.issueBatch.trim() === '') {
                        this.$warningToast('发料批次不能为空');
                        return false;
                    }
                    if (item.issueBatch.trim().length > 10) {
                        this.$warningToast('发料批次长度不能超过10');
                        return false;
                    }
                    if (item.inStorageWeight === '') {
                        this.$warningToast('入库数不能为空');
                        return false;
                    }
                    if (flag && flag === 'submit') {
                        // 提交的时候验证，申请订单不验证
                        if (item.inStorageBatch === null || item.inStorageBatch.trim() === '') {
                            this.$warningToast('入库批次不能为空');
                            return false;
                        }
                    }
                    if (item.inStorageBatch && item.inStorageBatch.trim().length > 10) {
                        this.$warningToast('入库批次长度不能超过10');
                        return false;
                    }
                }
            }
            return true;
        },
        getDictList(factory) {
            // CM_material 发料物料 CM_material_prd 生产物料 PW_FEVOR  生产调度员
            this.dictListObj = {};
            const params = {
                types: ['PW_FEVOR', 'CM_material_prd', 'CM_material'],
                factory
            };
            this.$http(`${SYSTEMSETUP_API.PARAMETERSLIST_API}`, 'POST', params)
                .then(({ data }) => {
                    if (data.code === 0) {
                        for (const dict of data.dicList) {
                            this.$set(this.dictListObj, dict.shname, dict.prolist);
                        }
                        if (this.dictListObj['PW_FEVOR'].length > 0) {
                            this.dispatcherCode = this.dictListObj['PW_FEVOR'][0].code;
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                })
                .catch(error => {
                    console.log('catch data::', error);
                });
        },
        getMaterielDataList(orderId) {
            this.materielDataList = [];
            this.readAudit = [];
            let inState = '';
            this.$http(`${WHT_API.MATERIELLIST_API}`, 'POST', { orderId }, false, false, false)
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.materielDataList = data.wlist;
                        this.readAudit = data.vrlist;
                        let no = 0;
                        let sub = 0;
                        let che = 0;
                        let sav = 0;
                        this.materielDataList.forEach(item => {
                            const shengyu = this.CangList.find(itema => itema.batch === item.issueBatch);
                            if (typeof shengyu === 'undefined') {
                                item.shengyu = 0;
                            } else {
                                item.shengyu = shengyu.currentQuantity;
                            }
                            if (item.status === 'noPass') {
                                no = no + 1;
                            } else if (item.status === 'submit') {
                                sub = sub + 1;
                            } else if (item.status === 'checked') {
                                che = che + 1;
                            } else if (item.status === 'saved') {
                                sav = sav + 1;
                            }
                        });
                        if (no > 0) {
                            inState = 'noPass';
                        } else if (sub > 0) {
                            inState = 'submit';
                        } else if (sav > 0) {
                            inState = 'saved';
                        } else if (che > 0) {
                            inState = 'checked';
                        }
                        // this.$emit('setAppyMaterielState', inState)
                    } else {
                        this.$errorToast(data.msg);
                    }
                })
                .catch(error => {
                    console.log('catch data::', error);
                })
                .finally(() => {
                    this.$emit('setAppyMaterielState', inState);
                });
        },
        // 新增记录
        addNewRecord() {
            const lastArr = this.materielDataList.filter(item => {
                return item.delFlag === '0';
            });
            const last = lastArr && lastArr.length > 0 ? lastArr[lastArr.length - 1] : null;
            const nowStr = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            const user = this.$store.state.user.realName;
            this.materielDataList.push({
                branWeight: last ? last.branWeight : 0,
                delFlag: '0',
                dispatchMan: this.dispatcherCode,
                gmCode: '02',
                // 小颗粒
                granuleWeight: last ? last.granuleWeight : 0,
                inStorageBatch: last ? last.inStorageBatch : '',
                inStorageWeight: last ? last.inStorageWeight : 0,
                // 发料批次
                issueBatch: last ? last.issueBatch : '',
                issueCode: last ? last.issueCode : '',
                issueName: last ? last.issueName : '',
                // 发料数量
                issueWeight: last ? last.issueWeight : 0,
                productCode: last ? last.productCode : '',
                productName: last ? last.productName : '',
                productUnit: 'KG',
                productWeight: last ? last.productWeight : 0,
                remark: last ? last.remark : '',
                scrappedWeight: last ? last.scrappedWeight : 0,
                storageWeight: last ? last.storageWeight : 0,
                // this.order && this.order.productDate
                productDate: this.order && this.order.productDate,
                // this.order && this.order.factory
                factory: this.order && this.order.factory,
                // this.order && this.order.workShop
                workShop: this.order && this.order.workShop,
                // this.order && this.order.productLine
                productLine: this.order && this.order.productLine,
                created: nowStr,
                creator: user,
                changed: nowStr,
                changer: user,
                // 申请订单之后订单号回写，再次新增，订单号带过来
                orderId: this.order && this.order.orderId,
                orderNo: this.order && this.order.orderNo,
                shengyu: last ? last.shengyu : 0
            });
        },
        // 删除
        dellistbomS(row) {
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
        rowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        },
        changeProductWeight: function(row) {
            for (const item of this.materielDataList) {
                if (item.recordId === row.recordId) {
                    item.inStorageWeight = item.productWeight;
                }
            }
        },
        // changeDispatcher: function () {
        //   let dispatcher = this.dictListObj['PW_FEVOR'].find((item) => item.code === this.dispatcherCode)
        //   if (dispatcher) {
        //     this.dispatcherName = dispatcher.name
        //   }
        // },
        changeProduct: function(row) {
            const product = this.dictListObj['CM_material_prd'].find(item => item.code === row.productCode);
            if (product) {
                row.productName = product.value;
            }
        },
        changeIssue: function(row) {
            const issue = this.dictListObj['CM_material'].find(item => item.code === row.issueCode);
            if (issue) {
                row.issueName = issue.value;
            }
        },
        // 获取粮仓
        GetWheatCangList(factory, workShop) {
            this.$http(`${WHT_API.WHEATCANGLIST_API}`, 'POST', {
                factory: factory,
                workShop: workShop
            }).then(({ data }) => {
                if (data.holder) {
                    data.holder.map(item => {
                        item.wheatData.map(items => {
                            if (typeof this.CangList.find(itema => itema.batch === items.batch) === 'undefined') {
                                this.CangList.push(items);
                            }
                        });
                    });
                }
            });
        },
        changeBatch(row) {
            row.shengyu = this.CangList.find(item => item.batch === row.issueBatch).currentQuantity;
        }
    }
};
</script>

<style lang="scss"></style>
