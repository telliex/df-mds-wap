<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-row>
                <el-col :span="24">
                    <el-form :inline="true" :model="form" size="small" label-width="70px" class="multi_row">
                        <el-form-item label="生产工厂：">
                            <el-select v-model="form.factory" placeholder="请选择" class="width160px">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) in factory" :key="index" :value="item.deptId" :label="item.deptName" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <el-select v-model="form.workShop" placeholder="请选择" class="width160px">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) in workshop" :key="index" :value="item.deptId" :label="item.deptName" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态：">
                            <el-select v-model="form.frozenStatus" class="width160px">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) of statusList" :key="index" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发酵罐：">
                            <el-select v-model="form.holderId" filterable class="width160px">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) of holderList" :key="index" :label="item.holderName" :value="item.holderId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单编号：">
                            <el-input v-model="form.orderNo" style="width: 160px;" />
                        </el-form-item>
                        <el-form-item label="物料：">
                            <el-select v-model="form.materialCode" filterable class="width160px">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) of materialList" :key="index" :value="item.materialCode" :label="item.materialName + item.materialCode" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发酵天数：">
                            <el-input v-model="form.ferDays" class="width160px" style="width: 160px;" />
                        </el-form-item>
                        <el-form-item label="物料类别：">
                            <el-select v-model="form.halfId" filterable class="width160px">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) of materialTypeList" :key="index" :value="item.id" :label="item.halfName" />
                            </el-select>
                        </el-form-item>
                        <el-form-item class="floatr">
                            <el-button v-if="isAuth('fer:judge:list')" type="primary" size="small" style="float: right;" @click="GetList()">
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <mds-card title="类别判断" :name="'categoryjudgement'" style="margin-top: 5px;">
            <el-table :data="dataList" class="newTable" border header-row-class-name="tableHead">
                <el-table-column label="状态" min-width="55">
                    <template slot-scope="scope">
                        <!-- {{scope.row.judge}} -->
                        {{ scope.row.judge ? (scope.row.judge.frozenStatus === '0' ? '正常' : '冻结') : '' }}
                    </template>
                </el-table-column>
                <el-table-column label="发酵罐" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.order.holderName }}
                    </template>
                </el-table-column>
                <el-table-column label="订单号" min-width="120">
                    <template slot-scope="scope">
                        {{ scope.row.order.ferOrderNo }}
                    </template>
                </el-table-column>
                <el-table-column label="物料" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.order.ferMaterialCode }}{{ scope.row.order.ferMaterialName }}
                    </template>
                </el-table-column>
                <el-table-column label="订单数量">
                    <template slot-scope="scope">
                        {{ scope.row.order.ferAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="满灌日期" min-width="165">
                    <template slot-scope="scope">
                        {{ scope.row.order.fullDate }}
                    </template>
                </el-table-column>
                <el-table-column label="发酵天数">
                    <template slot-scope="scope">
                        {{ scope.row.order.ferDays }}
                    </template>
                </el-table-column>
                <el-table-column label="物料类别">
                    <template slot-scope="scope">
                        {{ scope.row.judge ? scope.row.judge.halfName : '' }}
                    </template>
                </el-table-column>
                <el-table-column label="判定人员" min-width="140">
                    <template slot-scope="scope">
                        {{ scope.row.judge ? scope.row.judge.creator : '' }}
                    </template>
                </el-table-column>
                <el-table-column label="判定时间" min-width="165">
                    <template slot-scope="scope">
                        {{ scope.row.judge ? scope.row.judge.created : '' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" :disabled="!isAuth('fer:judge:judge')" @click="JudgeDo(scope.row)">
                            调整
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :current-page="form.currPage" :page-sizes="[10, 20, 50]" :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="form.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </mds-card>
        <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="400px" custom-class="dialog__class">
            <div slot="title">
                类别判定
            </div>
            <el-form ref="judge" :model="judge" size="small" label-width="130px" :rules="judgerules">
                <el-form-item label="订单编号：">
                    {{ judge.ferOrderNo }}
                </el-form-item>
                <el-form-item label="物料：">
                    {{ judge.ferMaterialCode }}{{ judge.ferMaterialName }}
                </el-form-item>
                <el-form-item label="发酵天数：">
                    {{ judge.ferDays }} 天
                </el-form-item>
                <el-form-item label="半成品类别：">
                    <el-select v-model="judge.halfId" filterable class="selectwidth">
                        <el-option v-for="(item, index) of materialTypeList" :key="index" :value="item.id" :label="item.halfName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-radio v-model="judge.frozenStatus" label="0">
                        正常
                    </el-radio>
                    <el-radio v-model="judge.frozenStatus" label="1">
                        冻结
                    </el-radio>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="judge.remark" type="textarea" :rows="2" style="width: 199px;" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="SaveJudge('judge')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { dateFormat, deepClone } from '@/net/validate';
import { BASICDATA_API, FERMENTATION_API } from '@/api/api';
export default {
    name: 'CategroyJudgement',
    data() {
        return {
            dialogVisible: false,
            radio: '1',
            // form: JSON.parse(JSON.stringify(this.$store.state.common.Fermentation.category)),
            form: {
                factory: this.$store.state.common.Fermentation.category.factory,
                workShop: this.$store.state.common.Fermentation.category.workShop,
                frozenStatus: this.$store.state.common.Fermentation.category.frozenStatus,
                holderId: this.$store.state.common.Fermentation.category.holderId,
                orderNo: this.$store.state.common.Fermentation.category.orderNo,
                materialCode: this.$store.state.common.Fermentation.category.materialCode,
                ferDays: this.$store.state.common.Fermentation.category.ferDays,
                halfId: this.$store.state.common.Fermentation.category.halfId,
                currPage: 1,
                pageSize: 10,
                totalCount: 0,
                isJudged: '1'
            },
            factory: '',
            workshop: '',
            statusList: [
                {
                    name: '正常',
                    value: 0
                },
                {
                    name: '冻结',
                    value: 1
                }
            ],
            dataList: [],
            judge: {
                frozenStatus: '0',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
            },
            materialList: [],
            materialTypeList: [],
            materialTypeListTan: [],
            holderList: [],
            judgerules: {
                halfId: [
                    {
                        required: true,
                        message: '请选择判定类别',
                        trigger: 'change'
                    }
                ]
            },
            beforeHalfId: '',
            beforeFrozenStatus: ''
        };
    },
    watch: {
        'form.factory'(n) {
            this.GetWorkshopList(n);
            this.GetHolderList(n);
            this.GetMaterialType(n);
            this.GetMaterialTypeList(n);
        },
        'form.workShop'(n) {
            this.GetHolderList(n);
        }
    },
    mounted() {
        this.GetFactoryList();
        this.GetWorkshopList(this.form.factory);
        this.GetHolderList();
        this.GetMaterialType(this.form.factory);
        this.GetMaterialTypeList(this.form.factory);
        if (this.form.factory) {
            this.GetList();
        }
    },
    methods: {
        // 获取工厂
        GetFactoryList() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    if (!this.form.factory) {
                        this.form.factory = this.factory[0].deptId;
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        GetWorkshopList(id) {
            if (id) {
                if (this.$store.state.common.Fermentation.category.workShop === '') {
                    this.form.workShop = '';
                }
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '发酵' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (data.typeList.length > 0) {
                            this.workshop = data.typeList;
                            if (this.$store.state.common.Fermentation.category.workShop === '') {
                                this.form.workShop = data.typeList[0].deptId;
                            }
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.workshop = [];
            }
        },
        // 罐
        GetHolderList() {
            this.$http(`${FERMENTATION_API.CATEGORYJUDGEMENT_API}`, 'POST', { factory: this.form.factory, deptId: this.form.workShop }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.holderList = data.data;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 物料
        GetMaterialType(id) {
            this.$http(`${BASICDATA_API.BASEMATERIALIST_API}`, 'POST', { factory: id }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.materialList = data.materialList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 物料类别
        GetMaterialTypeList(id) {
            this.$http(`${BASICDATA_API.CATEGORY_SORTLIST}`, 'POST', { factory: id }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.materialTypeList = data.ferList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 弹框物料类别
        GetMaterialTypeListTan() {
            this.$http(
                `${BASICDATA_API.CATEGORY_SORTLIST}`,
                'POST',
                {
                    factory: this.form.factory,
                    materialCode: this.judge.ferMaterialCode
                },
                false,
                false,
                false
            ).then(({ data }) => {
                if (data.code === 0) {
                    this.materialTypeList = data.ferList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        GetList() {
            this.$http(`${FERMENTATION_API.CATEGORYJUDGEMENTLIST_API}`, 'POST', this.form).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.data.list;
                    this.form.totalCount = data.data.totalCount;
                    this.$store.state.common.Fermentation.category.factory = '';
                    this.$store.state.common.Fermentation.category.workShop = '';
                    this.$store.state.common.Fermentation.category.holderId = '';
                    this.$store.state.common.Fermentation.category.orderNo = '';
                    this.$store.state.common.Fermentation.category.materialCode = '';
                    this.$store.state.common.Fermentation.category.ferDays = '';
                    this.$store.state.common.Fermentation.category.halfId = '';
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.form.pageSize = val;
            this.GetList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.form.currPage = val;
            this.GetList();
        },
        // tabClick (value) {
        //   this.form.isJudged = value.name
        //   this.form.currPage = 1
        //   this.GetList()
        // },
        // 判定
        JudgeDo(row) {
            this.dialogVisible = true;
            // let halfIds = this.materialTypeList.find(item => item.halfName === '味极鲜')[id]
            let defaulthalfId = '';
            if (this.materialTypeList.find(item => item.halfName === '味极鲜')) {
                defaulthalfId = this.materialTypeList.find(item => item.halfName === '味极鲜').id;
            }
            this.judge = {
                id: row.judge.id,
                factory: this.form.factory,
                workShop: this.form.workShop,
                frozenStatus: row.judge ? row.judge.frozenStatus : '0',
                orderId: row.order.id,
                orderNo: row.order.ferOrderNo,
                ferOrderNo: row.order.ferOrderNo,
                ferMaterialCode: row.order.ferMaterialCode,
                ferMaterialName: row.order.ferMaterialName,
                ferDays: row.order.ferDays,
                holderNo: row.order.holderNo,
                halfId: row.judge ? row.judge.halfId : defaulthalfId,
                orderEndDate: row.judge.orderEndDate,
                oldCategory: JSON.parse(JSON.stringify(row.judge.halfName)),
                remark: row.judge.remark,
                isChange: '0'
            };
            this.beforeHalfId = JSON.parse(JSON.stringify(row.judge.halfId));
            this.beforeFrozenStatus = JSON.parse(JSON.stringify(row.judge.frozenStatus));
            this.beforeRemark = deepClone(row.judge.remark);
            this.GetMaterialTypeListTan();
        },
        SaveJudge(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.beforeHalfId === this.judge.halfId && this.beforeFrozenStatus === this.judge.frozenStatus && this.beforeRemark === this.judge.remark) {
                        this.$warningToast('没有数据变更，无法保存');
                        return false;
                    } else if (this.beforeHalfId === this.judge.halfId && this.beforeFrozenStatus === this.judge.frozenStatus) {
                        this.judge.isChange = '1';
                    }
                    this.dialogVisible = false;
                    this.$http(`${FERMENTATION_API.CATEGORYJUDGEMENTTODO_API}`, 'POST', this.judge).then(({ data }) => {
                        if (data.code === 0) {
                            this.$successToast('调整成功');
                            this.GetList();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="scss">
.width160px {
    width: 160px;
}
.dialog__class {
    border-radius: 6px !important;
    .el-dialog__header {
        height: 59px;
        color: #fff;
        font-size: 20px;
        background: rgba(24, 144, 255, 1);
        border-radius: 6px 6px 0 0;
        .el-dialog__headerbtn .el-dialog__close {
            color: #fff;
        }
    }
}
</style>
