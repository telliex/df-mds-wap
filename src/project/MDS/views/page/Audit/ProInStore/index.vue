<template>
    <div class="header_main">
        <el-card class="searchCard" style="margin-bottom: 5px;">
            <el-row type="flex">
                <el-col>
                    <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row">
                        <el-form-item label="生产工厂：">
                            <el-select v-model="plantList.factory" placeholder="请选择" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <el-select v-model="plantList.workShop" placeholder="请选择" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产产线：">
                            <el-select v-model="plantList.productLine" placeholder="产线" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in productline" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单号：">
                            <el-input v-model="plantList.orderNo" placeholder="订单号" style="width: 160px;" />
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
                        <el-form-item label="订单类型：">
                            <el-select v-model="plantList.orderType" placeholder="请选择" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.value" :value="item.code" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产日期：" class="dateinput">
                            <el-row>
                                <el-col :span="12">
                                    <el-date-picker v-model="plantList.prodDateBegin" type="date" placeholder="请选择" value-format="yyyy-MM-dd" style="width: 135px;" />
                                    <span> -</span>
                                </el-col>
                                <el-col :span="12">
                                    <el-date-picker v-model="plantList.prodDateEnd" type="date" placeholder="请选择" value-format="yyyy-MM-dd" style="width: 135px;" />
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item class="floatr">
                            <el-button v-if="isAuth('sys:verifyInStorage:list')" type="primary" size="small" @click="GetAuditList(true)">
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <mds-card title="生产入库" name="auditList" :pack-up="false">
            <template slot="titleBtn">
                <div style="float: right; width: 688px;">
                    <el-form ref="pstngDate" :model="plantList" :rules="plantListRule" size="small" :inline="true" label-position="right" label-width="82px" class="topforms" style=" float: left; width: 505px;">
                        <el-form-item label="过账日期：" prop="pstngDate">
                            <el-date-picker v-model="plantList.pstngDate" type="date" placeholder="请选择" value-format="yyyy-MM-dd" style="width: 160px;" />
                        </el-form-item>
                        <el-form-item label="抬头文本：">
                            <el-input v-model="plantList.headerTxt" placeholder="抬头文本" style="width: 160px;" />
                        </el-form-item>
                    </el-form>
                    <el-button v-if="isAuth('sys:verifyInStorage:auditing')" type="primary" size="small" @click="subAutio()">
                        审核通过
                    </el-button>
                    <el-button v-if="isAuth('sys:verifyInStorage:auditing')" type="danger" size="small" @click="repulseAutios()">
                        审核不通过
                    </el-button>
                </div>
            </template>
            <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :data="AuditList" max-height="450" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :selectable="checkboxT" width="50" />
                <el-table-column label="审核状态" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.status === 'submit' ? '未审核' : scope.row.status === 'checked' ? (scope.row.interfaceReturnStatus === '0' ? '接口失败' : '审核通过') : scope.row.status === 'noPass' ? '审核不通过' : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="productDate" label="生产日期" :show-overflow-tooltip="true" width="120" />
                <el-table-column prop="orderNo" label="生产订单号" :show-overflow-tooltip="true" width="120" />
                <el-table-column label="生产物料" :show-overflow-tooltip="true" width="360">
                    <template slot-scope="scope">
                        {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column prop="planOutput" label="计划生产数量" width="105" />
                <el-table-column prop="outputUnitName" label="单位" width="50" />
                <el-table-column prop="entryQnt" label="入库数量" width="78" />
                <el-table-column prop="entryUomName" label="单位" width="50" />
                <el-table-column label="是否样品" width="78">
                    <template slot-scope="scope">
                        {{ scope.row.isSample === '0' ? '否' : '是' }}
                    </template>
                </el-table-column>
                <el-table-column prop="batch" label="物料批次" width="112" />
                <el-table-column label="生产日期" width="105">
                    <template slot-scope="scope">
                        {{ scope.row.prodDate | SetDate }}
                    </template>
                </el-table-column>
                <el-table-column label="入库库位" width="78">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.redact" v-model="scope.row.stgeLoc" placeholder="手工录入" size="small" />
                        <span v-if="!scope.row.redact">{{ scope.row.stgeLoc }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="移动类型" width="78">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.redact" v-model="scope.row.moveType" placeholder="手工录入" size="small" />
                        <span v-if="!scope.row.redact">{{ scope.row.moveType }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="库存类型" width="78">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.redact" v-model="scope.row.stckType" placeholder="手工录入" size="small" />
                        <span v-if="!scope.row.redact">{{ scope.row.stckType }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="交货已完成标识" width="120">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.redact" v-model="scope.row.noMoreGr" placeholder="手工录入" size="small" />
                        <span v-if="!scope.row.redact">{{ scope.row.noMoreGr }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="货架寿命到期日" width="155">
                    <template slot-scope="scope">
                        <!-- <el-input v-if="scope.row.redact" v-model="scope.row.expirydate" placeholder="手工录入" size="small" /> -->
                        <el-date-picker v-if="scope.row.redact" v-model="scope.row.expirydate" type="date" style="width: 130px;" value-format="yyyy-MM-dd" size="small" placeholder="选择日期" />
                        <span v-if="!scope.row.redact">{{ scope.row.expirydate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="mixType" label="是否混合罐" width="105" />
                <el-table-column prop="potNo" label="原汁罐号" width="105" />
                <el-table-column prop="fullPotAmount" label="满罐数量" width="105" />
                <el-table-column prop="fullPotDate" label="满罐日期" width="105" />
                <el-table-column prop="interfaceReturn" label="接口回写" :show-overflow-tooltip="true" width="150" />
                <el-table-column prop="memo" label="审核意见" :show-overflow-tooltip="true" width="150" />
                <el-table-column prop="verifyMan" label="审核人" width="160" />
                <el-table-column prop="verifyDate" label="审核时间" width="160" />
                <el-table-column :show-overflow-tooltip="true" label="备注">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.redact" v-model="scope.row.remark" placeholder="手工录入" size="small" />
                        <span v-if="!scope.row.redact">{{ scope.row.remark }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="70">
                    <template slot-scope="scope">
                        <div v-if=" isAuth('sys:verifyInStorage:auditing')">
                            <el-button v-if="scope.row.status === 'checked' && scope.row.interfaceReturnStatus === '1'" class="ra_btn" type="warning" round size="mini" @click="ResetD(scope.row)">
                                反审
                            </el-button>
                            <el-button v-if=" !(scope.row.status === 'checked' && scope.row.interfaceReturnStatus === '1') || scope.row.status === 'noPass' " class="ra_btn" type="primary" round size="mini" @click="redact(scope.row)">
                                {{ scope.row.redact ? '保存' : '编辑' }}
                            </el-button>
                        </div>
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
                <el-button @click="visibleRe = false">取消</el-button>
                <el-button type="primary" @click="ResetIn()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { BASICDATA_API, AUDIT_API, SYSTEMSETUP_API } from '@/api/api';
import { headanimation } from '@/net/validate';
export default {
    name: 'Index',
    filters: {
        SetDate: function(value) {
            return value.slice(0, value.indexOf(' '));
        }
    },
    components: {},
    data() {
        return {
            lodingStatus1: false,
            dataListLoading: false,
            visible: false,
            visibleRe: false,
            ReText: '',
            reData: {},
            factory: [],
            workshop: [],
            productline: [],
            orderTypeList: [],
            Text: '',
            plantListRule: {
                pstngDate: [{ required: true, message: '过账日期不能为空', trigger: 'blur' }]
            },
            plantList: {
                orderNo: '',
                factory: '',
                workShop: '',
                productLine: '',
                prodDateBegin: new Date(new Date() - 24 * 60 * 60 * 1000).getFullYear().toString() + '-' + (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1 >= 10 ? (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1).toString() : '0' + (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1)) + '-' + (new Date(new Date() - 24 * 60 * 60 * 1000).getDate() >= 10 ? new Date(new Date() - 24 * 60 * 60 * 1000).getDate().toString() : '0' + new Date(new Date() - 24 * 60 * 60 * 1000).getDate()),
                prodDateEnd: '',
                pstngDate: '',
                orderType: '',
                headerTxt: '',
                status: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            AuditList: [],
            multipleSelection: []
        };
    },
    computed: {},
    watch: {
        'plantList.factory'(n) {
            this.plantList.orderType = '';
            this.Getdeptbyid(n);
            this.getDictList(n);
        },
        'plantList.workShop'(n) {
            this.GetParentline(n);
        }
    },
    mounted() {
        // this.GetAuditList()
        this.plantList.pstngDate = new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1 >= 10 ? (new Date().getMonth() + 1).toString() : '0' + (new Date().getMonth() + 1)) + '-' + (new Date().getDate() >= 10 ? new Date().getDate().toString() : '0' + new Date().getDate());
        this.Getdeptcode();
        headanimation(this.$);
    },
    methods: {
        getDictList(factory) {
            const params = { types: ['order_type'], factory };
            this.$http(`${SYSTEMSETUP_API.PARAMETERSLIST_API}`, 'POST', params)
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.orderTypeList = data.dicList[0].prolist;
                    } else {
                        this.$errorToast(data.msg);
                    }
                })
                .catch(error => {
                    console.log('catch data::', error);
                });
        },
        // 获取列表
        GetAuditList(st) {
            if (st) {
                this.plantList.currPage = 1;
            }
            this.plantList.headerTxt = '';
            this.dataListLoading = true;
            this.$http(`${AUDIT_API.AUDITLIST_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.AuditList = data.page.list;
                    this.plantList.currPage = data.page.currPage;
                    this.plantList.pageSize = data.page.pageSize;
                    this.plantList.totalCount = data.page.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
                this.dataListLoading = false;
            });
        },
        // 反审
        ResetD(row) {
            this.visibleRe = true;
            this.reData = row;
        },
        ResetIn() {
            this.$confirm('数据已调用SAP接口已入库，请确认SAP冲销，确认要反审？', '反审', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.reData.status = 'submit';
                    this.reData.memo = this.ReText;
                    this.dataListLoading = true;
                    this.$http(`${AUDIT_API.AUDIT_IN_RESET_API}`, 'POST', this.reData)
                        .then(({ data }) => {
                            this.dataListLoading = false;
                            if (data.code === 0) {
                                this.visibleRe = false;
                                this.ReText = '';
                                this.reData = {};
                                this.GetAuditList();
                                this.$notify({ title: '成功', message: '操作成功', type: 'success' });
                            } else {
                                this.$errorToast(data.msg);
                            }
                        })
                        .catch(() => {
                            this.$notify.error({ title: '错误', message: '网络错误' });
                            this.dataListLoading = false;
                        });
                })
                .catch(() => {
                    // this.$infoToast('已取消删除');
                });
        },
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
                console.log(data);
                if (data.code === 0) {
                    this.factory = data.typeList;
                    if (data.typeList.length !== 0) {
                        this.plantList.factory = data.typeList[0].deptId;
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.plantList.workShop = '';
            this.plantList.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id }).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (!this.plantList.workShop && data.typeList.length > 0) {
                            this.plantList.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.workshop = [];
            }
        },
        // 获取产线
        GetParentline(id) {
            this.plantList.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: id }).then(({ data }) => {
                    if (data.code === 0) {
                        this.productline = data.childList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.productline = [];
            }
        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach(item => {
                this.multipleSelection.push(item);
            });
        },
        // 审核通过禁用
        checkboxT(row) {
            if ((row.status === 'checked' && row.interfaceReturnStatus === '1') || row.status === 'noPass') {
                return 0;
            }
            return 1;
        },
        // 编辑
        redact(row) {
            if (!row.redact) {
                row.redact = true;
                this.AuditList.splice(this.AuditList.length, 0, {});
                this.AuditList.splice(this.AuditList.length - 1, 1);
            } else {
                row.pstngDate = this.plantList.pstngDate;
                row.status = '';
                this.lodingStatus = true;
                this.$http(`${AUDIT_API.INUPDATE_API}`, 'POST', [row])
                    .then(({ data }) => {
                        this.lodingStatus = false;
                        if (data.code === 0) {
                            this.$notify({ title: '成功', message: '操作成功', type: 'success' });
                            row.redact = false;
                            this.AuditList.splice(this.AuditList.length, 0, {});
                            this.AuditList.splice(this.AuditList.length - 1, 1);
                        } else {
                            this.$errorToast(data.msg);
                        }
                        this.GetAuditList();
                    })
                    .catch(() => {
                        this.$notify.error({ title: '错误', message: '网络错误' });
                        this.lodingStatus = false;
                    });
            }
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
                this.$refs.pstngDate.validate(valid => {
                    if (valid) {
                        this.$confirm('确认审核不通过, 是否继续?', '审核不通过', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                            .then(() => {
                                this.multipleSelection.forEach(item => {
                                    item.status = 'noPass';
                                    item.memo = this.Text;
                                    item.pstngDate = this.plantList.pstngDate;
                                });
                                this.lodingStatus = true;
                                this.$http(`${AUDIT_API.GOAUDIT_API}`, 'POST', this.multipleSelection)
                                    .then(({ data }) => {
                                        this.lodingStatus = false;
                                        if (data.code === 0) {
                                            this.visible = false;
                                            this.$notify({ title: '成功', message: '操作成功', type: 'success' });
                                            this.GetAuditList();
                                        } else {
                                            this.$errorToast(data.msg);
                                        }
                                    })
                                    .catch(() => {
                                        this.$notify.error({ title: '错误', message: '网络错误' });
                                        this.lodingStatus = false;
                                    });
                            })
                            .catch(() => {
                                // this.$infoToast('已取消删除');
                            });
                    }
                });
            }
        },
        // 审核通过
        subAutio() {
            if (this.multipleSelection.length <= 0) {
                this.$warningToast('请选择订单');
            } else {
                this.$refs.pstngDate.validate(valid => {
                    if (valid) {
                        this.$confirm('确认审核通过, 是否继续?', '审核通过', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                            .then(() => {
                                this.multipleSelection.forEach(item => {
                                    item.status = 'checked';
                                    item.memo = '审核通过';
                                    item.pstngDate = this.plantList.pstngDate;
                                    item.headerTxt = this.plantList.headerTxt;
                                });
                                this.lodingStatus1 = true;
                                this.$http(`${AUDIT_API.GOAUDIT_API}`, 'POST', this.multipleSelection)
                                    .then(({ data }) => {
                                        console.log(data);
                                        this.plantList.headerTxt = '';
                                        this.lodingStatus1 = false;
                                        if (data.code === 0) {
                                            this.$notify({ title: '成功', message: '操作成功', type: 'success' });
                                            this.GetAuditList();
                                        } else {
                                            this.GetAuditList();
                                            this.$errorToast(data.msg);
                                        }
                                    })
                                    .catch(() => {
                                        this.$notify.error({ title: '错误', message: '网络错误' });
                                        this.lodingStatus = false;
                                    });
                            })
                            .catch(() => {
                                // this.$infoToast('已取消删除');
                            });
                    }
                });
            }
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.plantList.pageSize = val;
            this.GetAuditList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.plantList.currPage = val;
            this.GetAuditList();
        }
    }
};
</script>

<style lang="scss" scoped>
.searchCard {
    margin-bottom: 0;
}
.searchCard .el-card__body {
    padding-bottom: 0;
}
.searchCard,
.tableCard {
    position: relative;
    .toggleSearchTop {
        position: absolute;
        top: 0;
        left: 0;
        display: none;
        width: 100%;
        text-align: center;
        cursor: pointer;
    }
    .toggleSearchBottom {
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
    .formtextarea {
        .el-form-item__content {
            width: 500px;
        }
    }
}
</style>
