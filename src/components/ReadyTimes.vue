<template>
    <mds-card :title="'准备工时(单位：min)'" :name="'readyTimes'" class="header_main" style="padding: 0;">
        <template slot="titleBtn">
            <div style="float: right;">
                <el-select v-model="currentFormDataGroup.classes" size="small" style="width: 100px;" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')">
                    <el-option v-for="(item) in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                </el-select>
            </div>
        </template>
        <div v-if="currentFormDataGroup.classes === 'M' || currentFormDataGroup.classes === 'D'" class="marginL10px">
            <div class="box-card-title clearfix">
                <h3><em class="point-icon" />{{ classesOptions.length !== 0 ? classesOptions.find((item)=> item.dictCode === 'M').dictValue : '' }}</h3>
            </div>
            <el-row>
                <el-form :inline="true" :model="currentFormDataGroup" size="small" label-width="100px" class="multi_row">
                    <el-form-item prop="dayUser">
                        <template slot="label">
                            <span class="notNull">*</span>参与人数：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.dayUser" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">人</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="dayShift">
                        <template slot="label">
                            <span class="notNull">*</span>交接班：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.dayShift" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="dayMeeting">
                        <template slot="label">
                            <span class="notNull">*</span>班前会：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.dayMeeting" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="dayPrepaired">
                        <template slot="label">
                            <span class="notNull">*</span>生产前准备：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.dayPrepaired" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="dayClear">
                        <template slot="label">
                            <span class="notNull">*</span>生产后清场：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.dayClear" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="品质保证：">
                        <el-input v-model.number="currentFormDataGroup.dayQuality" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="切换时间：">
                        <el-input v-model.number="currentFormDataGroup.dayChange" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-row>
        </div>
        <div v-if="currentFormDataGroup.classes === 'A' || currentFormDataGroup.classes === 'D'" class="marginL10px">
            <div class="box-card-title clearfix">
                <h3><em class="point-icon" />{{ classesOptions ? classesOptions.find((item)=> item.dictCode === 'A').dictValue : '' }}</h3>
            </div>
            <el-row>
                <el-form :inline="true" :model="currentFormDataGroup" size="small" label-width="100px" class="multi_row">
                    <el-form-item label="">
                        <template slot="label">
                            <span v-if="currentFormDataGroup.classes === 'A'" class="notNull">*</span> 参与人数：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.midUser" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">人</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <template slot="label">
                            <span v-if="currentFormDataGroup.classes === 'A'" class="notNull">*</span> 交接班：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.midShift" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <template slot="label">
                            <span v-if="currentFormDataGroup.classes === 'A'" class="notNull">*</span> 班前会：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.midMeeting" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <template slot="label">
                            <span v-if="currentFormDataGroup.classes === 'A'" class="notNull">*</span> 生产前准备：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.midPrepaired" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <template slot="label">
                            <span v-if="currentFormDataGroup.classes === 'A'" class="notNull">*</span> 生产后清场：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.midClear" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="品质保证：">
                        <el-input v-model.number="currentFormDataGroup.midQuality" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="切换时间：">
                        <el-input v-model.number="currentFormDataGroup.midChange" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-row>
        </div>
        <div v-if="currentFormDataGroup.classes === 'N' || currentFormDataGroup.classes === 'D'" class="marginL10px">
            <div class="box-card-title clearfix">
                <h3><em class="point-icon" />{{ classesOptions ? classesOptions.find((item)=> item.dictCode === 'N').dictValue : '' }}</h3>
            </div>
            <el-row>
                <el-form :inline="true" :model="currentFormDataGroup" size="small" label-width="100px" class="multi_row">
                    <el-form-item
                        prop="nightUser"
                    >
                        <template slot="label">
                            <span class="notNull">*</span>参与人数：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.nightUser" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">人</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        prop="nightUser"
                    >
                        <template slot="label">
                            <span class="notNull">*</span>交接班：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.nightShift" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        prop="nightMeeting"
                    >
                        <template slot="label">
                            <span class="notNull">*</span>班前会：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.nightMeeting" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        prop="nightPrepaired"
                    >
                        <template slot="label">
                            <span class="notNull">*</span>生产前准备：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.nightPrepaired" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        prop="nightClear"
                    >
                        <template slot="label">
                            <span class="notNull">*</span>生产后清场：
                        </template>
                        <el-input v-model.number="currentFormDataGroup.nightClear" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="品质保证：">
                        <el-input v-model.number="currentFormDataGroup.nightQuality" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="切换时间：">
                        <el-input v-model.number="currentFormDataGroup.nightChange" placeholder="请输入" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P'&& status !=='M')" clearable oninput="value=value.replace(/\D*/g,'')">
                            <span slot="suffix">min</span>
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-row>
        </div>
    </mds-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { COMMON_API } from 'common/api/api';

