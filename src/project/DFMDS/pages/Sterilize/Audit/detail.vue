<template>
    <div>
        <data-entry
            ref="dataEntry"
            type="audit"
            :header-base="headerBase"
            :form-header="formHeader"
            :order-status="formHeader.orderStatusName"
            :tabs="tabs"
            @tab-click="tabClick"
        >
            <template slot="1">
                <el-table ref="semiReceive" class="newTable" :data="semiReceiveList" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <table-tree-column label="发酵罐/池号" prop="fermentPotName" min-width="120" tree-key="id" show-overflow-tooltip />
                    <el-table-column label="生产锅号" prop="stePotName" min-width="85" />
                    <el-table-column label="锅序" prop="potOrder" min-width="65">
                        <template slot-scope="scope">
                            <em v-if="scope.row.potOrder">第{{ scope.row.potOrder }}锅</em>
                        </template>
                    </el-table-column>
                    <el-table-column label="领用物料" min-width="220">
                        <template slot-scope="scope">
                            {{ scope.row.materialName }} {{ scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用数量" prop="consumeAmount" min-width="90" />
                    <el-table-column label="单位" prop="consumeUnit" min-width="55" />
                    <el-table-column label="领用批次" prop="consumeBatch" min-width="110" show-overflow-tooltip />
                    <el-table-column label="操作人" prop="changer" min-width="140" />
                    <el-table-column label="操作时间" prop="changed" min-width="165" />
                    <el-table-column label="操作" prop="" min-width="55" fixed="right">
                        <template slot-scope="scope">
                            <el-button v-if="!scope.row.children" type="text" size="small" :disabled="scope.row.allowReturnFlag === false" @click="pass(scope.row)">
                                退回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="2">
                <el-table ref="acceAdd" class="newTable" :data="acceAddList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="领用物料" min-width="150" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.materialName }} {{ scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="前处理阶段" prop="preStage" min-width="90" />
                    <el-table-column label="需求用量" prop="needAmount" min-width="80" />
                    <table-tree-column label="生产锅号" prop="potName" min-width="110" tree-key="id" show-overflow-tooltip />
                    <el-table-column label="锅序" prop="potOrder" min-width="65">
                        <template slot-scope="scope">
                            <em v-if="scope.row.potOrder">第{{ scope.row.potOrder }}锅</em>
                        </template>
                    </el-table-column>
                    <el-table-column label="领用数量" prop="useAmount" min-width="90" />
                    <el-table-column label="单位" prop="unit" min-width="55" />
                    <el-table-column label="领用批次" prop="useBatch" min-width="110" show-overflow-tooltip />
                    <el-table-column label="添加时间" prop="addTime" min-width="160" />
                    <el-table-column label="操作" prop="" min-width="55" fixed="right">
                        <template slot-scope="scope">
                            <el-button v-if="!scope.row.children" type="text" size="small" :disabled="scope.row.allowReturnFlag === false" @click="pass(scope.row)">
                                退回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="3">
                <el-table ref="craft" class="newTable" :data="craftList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="生产锅号" prop="potNo" min-width="90" />
                    <el-table-column label="锅序" prop="potOrder" min-width="65">
                        <template slot-scope="scope">
                            <em v-if="scope.row.potOrder">第{{ scope.row.potOrder }}锅</em>
                        </template>
                    </el-table-column>
                    <el-table-column label="入料时间" prop="" min-width="200">
                        <template slot-scope="scope">
                            {{ scope.row.feedStartDate }} - {{ scope.row.feedEndDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="升温时间" prop="" min-width="220">
                        <template slot-scope="scope">
                            {{ scope.row.riseStartDate }} - {{ scope.row.riseEndDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="保温阶段-ZK" prop="keepZkFlag" min-width="90" />
                    <el-table-column label="降温阶段-ZK" prop="coolZkFlag" min-width="90" />
                    <el-table-column label="类型" prop="controlTypeName" min-width="90" />
                    <el-table-column label="阶段" prop="controlStageName" min-width="120" />
                    <el-table-column label="记录时间" prop="recordDate" min-width="165" />
                    <el-table-column label="温度" prop="temp" min-width="60" />
                </el-table>
            </template>
            <template slot="4">
                <el-row class="solerow">
                    <div>
                        订单产量：
                    </div>
                    <div class="input_bottom" style="height: 33px;">
                        {{ inStorage.planOutPut }}{{ inStorage.planOutPutUnit }}
                    </div>
                    <div>
                        实际产量：
                    </div>
                    <div class="input_bottom" style="height: 33px;">
                        {{ inStorage.realOutPut }}{{ inStorage.realOutPutUnit }}
                    </div>
                    <div>
                        生产锅数：
                    </div>
                    <div class="input_bottom" style="height: 33px;">
                        {{ inStorage.realPotCount }}
                    </div>
                </el-row>
                <el-table ref="inStorage" class="newTable" :data="inStorageList" header-row-class-name="tableHead" style="margin-top: 10px;" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="正常入库" prop="normalFlag" min-width="80" />
                    <el-table-column label="包装产线" prop="packageLine" min-width="180" show-overflow-tooltip />
                    <el-table-column label="包装订单" prop="packageOrderNo" min-width="120" />
                    <el-table-column label="入库物料" prop="" min-width="220" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.materialName }} {{ scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="入库数量" prop="inStorageAmount" min-width="90" />
                    <el-table-column label="单位" prop="materialUnit" min-width="65" />
                    <el-table-column label="入库批次" prop="inStorageBatch" min-width="110" />
                    <el-table-column label="备注" prop="remark" min-width="90" show-overflow-tooltip />
                    <el-table-column label="操作人" prop="changer" min-width="140" />
                    <el-table-column label="操作时间" prop="changed" min-width="165" />
                    <el-table-column label="操作" min-width="55" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="scope.row.allowReturnFlag === false" @click="pass(scope.row)">
                                退回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="5">
                <el-table ref="excRecord" class="newTable" :data="excRecordList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="生产锅号" prop="potNo" min-width="90" />
                    <el-table-column label="锅序" prop="potOrder" min-width="75">
                        <template slot-scope="scope">
                            <em v-if="scope.row.potOrder">第{{ scope.row.potOrder }}锅</em>
                        </template>
                    </el-table-column>
                    <el-table-column label="锅单号" prop="potOrderNo" min-width="180" />
                    <el-table-column label="班次" prop="className" min-width="70" />
                    <el-table-column label="异常情况" prop="exceptionSituationName" min-width="120" show-overflow-tooltip />
                    <el-table-column label="开始时间" prop="startDate" min-width="145" />
                    <el-table-column label="结束时间" prop="endDate" min-width="145" />
                    <el-table-column label="时长" prop="duration" min-width="80" />
                    <el-table-column label="单位" prop="durationUnit" min-width="65" />
                    <el-table-column label="异常原因" prop="exceptionReason" min-width="120" />
                    <el-table-column label="异常描述" prop="exceptionInfo" min-width="120" show-overflow-tooltip />
                    <el-table-column label="备注" prop="remark" min-width="90" show-overflow-tooltip />
                    <el-table-column label="操作人" prop="changer" min-width="140" />
                    <el-table-column label="操作时间" prop="changed" min-width="165" />
                </el-table>
            </template>
            <template slot="6">
                <el-table ref="working" class="newTable" :data="workingList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="准备工时" prop="readyTime" min-width="80" />
                    <el-table-column label="单位" prop="readyUnit" min-width="50" />
                    <el-table-column label="人员工时" prop="manTime" min-width="80" />
                    <el-table-column label="单位" prop="manUnit" min-width="50" />
                    <el-table-column label="机器工时" prop="machineTime" min-width="80" />
                    <el-table-column label="单位" prop="machineUnit" min-width="50" />
                    <table-tree-column label="生产锅号" prop="potName" min-width="120" tree-key="id" show-overflow-tooltip />
                    <el-table-column label="锅序" prop="potOrder" min-width="65" />
                    <el-table-column label="锅单号" prop="potOrderNo" min-width="180" show-overflow-tooltip />
                    <el-table-column label="备注" prop="remark" min-width="90" show-overflow-tooltip />
                    <el-table-column label="操作人" prop="changer" min-width="140" />
                    <el-table-column label="操作时间" prop="changed" min-width="165" />
                    <el-table-column label="操作" min-width="55" fixed="right">
                        <template v-if="scope.row._level !== 2" slot-scope="scope">
                            <el-button type="text" size="small" :disabled="scope.row.allowReturnFlag === false" @click="pass(scope.row)">
                                退回
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </data-entry>
        <el-dialog title="退回原因" :close-on-click-modal="false" :visible.sync="visibleRefuse">
            <el-input v-model="ReText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="visibleRefuse = false">
                    取消
                </el-button>
                <el-button type="primary" size="small" @click="refuse()">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, STE_API } from 'common/api/api';

    @Component({
        // components: {
        //     // AuditDetail,
        //     TableTreeColumn
        // }
    })
    export default class AuditDetail extends Vue {
        $refs: {
            readyTime: HTMLFormElement; // 1生产准备
            productPeople: HTMLFormElement; // 2生产人员
            equipment: HTMLFormElement; // 3设备运行
            productInStorage: HTMLFormElement; // 4生产入库
            material: HTMLFormElement; // 5物料领用
            pendingNum: HTMLFormElement; // 6待处理数量
            textRecord: HTMLFormElement; // 7文本记录
            dataEntry: HTMLFormElement;
        };

        headerBase = [
            {
                type: 'p',
                icon: 'factory-shengchanchejian',
                label: '生产车间',
                value: 'workShopName'
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '生产物料',
                value: ['materialName', 'materialCode']
            },
            {
                type: 'p',
                icon: 'factory-bianhao',
                label: '生产订单',
                value: 'orderNo'
            },
            {
                type: 'p',
                icon: 'factory--meirijihuachanliangpeizhi',
                label: '订单产量',
                value: ['planOutput', 'outputUnitName']
            },
            {
                type: 'p',
                icon: 'factory-riqi1',
                label: '订单日期',
                value: 'orderStartDate'
            },
            {
                type: 'p',
                icon: 'factory-bianhao',
                label: '生产锅数',
                value: 'realPotCount'
            },
            {
                type: 'p',
                icon: 'factory-xianchangrenyuan',
                label: '提交人员', // 操作人员
                value: 'changer'
            },
            {
                type: 'tooltip',
                icon: 'factory-riqi',
                label: '提交时间', // 操作时间
                value: 'changed'
            }
        ];

        // tabs data
        tabs = [
            {
                label: '半成品领用',
                status: '未录入',
                isRedact: false
            },
            {
                label: '辅料添加',
                status: '未录入',
                isRedact: false
            },
            {
                label: '工艺控制',
                isRedact: false
            },
            {
                label: '杀菌入库',
                status: '未录入',
                isRedact: false
            },
            {
                label: '异常记录',
                isRedact: false
            },
            {
                label: '杀菌工时',
                status: '未录入',
                isRedact: false
            }
        ];

        passBtn = '';
        auditDetail = {};
        formHeader: OrderData = {};
        inStorage: object = {};
        classesOptions: object[] = [];
        visibleRefuse = false;
        ReRow: object = {};
        ReText = '';

        semiReceiveList = [];
        acceAddList: CraftList[] = [];
        craftList = [];
        inStorageList = [];
        excRecordList = [];
        workingList: object[] = [];
        computedSoy = 0;
        abnormalList = [];
        excReasonTotal: ExcReasonTotal = {
            FAULTSHUTDOWN: [],
            POORPROCESSWAIT: [],
            ENERGY: []
        };

        controlTypeList: Reason[] = [];
        controlStageList: Reason[] = [];
        controlList: ControlList[]=[];


        async mounted() {
            this.auditDetail = this.$store.state.sterilize.auditDetailDetail;
            await this.getControlTypeList();
            await this.getHeaderInfo(this.auditDetail['orderNo']);

            const net1 = new Promise((resolve) => {
                this.getexcReasonTwo(resolve);
            });
            const net2 = new Promise((resolve) => {
                this.getexcReasonThree(resolve);
            });
            const net3 = new Promise((resolve) => {
                this.getClassesList(resolve);
            });
            const net4 = new Promise((resolve) => {
                this.getAbnormalList(resolve);
            });

            await Promise.all([net1, net2, net3, net4]).then(() => {
                this.getExceptionList(this.auditDetail['orderNo'], this.auditDetail['workShop']); // 异常
            })
            await this.getTimeList(this.auditDetail['orderNo']); // 杀菌工时
            await this.getSemiMaterial(this.auditDetail['orderNo']); // 半成品领用
            await this.getAccessList(this.auditDetail['orderNo']); // 辅料添加
            await this.getInstorageList(this.auditDetail['orderNo']); // 杀菌入库
            await this.getCraftList(this.auditDetail['orderNo']); // 工艺控制
            await this.initData(); // 页签状态
        }

        // 类型拉取
        getControlTypeList() {
            const tempList: string[] = [];
            return new Promise((resolve) => {
                COMMON_API.DICTQUERY_API({ dictType: 'CRAFT_PHASE' }).then(({ data }) => {
                    this.controlTypeList = data.data
                    data.data.forEach((item, index) => {
                        if (tempList.indexOf(item.dictCode) === -1) {
                            tempList.push(item.dictCode)
                            COMMON_API.DICTQUERY_API({ dictType: item.dictCode }).then(({ data: res }) => {
                                this.controlList[index] = { controlTypeList: item, controlStageList: res.data }
                            });
                        }
                        if (data.data.length - 1 === index) {
                            resolve(null)
                        }
                    })
                });
            })

        }

        // 页签状态
        initData() {
            STE_API.STE_INSTORAGE_QUERY_TABS_STATUS_API([this.auditDetail['orderNo']]).then(({ data }) => {
                if (data.data !== null) {
                    this.passBtn = data.data[0].readyTagStatus;
                    this.tabs[0].status = data.data[0].materialStatus;
                    this.tabs[1].status = data.data[0].accessoriesStatus;
                    this.tabs[2].status = data.data[0].controlStatus;
                    this.tabs[3].status = data.data[0].instorageStatus;
                    this.tabs[5].status = data.data[0].timesheetStatus;
                    this.$refs.dataEntry.updateTabs();
                }
            });
        }

        getHeaderInfo(orderNo) {
            return new Promise((resolve) => {
                COMMON_API.OREDER_QUERY_BY_NO_API({ orderNo: orderNo, workShopType: 'sterilize' }).then(({ data }) => {
                    this.formHeader = data.data;
                    resolve(null)
                })
            });
        }

        // 半成品领用
        getSemiMaterial(orderNo) {
            return new Promise((resolve) => {
                STE_API.STE_AUDIT_DETAIL_DETAUL_SEMI_API({ orderNo: orderNo }).then(({ data }) => {
                    this.semiReceiveList = this.RegroupData(data.data, 1, -1);
                    resolve(null)
                })
            });
        }

        // 辅料添加
        getAccessList(orderNo) {
            return new Promise((resolve) => {
                STE_API.STE_AUDIT_DETAIL_DETAUL_ACCESS_API({ orderNo: orderNo }).then(({ data }) => {
                    if (data.data !== null) {
                        this.acceAddList = this.RegroupData(data.data, 1, -1);
                    }
                    resolve(null)
                })
            });
        }

        // 杀菌入库
        getInstorageList(orderNo) {
            return new Promise((resolve) => {
                STE_API.STE_AUDIT_DETAIL_DETAUL_INSTORAGE_API({ orderNo: orderNo }).then(({ data }) => {
                    this.inStorage = data.data;
                    this.inStorageList = this.RegroupData(data.data.list, 1, -1);
                    resolve(null);
                })
            });
        }

        // 工艺
        getCraftList(orderNo) {
            STE_API.STE_AUDIT_DETAIL_DETAUL_CRAFT_API({ orderNo: orderNo }).then(({ data }) => {
                this.craftList = data.data;
                this.craftList.map((item: CraftList) => {
                    if (item.controlType !== '') {
                        item['controlTypeName'] = '';
                        item['controlStageName'] = '';
                        const controlTypeItem = this.controlList.find((it: ControlList) => item.controlType === it.controlTypeList.dictCode)
                        if (controlTypeItem) {
                            item['controlTypeName'] = controlTypeItem.controlTypeList['dictValue']
                            const controlStageItem = controlTypeItem.controlStageList.find((it: Reason) => item.controlStage === it.dictCode)
                            if (controlStageItem) {
                                item['controlStageName'] = controlStageItem['dictValue']
                            }
                        }
                    }
                })
            })
        }

        // 班次
        getClassesList(resolve) {
            COMMON_API.DICTQUERY_CLASSLIST_API({}).then(({ data }) => {
                this.classesOptions = data.data;
                if (resolve) {
                    resolve('resolve');
                }
            });
        }

        // 异常
        getAbnormalList(resolve) {
            COMMON_API.DICTQUERY_API({ dictType: 'ABNORMAL_HALT' }).then(({ data }) => {
                this.abnormalList = data.data
                if (resolve) {
                    resolve('resolve');
                }
            });
        }

        // 异常原因
        getexcReasonTwo(resolve) {
            COMMON_API.DICTQUERY_API({ dictType: 'WAIT' }).then(({ data }) => {
                this.excReasonTotal.POORPROCESSWAIT = data.data
                if (resolve) {
                    resolve('resolve');
                }
            });
        }

        // 异常原因
        getexcReasonThree(resolve) {
            COMMON_API.DICTQUERY_API({ dictType: 'ENERGY' }).then(({ data }) => {
                this.excReasonTotal.ENERGY = data.data
            });
            if (resolve) {
                resolve('resolve');
            }
        }

        // 异常
        getExceptionList(orderNo, workShop) {
            STE_API.STE_AUDIT_DETAIL_DETAUL_EXCEPTION_API({ orderNo: orderNo, workShop: workShop }).then(({ data }) => {
                this.excRecordList = data.data;
                data.data.map(item => {
                    const classesSole = this.classesOptions.find(it => it['dictCode'] === item.classes);
                    if (classesSole) {
                        item['className'] = classesSole['dictValue'];
                    }
                    const abnormalSole = this.abnormalList.find(it => it['dictCode'] === item.exceptionSituation);
                    if (abnormalSole) {
                        item['exceptionSituationName'] = abnormalSole['dictValue'];
                    }
                })
            })
        }

        // 工时
        getTimeList(orderNo) {
            STE_API.STE_AUDIT_DETAIL_DETAUL_TIME_API({ orderNo: orderNo }).then(({ data }) => {
                this.workingList = this.RegroupData([data.data], 1, -1);
            })
        }

        // 数据重组
        RegroupData(dataList, level, parentId) {
            for (let i = 0; i < dataList.length; i++) {
                dataList[i]['_level'] = level
                dataList[i]['parentId'] = parentId
                if (dataList[i]['materialCode']) {
                    dataList[i]['material'] = dataList[i]['materialName'] + ' ' + dataList[i]['materialCode'];
                }
                dataList[i]['children'] = dataList[i]['list']
                if (dataList[i]['list']) {
                    this.RegroupData(dataList[i]['list'], level + 1, dataList[i]['id'])
                }
            }
            return dataList;
        }

        tabClick(val) {
            const num = Number(val.name) - 1;
            const status: (any) =  this.tabs[num].status;// eslint-disable-line
            status ? this.passBtn = status : this.passBtn = ''
        }

        refuse() {
            if (!this.ReText) {
                this.$warningToast('请填写原因');
                return false
            }
            this.ReRow['orderNo'] = this.auditDetail['orderNo'];
            this.ReRow['memo'] = this.ReText;
            switch (this.$refs.dataEntry.activeName) {
                case '1':
                    STE_API.STE_AUDIT_DETAIL_DETAUL_REFISE_SEMI_API(this.ReRow).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData()
                    })
                    break;
                case '2':
                    this.ReRow['consumeBatch'] = this.ReRow['useBatch'];
                    this.ReRow['materialCode'] = this.ReRow['useMaterialCode'];
                    STE_API.STE_AUDIT_DETAIL_DETAUL_REFISE_ACCESS_API(this.ReRow).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData()
                    })
                    break;
                case '3':
                    STE_API.STE_AUDIT_DETAIL_DETAUL_REFISE_TIMESHEET_API(this.ReRow).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData()
                    })
                    break;
                case '4':
                    STE_API.STE_AUDIT_DETAIL_DETAUL_REFISE_INSTORAGE_API(this.ReRow).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData()
                    })
                    break;
                case '6':
                    // eslint-disable-next-line
                    let Re: object = {};
                    Re = {
                        'orderNo': this.auditDetail['orderNo'],
                        'potOrderNo': this.ReRow['potOrderNo'],
                        'memo': this.ReText
                    };
                    STE_API.STE_AUDIT_DETAIL_DETAUL_REFISE_TIMESHEET_API(Re).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData()
                    })
                    break;
                default: console.log('123')
            }
        }

        pass(row) {
            if (this.$refs.dataEntry.activeName === '5') {
                return false
            }
            // if (this.tabs[Number(this.$refs.dataEntry.activeName) - 1].status !== 'D') {
            //     return false
            // }
            this.ReText = '';
            this.ReRow = row;
            this.visibleRefuse = true;
        }
    }

    interface OrderData{
        factoryName?: string;
        changed?: string;
        countMan?: number;
        countOutput?: number;
        countOutputUnit?: string;
        dispatchMan?: string;
        exceptionDateCount?: number;
        factory?: string;
        factoryCode?: string;
        germs?: number;
        id?: string;
        materialCode?: string;
        materialName?: string;
        operator?: string;
        operatorDate?: string;
        orderEndDate?: string;
        orderId?: string;
        orderNo?: string;
        orderStartDate?: string;
        orderStatus?: string;
        orderType?: string;
        outputUnit?: string;
        planOutput?: number;
        productDate?: string;
        productLine?: string;
        productLineName?: string;
        realInAmount?: number;
        realOutput?: number;
        version?: number;
        workShop?: string;
        workShopName?: string;
    }
    interface ExcReasonTotal {
        FAULTSHUTDOWN: object[];
        POORPROCESSWAIT: object[];
        ENERGY: object[];
    }
    interface Reason {
        dictCode?: string;
        dictId?: string;
        dictValue?: string;
        factoryName?: string;
        id?: string;
    }
    interface CraftList {
        controlStage?: string;
        controlType?: string;
        controlStageName?: string;
        controlTypeName?: string;
        coolZkFlag?: string;
        feedEndDate?: string;
        feedStartDate?: string;
        keepZkFlag?: string;
        potNo?: string;
        potOrder?: string;
        potOrderNo?: string;
        recordDate?: string;
        remark?: string;
        riseEndDate?: string;
        riseStartDate?: string;
        temp?: number;
    }

    interface ControlList {
        controlTypeList: Reason;
        controlStageList: Reason[];
    }
</script>

<style scoped>

</style>
