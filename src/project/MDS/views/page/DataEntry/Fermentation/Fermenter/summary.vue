<template>
    <div class="header_main" style="padding-top: 0;">
        <el-tabs v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">发酵一览表</span>
                <div class="titleLeft">
                    (单位:罐)
                    <el-button v-if="isAuth('report:production:fermentationExport')" type="primary" size="small" style="float: right;" @click="ExportExcelA(true)">
                        导出
                    </el-button>
                </div>
                <el-table class="newTable" :data="dataList2" border header-row-class-name="tableHead" style="margin-top: 10px;">
                    <el-table-column label=" " prop="type" />
                    <el-table-column label="空罐" prop="empty" />
                    <el-table-column label="<30" prop="ltThirty" />
                    <el-table-column label="30≤N<60" prop="ltSixty" min-width="110" />
                    <el-table-column label="60≤N<90" prop="ltNinety" min-width="110" />
                    <el-table-column label="90≤N<130" prop="ltOneHundredAndThree" min-width="110" />
                    <el-table-column label="130≤N<150" prop="ltOneHundredAndFive" min-width="110" />
                    <el-table-column label="150≤N<180" prop="ltOneHundredAndEight" min-width="110" />
                    <el-table-column label="180≤N<200" prop="ltTwoHundred" min-width="110" />
                    <el-table-column label="200≤N" prop="gtTwoHundred" />
                    <el-table-column label="压榨" prop="used" />
                    <el-table-column label="占用" prop="otherUsed" />
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">发酵库存列表</span>
                <div class="titleLeft">
                    <em class="iconfont factory-kucun" style=" margin-right: 10px; color: #666;" />发酵罐分布情况
                    <el-button v-if="isAuth('report:production:fermentationExport')" type="primary" size="small" style=" float: right; color: #fff; background-color: #1890ff;" @click="ExportExcelA(true)">
                        导出
                    </el-button>
                </div>
                <!--                <el-table class="newTable" :data="headerInfo" border header-row-class-name="tableHead" style="margin-top: 10px;">-->
                <!--                    <el-table-column label="区域" show-overflow-tooltip prop="holderArea" />-->
                <!--                    <el-table-column label="空罐" show-overflow-tooltip prop="empty" />-->
                <!--                    <el-table-column label="投料中" show-overflow-tooltip prop="feeding" />-->
                <!--                    <el-table-column label="发酵中" show-overflow-tooltip prop="fermentation" />-->
                <!--                    <el-table-column label="领用中" show-overflow-tooltip prop="collarUse" />-->
                <!--                    <el-table-column label="其他占用罐" show-overflow-tooltip prop="other" />-->
                <!--                    <el-table-column label="味极鲜罐数" show-overflow-tooltip prop="weijixian" />-->
                <!--                    <el-table-column label="六月鲜罐数" show-overflow-tooltip prop="liuyuexian" />-->
                <!--                    <el-table-column label="TB罐数" show-overflow-tooltip prop="tb" />-->
                <!--                    <el-table-column label="JYTB罐数" show-overflow-tooltip prop="jytb" />-->
                <!--                    <el-table-column label="JY罐数" show-overflow-tooltip prop="jy" />-->
                <!--                    <el-table-column label="发酵一总罐数" show-overflow-tooltip prop="sum" width="110" />-->
                <!--                </el-table>-->
                <el-table class="newTable" :data="headerInfo" border header-row-class-name="tableHead" style="margin-top: 10px;">
                    <el-table-column v-for="(item, index) in header" :key="index" :label="item.label" :prop="item.label" show-overflow-tooltip />
                </el-table>
                <div class="titleLeft" style="margin-top: 15px;">
                    <em class="iconfont factory-icon_function_keyongkucun" style=" margin-right: 10px; color: #666;" />发酵总库存列表
                </div>
                <el-table class="newTable" :data="dataList" border header-row-class-name="tableHead" style="margin-top: 10px;">
                    <el-table-column label="车间" show-overflow-tooltip prop="workShop" width="100" />
                    <el-table-column label="罐号" show-overflow-tooltip prop="holderNo" width="50" />
                    <el-table-column label="状态" show-overflow-tooltip prop="holderStatus" width="70" />
                    <el-table-column label="投料数(M³)" show-overflow-tooltip prop="realInAmount" min-width="75" />
                    <el-table-column label="入库数(M³)" show-overflow-tooltip prop="ferAmount" min-width="75" />
                    <el-table-column label="库存数(M³)" show-overflow-tooltip prop="stockAmount" min-width="75" />
                    <el-table-column label="类别" prop="halfType" show-overflow-tooltip min-width="70" />
                    <el-table-column label="" show-overflow-tooltip prop="feedingDate" min-width="100">
                        <template slot="header">
                            投料开始<br>时间
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.feedingDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="" show-overflow-tooltip prop="fermentDate" min-width="100">
                        <template slot="header">
                            发酵开始<br>时间
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.fermentDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="发酵结束时间" show-overflow-tooltip prop="fermentEndDate" min-width="100">
                        <template slot="header">
                            发酵结束<br>时间
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.fermentEndDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="发酵期" show-overflow-tooltip prop="fermentTime" width="65" />
                    <el-table-column label="发酵时间" show-overflow-tooltip prop="fermentDays" min-width="50" />
                    <el-table-column label="压榨时间" show-overflow-tooltip prop="pulpDate" width="100" />
                    <el-table-column label="领用酱醪数(M³)" show-overflow-tooltip prop="useNums" min-width="80" />
                    <el-table-column label="出品数" show-overflow-tooltip prop="outAmount" min-width="70" />
                    <el-table-column label="出品率" show-overflow-tooltip prop="yield" min-width="70" />
                    <el-table-column label="发酵罐容量(M³)" show-overflow-tooltip prop="holderHold" />
                </el-table>
                <el-pagination
                    :current-page="currentPage"
                    :page-sizes="[10, 15, 30, 35]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { FERMENTATION_API, REP_API } from '@/api/api';
