<!--生产入库-->
<template>
    <div>
        <!--数据录入-->
        <mds-card :title="'物料领用'" :name="'material'">
            <el-row :gutter="10" class="cardList">
                <el-col v-for="(sole, index) in WheatCangList" :key="index" :span="12">
                    <el-card class="card-item">
                        <div slot="header">
                            小麦罐号：{{ sole.holderName }}
                            <el-button type="primary" size="small" :disabled="!isRedact || applyMaterielState == 'submit' || applyMaterielState == 'checked'" style="float: right; margin-top: -8px;" @click="receive(sole.holderName, sole.holderId)">
                                立即领用
                            </el-button>
                        </div>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <div class="card-item-color-lump" style="background: #ffbf00;">
                                    <span class="card-item-color-lump_icon iconfont factory-chuguan1" />
                                    <div class="card-item-color-lump__img">
                                        <div class="card-item-color-lump__img__box">
                                            <div class="card-item-color-lump__img__box__bg" style="height: 70%;" />
                                        </div>
                                        <img src="@/assets/img/ui2.0/pot.png" alt="">
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="card-item-color-lump">
                                    <span class="card-item-color-lump_icon iconfont factory-zongliangguanli" />
                                    <p class="card-item-color-lump_text">
                                        <span>{{ sole.cangtotal }}</span>KG
                                    </p>
                                    <p class="card-item-color-lump_text">
                                        库存总量
                                    </p>
                                </div>
                            </el-col>
                        </el-row>
                        <div class="card-item-color-lump_text">
                            <p class="card-item-color-lump_text__title">
                                <em class="card-item-color-lump_text__icon" />
                                <span>库存明细</span>
                            </p>
                            <el-table :data="sole.wheatData" header-row-class-name="card-item-color-lump_text__table__head" class="card-item-color-lump_text__table" height="165">
                                <el-table-column prop="batch" width="auto">
                                    <template slot="header">
                                        <em class="iconfont factory-pici" style="margin-right: 5px;" />批次
                                    </template>
                                </el-table-column>
                                <el-table-column prop="currentQuantity" width="auto" header-align="left">
                                    <template slot="header">
                                        <em class="iconfont factory-shuliang" style=" margin-right: 5px; font-size: 18px;" />数量
                                    </template>
                                    <template slot-scope="scope">
                                        {{ (scope.row.currentQuantity * 1).toLocaleString() }} KG
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :data="materielDataList" :row-class-name="rowDelFlag" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @row-dblclick="editReceive">
                <el-table-column label="物料">
                    <template slot-scope="scope">
                        {{ scope.row.materialName }} {{ scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column label="粮仓" :show-overflow-tooltip="true" prop="holderName" />
                <el-table-column label="物料批次" prop="batch" />
                <el-table-column width="160" label="小麦领用数" prop="wheatWeight" />
                <el-table-column label="单位" width="120" prop="weightUnit" />
                <!-- <el-table-column label="备注" width="160" prop="remark"></el-table-column> -->
                <el-table-column fixed="right" label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" @click="dellistbomS(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px;">
                <span>领用数合计：</span>{{ totalInstock }} KG
            </div>
        </mds-card>
        <!--审批-->
        <auditLog :table-data="readAudit" />
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogFormVisible" width="450px" :show-close="false">
            <el-form ref="cang" :model="cang" size="small" :rules="cangrules">
                <el-form-item label="领用粮仓：" :label-width="formLabelWidth">
                    {{ cang.holderName }}
                </el-form-item>
                <el-form-item label="批次：" :label-width="formLabelWidth" prop="batch">
                    <el-select v-model="cang.batch" @change="changeBatchFeomDialog()">
                        <el-option v-for="(sole, index) in piciList" :key="index" :label="sole.batch" :value="sole.batch" />
                    </el-select>
                </el-form-item>
                <el-form-item label="物料：" :label-width="formLabelWidth">
                    {{ cang.materialName }} {{ cang.materialCode }}
                </el-form-item>
                <el-form-item label="剩余量（KG）：" :label-width="formLabelWidth">
                    {{ cang.currentQuantity }}
                </el-form-item>
                <el-form-item label="数量（KG）：" :label-width="formLabelWidth" prop="wheatWeight">
                    <el-input v-model.number="cang.wheatWeight" on-keypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="操作时间：" :label-width="formLabelWidth">
                    {{ cang.changed }}
                </el-form-item>
                <el-form-item label="操作人：" :label-width="formLabelWidth">
                    {{ cang.changer }}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogClear('cang')">
                    取 消
                </el-button>
                <el-button type="primary" @click="dialogSave('cang')">
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { dateFormat } from '@/net/validate';
    import { WHT_API, BASICDATA_API, SYSTEMSETUP_API } from '@/api/api';
    export default {
        components: {
            AuditLog: resolve => {
                require(['@/views/components/AuditLog'], resolve);
            }
        },
        props: {
            isRedact: {
                type: Boolean
            },
            applyMaterielState: {
                type: String,
                default: ''
            },
            order: {
                type: Object,
                default: () => { return {} }
            }
        },
        data() {
            return {
                materialDictList: [],
                wheatContainerList: [],
                readAudit: [],
                materielDataList: [],
                WheatCangList: [],
                dialogFormVisible: false,
                dialogTitle: '',
                formLabelWidth: '150px',
                cang: {},
                cangrules: {
                    batch: [{ required: true, message: '请选择批次', trigger: 'change' }],
                    wheatWeight: [
                        { required: true, message: '请填写数量', trigger: 'blur' },
                        { type: 'number', message: '必须为数字' }
                    ]
                },
                piciList: {},
                materielDataListArray: [
                    {
                        batch: '',
                        quantotal: 0
                    }
                ]
            };
        },
        computed: {
            totalInstock: function() {
                let total = 0;
                for (const ele of this.materielDataList) {
                    if (ele.delFlag === '0' && typeof ele.wheatWeight === 'number') {
                        total += parseFloat(ele.wheatWeight);
                    }
                }
                return total;
            }
        },
        mounted() {
            this.getMaterialDictList();
            this.getWheatContainerList();
            // this.getMaterielDataList()
            // this.GetWheatCang()
        },
        methods: {
            // 保存
            saveMateriel(resolve) {
                if (this.materielDataList.length > 0) {
                    this.materielDataList.forEach(item => {
                        // 应产品要求，如果对不通过数据做修改保存操作，页签状态还是未通过，故此处不做状态赋值。
                        // if (item.status !== 'submit' || item.status !== 'checked') {
                        //   item.status = 'saved'
                        // }
                        // 新增行赋值saved
                        if (typeof item.status === 'undefined' || item.status === null || item.status.trim() === '') {
                            item.status = 'saved';
                        }
                    });
                    this.$http(WHT_API.APPLYMATERIELSAVE_API, 'POST', this.materielDataList)
                        .then(({ data }) => {
                            if (data.code === 0) {
                                //
                            } else {
                                this.$errorToast(data.msg);
                            }
                            if (resolve) {
                                resolve('resolve');
                            }
                        })
                        .catch(error => {
                            console.log('catch data::', error);
                        });
                } else if (resolve) {
                    resolve('resolve');
                }
            },
            // 物料提交
            submitMateriel(resolve) {
                if (this.materielDataList.length > 0) {
                    this.materielDataList.forEach(item => {
                        if (item.status !== 'checked') {
                            item.status = 'submit';
                        }
                        item.factory = this.order.factory;
                        item.workShop = this.order.workShop;
                    });
                    this.$http(`${WHT_API.APPLYMATERIELSUBMIT_API}`, 'POST', this.materielDataList)
                        .then(({ data }) => {
                            if (data.code === 0) {
                                //
                            } else {
                                this.$errorToast(data.msg);
                            }
                            if (resolve) {
                                resolve('resolve');
                            }
                        })
                        .catch(error => {
                            console.log('catch data::', error);
                        });
                } else if (resolve) {
                    resolve('resolve');
                }
            },
            validate() {
                // if (this.materielDataList === undefined || this.materielDataList.length === 0) {
                if (typeof this.materielDataList === 'undefined' || this.materielDataList.filter(item => item.delFlag === '0').length === 0) {
                    this.$warningToast('物料领用未录入数据');
                    return false;
                }
                for (const item of this.materielDataList) {
                    if (item.delFlag === '0') {
                        if (item.materialCode === null || item.materialCode.trim() === '') {
                            this.$warningToast('物料不能为空');
                            return false;
                        }
                        if (item.deviceId === null || item.deviceId === '') {
                            this.$warningToast('粮仓不能为空');
                            return false;
                        }
                        if (item.batch === null || item.batch.trim() === '') {
                            this.$warningToast('物料批次不能为空');
                            return false;
                        }
                        if (item.batch.trim().length > 10) {
                            this.$warningToast('物料批次长度不能超过10');
                            return false;
                        }
                        if (item.wheatWeight === '') {
                            this.$warningToast('小麦领用数不能为空');
                            return false;
                        }
                        if (item.wheatWeight <= 0) {
                            this.$warningToast('小麦领用数必须大于0');
                            return false;
                        }
                    }
                }
                return true;
            },
            // 粮仓
            /* eslint-disable @typescript-eslint/camelcase*/
            getWheatContainerList() {
                this.wheatContainerList = [];
                if (typeof this.order === 'undefined' || typeof this.order.workShopName === 'undefined') {
                    return;
                }
                const params = {
                    type: 'holder_type',
                    holder_type: '002',
                    // holder_no: '001',
                    pageSize: 9999,
                    workShopName: this.order.workShopName,
                    currPage: 1
                };
                this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', params)
                    .then(({ data }) => {
                        if (data.code === 0) {
                            this.wheatContainerList = data.page.list;
                        } else {
                            this.$errorToast(data.msg);
                        }
                    })
                    .catch(error => {
                        console.log('catch data::', error);
                    });
            },
            /* eslint-enable @typescript-eslint/camelcase*/
            // 物料选项
            getMaterialDictList() {
                this.materialDictList = [];
                this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { factory: this.$store.state.common.FWfactoryid, type: 'CM_material' })
                    .then(({ data }) => {
                        if (data.code === 0) {
                            this.materialDictList = data.dicList;
                        } else {
                            this.$errorToast(data.msg);
                        }
                    })
                    .catch(error => {
                        console.log('catch data::', error);
                    });
            },
            // 获取物料数据
            /* eslint-disable @typescript-eslint/camelcase*/
            getMaterielDataList(orderId) {
                this.materielDataList = [];
                this.readAudit = [];
                // if (typeof this.order === 'undefined' || typeof this.order.orderId === 'undefined') {
                //   return
                // }
                let inState = '';
                this.$http(`${WHT_API.APPLYMATERIELLIST_API}`, 'POST', { order_id: orderId })
                    .then(({ data }) => {
                        if (data.code === 0) {
                            // success
                            this.materielDataList = data.listForm;
                            this.readAudit = data.listApproval;
                            let no = 0;
                            let sub = 0;
                            let che = 0;
                            let sav = 0;
                            this.materielDataList.forEach(item => {
                                if (item.status === 'noPass') {
                                    no = no + 1;
                                } else if (item.status === 'submit') {
                                    sub = sub + 1;
                                } else if (item.status === 'checked') {
                                    che = che + 1;
                                } else if (item.status === 'saved') {
                                    sav = sav + 1;
                                }
                                // 获取每个批次当前在list中使用的总和
                                if (this.materielDataListArray.find(items => items.batch === item.batch)) {
                                    this.materielDataListArray.find(items => items.batch === item.batch).quantotal += item.wheatWeight;
                                } else {
                                    this.materielDataListArray.push({
                                        batch: item.batch,
                                        quantotal: item.wheatWeight
                                    });
                                }
                            });
                            if (no > 0) {
                                inState = 'noPass';
                            } else if (sub > 0) {
                                inState = 'submit';
                            } else if (sav > 0) {
                                inState = 'saved';
                            } else if (che > 0) {
                                inState = 'checked';
                            }
                        } else {
                            this.$errorToast(data.msg);
                        }
                    })
                    .catch(error => {
                        this.$notify.error({ title: '错误', message: error });
                    })
                    .finally(() => {
                        this.$emit('setApplyMaterielState', inState);
                    });
            },
            /* eslint-enable @typescript-eslint/camelcase*/
            // 新增
            addNewRecord() {
                // 复制上一条数据的手动录入部分
                const lastArr = this.materielDataList.filter(item => {
                    return item.delFlag === '0';
                });
                const last = lastArr && lastArr.length > 0 ? lastArr[lastArr.length - 1] : null;
                this.materielDataList.push({
                    id: '',
                    orderId: this.order.orderId,
                    // 物料编码默认值
                    materialCode: last ? last.materialCode : '',
                    materialName: last ? last.materialName : '',
                    // 粮仓号
                    deviceId: last ? last.deviceId : '',
                    // 粮仓名称
                    holderName: last ? last.holderName : '',
                    // 批次号
                    batch: last ? last.batch : '',
                    wheatWeight: last ? last.wheatWeight : 0,
                    weightUnit: 'KG',
                    remark: last ? last.remark : '',
                    delFlag: '0'
                });
            },
            // 删除
            dellistbomS(row) {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    row.delFlag = '1';
                }).catch(() => {
                    // this.$infoToast('已取消删除');
                });
            },
            //  RowDelFlag
            rowDelFlag({ row }) {
                if (row.delFlag === '1') {
                    return 'rowDel';
                }
                return '';
            },
            changeWheatContainer(row) {
                const ele = this.wheatContainerList.find(item => item.holderId === row.deviceId);
                if (ele) {
                    row.holderName = ele.holderName;
                }
            },
            changeProduct: function(row) {
                const ele = this.materialDictList.find(item => item.code === row.materialCode);
                if (ele) {
                    row.materialName = ele.value;
                }
            },
            // saveOrSubmitMateriel (str, resolve) {
            //   if (this.materielDataList.length > 0) {
            //     console.log(this.materielDataList)
            //     if (resolve) {
            //       resolve('resolve')
            //     }
            //   }
            // }
            // 粮仓列表
            GetWheatCang() {
                this.$http(`${WHT_API.WHEATCANGLIST_API}`, 'POST', { factory: this.order.factory, workShop: this.order.workShop }).then(({ data }) => {
                    if (data.code === 0) {
                        this.WheatCangList = data.holder;
                        this.WheatCangList.map(item => {
                            item.cangtotal = 0;
                            item.wheatData.map(items => {
                                item.cangtotal = item.cangtotal + items.currentQuantity;
                                this.materielDataListArray.push({
                                    batch: items.batch,
                                    quantotal: 0
                                });
                            });
                        });
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            },
            // 立即领用弹框
            receive(holderName, holderId) {
                this.cang = {};
                this.dialogTitle = holderName + '领用';
                this.dialogFormVisible = true;
                this.piciList = this.WheatCangList.find(item => item.holderId === holderId).wheatData;
                this.cang = {
                    uid: this.uuid(),
                    id: '',
                    orderId: this.order.orderId,
                    deviceId: holderId,
                    holderName: holderName,
                    weightUnit: 'KG',
                    changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    remark: '',
                    delFlag: '0'
                };
                this.$nextTick(() => {
                    // 清除前一个送出领用的检验
                    this.$refs['cang'].clearValidate();
                })
            },
            // 修改弹框
            editReceive(row) {
                if (this.isRedact) {
                    this.dialogFormVisible = true;
                    this.piciList = this.WheatCangList.find(item => item.holderId === row.deviceId).wheatData;
                    const picisole = this.piciList.find(item => item.batch === row.batch);
                    row.currentQuantity = picisole.currentQuantity;
                    this.cang = Object.assign({}, row);
                }
            },
            // 立即领用弹框保存
            dialogSave(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        // 领用数是否大于剩余量
                        let total = 0;
                        let currentRecord = [];
                        if (Object.prototype.hasOwnProperty.call(this.cang, 'uid')) {
                            // 新增行
                            this.materielDataList.map(item => {
                                if (item.delFlag === '0' && item.batch === this.cang.batch && item.uid !== this.cang.uid) {
                                    total = total + item.wheatWeight;
                                }
                            });
                            currentRecord = this.materielDataList.filter(data => data.uid === this.cang.uid);
                        } else {
                            // 原有行
                            this.materielDataList.map(item => {
                                if (item.delFlag === '0' && item.batch === this.cang.batch && item.id !== this.cang.id) {
                                    total = total + item.wheatWeight;
                                }
                            });
                            currentRecord = this.materielDataList.filter(data => data.id === this.cang.id);
                        }
                        const abc = this.cang.currentQuantity + this.materielDataListArray.find(items => items.batch === this.cang.batch).quantotal;
                        if (this.cang.wheatWeight + total > abc) {
                            this.$warningToast('领用数大于该批次剩余量');
                            return false;
                        }
                        if (currentRecord && currentRecord.length > 0) {
                            Object.assign(currentRecord[0], {
                                batch: this.cang.batch,
                                currentQuantity: this.cang.currentQuantity,
                                wheatWeight: this.cang.wheatWeight
                            });
                        } else {
                            this.materielDataList.push(this.cang)
                            this.$nextTick(() => {
                                //this.$refs[formName].clearValidate();
                            })
                        }
                        this.dialogFormVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            dialogClear(formName) {
                this.$refs[formName].resetFields();
                this.dialogFormVisible = false;
            },
            changeBatchFeomDialog() {
                const picisole = this.piciList.find(item => item.batch === this.cang.batch);
                if (typeof picisole !== 'undefined') {
                    this.cang.materialCode = picisole.materialCode;
                    this.cang.materialName = picisole.materialName;
                    this.cang.currentQuantity = picisole.currentQuantity;
                }
            },
            proving1() {
                // this.cang.wheatWeight = this.cang.wheatWeight.replace(/[^\.\d]/g, '')
                this.cang.wheatWeight = this.cang.wheatWeight.replace('.', '');
                this.cang.wheatWeight = this.cang.wheatWeight.replace('-', '');
            }
        }
    };
</script>

<style lang="scss">
    .Card_item {
        .el-card__header {
            padding: 15px 20px;
            color: #666;
            font-size: 16px;
        }
        &_detail {
            float: right;
            color: #1890ff;
            cursor: pointer;
        }
        &_img {
            position: relative;
            width: 250px;
            img {
                width: 250px;
            }
            &_box {
                position: absolute;
                top: 33px;
                left: 83px;
                display: flex;
                flex-wrap: wrap;
                align-content: flex-end;
                width: 89px;
                height: 161px;
                &_bg {
                    position: relative;
                    flex: 1;
                    align-items: center;
                    height: 161px;
                    overflow: hidden;
                    background: linear-gradient(#35c3ff, #1890ff);
                    &::before {
                        top: -138px;
                        border-radius: 45%;
                    }
                    &::after {
                        top: -132px;
                        border-radius: 47%;
                        opacity: 0.5;
                    }
                    &::before,
                    &::after {
                        position: absolute;
                        left: 50%;
                        min-width: 155px;
                        min-height: 145px;
                        background: #fff;
                        animation: roateTwo 10s linear infinite;
                        content: "";
                    }
                    &:hover {
                        &::before,
                        &::after {
                            animation: roateOne 10s linear infinite;
                        }
                    }
                }
            }
        }
        &_text {
            flex: 1;
            .el-card__header {
                padding: 10px 12px;
                color: white;
                font-size: 14px;
                background: #1890ff;
            }
            &_box {
                position: relative;
                max-height: 180px;
                padding-bottom: 6px;
                overflow: scroll;
                &_bg1,
                &_bg2 {
                    position: absolute;
                    z-index: 999;
                    width: 100%;
                    height: 20px;
                    background: linear-gradient(rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
                }
                &_bg2 {
                    bottom: 0;
                    background: linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
                }
            }
            .Card_item_text_box::-webkit-scrollbar {
                display: none;
            }
            &_item {
                padding-top: 10px;
                color: #4a4a4a;
                font-size: 14px;
            }
        }
    }

    @keyframes roateOne {
        0% {
            transform: translate(-50%, -0%) rotateZ(0deg);
        }
        50% {
            transform: translate(-50%, -1%) rotateZ(180deg);
        }
        100% {
            transform: translate(-50%, -0%) rotateZ(360deg);
        }
    }

    @keyframes roateTwo {
        0% {
            transform: translate(-50%, -0%) rotateZ(0deg);
        }
        50% {
            transform: translate(-50%, -0%) rotateZ(0deg);
        }
        100% {
            transform: translate(-50%, -0%) rotateZ(0deg);
        }
    }
</style>
