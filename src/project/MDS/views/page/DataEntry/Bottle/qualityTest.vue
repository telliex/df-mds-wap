<template>
    <div class="header_main">
        <el-card class="newCard">
            <el-form :model="formHeader" :inline="true" size="small" label-width="70px" class="multi_row">
                <el-form-item label="生产车间：">
                    <p class="bottom-line">
                        {{ formHeader.workShopName }}
                    </p>
                </el-form-item>
                <el-form-item label="生产产线：">
                    <p class="bottom-line">
                        {{ formHeader.productLineName }}
                    </p>
                </el-form-item>
                <el-form-item label="生产日期：">
                    <p class="bottom-line">
                        {{ formHeader.productDate }}
                    </p>
                </el-form-item>
                <el-form-item label="订单号：">
                    <p class="bottom-line">
                        {{ formHeader.orderNo }}
                    </p>
                </el-form-item>
                <el-form-item label="生产品项：">
                    <el-tooltip class="item" effect="dark" :content="formHeader.materialName + formHeader.materialCode" placement="top-start">
                        <p class="bottom-line">
                            {{ formHeader.materialName }}
                            {{ formHeader.materialCode }}
                        </p>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="计划产量：">
                    <p class="bottom-line">
                        {{ formHeader.planOutput }}
                    </p>
                </el-form-item>
                <el-form-item label="保存人员：">
                    <p class="bottom-line">
                        &nbsp;{{ formHeader.changer }}
                    </p>
                </el-form-item>
                <el-form-item label="保存时间：">
                    <p class="bottom-line">
                        &nbsp;{{ formHeader.changed }}
                    </p>
                </el-form-item>
                <el-form-item class="floatr">
                    <template style="float: right; margin-left: 10px;">
                        <el-button
                            type="primary"
                            size="small"
                            @click="
                                $router.push({
                                    path: '/MDS-views-page-DataEntry-Bottle-index',
                                })"
                        >
                            返回
                        </el-button>
                    </template>
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card title="质量检测">
            <template slot="titleBtn">
                <el-button type="primary" :disabled="!isRedact" size="small" style="float: right; margin-bottom: 5px;" @click="addRow">
                    新增
                </el-button>
            </template>
            <el-table :data="dataList" class="newTable" :row-class-name="rowDelFlag" border header-row-class-name="tableHead">
                <el-table-column type="index" label="序号" width="50" fixed="left" />
                <el-table-column label="参数" show-overflow-tooltip width="85" prop="parameter" fixed="left" />
                <el-table-column label="时间" width="200" prop="date">
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.date" type="datetime" size="small" :disabled="!isRedact" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择日期" style="width: 180px;" />
                    </template>
                </el-table-column>
                <el-table-column label="1#" min-width="100">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.parameter === '外观' || scope.row.parameter === '密封性能' || scope.row.parameter === '跌落性能'" v-model="scope.row.oneWell" :disabled="!isRedact" size="small">
                            <el-option value="合格">
                                合格
                            </el-option>
                            <el-option value="不合格">
                                不合格
                            </el-option>
                        </el-select>
                        <el-input v-else v-model="scope.row.oneWell" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="2#" min-width="100">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.parameter === '外观' || scope.row.parameter === '密封性能' || scope.row.parameter === '跌落性能'" v-model="scope.row.twoWell" :disabled="!isRedact" size="small">
                            <el-option value="合格">
                                合格
                            </el-option>
                            <el-option value="不合格">
                                不合格
                            </el-option>
                        </el-select>
                        <el-input v-else v-model="scope.row.twoWell" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="3#" min-width="100">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.parameter === '外观' || scope.row.parameter === '密封性能' || scope.row.parameter === '跌落性能'" v-model="scope.row.threeWell" :disabled="!isRedact" size="small">
                            <el-option value="合格">
                                合格
                            </el-option>
                            <el-option value="不合格">
                                不合格
                            </el-option>
                        </el-select>
                        <el-input v-else v-model="scope.row.threeWell" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="4#" min-width="100">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.parameter === '外观' || scope.row.parameter === '密封性能' || scope.row.parameter === '跌落性能'" v-model="scope.row.fourWell" :disabled="!isRedact" size="small">
                            <el-option value="合格">
                                合格
                            </el-option>
                            <el-option value="不合格">
                                不合格
                            </el-option>
                        </el-select>
                        <el-input v-else v-model="scope.row.fourWell" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="5#" min-width="100">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.parameter === '外观' || scope.row.parameter === '密封性能' || scope.row.parameter === '跌落性能'" v-model="scope.row.fiveWell" :disabled="!isRedact" size="small">
                            <el-option value="合格">
                                合格
                            </el-option>
                            <el-option value="不合格">
                                不合格
                            </el-option>
                        </el-select>
                        <el-input v-else v-model="scope.row.fiveWell" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="6#" min-width="100">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.parameter === '外观' || scope.row.parameter === '密封性能' || scope.row.parameter === '跌落性能'" v-model="scope.row.sixWell" :disabled="!isRedact" size="small">
                            <el-option value="合格">
                                合格
                            </el-option>
                            <el-option value="不合格">
                                不合格
                            </el-option>
                        </el-select>
                        <el-input v-else v-model="scope.row.sixWell" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="7#" min-width="100">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.parameter === '外观' || scope.row.parameter === '密封性能' || scope.row.parameter === '跌落性能'" v-model="scope.row.sevenWell" :disabled="!isRedact" size="small">
                            <el-option value="合格">
                                合格
                            </el-option>
                            <el-option value="不合格">
                                不合格
                            </el-option>
                        </el-select>
                        <el-input v-else v-model="scope.row.sevenWell" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="8#" show-overflow-tooltip min-width="100">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.parameter === '外观' || scope.row.parameter === '密封性能' || scope.row.parameter === '跌落性能'" v-model="scope.row.eightWell" :disabled="!isRedact" size="small">
                            <el-option value="合格">
                                合格
                            </el-option>
                            <el-option value="不合格">
                                不合格
                            </el-option>
                        </el-select>
                        <el-input v-else v-model="scope.row.eightWell" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="9#" show-overflow-tooltip min-width="100">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.parameter === '外观' || scope.row.parameter === '密封性能' || scope.row.parameter === '跌落性能'" v-model="scope.row.nineWell" :disabled="!isRedact" size="small">
                            <el-option value="合格">
                                合格
                            </el-option>
                            <el-option value="不合格">
                                不合格
                            </el-option>
                        </el-select>
                        <el-input v-else v-model="scope.row.nineWell" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="10#" show-overflow-tooltip min-width="100">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.parameter === '外观' || scope.row.parameter === '密封性能' || scope.row.parameter === '跌落性能'" v-model="scope.row.tenWell" :disabled="!isRedact" size="small">
                            <el-option value="合格">
                                合格
                            </el-option>
                            <el-option value="不合格">
                                不合格
                            </el-option>
                        </el-select>
                        <el-input v-else v-model="scope.row.tenWell" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="11#" show-overflow-tooltip min-width="100">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.parameter === '外观' || scope.row.parameter === '密封性能' || scope.row.parameter === '跌落性能'" v-model="scope.row.elevenWell" :disabled="!isRedact" size="small">
                            <el-option value="合格">
                                合格
                            </el-option>
                            <el-option value="不合格">
                                不合格
                            </el-option>
                        </el-select>
                        <el-input v-else v-model="scope.row.elevenWell" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="12#" show-overflow-tooltip min-width="100">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.parameter === '外观' || scope.row.parameter === '密封性能' || scope.row.parameter === '跌落性能'" v-model="scope.row.twelveWell" :disabled="!isRedact" size="small">
                            <el-option value="合格">
                                合格
                            </el-option>
                            <el-option value="不合格">
                                不合格
                            </el-option>
                        </el-select>
                        <el-input v-else v-model="scope.row.twelveWell" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="检测人" show-overflow-tooltip width="150">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.changer" :disabled="!isRedact" size="small">
                            <el-option
                                v-for="(data, index) in userlist"
                                :key="index"
                                :label="data.realName + '（' + (data.workNum !== null && data.workNum !== '' ? data.workNum : data.workNumTemp) + '）'"
                                :value="data.realName + '（' + (data.workNum !== null && data.workNum !== '' ? data.workNum : data.workNumTemp) + '）'"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" show-overflow-tooltip width="160">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.parameter === '外观'" class="delBtn" type="text" icon="el-icon-delete" :disabled="!isRedact" size="mini" @click="DelRow(scope.row, scope.$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-if="dataList.length!==0" :current-page="pages.currPage" :page-size="pages.pageSize" layout="prev, pager, next, jumper" :total="pages.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </mds-card>

        <mds-card title="异常事项">
            <el-input v-model="Textareas" type="textarea" :disabled="!isRedact" style="width: 100%; margin: 10px 0;" />
        </mds-card>

        <redact-box>
            <template slot="button">
                <el-button v-if="isAuth('bottle:workshop:techProductParameterList')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                    {{ isRedact ? '取消' : '编辑' }}
                </el-button>
                <template v-if="isRedact">
                    <el-button v-if="isAuth('bottle:workshop:techProductParameterList')" type="primary" size="small" @click="savedOrSubmitForm('saved')">
                        保存
                    </el-button>
                    <!-- <el-button v-if="isAuth('bottle:workshop:techProductParameterList')" type="primary" size="small" @click="SubmitForm">
                        提交
                    </el-button> -->
                </template>
            </template>
        </redact-box>
    </div>
