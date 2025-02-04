<template>
    <div>
        <mds-card :title="'生产入库'" :name="'productInStore'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="currentFormDataGroup" :row-class-name="rowDelFlag" border tooltip-effect="dark" style="width: 100%; min-height: 90px;">
                <el-table-column type="index" label="序号" width="50" fixed="left" align="center" />
                <el-table-column label="大豆量" prop="beanAmount" width="120">
                    <template slot="header">
                        <span class="notNull">* </span>大豆量
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row.beanAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="面粉量" prop="flourAmount" width="120">
                    <template slot="header">
                        <span class="notNull">* </span>面粉量
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row.flourAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="菌种量" prop="strainAmount" width="120">
                    <template slot="header">
                        <span class="notNull">* </span>菌种量
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row.strainAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="入库数量" prop="inStorageAmount" width="120">
                    <template slot="header">
                        <span class="notNull">* </span>入库数量
                    </template>
                    <template slot-scope="scope">
                        <el-input
                            v-model.number="scope.row.inStorageAmount"
                            size="small"
                            placeholder="请输入"
                            :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P')"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="入库批次" prop="inStorageBatch" width="210">
                    <template slot="header">
                        <span class="notNull">* </span>入库批次
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.inStorageBatch" maxlength="10" size="small" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P')" />
                    </template>
                </el-table-column>

                <el-table-column label="单位" prop="unit" width="80">
                    <template slot="header">
                        <span class="notNull">* </span>单位
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row.unitName }}
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" min-width="200">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="!scope.row.remark" effect="dark" :content="scope.row.remark" placement="top">
                            <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P')" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="changer" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" prop="changed" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log :table-data="currentAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
    import { KOJI_API, AUDIT_API } from 'common/api/api';
    // import { dataEntryData } from 'utils/utils';
    import _ from 'lodash';
    // import _ from 'lodash';

    @Component({
        name: 'DiscProductInStorage',
        components: {
        }
    })
    export default class ProductInStore extends Vue {
        $refs: {
            ruleForm: HTMLFormElement;
        }

        @Prop({ type: Object, default: () => { return {} } }) formHeader: OrderData;
        @Prop({ type: Array, default: () => { return [] } }) potNoList: OptionPotNoList[];

        @Prop({ type: Boolean, default: false }) isRedact;
        @Prop({ default: 'N' }) isStatus: string;
        @Prop({ type: String, default: '' }) status;
        @Prop({ default: '' }) potNoNow: number|string; // 发酵罐/池号

        targetOrderObj: OrderObject={}
        currentAudit = [];

        // 常有变数
        currentFormDataGroup: CurrentDataTable[] = [] // 主 data
        orgFormDataGroup: CurrentDataTable[] = [] // 主 data 复制


        // 发酵罐选择改变 触发字段变更值
        @Watch('potNoNow', { immediate: true, deep: true })
        onChangeValue(newVal: number| string) {
            if (newVal && this.currentFormDataGroup[0]) {
                if (this.targetOrderObj.outKojiDate) {
                    this.$set(this.currentFormDataGroup[0], 'inStorageBatch', this.targetOrderObj.outKojiDate.replace(/-/gi, '').slice(2) + '1' + newVal)
                    this.$infoToast('生产入库的入库批次自动生成')
                }
                KOJI_API.KOJI_DISC_QUERY_INSTORAGE_AMOUNT_API({
                    orderNo: this.formHeader.orderNo,
                    fermentPotId: this.potNoList.filter(item => item.optValue === newVal)[0].optId
                }).then(({ data }) => {
                    console.log('罐量')
                    this.$set(this.currentFormDataGroup[0], 'inStorageAmount', data.data)
                })
            }
        }

        // 获取当前年月日 (年两位) 201010
        getNowFormatDate() {
            const date = new Date();
            const year = String(date.getFullYear());
            let month: string|number = date.getMonth() + 1;
            let strDate: number|string = date.getDate();
            if (Number(month) >= 1 && Number(month) <= 9) {
                month = '0' + String(month);
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate;
            }
            const currentdate = year.substr(2, 2) + month + strDate;
            return currentdate;
        }

        init(formHeader) {
            this.targetOrderObj = formHeader
            console.log('formHeader')
            console.log(formHeader)
            // 生产入库
            this.getKojiStatus()
            // 审核日志
            this.getAudit(this.targetOrderObj);
        }

        // 生产入库
        getKojiStatus() {
            KOJI_API.KOJI_DISC_QUERY_INSTORAGE_API({
                kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                console.log('生产入库')
                console.log(data)
                this.currentFormDataGroup = [];
                this.orgFormDataGroup = [];
                this.$set(this.currentFormDataGroup, 0, [])
                this.$set(this.orgFormDataGroup, 0, [])
                if (data.data) {
                    this.$set(this.currentFormDataGroup, 0, data.data)
                    this.$set(this.orgFormDataGroup, 0, JSON.parse(JSON.stringify(this.currentFormDataGroup[0])))
                }
            });
        }

        // 审核日志
        getAudit(formHeader) {
            AUDIT_API.STE_AUDIT_LOG_API({ orderNo: formHeader.orderNo, splitOrderNo: formHeader.kojiOrderNo, verifyType: ['KJ_INSTORAGE', 'INSTORAGE'] }).then(({ data }) => {
                this.currentAudit = data.data;
            });
        }

        // 提交时跑校验
        ruleSubmit() {
            for (const item of this.currentFormDataGroup) {
                if (!item.inStorageAmount || !item.inStorageBatch) {
                    this.$warningToast('请填写生产入库必填项');
                    return false
                }
            }
            return true
        }


        savedData() {
            // const instorageDelete = [];
            const instorageInsert: CurrentDataTable[] = [];
            const instorageUpdate: CurrentDataTable[] = [];
            // 初次保存
            if (!this.currentFormDataGroup[0].id) {
                this.$set(this.currentFormDataGroup[0], 'orderNo', this.targetOrderObj.orderNo)
                this.$set(this.currentFormDataGroup[0], 'kojiOrderNo', this.targetOrderObj.kojiOrderNo)
                return this.currentFormDataGroup[0];
            }
            if (!_.isEqual(this.currentFormDataGroup[0], this.orgFormDataGroup[0])) {
                this.$set(this.currentFormDataGroup[0], 'orderNo', this.targetOrderObj.orderNo)
                this.$set(this.currentFormDataGroup[0], 'kojiOrderNo', this.targetOrderObj.kojiOrderNo)
                instorageUpdate.push(this.currentFormDataGroup[0]);
            }

            return instorageInsert[0] ? instorageInsert[0] : instorageUpdate[0] ? instorageUpdate[0] : null
        }

        //  rowDelFlag
        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }

    }

