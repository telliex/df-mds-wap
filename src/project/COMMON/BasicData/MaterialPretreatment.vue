<template>
    <div class="header_main">
        <mds-card title="辅料前处理页面" :name="'materialPretreatment'" :pack-up="false">
            <template slot="titleBtn">
                <el-row style="margin-bottom: 5px; text-align: right;">
                    <el-input v-model="form.useMaterial" size="small" placeholder="领用物料" suffix-icon="el-icon-search" style="width: 180px; margin-right: 16px;" clearable @keyup.enter.native="getDataLowList(true)" />
                    <el-button v-if="isAuth('accPreQuery')" type="primary" size="small" @click="getDataLowList(true)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('accPreQuery')" type="primary" size="small" @click="isSearchDialogShow = true">
                        高级查询
                    </el-button>
                    <el-button v-if="isAuth('accPreInsert')" type="primary" size="small" @click="addorUpdateItem()">
                        新增
                    </el-button>
                    <el-button v-if="isAuth('accPreDel')" type="danger" size="small" @click="removeItems()">
                        批量删除
                    </el-button>
                </el-row>
            </template>
            <el-table ref="table" class="newTable" header-row-class-name="tableHead" :height="mainClientHeight - 70 - 47" :data="dataList" border tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center" fixed />
                <el-table-column type="index" label="序号" width="55" align="center" fixed />
                <el-table-column min-width="170" :show-overflow-tooltip="true" label="生产物料">
                    <template slot-scope="scope">
                        {{ scope.row.productMaterial }} {{ scope.row.productMaterialName }}
                    </template>
                </el-table-column>
                <el-table-column min-width="170" :show-overflow-tooltip="true" label="领用物料">
                    <template slot-scope="scope">
                        {{ scope.row.useMaterial }} {{ scope.row.useMaterialName }}
                    </template>
                </el-table-column>
                <el-table-column min-width="100" :show-overflow-tooltip="true" prop="preStageName" label="前处理阶段" />
                <el-table-column min-width="100" show-overflow-tooltip prop="potDisplay" label="溶解罐显示" />
                <el-table-column min-width="90" show-overflow-tooltip prop="remark" label="备注" />
                <el-table-column min-width="120" label="操作人" prop="changer" />
                <el-table-column min-width="135" label="操作时间" prop="changed" />
                <el-table-column width="60" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('accPreEdit')" type="text" size="small" @click="addorUpdateItem(scope.row)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="form.current" :page-sizes="[10, 20, 50]" :page-size="form.size" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <el-dialog title="高级查询" width="600px" :close-on-click-modal="false" :visible.sync="isSearchDialogShow">
            <el-form ref="searchDialog" :model="form" size="small" label-width="200px" class="locationdialog">
                <el-form-item label="生产物料：">
                    <el-select v-model="form.productMaterial" placeholder="请选择" filterable clearable>
                        <el-option label="" value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in prodMaterialList" :key="index" :label="item.materialCode + ' ' + item.materialName" :value="item.materialCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="领用物料：">
                    <el-select v-model="form.useMaterial" placeholder="请选择" filterable clearable>
                        <el-option label="" value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in useMaterialList" :key="index" :label="item.materialCode + ' ' + item.materialName" :value="item.materialCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="前处理阶段：">
                    <el-select v-model="form.preStage" placeholder="请选择" filterable clearable>
                        <el-option label="" value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in preStageList" :key="index" :label="item.dictValue" :value="item.dictCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="溶解罐显示：">
                    <el-input v-model="form.potDisplay" placeholder="手工录入" style="width: 200px;" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="isSearchDialogShow = false">
                    取消
                </el-button>
                <el-button size="small" type="primary" @click="getDataList(true)">
                    确定
                </el-button>
            </span>
        </el-dialog>
        <el-dialog :title="'辅料前处理信息'" :close-on-click-modal="false" :visible.sync="isDialogShow" :before-close="resetForm">
            <div style="width: 400px; margin: auto;">
                <el-form ref="formatData" :model="formatData" :rules="rules" size="small" label-width="110px" @keyup.enter.native="dataFormSubmit()" @submit.native.prevent>
                    <el-form-item label="生产物料：" prop="productMaterialString">
                        <el-select v-model="formatData.productMaterialString" filterable :disabled="formatData.id ? true: false">
                            <el-option v-for="(item, index) in prodMaterialList" :key="index" :label="item.materialCode + ' ' + item.materialName" :value="item.materialCode + ' ' + item.materialName" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="领用物料：" prop="useMaterialString">
                        <el-select v-model="formatData.useMaterialString" filterable>
                            <el-option v-for="(item, index) in useMaterialList" :key="index" :label="item.materialCode + ' ' + item.materialName" :value="item.materialCode + ' ' + item.materialName" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="前处理阶段：" prop="preStage">
                        <el-select v-model="formatData.preStage" filterable>
                            <el-option v-for="(item, index) in preStageList" :key="index" :label="item.dictValue" :value="item.dictCode" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="溶解罐显示：">
                        <el-input v-model="formatData.potDisplay" placeholder="手工录入" />
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="formatData.remark" placeholder="手工录入" />
                    </el-form-item>
                    <el-form-item label="操作人：">
                        {{ formatData.changer }}
                    </el-form-item>
                    <el-form-item label="操作时间：">
                        {{ formatData.changed }}
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="resetForm">取消</el-button>
                <el-button size="small" type="primary" @click="dataFormSubmit('formatData')">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API } from 'common/api/api';