</template>

<script>
import { dateFormat } from '@/net/validate';
import { BOTTLE_API, SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'QualityTest',
    data() {
        return {
            loading: false,
            formHeader: {
                orderNo: this.$store.state.common.Bottle.orderNo,
                materialCode: '',
                materialName: ''
            },
            pages: {
                currPage: 1,
                pageSize: 8,
                totalCount: 0
            },
            userlist: [],
            isRedact: false,
            dataList: [],
            orderId: this.$store.state.common.bottle.ProOrderId,
            Textareas: '',
            paramList: ['外观', '瓶高(mm)', '瓶口内径(mm)', '重量(g)', '满口容量(ml)', '密封性能', '跌落性能', '垂直度']
        };
    },
    mounted() {
        this.getHeader();
    },
    methods: {
        getHeader() {
            this.$http(`${BOTTLE_API.BOTTLE_PRO_HEAD}`, 'POST', {
                orderId: this.orderId,
                type: 'quality'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.formHeader = data.headInfo;
                    this.getUsers();
                    this.getList();
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        getUsers() {
            this.$http(`${SYSTEMSETUP_API.USERLIST_API}`, 'POST', {
                deptId: this.formHeader.workShop,
                param: '',
                currPage: '1',
                pageSize: '1000'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.userlist = data.page.list;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        getList() {
            this.pages.orderId = this.orderId;
            this.$http(`${BOTTLE_API.BOTTLE_QUALITY_LIST}`, 'POST', this.pages).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.qualityInspectionList.list;
                    if (this.dataList.length !== 0) {
                        this.Textareas = this.dataList[0].abnormal;
                    }
                    this.pages.currPage = data.qualityInspectionList.currPage;
                    this.pages.pageSize = data.qualityInspectionList.pageSize;
                    this.pages.totalCount = data.qualityInspectionList.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        addRow() {
            const dataList = this.dataList.filter(item => {
                return item.delFlag === '0';
            });
            const dateNow = dateFormat(new Date(), 'yyyy-MM-dd hh:mm');
            if (dataList.length === 0) {
                this.paramList.map(item => {
                    let argument = '';
                    if (item === '外观' || item === '密封性能' || item === '跌落性能') {
                        argument = '合格';
                    }
                    this.dataList.push({
                        id: '',
                        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                        changer: '',
                        parameter: item,
                        date: dateNow,
                        oneWell: argument,
                        twoWell: argument,
                        threeWell: argument,
                        fourWell: argument,
                        fiveWell: argument,
                        sixWell: argument,
                        sevenWell: argument,
                        eightWell: argument,
                        nineWell: argument,
                        tenWell: argument,
                        elevenWell: argument,
                        twelveWell: argument,
                        delFlag: '0'
                    });
                });
            } else {
                const NewList = dataList.slice(0, 9);
                NewList.map((item, index) => {
                    if (index < 8) {
                        this.dataList.splice(index, 0, {
                            id: '',
                            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                            changer: item.changer,
                            parameter: item.parameter,
                            date: dateNow,
                            oneWell: item.oneWell,
                            twoWell: item.twoWell,
                            threeWell: item.threeWell,
                            fourWell: item.fourWell,
                            fiveWell: item.fiveWell,
                            sixWell: item.sixWell,
                            sevenWell: item.sevenWell,
                            eightWell: item.eightWell,
                            nineWell: item.nineWell,
                            tenWell: item.tenWell,
                            elevenWell: item.elevenWell,
                            twelveWell: item.twelveWell,
                            delFlag: '0'
                        });
                    }
                });
            }
            // this.loading = false
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.pages.currPage = val;
            this.getList();
        },
        // 校验
        dataRul() {
            let ty = true;
            if (this.crafData.hotMedium.length > 0) {
                this.crafData.hotMedium.forEach(item => {
                    if (item === '酱油') {
                        if (!this.crafData.sauceTemp) {
                            ty = false;
                            this.$warningToast('酱油温度必填');
                        }
                    } else if (item === '热水') {
                        if (!this.crafData.hotTemp) {
                            ty = false;
                            this.$warningToast('热水温度必填');
                        }
                    }
                });
            }
            this.crafData.result.forEach(item => {
                if (!item.temp) {
                    ty = false;
                    this.$warningToast('屏显温度必填');
                }
                if (!item.logTime) {
                    ty = false;
                    this.$warningToast('记录时间必填');
                }
            });
            return ty;
        },
        // 保存提交
        SubmitForm() {
            if (!this.dataRul()) {
                return;
            }
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.savedOrSubmitForm('submit');
                    }).catch(() => {
                        // this.$infoToast('已取消删除');
                    });
                }
            });
        },
        savedOrSubmitForm(str) {
            this.dataList.map(item => {
                item.status = str;
                item.orderId = this.orderId;
                item.abnormal = this.Textareas;
            });
            this.$http(`${BOTTLE_API.BOTTLE_QUALITY_SAVE}`, 'POST', this.dataList).then(({ data }) => {
                if (data.code === 0) {
                    this.$notify({
                        title: '成功',
                        message: '保存成功',
                        type: 'success'
                    });
                    this.pages.currPage = 1;
                    this.isRedact = false;
                    this.getHeader();
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        DelRow(row, index) {
            this.$confirm('正在执行删除操作, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let is = index;
                while (is < index + 8) {
                    this.dataList[is].delFlag = '1';
                    is++;
                }
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        rowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        }
    }
};
</script>

<style>
.bottom-line {
    width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-bottom: 1px solid #d8d8d8;
}
.bottom-line::before {
    opacity: 0;
    content: "*";
}
</style>
