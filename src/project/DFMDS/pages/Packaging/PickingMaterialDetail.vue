<template>
    <div class="header_main">
        <data-entry ref="dataEntry" type="audit" :header-base="headerBase" :form-header="formHeader" :order-status="formHeader.orderStatusName">
            <template slot="contentBox">
                <mds-card title="包材领用" :name="'outputworker'">
                    <el-table ref="materialS" header-row-class-name="tableHead" class="newTable" :data="tableData" :row-class-name="rowDelFlag" :span-method="spanMethod" border tooltip-effect="dark">
                        <el-table-column label="领用物料" prop="material" width="150" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" prop="unit" width="50" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.unitName || scope.row.unit }}
                            </template>
                        </el-table-column>
                        <el-table-column label="需求用量" prop="needNum" width="100" :show-overflow-tooltip="true" />
                        <el-table-column width="70">
                            <template slot-scope="scope">
                                <el-button :disabled="!(isRedact && scope.row.status !== '3')" type="text" @click="SplitDate(scope.row, scope.$index)">
                                    <em class="icons iconfont factory-chaifen" />拆分
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="当前库存" prop="storage" width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="领料类型" min-width="140">
                            <template slot="header">
                                <span class="notNull">* </span>领料类型
                            </template>
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.useType" :disabled="!(isRedact)" placeholder="请选择" size="small">
                                    <el-option label="正常领料" value="正常领料" />
                                    <el-option label="补领" value="补领" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="库位" min-width="140">
                            <template slot="header">
                                <span class="notNull">* </span>领用库位
                            </template>
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.stgeLoc" :disabled="!(isRedact)" placeholder="请选择" size="small">
                                    <el-option v-for="(list,index) in scope.row.stgeLocList" :key="index" :label="list.stgeLoc" :value="list.stgeLoc" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="物料批次" min-width="140">
                            <template slot="header">
                                <span class="notNull">* </span>物料批次
                            </template>
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.materialType!=='ZVER'" v-model="scope.row.batch" maxlength="10" :disabled="!(isRedact)" size="small" placeholder="请输入" />
                                <el-select v-else v-model="scope.row.batch" size="small" :disabled="!(isRedact)" @change="val => batchChange(scope.row, val)">
                                    <el-option v-for="op in (scope.row.stgeLocList.filter(it => it.stgeLoc === scope.row.stgeLoc).length? scope.row.stgeLocList.filter(it => it.stgeLoc === scope.row.stgeLoc)[0].stoPackageMaterialStorageResponseDtoList : [])" :key="op.id" :label="op.batch" :value="op.batch" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="订单领料量" min-width="140">
                            <template slot="header">
                                <span class="notNull">* </span>订单领料量
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.useAmount" :disabled="!(isRedact)" size="small" placeholder="请输入" @blur="useAmountBlurHandler(scope.row.useAmount, scope.row)" />
                            </template>
                        </el-table-column>

                        <el-table-column label="模具号" prop="mouldCode" min-width="140">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.mouldCode" :disabled="!scope.row.canEditModuleCode" size="small" />
                            </template>
                        </el-table-column>
                        <el-table-column label="厂家" min-width="140" show-overflow-tooltip>
                            <!-- <template slot="header">
                                <span class="notNull">* </span>厂家
                            </template> -->
                            <template slot-scope="scope">
                                {{ `${scope.row.manufactorName || ''} ${scope.row.manufactor || ''}` }}
                                <!-- <el-select v-model="scope.row.manufactor" filterable placeholder="请选择" size="small" :disabled="true" clearable>
                                    <el-option v-for="(iteam, index) in manufactor" :key="index" :label="iteam.dictValue" :value="iteam.dictCode" />
                                </el-select> -->
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" prop="remark" min-width="140">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" :disabled="!(isRedact)" size="small" placeholder="请输入" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作人" prop="changer" width="140" :show-overflow-tooltip="true" />
                        <el-table-column label="操作时间" prop="changed" width="160" :show-overflow-tooltip="true" />
                        <el-table-column label="操作" fixed="right" width="70">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.splitFlag === 'Y'" :disabled="!(isRedact && scope.row.status !== '3')" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="del(scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </mds-card>
            </template>
            <template slot="custom_btn">
                <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && orderStatus !== 'D' && orderStatus !== '已审核' && orderStatus !== '待审核' && orderStatus !== '已过账'" type="primary" size="small" @click="isRedact = !isRedact">
                    {{ isRedact ? '取消' : '编辑' }}
                </el-button>
                <el-button v-if="isRedact" type="primary" size="small" @click="saved()">
                    保存
                </el-button>
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API, PKG_API } from 'common/api/api';
import _ from 'lodash';

