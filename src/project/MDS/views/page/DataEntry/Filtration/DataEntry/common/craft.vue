<template>
    <div>
        <el-card>
            <el-row :gutter="20">
                <el-col v-for="(item, index) in filterList" :key="index" :span="8">
                    <div class="grid-content">
                        <el-row style="flex-grow: 1;">
                            <el-col :span="10" style="padding-left: 16px;">
                                <div class="title">
                                    {{ item.deviceName }}
                                </div>
                                <div class="content">
                                    请点击下方操作按钮，<br>进行相应操作
                                </div>
                            </el-col>
                            <el-col :span="14">
                                <img src="@/assets/img/Filtration.png" alt="" style="width: 92%; margin-top: 19px; margin-bottom: 10px;">
                            </el-col>
                        </el-row>
                        <el-row class="bottoms">
                            <el-col>
                                <el-button class="buttons" size="small" :disabled="!isRedact || soleStatus" @click="ShowDialog(item)">
                                    数据录入
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
            <el-table :data="techList" :row-class-name="rowDelFlag" class="newTable" border header-row-class-name="tableHead" style="margin-top: 10px;" @row-dblclick="EditTechInfo">
                <el-table-column type="index" label="序号" width="50" fixed />
                <el-table-column label="过滤机号" show-overflow-tooltip width="120" prop="deviceName" />
                <el-table-column label="过滤前温度(°C)" prop="filterBefTem" />
                <el-table-column label="过滤前压力(Mpa)" prop="filterBefPre" />
                <el-table-column label="过滤后压力(Mpa)" prop="filterEndPre" />
                <el-table-column label="感官指标有无异常" prop="abnormal" />
                <el-table-column label="回压数量(方)" prop="backPreNum" />
                <el-table-column label="助滤剂预涂量(kg) " prop="filterAidBef" />
                <el-table-column label="助滤剂添加量(kg)" prop="filterAidAdd" />
                <el-table-column label="备注" show-overflow-tooltip prop="remark" />
                <el-table-column label="操作时间" show-overflow-tooltip width="165" prop="changed" />
                <el-table-column label="操作人" show-overflow-tooltip width="140" prop="changer" />
                <el-table-column width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" :disabled="!isRedact || soleStatus" size="mini" @click="DelRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <mds-card title="辅料领用" name="supMaterialList">
            <el-table :data="supMaterialList" border class="newTable" header-row-class-name="tableHead">
                <el-table-column type="index" label="序号" width="50" fixed />
                <el-table-column label="过滤机号" show-overflow-tooltip min-width="120" prop="deviceName" />
                <el-table-column label="物料" show-overflow-tooltip min-width="200">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.materialCode" :disabled="!isRedact || soleStatus" size="small">
                            <el-option v-for="(item, index) in filterAidMaterialList" :key="index" :label="item.VALUE + ' ' + item.CODE" :value="item.CODE" />
                        </el-select>
                        <!-- {{scope.row.materialCode}} {{scope.row.materialName}} -->
                    </template>
                </el-table-column>
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.isSplit === '0'" type="text" :disabled="!isRedact || soleStatus" @click="SplitData(scope.row, scope.$index)">
                            <em class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column min-width="110">
                    <template slot="header">
                        <em class="reqI">*</em>
                        <span>过滤剂用量</span>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.filterAidAmount" :disabled="!isRedact || soleStatus" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="unit" min-width="50" />
                <el-table-column min-width="140">
                    <template slot="header">
                        <em class="reqI">*</em>
                        <span>批次</span>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.batch" :disabled="!isRedact || soleStatus" maxlength="10" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="助滤剂型号" min-width="130">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.filterAidModel" :disabled="!isRedact || soleStatus" size="small">
                            <el-option v-for="(item, index) in filterAidModelList" :key="index" :label="item.VALUE" :value="item.VALUE" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="助滤剂厂家" show-overflow-tooltip min-width="140">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.filterAidVender" :disabled="!isRedact || soleStatus" size="small">
                            <el-option v-for="(item, index) in filterAidVenderList" :key="index" :label="item.VALUE" :value="item.VALUE" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="备注" show-overflow-tooltip min-width="120" prop="remark" />
                <el-table-column width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.isSplit === '1'" class="delBtn" type="text" icon="el-icon-delete" size="mini" circle :disabled="!isRedact || soleStatus" @click="DelMaterial(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="450px" custom-class="dialog__class">
            <div slot="title">
                {{ techInfo.deviceName }}
            </div>
            <el-form ref="techInfo" :model="techInfo" size="small" label-width="160px" @keyup.enter.native="SaveDialog('techInfo')">
                <el-form-item label="过滤前温度(℃)：">
                    <el-input v-model="techInfo.filterBefTem" style="width: 220px;" />
                </el-form-item>
                <el-form-item label="过滤前压力(Mpa)：">
                    <el-input v-model="techInfo.filterBefPre" style="width: 220px;" />
                </el-form-item>
                <el-form-item label="过滤后压力(Mpa)：">
                    <el-input v-model="techInfo.filterEndPre" style="width: 220px;" />
                </el-form-item>
                <el-form-item label="感官指标有无异常：">
                    <el-select v-model="techInfo.abnormal" style="width: 220px;">
                        <el-option v-for="(item, index) in abnormalList" :key="index" :value="item" :label="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="回压数量(方)：">
                    <el-input v-model="techInfo.backPreNum" style="width: 220px;" />
                </el-form-item>
                <el-form-item label="助滤剂预涂量(kg)：">
                    <el-input v-model="techInfo.filterAidBef" min="0" onkeyup="value=value.replace(/[^\d]+/g,'')" style="width: 220px;" />
                </el-form-item>
                <el-form-item label="助滤剂添加量(kg)：">
                    <el-input v-model="techInfo.filterAidAdd" min="0" onkeyup="value=value.replace(/[^\d]+/g,'')" style="width: 220px;" />
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="techInfo.remark" style="width: 220px;" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="SaveDialog('techInfo')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { dateFormat, accAdd } from '@/net/validate';
import { FILTRATION_API, AUDIT_API } from '@/api/api';
export default {
    name: 'Equworkinghours',
    props: {
        isRedact: {
            type: Boolean
            }
        },
    data() {
        return {
            dialogVisible: false,
            filterList: [],
            techList: [],
            techInfo: {},
            abnormalList: ['澄清', '浑浊'],
            techInforules: {
                filterBefTem: [{ required: true, message: '必填', trigger: 'blur' }],
                filterBefPre: [{ required: true, message: '必填', trigger: 'blur' }],
                filterEndPre: [{ required: true, message: '必填', trigger: 'blur' }],
                abnormal: [{ required: true, message: '必填', trigger: 'blur' }],
                backPreNum: [{ required: true, message: '必填', trigger: 'blur' }],
                filterAidBef: [{ required: true, message: '必填', trigger: 'blur' }],
                filterAidAdd: [
                    { required: true, message: '必填', trigger: 'blur' }
                    // {validator: (rule, value, callback) => {
                    //   if (value < 0) {
                    //     return callback(new Error('不能为负数'))
                    //   }
                    // },
                    // trigger: 'blur' }
                ]
            },
            supMaterialList: [],
            supMaterialListS: [],
            orderId: '',
            delSupMater: {},
            filterAidMaterialList: [],
            filterAidModelList: [],
            filterAidVenderList: [],
            soleStatus: false,
            craftStatus: ''
        };
    },
    watch: {
        // 'techInfo.filterAidAdd' (n, o) {
        //   this.techInfo.filterAidAdd = this.techInfo.filterAidAdd.replace(/^[0]+/, '')
        // }
    },
    methods: {
        GetList(params) {
            this.orderId = params.orderId;
            this.$http(`${FILTRATION_API.FILTER_CRAFT_LIST}`, 'POST', params)
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.filterList = data.listInfo.filterList;
                        this.techList = data.listInfo.techList;
                        this.supMaterialList = data.listInfo.supMaterial;
                        this.techList.map(item => {
                            item.uid = item.id;
                        });
                        if (this.techList.length > 0) {
                            this.craftStatus = this.techList[0].status;
                            if (this.techList[0].status === 'submit') {
                                this.soleStatus = true;
                            }
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                })
                .finally(() => {
                    this.$emit('setCraftStatus', this.craftStatus);
                });
            // 过滤机详细信息
            this.$http(`${FILTRATION_API.FILTER_CRAFT_MATERIALIST}`, 'POST').then(({ data }) => {
                if (data.code === 0) {
                    this.filterAidMaterialList = data.materialInfo.material;
                    this.filterAidModelList = data.materialInfo.materialType;
                    this.filterAidVenderList = data.materialInfo.materialSupplier;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        ShowDialog(item) {
            this.techInfo = {
                xiu: 0,
                orderId: this.orderId,
                id: '',
                uid: this.uuid(),
                deviceName: item.deviceName,
                filterMachineId: item.deviceId,
                filterNo: item.deviceNo.substring(item.deviceNo.length - 2),
                filterAidAdd: 0,
                abnormal: '澄清',
                backPreNum: '',
                filterAidBef: '',
                filterBefTem: '',
                filterEndPre: '',
                delFlag: '0',
                status: '',
                materialCode: item.materialCode,
                materialName: item.materialName,
                materialUnit: item.materialUnit,
                materialSupplier: item.materialSupplier,
                materialType: item.materialType,
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
            };
            this.dialogVisible = true;
        },
        SaveDialog(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let currentRecord = [];
                    currentRecord = this.techList.filter(data => data.uid === this.techInfo.uid);
                    if (currentRecord && currentRecord.length > 0) {
                        Object.assign(currentRecord[0], this.techInfo);
                        this.SupMaterDel(this.techInfo);
                        this.dialogVisible = false;
                        return false;
                    }
                        this.techList.push(this.techInfo);
                        // 新增
                        if (Number(this.techInfo.filterAidAdd) + Number(this.techInfo.filterAidBef) > 0) {
                            if (this.supMaterialList.findIndex(item => item.filterMachineId === this.techInfo.filterMachineId) === -1) {
                                this.supMaterialList.splice(this.supMaterialList.filter(t => t.filterNo < this.techInfo.filterNo).length, 0, {
                                    orderId: this.orderId,
                                    filterNo: this.techInfo.filterNo,
                                    deviceName: this.techInfo.deviceName,
                                    filterAidAmount: Number(this.techInfo.filterAidBef) + Number(this.techInfo.filterAidAdd),
                                    materialCode: this.filterAidMaterialList[0].CODE,
                                    materialName: this.filterAidMaterialList[0].VALUE,
                                    unit: 'KG',
                                    batch: '',
                                    isSplit: '0',
                                    filterAidModel: this.filterAidModelList[0].VALUE,
                                    filterAidVender: this.filterAidVenderList[0].VALUE,
                                    filterMachineId: this.techInfo.filterMachineId
                                });
                                // this.supMaterialList.push({
                                //   orderId: this.orderId,
                                //   filterNo: this.techInfo.filterNo,
                                //   deviceName: this.techInfo.deviceName,
                                //   filterAidAmount: Number(this.techInfo.filterAidBef) + Number(this.techInfo.filterAidAdd),
                                //   materialCode: this.filterAidMaterialList[0].CODE,
                                //   materialName: this.filterAidMaterialList[0].VALUE,
                                //   unit: 'KG',
                                //   batch: '',
                                //   isSplit: '0',
                                //   filterAidModel: this.filterAidModelList[0].VALUE,
                                //   filterAidVender: this.filterAidVenderList[0].VALUE,
                                //   filterMachineId: this.techInfo.filterMachineId
                                // })
                                this.dialogVisible = false;
                                return false;
                            }
                                // 是否拆分过
                                if (this.supMaterialList.findIndex(item => item.filterMachineId === this.techInfo.filterMachineId && item.isSplit === '1') === -1) {
                                    this.SupMaterDel(this.techInfo);
                                    this.dialogVisible = false;
                                    return false;
                                }
                                    for (const item of this.supMaterialList) {
                                        if (item.filterMachineId === this.techInfo.filterMachineId && (item.batch === '' || item.batch === null)) {
                                            item.filterAidAmount = Number(item.filterAidAmount) + Number(this.techInfo.filterAidBef) + Number(this.techInfo.filterAidAdd);
                                            this.dialogVisible = false;
                                            return false;
                                        }
                                    }


                        } else {
                            this.dialogVisible = false;
                        }

                } else {
                    return false;
                }
            });
        },
        EditTechInfo(row) {
            if (this.isRedact && !this.soleStatus) {
                this.dialogVisible = true;
                row.xiu = 1;
                this.techInfo = Object.assign({}, row);
            }
        },
        SplitData(row, index) {
            this.supMaterialList.splice(index + 1, 0, {
                orderId: this.orderId,
                filterNo: row.filterNo,
                deviceName: row.deviceName,
                materialCode: row.materialCode,
                materialName: row.materialName,
                filterAidAmount: '',
                unit: 'KG',
                batch: '',
                isSplit: '1',
                filterAidModel: row.filterAidModel,
                filterAidVender: row.filterAidVender,
                remark: row.remark,
                filterMachineId: row.filterMachineId
            });
        },
        // 辅料删除
        DelMaterial(row) {
            this.$confirm('此操作将删除这条数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let sum = 0;
                for (const item of this.supMaterialList) {
                    if (row.filterMachineId === item.filterMachineId) {
                        sum = sum + 1;
                    }
                }
                if (sum > 1) {
                    this.supMaterialList.splice(this.supMaterialList.indexOf(row), 1);
                    return false;
                }
                    this.$warningToast('最后一条禁止删除');
                    return false;

            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        SaveTech(str, resolve, reject) {
            this.techList.forEach(item => {
                if (item.status) {
                    if (item.status === 'saved') {
                        item.status = str;
                    } else if (item.status === 'noPass' && str === 'submit') {
                        item.status = str;
                    }
                } else {
                    item.status = str;
                }
            });
            this.$http(`${FILTRATION_API.FILTER_CRAFT_TECHSAVE}`, 'POST', this.techList)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$errorToast(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        SaveMaterial(resolve, reject) {
            this.supMaterialList.map(item => {
                item.materialName = this.filterAidMaterialList.find(items => items.CODE === item.materialCode).VALUE;
            });
            this.$http(`${FILTRATION_API.FILTER_CRAFT_MATERIALSAVE}`, 'POST', [{ orderId: this.orderId, materialInfo: this.supMaterialList }])
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$errorToast(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        aidSubmit(str, id, resolve, reject) {
            this.supMaterialList.map(item => {
                item.materialName = this.filterAidMaterialList.find(items => items.CODE === item.materialCode).VALUE;
                item.workShop = id;
            });
            this.$http(`${AUDIT_API.AUDIT_AID_SUBMIT}`, 'POST', [{ orderId: this.orderId, materialInfo: this.supMaterialList }])
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$errorToast(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        DelRow(row) {
            this.$confirm('此操作将删除这条数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$set(row, 'delFlag', 1)
                this.$successToast('删除成功');
                this.SupMaterDel(row);
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
                return '';

        },
        // 主料删除 辅料汇总一条
        SupMaterDel(row) {
            let filterAidAmount = 0;
            this.supMaterialList = this.supMaterialList.filter(item => item.filterMachineId !== row.filterMachineId);
            this.techList.map(item => {
                if (row.filterMachineId === item.filterMachineId && item.delFlag === '0') {
                    filterAidAmount += Number(item.filterAidBef) + Number(item.filterAidAdd);
                }
            });
            if (filterAidAmount > 0) {
                this.supMaterialList.splice(this.supMaterialList.filter(t => t.filterNo < row.filterNo).length, 0, {
                    orderId: row.orderId,
                    deviceName: row.deviceName,
                    filterNo: row.filterNo,
                    filterAidAmount: filterAidAmount,
                    materialCode: this.filterAidMaterialList[0].CODE,
                    materialName: this.filterAidMaterialList[0].VALUE,
                    unit: 'KG',
                    batch: '',
                    isSplit: '0',
                    filterAidModel: this.filterAidModelList[0].VALUE,
                    filterAidVender: this.filterAidVenderList[0].VALUE,
                    filterMachineId: this.techInfo.filterMachineId
                });
                // this.supMaterialList.push({
                //   orderId: row.orderId,
                //   deviceName: row.deviceName,
                //   filterNo: row.filterNo,
                //   filterAidAmount: filterAidAmount,
                //   materialCode: this.filterAidMaterialList[0].CODE,
                //   materialName: this.filterAidMaterialList[0].VALUE,
                //   unit: 'KG',
                //   batch: '',
                //   isSplit: '0',
                //   filterAidModel: this.filterAidModelList[0].VALUE,
                //   filterAidVender: this.filterAidVenderList[0].VALUE,
                //   filterMachineId: this.techInfo.filterMachineId
                // })
            }
        },
        // 提交验证
        Readyrules() {
            let ty = true;
            let i = 0;
            this.techList.map(item => {
                if (item.delFlag === '0') {
                    i = 1;
                }
            });
            if (i === 0) {
                ty = false;
                this.$warningToast('请录入工艺控制数据');
                return false;
            }
            let totalSum = 0;
            for (const item of this.techList) {
                if (item.delFlag === '0') {
                    if (
                        item.filterBefTem === '' ||
                        item.filterBefTem === null ||
                        item.filterBefPre === '' ||
                        item.filterBefPre === null ||
                        item.filterEndPre === '' ||
                        item.filterEndPre === null ||
                        item.abnormal === '' ||
                        item.abnormal === null ||
                        item.backPreNum === '' ||
                        item.backPreNum === null ||
                        item.filterAidBef === '' ||
                        item.filterAidBef === null ||
                        item.filterAidAdd === '' ||
                        item.filterAidAdd === null
                    ) {
                        ty = false;
                        this.$warningToast('请补全工艺必填项');
                        return false;
                    }
                    totalSum = accAdd(accAdd(totalSum, item.filterAidBef), item.filterAidAdd);
                }
            }
            if (totalSum !== 0 && this.supMaterialList.length === 0) {
                ty = false;
                this.$warningToast('辅料领用不能为空');
                return false;
            }
            for (const item of this.supMaterialList) {
                if (item.filterAidAmount === '' || !item.filterAidAmount || item.batch === '' || !item.batch) {
                    ty = false;
                    this.$warningToast('工艺控制中辅料领用必填项不能为空');
                    return false;
                }
            }
            const techTotal = [];
            this.techList.map(item => {
                const Record = techTotal.filter(data => data.id === item.filterMachineId);
                if (Record && Record.length > 0) {
                    techTotal.find(items => items.id === item.filterMachineId).sum = Number(techTotal.find(items => items.id === item.filterMachineId).sum) + Number(item.filterAidBef) + Number(item.filterAidAdd);
                } else {
                    techTotal.push({
                        id: item.filterMachineId,
                        sum: Number(item.filterAidBef) + Number(item.filterAidAdd)
                    });
                }
            });
            const SupMaTotal = [];
            this.supMaterialList.map(item => {
                const RecordSup = SupMaTotal.filter(data => data.id === item.filterMachineId);
                if (RecordSup && RecordSup.length > 0) {
                    SupMaTotal.find(items => items.id === item.filterMachineId).sum = Number(SupMaTotal.find(items => items.id === item.filterMachineId).sum) + Number(item.filterAidAmount);
                } else {
                    SupMaTotal.push({
                        id: item.filterMachineId,
                        sum: item.filterAidAmount,
                        deviceName: item.deviceName
                    });
                }
            });
            for (const item of SupMaTotal) {
                if (item.sum !== techTotal.find(items => items.id === item.id).sum) {
                    ty = false;
                    this.$warningToast(item.deviceName + ' 剂用量不相等');
                    return false;
                }
            }
            return ty;
        },
        SubmitMaterial(resolve, reject) {
            this.$http(`${FILTRATION_API.FILTER_CRAFT_MATERIASUBMIT}`, 'POST', this.techList)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$errorToast(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.rowDel {
    display: none;
}
.grid-content {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    border: 1px solid rgba(233, 233, 233, 1);
    border-radius: 2px;
    .title {
        margin-top: 20px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
        font-size: 14px;
        line-height: 24px;
    }
    .content {
        margin-top: 7px;
        color: rgba(153, 153, 153, 1);
        font-weight: 400;
        font-size: 12px;
        line-height: 22px;
    }
    .bottoms {
        width: 95%;
        margin: 0 auto;
        .buttons {
            width: 100%;
            margin: 10px 0;
            color: #000;
            background-color: #fff;
            border-color: #d9d9d9;
        }
        .buttons:hover {
            color: #fff;
            background-color: #1890ff;
        }
        .buttons.is-disabled:hover {
            color: #000;
            background-color: #fff;
            border-color: #d9d9d9;
            cursor: not-allowed;
        }
    }
}
.audit {
    line-height: 40px;
    em {
        float: left;
        font-size: 22px;
    }
    span {
        margin-left: 12px;
        font-weight: 600;
        font-size: 16px;
    }
}
</style>
