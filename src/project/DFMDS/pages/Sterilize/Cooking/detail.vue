<template>
    <div class="header_main">
        <el-card class="searchCard" style="margin-bottom: 10px;">
            <el-form :model="formHeaders" :inline="true" size="small" label-width="110px" class="multi_row clearfix" style="font-size: 0;">
                <el-row>
                    <el-form-item>
                        <template slot="label">
                            <span class="notNull">*</span>生产车间：
                        </template>
                        <el-select v-model="formHeaders.workShop" style="width: 180px;" placeholder="请选择" :disabled="formHeaders.cookingNo !== '' || !isRedact">
                            <el-option v-for="(item, optIndex) in workShop" :key="optIndex" :label="item.deptName" :value="item.deptCode" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <template slot="label">
                            <span class="notNull">*</span>煮料锅：
                        </template>
                        <el-select v-model="formHeaders.potNo" style="width: 180px;" placeholder="请选择" :disabled="formHeaders.cookingNo !== '' || !isRedact">
                            <el-option v-for="(item, optIndex) in holderList" :key="optIndex" :label="item.holderName" :value="item.holderNo" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <template slot="label">
                            <span class="notNull">*</span>生产物料：
                        </template>
                        <el-tooltip v-if="formHeaders.cookingNo !== ''" class="item" effect="dark" :content="formHeaders.productMaterialName + ' '+ formHeaders.productMaterial" placement="top-start">
                            <el-select v-model="formHeaders.productMaterial" style="width: 180px;" placeholder="请选择" :disabled="formHeaders.cookingNo !== '' || !isRedact">
                                <el-option v-for="(item, optIndex) in materialList" :key="optIndex" :label="item.materialName + ' ' + item.materialCode" :value="item.materialCode" />
                            </el-select>
                        </el-tooltip>
                        <el-select v-else v-model="formHeaders.productMaterial" style="width: 180px;" placeholder="请选择" :disabled="formHeaders.cookingNo !== '' || !isRedact">
                            <el-option v-for="(item, optIndex) in materialList" :key="optIndex" :label="item.materialName + ' ' + item.materialCode" :value="item.materialCode" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="配置开始时间：">
                        <template slot="label">
                            <span class="notNull">*</span>配置开始时间：
                        </template>
                        <el-date-picker v-model="formHeaders.configStartDate" type="datetime" placeholder="请选择" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 180px;" :disabled="!isRedact" />
                    </el-form-item>
                    <el-form-item label="配置结束时间：">
                        <template slot="label">
                            <span class="notNull">*</span>配置结束时间：
                        </template>
                        <el-date-picker v-model="formHeaders.configEndDate" type="datetime" placeholder="请选择" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 180px;" :disabled="!isRedact" />
                    </el-form-item>
                    <el-form-item label="配置锅数：">
                        <template slot="label">
                            <span class="notNull">*</span>配置锅数：
                        </template>
                        <el-input v-model="formHeaders.configPotCount" placeholder="手工录入" style="width: 180px;" :disabled="!isRedact" />
                    </el-form-item>
                    <el-form-item label="使用日期：">
                        <template slot="label">
                            <span class="notNull">*</span>使用日期：
                        </template>
                        <el-date-picker v-model="formHeaders.useDate" type="date" placeholder="请选择" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 180px;" :disabled="!isRedact" />
                    </el-form-item>
                    <el-form-item label="煮料锅序：">
                        <template slot="label">
                            <span class="notNull">*</span>煮料锅序：
                        </template>
                        <el-select v-model="formHeaders.potOrder" style="width: 180px;" placeholder="请选择" clearable filterable :disabled="!isRedact">
                            <el-option v-for="(item, optIndex) in holderNumberList" :key="optIndex" :label="item.name" :value="item.value" style="width: 180px;" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="formHeaders.remark" placeholder="手工录入" style="width: 180px;" :disabled="!isRedact" />
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="煮料单号：">
                        {{ formHeaders.cookingNo }}
                    </el-form-item>
                    <el-form-item label="状态：">
                        {{ formHeaders.potStatusName }}
                    </el-form-item>
                    <el-form-item label="操作人：">
                        {{ formHeaders.changer }}
                    </el-form-item>
                    <el-form-item label="操作时间：">
                        {{ formHeaders.changed }}
                    </el-form-item>
                </el-row>
            </el-form>
        </el-card>
        <mds-card v-if="dissolutionPhase" title="溶解罐领用" name="dissolvingTank">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button v-if="isAuth('steCookMxInsert')" type="primary" size="small" :disabled="!isRedact" @click="insertItem()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table ref="table" class="newTable" :data="dissolutionResponseDtos" :row-class-name="rowDelFlag" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%; margin-bottom: 20px;">
                <el-table-column type="index" label="序号" :index="index => getIndexMethod(index, dissolutionResponseDtos)" fixed="left" width="55" />
                <el-table-column min-width="80" prop="">
                    <template slot="header">
                        <span class="notNull">*</span>溶解罐号
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.potNo" placeholder="请选择" size="small" :disabled="!isRedact" @change="changePotNo($event, scope.row)">
                            <el-option v-for="item in dissolutionPot" :key="item.potId" :value="item.potNo" :label="item.potNo" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="溶解罐生产物料" min-width="180">
                    <template slot-scope="scope">
                        {{ scope.row.productMaterialName }} {{ scope.row.productMaterial }}
                    </template>
                </el-table-column>
                <el-table-column label="投料时间" min-width="140" prop="feedDate" />
                <el-table-column label="单位" min-width="50" prop="feedUnit" />
                <el-table-column min-width="100">
                    <template slot="header">
                        <span class="notNull">*</span>领用数量
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.userAmount" type="number" placeholder="请输入数量" size="small" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="溶解罐库存" min-width="90" prop="remainder" />
                <el-table-column label="备注" min-width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注" size="small" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="操作人" min-width="140" prop="changer" />
                <el-table-column label="操作时间" min-width="160" prop="changed" />
                <el-table-column label="操作" min-width="70">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('steCookMxDel')" class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card title="辅料领用" name="ingredients">
            <el-table ref="table" class="newTable" :data="accessoriesResponseDtos" :row-class-name="rowDelFlag" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%; margin-bottom: 20px;">
                <el-table-column type="index" :index="index => getIndexMethod(index, accessoriesResponseDtos)" label="序号" fixed="left" width="55" />
                <el-table-column label="领用物料" min-width="180">
                    <template slot-scope="scope">
                        {{ scope.row.useMaterialName }} {{ scope.row.useMaterial }}
                    </template>
                </el-table-column>
                <el-table-column label="单位" min-width="55" prop="useUnit" />
                <el-table-column min-width="55">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('steCookMxInsert')" type="text" :disabled="!isRedact" @click="accSplit(scope.row, scope.$index)">
                            <em class="iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column min-width="110">
                    <template slot="header">
                        <span class="notNull">*</span>领用数量
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.useAmount" size="small" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="领用批次" min-width="110">
                    <template slot="header">
                        <span class="notNull">*</span>领用批次
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.useBatch" size="small" maxlength="10" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" min-width="90" prop="remark">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" size="small" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="操作人" min-width="140" prop="changer" />
                <el-table-column label="操作时间" min-width="160" prop="changed" />
                <el-table-column label="操作" min-width="70">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('steCookMxDel')" class="delBtn" :disabled="scope.row.splitFlag === 'N' || !isRedact" type="text" icon="el-icon-delete" size="mini" @click="removeDataRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <redact-box>
            <template slot="button">
                <template v-if="formHeaders.potStatus === 'M'">
                    <el-button v-if="isAuth('steCookMxRevert')" type="primary" size="small" @click="rollBack()">
                        撤回
                    </el-button>
                </template>
                <template v-if="formHeaders.potStatus !== 'M'">
                    <el-button v-if="formHeaders.potStatus !== 'M' && isAuth('steCookMxEdit')" type="primary" size="small" @click="setRedact">
                        {{ isRedact ? '取消' : '编辑' }}
                    </el-button>
                    <el-button v-if="isRedact && isAuth('steCookMxSave')" type="primary" size="small" @click="saveDatas()">
                        保存
                    </el-button>
                    <el-button v-if="isAuth('steCookMxSumbit')" type="primary" size="small" @click="submitDatas()">
                        提交
                    </el-button>
                </template>
            </template>
        </redact-box>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { COMMON_API, STE_API } from 'common/api/api';