@Component
export default class PickingMaterialDetail extends Vue {
    isRedact = false;
    tableData: DataObj[] = [];
    OrgTableData = [];
    manufactor = [];
    orderStatus = '';
    spanArr: number[] = [];
    headerBase = [
        {
            type: 'p',
            icon: 'factory-shengchanchejian',
            label: '生产车间',
            value: 'workShopName'
        },
        {
            type: 'tooltip',
            icon: 'factory-shengchanxian',
            label: '生产产线',
            value: 'productLineName'
        },
        {
            type: 'tooltip',
            icon: 'factory-pinleiguanli',
            label: '生产物料',
            value: ['materialName', 'materialCode']
        },
        {
            type: 'p',
            icon: 'factory-bianhao',
            label: '生产订单',
            value: 'orderNo'
        },
        {
            type: 'p',
            icon: 'factory--meirijihuachanliangpeizhi',
            label: '订单产量',
            value: ['planOutput', 'outputUnit']
        },
        {
            type: 'p',
            icon: 'factory-riqi1',
            label: '订单日期',
            value: 'orderStartDate'
        },
        {
            type: 'date-picker',
            icon: 'factory-riqi1',
            label: '生产日期',
            value: 'productDate'
        }
    ];

    formHeader = {
        workShop: '',
        orderStatusName: '已同步'
    };

    mounted() {
        this.int();
    }

