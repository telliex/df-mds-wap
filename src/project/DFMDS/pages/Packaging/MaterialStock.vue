<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="pkgPackQuery"
            :factory-type="1"
            :query-form-data="queryFormData"
            :show-table="true"
            :column="column"
            :list-interface="listInterface"
            :custom-data="true"
            :show-operation-column="true"
            :operation-column-width="190"
            :not-clear-page="true"
            :show-fold="false"
        >
            <template slot="tab-head-main">
                <div class="box-card-title clearfix">
                    <h3> <em class="title-icon" />包材列表 </h3>
                </div>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button v-if="isAuth('')" class="ra_btn" type="text" round size="mini" style="margin-left: 0;" @click="returnMaterial(scope.row)">
                    退料
                </el-button>
                <el-button v-if="isAuth('pkgPackQuery')" class="ra_btn" type="text" round size="mini" style="margin-left: 0;" @click="getDetailLog(scope.row, true)">
                    明细
                </el-button>
                <el-button v-if="isAuth('pkgPackTrans')" class="ra_btn" type="text" round size="mini" style="margin-left: 0;" @click="changeTransferLine(scope.row)">
                    转线
                </el-button>
                <el-button v-if="isAuth('pkgPackAdjust')" class="ra_btn" type="text" round size="mini" style="margin-left: 0;" @click="doAdjust(scope.row)">
                    调整
                </el-button>
            </template>
        </query-table>
        <el-dialog title="物料移动明细" width="1300px" :close-on-click-modal="false" :visible.sync="visibleDetailLog">
            <div>
                <el-form :model="moveDetailForm" inline label-suffix="：" label-width="100px" size="small">
                    <el-form-item label="调整类型" prop="moveType">
                        <el-select v-model="moveDetailForm.moveType" clearable>
                            <!-- <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" /> -->
                            <el-option v-for="(item, index) in moveTypeList" :key="index" :label="item.dictValue" :value="item.dictCode" />
                        </el-select>
                    </el-form-item>
                    <el-form-item style="float: right;">
                        <el-button type="primary" @click="getDetailLog(row, true)">
                            查询
                        </el-button>
                    </el-form-item>
                </el-form>
                <el-table header-row-class-name="" :data="detaileLogData" border tooltip-effect="dark" class="newTable">
                    <el-table-column type="index" label="序号" width="55" align="center" fixed />
                    <el-table-column label="包材物料" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="moveUnit" width="60" />
                    <el-table-column label="数量" prop="moveAmount" show-overflow-tooltip width="80" />
                    <el-table-column label="批次" prop="batch" width="110" />
                    <el-table-column label="厂家" prop="manufactor" width="110" />
                    <el-table-column label="移动类型" prop="moveType" width="80" show-overflow-tooltip />
                    <el-table-column label="订单" prop="orderNo" width="120" />
                    <el-table-column label="线别" prop="productLineName" show-overflow-tooltip width="140" />
                    <el-table-column label="操作人" prop="changer" width="140" />
                    <el-table-column label="操作时间" prop="changed" width="160" />
                </el-table>
                <el-row v-if="detaileLogData.length !== 0">
                    <el-pagination :current-page="current" :page-sizes="[10, 20, 50]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" style="margin-bottom: 15px;" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </div>
        </el-dialog>
        <el-dialog title="转线" :close-on-click-modal="false" :visible.sync="visibleTransferLine" width="600px" custom-class="dialog__class">
            <div>
                <el-form ref="transferForm" :model="transferForm" :rules="transferFormRules" label-width="100px" size="small">
                    <el-form-item label="转出线：">
                        <p class="disabled-text" style="width: 380px;">
                            {{ transferForm.productLineOutName }}
                        </p>
                    </el-form-item>
                    <el-form-item label="包材物料：">
                        <p class="disabled-text" style="width: 380px;">
                            {{ transferForm.materialCode + ' ' + transferForm.materialName }}
                        </p>
                    </el-form-item>
                    <el-form-item label="批次：">
                        <el-input v-model="transferForm.batch" type="text" maxlength="10" style="width: 380px;" disabled />
                    </el-form-item>
                    <el-form-item label="模具号：">
                        <el-input v-model="transferForm.mouldCode" type="text" maxlength="10" style="width: 380px;" disabled />
                    </el-form-item>
                    <el-form-item label="厂家：">
                        <el-input v-model="transferForm.manufactor" type="text" style="width: 380px;" disabled />
                    </el-form-item>
                    <el-form-item label="当前库存：">
                        <p class="disabled-text" style="width: 380px;">
                            {{ transferForm.storageAmount = Number(amout) - Number(transferForm.amount) }}
                        </p>
                    </el-form-item>
                    <el-form-item label="转入线：" prop="productLineIn">
                        <el-select v-model="transferForm.productLineIn" filterable placeholder="请选择" style="width: 380px;">
                            <el-option v-for="(item, index) in productlineListFilter" :key="index" :label="item.deptName" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数量：" prop="amount">
                        <el-input v-model="transferForm.amount" type="number" style="width: 380px;" />
                    </el-form-item>
                    <el-form-item label="单位：" prop="storageUnit">
                        <p class="disabled-text" style="width: 380px;">
                            {{ transferForm.storageUnit }}
                        </p>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="transferForm.remark" type="text" style="width: 380px;" />
                    </el-form-item>
                    <el-form-item label="操作人：">
                        <p class="disabled-text" style="width: 380px;">
                            {{ transferForm.changer }}
                        </p>
                    </el-form-item>
                    <el-form-item label="操作时间：">
                        <p class="disabled-text" style="width: 380px;">
                            {{ transferForm.changed }}
                        </p>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" style="color: #000; background-color: #fff; border-color: #d9d9d9;" @click="cannalsaveTransferLine('transferForm')">
                    取消
                </el-button>
                <el-button type="primary" size="small" style=" color: #fff; background-color: #1890ff; border-color: #1890ff;" @click="saveTransferLine('transferForm')">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="调整" :close-on-click-modal="false" :visible.sync="visibleAdjust" width="600px" custom-class="dialog__class">
            <div>
                <el-form ref="adjustForm" :model="adjustForm" :rules="adjustFormRules" label-width="100px" size="small">
                    <el-form-item label="包材物料：">
                        <p class="disabled-text" style="width: 380px;">
                            {{ adjustForm.materialCode + ' ' + adjustForm.materialName }}
                        </p>
                    </el-form-item>
                    <el-form-item label="批次：">
                        <el-input v-model="adjustForm.batch" type="text" maxlength="10" style="width: 380px;" disabled />
                    </el-form-item>
                    <el-form-item label="模具号：">
                        <el-input v-model="adjustForm.mouldCode" type="text" maxlength="10" style="width: 380px;" disabled />
                    </el-form-item>
                    <el-form-item label="厂家：">
                        <el-input v-model="adjustForm.manufactor" type="text" style="width: 380px;" disabled />
                    </el-form-item>
                    <el-form-item label="当前库存：">
                        <p class="disabled-text" style="width: 380px;">
                            {{ adjustForm.storageAmount = adjustForm.moveType === 'INVENTORY_PROFIT'? Number(amout) + Number(adjustForm.amount) : Number(amout) - Number(adjustForm.amount) }}
                        </p>
                    </el-form-item>
                    <el-form-item label="调整类型：" prop="moveType">
                        <el-select v-model="adjustForm.moveType" filterable placeholder="请选择" style="width: 380px;">
                            <!-- <el-option v-for="(item, index) in moveTypeList" :key="index" :label="item.dictValue" :value="item.dictCode" /> -->
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="调整量：" prop="amount">
                        <el-input v-model="adjustForm.amount" type="number" style="width: 380px;" />
                    </el-form-item>
                    <el-form-item label="单位：" prop="storageUnit">
                        <p class="disabled-text" style="width: 380px;">
                            {{ adjustForm.storageUnit }}
                        </p>
                    </el-form-item>
                    <el-form-item label="说明：">
                        <el-input v-model="adjustForm.remark" type="text" style="width: 380px;" />
                    </el-form-item>
                    <el-form-item label="操作人：">
                        <p class="disabled-text" style="width: 380px;">
                            {{ adjustForm.changer }}
                        </p>
                    </el-form-item>
                    <el-form-item label="操作时间：">
                        <p class="disabled-text" style="width: 380px;">
                            {{ adjustForm.changed }}
                        </p>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" style="color: #000; background-color: #fff; border-color: #d9d9d9;" @click="cannalsaveAdjustForm('adjustForm')">
                    取消
                </el-button>
                <el-button type="primary" size="small" style=" color: #fff; background-color: #1890ff; border-color: #1890ff;" @click="saveAdjustForm('adjustForm')">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API, PKG_API } from 'common/api/api';