import { dateFormat, getUserNameNumber } from 'utils/utils';
import _ from 'lodash';

@Component

export default class CookingDetail extends Vue {
    formHeaders: HeaderInfo = {};
    productMaterial = '';

    workShop = [];
    holderList: HoldList[] = [];
    materialList: MaterialList[] = [];
    holderNumberList: HolderNumber[] = [];
    auditLogData = [];
    isRedact = false;
    cookingIndex = {
        cookingNo: ''
    };

    accessoriesResponseDtos: Accessories[] = []; // 辅料领用
    accessoriesResponseDtosOrg: Accessories[] = [];
    dissolutionResponseDtos: Dissolution[] = []; // 溶解罐领用
    dissolutionResponseDtosOrg: Dissolution[] = [];
    dissolutionPot: DissolutionPot[] = []; // 溶解罐
    dissolutionPhase = true;

    mounted() {
        if (!this.isAuth('steCookMxQuery')) {
            this.$warningToast('无权限');
            return false
        }
        this.getWorkShop();
        this.getHolderNumber();
        this.formHeaders = this.$store.state.sterilize.Cooking;

        if (this.formHeaders.potNo) {
            this.getHolderList(this.formHeaders.workShop, true);
        } else {
            this.getHolderList(this.formHeaders.workShop);
        }
        if (this.formHeaders.cookingNo) {
            this.getDetail(this.formHeaders.cookingNo);
        } else {
            this.formHeaders.changer = getUserNameNumber();
            this.formHeaders.changed = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
        }
    }

