<template>
    <div class="header_main">
        <el-card class="searchCards searchCard">
            <el-row>
                <el-col>
                    <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row" @keyup.enter.native="GetLtkList(true)" @submit.native.prevent>
                        <el-form-item label="生产工厂：">
                            <el-select v-model="plantList.factory" placeholder="请选择" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <el-select v-model="plantList.workshop" placeholder="请选择" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="产线：">
                            <el-select v-model="plantList.productline" placeholder="产线" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in productline" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单状态：">
                            <el-select v-model="plantList.status" placeholder="请选择" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option label="未审核" value="submit" />
                                <el-option label="审核通过" value="checked" />
                                <el-option label="审核不通过" value="noPass" />
                                <el-option label="接口失败" value="0" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单号：">
                            <el-input v-model="plantList.orderNo" placeholder="订单号" style="width: 160px;" />
                        </el-form-item>
                        <el-form-item label="日期：">
                            <el-date-picker v-model="plantList.productdate" type="date" placeholder="请选择" value-format="yyyy-MM-dd" style="width: 160px;" />
                        </el-form-item>
                        <el-form-item class="floatr">
                            <el-button v-if="isAuth('sys:verifyLTK:list')" type="primary" size="small" @click="GetLtkList(true)">
                                查询
                            </el-button>
                            <el-button type="primary" size="small" @click="doPrint">
                                导出
                            </el-button>
                            <el-button v-if="isAuth('sys:verifyLTK:auditing')" type="primary" size="small" @click="subAutio()">
                                审核通过
                            </el-button>
                            <el-button v-if="isAuth('sys:verifyLTK:auditing')" type="danger" size="small" @click="repulseAutios()">
                                审核不通过
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <mds-card title="立体库" name="LtkList" :pack-up="false" style="margin-top: 10px;">
            <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :data="LtkList" border tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :selectable="checkboxT" width="50" />
                <el-table-column label="审核状态" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.status === 'submit' ? '未审核' : scope.row.status === 'checked' ? '审核通过' : scope.row.status === 'noPass' ? '审核不通过' : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="productDate" label="生产日期" :show-overflow-tooltip="true" width="120" />
                <el-table-column label="生产订单号" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.orderNo }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="品项" :show-overflow-tooltip="true" width="360">
                    <template slot-scope="scope">
                        <span>{{ scope.row.materialCode + ' ' + scope.row.materialName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="batch" label="生产批次" width="110" />
                <el-table-column prop="input" label="订单入库量" width="91" />
                <el-table-column v-if="deptCode === '6010'" prop="aiShelves" label="正常品入库数" width="140" />
                <el-table-column v-if="deptCode === '6010'" prop="manSolid" label="供应商待买数" width="140" />
                <el-table-column v-if="deptCode !== '6010'" prop="manSolid" label="人工码垛数-立体库" width="140" />
                <el-table-column v-if="deptCode !== '6010'" prop="aiShelves" label="自动上架-立体库" width="140" />
                <el-table-column v-if="deptCode !== '6010'" prop="aiSolid" label="自动码垛-立体库" width="140" />
                <el-table-column prop="unitName" label="单位" :show-overflow-tooltip="true" width="50" />
                <el-table-column prop="workShopMan" label="车间确认人" :show-overflow-tooltip="true" width="92" />
                <el-table-column prop="ltkMan" label="立体库确认人" :show-overflow-tooltip="true" width="105" />
                <el-table-column prop="memo" label="审核意见" :show-overflow-tooltip="true" width="78" />
                <el-table-column prop="verifyDate" label="审核时间" width="220" />
                <el-table-column prop="name" :show-overflow-tooltip="true" label="备注" />
                <el-table-column fixed="right" label="操作" width="75">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === 'checked' && isAuth('sys:verifyLTK:resetLTK')" type="warning" round size="mini" @click="ResetD(scope.row)">
                            反审
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="plantList.currPage" :page-sizes="[10, 20, 50]" :page-size="plantList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <el-dialog title="审核拒绝" :close-on-click-modal="false" :visible.sync="visible">
            <p style="line-height: 42px;">
                请填写不通过原因
            </p>
            <el-input v-model="Text" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="repulseAutio()">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="反审" :close-on-click-modal="false" :visible.sync="visibleRe">
            <p style="line-height: 42px;">
                请填写反审意见
            </p>
            <el-input v-model="ReText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visibleRe = false">取消</el-button>
                <el-button type="primary" size="small" @click="ResetSt()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { BASICDATA_API, LTK_API, REP_API } from '@/api/api';
import { exportFile, headanimation } from '@/net/validate';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            pdf: '',
            lodingS: false,
            visible: false,
            visible1: false,
            visibleRe: false,
            ReText: '',
            reData: {},
            factory: [],
            workshop: [],
            productline: [],
            Text: '',
            plantList: {
                orderNo: '',
                factory: '',
                workshop: '',
                productline: '',
                productdate: '',
                status: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            multipleSelection: [],
            LtkList: [],
            deptCode: ''
        };
    },
    computed: {},
    watch: {
        'plantList.factory'(n) {
            this.Getdeptbyid(n);
        },
        'plantList.workshop'(n) {
            if (n) {
                this.GetParentline(n);
            }
        }
    },
    mounted() {
        // this.GetLtkList()
        this.Getdeptcode();
        headanimation(this.$);
    },
    methods: {
        // 打印
        doPrint() {
            exportFile(`${REP_API.REPOUT_API}`, '立体库审核数据导出', this);
        },
        // 获取列表
        GetLtkList(st) {
            if (!this.plantList.factory) {
                this.$warningToast('请选择工厂');
                return;
            }
            this.deptCode = this.factory.filter(item => item.deptId === this.plantList.factory)[0].deptCode;
            this.lodingS = true;
            if (st) {
                this.plantList.currPage = 1;
            }
            this.$http(`${LTK_API.LTKLIST_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.LtkList = data.page.list;
                    this.plantList.currPage = data.page.currPage;
                    this.plantList.pageSize = data.page.pageSize;
                    this.plantList.totalCount = data.page.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
                this.lodingS = false;
            });
        },
        // 反审
        ResetD(row) {
            this.visibleRe = true;
            this.reData = row;
        },
        ResetSt() {
            this.$confirm('反审后需要重新审核，确认要反审？', '反审', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.reData.status = 'submit';
                this.reData.memo = this.ReText;
                this.lodingS = true;
                this.$http(`${LTK_API.LTK_RESET_API}`, 'POST', this.reData)
                    .then(({ data }) => {
                        this.lodingS = false;
                        if (data.code === 0) {
                            this.visibleRe = false;
                            this.ReText = '';
                            this.reData = {};
                            this.GetLtkList();
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                        } else {
                            this.$errorToast(data.msg);
                        }
                    })
                    .catch(() => {
                        this.$notify.error({
                            title: '错误',
                            message: '网络错误'
                        });
                        this.lodingS = false;
                    });
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    if (!this.plantList.factory && data.typeList.length > 0) {
                        this.plantList.factory = data.typeList[0].deptId;
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.plantList.workshop = '';
            this.plantList.productline = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                    deptId: id,
                    deptName: '包装 组装'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (!this.plantList.workshop && data.typeList.length > 0) {
                            this.plantList.workshop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 获取产线
        GetParentline(id) {
            this.plantList.productline = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {
                    parentId: id
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.productline = data.childList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item);
            });
        },
        // 审核通过禁用
        checkboxT(row) {
            if (row.status === 'checked' || row.status === 'noPass') {
                return 0;
            }
                return 1;

        },
        // 审核拒绝
        repulseAutios() {
            if (this.multipleSelection.length <= 0) {
                this.$warningToast('请选择订单');
            } else {
                this.visible = true;
            }
        },
        repulseAutio() {
            if (this.Text.length <= 0) {
                this.$warningToast('请填写不通过原因');
            } else {
                this.$confirm('确认审核不通过, 是否继续?', '审核不通过', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.multipleSelection.forEach(item => {
                        item.status = 'noPass';
                        item.memo = this.Text;
                    });
                    this.$http(`${LTK_API.LTKAUDIT_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                        if (data.code === 0) {
                            this.visible = false;
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.GetLtkList();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                }).catch(() => {
                // this.$infoToast('已取消删除');
            });
            }
        },
        // 审核通过
        subAutio() {
            if (this.multipleSelection.length <= 0) {
                this.$warningToast('请选择订单');
            } else {
                this.$confirm('确认审核通过, 是否继续?', '审核通过', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.multipleSelection.forEach(item => {
                        item.status = 'checked';
                        item.memo = '审核通过';
                    });
                    this.$http(`${LTK_API.LTKAUDIT_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                        if (data.code === 0) {
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.GetLtkList();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                }).catch(() => {
                    // this.$infoToast('已取消删除');
                });
            }
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.plantList.pageSize = val;
            this.GetLtkList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.plantList.currPage = val;
            this.GetLtkList();
        }
    }
};
</script>

<style scoped></style>
<style lang="scss">
#printMain {
    width: 297mm;
    height: 210mm;
    td,
    th,
    tr {
        font-size: 12px;
        text-align: center !important;
    }
    table {
        td {
            padding: 2px 5px;
        }
    }
}
.search-card {
    margin-bottom: 0;
}
.search-card,
.table-card {
    position: relative;
    .toggle-search_top {
        position: absolute;
        top: 0;
        left: 0;
        display: none;
        width: 100%;
        text-align: center;
        cursor: pointer;
    }
    .toggle-search_bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        cursor: pointer;
    }
    .el-icon-caret-top::before,
    .el-icon-caret-bottom::before {
        color: #dcdfe6;
    }
}
.topforms {
    .el-date-editor.el-input {
        width: auto;
    }
}
</style>
