<template>
    <div class="header_main">
        <mds-card title="容器管理列表" :name="'raw'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
            <div>
                <el-form :inline="true" :model="form" size="small" label-width="70px" class="multi_row" @keyup.enter.native="qurery()" @submit.native.prevent>
                    <el-form-item label="归属工厂：">
                        <el-select v-model="form.factory" placeholder="请选择" style="width: 120px;">
                            <el-option label="" value="">
                                请选择
                            </el-option>
                            <el-option v-for="(item, index) in factoryList" :key="index" :label="item.deptName" :value="item.deptId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="归属车间：">
                        <el-select v-model="form.dept_id" placeholder="请选择" style="width: 120px;">
                            <el-option label="" value="">
                                请选择
                            </el-option>
                            <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="容器类型：">
                        <el-select v-model="form.holder_type" placeholder="请选择" style="width: 120px;">
                            <el-option label="" value="">
                                请选择
                            </el-option>
                            <el-option v-for="(item, index) in dictList" :key="index" :label="item.value" :value="item.code" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="容器号：">
                        <el-input v-model="form.holder_no" placeholder="手动输入" clearable style="width: 120px;" />
                    </el-form-item>
                    <el-form-item label="容器量：">
                        <el-input v-model="form.holder_hold" placeholder="手动输入" clearable style="width: 120px;" />
                    </el-form-item>
                    <el-form-item class="floatr">
                        <el-button v-if="isAuth('sys:holder:checkList')" type="primary" size="small" @click="qurery(true)">
                            查询
                        </el-button>
                        <el-button v-if="isAuth('sys:holder:save')" type="primary" size="small" @click="addOrupdate()">
                            新增
                        </el-button>
                        <el-button v-if="isAuth('sys:holder:delete')" type="danger" size="small" @click="remove">
                            批量删除
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                ref="table1"
                class="newTable"
                :height="mainClientHeight - 55 - 39 - 47"
                header-row-class-name="tableHead"
                :data="list"
                border
                tooltip-effect="dark"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="45"
                    fixed
                />
                <el-table-column
                    type="index"
                    :index="indexMethod"
                    label="序号"
                    width="55"
                    fixed
                />
                <el-table-column
                    prop="typeName"
                    label="容器类型"
                    :show-overflow-tooltip="true"
                    width="100"
                />
                <el-table-column
                    prop="holderNo"
                    label="容器号"
                    :show-overflow-tooltip="true"
                    width="80"
                />
                <el-table-column
                    prop="holderName"
                    :show-overflow-tooltip="true"
                    label="容器描述"
                />
                <el-table-column
                    prop="holderHold"
                    label="容器量"
                    :show-overflow-tooltip="true"
                    width="80"
                />
                <el-table-column
                    prop="holderPatch"
                    label="批数"
                    :show-overflow-tooltip="true"
                    width="80"
                />
                <el-table-column label="状态" prop="holderStatusName" width="120" />
                <el-table-column
                    prop="holderArea"
                    label="物理区域"
                    :show-overflow-tooltip="true"
                    width="120"
                />
                <el-table-column
                    prop="factoryName"
                    label="归属工厂"
                    :show-overflow-tooltip="true"
                    width="120"
                />
                <el-table-column
                    prop="deptName"
                    label="归属车间"
                    :show-overflow-tooltip="true"
                    width="92"
                />
                <el-table-column
                    fixed="right"
                    label="操作"
                    header-align="left"
                    align="left"
                    width="65"
                >
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('sys:holder:delete') && isAuth('sys:holder:findById')" style="padding: 0;" type="text" @click="addOrupdate(scope.row.holderId)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                :current-page="form.currPage"
                :page-sizes="[10, 20, 50]"
                :page-size="form.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="form.totalCount"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </mds-card>
        <con-addor-update v-if="visible" ref="addOrupdate" @refreshDataList="GetContainerList" />
    </div>
</template>

<script>
import { BASICDATA_API, SYSTEMSETUP_API } from '@/api/api';
import ConAddorUpdate from './ContaninerAddorUpdate';
export default {
    name: 'ContainerManage',
    components: {
        ConAddorUpdate
    },
    data() {
        return {
            visible: false,
            form: {
                type: 'holder_type',
                factory: '',
                deptId: '',
                holderType: '',
                holderNo: '',
                holderHold: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            factoryList: [],
            workshop: [],
            // currPage: 1,
            // pageSize: 10,
            // totalCount: 0,
            multipleSelection: [],
            dictList: [],
            list: []
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
        'form.factory'(n) {
            this.Getdeptcode(n);
            this.getDictList(n);
        }
    },
    mounted() {
        this.GetContainerList();
        this.getDictList();
        this.getFactoryList();
        // this.Getdeptcode(this.form.factoryId)
    },
    methods: {
        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.form.currPage) - 1) * (Number(this.form.pageSize));
        },
        // 获取容器列表
        GetContainerList() {
            this.$http(`${BASICDATA_API.CONTAINERLIST1_API}`, 'POST', this.form).then(({ data }) => {
                if (data.code === 0) {
                    this.multipleSelection = [];
                    this.list = data.page.list;
                    this.form.currPage = data.page.currPage;
                    this.form.pageSize = data.page.pageSize;
                    this.form.totalCount = data.page.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
                this.visible = false;
            });
        },
        // 容器参数下拉
        getDictList() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { type: 'holder_type' }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.dictList = data.dicList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        getFactoryList() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(res => {
                if (res.data.code === 0) {
                    this.factoryList = res.data.typeList;
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            });
        },
        // 获取归属车间,根据工厂ID
        Getdeptcode(factoryId) {
            if (factoryId) {
                this.$set(this.form, 'dept_id', '');
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: factoryId }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
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
                this.multipleSelection.push(item.holderId);
            });
        },
        // 查询
        qurery(st) {
            if (st) {
                this.form.currPage = 1;
            }
            this.GetContainerList(this.form);
        },
        // 编辑
        addOrupdate(id) {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.addOrupdate.init(id);
            });
        },
        // 删除
        remove() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请选择要删除的容器');
            } else {
                this.$confirm('确认删除容器, 是否继续?', '删除容器', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.$http(`${BASICDATA_API.CONTAINERDEL_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                            if (data.code === 0) {
                                this.$successToast('删除成功!');
                                this.multipleSelection = [];
                                this.GetContainerList();
                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    })
                    .catch();
            }
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.form.pageSize = val;
            this.GetContainerList(this.form);
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.form.currPage = val;
            this.GetContainerList(this.form);
        }
    }
};
</script>

<style scoped></style>
<style lang="scss">
.main {
    h3 {
        margin-bottom: 10px;
        font-weight: 600;
        font-size: 16px;
        line-height: 38px;
    }
}
.topforms1 {
    input {
        width: 140px !important;
    }
}
</style>