    @Watch('formHeaders.workShop')
    changeWorkShop(newVal) {
        this.getHolderList(newVal);
        this.getDissolutionPot();
    }

    @Watch('formHeaders.potNo')
    changeHolderVisible(newVal) {
        this.getMaterial(newVal);
    }

    @Watch('formHeaders.productMaterial')
    changeProductMaterial(newVal) {
        this.getAccMaterial(newVal);
        this.getDissolutionPot();
        // if (newVal && this.materialList.length !== 0) {
        //     const mat = this.materialList.find(item => item.materialCode === newVal)
        //     this.productMaterial = mat.materialCode + ' ' + mat.materialName;
        // } else {
        //     this.productMaterial = '';
        // }
    }

    // 车间下拉
    getWorkShop() {
        COMMON_API.ORG_QUERY_WORKSHOP_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            deptType: ['WORK_SHOP'],
            deptName: '杀菌'
        }).then(({ data }) => {
            if (data.code === 200) {
                this.workShop = data.data;
            }
        })
    }

    // 煮料锅/罐下拉
    getHolderList(deptId, getMaterial?) {
        if (deptId) {
            COMMON_API.HOLDER_DROPDOWN_API({
                deptId: this.formHeaders.workShop,
                holderType: ['020']
            }).then(({ data }) => {
                this.holderList = data.data
                if (getMaterial) {
                    this.getMaterial(this.formHeaders.potNo, true);
                }
            })
        } else {
            this.holderList = [];
        }
    }

    // 生产物料下拉
    getMaterial(potNo, bool = false) {
        if (this.holderList.length !== 0) {
            this.materialList = []
            if (bool === false) {
                this.formHeaders.productMaterial = '';
            }
            if (potNo !== '') {
                // eslint-disable-next-line
                const materialSole: any = this.holderList.find(item => item.holderNo === potNo);
                if (materialSole['material'].length > 0) {
                    this.materialList = materialSole['material'];
                } else {
                    STE_API.STE_COOKING_MATERIAL_QUERY_API({ preStages: ['MIX'], productGroup: '1' }).then(({ data }) => {
                        data.data.map(item => {
                            this.materialList.push({
                                materialCode: item.productMaterial,
                                materialName: item.productMaterialName
                            });
                        })
                    })
                }
                if (bool === false && this.materialList.length === 1) {
                    if (this.materialList[0]['materialCode']) {
                        this.formHeaders.productMaterial = this.materialList[0]['materialCode']
                    }
                }
            }
        }
    }

    // 煮料锅序
    getHolderNumber() {
        let i = 1;
        while (i <= 20) {
            const sole: HolderNumber = {
                value: i,
                name: '第' + i + '锅'
            }
            this.holderNumberList.push(sole);
            i++;
        }
    }

    // 溶解罐下拉 - 溶解罐领用
    getDissolutionPot() {
        let pM: string | undefined;
        if (this.formHeaders.productMaterial === '') {
            pM = '1';
        } else {
            pM = this.formHeaders.productMaterial;
        }
        STE_API.STE_DISSOLUTIONBUCKET_DROPDOWN_API({ workShop: this.formHeaders.workShop, potStatus: ['M', 'U'], potNo: '', materialCode: pM }).then(({ data }) => {
            this.dissolutionPot = data.data;
        })
    }

    // 辅料领用
    getAccMaterial(materialCode) {
        if (materialCode && this.formHeaders.cookingNo === '') {
            STE_API.STE_COOKING_DETAIL_ACCMATERIAL_API({ productMaterial: materialCode }).then(({ data }) => {
                if (data.code === 200) {
                    this.accessoriesResponseDtos = data.data.steAccList;
                    this.dissolutionPhase = data.data.dissolutionPhase;
                    this.accessoriesResponseDtos.map(item => {
                        this.getUnit(item.useMaterial, item);
                    })
                }
            })
        }
    }

    // 根据物料拉取单位
    getUnit(materialCode, item) {
        COMMON_API.DROPDOWN_UNIT_API({ materialCode: materialCode }).then(({ data }) => {
            item.useUnit = data.data[0]['unit'];
        })
    }

    // 新增 - 溶解罐
    insertItem() {
        const sole: Dissolution = {
            potId: '',
            potNo: '',
            cycle: '',
            productMaterial: '',
            productMaterialName: '',
            feedDate: '',
            feedUnit: 'KG',
            userAmount: '',
            remainder: '',
            remark: '',
            changer: getUserNameNumber(),
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            delFlag: 0
        }
        this.dissolutionResponseDtos.push(sole);
    }

    // 查询
    getDetail(cookingNo) {
        STE_API.STE_COOKING_DETAIL_QUERY_API({ cookingNo: cookingNo }).then(({ data }) => {
            this.dissolutionPhase = data.data.dissolutionPhase;
            this.formHeaders = JSON.parse(JSON.stringify(data.data.steCookingPotResponseDto)); // 头部信息
            this.accessoriesResponseDtos = JSON.parse(JSON.stringify(data.data.accessoriesResponseDtos));
            this.accessoriesResponseDtosOrg = JSON.parse(JSON.stringify(data.data.accessoriesResponseDtos));
            this.dissolutionResponseDtos = JSON.parse(JSON.stringify(data.data.dissolutionResponseDtos));
            this.dissolutionResponseDtosOrg = JSON.parse(JSON.stringify(data.data.dissolutionResponseDtos));
        })
    }

    rowDelFlag({ row }) {
        if (row.delFlag === 1) {
            return 'rowDel';
        }
        return '';
    }

    // 删除
    removeDataRow(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$set(row, 'delFlag', 1)
            this.$successToast('删除成功');
        });
    }

    refactorData() {
        // 溶解罐领用
        const dissIds: string[] = [];
        const dissolutionInsert: Dissolution[] = [];
        const dissolutionUpdate: Dissolution[] = [];
        this.dissolutionResponseDtos.forEach((item, index) => {
            if (item.delFlag === 1) {
                if (item.id) {
                    dissIds.push(item.id);
                }
            } else if (item.id) {
                if (!_.isEqual(this.dissolutionResponseDtosOrg[index], item)) {
                    dissolutionUpdate.push(item)
                }
            } else {
                dissolutionInsert.push(item)
            }
        })

        // 辅料领用
        const accIds: string[] = [];
        const accessInsert: Accessories[] = [];
        const accessUpdate: Accessories[] = [];
        this.accessoriesResponseDtos.forEach((item, index) => {
            if (item.delFlag === 1) {
                if (item.id) {
                    accIds.push(item.id);
                }
            } else if (item.id) {
                if (!_.isEqual(this.accessoriesResponseDtosOrg[index], item)) {
                    accessUpdate.push(item)
                }
            } else {
                accessInsert.push(item)
            }
        })

        // 头部
        let headerInsert = {};
        let headerUpdate = this.formHeaders;
        if (!this.formHeaders.cookingNo) {
            const productMaterial = this.materialList.find(item => item.materialCode === this.formHeaders.productMaterial);
            if (productMaterial) {
                this.formHeaders.productMaterialName = productMaterial['materialName'];
            }
            headerInsert = this.formHeaders;
            headerUpdate = {};
        }
        return {
            factoryCode: JSON.parse(sessionStorage.getItem('factory') || '{}').deptCode,
            steCookingPotInsertDto: headerInsert,
            steCookingPotUpdateDto: headerUpdate,
            accessoriesInsertDtos: accessInsert,
            accessoriesUpdateDtos: accessUpdate,
            accessoriesDelete: accIds,
            dissolutionInsertDtos: dissolutionInsert,
            dissolutionUpdateDtos: dissolutionUpdate,
            dissolutionDelete: dissIds
        }
    }

    // 保存
    saveDatas() {
        if (!this.formHeaders.workShop || !this.formHeaders.potNo || !this.formHeaders.productMaterial) {
            this.$warningToast('请完善头部生产车间、煮料锅、生产物料三项信息');
            return false;
        }
        STE_API.STE_COOKING_DETAIL_SAVE_API(this.refactorData()).then(({ data }) => {
            this.isRedact = false;
            this.$successToast('保存成功');
            this.formHeaders.cookingNo = data.data.cookingNo;
            this.$store.commit('sterilize/updateCooking', this.formHeaders);
            this.getDetail(data.data.cookingNo);
        })
    }

    // 拆分
    accSplit(row, index) {
        this.accessoriesResponseDtos.splice(index + 1, 0, {
            useMaterial: row.useMaterial,
            useMaterialName: row.useMaterialName,
            useUnit: row.useUnit,
            useAmount: '',
            useBatch: '',
            remark: '',
            splitFlag: 'Y',
            changer: getUserNameNumber(),
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        });
    }

    // 溶解罐
    changePotNo(val, row) {
        const potSole = this.dissolutionPot.find((item: DissolutionPot) => item.potNo === val);
        if (potSole) {
            row.potId = potSole.potId;
            row.cycle = potSole.cycle;
            row.productMaterial = potSole.prodcutMaterial;
            row.productMaterialName = potSole.prodcutMaterialName;
            row.feedDate = potSole.feedDate;
            row.feedUnit = 'KG';
            row.remainder = potSole.potAmount;
        }
    }

    // 提交
    submitDatas() {
        if (!this.formHeaders.workShop || !this.formHeaders.potNo || !this.formHeaders.productMaterial || !this.formHeaders.configStartDate || !this.formHeaders.configEndDate || !this.formHeaders.configPotCount || !this.formHeaders.useDate || !this.formHeaders.potOrder) {
            this.$warningToast('请完善头部所有必填信息');
            return false;
        }
        if (this.dissolutionPhase === true && this.dissolutionResponseDtos.filter(it => it.delFlag !== 1).length === 0) {
            this.$warningToast('请录入溶解罐领用数据');
            return false;
        }
        for (const item of this.dissolutionResponseDtos.filter(it => it.delFlag !== 1)) {
            if (!item.potNo || item.userAmount === '') {
                this.$warningToast('请填写溶解罐领用必填项');
                return false;
            }
        }
        for (const item of this.accessoriesResponseDtos.filter(it => it.delFlag !== 1)) {
            if (!item.useAmount || item.useBatch === '') {
                this.$warningToast('请填写辅料领用必填项');
                return false;
            }
        }
        STE_API.STE_COOKING_DETAIL_SUBMIT_API(this.refactorData()).then(({ data }) => {
            this.isRedact = false;
            this.$successToast('提交成功');
            this.formHeaders.cookingNo = data.data.cookingNo;
            this.$store.commit('sterilize/updateCooking', this.formHeaders);
            this.getDetail(data.data.cookingNo);
        })
    }

    setRedact() {
        this.isRedact = !this.isRedact
        if (this.isRedact === false) {
            if (this.formHeaders.cookingNo !== '') {
                this.getDetail(this.formHeaders.cookingNo);
            } else {
                this.accessoriesResponseDtos = [];
                this.dissolutionResponseDtos = [];
                if (this.formHeaders.productMaterial) {
                    this.getAccMaterial(this.formHeaders.productMaterial);
                }
                this.getDissolutionPot();
            }
        }
    }

    // 撤回
    rollBack() {
        // eslint-disable-next-line
        STE_API.STE_COOKING_DETAIL_ROLLBACK_API(this.formHeaders).then(({ data }) => {
            this.$successToast('撤回成功');
            this.getDetail(this.formHeaders.cookingNo);
        })
    }
}

