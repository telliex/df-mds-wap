<template>
    <div class="koji-process-control">
        <mds-card title="蒸面记录" name="table1" icon-bg="#487BFF">
            <div>
                <el-form :inline="true" :model="craftSteamFlourInfo" label-width="115px">
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>汽包压力：
                        </template>
                        <el-input v-model="craftSteamFlourInfo.steamPacketPressure" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' &&craftSteamFlourInfo.status !== 'C' && craftSteamFlourInfo.status !== 'D' && craftSteamFlourInfo.status !== 'P')" size="small" style="width: 180px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">Mpa</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>蒸面加水流速：
                        </template>
                        <el-input v-model="craftSteamFlourInfo.steamFlourSpeed" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' &&craftSteamFlourInfo.status !== 'C' && craftSteamFlourInfo.status !== 'D' && craftSteamFlourInfo.status !== 'P')" size="small" style="width: 180px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">L/H</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom" label="蒸汽流量：">
                        <el-input v-model="craftSteamFlourInfo.steamFlow" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' &&craftSteamFlourInfo.status !== 'C' && craftSteamFlourInfo.status !== 'D' && craftSteamFlourInfo.status !== 'P')" size="small" style="width: 180px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">KG/H</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>蒸面操作人：
                        </template>
                        <!--
                        <el-tooltip class="item" effect="dark" :content="craftSteamFlourInfo.steamFlourMans + '点击选择人员'" placement="top">
                            <div class="koji-control-form_select" :style="{cursor: isRedact?'pointer':'default'}" @click="selectUser(craftSteamFlourInfo, '蒸面操作人', 'steamFlourMans')">
                                {{ craftSteamFlourInfo.steamFlourMans }} 点击选择人员
                            </div>
                        </el-tooltip>
                        -->

                        <div style="width: 180px;">
                            <span :style="{cursor:isRedact? 'pointer':'default',color:isRedact? '#333':'#aaa'}" @click="selectUser(craftSteamFlourInfo, '蒸面操作人', 'steamFlourMans')">
                                <el-tooltip v-if="craftSteamFlourInfo.steamFlourMans&&craftSteamFlourInfo.steamFlourMans!==''" class="item" effect="dark" :content="craftSteamFlourInfo.steamFlourMans" placement="top">
                                    <el-input
                                        v-if="craftSteamFlourInfo.steamFlourMans&&craftSteamFlourInfo.steamFlourMans!==''"
                                        v-model="craftSteamFlourInfo.steamFlourMans"
                                        placeholder="请输入蒸面操作人"
                                        size="small"
                                        :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' &&craftSteamFlourInfo.status !== 'C' && craftSteamFlourInfo.status !== 'D' && craftSteamFlourInfo.status !== 'P')"
                                    />
                                </el-tooltip>
                                <em v-if="!craftSteamFlourInfo.steamFlourMans" :class="{'like-el-input__inner':isRedact,'input-in-form-disabled':!isRedact}">点击选择人员</em>
                            </span>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </mds-card>
        <mds-card title="蒸豆记录" name="table2" icon-bg="#487BFF">
            <template slot="titleBtn">
                <el-form :inline="true" label-width="115px">
                    <el-form-item class="cleanMarginBottom floatr">
                        <el-button v-if="isAuth('kjSFControlAdd')" type="primary" size="small" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P')" @click="addDataRow()">
                            新增
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="craftSteamBeanTable" :row-class-name="RowDelFlag" border tooltip-effect="dark" size="mini" style="min-height: 90px;">
                <el-table-column type="index" :index="index => getIndexMethod(index, craftSteamBeanTable)" label="序号" width="50px" fixed />
                <el-table-column width="140" show-overflow-tooltip>
                    <template slot="header">
                        <span class="notNull">* </span>蒸球号
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.steamBallNo" placeholder="请选择" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 100%;" @change="val=>modifySteamBall(val,scope.row)">
                            <el-option v-for="(subItem, index) in steamBallList" :key="index" :label="subItem.holderName" :value="subItem.holderNo" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="210">
                    <template slot="header">
                        <span class="notNull">* </span>加汽开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.addSteamStart" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" style="width: 186px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column min-width="210">
                    <template slot="header">
                        <span class="notNull">* </span>加汽结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.addSteamEnd" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" style="width: 186px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="汽包压力" width="144">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.steamPocketPressure" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">Mpa</span>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="转动圈数" width="144">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.turnCount" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;">
                            <!-- <span slot="suffix" class="stock-form_item_input_suffix">Mpa</span> -->
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="蒸煮时间" width="80">
                    <template slot-scope="scope">
                        <p>{{ (scope.row.cookingDuration = Number(workTime(scope.row.addSteamEnd, scope.row.addSteamStart, scope.row))) }}min</p>
                    </template>
                </el-table-column>
                <el-table-column label="保压时间" width="144">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.pressureDuration" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">min</span>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column min-width="210">
                    <template slot="header">
                        熟豆放豆时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.addBeanDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" style="width: 186px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" width="170">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="!scope.row.remark" effect="dark" :content="scope.row.remark" placement="top">
                            <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="操作人" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" width="160">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" @click="removeRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card title="混合控制" name="table3" icon-bg="#487BFF">
            <div>
                <el-form :inline="true" :model="craftControlInfo" label-width="120px">
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>蒸面风冷温度：
                        </template>
                        <el-input v-model="craftControlInfo.flourWindTemp" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && craftControlInfo.status !== 'C' && craftControlInfo.status !== 'D' && craftControlInfo.status !== 'P')" size="small" style="width: 180px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">°C</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>大豆风冷温度1：
                        </template>
                        <el-input v-model="craftControlInfo.beanWindTempOne" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && craftControlInfo.status !== 'C' && craftControlInfo.status !== 'D' && craftControlInfo.status !== 'P')" size="small" style="width: 180px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">°C</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            大豆风冷温度2：
                        </template>
                        <el-input v-model="craftControlInfo.beanWindTempTwo" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && craftControlInfo.status !== 'C' && craftControlInfo.status !== 'D' && craftControlInfo.status !== 'P')" size="small" style="width: 180px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">°C</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>混合料温度1：
                        </template>
                        <el-input v-model="craftControlInfo.mixtureTempOne" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && craftControlInfo.status !== 'C' && craftControlInfo.status !== 'D' && craftControlInfo.status !== 'P')" size="small" style="width: 180px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">°C</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            混合料温度2：
                        </template>
                        <el-input v-model="craftControlInfo.mixtureTempTwo" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && craftControlInfo.status !== 'C' && craftControlInfo.status !== 'D' && craftControlInfo.status !== 'P')" size="small" style="width: 180px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">°C</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>大豆风冷变频：
                        </template>
                        <el-input v-model="craftControlInfo.beanWindFrequency" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && craftControlInfo.status !== 'C' && craftControlInfo.status !== 'D' && craftControlInfo.status !== 'P')" size="small" style="width: 180px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">Hz</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>混合开始时间：
                        </template>
                        <el-date-picker v-model="craftControlInfo.mixtureStart" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && craftControlInfo.status !== 'C' && craftControlInfo.status !== 'D' && craftControlInfo.status !== 'P')" size="small" style="width: 180px;" />
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>混合结束时间：
                        </template>
                        <el-date-picker v-model="craftControlInfo.mixtrueEnd" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && craftControlInfo.status !== 'C' && craftControlInfo.status !== 'D' && craftControlInfo.status !== 'P')" size="small" style="width: 180px;" />
                    </el-form-item>
                </el-form>
            </div>
        </mds-card>
        <audit-log :table-data="craftAuditList" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
        <loaned-personnel v-if="loanedPersonnelStatus" ref="loanedPersonnel" @changeUser="changeUser" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { COMMON_API, KOJI_API, AUDIT_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber, getDateDiff } from 'utils/utils';

    import LoanedPersonnel from 'components/LoanedPersonnel.vue';
    import _ from 'lodash';

    @Component({
        name: 'WashBeanMaterialCraft',
        components: {
            LoanedPersonnel
        }
    })
    export default class WashBeanMaterialCraft extends Vue {
        @Prop({ default: false }) isRedact: boolean;
        @Prop({ default: 'N' }) isStatus: string;
        @Prop({ default: [] }) setMaterialTableData: CraftList[];

        $refs: {
            loanedPersonnel: HTMLFormElement;
            scanSelectDialog: HTMLFormElement;
        };

        // 订单信息
        formHeader: Craft = {};

        // 蒸面记录表单数据
        craftSteamFlourInfo: Craft = {
            steamPacketPressure: '',
            steamFlourSpeed: '',
            steamFlourMans: '',
            steamFlow: ''
        };

        temCraftSteamFlourInfo: Craft ={
            steamPacketPressure: '',
            steamFlourSpeed: '',
            steamFlourMans: '',
            steamFlow: ''
        };

        // 蒸豆记录表格数据
        craftSteamBeanTable: CraftList[] = [];

        // 混合控制表单数据
        craftControlInfo: CraftList = {
            flourWindTemp: '',
            beanWindTempOne: '',
            beanWindTempTwo: '',
            mixtureTempOne: '',
            mixtureTempTwo: '',
            beanWindFrequency: '',
            mixtureStart: '',
            mixtrueEnd: ''
        };

        temCraftControlInfo: CraftList ={
            flourWindTemp: '',
            beanWindTempOne: '',
            beanWindTempTwo: '',
            mixtureTempOne: '',
            mixtureTempTwo: '',
            beanWindFrequency: '',
            mixtureStart: '',
            mixtrueEnd: ''
        };

        // 存储历史数据
        temCraftSteamBeanTable = [];

        // 蒸球list
        steamBallList: SteamBallListOption[] = [];

        // 审核记录
        craftAuditList = [];

        // 人员组织选择
        loanedPersonnelStatus = false;

        // 人员操作对象
        row: Craft = {};
        rowField = ''

        // 提交保存时获取处理数据
        getSavedOrSubmitData(formHeader) {
            const tempSteamBean: SendDataForm = {
                deleteDto: [],
                insertDto: [],
                updateDto: []
            };


            this.craftSteamBeanTable.forEach((item: CraftList, index) => {
                if (item.delFlag === 1) {
                    if (item.id) {
                        tempSteamBean.deleteDto.push(item.id)
                    }
                } else if (item.id) {
                    if (!_.isEqual(this.temCraftSteamBeanTable[index], item)) {
                        item.kojiOrderNo = formHeader.kojiOrderNo
                        item.orderNo = formHeader.orderNo
                        tempSteamBean.updateDto.push(item)
                    }
                } else {
                    item.kojiOrderNo = formHeader.kojiOrderNo
                    item.orderNo = formHeader.orderNo
                    tempSteamBean.insertDto.push(item)
                }
            })

            let newCraftSteamFlourInfo = true
            if (this.craftSteamFlourInfo.id) {
                newCraftSteamFlourInfo = false
            }

            this.craftSteamFlourInfo.kojiOrderNo = formHeader.kojiOrderNo
            this.craftSteamFlourInfo.orderNo = formHeader.orderNo
            this.temCraftSteamFlourInfo.kojiOrderNo = formHeader.kojiOrderNo
            this.temCraftSteamFlourInfo.orderNo = formHeader.orderNo

            let newCraftControlInfo = true
            if (this.craftControlInfo.id) {
                newCraftControlInfo = false
            }
            this.craftControlInfo.kojiOrderNo = formHeader.kojiOrderNo
            this.craftControlInfo.orderNo = formHeader.orderNo
            this.temCraftControlInfo.kojiOrderNo = formHeader.kojiOrderNo
            this.temCraftControlInfo.orderNo = formHeader.orderNo

            return {
                steamBean: tempSteamBean.insertDto.length === 0 && tempSteamBean.updateDto.length === 0 && tempSteamBean.deleteDto.length === 0 ? null : {
                    insertDto: tempSteamBean.insertDto,
                    updateDto: tempSteamBean.updateDto,
                    deleteDto: tempSteamBean.deleteDto,
                    kojiOrderNo: formHeader.kojiOrderNo,
                    orderNo: formHeader.orderNo
                },
                steamFlour: {
                    insertDto: newCraftSteamFlourInfo === true && !_.isEqual(this.craftSteamFlourInfo, this.temCraftSteamFlourInfo) ? [this.craftSteamFlourInfo] : [],
                    updateDto: newCraftSteamFlourInfo === false && !_.isEqual(this.craftSteamFlourInfo, this.temCraftSteamFlourInfo) ? [this.craftSteamFlourInfo] : [],
                    deleteDto: [],
                    kojiOrderNo: formHeader.kojiOrderNo,
                    orderNo: formHeader.orderNo
                },
                steamControl: {
                    insertDto: newCraftControlInfo === true && !_.isEqual(this.craftControlInfo, this.temCraftControlInfo) ? [this.craftControlInfo] : [],
                    updateDto: newCraftControlInfo === false && !_.isEqual(this.craftControlInfo, this.temCraftControlInfo) ? [this.craftControlInfo] : [],
                    deleteDto: [],
                    kojiOrderNo: formHeader.kojiOrderNo,
                    orderNo: formHeader.orderNo
                }
            };
        }


        // 初始化数据
        init(formHeader) {
            this.formHeader = formHeader;
            const { kojiOrderNo, orderNo } = formHeader;
            // 查询蒸面记录
            this.getSteamFlourLogList(kojiOrderNo, orderNo);
            // 查询蒸豆记录
            this.getSteamBeanLogList(kojiOrderNo, orderNo);
            // 查询混合控制记录
            this.getControlLoglist(kojiOrderNo, orderNo);
            // 查询审核记录
            this.getAuditList(orderNo);
            this.getSteamBallList();
        }

        modifySteamBall(val, row) {
            row.steamBallName = this.steamBallList.filter(item => item.holderNo === val)[0].holderName
            row.steamBallId = this.steamBallList.filter(item => item.holderNo === val)[0].id
        }

        // === 数据处理 === //
        // 新增蒸豆记录
        addDataRow() {
            this.craftSteamBeanTable.push({
                steamBallNo: '',
                kojiOrderNo: this.formHeader.kojiOrderNo,
                orderNo: this.formHeader.orderNo,
                addSteamStart: dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
                addSteamEnd: '',
                steamPocketPressure: '',
                turnCount: '',
                pressureDuration: '',
                addBeanDate: '',
                remark: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber(),
                delFlag: 0
            });
        }

        // 删除记录
        // delFlag 0未删除  1已删除
        removeRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$set(row, 'delFlag', 1)
                this.$successToast('删除成功');
            });
        }

        // 处理行显示class
        RowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }


        // 计算时间差
        workTime(end, start, row) {
            let diff = '0';
            if (end && start && row.delFlag !== 1) {
                diff = getDateDiff(start, end, 'minute');
            }
            return diff;
        }


        // 内部借调弹窗选择
        selectUser(row, typeName, field) {

            if (!(this.isRedact && this.isStatus !== 'C' && this.isStatus !== 'D' && this.isStatus !== 'P' && this.craftSteamFlourInfo.status !== 'C' && this.craftSteamFlourInfo.status !== 'D' && this.craftSteamFlourInfo.status !== 'P')) return;
            this.row = row;
            this.rowField = field
            this.loanedPersonnelStatus = true;
            this.$nextTick(() => {
                let selArr = [];
                if (row[field]) {
                    selArr = row[field].split(',');
                }
                this.$refs.loanedPersonnel.init(selArr, typeName);
            });
        }

        // 操作人数据回显处理
        changeUser(userIds) {
            this.loanedPersonnelStatus = false;
            const arr = [...userIds];
            let relStr = '';
            arr.map((item, index) => {
                if (item) {
                    relStr += `${index > 0 ? ',' : ''}${item}`;
                }
            });
            this.row[this.rowField] = relStr;
        }

        // ==== 提交处理汇总 ====== //
        // 提交时字段校验
        ruleSubmit() {
            // /(?:^[1-9]([0-9])?(?:\.[0-9]{1})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9]$)/
            if (!this.craftSteamFlourInfo.steamPacketPressure || !this.craftSteamFlourInfo.steamFlourSpeed || !this.craftSteamFlourInfo.steamFlourMans) {
                this.$warningToast('请填写工艺控制页签"蒸面记录"必填项');
                return false;
            }

            if (this.craftSteamBeanTable.filter(it => it.delFlag !== 1).length === 0) {
                this.$warningToast('请填写工艺控制页签"蒸豆记录"');
                return false;
            }

            for (const item of this.craftSteamBeanTable.filter(it => it.delFlag !== 1)) {
                if (
                    !item.steamBallNo ||
                    !item.addSteamStart ||
                    !item.addSteamEnd
                ) {
                    this.$warningToast('请填写工艺控制页签"蒸豆记录"必填项');
                    return false;
                }
            }

            if (
                !this.craftControlInfo.flourWindTemp ||
                !this.craftControlInfo.beanWindTempOne ||
                !this.craftControlInfo.mixtureTempOne ||
                !this.craftControlInfo.beanWindFrequency ||
                !this.craftControlInfo.mixtureStart ||
                !this.craftControlInfo.mixtrueEnd
            ) {
                this.$warningToast('请填写工艺控制页签"混合控制"必填项');
                return false;
            }

            return true;
        }

        // === 查询 汇总 ==== //

        // 查询最新蒸面记录
        getSteamFlourLogList(kojiOrderNo, orderNo) {
            KOJI_API.KOJI_CRAFT_STEAM_FLOUR_LOG_API({
                kojiOrderNo,
                orderNo
            }).then(({ data }) => {
                if (data.data && data.data.length > 0) {
                    console.log('蒸面记录')
                    console.log(data)
                    this.craftSteamFlourInfo = data.data[0];
                    this.craftSteamFlourInfo.kojiOrderNo = this.formHeader.kojiOrderNo
                    this.craftSteamFlourInfo.orderNo = this.formHeader.orderNo
                    this.temCraftSteamFlourInfo = JSON.parse(JSON.stringify(this.craftSteamFlourInfo));
                }
            });
        }

        // 查询最新蒸豆记录
        getSteamBeanLogList(kojiOrderNo, orderNo) {
            KOJI_API.KOJI_CRAFT_STEAM_BEAN_LOG_API({
                kojiOrderNo,
                orderNo
            }).then(({ data }) => {
                console.log('蒸豆记录')
                console.log(data)
                this.craftSteamBeanTable = data.data || [];
                this.temCraftSteamBeanTable = JSON.parse(JSON.stringify(data.data || []));
            });
        }

        // 查询混合控制记录
        getControlLoglist(kojiOrderNo, orderNo) {
            KOJI_API.KOJI_CRAFT_STEAM_CONTROL_LOG_API({
                kojiOrderNo,
                orderNo
            }).then(({ data }) => {
                if (data.data && data.data.length > 0) {
                    console.log('混合控制')
                    console.log(data)
                    this.craftControlInfo = data.data[0];
                    this.craftControlInfo.kojiOrderNo = this.formHeader.kojiOrderNo
                    this.craftControlInfo.orderNo = this.formHeader.orderNo
                    this.temCraftControlInfo = JSON.parse(JSON.stringify(this.craftControlInfo));
                }
            });
        }

        // 查询最新审核记录
        getAuditList(orderNo) {
            AUDIT_API.STE_AUDIT_LOG_API({ orderNo, splitOrderNo: this.formHeader.kojiOrderNo, verifyType: ['SF_CONTROL', 'TIMESHEET'] }).then(({ data }) => {
                this.craftAuditList = data.data;
            });
        }

        // 查询蒸球list
        getSteamBallList() {
            COMMON_API.HOLDER_QUERY_BY_NOPAGE_API({
                deptId: this.formHeader.workShop,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: '026'
            }).then(({ data }) => {
                console.log('查询蒸球list')
                console.log(data.data)
                this.steamBallList = data.data
            })
        }
    }

    interface Craft {
        id?: string;
        items?: CraftList[];
        kojiOrderNo?: string;
        status?: string;
        orderNo?: string;
        workShop?: string;
        potSaveDto?: object[];
        relStr?: string;
        sieveStartDate?: string;
        sieveEndDate?: string;
        cleanliness?: string;
        steamFlourMans?: string;
        washStartDate?: string;
        washEndDate?: string;
        steamPacketPressure?: string;
        steamFlourSpeed?: string;
        steamBallNo?: string;
        delFlag?: number;
        orderId?: string;
        factory?: string;
        steamFlow?: string;
    }
    interface CraftList {
        id?: string;
        kojiOrderNo?: string;
        orderNo?: string;
        sieveBeanBatch?: string;
        sieveBeanSupplier?: string;
        sieveDeviceId?: string;
        sieveDeviceName?: string;
        sieveImpurityAmount?: number | string;
        sieveImpurityType?: string;
        sieveMans?: string;
        unit?: string;
        remark?: string;
        changer?: string;
        changed?: string;
        delFlag?: number;
        drainEndDate?: string;
        drainMans?: string;
        drainStartDate?: string;
        steepDuration?: string;
        washBeanId?: string;
        waterEndDate?: string;
        waterMans?: string;
        waterStartDate?: string;
        batch?: string;
        supplier?: string;
        relStr?: string;
        flourWindTemp?: string;
        beanWindTempOne?: string;
        beanWindTempTwo?: string;
        mixtureTempOne?: string;
        mixtureTempTwo?: string;
        beanWindFrequency?: string;
        mixtureStart?: string;
        mixtrueEnd?: string;
        addSteamStart?: string;
        addSteamEnd?: string;
        steamPocketPressure?: string;
        turnCount?: string;
        pressureDuration?: string;
        addBeanDate?: string;
        steamBallNo?: string;
    }

    interface SieveDeviceList {
        sieveDeviceId?: string;
        sieveDeviceName?: string;
        deviceNo?: string;
        deviceName?: string;
    }

    interface SendDataForm{
        deleteDto: string[];
        insertDto: CraftList[];
        updateDto: CraftList[];
    }

    interface SteamBallListOption{
        deptId?: string;
        holderArea?: string;
        holderBatch?: string;
        holderName?: string;
        holderNo?: string;
        holderStatus?: string;
        holderType?: string;
        id?: string;
    }


</script>

<style lang="scss" scoped>
    .koji-process-control {
        .stock-form_item_input_suffix {
            margin-right: 6px;
        }
        .cleanMarginBottom {
            margin-bottom: 10px;
        }
        .koji-control-form_select {
            min-width: 200px;
            max-width: 300px;
            padding-left: 8px;
            overflow: hidden;
            color: #333;
            white-space: nowrap;
            text-overflow: ellipsis;
            background: #f5f5f5;
            border-radius: 4px;
            cursor: pointer;
        }
    }
</style>
