<template>
    <div class="header_main">
        <el-card class="searchCard searchCards">
            <el-form :model="formHeader" size="small" :inline="true" label-width="70px" class="sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory">
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产物料：">
                    <el-select v-model="formHeader.materialCode" filterable>
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in materialList" :key="index" :label="item.materialName + `${item.materialCode}`" :value="item.materialCode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button v-if="isAuth('ste:mid:list')" type="primary" size="small" @click="GetList()">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card title="杀菌物料比例列表" :name="'mid'" :pack-up="false" style=" margin-top: 5px; margin-bottom: 0; background: #fff;">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button v-if="isAuth('ste:mid:save')" type="primary" size="small" @click="AddInfo()">
                        新增
                    </el-button>
                    <el-button v-if="isAuth('ste:mid:delete')" type="danger" size="small" @click="DeleteInfo()">
                        批量删除
                    </el-button>
                </div>
            </template>
            <el-table :data="dataList" class="newTable" :height="mainClientHeight - 48 - 25 - 34" border tooltip-effect="dark" header-row-class-name="tableHead" style="width: 100%;" @row-dblclick="EditInfo" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="factoryName" label="工厂" :show-overflow-tooltip="true" />
                <el-table-column label="物料" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialName }}
                        {{ scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column prop="ratio" label="比例" :show-overflow-tooltip="true" />
                <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" />
            </el-table>
        </mds-card>
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisibleAdd" width="400px" custom-class="dialog__class">
            <div slot="title">
                新增
            </div>
            <el-form ref="Addstar" :model="formAdd" :inline="true" size="small" :rules="Addrulestar" label-width="85px">
                <el-form-item label="工厂：">
                    {{ factoryName }}
                </el-form-item>
                <el-form-item label="物料：" prop="materialCode">
                    <el-select v-model="formAdd.materialCode" filterable style="width: 230px;">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in materialList" :key="index" :label="item.materialName + ` ${item.materialCode}`" :value="item.materialCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="比例：" prop="ratio">
                    <el-input v-model="formAdd.ratio" style="width: 230px;" />
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="formAdd.remark" style="width: 230px;" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisibleAdd = false">取 消</el-button>
                <el-button type="primary" size="small" @click="AddSave('Addstar')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
import { headanimation } from '@/net/validate';
export default {
    name: 'Index',
    data() {
        return {
            formHeader: {
                factory: '',
                materialCode: ''
            },
            factoryName: '',
            factory: [],
            materialList: [],
            dataList: [],
            dialogVisibleAdd: false,
            formAdd: {
                remark: ''
            },
            Addrulestar: {
                materialCode: [{ required: true, message: '请选择物料', trigger: 'blur' }],
                ratio: [{ required: true, message: '请填写比例', trigger: 'blur' }]
            },
            postUrl: '',
            multipleSelection: []
        };
    },
    computed: {
        mainClientHeight: {
            get() {
                return this.$store.state.common.mainClientHeight;
            }
        }
    },
    watch: {
        'formHeader.factory'(n) {
            this.GetMaterialCodeList(n);
        }
    },
    mounted() {
        headanimation(this.$);
        this.Getdeptcode();
    },
    methods: {
        // 获取工厂
        Getdeptcode() {
            this.materialList = [];
            this.dataList = [];
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    this.formHeader.factory = data.typeList[0].deptId;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取物料
        GetMaterialCodeList(id) {
            if (id) {
                this.dataList = [];
                this.$http(`${BASICDATA_API.MATERIAL_LIST}`, 'POST', {
                    factory: id,
                    materialTypeCode: 'ZHAL'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.materialList = data.list;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 查询
        GetList() {
            if (!this.formHeader.factory) {
                this.$warningToast('请选择工厂');
                return false;
            }
            this.$http(`${BASICDATA_API.STERILIZEMATERIALRATIOLIST}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.list;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        AddInfo() {
            this.formAdd = {
                id: '',
                factory: this.formHeader.factory,
                materialName: '',
                materialCode: '',
                ratio: '',
                remark: ''
            };
            this.factoryName = this.factory.find(item => item.deptId === this.formHeader.factory)['deptName'];
            this.dialogVisibleAdd = true;
        },
        AddSave(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.formAdd.materialName = this.materialList.find(item => item.materialCode === this.formAdd.materialCode)['materialName'];
                    let msgText = '保存成功';
                    if (this.formAdd.id !== '') {
                        this.postUrl = BASICDATA_API.STERILIZEMATERIALRATIOUPDATE_API;
                    } else {
                        this.postUrl = BASICDATA_API.STERILIZEMATERIALRATIOSAVE_API;
                        msgText = '提交成功';
                    }
                    this.$http(this.postUrl, 'POST', this.formAdd).then(({ data }) => {
                        if (data.code === 0) {
                            this.$notify({
                                title: '成功',
                                message: msgText,
                                type: 'success'
                            });
                            this.dialogVisibleAdd = false;
                            this.$refs[formName].resetFields();
                            this.GetList();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        EditInfo(row) {
            this.factoryName = row.factoryName;
            this.formAdd = row;
            this.dialogVisibleAdd = true;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        DeleteInfo() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请勾选数据');
                return false;
            }
            this.$confirm('确认要删除数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(`${BASICDATA_API.STERILIZEMATERIALRATIODELETE_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        this.GetList();
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        }
    }
};
</script>

<style scoped lang="scss">
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

.el-form {
    .el-form-item.el-form-item--small {
        margin-bottom: 18px;
    }
}

</style>
