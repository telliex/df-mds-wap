<template>
    <el-form :inline="true" :model="formHeader" size="small" label-width="82px" class="topform">
        <el-form-item label="生产车间：">
            <p class="el-input">
                {{ formHeader.workShopName ? formHeader.workShopName : '' }}
            </p>
        </el-form-item>
        <el-form-item label="制曲房号：">
            <p class="el-input">
                {{ formHeader.houseName ? formHeader.houseName : '' }}
            </p>
        </el-form-item>
        <el-form-item label="生产订单：">
            <p class="el-input">
                {{ formHeader.orderNo ? formHeader.orderNo : '' }}
            </p>
        </el-form-item>
        <el-form-item label="生产品项：">
            <el-tooltip class="item" effect="dark" :content="(formHeader.materialName ? formHeader.materialName : '') + ' ' + (formHeader.materialCode ? formHeader.materialCode : '')" placement="top">
                <p class="el-input">
                    {{ (formHeader.materialName ? formHeader.materialName : '') + ' ' + (formHeader.materialCode ? formHeader.materialCode : '') }}
                </p>
            </el-tooltip>
        </el-form-item>
        <el-form-item label="生产日期：">
            <p class="el-input">
                {{ formHeader.productDate ? formHeader.productDate : '' }}
            </p>
        </el-form-item>
        <el-form-item label="入罐号：">
            <el-select v-model="formHeader.inPotNo" placeholder="请选择" filterable size="small" style="width: 145px;" :disabled="!(craftControlStatus !== 'submit')">
                <el-option v-for="iteam in InPot" :key="iteam.holderId" :label="iteam.holderName" :value="iteam.holderId" />
            </el-select>
        </el-form-item>
        <el-form-item label="连续蒸煮号：" label-width="85px">
            <p class="el-input">
                {{ formHeader.cookingName ? formHeader.cookingName : '' }}
            </p>
        </el-form-item>
        <el-form-item label="提交人员：">
            <p class="el-input">
                {{ formHeader.changer ? formHeader.changer : '' }}
            </p>
        </el-form-item>
        <el-form-item label="提交时间：">
            <p class="el-input">
                {{ formHeader.changed ? (formHeader.changed.indexOf('.') !== -1 ? formHeader.changed.substring(0, formHeader.changed.indexOf('.')) : formHeader.changed) : '' }}
            </p>
        </el-form-item>
    </el-form>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
export default {
    name: 'FromHead',
    components: {},
    props: {
        formHeader: {
            type: Object,
            default: function() { return {} }
        },
        craftControlStatus: {
            type: String,
            default: ''
        },
        isRedact: {
            type: Boolean
        }
    },
    data() {
        return {
            InPot: []
        };
    },
    computed: {},
    mounted() {
        this.GetInPot();
    },
    methods: {
        /* eslint-disable @typescript-eslint/camelcase */
        GetInPot() {
            this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {
                currPage: 1,
                holder_type: '001',
                pageSize: 9999,
                type: 'holder_type'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.InPot = data.page.list;
                } else {
                    this.$errorToast(data.msg);
                }
                this.visible = false;
            });
        }
        /* eslint-enable @typescript-eslint/camelcase */
    }
};
</script>
<style lang="scss">
.topform {
    .el-form-item__content {
        height: 32px;
        border-bottom: 1px solid #d8d8d8;
    }
}
</style>
<style lang="scss" scoped>
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
    margin-bottom: 8px !important;
}
.el-input {
    width: 145px !important;
    overflow: hidden;
    line-height: 32px;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