interface CurrentDataTable{
    beanAmount?: string;
    changed?: string;
    changer?: string;
    flourAmount?: string;
    id?: string;
    inStorageAmount?: number;
    inStorageBatch?: string;
    kojiOrderNo?: string;
    orderNo?: string;
    remark?: string;
    strainAmount?: string;
    unit?: string;
    unitName?: string;
    delFlag?: number;
}

interface OrderObject{
    orderNoTemp?: string;
    statusName?: string;
    addKojiDate?: string;
    changed?: string;
    changer?: string;
    fermentPotId?: string;
    fermentPotNo?: string;
    id?: string;
    kojiDuration?: string;
    kojiEndTime?: string;
    kojiHouseId?: string;
    kojiHouseNo?: string;
    kojiOrderNo?: string;
    kojiStartTime?: string;
    materialCode?: string;
    materialName?: string;
    orderId?: string;
    orderNo?: string;
    orderType?: string;
    outKojiDate?: string;
    outputUnit?: string;
    outputUnitName?: string;
    planOutput?: number;
    productDate?: string;
    status?: string;
    workShop?: string;
    workShopName?: string;

}
    interface StatusObj {
        semiMaterialStatus?: string;
    }

    interface OrderData {
        orderNo?: string;
        kojiHouseNo?: string;
        textStage?: string;
        factoryName?: string;
        potNo?: string;
        potOrder?: string;
        steTagPot?: StatusObj;
        fermentPotNo?: string;
        fermentPotId?: string;
        kojiOrderNo?: string;
    }
    interface OptionPotNoList {
        optValue?: string;
        optId?: string;
    }

</script>
<style scoped>

.ruleForm >>> .el-form-item__content {
    line-height: normal;
}
</style>
<style lang="scss" scoped>
.solerow {
    margin: 5px 0;
    line-height: 33px;
    div {
        float: left;
    }
    .input_bottom {
        margin-right: 50px;
    }
}
</style>