import { dateFormat, getUserNameNumber, recombineField } from 'utils/utils';

@Component

export default class MaterialPretreatment extends Vue {

    prodMaterialList: ListType[] = [];
    useMaterialList: ListType[] = [];
    preStageList = [];
    isDialogShow = false;
    totalCount = 0;
    isSearchDialogShow = false;
    dataList = [];
    multipleSelection = [];

    formatData: FormData = {};

    form = {
        productMaterial: '',
        useMaterial: '',
        preStage: '',
        potDisplay: '',
        size: 10,
        current: 1
    };

    rules = {
        productMaterialString: [
            { required: true, message: '请选择生产物料', trigger: 'change' }
        ],
        useMaterialString: [
            { required: true, message: '请选择领用物料', trigger: 'change' }
        ],
        preStage: [
            { required: true, message: '请选择前处理阶段', trigger: 'change' }
        ]
    }

    $refs: {
        validate: HTMLFormElement;
        formatData: HTMLFormElement;
    }

    mounted() {
        this.getProdMaterialList();
        this.getuseMaterialList();
        this.getPreStageList();
        this.getDataList(true);
    }

    get mainClientHeight() {
        return this.$store.state.common.mainClientHeight;
    }

    getDataLowList(st) {
        this.form.productMaterial = '';
        this.form.preStage = '';
        this.form.potDisplay = '';
        this.getDataList(st);
    }

