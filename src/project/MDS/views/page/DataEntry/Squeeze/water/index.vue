<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-row>
                <el-col>
                    <el-form :model="formHeader" :inline="true" size="small" label-width="70px" class="sole_row">
                        <el-form-item label="生产工厂：">
                            <el-select v-model="formHeader.factory" placeholder="请选择" class="width180px">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <el-select v-model="formHeader.workShop" placeholder="请选择" class="width180px">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="布浆线：">
                            <el-select v-model="formHeader.productLine" placeholder="请选择" class="width180px">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in productline" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item class="floatr">
                            <el-button v-if="isAuth('prs:drench:drenchList')" type="primary" size="small" @click="SearchList">
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div class="toggleSearchBottom">
                <em class="el-icon-caret-top" />
            </div>
        </el-card>
        <div class="tableCard">
            <div class="toggleSearchTop" style=" position: relative; margin-bottom: 8px; background-color: white; border-radius: 5px;">
                <em class="el-icon-caret-bottom" />
            </div>
            <mds-card title="自淋信息" name="waterInfo" style="margin-top: 5px;" :pack-up="false">
                <el-table class="newTable" :data="waterList" border header-row-class-name="tableHead" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" />
                    <el-table-column label="工序" min-width="50">
                        自淋
                    </el-table-column>
                    <el-table-column label="气垫车号" min-width="100" prop="gx" :show-overflow-tooltip="true">
                        <template slot="header">
                            <em class="reqI">*</em><span>气垫车号</span>
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.deviceName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="布浆线" :show-overflow-tooltip="true" prop="deptName" />
                    <el-table-column label="布浆结束时间" prop="pulpEndDate" min-width="120" />
                    <el-table-column label="自淋结束时间" prop="drenchEndDate" min-width="150">
                        <template slot-scope="scope">
                            <el-date-picker v-model="scope.row.drenchEndDate" type="datetime" :disabled="!isRedact" placeholder="选择日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" size="small" style="width: 172px;" @input="changedDranch(scope.row)" />
                        </template>
                    </el-table-column>
                    <el-table-column label="自淋时间(H)" min-width="100" prop="drenchTime" />
                    <el-table-column label="挪笼操作员" min-width="120" :show-overflow-tooltip="true">
                        <template slot="header">
                            <em class="reqI">*</em><span>挪笼操作员</span>
                        </template>
                        <template slot-scope="scope">
                            <el-col v-if="!scope.row.moveOperator">
                                <span :style="{'cursor':isRedact?'pointer':''}" @click="selectUser(scope.row)">
                                    <em>{{ scope.row.moveOperator }}</em>
                                    <em>点击选择人员</em>
                                </span>
                            </el-col>
                            <span v-else :style="{'cursor':isRedact?'pointer':''}" @click="selectUser(scope.row)">{{ scope.row.moveOperator }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="布浆操作员" prop="drenchOperator" min-width="150" />
                </el-table>
            </mds-card>
        </div>
        <el-dialog title="人员分配" :close-on-click-modal="false" :visible.sync="visible">
            <el-row>
                <el-col style="width: 500px;">
                    <el-transfer
                        v-model="selctId"
                        filterable
                        :titles="['未分配人员', '已分配人员']"
                        :filter-method="filterMethod"
                        filter-placeholder="请输入用户名称"
                        :data="userlist"
                    />
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="updatauser(row)">确定</el-button>
            </span>
        </el-dialog>
        <redact-box>
            <template slot="button">
                <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('prs:dernchUpdate')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                    {{ isRedact?'取消':'编辑' }}
                </el-button>
                <template v-if="isRedact" style="float: right;">
                    <el-button v-if="isAuth('prs:dernchUpdate')" type="primary" size="small" @click="savedOrSubmitForm('saved')">
                        保存
                    </el-button>
                    <el-button v-if="isAuth('prs:dernchUpdate')" type="primary" size="small" @click="SubmitForm">
                        提交
                    </el-button>
                </template>
            </template>
        </redact-box>
    </div>
</template>

<script>
import { BASICDATA_API, SYSTEMSETUP_API, SQU_API } from '@/api/api';
import { headanimation, setUserList, dateFormat } from '@/net/validate';
export default {
    name: 'Water',
    data() {
        return {
            isRedact: false,
            contentshow: false,
            succmessage: '',
            orderStatus: '',
            factory: [],
            workshop: [],
            productline: [],
            formHeader: {
                factory: '',
                workShop: '',
                productLine: '',
                productDate: '',
                upMan: '',
                upDate: '',
                clickstatus: 'saved'
            },
            waterList: [],
            visible: false,
            selctId: [],
            userlist: [],
            filterMethod(query, item) {
                return item.screncon.indexOf(query) > -1;
            },
            multipleSelection: []
        };
    },
    watch: {
        'formHeader.factory'(n) {
            this.Getdeptbyid(n);
        },
        'formHeader.workShop'(n) {
            this.GetParentline(n);
        }
    },
    mounted() {
        headanimation(this.$);
        this.Getdeptcode();
    },
    methods: {
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    this.formHeader.factory = data.typeList[0].deptId;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.formHeader.workShop = '';
            this.formHeader.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                    deptId: id,
                    deptName: '压榨'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (data.typeList.length > 0) {
                            this.formHeader.workShop = data.typeList[0].deptId;
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
            this.formHeader.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYPARENTID1_API}`, 'POST', {
                    parentId: id,
                    deptType: 'proLine'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.productline = data.childList;
                        this.formHeader.productLine = data.childList[0].deptId;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.productline = [];
            }
        },
        SearchList() {
            // if (!this.formHeader.factory || this.formHeader.factory === '') {
            //   this.$notify.error({title: '错误', message: '请选择生产工厂'})
            //   return false
            // }
            // if (!this.formHeader.workShop || this.formHeader.workShop === '') {
            //   this.$message.error('请选择生产车间')
            //   return false
            // }
            // if (!this.formHeader.productLine || this.formHeader.productLine === '') {
            //   this.$message.error('请选择布浆线')
            //   return false
            // }
            this.contentshow = true;
            this.$http(`${SQU_API.WATERLIST_API}`, 'POST', {
                factory: this.formHeader.factory,
                workShop: this.formHeader.workShop,
                productLine: this.formHeader.productLine,
                productDate: this.formHeader.productDate
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.waterList = data.drechinfo;
                    this.waterList.map(item => {
                        if (!item.drenchTime || item.drenchTime === '') {
                            this.$set(item, 'drenchTime', ((new Date() - new Date(item.pulpEndDate)) / 3600000).toFixed(2));
                        }
                        item.drenchEndDate = item.drenchEndDate ? item.drenchEndDate : dateFormat(new Date(), 'yyyy-MM-dd hh:mm');
                    });
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        selectUser(row) {
            if (this.isRedact) {
                this.row = row;
                this.$http(`${SYSTEMSETUP_API.USERLIST_API}`, 'POST', {
                    deptId: this.formHeader.workShop,
                    pageSize: '9999',
                    currPage: '1'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.userlist = setUserList(data.page.list);
                        if (this.row.moveOperator) {
                            this.selctId = this.row.moveOperator.split(',');
                        }
                        this.visible = true;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 人员确定
        updatauser(row) {
            this.$set(row, 'moveOperator', this.selctId.join(','));
            this.selctId = [];
            this.visible = false;
        },
        // 提交
        SubmitForm() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('没有勾选提交数据');
                return false;
            }
            for (const items of this.multipleSelection) {
                if (!items.moveOperator || items.moveOperator === '') {
                    this.$warningToast('请选择挪笼操作人');
                    return false;
                }
            }
            this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.savedOrSubmitForm('submit');
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        // 保存
        savedOrSubmitForm(str) {
            let configurl;
            if (str === 'submit') {
                configurl = SQU_API.WATERSUBMIT_API;
                this.succmessage = '提交成功';
                this.$http(`${configurl}`, 'POST', this.multipleSelection).then(({ data }) => {
                    if (data.code === 0) {
                        this.SearchList();
                        this.$notify({
                            title: '成功',
                            message: this.succmessage,
                            type: 'success'
                        });
                        this.isRedact = false;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                configurl = SQU_API.WATERSAVE_API;
                this.succmessage = '保存成功';
                this.$http(`${configurl}`, 'POST', this.waterList).then(({ data }) => {
                    if (data.code === 0) {
                        this.SearchList();
                        this.$notify({
                            title: '成功',
                            message: this.succmessage,
                            type: 'success'
                        });
                        this.isRedact = false;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        changedDranch(row) {
            row.drenchTime = ((new Date(row.drenchEndDate) - new Date(row.pulpEndDate)) / 3600000).toFixed(2);
        }
    }
};
</script>

<style lang="scss" scoped>
.width180px {
    width: 180px;
}
.searchCard {
    .el-button--primary,
    .el-button--primary:focus {
        color: #000;
        background-color: #fff;
        border-color: #d9d9d9;
    }
    .el-button--primary:hover {
        color: #fff;
        background-color: #1890ff;
    }
    .el-button--primary:first-child {
        color: #fff;
        background-color: #1890ff;
        border-color: #1890ff;
    }
}
</style>
