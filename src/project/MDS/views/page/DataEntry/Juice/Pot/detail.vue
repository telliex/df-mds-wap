<template>
    <div class="header_main">
        <el-card class="searchCard newCard">
            <el-row type="flex">
                <el-col class="header_pot" style="width: 160px;">
                    <p class="header_pot_label">
                        罐号：{{ formData.HOLDER_NAME ? formData.HOLDER_NAME : '' }}
                    </p>
                    <div class="header_pot_image">
                        <div class="header_pot_image_content" style=" background: linear-gradient(#ad592d, #8a391b);" />
                    </div>
                </el-col>
                <el-col>
                    <el-form :inline="true" size="small" label-width="84px" class="topforms topformsde multi_row" style="margin-top: 30px;">
                        <el-form-item label="生产车间：">
                            <p class="el-input">
                                {{ formData.WORK_SHOP ? formData.WORK_SHOP : '' }}
                            </p>
                        </el-form-item>
                        <el-form-item label="容器类型：">
                            <p class="el-input">
                                {{ formData.HOLDER_TYPE }}
                            </p>
                        </el-form-item>
                        <el-form-item label="容器编号：">
                            <p class="el-input">
                                {{ formData.HOLDER_NAME }}
                            </p>
                        </el-form-item>
                        <el-form-item label="生产物料：">
                            <el-tooltip class="item" effect="dark" :content="(formData.MATERIAL_CODE || '') + ' ' + (formData.MATERIAL_NAME || '')" placement="top">
                                <p class="el-input" style="text-overflow: ellipsis;">
                                    {{ formData.MATERIAL_CODE }}
                                    {{ formData.MATERIAL_NAME }}
                                </p>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="半成品类别：">
                            <p class="el-input">
                                {{ formData.TYPE }}
                            </p>
                        </el-form-item>
                        <el-form-item label="库存数量：">
                            <p class="el-input">
                                {{ formData.AMOUNT }}
                            </p>
                        </el-form-item>
                        <el-form-item label="满罐日期：">
                            <p class="el-input">
                                {{ formData.FULL_DATE }}
                            </p>
                        </el-form-item>
                        <el-form-item label="存储天数：">
                            <p class="el-input">
                                {{ formData.days }}
                            </p>
                        </el-form-item>
                        <el-form-item label="状态：" class="noneBorder">
                            <el-radio-group v-model="formData.TYPE_STATUS" :disabled="true">
                                <el-radio label="1">
                                    正常
                                </el-radio>
                                <el-radio label="0">
                                    冻结
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <el-tabs v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card" style="margin-top: 5px;">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">当前订单信息</span>
                <el-table header-row-class-name="tableHead" class="newTable" :data="dataListOrder" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="55" :index="indexOrderMethod" fixed />
                    <el-table-column label="车间" :show-overflow-tooltip="true" prop="WORK_SHOP" min-width="90" />
                    <el-table-column label="物料" :show-overflow-tooltip="true" min-width="220">
                        <template slot-scope="scope">
                            {{ scope.row.MATERIAL_CODE }}{{ scope.row.MATERIAL_NAME }}
                        </template>
                    </el-table-column>
                    <el-table-column label="类别" :show-overflow-tooltip="true" prop="TYPE" min-width="70" />
                    <el-table-column label="移动类型" :show-overflow-tooltip="true" prop="move" min-width="80" />
                    <el-table-column label="来源" :show-overflow-tooltip="true" prop="source" min-width="70" />
                    <el-table-column label="物料批次" :show-overflow-tooltip="true" prop="BATCH" min-width="110" />
                    <el-table-column label="来源批次" :show-overflow-tooltip="true" prop="IN_BATCH" min-width="110" />
                    <el-table-column label="数量" :show-overflow-tooltip="true" prop="IN_POT_AMOUNT" min-width="80" />
                    <el-table-column label="单位" :show-overflow-tooltip="true" prop="UNIT" min-width="50" />
                    <el-table-column label="满罐日期" :show-overflow-tooltip="true" prop="FULL_POT_DATE" min-width="160" />
                    <el-table-column label="单号" :show-overflow-tooltip="true" prop="ORDER_NO" min-width="120" />
                    <el-table-column label="订单类型" :show-overflow-tooltip="true" prop="ORDER_TYPE" min-width="80" />
                    <el-table-column label="领用人" :show-overflow-tooltip="true" prop="CREATOR" min-width="140" />
                    <el-table-column label="领用时间" :show-overflow-tooltip="true" prop="CREATED" min-width="160" />
                </el-table>
                <el-row>
                    <el-pagination :current-page="dataCurrPage" :page-sizes="[10, 20, 50]" :page-size="dataPageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataTotalCount" @size-change="handleDataSizeChange" @current-change="handleDataCurrentChange" />
                </el-row>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">当前领用信息</span>
                <el-table header-row-class-name="tableHead" class="newTable" :data="dataListUse" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="55" :index="indexUseMethod" fixed />
                    <el-table-column label="车间" :show-overflow-tooltip="true" prop="WORK_SHOP" min-width="90" />
                    <el-table-column label="物料" :show-overflow-tooltip="true" min-width="220">
                        <template slot-scope="scope">
                            {{ scope.row.MATERIAL_CODE }}{{ scope.row.MATERIAL_NAME }}
                        </template>
                    </el-table-column>
                    <el-table-column label="类别" :show-overflow-tooltip="true" prop="RECEIVE_TYPE" min-width="70" />
                    <el-table-column label="移动类型" :show-overflow-tooltip="true" prop="move" min-width="80" />
                    <el-table-column label="领用" :show-overflow-tooltip="true" prop="source" min-width="70" />
                    <el-table-column label="物料批次" :show-overflow-tooltip="true" min-width="110">
                        <template slot-scope="scope">
                            <span v-if="scope.row.move === '转储'">{{ scope.row.RECEIVE_BATCH }}</span>
                            <span v-else>{{ scope.row.BATCH }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="转出批次" :show-overflow-tooltip="true" min-width="110">
                        <template slot-scope="scope">
                            <span v-if="scope.row.move === '转储'">{{ scope.row.BATCH }}</span>
                            <span v-else>{{ scope.row.RECEIVE_BATCH }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量" :show-overflow-tooltip="true" prop="RECEIVE_AMOUNT" min-width="80" />
                    <el-table-column label="单位" :show-overflow-tooltip="true" prop="UNIT" min-width="50" />
                    <el-table-column label="满罐日期" :show-overflow-tooltip="true" prop="FULL_DATE" min-width="160" />
                    <el-table-column label="单号" :show-overflow-tooltip="true" prop="ORDER_NO" min-width="120" />
                    <el-table-column label="罐号" :show-overflow-tooltip="true" prop="HOLDER_NAME" min-width="120" />
                    <el-table-column label="领用人" :show-overflow-tooltip="true" prop="CREATOR" min-width="140" />
                    <el-table-column label="领用时间" :show-overflow-tooltip="true" prop="CREATED" min-width="160" />
                </el-table>
                <el-row>
                    <el-pagination :current-page="dataUseCurrPage" :page-sizes="[10, 20, 50]" :page-size="dataUsePageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataUseTotalCount" @size-change="handleUseDataSizeChange" @current-change="handleUseDataCurrentChange" />
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { JUICE_API } from '@/api/api';
export default {
    name: 'Ferdetails',
    components: {},
    data() {
        return {
            formData: {
                frozenStatus: '1'
            },
            activeName: '1',
            dataListOrder: [],
            dataListUse: [],
            dataCurrPage: 1,
            dataPageSize: 10,
            dataTotalCount: 0,
            dataUseCurrPage: 1,
            dataUsePageSize: 10,
            dataUseTotalCount: 0
        };
    },
    computed: {},
    mounted() {
        this.Getdetail();
    },
    methods: {
        // 获取基础信息
        Getdetail() {
            this.$http(`${JUICE_API.JUICE_JUICE_DETAIL}`, 'POST', {
                holderId: this.$store.state.common.Juice.HOLDER_ID,
                batch: this.$store.state.common.Juice.BATCH
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.formData = data.juiceItem.head;
                    this.formData.TYPE_STATUS = this.formData.TYPE_STATUS === null ? '1' : this.formData.TYPE_STATUS;
                    this.dataListOrderAll = data.juiceItem.infoEnter;
                    this.dataListUseAll = data.juiceItem.infoOut;
                    this.dataTotalCount = data.juiceItem.infoEnter.length;
                    this.dataUseTotalCount = data.juiceItem.infoOut.length;
                    this.dataListOrder = data.juiceItem.infoEnter.slice((this.dataCurrPage - 1) * this.dataPageSize, (this.dataCurrPage - 1) * this.dataPageSize + this.dataPageSize);
                    this.dataListUse = data.juiceItem.infoOut.slice((this.dataUseCurrPage - 1) * this.dataUsePageSize, (this.dataUseCurrPage - 1) * this.dataUsePageSize + this.dataUsePageSize);
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 序号
        indexOrderMethod(index) {
            return index + 1 + (Number(this.dataCurrPage) - 1) * (Number(this.dataPageSize));
        },
        // 序号
        indexUseMethod(index) {
            return index + 1 + (Number(this.dataUseCurrPage) - 1) * (Number(this.dataUsePageSize));
        },
        handleDataSizeChange(val) {
            this.dataPageSize = val;
            this.dataCurrPage = 1;
            this.dataListOrder = this.dataListOrderAll.slice((this.dataCurrPage - 1) * this.dataPageSize, (this.dataCurrPage - 1) * this.dataPageSize + this.dataPageSize);
        },
        handleDataCurrentChange(val) {
            this.dataCurrPage = val;
            this.dataListOrder = this.dataListOrderAll.slice((this.dataCurrPage - 1) * this.dataPageSize, (val - 1) * this.dataPageSize + this.dataPageSize);
        },
        handleUseDataSizeChange(val) {
            this.dataUsePageSize = val;
            this.dataUseCurrPage = 1;
            this.dataListUse = this.dataListUseAll.slice((this.dataUseCurrPage - 1) * this.dataUsePageSize, (this.dataUseCurrPage - 1) * this.dataUsePageSize + this.dataUsePageSize);
        },
        handleUseDataCurrentChange(val) {
            this.dataUseCurrPage = val;
            this.dataListUse = this.dataListUseAll.slice((this.dataUseCurrPage - 1) * this.dataUsePageSize, (val - 1) * this.dataUsePageSize + this.dataUsePageSize);
        }
    }
};
</script>

<style lang="scss">
.topformsde {
    .el-form-item__content {
        height: 32px;
        border-bottom: 1px solid #d8d8d8;
    }
    .noneBorder {
        .el-form-item__content {
            border-bottom: none;
        }
    }
    .el-input {
        width: 145px !important;
        overflow: hidden;
        line-height: 32px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
.header_pot {
    width: 160px;
    &_label {
        margin-bottom: 15px;
        color: rgba(102, 102, 102, 1);
        font-weight: 400;
        font-size: 14px;
    }
    &_image {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: 70px;
        height: 100px;
        margin-left: 20px;
        background: url("~@/assets/img/ferPot.png") no-repeat center center;
        background-size: contain;
        &_content {
            width: 42px;
            height: 45px;
            margin-bottom: 4px;
            background: linear-gradient(#35c3ff, #1890ff);
        }
    }
}
</style>