    // 生产物料
    getProdMaterialList() {
        COMMON_API.SEARCH_MATERIAL_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            materialType: 'ZHAL'
        }).then(({ data }) => {
            if (data.code === 200) {
                this.prodMaterialList = data.data;
            }
        });
    }

    // 领用物料
    getuseMaterialList() {
        this.useMaterialList = [];
        COMMON_API.SEARCH_MATERIAL_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            materialType: 'ZFZC'
        }).then(({ data }) => {
            if (data.code === 200) {
                this.useMaterialList = data.data;
            }
        });
        COMMON_API.SEARCH_MATERIAL_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            materialType: 'ZROH'
        }).then(({ data }) => {
            if (data.code === 200) {
                data.data.map((item: ListType) => {
                    this.useMaterialList.push(item);
                })
            }
        });
    }

    // 前处理阶段
    getPreStageList() {
        COMMON_API.DICTQUERY_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            dictType: 'STE_PRE_OPERATION'
        }).then(({ data }) => {
            if (data.code === 200) {
                this.preStageList = data.data;
            }
        });
    }

    // 查询
    getDataList(st?) {
        if (st === true) {
            this.form.current = 1;
        }
        COMMON_API.PRE_MATERIAL_LIST_API(this.form).then(({ data }) => {
            if (data.code === 200) {
                this.dataList = data.data.records;
                this.totalCount = data.data.total;
                this.isSearchDialogShow = false;
            }
        })
    }

    // 新增
    addorUpdateItem(row?) {
        if (row) {
            this.formatData = {
                id: row.id,
                productMaterialString: row.productMaterial + ' ' + row.productMaterialName,
                useMaterialType: row.useMaterialType,
                useMaterialString: row.useMaterial + ' ' + row.useMaterialName,
                preStage: row.preStage,
                potDisplay: row.potDisplay,
                remark: row.remark,
                changed: row.changed,
                changer: row.changer
            }
        } else {
            this.formatData = {
                productMaterialString: '',
                useMaterialType: '',
                useMaterialString: '',
                preStage: '',
                potDisplay: '',
                remark: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber()
            }
        }
        this.isDialogShow = true;
    }

    //删除
    removeItems() {
        if (this.multipleSelection.length === 0) {
            this.$warningToast('请选择删除数据');
            return false;
        }
        const delList = recombineField(this.multipleSelection, 'id');
        this.$confirm('确认删除，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            COMMON_API.PRE_MATERIAL_REMOVE_API({ ids: delList }).then(({ data }) => {
                if (data.code === 200) {
                    this.$successToast('删除成功');
                    this.getDataList(true);
                }
            })
        })
    }

    // 提交
    dataFormSubmit(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                if (this.formatData.productMaterialString) {
                    const productMaterialString = this.formatData.productMaterialString.split(' ');
                    this.formatData.productMaterial = productMaterialString[0];
                    this.formatData.productMaterialName = productMaterialString[1];
                }
                if (this.formatData.useMaterialString) {
                    const useMaterialString = this.formatData.useMaterialString.split(' ');
                    this.formatData.useMaterial = useMaterialString[0];
                    this.formatData.useMaterialName = useMaterialString[1];
                }
                const materialType = this.useMaterialList.find(item => item.materialCode === this.formatData.useMaterial);
                if (materialType) {
                    this.formatData.useMaterialType = materialType.materialTypeCode;
                }
                if (this.formatData.id) {
                    COMMON_API.PRE_MATERIAL_UPDATE_API(this.formatData).then(({ data }) => {
                        if (data.code === 200) {
                            this.isDialogShow = false;
                            this.$successToast('修改成功');
                            this.getDataList(true);
                            this.$refs[formName].resetFields();
                        }
                    })
                } else {
                    COMMON_API.PRE_MATERIAL_INSERT_API(this.formatData).then(({ data }) => {
                        if (data.code === 200) {
                            this.isDialogShow = false;
                            this.$successToast('保存成功');
                            this.getDataList(true);
                            this.$refs[formName].resetFields();
                        }
                    })
                }
            }
        });
    }

    resetForm() {
        this.$refs.formatData.resetFields();
        this.isDialogShow = false
    }

    handleSelectionChange(val) {
        this.multipleSelection = val;
    }

    handleSizeChange(val) {
        this.form.size = val;
        this.getDataList();
    }

    handleCurrentChange(val) {
        this.form.current = val;
        this.getDataList();
    }
}
interface FormData {
    id?: number;
    productMaterialString?: string;
    useMaterialType?: string;
    useMaterialString?: string;
    productMaterial?: string;
    productMaterialName?: string;
    useMaterial?: string;
    useMaterialName?: string;
    preStage?: string;
    potDisplay?: string;
    remark?: string;
    changed?: string;
    changer?: string;
}
interface ListType {
    id?: number;
    basicUnit?: string;
    materialCode?: string;
    materialName?: string;
    materialTypeCode?: string;
    materialTypeName?: string;
    productUnit?: string;
    syncDate?: string;
}
</script>

<style scoped></style>