@Component({
    name: 'ReadyTimes'
})

export default class ReadyTimes extends Vue {
    @Prop({ type: Boolean, default: false }) isRedact;
    @Prop({ type: String, default: '' }) status;

    currentFormDataGroup: ReadyTimesData = {
        classes: '',
        dayQuality: null,
        dayChange: null,
        midQuality: null,
        midChange: null,
        nightQuality: null,
        nightChange: null
    };

    orgFormDataGroup: ReadyTimesData= {} // 用于比对的原始 data object
    readAudit= []
    isChange=false // data 是否有异动
    isNewForm=false // 是否初次
    readyTimesAudit = [];
    classesOptions: ClassesOptions[] = [];


    // DFMDS-2571 需求
    // @Watch('currentFormDataGroup.classes')
    // WatchClass() {
    //     if (!this.currentFormDataGroup.dayQuality) {
    //         this.currentFormDataGroup.dayQuality = 0;
    //     }
    //     if (!this.currentFormDataGroup.dayChange) {
    //         this.currentFormDataGroup.dayChange = 0;
    //     }
    //     if (!this.currentFormDataGroup.midQuality) {
    //         this.currentFormDataGroup.midQuality = 0;
    //     }
    //     if (!this.currentFormDataGroup.midChange) {
    //         this.currentFormDataGroup.midChange = 0;
    //     }
    //     if (!this.currentFormDataGroup.nightQuality) {
    //         this.currentFormDataGroup.nightQuality = 0;
    //     }
    //     if (!this.currentFormDataGroup.nightChange) {
    //         this.currentFormDataGroup.nightChange = 0;
    //     }
    // }

    init() {
        this.currentFormDataGroup['classes'] = '';
        this.getClassesList();
    }

    changeList(dataList) {
        this.currentFormDataGroup = dataList;
        if (dataList === null) {
            this.currentFormDataGroup = {
                classes: 'M',
                dayQuality: null,
                dayChange: null,
                midQuality: null,
                midChange: null,
                nightQuality: null,
                nightChange: null
            }
        }
    }