    //初始化表头表格和厂家
    int() {
        this.isRedact = false;
        PKG_API.PKG_HOME_QUERY_BY_NO_API({
            // 基础数据-订单管理-根据订单号查询
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            orderNo: this.$store.state.packaging.pickingDetail.orderNo
        }).then((res) => {
            this.formHeader = res.data.data;
            this.orderStatus = this.formHeader.orderStatusName;
            PKG_API.PKG_PICKING_MATERIAL_DETAIL_API({
                orderNo: this.$store.state.packaging.pickingDetail.orderNo,
                workShop: this.formHeader.workShop,
                productLine: this.$store.state.packaging.pickingDetail.productLine
            }).then(({ data }) => {
                data.data.forEach(item => {
                    /**
                   * //以前的逻辑
                    if (!item.useType) {
                        item.useType = '正常领料';
                    }
                    // 如果选了批次，当前库存展示当前批次的，如果没有批次，当前库存展示所有批次的总和
                    if (item.batch) {
                        const obj = item.stoPackageMaterialStorageResponseDtoList.find(row => row.batch === item.batch);
                        item.storage = obj?.currentAmount;
                        return;
                    }
                    // 如果没有id，就增加一个标识，修改为0的标识
                    if (!item.id) {
                        item.isFirst = true;
                    }
                    item.storage = 0;
                    item.stoPackageMaterialStorageResponseDtoList.map(row => {
                        item.storage += row.currentAmount;
                    });
                     */
                    if (!item.useType) {
                        item.useType = '正常领料';
                    }
                    item.stoPackageMaterialStorageResponseDtoList = [];
                    // 如果选了批次，当前库存展示当前批次的，如果没有批次，当前库存展示所有批次的总和
                    if (item.batch) {
                        if (item.stgeLocList.length > 0 && item.stgeLoc) {
                            const stgeLocList = item.stgeLocList.find(list => list.stgeLoc === item.stgeLoc);
                            const obj = stgeLocList.stoPackageMaterialStorageResponseDtoList.find(row => row.batch === item.batch);
                            item.storage = obj?.currentAmount;
                            item.stoPackageMaterialStorageResponseDtoList = stgeLocList.stoPackageMaterialStorageResponseDtoList;
                        }
                        return;
                    }
                        const stgeLocList = item.stgeLocList.find(it => it.defaultFlag === '1')
                        stgeLocList ? item.stgeLoc = stgeLocList.stgeLoc : item.stgeLoc = ''

                    item.storage = 0;
                    item.stoPackageMaterialStorageResponseDtoList.map(row => {
                        item.storage += row.currentAmount;
                    });
                    // 如果没有id，就增加一个标识，修改为0的标识
                    if (!item.id) {
                        item.isFirst = true;
                    }
                });
                this.tableData = JSON.parse(JSON.stringify(data.data));
                this.OrgTableData = JSON.parse(JSON.stringify(data.data));
                this.spanArr = this.merge(this.tableData);
            });
        });
        COMMON_API.DICTQUERY_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            dictType: 'PKG_SUPPLIER'
        }).then(({ data }) => {
            this.manufactor = data.data;
        });
    }

    // 批次变化
    batchChange(row, val) {
        const obj = row.stgeLocList.filter(it => it.stgeLoc === row.stgeLoc)[0].stoPackageMaterialStorageResponseDtoList.find(item => item.batch === val);
        row.mouldCode = obj.mouldCode;
        row.manufactor = obj.supplierCode;
        row.manufactorName = obj.supplierName;
        row.stoPackageMaterialStorageId = obj.id;
        row.storage = obj.currentAmount;
        if (!obj.mouldCode) {
            row.canEditModuleCode = true;
        } else {
            row.canEditModuleCode = false;
        }
    }

    useAmountBlurHandler(val, row) {
        if (!row.id) {
            if (val === '0' && row.isFirst) {
                // row.batch = row.stoPackageMaterialStorageResponseDtoList.length? row.stoPackageMaterialStorageResponseDtoList[0]?.batch : '';
                // this.batchChange(row, row.batch);
            }
            if (val) {
                row.isFirst = false;
            }
        }
    }

    // 拆分
    SplitDate(row, index) {
        this.tableData.splice(index + this.tableData.filter(item => item.materialCode === row.materialCode).length, 0, {
            id: '',
            posnr: row.posnr,
            materialCode: row.materialCode,
            materialName: row.materialName,
            materialType: row.materialType,
            unit: row.unit,
            needNum: row.needNum,
            storage: row.storage,
            useType: '正常领料',
            splitFlag: 'Y',
            stoPackageMaterialStorageResponseDtoList: row.stoPackageMaterialStorageResponseDtoList,
            mouldCode: '',
            productLine: row.productLine,
            orderNo: row.orderNo,
            stgeLoc: row.stgeLoc,
            stgeLocList: row.stgeLocList
        });
        this.spanArr = this.merge(this.tableData);
    }

    //删除
    del(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$set(row, 'delFlag', 1);
            this.$set(row, 'isDel', 1);
            this.spanArr = this.merge(this.tableData);
            this.$successToast('删除成功');
        });
    }

    //表格行名
    rowDelFlag({ row }) {
        if (row.isDel) {
            return 'rowDel';
        } else if (row.status === '3') {
            return 'disabled-row';
        } else if (row.status === '1') {
            return 'warning-row';
        }
        return '';
    }

    //设置合并行
    merge(tableData): number[] {
        const spanOneArr: number[] = [];
        let concatOne = 0;
        tableData.forEach((item, index) => {
            if (index === 0) {
                spanOneArr.push(1);
            } else if (item.materialCode === tableData[index - 1].materialCode) {
                if (item.delFlag !== 1) {
                    spanOneArr[concatOne] += 1;
                }
                spanOneArr.push(0);
            } else {
                spanOneArr.push(1);
                concatOne = index;
            }
        });
        return spanOneArr;
    }

    //设置合并行
    spanMethod({ rowIndex, columnIndex }) {
        if (columnIndex <= 3) {
            return {
                rowspan: this.spanArr[rowIndex],
                colspan: this.spanArr[rowIndex] > 0 ? 1 : 0
            };
        }
    }

    //保存校验
    ruleFn(): boolean {
        for (const item of this.tableData.filter(it => it.delFlag !== 1)) {
            if (item.useAmount === '0' || item.useAmount === 0) {
                console.log(item.useAmount);
            } else if (!item.useType || item.useAmount === '' || item.useAmount === null || !item.batch || !item.manufactor) {
                    this.$warningToast('请填写必填项');
                    console.log(item);
                    return false;
                }
        }
        return true;
    }

    //保存
    saved() {
        if (!this.ruleFn()) {
            return false;
        }

        const delIds: string[] = [];
        const insertDto: DataObj[] = [];
        const updateDto = [];

        // this.tableData.forEach(item => {
        //     if (item.status === '3') {
        //         delIds.push(item.id)
        //     }
        // })

        this.dataEntryData(this.formHeader, this.tableData, this.OrgTableData, delIds, insertDto, updateDto, item => {
            item.productLine = this.formHeader['productLine'];
        });
        for (let index = 0; index < insertDto.length; index++) {
            const element = insertDto[index];
            delete element.stoPackageMaterialStorageResponseDtoList;
        }

        const params = {
            workShop: this.formHeader['workShop'],
            delIds,
            insertDto: insertDto,
            updateDto: updateDto.filter(it => !delIds.includes(it['id']))
        };

        // if (!params.delIds.length && !params.insertDto.length && !params.updateDto.length) {
        //     this.$warningToast('请修改后再保存')
        //     return
        // }

        PKG_API.PKG_PICKING_MATERIAL_SAVE_API(params).then(() => {
            this.$successToast('保存成功');
            this.int();
        });
    }

    dataEntryData(formHeader, data: DataEntryDataObj[], orgData: DataEntryDataObj[], delArr: string[], insertArr: DataEntryDataObj[], updateArr: DataEntryDataObj[], processingData?) {
        data.forEach(item => {
            // if (item.delFlag === 1) {
            //     if (item.id) {
            //         delArr.push(item.id);
            //     }
            // }
            if (item.status === '1') {
                insertArr.push(item);
            } else if (Number(item.delFlag) === 1) {
                if (item.id) {
                    delArr.push(item.id);
                }
            } else {
                if (!item.id) {
                    insertArr.push(item);
                    return;
                }
                const orgObj = orgData.filter(it => it.id === item.id)[0];
                if (!_.isEqual(orgObj, item)) {
                    item.orderId = formHeader.id;
                    if (processingData) {
                        processingData(item);
                    }
                    updateArr.push(item);
                }
            }
            // else if (item.id) {
            //     const orgObj = orgData.filter(it => it.id === item.id)[0];
            //     if (orgObj) {
            //         if (!_.isEqual(orgObj, item)) {
            //             item.orderId = formHeader.id;
            //             if (processingData) {
            //                 processingData(item);
            //             }
            //             updateArr.push(item);
            //         }
            //     } else {
            //         insertArr.push(item);
            //     }
            // } else {
            //     item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            //     item.orderId = formHeader.id;
            //     item.orderNo = formHeader.orderNo;
            //     if (processingData) {
            //         processingData(item);
            //     }
            //     insertArr.push(item);
            // }
        });
    }
}
interface DataEntryDataObj {
    delFlag?: number;
    id?: string;
    status?: string;
    orderId?: string;
    factory?: string;
    orderNo?: string;
}
interface DataObj {
    delFlag?: number;
    id: string;
    orderId?: string;
    factory?: string;
    orderNo?: string;
    posnr?: string;
    materialCode?: string;
    materialName?: string;
    materialType?: string;
    unit?: string;
    needNum?: string;
    storage?: string;
    useType?: string;
    useAmount?: string|number;
    batch?: string;
    manufactor?: string;
    splitFlag?: string;
    status?: string;
    mouldCode?: string; // 模具号
    productLine?: string; // 产线
    stgeLoc: string;
    // eslint-disable-next-line
    stgeLocList: any;
    stoPackageMaterialStorageResponseDtoList?: Array<StoPackageMaterialStorageResponseDto>;
}
interface StoPackageMaterialStorageResponseDto {
    id?: string;
    mouldCode?: string;
    supplierCode?: string;
}
</script>

<style scoped>
</style>