import { dateFormat, getUserNameNumber } from 'utils/utils';

@Component
export default class MaterialStock extends Vue {
    $refs: {
        transferForm: HTMLFormElement;
        queryTable: HTMLFormElement;
        adjustForm: HTMLFormElement;
    };

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
            width: '220',
            prop: 'productLine',
            defaultValue: '',
            filterable: true,
            optionsFn: val => {
                return COMMON_API.ORG_QUERY_CHILDREN_API({
                    parentId: val || '',
                    deptType: 'PRODUCT_LINE'
                });
            },
            resVal: {
                resData: 'data',
                label: ['deptName'],
                value: 'id'
            }
        },
        {
            type: 'select',
            label: '包材物料',
            prop: 'material',
            defaultValue: '',
            filterable: true,
            defaultOptionsFn: () => {
                return COMMON_API.SEARCH_MATERIAL_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    materialType: 'ZVER'
                });
            },
            resVal: {
                resData: 'data',
                label: ['materialName', 'materialCode'],
                value: 'materialCode'
            }
        }
    ];

    column = [
        {
            label: '生产产线',
            prop: 'productLineName',
            minwidth: '160'
        },
        {
            label: '包材物料',
            prop: 'materialName',
            formatter: row => {
                return row.materialName + ' ' + row.materialCode;
            },
            minwidth: '270'
        },
        {
            label: '单位',
            prop: 'storageUnit',
            minwidth: '60'
        },
        {
            label: '库存数量',
            prop: 'storageAmount'
        },
        {
            label: '批次',
            prop: 'batch',
            minwidth: '110'
        },
        {
            label: '厂家',
            prop: 'manufactor',
            minwidth: '140',
            formatter: row => {
                return row.manufactorName + ' ' + row.manufactor;
            }
        },
        {
            label: '模具号',
            prop: 'mouldCode',
            minwidth: '110'
        },
        {
            label: '操作人',
            prop: 'changer',
            minwidth: '140'
        },
        {
            label: '操作时间',
            prop: 'changed',
            minwidth: '160'
        }
    ];

    moveDetailForm = {
        moveType: ''
    };

    // 调整类型下拉
    typeOptions: TypeOptionList[] = [
        { value: 'INVENTORY_PROFIT', label: '盘盈' },
        { value: 'INVENTORY_LOSSES', label: '盘亏' }
    ];

    transferFormRules = {
        amount: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        storageUnit: [{ required: true, message: '请选择单位', trigger: 'change' }],
        productLineIn: [{ required: true, message: '请选择转入线', trigger: 'change' }]
    };

    adjustFormRules = {
        moveType: [{ required: true, message: '请选择调整类型', trigger: 'change' }],
        amount: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        storageUnit: [{ required: true, message: '请选择单位', trigger: 'change' }]
    };

    productlineList = [];
    productlineListFilter = [];
    moveTypeList = [];
    row = {};
    visibleDetailLog = false; // 明细弹窗
    detaileLogData = [];
    current = 1;
    size = 10;
    total = 0;
    visibleTransferLine = false; // 转线弹窗
    transferForm = {};
    visibleAdjust = false; // 调整弹窗
    adjustForm = {};

    amout = 0;
    storageUnitCode = '';

    mounted() {
        // this.getProductline();
        this.getMoveType();
        // this.$nextTick(() => {
        //     this.$refs.queryTable.getDataList(true)
        // })
    }

    // updated() {
    //     this.$refs.queryTable.getDataList(true)
    // }
    // createdEnd() {
    // }

    // // 拉取所有产线
    // getProductline() {
    //     PKG_API.PKG_MATERIALSTOCK_TRANSFERDEPTNAME_API({
    //         factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
    //         deptType: ['PRODUCT_LINE'],
    //         deptName: '包装'
    //     }).then(({ data }) => {
    //         this.productlineList = data.data
    //     });
    // }

    // 调整类型
    getMoveType() {
        COMMON_API.DICTQUERY_API({ dictType: 'COMMON_ADJUST_TYPE' }).then(({ data }) => {
            this.moveTypeList = data.data;
        });
    }

    // 查询
    listInterface(params) {
        params['factory'] = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        return PKG_API.PKG_MATERIALSTOCK_QUERY_API(params);
    }

    returnMaterial(row) {
        this.$store.commit('packaging/updatePackageInfo', row);
        this.$store.commit(
            'common/updateMainTabs',
            this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Stock-PackingLineEdge-returnMaterial')
        );
        setTimeout(() => {
            this.$router.push({
                name: `DFMDS-pages-Stock-PackingLineEdge-returnMaterial`
            });
        }, 100);
    }

    // 调整明细
    getDetailLog(row: object, type?: boolean) {
        this.row = row;
        if (type === true) {
            this.current = 1;
        }
        PKG_API.PKG_MATERIALSTOCK_STORAGEITEM_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            pkgPackageStorageId: row['id'],
            batch: row['batch'],
            current: this.current,
            size: this.size,
            moveType: this.moveDetailForm.moveType
        }).then(({ data }) => {
            this.detaileLogData = data.data.records;
            this.total = data.data.total;
            this.visibleDetailLog = true;
        });
    }

    // 转线
    changeTransferLine(row: object) {
        this.amout = row['storageAmount'];
        this.storageUnitCode = row['storageUnitCode'];
        this.productlineListFilter = [];
        console.log(this.$refs.queryTable.optionLists.productLine);
        // this.productlineListFilter = this.productlineList.filter(n => n['id'] !== row['productLine']);
        this.productlineListFilter = this.$refs.queryTable.optionLists.productLine.filter(n => n['id'] !== row['productLine']);
        this.transferForm = {
            packageStorageId: row['id'],
            productLineOut: row['productLine'],
            productLineOutName: row['productLineName'],
            materialCode: row['materialCode'],
            materialName: row['materialName'],
            materialType: row['materialType'],
            amount: '',
            storageUnit: row['storageUnit'],
            batch: row['batch'],
            manufactor: row['manufactor'],
            storageAmount: row['storageAmount'],
            productLineIn: '',
            remark: '',
            mouldCode: row['mouldCode'],
            changer: getUserNameNumber(),
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        };
        this.visibleTransferLine = true;
    }

    // 关闭转线
    cannalsaveTransferLine(formName) {
        this.visibleTransferLine = false;
        this.$refs[formName].resetFields();
    }

    // 保存 转线
    saveTransferLine(formName) {
        if (this.transferForm['storageAmount'] < 0) {
            this.$warningToast('库存不能为负');
            return;
        }
        if (this.transferForm['amount'] <= 0) {
            this.$warningToast('调整量输入信息为正数');
            return;
        }
        this.transferForm['storageUnit'] = this.storageUnitCode;
        this.$refs[formName].validate(valid => {
            if (valid) {
                this.transferForm['factory'] = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                PKG_API.PKG_MATERIALSTOCK_TRANSFER_API(this.transferForm).then(({ data }) => {
                    this.$successToast(data.msg);
                    this.visibleTransferLine = false;
                    this.$refs.queryTable.getDataList();
                });
            }
        });
    }

    // 调整
    doAdjust(row: object) {
        this.amout = row['storageAmount'];
        this.adjustForm = {
            packageStorageId: row['id'],
            materialCode: row['materialCode'],
            materialName: row['materialName'],
            batch: row['batch'],
            manufactor: row['manufactor'],
            storageAmount: row['storageAmount'],
            moveType: '',
            amount: '',
            storageUnit: row['storageUnit'],
            remark: '',
            mouldCode: row['mouldCode'],
            changer: getUserNameNumber(),
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        };
        this.visibleAdjust = true;
    }

    // 关闭 调整
    cannalsaveAdjustForm(formName) {
        this.visibleAdjust = false;
        this.$refs[formName].resetFields();
    }

    // 保存 调整
    saveAdjustForm(formName) {
        if (this.adjustForm['storageAmount'] < 0) {
            this.$warningToast('库存不能为负');
            return;
        }
        if (this.adjustForm['amount'] <= 0) {
            this.$warningToast('调整量输入信息为正数');
            return;
        }
        this.$refs[formName].validate(valid => {
            if (valid) {
                this.adjustForm['factory'] = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                PKG_API.PKG_MATERIALSTOCK_ADJUST_API(this.adjustForm).then(({ data }) => {
                    this.$successToast(data.msg);
                    this.visibleAdjust = false;
                    this.$refs.queryTable.getDataList();
                });
            }
        });
    }

    // 改变每页条数
    handleSizeChange(val: number) {
        this.size = val;
        this.getDetailLog(this.row);
    }

    handleCurrentChange(val: number) {
        this.current = val;
        this.getDetailLog(this.row);
    }
}
interface FormObj {
    storageAmount?: number;
    amount?: string;
}
interface TypeOptionList {
    label?: string;
    value?: string;
}
</script>