    // 班次
    getClassesList() {
        COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CLASSES' }).then(({ data }) => {
            this.classesOptions = data.data;
        });
    }

    savedData(formHeader) {
        let pkgTimeSheetDto: ReadyTimesData = {};
        const arr = ['day', 'mid', 'night'];
        for (const key in this.currentFormDataGroup) {
            if (Object.prototype.hasOwnProperty.call(this.currentFormDataGroup, key)) {
                const element = this.currentFormDataGroup[key];
                const boo = arr.some(str => key.includes(str));
                if (element === '' && boo) {
                    this.currentFormDataGroup[key] = 0;
                }
            }
        }
        this.currentFormDataGroup.orderNo = formHeader.orderNo;
        this.currentFormDataGroup.orderId = formHeader.orderId;
        // if (!this.currentFormDataGroup.dayQuality) {
        //     this.currentFormDataGroup.dayQuality = 0;
        // }
        // if (!this.currentFormDataGroup.dayChange) {
        //     this.currentFormDataGroup.dayChange = 0;
        // }
        // if (!this.currentFormDataGroup.midQuality) {
        //     this.currentFormDataGroup.midQuality = 0;
        // }
        // if (!this.currentFormDataGroup.midChange) {
        //     this.currentFormDataGroup.midChange = 0;
        // }
        // if (!this.currentFormDataGroup.nightQuality) {
        //     this.currentFormDataGroup.nightQuality = 0;
        // }
        // if (!this.currentFormDataGroup.nightChange) {
        //     this.currentFormDataGroup.nightChange = 0;
        // }

        pkgTimeSheetDto = this.returnDataGroup()
        return pkgTimeSheetDto
    }

    returnDataGroup() {
        if (this.currentFormDataGroup.classes === 'M') {
            this.currentFormDataGroup.midChange = null
            this.currentFormDataGroup.midClear = null
            this.currentFormDataGroup.midMeeting = null
            this.currentFormDataGroup.midPrepaired = null
            this.currentFormDataGroup.midQuality = null
            this.currentFormDataGroup.midShift = null
            this.currentFormDataGroup.midUser = null
            this.currentFormDataGroup.nightChange = null
            this.currentFormDataGroup.nightClear = null
            this.currentFormDataGroup.nightMeeting = null
            this.currentFormDataGroup.nightPrepaired = null
            this.currentFormDataGroup.nightQuality = null
            this.currentFormDataGroup.nightShift = null
            this.currentFormDataGroup.nightUser = null
        } else if (this.currentFormDataGroup.classes === 'A') {
            this.currentFormDataGroup.dayChange = null
            this.currentFormDataGroup.dayClear = null
            this.currentFormDataGroup.dayMeeting = null
            this.currentFormDataGroup.dayPrepaired = null
            this.currentFormDataGroup.dayQuality = null
            this.currentFormDataGroup.dayShift = null
            this.currentFormDataGroup.dayUser = null
            this.currentFormDataGroup.nightChange = null
            this.currentFormDataGroup.nightClear = null
            this.currentFormDataGroup.nightMeeting = null
            this.currentFormDataGroup.nightPrepaired = null
            this.currentFormDataGroup.nightQuality = null
            this.currentFormDataGroup.nightShift = null
            this.currentFormDataGroup.nightUser = null
        } else if (this.currentFormDataGroup.classes === 'N') {
            this.currentFormDataGroup.dayChange = null
            this.currentFormDataGroup.dayClear = null
            this.currentFormDataGroup.dayMeeting = null
            this.currentFormDataGroup.dayPrepaired = null
            this.currentFormDataGroup.dayQuality = null
            this.currentFormDataGroup.dayShift = null
            this.currentFormDataGroup.dayUser = null
            this.currentFormDataGroup.midChange = null
            this.currentFormDataGroup.midClear = null
            this.currentFormDataGroup.midMeeting = null
            this.currentFormDataGroup.midPrepaired = null
            this.currentFormDataGroup.midQuality = null
            this.currentFormDataGroup.midShift = null
            this.currentFormDataGroup.midUser = null
        } else {
            //
        }

        return JSON.parse(JSON.stringify(this.currentFormDataGroup))
    }

    ruleSubmit() {
        if (this.currentFormDataGroup.classes === 'M' || this.currentFormDataGroup.classes === 'D') { // 早
            if (!this.currentFormDataGroup.dayUser || !this.currentFormDataGroup.dayShift || !this.currentFormDataGroup.dayMeeting || !this.currentFormDataGroup.dayPrepaired || !this.currentFormDataGroup.dayClear) {
                console.log('this.currentFormDataGroup')
                console.log(this.currentFormDataGroup)
                this.$warningToast('请填写早班准备时间必填项')
                return false
            }
        }
        if (this.currentFormDataGroup.classes === 'A') { // 中
            if (!this.currentFormDataGroup.midUser || !this.currentFormDataGroup.midShift || !this.currentFormDataGroup.midMeeting || !this.currentFormDataGroup.midPrepaired || !this.currentFormDataGroup.midClear) {
                this.$warningToast('请填写中班准备时间必填项')
                return false
            }
        }
        if (this.currentFormDataGroup.classes === 'N' || this.currentFormDataGroup.classes === 'D') { // 晚
            if (!this.currentFormDataGroup.nightUser || !this.currentFormDataGroup.nightShift || !this.currentFormDataGroup.nightMeeting || !this.currentFormDataGroup.nightPrepaired || !this.currentFormDataGroup.nightClear) {
                this.$warningToast('请填写晚班准备时间必填项')
                return false
            }
        }
        return true
    }
}
interface ReadyTimesData {
    checkStatus?: string; //审核状态(T:已同步，N:未录入、S:已保存、P:待审核、C:已审核、P:已过账、R:已退回)
    checkStatusName?: string;
    classes?: string; // 班次
    dayChange?: number | null; // 白班切换时间
    dayClear?: number | null; // 生产后清场
    dayMeeting?: number | null; // 班前会
    dayPrepaired?: number | null; // 生产前准备
    dayQuality?: number | null; // 白班品质保证
    dayShift?: number | null; // 交接班
    dayUser?: number | null; // 白班参与人数
    factory?: string; // 工厂 #
    funcCode?: string; // 功能code(暂时可不填)
    id?: string; // 主键ID  #
    midChange?: number | null; // 中班切换时间
    midClear?: number | null; // 生产后清场
    midMeeting?: number | null; // 班前会
    midPrepaired?: number | null; // 生产前准备
    midQuality?: number | null; // 中班品质保证
    midShift?: number | null; // 交接班
    midUser?: number | null; // 中班参与人数
    nightChange?: number | null; // 夜班切换时间
    nightClear?: number | null; // 生产后清场
    nightMeeting?: number | null; // 班前会
    nightPrepaired?: number | null; // 生产前准备
    nightQuality?: number | null; // 夜班品质保证
    nightShift?: number | null; // 交接班
    nightUser?: number | null; // 夜班参与人数
    orderId?: string; // 所属订单ID
    orderNo?: string; // 订单号
    remark?: string; // 备注
}
interface ClassesOptions{
    dictCode?: string;
    dictId?: number;
    dictValue?: string;
    factoryName?: string;
    id?: number;
}
</script>
