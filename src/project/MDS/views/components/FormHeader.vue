<template>
    <el-form :inline="true" :model="formHeader" size="small" class="dataEntry-head-base__form">
        <el-form-item>
            <template slot="label">
                <em class="iconfont factory-shengchanchejian" style="margin-right: 5px; margin-left: 2px;" />
                <span>生产车间：</span>
            </template>
            <p class="el-input">
                {{ formHeader.workShopName || '' }}
            </p>
        </el-form-item>
        <el-form-item>
            <template slot="label">
                <em class="iconfont factory-shengchanxian" style="margin-right: 5px; margin-left: 2px;" />
                <span>生产产线：</span>
            </template>
            <p v-if="!pro" class="el-input">
                {{ formHeader.productLineName || '' }}
            </p>
            <p v-else class="el-input">
                <span v-if="formHeader.factoryCode !== '6010'">{{ formHeader.productLineName || '' }}</span>
                <el-select v-else v-model="formHeader.productLine" :disabled="!isRedact">
                    <el-option v-for="(iteam, index) in Team" :key="index" :label="iteam.deptName" :value="iteam.deptId" />
                </el-select>
            </p>
        </el-form-item>
        <el-form-item>
            <template slot="label">
                <em class="iconfont factory-bianhao" style="margin-right: 5px; margin-left: 2px;" />
                <span>生产订单：</span>
            </template>
            <p class="el-input">
                {{ formHeader.orderNo || '' }}
            </p>
        </el-form-item>
        <el-form-item>
            <template slot="label">
                <em class="iconfont factory-pinleiguanli" style="margin-right: 5px; margin-left: 2px;" />
                <span>生产物料：</span>
            </template>
            <el-tooltip class="item" effect="dark" :content="(formHeader.materialCode || '') + ' ' + (formHeader.materialName || '')" placement="top">
                <p class="el-input" style="text-overflow: ellipsis;">
                    {{ (formHeader.materialCode || '') + ' ' + (formHeader.materialName || '') }}
                </p>
            </el-tooltip>
        </el-form-item>
        <el-form-item>
            <template slot="label">
                <em class="iconfont factory-riqi1" style="margin-right: 5px; margin-left: 2px;" />
                <span>订单日期：</span>
            </template>
            <p class="el-input">
                {{ formHeader.orderDate | formatDate }}
            </p>
        </el-form-item>
        <el-form-item>
            <template slot="label">
                <em class="iconfont factory--meirijihuachanliangpeizhi" style="margin-right: 5px; margin-left: 2px;" />
                <span>计划产量：</span>
            </template>
            <p class="el-input">
                {{ (formHeader.planOutput || '') + ' ' + (formHeader.outputUnit || '') }}
            </p>
        </el-form-item>
        <el-form-item>
            <template slot="label">
                <em class="iconfont factory-riqi1" style="margin-right: 5px; margin-left: 2px;" />
                <span>生产日期：</span>
            </template>
            <el-date-picker v-model="formHeader.productDate" size="small" type="date" :disabled="!isRedact" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 145px;" @change="updateProductDate" />
        </el-form-item>
        <el-form-item>
            <template slot="label">
                <em class="iconfont factory-xianchangrenyuan" style="margin-right: 5px; margin-left: 2px;" />
                <span>提交人员：</span>
            </template>
            <p class="el-input">
                {{ formHeader.operator || '' }}
            </p>
        </el-form-item>
        <el-form-item>
            <template slot="label">
                <em class="iconfont factory-riqi" style="margin-right: 5px; margin-left: 2px;" />
                <span>提交时间：</span>
            </template>
            <p class="el-input">
                {{ formHeader.operDate ? (formHeader.operDate.indexOf('.') !== -1 ? formHeader.operDate.substring(0, formHeader.operDate.indexOf('.')) : formHeader.operDate) : '' }}
            </p>
        </el-form-item>
    </el-form>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
export default {
    name: 'FormHeader',
    components: {},
    filters: {
        formatDate(date) {
            if (date) {
                return date;
            }
            return '';
        }
    },
    props: {
        formHeader: {
            type: Object,
            default: function() { return {} }
        },
        pro: Boolean,
        isRedact: Boolean,
        updateProductDateCallback: {
            type: Function,
            default: () => 1
        }
    },
    data() {
        return {
            Team: []
        };
    },
    computed: {},
    methods: {
        updateProductDate: function(val) {
            this.$emit('updateProductDateCallback', val);
        },
        getLin(id) {
            this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {
                parentId: id
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.Team = data.childList;
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        }
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
@import "@/assets/scss/_common.scss";
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
