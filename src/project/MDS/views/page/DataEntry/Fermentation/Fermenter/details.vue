<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-row type="flex">
                <el-col class="header_pot" style="width: 160px;">
                    <p class="header_pot_label">
                        罐号：{{ formData.holderName ? formData.holderName : '' }}
                    </p>
                    <div class="header_pot_image">
                        <div class="header_pot_image_content" />
                    </div>
                </el-col>
                <el-col>
                    <el-form :inline="true" size="small" label-width="84px" class="topforms topformsde multi_row">
                        <el-form-item label="生产工厂：">
                            <p class="el-input">
                                {{ formData.factoryName ? formData.factoryName : '' }}
                            </p>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <p class="el-input">
                                {{ formData.workShopName ? formData.workShopName : '' }}
                            </p>
                        </el-form-item>
                        <el-form-item label="订单编号：">
                            <p class="el-input">
                                {{ formData.ferOrderNo }}
                            </p>
                        </el-form-item>
                        <el-form-item label="入库状态：">
                            <p class="el-input">
                                {{ formData.holderStatus === '2' ? '未入库' : formData.holderStatus === '3' ? '已入库' : '' }}
                            </p>
                        </el-form-item>
                        <el-form-item label="容器号：">
                            <p class="el-input">
                                {{ formData.holderName }}
                            </p>
                        </el-form-item>
                        <el-form-item label="订单数量：">
                            <p class="el-input">
                                {{ formData.ferAmount }}
                            </p>
                        </el-form-item>
                        <el-form-item label="入库数量：">
                            <p class="el-input">
                                {{ formData.inStoreAmount }}
                            </p>
                        </el-form-item>
                        <el-form-item label="发酵物料：">
                            <p class="el-input">
                                {{ (formData.ferMaterialCode ? formData.ferMaterialCode : '') + ' ' + (formData.ferMaterialName ? formData.ferMaterialName : '') }}
                            </p>
                        </el-form-item>
                        <el-form-item label="半成品类别：">
                            <p class="el-input">
                                {{ formData.halfTypeName }}
                            </p>
                        </el-form-item>
                        <el-form-item label="投料日期：">
                            <p class="el-input">
                                {{ formData.shootDate }}
                            </p>
                        </el-form-item>
                        <el-form-item label="发酵天数：">
                            <p class="el-input">
                                {{ formData.ferDays }}
                            </p>
                        </el-form-item>
                        <el-form-item label="是否成熟：">
                            <p class="el-input">
                                {{ formData.matureFlag === '0' ? '成熟' : formData.matureFlag === '1' ? '未成熟' : '' }}
                            </p>
                        </el-form-item>
                        <el-form-item label="状态：" class="noneBorder">
                            <el-radio-group v-model="formData.frozenStatus" :disabled="true">
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
        <el-tabs v-model="activeName" class="NewDaatTtabs tabsPages" style="margin-top: 5px;" type="border-card">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">当前订单信息</span>
                <el-table header-row-class-name="tableHead" class="newTable" :data="dataListOrder" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="55" :index="indexOrderMethod" fixed />
                    <el-table-column label="车间" :show-overflow-tooltip="true" prop="kjmWorkShopName" min-width="100" />
                    <el-table-column label="生产订单号" :show-overflow-tooltip="true" prop="orderNo" min-width="120" />
                    <el-table-column label="订单类型" :show-overflow-tooltip="true" prop="orderType" min-width="80" />
                    <el-table-column label="物料批次" :show-overflow-tooltip="true" prop="batch" min-width="105" />
                    <el-table-column label="物料编码" :show-overflow-tooltip="true" prop="materialCode" min-width="110" />
                    <el-table-column label="物料描述" :show-overflow-tooltip="true" prop="materialName" />
                    <el-table-column label="曲房号" :show-overflow-tooltip="true" prop="kjmHouse" min-width="120" />
                    <el-table-column label="计划数量" :show-overflow-tooltip="true" prop="amount" min-width="80" />
                    <el-table-column label="入库数量" :show-overflow-tooltip="true" prop="instorageAmount" min-width="80" />
                    <el-table-column label="单位" :show-overflow-tooltip="true" prop="unit" min-width="50" />
                    <el-table-column label="投料日期" :show-overflow-tooltip="true" prop="shootDate" min-width="110" />
                    <el-table-column label="入罐日期" :show-overflow-tooltip="true" prop="inHolderDate" min-width="110" />
                </el-table>
                <el-row>
                    <el-pagination :current-page="dataCurrPage" :page-sizes="[10, 20, 50]" :page-size="dataPageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataTotalCount" @size-change="handleDataSizeChange" @current-change="handleDataCurrentChange" />
                </el-row>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">当前领用信息</span>
                <el-table header-row-class-name="tableHead" class="newTable" :data="dataListUse" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="55" :index="indexUseMethod" fixed />
                    <el-table-column label="领用日期" :show-overflow-tooltip="true" prop="useDate" min-width="160" />
                    <el-table-column label="领用车间" :show-overflow-tooltip="true" prop="useWorkShopName" min-width="160" />
                    <el-table-column label="领用量(方)" :show-overflow-tooltip="true" prop="useAmount" min-width="150" />
                    <el-table-column label="批次" :show-overflow-tooltip="true" prop="batch" min-width="140" />
                    <el-table-column label="原汁罐" :show-overflow-tooltip="true" prop="oriHolder" />
                    <el-table-column label="入库量(方)" :show-overflow-tooltip="true" prop="inStoreAmount" min-width="150" />
                </el-table>
                <el-row>
                    <el-pagination :current-page="dataUseCurrPage" :page-sizes="[10, 20, 50]" :page-size="dataUsePageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataUseTotalCount" @size-change="handleUseDataSizeChange" @current-change="handleUseDataCurrentChange" />
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { FERMENTATION_API } from '@/api/api';
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
            this.$http(`${FERMENTATION_API.FER_DETAIL_API}`, 'POST', {
                factory: this.$store.state.common.Fermentation.details.factory,
                workShop: this.$store.state.common.Fermentation.details.workShop,
                holderNo: this.$store.state.common.Fermentation.details.holderNo
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.formData = data.ferHolderManage;
                    this.dataTotalCount = this.formData.currentOrderInfo.length;
                    this.dataUseTotalCount = this.formData.currentUseInfo.length;
                    this.dataListOrder = this.formData.currentOrderInfo.slice((this.dataCurrPage - 1) * this.dataPageSize, (this.dataCurrPage - 1) * this.dataPageSize + this.dataPageSize);
                    this.dataListUse = this.formData.currentUseInfo.slice((this.dataUseCurrPage - 1) * this.dataUsePageSize, (this.dataUseCurrPage - 1) * this.dataUsePageSize + this.dataUsePageSize);
                    if (this.formData.frozenStatus !== 0) {
                        this.formData.frozenStatus = '1';
                    } else {
                        this.formData.frozenStatus = '0';
                    }
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
            this.dataListOrder = this.formData.currentOrderInfo.slice((this.dataCurrPage - 1) * this.dataPageSize, (this.dataCurrPage - 1) * this.dataPageSize + this.dataPageSize);
        },
        handleDataCurrentChange(val) {
            this.dataCurrPage = val;
            this.dataListOrder = this.formData.currentOrderInfo.slice((this.dataCurrPage - 1) * this.dataPageSize, (val - 1) * this.dataPageSize + this.dataPageSize);
        },
        handleUseDataSizeChange(val) {
            this.dataUsePageSize = val;
            this.dataUseCurrPage = 1;
            this.dataListUse = this.formData.currentUseInfo.slice((this.dataUseCurrPage - 1) * this.dataUsePageSize, (this.dataUseCurrPage - 1) * this.dataUsePageSize + this.dataUsePageSize);
        },
        handleUseDataCurrentChange(val) {
            this.dataUseCurrPage = val;
            this.dataListUse = this.formData.currentUseInfo.slice((this.dataUseCurrPage - 1) * this.dataUsePageSize, (val - 1) * this.dataUsePageSize + this.dataUsePageSize);
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
        font-size: 18px;
    }
    &_image {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: 160px;
        height: 190px;
        background: url("~@/assets/img/ferPot.png") no-repeat center center;
        background-size: contain;
        &_content {
            width: 84px;
            height: 90px;
            margin-bottom: 8px;
            background: linear-gradient(#35c3ff, #1890ff);
        }
    }
}
</style>
