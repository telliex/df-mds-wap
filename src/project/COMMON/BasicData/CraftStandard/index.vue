<template>
    <div class="header_main">
        <mds-card title="工艺标准" :pack-up="false">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-input v-model.trim="queryForm.productMaterial" size="small" placeholder="领用物料" suffix-icon="el-icon-search" clearable style="width: 160px; margin-right: 10px;" @clear="clearForm" />
                    <el-button v-if="isAuth('craftQuery')" type="primary" size="small" style="margin-right: 10px;" @click="() => { queryForm.current = 1; queryType = 1; GetData() }">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('craftQuery')" type="primary" size="small" @click="visibleHightLevelQuery = true">
                        高级查询
                    </el-button>
                    <el-button v-if="isAuth('craftInsert')" type="primary" size="small" style="margin-left: 10px;" @click="AddDate()">
                        新增
                    </el-button>
                    <el-button v-if="isAuth('craftDel')" type="danger" size="small" @click="remove">
                        批量删除
                    </el-button>
                </div>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :height="mainClientHeight - 72 - 47" :data="tableData" border tooltip-effect="dark" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" fixed="left" align="center" />
                <el-table-column type="index" :index="index => index + 1 + (Number(queryForm.current) - 1) * (Number(queryForm.size))" label="序号" width="50px" fixed />
                <el-table-column label="生产物料" min-width="180" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.productMaterial }} {{ scope.row.productMaterialName }}
                    </template>
                </el-table-column>
                <el-table-column label="标准保温时间下限(min)" prop="warmTimeLower" min-width="180" :show-overflow-tooltip="true" />
                <el-table-column label="标准保温时间上限(min)" prop="warmTimeFloor" min-width="180" :show-overflow-tooltip="true" />
                <el-table-column label="标准保温温度下限(℃)" prop="warmTempLower" min-width="170" :show-overflow-tooltip="true" />
                <el-table-column label="标准保温温度上限(℃)" prop="warmTempFloor" min-width="170" :show-overflow-tooltip="true" />
                <el-table-column label="有效开始日期" prop="startDate" min-width="140" :show-overflow-tooltip="true" />
                <el-table-column label="有效结束日期" prop="endDate" min-width="140" :show-overflow-tooltip="true" />
                <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />
                <el-table-column label="操作人" prop="changer" :show-overflow-tooltip="true" />
                <el-table-column label="操作时间" prop="changed" :show-overflow-tooltip="true" />
                <el-table-column label="操作" width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('craftEdit')" class="ra_btn" type="text" round size="mini" @click="redact(scope.row)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="queryForm.current" :page-sizes="[10, 20, 50]" :page-size="queryForm.size" layout="total, sizes, prev, pager, next, jumper" :total="queryForm.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <el-dialog width="500px" title="高级查询" :close-on-click-modal="false" :visible.sync="visibleHightLevelQuery">
            <el-form :inline="true" size="small" :model="queryForm" label-width="95px">
                <el-form-item label="保温时间：">
                    <el-row style="width: 314px;">
                        <el-col :span="12">
                            <el-input v-model.trim="queryForm.warmTimeFloor" style="width: 140px;" clearable />
                            <span style="margin-left: 5px;">-</span>
                        </el-col>
                        <el-col :span="12">
                            <el-input v-model.trim="queryForm.warmTimeLower" style="width: 140px;" clearable />
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="保温温度：">
                    <el-row style="width: 314px;">
                        <el-col :span="12">
                            <el-input v-model.trim="queryForm.warmTempFloor" style="width: 140px;" clearable />
                            <span style="margin-left: 5px;">-</span>
                        </el-col>
                        <el-col :span="12">
                            <el-input v-model.trim="queryForm.warmTempLower" style="width: 140px;" clearable />
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="有效期：">
                    <el-row style="width: 314px;">
                        <el-col :span="12">
                            <el-date-picker v-model="queryForm.startDate" type="date" style="width: 140px;" value-format="yyyy-MM-dd" clearable />
                            <span style="margin-left: 5px;">-</span>
                        </el-col>
                        <el-col :span="12">
                            <el-date-picker v-model="queryForm.endDate" type="date" style="width: 140px;" value-format="yyyy-MM-dd" clearable />
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visibleHightLevelQuery = false">取消</el-button>
                <el-button type="primary" @click="() => { queryForm.current = 1; queryType = 2; GetData() }">确定</el-button>
            </span>
        </el-dialog>
        <craft-add-or-update v-if="addOrUpdate" ref="addOrUpdate" @refreshDataList="GetData" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { BASIC_API } from 'common/api/api';
    import CraftAddOrUpdate from './CraftAddOrUpdate.vue'

    @Component({
        name: 'CraftStandard',
        components: {
            CraftAddOrUpdate
        }
    })
    export default class CraftStandard extends Vue {
        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        $refs: {
            addOrUpdate: HTMLFormElement;
        };

        queryType = 1;
        queryForm = {
            current: 1,
            size: 10,
            total: 0,
            productMaterial: '',
            warmTimeFloor: '',
            warmTimeLower: '',
            warmTempFloor: '',
            warmTempLower: '',
            startDate: '',
            endDate: ''
        };

        visibleHightLevelQuery = false;
        addOrUpdate = false;
        tableData = [];
        multipleSelection: string[] = [];

        mounted() {
            this.GetData()
        }

        clearForm() {
            this.queryForm = {
                current: 1,
                size: 10,
                total: 0,
                productMaterial: '',
                warmTimeFloor: '',
                warmTimeLower: '',
                warmTempFloor: '',
                warmTempLower: '',
                startDate: '',
                endDate: ''
            };
            this.queryType = 1;
            this.GetData()
        }

        remove() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请选择要删除的数据');
            } else {
                this.$confirm('确认删除, 是否继续?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    BASIC_API.CRAFT_DEL_API({
                        ids: this.multipleSelection
                    }).then(() => {
                        this.$successToast('删除成功!');
                        this.multipleSelection = [];
                        this.GetData();
                    })
                }).catch()
            }
        }

        GetData() {
            let params;
            if (this.queryType === 1) {
                params = {
                    productMaterial: this.queryForm.productMaterial,
                    current: this.queryForm.current,
                    size: this.queryForm.size,
                    total: this.queryForm.current
                }
            } else if (this.queryType === 2) {
                params = {
                    current: this.queryForm.current,
                    size: this.queryForm.size,
                    total: this.queryForm.current,
                    productMaterial: '',
                    warmTimeFloor: this.queryForm.warmTimeFloor,
                    warmTimeLower: this.queryForm.warmTimeLower,
                    warmTempFloor: this.queryForm.warmTempFloor,
                    warmTempLower: this.queryForm.warmTempLower,
                    startDate: this.queryForm.startDate,
                    endDate: this.queryForm.endDate
                }
            }
            BASIC_API.CRAFT_LIST_API(params).then(({ data }) => {
                this.visibleHightLevelQuery = false;
                this.addOrUpdate = false;
                if (data.data.current === 1 && data.data.records.length === 0) {
                    this.$infoToast('暂无任何内容');
                }
                this.tableData = data.data.records;
                this.queryForm.current = data.data.current;
                this.queryForm.size = data.data.size;
                this.queryForm.total = data.data.total;
            });
        }

        AddDate() {
            this.addOrUpdate = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init();
            });
        }

        redact(row) {
            this.addOrUpdate = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(row);
            });
        }

        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item.id);
            });
        }

        // 改变每页条数
        handleSizeChange(val) {
            this.queryForm.size = val;
            this.GetData();
        }

        // 跳转页数
        handleCurrentChange(val) {
            this.queryForm.current = val;
            this.GetData();
        }
    }
</script>

<style scoped>

</style>
