<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-row type="flex">
                <el-col>
                    <el-form :model="params" size="small" :inline="true" label-position="right" label-width="70px" class="sole_row">
                        <el-form-item label="生产工厂：">
                            <el-select v-model="params.factoryId" class="selectwpx" style="width: 140px;" @change="changeOptions('factory')">
                                <el-option label="请选择" value="" />
                                <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <el-select v-model="params.workshopId" class="selectwpx" style="width: 140px;" @change="changeOptions('workshop')">
                                <el-option label="请选择" value="" />
                                <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单日期：">
                            <el-date-picker v-model="params.orderDate" type="date" value-format="yyyy-MM-dd" style="width: 140px;" />
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col style="width: 140px;">
                    <el-button v-if="isAuth('fer:openHolder:list')" type="primary" size="small" @click="getOrderList()">
                        查询
                    </el-button>
                    <el-button type="primary" size="small" style="float: right; margin-bottom: 10px;" @click="pushPage('')">
                        新增
                    </el-button>
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
            <mds-card title="申请列表" :name="'applylist'" style="margin-top: 5px;">
                <el-table class="newTable" header-row-class-name="tableHead" :data="dataList" border tooltip-effect="dark" @row-dblclick="showDetail">
                    <el-table-column type="index" label="序号" width="55" fixed />
                    <el-table-column label="车间" :show-overflow-tooltip="true" min-width="110">
                        <template slot-scope="scope">
                            {{ scope.row.workShopName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="申请编码" :show-overflow-tooltip="true" min-width="140">
                        <template slot-scope="scope">
                            {{ scope.row.applyNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" min-width="65">
                        <template slot-scope="scope">
                            {{ scope.row.confirmFlag === '1' ? '已确认' : scope.row.status === 'saved' ? '已保存' : scope.row.status === 'submit' ? '已提交' : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="物料" :show-overflow-tooltip="true" min-width="180">
                        <template slot-scope="scope">
                            {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="半成品类别" :show-overflow-tooltip="true" min-width="100">
                        <template slot-scope="scope">
                            {{ scope.row.halfName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="申请数量" min-width="80">
                        <template slot-scope="scope">
                            {{ scope.row.amount }}
                        </template>
                    </el-table-column>
                    <el-table-column label="生产日期" min-width="105">
                        <template slot-scope="scope">
                            {{ scope.row.productDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="申请人员" min-width="140">
                        <template slot-scope="scope">
                            {{ scope.row.changer }}
                        </template>
                    </el-table-column>
                    <el-table-column label="申请时间" min-width="165">
                        <template slot-scope="scope">
                            {{ scope.row.changed }}
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="90">
                        <template slot-scope="scope">
                            <el-button v-if="isAuth('fer:openHolder:list')" type="text" size="small" @click="pushPage(scope.row.id)">
                                详情
                            </el-button>
                            <el-button v-if="isAuth('fer:openHolder:delete') && scope.row.status === 'saved'" type="text" size="small" @click="deleteRow(scope.row.id)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row>
                    <el-pagination :current-page="currPage" :page-sizes="[5, 10, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </mds-card>
            <mds-card title="开罐明细" :name="'openDetail'">
                <el-table class="newTable" header-row-class-name="tableHead" :data="detailList" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="55" fixed />
                    <el-table-column label="申请编码" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.applyNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="罐号" :show-overflow-tooltip="true" min-width="110">
                        <template slot-scope="scope">
                            {{ scope.row.holderName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单类型" :show-overflow-tooltip="true" min-width="110">
                        <template slot-scope="scope">
                            {{ scope.row.orderTypeName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="发酵天数/天" :show-overflow-tooltip="true" min-width="95">
                        <template slot-scope="scope">
                            {{ scope.row.ferDays }}
                        </template>
                    </el-table-column>
                    <el-table-column label="半成品类别" :show-overflow-tooltip="true" min-width="130">
                        <template slot-scope="scope">
                            {{ scope.row.halfType }}
                        </template>
                    </el-table-column>
                    <el-table-column label="数量（方）" min-width="100">
                        <template slot-scope="scope">
                            {{ (scope.row.amount * 1) / 1000 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" width="110">
                        <template slot-scope="scope">
                            {{ scope.row.batch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" :show-overflow-tooltip="true" min-width="80">
                        <template slot-scope="scope">
                            {{ scope.row.remark }}
                        </template>
                    </el-table-column>
                    <el-table-column label="确认人员" show-overflow-tooltip min-width="120">
                        <template slot-scope="scope">
                            {{ scope.row.changer }}
                        </template>
                    </el-table-column>
                    <el-table-column label="确认时间" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.changed }}
                        </template>
                    </el-table-column>
                </el-table>
            </mds-card>
        </div>
    </div>
</template>

<script lang="ts">
import { BASICDATA_API, SQU_API } from '@/api/api';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { dateFormat, headanimation } from '@/net/validate';
@Component({
    components: {}
})
export default class Index extends Vue {
    // 将common中的参数复制一份到本地
    // NEEDTODO
    /* eslint-disable no-invalid-this */
    params = {
        factoryId: this.$store.state.common.SqueezeApplyPot.factoryId,
        factoryName: this.$store.state.common.SqueezeApplyPot.factoryName,
        workshopId: this.$store.state.common.SqueezeApplyPot.workshopId,
        workshopName: this.$store.state.common.SqueezeApplyPot.workshopName,
        orderDate: this.$store.state.common.SqueezeApplyPot.orderDate
    };

    factoryList = [];
    workshopList = [];
    potList = [];
    materialList = [];
    totalList = [];
    detailList = [];
    dataList = [];
    searched = false;
    currPage = 1;
    pageSize = 5;
    totalCount = 0;
    mounted() {
        headanimation(Vue.prototype.$);
        const now = dateFormat(new Date(), 'yyyy-MM-dd');
        this.params.orderDate = now;
        this.getFactory();
        this.getWorkshop(this.params.factoryId);
        // this.getFermentPot(this.params.factoryId)
    }

    get mainTabs() {
        return this.$store.state.common.mainTabs;
    }

    set mainTabs(val) {
        this.$store.commit('common/updateMainTabs', val);
    }

    pushPage(applyId) {
        // applyNo = ''就是新增
        // 保存当前单号
        this.$store.commit('common/updateSqueezeApplyPotApplyId', applyId);
        const name = 'MDS-views-page-DataEntry-Squeeze-applyPot-detail';
        this.mainTabs = this.mainTabs.filter(item => item.name !== name);
        setTimeout(() => {
            this.$router.push({ name });
        }, 100);
    }

    deleteRow(id) {
        this.$confirm('确认要删除该数据吗?', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            Vue.prototype.$http(`${SQU_API.POT_APPLY_DEL_API}`, `POST`, [id]).then(({ data }) => {
                if (data.code === 0) {
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getOrderList();
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        }).catch(() => {
            // this.$infoToast('已取消删除');
        });
    }

    changeOptions(flag: string) {
        if (flag === 'factory') {
            const item: any = this.factoryList.find((ele: any) => ele.deptId === this.params.factoryId);// eslint-disable-line
            this.params.factoryName = item ? item.deptName : '';
        } else if (flag === 'workshop') {
            const item: any = this.workshopList.find((ele: any) => ele.deptId === this.params.workshopId);// eslint-disable-line
            this.params.workshopName = item ? item.deptName : '';
        }
    }

    // 获取工厂
    getFactory() {
        this.factoryList = [];
        Vue.prototype.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(res => {
            if (res.data.code === 0) {
                this.factoryList = res.data.typeList;
                if (!this.params.factoryId && res.data.typeList.length > 0) {
                    this.params.factoryId = res.data.typeList[0].deptId;
                    this.params.factoryName = res.data.typeList[0].deptName;
                }
            } else {
                this.$notify.error({ title: '错误', message: res.data.msg });
            }
        });
    }

    // 根据工厂获车间
    getWorkshop(fid: string) {
        this.workshopList = [];
        if (fid) {
            Vue.prototype.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: fid, deptName: '压榨' }, false, false, false).then(res => {
                if (res.data.code === 0) {
                    this.workshopList = res.data.typeList;
                    if (!this.params.workshopId && res.data.typeList.length > 0) {
                        this.params.workshopId = res.data.typeList[0].deptId;
                        this.params.workshopName = res.data.typeList[0].deptName;
                    }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.data.msg
                    });
                }
            });
        }
    }

    // 发酵罐
    // getFermentPot (fid: string) {
    //   this.potList = []
    //   if (fid) {
    //     Vue.prototype.$http(`${SQU_API.MATERIAL_APPLY_POT_LIST_API}`, 'POST', {factory: fid}, false, false, false).then(res => {
    //       if (res.data.code === 0) {
    //         this.potList = res.data.num
    //         // if (!this.params.factoryId && res.data.num.length > 0) {
    //         //   this.params.workshopId = res.data.num[0].holderId
    //         // }
    //       } else {
    //         this.$notify.error({title: '错误', message: res.data.msg})
    //       }
    //     })
    //   }
    // }
    setStore(params) {
        this.$store.commit('common/updateSqueezeApplyPot', params);
    }

    getOrderList() {
        if (this.params.factoryId === '') {
            Vue.prototype.$warningToast('请选择工厂');
            return;
        }
        // if (this.params.workshopId === '') {
        //   this.$notify.error({title: '错误', message: '请选择车间'})
        //   return
        // }
        // if (this.params.orderDate === '') {
        //   this.$message.error('请选择订单日期')
        //   return
        // }
        this.searched = true;
        // 保存选项值到common store
        this.setStore(this.params);
        const queryParams = {
            factory: this.params.factoryId,
            workShop: this.params.workshopId,
            productDate: this.params.orderDate ? this.params.orderDate : '',
            currPage: String(this.currPage),
            pageSize: String(this.pageSize)
        };
        this.retrieveOrderList(queryParams);
    }

    retrieveOrderList(params) {
        this.totalList = [];
        Vue.prototype.$http(`${SQU_API.POT_APPLY_LIST_API}`, `POST`, params).then(res => {
            if (res.data.code === 0) {
                this.totalList = res.data.page.list;
                this.dataList = res.data.page.list;
                this.totalCount = res.data.page.totalCount;
                // this.totalCount = this.totalList.length
            } else {
                this.$notify.error({ title: '错误', message: res.data.msg });
            }
        });
    }

    showDetail(row) {
        this.detailList = [];
        Vue.prototype
            .$http(`${SQU_API.POT_APPLY_DETAIL_API}`, `POST`, {
                openId: row.id
            })
            .then(res => {
                if (res.data.code === 0) {
                    this.detailList = res.data.list;
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            });
    }

    // 改变每页条数
    handleSizeChange(val: number) {
        this.pageSize = val;
        this.currPage = 1;
        this.getOrderList();
    }

    // 跳转页数
    handleCurrentChange(val: number) {
        this.currPage = val;
        this.getOrderList();
    }

    // get dataList () {
    //   return this.totalList.slice((this.currPage - 1) * this.pageSize, this.currPage * this.pageSize)
    // }
    @Watch('params', { deep: true })
    onChangeValue() {
        this.searched = false;
        this.totalList = [];
        this.detailList = [];
    }

    @Watch('params.factoryId')
    onFactoryValue(newVal: string) {
        this.params.workshopId = '';
        this.params.workshopName = '';
        this.getWorkshop(newVal);
        // this.getFermentPot(newVal)
    }
}
</script>

<style lang="scss"></style>
