<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-03 18:13:58
 * @LastEditors: Telliex
 * @LastEditTime: 2020-12-21 10:57:40
-->
<template lang="pug">
    el-dialog(:title="title" :width="width" :close-on-click-modal="false" :visible.sync="isShowCurrentDialog")
        el-form(ref="dialogForm" :model="dialogForm" size="small" label-width="110px" class="orderMangedialog" :rules="dialogFormRules")
            el-form-item(label="生产订单：")
                span(class="default") {{ dialogForm.orderNo }}
            el-form-item(label="正常入库：")
                el-radio(v-model="dialogForm.normalFlag" label="Y") 包装领用
                el-radio(v-model="dialogForm.normalFlag" label="N") 其他领用
                el-radio(v-model="dialogForm.normalFlag" label="E") 异常
            el-form-item(v-if="dialogForm.normalFlag==='Y'" label="包装产线：" prop="packageLine")
                el-select(v-model="dialogForm.packageLine" placeholder="请选择" clearable @change="selectPackageLine")
                    el-option(v-for="(item, index) in pkgWorkShopList" :key="index" :label="item.targetName" :value="item.targetCode" )
            el-form-item(v-if="dialogForm.normalFlag==='Y'" label="包装订单：" prop="packageOrderNo")
                el-select(v-model="dialogForm.packageOrderNo" placeholder="请选择" clearable )
                    el-option(v-for="(item, index) in packageOrderNoList" :key="index" :label="item.targetName" :value="item.targetCode")
            el-form-item(label="入库物料：")
                span(class="default") {{ dialogForm.material }}
            el-form-item(label="单位：")
                span(class="default") {{ dialogForm.materialUnit }}
            el-form-item(label="入库锅数：" prop="inStoragePot")
                el-input(v-model="dialogForm.inStoragePot" size="small" placeholder="请输入" clearable)
            el-form-item(label="入库数量：" prop="inStorageAmount")
                el-input(v-model.number="dialogForm.inStorageAmount" size="small" placeholder="请输入" clearable)
            el-form-item(label="入库批次：" prop="inStorageBatch")
                el-input(v-model.trim="dialogForm.inStorageBatch" size="small" placeholder="请输入" maxlength="10" clearable)
            el-form-item(label="备注：")
                el-input(v-model.trim="dialogForm.remark" placeholder="请输入" clearable)
            el-form-item(label="操作人：")
                span(class="default") {{ dialogForm.changer }}
            el-form-item(label="操作时间：")
                span(class="default") {{ dialogForm.changed }}
        div(slot="footer" class="dialog-footer")
            el-button(size="small" @click="btnClearBucketStatus") 取消
            el-button(type="primary" size="small" @click="btnComfirmBucketStatus") 确定
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { dateFormat, getUserNameNumber } from 'utils/utils';
    // import { dateFormat, getUserNameNumber } from 'utils/utils';
    import { COMMON_API, STE_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';

    @Component({
        name: 'InStorageDialog',
        components: {
        }
    })
    export default class DissolveBucketIndex extends Vue {
        @Prop({ default: false }) isRedact: boolean;
        @Prop({ default: '' }) title: string;
        @Prop({ default: '80%' }) width: string;
        // @Prop() dialogForm: object;

        $refs: {
            dialogForm: HTMLFormElement;
        }

        packageOrderNo=''
        packageOrderNoLine=''

        // 下拉选单选项
        pkgWorkShopList: OptionsInList[]=[]
        packageOrderNoList: OptionsInList[]=[]

        // 页面全局
        currentWorkShop=''
        currentProductDate=''
        isShowCurrentDialog = false;

        // 表单 data
        dialogForm: DialogForm={
            orderNo: '',
            orderId: '',
            normalFlag: 'Y',
            packageLine: '',
            packageLineName: '',
            packageOrderNo: '',
            material: '',
            materialCode: '',
            materialName: '',
            materialUnit: '',
            inStoragePot: 0,
            inStorageAmount: 0,
            inStorageBatch: '',
            remark: '',
            changer: getUserNameNumber(),
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        }

        // 表单 data Rule
        dialogFormRules= {
            packageLine: [
                { required: true, message: '请选择', trigger: 'change' }
            ],
            packageOrderNo: [
                { required: true, message: '请选择', trigger: 'change' }
            ],
            inStoragePot: [
                { required: true, message: '请输入', trigger: 'blur' }
            ],
            inStorageAmount: [
                { required: true, message: '请输入', trigger: 'blur' }
            ],
            inStorageBatch: [
                { required: true, message: '请输入', trigger: 'blur' }
            ]
        }


        init(obj, pkgWorkShopList, val) {
            this.isShowCurrentDialog = true;

            this.dialogForm = {
                orderNo: '',
                orderId: '',
                normalFlag: 'Y',
                packageLine: '',
                packageOrderNo: '',
                material: '',
                materialCode: '',
                materialName: '',
                materialUnit: '',
                inStoragePot: 0,
                inStorageAmount: 0,
                inStorageBatch: '',
                packageLineName: '',
                remark: '',
                changer: getUserNameNumber(),
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }

            this.pkgWorkShopList = pkgWorkShopList
            this.currentWorkShop = obj.workShop
            this.currentProductDate = obj.inKjmDate
            if (val) {
                // 编辑
                this.dialogForm = val
                this.dialogForm.material = `${val.materialName} ${val.materialCode}`
                this.selectPackageLine(val.packageLine)
            } else {
                //新增
                this.dialogForm.orderNo = obj.orderNo
                this.dialogForm.orderId = obj.orderId
                this.dialogForm.materialCode = obj.materialCode
                this.dialogForm.material = obj.material
                this.dialogForm.materialName = obj.materialName
                this.dialogForm.materialUnit = obj.outputUnit
            }


        }

        // TODO
        btnClearBucketStatus() {
            this.isShowCurrentDialog = false
            this.$refs.dialogForm.resetFields();
        }

        btnComfirmBucketStatus() {
            this.$refs.dialogForm.validate((valid) => {
                if (this.dialogForm.normalFlag !== 'Y') {
                    this.dialogForm.packageLine = ''
                    this.dialogForm.packageLineName = ''
                    this.dialogForm.packageOrderNo = ''
                }
                if (valid) {
                    this.$emit('conformData', JSON.parse(JSON.stringify(this.dialogForm)))
                    this.isShowCurrentDialog = false
                    // this.$refs.dialogForm.resetFields();
                } else {
                    return false;
                }
            });
        }

        selectPackageLine(val) {
            this.packageOrderNoLine = val
            if (val !== '') {
                this.dialogForm.packageLineName = this.pkgWorkShopList.filter(item => item.targetCode === val)[0].targetName
                COMMON_API.ORDER_LIST_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    productLine: val,
                    productDate: this.currentProductDate
                    // workShop: this.currentWorkShop
                }).then(({ data }) => {
                    console.log('包装订单')
                    console.log(data)
                    this.packageOrderNoList = []
                    if (data.data !== null) {
                        data.data.forEach(item => {
                            this.packageOrderNoList.push({ targetCode: item.orderNo, targetName: item.orderNo })
                        })
                    }
                })

                STE_API.STE_INSTORAGE_POT_COUNT_API({
                    steOrderNo: this.dialogForm.orderNo,
                    packageLineId: this.packageOrderNoLine
                }).then(({ data }) => {
                    console.log('数量')
                    console.log(data)
                    this.dialogForm.inStoragePot = data.data
                })
            }
        }


    }
    interface OptionsInList{
        targetCode?: string;
        targetName?: string;
    }
    interface DialogForm {
        orderNo?: string;
        orderId?: string;
        normalFlag?: string;
        packageLine?: string;
        packageOrderNo?: string;
        material?: string;
        materialCode?: string;
        materialName?: string;
        materialUnit?: string;
        inStoragePot?: number;
        inStorageAmount?: number;
        inStorageBatch?: string;
        packageLineName?: string;
        remark?: string;
        changer?: string;
        changed?: string;
    }
</script>

<style lang="scss" scoped>
</style>
