<template>
    <div>
        <data-entry
            ref="dataEntry"
            type="audit"
            :header-base="headerBase"
            :form-header="formHeader"
            :order-status="formHeader.orderStatusName"
            :tabs="tabs"
            :redact-box-show="false"
            @tab-click="tabClick"
        >
            <template slot="1">
                <el-table ref="manHourList" class="newTable" :data="manHourList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="工序" prop="process" min-width="120" />
                    <el-table-column v-if="isNormalPage" label="曲房" prop="kojiHouseName" min-width="120" />
                    <el-table-column v-if="isNormalPage" label="入曲日期" prop="addKojiDate" width="180" />
                    <el-table-column v-if="isSCPage" label="生产时间" prop="addKojiDate" width="180" />
                    <el-table-column label="准备工时" prop="prepairedHour" width="180" />
                    <el-table-column label="单位" prop="" width="120">
                        <template>
                            {{ '小时' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="人工工时" prop="manHour" width="120" />
                    <el-table-column label="单位" prop="" width="120">
                        <template>
                            {{ '小时' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="scope.row.enableBack!==1" @click="reject('1',scope.row)">
                                退回
                            </el-button>
                            <el-button type="text" size="small" @click="auditLog(scope.row,tabs[0].label)">
                                审核日志
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="2">
                <el-table ref="machineHourList" class="newTable" :data="machineHourList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column label="工序" prop="process" min-width="120" />
                    <el-table-column v-if="isNormalPage" label="曲房" prop="kojiHouseName" min-width="120" />
                    <el-table-column v-if="isNormalPage" label="入曲日期" prop="addKojiDate" width="180" />
                    <el-table-column v-if="isSCPage" label="生产日期" prop="addKojiDate" width="180" />
                    <el-table-column label="机器工时" prop="machineHour" width="120" />
                    <el-table-column label="单位" prop="" width="120">
                        <template>
                            {{ '小时' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="scope.row.enableBack!==1" @click="reject('2',scope.row)">
                                退回
                            </el-button>
                            <el-button type="text" size="small" @click="auditLog(scope.row,tabs[1].label)">
                                审核日志
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="3">
                <el-table ref="inStorageList" class="newTable" :data="inStorageList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column v-if="isNormalPage" label="曲房号" prop="kojiHouseName" min-width="120" />
                    <el-table-column v-if="isNormalPage" label="入曲日期" prop="addKojiDate" width="180" />
                    <el-table-column label="大豆量(千克)" prop="beanAmount" width="120" />
                    <el-table-column v-if="isNormalPage" label="麦粉量(千克)" prop="wheatAmount" width="120" />
                    <el-table-column v-if="isNormalPage" label="菌种量" prop="strainAmount" width="120" />
                    <el-table-column label="入库量" prop="inStorageAmount" width="120" />
                    <el-table-column label="入库批次" prop="inStorageBatch" min-width="120" />
                    <el-table-column label="单位" prop="unitName" width="120" />
                    <el-table-column label="操作人" prop="changer" width="180" />
                    <el-table-column label="操作时间" prop="changed" width="180" />
                    <el-table-column label="操作" prop="" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="scope.row.enableBack!==1" @click="reject('3',scope.row)">
                                退回
                            </el-button>
                            <el-button type="text" size="small" @click="auditLog(scope.row,tabs[2].label)">
                                审核日志
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row class="solerow">
                    <div>
                        入库量：
                    </div>
                    <div class="input_bottom">
                        {{ inStorageComputed }} 千克
                    </div>
                </el-row>
            </template>
            <template slot="4">
                <el-table ref="meterialList" class="newTable" :data="meterialList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column v-if="isNormalPage" label="曲房" prop="kojiHouseName" width="120" />
                    <el-table-column v-if="isNormalPage" label="入曲日期" prop="addKojiDate" width="180" />
                    <!-- <el-table-column label="物料" prop="storageTypeName" min-width="120" /> -->
                    <el-table-column label="物料" prop="storageTypeName" min-width="160">
                        <template slot-scope="scope">
                            {{ `${scope.row.materialName} ${scope.row.materialCode}` }}
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" prop="batch" min-width="120" />
                    <el-table-column label="数量" prop="amount" width="120" />
                    <el-table-column label="单位" prop="unitName" width="120" />
                    <el-table-column label="操作人员" prop="changer" width="180" />
                    <el-table-column label="操作时间" prop="changed" width="180" />
                    <el-table-column label="操作" prop="" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="scope.row.enableBack!==1" @click="reject('4',scope.row)">
                                退回
                            </el-button>
                            <el-button type="text" size="small" @click="auditLog(scope.row,tabs[3].label)">
                                审核日志
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="5">
                <el-table ref="craftList" class="newTable" :data="craftList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed />
                    <el-table-column v-if="isNormalPage" label="曲房" prop="kojiHouseName" min-width="120" />
                    <el-table-column v-if="isNormalPage" label="入曲日期" prop="addKojiDate" min-width="120" />
                    <el-table-column label="工序" prop="process" min-width="120" />
                    <el-table-column label="详情" prop="arg" min-width="120">
                        <template slot-scope="scope">
                            <span style="color: #409eff; cursor: pointer;" @click="goProcessDetail(scope.row)">{{ `${scope.row.process}详情` }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="提交人" prop="changer" min-width="120" />
                    <el-table-column label="提交时间" prop="changed" min-width="120" />
                </el-table>
            </template>
            <template slot="custom_btn">
                <el-button v-if="rejectBtn === 'D' && isAuth('pkgCkRefuse')" type="primary" size="small" class="sub-red" @click="reject">
                    审核不通过
                </el-button>
            </template>
        </data-entry>
        <el-dialog title="审核日志" width="900px" :close-on-click-modal="false" :visible.sync="visibleAuditLog">
            <audit-log :table-data="auditLogData" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :pack-up="false" :status="true" :show-title="false" :height="400" />
            <div slot="footer" class="dialog-footer" />
        </el-dialog>
        <el-dialog title="退回原因" :close-on-click-modal="false" :visible.sync="visibleRefuse">
            <el-input v-model="rejectText" type="textarea" :rows="7" class="textarea" style="width: 100%;" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="visibleRefuse = false">
                    取消
                </el-button>
                <el-button type="primary" @click="refuse()">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, KOJI_API, AUDIT_API } from 'common/api/api';

    @Component({
        name: 'KojiAuditDetail'
    })
    export default class AuditDetail extends Vue {
        $refs: {
            manHourList: HTMLFormElement; // 1人工工时
            machineHourList: HTMLFormElement; // 2机械工时
            inStorageList: HTMLFormElement; // 3生产入库
            meterialList: HTMLFormElement; // 4物料领用
            craftList: HTMLFormElement; // 5工艺列表
            dataEntry: HTMLFormElement;
        };

        currentOrderNo=''
        isNormalPage=true // show normal
        isSCPage=false // show SC


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
                value: ['materialCode', 'materialName']
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
                value: ['planOutput', 'outputUnit']
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
                label: '生产日期',
                value: 'productDate'
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
                label: '准备人工',
                status: '未录入',
                isRedact: false
            },
            {
                label: '机器工时',
                status: '未录入',
                isRedact: false
            },
            {
                label: '生产入库',
                status: '未录入',
                isRedact: false
            },
            {
                label: '物料领用',
                status: '未录入',
                isRedact: false
            },
            {
                label: '工艺列表',
                isRedact: false
            }
        ];

        rejectBtn = '';
        formHeader: OrderData = {};
        auditLogData = [] // 审核日志
        // classesOptions: object[] = [];
        visibleRefuse = false; // 退回弹窗
        visibleAuditLog= false; // 审核日志弹窗

        rejectText = '';
        rejectProcess='';
        rejectKojiHouseId='';
        rejectMaterialStyle=''; // 物料领用使用
        rejectBatch=''; // 物料领用使用

        kojiHouseNoOptions: OptionObj[]=[]; // 曲房下拉
        manHourList: ManHourList[] = [];
        machineHourList: MachineHourList[] = [];
        inStorageList: InStorageList[] = [];
        meterialList: MeterialList[]= [];
        craftList: CraftList[] = [];

        processMapping={} // 工序 mapping
        currentRow: { addKojiDate?: string } = {}

        async mounted() {

            console.log('this.$store.state.koji.auditDetail')
            console.log(this.$store.state.koji.auditDetail)
            this.currentOrderNo = this.$store.state.koji.auditDetail.orderNo
            if (this.$store.state.koji.auditDetail.productLineName !== '') {
                this.isNormalPage = false // show normal
                this.isSCPage = true // show SC
            }
            await this.initData(this.currentOrderNo)
            await this.getKojiHolder()
            await this.getProcessMapping()
        }

        // 工艺列表 tab 工序详情
        goProcessDetail(item) {
            console.log('点击后 item')
            console.log(item)
            this.goDetail(this.processMapping[item.process], item.arg, item)
        }

        // 跳转工序页面
        goDetail(who, arg, row) {
            let url = '';
            let whichTab = '';
                switch (who) {
                    case 'XD':
                        url = 'DFMDS-pages-KojiMaking-WorkingProcedure-WashBean';
                        whichTab = '2';
                        break;
                    case 'ZM':
                        url = 'DFMDS-pages-KojiMaking-WorkingProcedure-SteamedFlour';
                        whichTab = '2';
                        break;
                    case 'YP':
                        url = 'DFMDS-pages-KojiMaking-WorkingProcedure-disc';
                        whichTab = '1';
                        break;
                    case 'SC':
                        url = 'DFMDS-pages-KojiMaking-WorkingProcedure-SCWashBean';
                        whichTab = '2';
                        break;
                    case 'ZD':
                        url = 'DFMDS-pages-KojiMaking-WorkingProcedure-SteamedBean';
                        whichTab = '1';
                        break;
                    default:
                        url = 'DFMDS-pages-KojiMaking-WorkingProcedure-SteamedBean'; // 防呆 SC 蒸豆命名
                        whichTab = '1';
                }

            console.log(`url:${url}`)
            this.$store.commit('koji/updateOrderKojiInfo', { ...row, orderNo: this.formHeader.orderNo });

            this.$store.commit(
                    'common/updateMainTabs',
                    this.$store.state.common.mainTabs.filter(subItem => subItem.name !== url)
            );

            setTimeout(() => {
                this.$router.push({
                    name: url, params: { order: arg, activeName: whichTab }
                });
            }, 100);
        }

        get inStorageComputed() {
            let result = 0
            if (this.inStorageList.length !== 0) {
                this.inStorageList.forEach(item => {
                    result += item.inStorageAmount
                })
            }
            return result
        }

        getManHourList() {
            KOJI_API.KOJI_ADDIT_QUERY_MANHOUR_API({
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('准备工时data')
                console.log(data)
                this.manHourList = []
                if (data.data !== null) {
                    this.manHourList = data.data
                }
            });
        }

        getMachineHourList() {
            KOJI_API.KOJI_ADDIT_QUERY_MACHINEHOUR_API({
                // kojiOrderNo: '',
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('机械工时data')
                console.log(data)
                this.machineHourList = []
                if (data.data !== null) {
                    this.machineHourList = data.data
                }
            });
        }

        getInStorageList() {
            KOJI_API.KOJI__AUDIT_QUERY_INSTORAGE_API({
                // kojiOrderNo: '',
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('生产入库data')
                console.log(data)
                this.inStorageList = []
                if (data.data !== null) {
                    this.inStorageList = data.data
                }
            });
        }

        getMeterialList() {
            KOJI_API.KOJI_AUDIT_QUERY_MARTERIAL_API({
                // kojiOrderNo: '',
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('物料领用data')
                console.log(data)
                this.meterialList = []
                if (data.data !== null) {
                    this.meterialList = data.data
                }
            });
        }

        getCraftList() {
            KOJI_API.KOJI_AUDIT_QUERY_CRAFT_API({
                // kojiOrderNo: '',
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('工艺列表data')
                console.log(data)
                this.craftList = []
                if (data.data !== null) {
                    this.craftList = data.data
                }
            });
        }

        tabClick(val) {
            const num = Number(val.name) - 1;
            const status: (any) =  this.tabs[num].status;// eslint-disable-line
            status ? this.rejectBtn = status : this.rejectBtn = ''
        }

        async initData(order) {
            // 表头讯息
            await COMMON_API.OREDER_QUERY_BY_NO_API({ // 基础数据-订单管理-根据订单号查询
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: order
            }).then(({ data }) => {
                console.log('订单号data')
                console.log(data)
                this.formHeader = data.data;
                this.formHeader.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptName;
                this.formHeader.orderId = this.formHeader.id;
            })


            // 页签状态
            await KOJI_API.KOJI_VERIFY_TAB_STATUS_API({ // /koji/houseTag/queryVerifyDetail
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('页签data')
                console.log(data)
                if (data.data !== null) {
                    // this.rejectBtn = data.data.readyTagStatus;
                    this.tabs[0].status = data.data.ready;
                    this.tabs[1].status = data.data.device;
                    this.tabs[2].status = data.data.inStorage;
                    this.tabs[3].status = data.data.material;

                    this.$refs.dataEntry.updateTabs();
                }
            });

            // 5 个 tab 加载
            this.getManHourList()
            this.getMachineHourList()
            this.getInStorageList()
            this.getMeterialList()
            this.getCraftList()
        }

        reject(who, item) {
            this.visibleRefuse = true;
            this.rejectText = '';
            console.log('item')
            console.log(item)
            this.currentRow = item;
            switch (who) {
                case '1':
                    this.rejectProcess = this.processMapping[item.process]
                break;
                case '2':
                    this.rejectProcess = this.processMapping[item.process]
                    this.rejectKojiHouseId = this.kojiHouseNoOptions.filter(element => element.optValue === item.kojiHouseNo)[0]?.optId
                break;
                case '3':
                    this.rejectKojiHouseId = this.kojiHouseNoOptions.filter(element => element.optValue === item.kojiHouseNo)[0]?.optId
                break;
                case '4':
                    this.rejectKojiHouseId = this.kojiHouseNoOptions.filter(element => element.optValue === item.kojiHouseNo)[0]?.optId
                    this.rejectMaterialStyle = item.storageType;
                    this.rejectBatch = item.batch;
                break;
                default:
            }
        }

        auditLog(row, tab) {
            console.log('row')
            console.log(row)
            // ['WB_MATERIAL', 'MATERIAL']
            let verifyTypeTemp: string[] = []
            switch (tab) {
                case '准备人工':
                    // if (row.process === '洗豆') {
                    //     verifyTypeTemp = ['WB_CONTROL', 'TIMESHEET']
                    // }
                    // if (row.process === '蒸面') {
                    //     verifyTypeTemp = ['SF_CONTROL', 'TIMESHEET']
                    // }
                    // if (row.process === '圆盘') {
                    //     verifyTypeTemp = ['KJ_CONTROL', 'TIMESHEET']
                    // }
                    // if (row.process === 'SC洗豆') {
                    //     verifyTypeTemp = ['WB_CONTROL', 'TIMESHEET']
                    // }
                    // if (row.process === '篜豆') {
                    //     verifyTypeTemp = ['SB_CONTROL', 'TIMESHEET']
                    // }
                    AUDIT_API.STE_AUDIT_QUERY_BY_ID({
                        id: row.timeSheetId
                    }).then(({ data }) => {
                        this.auditLogData = data.data;
                        this.visibleAuditLog = true
                    })
                    break;
                case '机器工时':
                    if (row.process === '洗豆') {
                        verifyTypeTemp = ['WB_CONTROL', 'TIMESHEET']
                    }
                    if (row.process === '蒸面') {
                        verifyTypeTemp = ['SF_CONTROL', 'TIMESHEET']
                    }
                    if (row.process === '圆盘') {
                        verifyTypeTemp = ['KJ_CONTROL', 'TIMESHEET']
                    }
                    if (row.process === 'SC洗豆') {
                        verifyTypeTemp = ['WB_CONTROL', 'TIMESHEET']
                    }
                    if (row.process === 'SC篜豆') {
                        verifyTypeTemp = ['SB_CONTROL', 'TIMESHEET']
                    }
                    AUDIT_API.STE_AUDIT_LOG_API({ orderNo: this.currentOrderNo, splitOrderNo: row.kojiOrderNo, verifyType: verifyTypeTemp }).then(({ data }) => {
                        this.auditLogData = data.data
                        this.visibleAuditLog = true
                    })
                    break;
                case '生产入库':
                    if (row.process === 'XD') { // 洗豆
                        verifyTypeTemp = []
                    }
                    if (row.process === 'ZM') { // 蒸面
                        verifyTypeTemp = []
                    }
                    if (row.process === 'YP') { // 圆盘
                        verifyTypeTemp = ['KJ_INSTORAGE', 'INSTORAGE']
                    }
                    if (row.process === 'SC') { // SC洗豆
                        verifyTypeTemp = []
                    }
                    if (row.process === 'ZD') { // SC篜豆
                        verifyTypeTemp = ['SB_INSTORAGE', 'INSTORAGE']
                    }
                    AUDIT_API.STE_AUDIT_LOG_API({ orderNo: this.currentOrderNo, splitOrderNo: row.kojiOrderNo, verifyType: verifyTypeTemp }).then(({ data }) => {
                        this.auditLogData = data.data
                        this.visibleAuditLog = true
                    })
                    break;
                case '物料领用':
                    if (row.process === 'XD') { // 洗豆
                        verifyTypeTemp = ['WB_MATERIAL', 'MATERIAL']
                    }
                    if (row.process === 'ZM') { // 蒸面
                        verifyTypeTemp = ['SF_MATERIAL', 'MATERIAL']
                    }
                    if (row.process === 'YP') { // 圆盘
                        verifyTypeTemp = []
                    }
                    if (row.process === 'SC') { // SC洗豆
                        verifyTypeTemp = ['WB_MATERIAL', 'MATERIAL']
                    }
                    if (row.process === 'ZD') { // SC篜豆
                        verifyTypeTemp = []
                    }
                    AUDIT_API.STE_AUDIT_LOG_API({ orderNo: this.currentOrderNo, splitOrderNo: row.kojiOrderNo, verifyType: verifyTypeTemp }).then(({ data }) => {
                        this.auditLogData = data.data
                        this.visibleAuditLog = true
                    })
                    break;
                default:
                    break;
            }

            // AUDIT_API.STE_AUDIT_LOG_API({ orderNo: this.formHeader.orderNo, splitOrderNo: this.formHeader.kojiOrderNo, verifyType: ['WB_MATERIAL', 'MATERIAL'] }).then(({ data }) => {

        }

        // 获取曲房下拉选项
        getKojiHolder() {
            COMMON_API.HOLDER_QUERY_BY_NOPAGE_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: this.formHeader.workShop,
                holderType: '005'
            }).then(({ data }) => {
                this.kojiHouseNoOptions = []
                data.data.forEach(item => {
                    this.kojiHouseNoOptions.push({ optLabel: item.holderName, optValue: item.holderNo, optId: item.id })
                })
            })
        }

        // 获取工序 mapping
        getProcessMapping() {
            COMMON_API.DICTQUERY_API({ dictType: 'COMMON_PROCESS' }).then(({ data }) => {
                this.processMapping = {}
                data.data.forEach(item => {
                    this.$set(this.processMapping, item.dictValue, item.dictCode)
                })
            });
        }

        refuse() {
            if (!this.rejectText) {
                this.$warningToast('请填写原因');
                return false
            }

            switch (this.$refs.dataEntry.activeName) {
                case '1':
                    KOJI_API.KOJI_REFUSE_READY_API({
                        orderNo: this.formHeader.orderNo,
                        process: this.rejectProcess,
                        // productDate: this.formHeader.productDate,
                        productDate: this.currentRow.addKojiDate,
                        refuseSeason: this.rejectText,
                        workShop: this.formHeader.workShop
                    }).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData(this.currentOrderNo)
                    })

                    break;
                case '2':
                    KOJI_API.KOJI_REFUSE_DEVICE_API({
                        kojiHouseId: this.rejectKojiHouseId,
                        orderNo: this.formHeader.orderNo,
                        process: this.rejectProcess,
                        // productDate: this.formHeader.productDate,
                        productDate: this.currentRow.addKojiDate,
                        refuseSeason: this.rejectText
                    }).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData(this.currentOrderNo)
                    })

                    break;
                case '3':
                    KOJI_API.KOJI_REFUSE_INSTORAGE_API({
                        kojiHouseId: this.rejectKojiHouseId,
                        orderNo: this.formHeader.orderNo,
                        // productDate: this.formHeader.productDate,
                        productDate: this.currentRow.addKojiDate,
                        refuseSeason: this.rejectText
                    }).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData(this.currentOrderNo)
                    })
                    break;
                case '4':
                    KOJI_API.KOJI_REFUSE_MATERIAL_API({
                        batch: this.rejectBatch,
                        kojiHouseId: this.rejectKojiHouseId,
                        orderNo: this.formHeader.orderNo,
                        storageType: this.rejectMaterialStyle,
                        // productDate: this.formHeader.productDate,
                        productDate: this.currentRow.addKojiDate,
                        refuseSeason: this.rejectText
                    }).then(() => {
                        this.visibleRefuse = false;
                        this.$successToast('操作成功');
                        this.initData(this.currentOrderNo)
                    })
                    break;
                default:
            }
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
        materialTypeName?: string;
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

    interface ManHourList {
        addKojiDate: string;
        enableBack: number;
        kojiHouseNo: string;
        kojiHouseName: string;
        machineHour: number;
        manHour: number;
        prepairedHour: number;
        process: string;
    }
    interface MachineHourList {
        addKojiDate: string;
        enableBack: number;
        kojiHouseNo: string;
        kojiHouseName: string;
        machineHour: number;
        manHour: number;
        prepairedHour: number;
        process: string;
    }
    interface InStorageList {
        addKojiDate: string;
        beanAmount: number;
        changed: string;
        changer: string;
        enableBack: number;
        inStorageAmount: number;
        inStorageBatch: string;
        kojiHouseNo: string;
        kojiHouseName: string;
        strainAmount: number;
        unit: string;
        unitName: string;
        wheatAmount: number;
    }
    interface MeterialList {
        addKojiDatestring;
        amount: number;
        batch: string;
        changedstring;
        changer: string;
        enableBack: number;
        kojiHouseNo: string;
        kojiHouseName: string;
        material: string;
        materialName: string;
        unit: string;
        unitName: string;
    }
    interface CraftList {
        addKojiDate: string;
        arg: string;
        changed: string;
        changer: string;
        kojiHouseNo: string;
        kojiHouseName: string;
        process: string;
    }
    interface OptionObj {
        optLabel: string;
        optValue: string;
        optId: string;
    }

</script>

<style scoped>

</style>