interface HeaderInfo {
    changed?: string;
    changer?: string;
    clear?: string;
    configEndDate?: string;
    configPotCount?: string;
    configStartDate?: string;
    cookingNo?: string;
    id?: string;
    potNo?: string;
    potNoName?: string;
    potOrder?: string;
    potStatus?: string;
    potStatusName?: string;
    productMaterial?: string;
    productMaterialName?: string;
    remainder?: string;
    remark?: string;
    useDate?: string;
    usePotCount?: string;
    workShop?: string;
    workShopName?: string;
}
interface MaterialList{
    materialCode?: string;
    materialName?: string;
}
interface HoldList{
    deptId?: string;
    holderName?: string;
    holderNo: string;
    holderType?: string;
    holderVolume?: string;
    id?: string;
    material: MaterialList[];
}
interface DissolutionPot {
    id?: string;
    potId?: string;
    potNo?: string;
    potAmount?: string;
    prodcutMaterial?: string;
    prodcutMaterialName?: string;
    ratio?: string;
    cycle?: string;
    feedDate?: string;
}
interface HolderNumber {
    value?: number;
    name?: string;
}
interface Dissolution {
    id?: string;
    potId?: string;
    potNo?: string;
    cycle?: string;
    productMaterial?: string;
    productMaterialName?: string;
    feedDate?: string;
    feedUnit?: string;
    userAmount?: string;
    remainder?: string;
    remark?: string;
    changer?: string;
    changed?: string;
    delFlag?: number;
}
interface Accessories {
    id?: string;
    useMaterial?: string;
    useMaterialName?: string;
    useUnit?: string;
    useAmount?: string;
    useBatch?: string;
    remark?: string;
    splitFlag?: string; // N主数据  Y拆出来的
    changer?: string;
    changed?: string;
    delFlag?: number;
    cookingId?: string;
}
</script>
