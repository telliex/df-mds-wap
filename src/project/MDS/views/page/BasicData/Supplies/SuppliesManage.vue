<template>
    <div class="header_main">
        <mds-card title="物料列表" :name="'role'" :pack-up="false" style="background: #fff;">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-input v-model="form.param" placeholder="物料/物料类型" suffix-icon="el-icon-search" size="small" style="width: 180px; margin-right: 16px;" />
                    <el-button v-if="isAuth('sys:sapMaterial:list')" type="primary" size="small" @click="querys(true)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('sys:sapMaterial:syncMaterialManual')" type="primary" size="small" @click="SapuUpdate">
                        同步
                    </el-button>
                </div>
            </template>
            <el-table ref="table1" class="newTable" :height="mainClientHeight - 30 - 42 - 47" header-row-class-name="tableHead" :data="saplist" border tooltip-effect="dark" style="width: 100%;">
                <el-table-column :show-overflow-tooltip="true" label="物料">
                    <template slot-scope="scope">
                        <el-button style="padding: 0;" type="text" @click="showdetail(scope.row.materialId)">
                            {{ scope.row.materialName }} {{ scope.row.materialCode }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="工厂" width="180" prop="factoryName" />
                <el-table-column :show-overflow-tooltip="true" label="物料类型" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.materialTypeCode }}
                        {{ scope.row.materialTypeName }}
                    </template>
                </el-table-column>
                <el-table-column prop="basicUnit" label="基本单位" :show-overflow-tooltip="true" width="79" />
                <el-table-column prop="productUnit" label="生产单位" :show-overflow-tooltip="true" width="79" />
                <el-table-column prop="syncDate" label="同步日期" width="100" />
            </el-table>
            <el-row>
                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <sap-detail v-if="visible" ref="sapDetail" />
    </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
import SapDetail from './SuppliesDetail';
import { Loading } from 'element-ui';
export default {
    name: 'SuppliesManage',
    components: {
        SapDetail
    },
    data() {
        return {
            loading: {},
            visible: false,
            sapTime: {},
            form: {
                param: ''
            },
            currPage: 1,
            pageSize: 10,
            totalCount: 0,
            saplist: []
        };
    },
    computed: {
        mainClientHeight: {
            get() {
                return this.$store.state.common.mainClientHeight;
            }
        }
    },
    mounted() {
        this.Getsaplist();
    },
    methods: {
        // 物料列表
        Getsaplist() {
            this.$http(`${BASICDATA_API.SAPLIST_API}`, 'POST', {
                param: this.form.param,
                pageSize: JSON.stringify(this.pageSize),
                currPage: JSON.stringify(this.currPage)
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.saplist = data.page.list;
                    this.pageSize = data.page.pageSize;
                    this.totalCount = data.page.totalCount;
                    this.currPage = data.page.currPage;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 详情弹窗
        showdetail(id) {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.sapDetail.init(id);
            });
        },
        SapuUpdate() {
            this.loading = Loading.service({
                lock: true,
                spinner: 'loadingGif',
                text: '加载中……',
                background: 'rgba(255, 255, 255, 0.7)'
            });
            this.$http(`${BASICDATA_API.SAPUPDATE_API}`, 'GET', { werks: '7100' }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.sapTime = setInterval(() => {
                        this.GetSapuUpdate();
                    }, 4000);
                } else {
                    this.loading.close();
                    this.$errorToast(data.msg);
                }
            });
        },
        GetSapuUpdate() {
            this.$http(`${BASICDATA_API.GETSAPUPDATE_API}`, 'GET', { asyncType: 'ASYNC_SAP_MATERIAL' }, false, false, false)
                .then(({ data }) => {
                    if (data.code === 0) {
                        if (data.asyncRecord) {
                            if (data.asyncRecord.asyncStatus === '0') {
                                this.loading.close();
                                clearInterval(this.sapTime);
                                this.$notify.error({
                                    title: '错误',
                                    message: '同步失败'
                                });
                            } else if (data.asyncRecord.asyncStatus === '1') {
                                this.loading.close();
                                clearInterval(this.sapTime);
                                this.$notify({
                                    title: '成功',
                                    message: '同步成功',
                                    type: 'success'
                                });
                                this.Getsaplist();
                            }
                        }
                    } else {
                        this.loading.close();
                        clearInterval(this.sapTime);
                        this.$errorToast(data.msg);
                    }
                })
                .catch(() => {
                    this.loading.close();
                    clearInterval(this.sapTime);
                });
        },
        // 查询
        querys(st) {
            if (st) {
                this.currPage = 1;
            }
            this.Getsaplist();
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.Getsaplist();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.Getsaplist();
        }
    }
};
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.topforms2 {
    input {
        width: 210px !important;
    }
}
</style>