import { exportFile } from '@/net/validate';
export default {
    name: 'Summarys',
    data() {
        return {
            activeName: '1',
            currentPage: 1,
            pageSize: 10,
            total: 0,
            header: [],
            headerInfo: [],
            dataList: [],
            dataListAll: [],
            plantList: {
                workShop: ''
            },
            dataList2: []
        };
    },
    mounted() {
        this.GetList();
        this.GetList2();
    },
    methods: {
        GetList() {
            this.$http(`${FERMENTATION_API.FER_REPORT_LIST}`, 'POST', {
                workShop: this.$store.state.common.Fermentation.workShop
            }).then(({ data }) => {
                if (data.code === 0) {
                    // this.headerInfo = data.returnMap.head
                    if (data.returnMap.head.length) {
                        for (const key in data.returnMap.head[0]) {
                            this.header.push({
                                label: key
                            })
                        }
                    }
                    this.headerInfo = data.returnMap.head
                    this.dataListAll = data.returnMap.info;
                    this.total = data.returnMap.info.length;
                    this.changeList();
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.changeList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.changeList();
        },
        changeList() {
            this.dataList = this.dataListAll.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize);
        },
        // 导出
        ExportExcelA() {
            this.plantList.workShop = this.$store.state.common.Fermentation.workShop;
            this.plantList.factory = this.$store.state.common.Fermentation.factory;
            exportFile(`${FERMENTATION_API.FER_REPORT_EXPORTLIST}`, '发酵罐一览表', this);
        },
        GetList2() {
            console.log(this.$store.state.common.Fermentation)
            this.$http(`${REP_API.FERMENTATION_LIST_API}`, 'POST', { factory: this.$store.state.common.Fermentation.factory }).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList2 = data.fermentationStatus;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        FormExportExcel() {
            exportFile(`${REP_API.FERMENTATION_EXPORT_API}`, '发酵一览表报表', this);
        }
    }
};
</script>

<style lang="scss" scoped>
.titleLeft {
    margin: 0;
    font-weight: 600;
    line-height: 32px;
}
</style>
