<template>
    <div class="header_main">
        <mds-card title="原料入库记录" :name="'role'" :pack-up="false" style="background: #fff;">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-input v-model="form.batch" placeholder="批次" size="small" suffix-icon="el-icon-search" style="width: 180px; margin-right: 16px;" />
                    <el-button v-if="isAuth('sys:sapGranaryMaterial:list')" type="primary" size="small" @click="GetList(true)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('sys:sapGranaryMaterial:list')" type="primary" size="small" @click="visible1 = true">
                        高级查询
                    </el-button>
                    <el-button v-if="isAuth('sys:sapGranaryMaterial:syncInstorageManual')" type="primary" size="small" @click="DataSynchronism()">
                        同步
                    </el-button>
                </div>
            </template>
            <el-row>
                <el-table ref="table1" class="newTable" :height="mainClientHeight - 30 - 42 - 47" header-row-class-name="tableHead" :data="list" border tooltip-effect="dark" style="width: 100%;">
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="170px">
                        <template slot-scope="scope">
                            {{ scope.row.materialName }}
                            {{ scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="物料类型" :show-overflow-tooltip="true" width="130px">
                        <template slot-scope="scope">
                            {{ scope.row.materialTypeCode }}
                            {{ scope.row.materialTypeName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="工厂" :show-overflow-tooltip="true" prop="factoryName" />
                    <el-table-column label="过账日期" :show-overflow-tooltip="true" prop="postingDate" width="100px" />
                    <el-table-column label="批次" :show-overflow-tooltip="true" prop="batch" width="120px" />
                    <el-table-column label="数量" :show-overflow-tooltip="true" prop="quantity" width="100px" />
                    <el-table-column label="单位" :show-overflow-tooltip="true" prop="unit" width="60px" />
                    <el-table-column label="移动类型" :show-overflow-tooltip="true" prop="moveType" width="90px" />
                    <el-table-column label="库存" :show-overflow-tooltip="true" prop="quantity" width="80px" />
                    <el-table-column label="罐号" :show-overflow-tooltip="true" prop="holderNo" width="60px" />
                    <el-table-column label="同步日期" :show-overflow-tooltip="true" prop="syncDate" width="100px" />
                </el-table>
            </el-row>
            <el-row>
                <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <el-dialog :close-on-click-modal="false" :visible.sync="visible1" width="510px" custom-class="dialog__class">
            <div slot="title">
                高级查询
            </div>
            <el-form :model="form" size="small" label-width="130px" class="locationdialog">
                <el-form-item label="批次：" prop="orderNo1">
                    <el-input v-model="form.batch" style="width: 283px;" />
                </el-form-item>
                <el-form-item label="物料：" prop="orderNo2">
                    <el-input v-model="form.materialCode" style="width: 283px;" />
                </el-form-item>
                <el-form-item label="罐号：" prop="holderId">
                    <el-select v-model="form.holderId" placeholder="请选择" filterable style="width: 283px;">
                        <el-option v-for="(sole, index) in guanList" :key="index" :value="sole.holderId" :label="sole.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="过账日期：">
                    <el-date-picker v-model="form.commitDateOne" type="date" placeholder="选择日期" style="width: 135px;" />
                    -
                    <el-date-picker v-model="form.commitDateTwo" type="date" placeholder="选择日期" style="width: 135px;" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible1 = false">取消</el-button>
                <el-button type="primary" @click="GetList(true, 'highc')">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
import { Loading } from 'element-ui';
export default {
    name: 'RawMaterial',
    components: {},
    data() {
        return {
            loading: {},
            visible1: false,
            form: {
                bath: '',
                materialCode: '',
                commitDateOne: '',
                commitDateTwo: ''
            },
            serch: {},
            list: [],
            multipleSelection: [],
            sapList: [],
            workshop: [],
            SerchSapList: [],
            currentPage: 1,
            currPage: 1,
            pageSize: 10,
            totalCount: 0,
            guanList: []
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
        this.GetList();
        this.PuplWheatList();
    },
    methods: {
        // 获取库位列表
        GetList(st, type = 'normal') {
            if (st) {
                this.currPage = 1;
            }
            if (type === 'normal') {
                this.form = {
                    batch: this.form.batch,
                    materialCode: '',
                    commitDateOne: '',
                    commitDateTwo: ''
                };
            }
            this.$http(`${BASICDATA_API.MATERIALRAWLIST_API}`, 'POST', {
                batch: this.form.batch,
                materialCode: this.form.materialCode,
                commitDateOne: this.form.commitDateOne,
                commitDateTwo: this.form.commitDateTwo,
                currPage: JSON.stringify(this.currPage),
                pageSize: JSON.stringify(this.pageSize),
                holderId: this.form.holderId
            }).then(({ data }) => {
                this.visible1 = false;
                if (data.code === 0) {
                    this.list = data.page.list;
                    this.currPage = data.page.currPage;
                    this.pageSize = data.page.pageSize;
                    this.totalCount = data.page.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.GetList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.GetList();
        },
        // 数据同步
        DataSynchronism() {
            this.loading = Loading.service({
                lock: true,
                spinner: 'loadingGif',
                text: '加载中……',
                background: 'rgba(255, 255, 255, 0.7)'
            });
            this.$http(`${BASICDATA_API.MATERIALRAWSYNCHRONISM_API}`, 'GET', {}, false, false, false)
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.orderTime = setInterval(() => {
                            this.GetDataSynchronismStatus();
                        }, 4000);
                    }
                })
                .catch(() => {
                    this.loading.close();
                });
        },
        GetDataSynchronismStatus() {
            this.$http(`${BASICDATA_API.MATERIALRAWSYNCHRONISMSTASUS_API}`, 'GET', { asyncType: 'ASYNC_SAP_INSTORAGE' }, false, false, false)
                .then(({ data }) => {
                    if (data.code === 0) {
                        if (data.asyncRecord) {
                            if (data.asyncRecord.asyncStatus === '0') {
                                this.loading.close();
                                clearInterval(this.orderTime);
                                this.$notify.error({
                                    title: '错误',
                                    message: '同步失败'
                                });
                            } else if (data.asyncRecord.asyncStatus === '1') {
                                this.loading.close();
                                clearInterval(this.orderTime);
                                this.$notify({
                                    title: '成功',
                                    message: '同步成功',
                                    type: 'success'
                                });
                                this.GetList();
                            }
                        }
                    } else {
                        this.loading.close();
                        clearInterval(this.orderTime);
                        this.$errorToast(data.msg);
                    }
                })
                .catch(() => {
                    this.loading.close();
                    clearInterval(this.orderTime);
                });
        },
        // 罐号
        PuplWheatList() {
            this.$http(`${BASICDATA_API.PUPLWHEATLIST}`, 'POST', {
                types: ['002', '012']
            }).then(({ data }) => {
                this.guanList = data.list;
            });
        }
    }
};
</script>

<style lang="scss">
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
</style>
