<template>
    <div class="header_main">
        <el-card class="queryHead">
            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="auto" class="sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="plantList.factoryIDValue" class="w300" placeholder="请选择" @change="changeSearchOptions(plantList.factoryIDValue)">
                        <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="plantList.workshopIDValue" class="w200" clearable placeholder="请选择" :disabled="plantList.factoryIDValue === '' || workshopList.length === 0">
                        <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item style="float: right;">
                    <el-button v-if="isAuth('realTime:wheat:wheatMeasuringBin')" type="primary" size="small" :disabled="(plantList.factoryIDValue === '' && plantList.workshopIDValue === '') || workshopList.length === 0" @click="getOrderList()">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-row v-if="isMainAreaShow" :gutter="30" class="cardList">
            <el-col v-for="(item, index) in dataList" :key="index" :span="12">
                <el-card class="card-item">
                    <div slot="header">
                        计量仓号：{{ item.holderName }}
                        <span class="card-item_detail" @click="goTargetDetail(item)">详情</span>
                    </div>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <div class="card-item-color-lump" style="background: #ffbf00;">
                                <span class="card-item-color-lump_icon iconfont factory-chuguan1" />
                                <div class="card-item-color-lump__img">
                                    <div class="card-item-color-lump__img__box">
                                        <div
                                            class="card-item-color-lump__img__box__bg"
                                            :style="{
                                                height: `${Math.min(sumBatch(item.wheatList) / (item.holderHold * 1), 100)}%`,
                                            }"
                                        />
                                    </div>
                                    <img src="@/assets/img/ui2.0/pot.png" alt="">
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="card-item-color-lump">
                                <span class="card-item-color-lump_icon iconfont factory-zongliangguanli" />
                                <p class="card-item-color-lump_text">
                                    <span>{{ sumBatch(item.wheatList).toLocaleString() }}</span>KG
                                </p>
                                <p class="card-item-color-lump_text">
                                    库存总量
                                </p>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="card-item-color-lump_text">
                        <p class="card-item-color-lump_text__title">
                            <em class="card-item-color-lump_text__icon" />
                            <span>库存明细</span>
                        </p>
                        <el-table :data="item.wheatList" header-row-class-name="card-item-color-lump_text__table__head" class="card-item-color-lump_text__table" height="165">
                            <el-table-column
                                prop="batch"
                                width="auto"
                            >
                                <template slot="header">
                                    <em class="iconfont factory-pici" style="margin-right: 5px;" />批次
                                </template>
                            </el-table-column>
                            <el-table-column prop="currentQuantity" width="auto" header-align="left">
                                <template slot="header">
                                    <em class="iconfont factory-shuliang" style=" margin-right: 5px; font-size: 18px;" />数量
                                </template>
                                <template slot-scope="scope">
                                    {{ (scope.row.amount * 1).toLocaleString() }}
                                    KG
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { BASICDATA_API, MEASUREBARN_WHEAT_API } from '@/api/api';
import { isAuth } from '../../../../../net/validate';
import MSG from '@/assets/js/hint-msg';
export default {
    name: 'MeasureBarnWheatPotIndex',
    components: {},
    data() {
        return {
            factoryList: [],
            workshopList: [],
            plantList: {
                factoryIDValue: '',
                factoryName: '',
                workshopIDValue: '',
                workshopName: '',
                holderId: '',
                holderName: ''
            },
            dataList: [],
            oriAPIData: []
        };
    },
    computed: {
        isMainAreaShow: function() {
            return this.dataList.length !== 0;
        },
        sumBatch: function() {
            return function(items) {
                let sum = 0;
                items.forEach(item => {
                    sum = sum + Number(item.amount);
                });
                return sum;
            };
        },
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            }
        },
        targetAugs: {
            get() {
                return this.$store.state.common.MeasureBarnWheatPot;
            },
            set(val) {
                this.$store.commit('common/updatemMeasureBarnWheatPot', val);
            }
        }
    },
    mounted() {
        this.getOriDataFromAPI().then(() => {
            // 初始化搜寻条件
            this.plantList.factoryIDValue = this.oriAPIData[0].deptId;
            if (this.oriAPIData[0].workshop.length !== 0) {
                this.workshopList = this.oriAPIData[0].workshop;
                this.plantList.workshopIDValue = this.oriAPIData[0].workshop[0].deptId;
            } else {
                this.workshopList = [];
                this.plantList.workshopIDValue = '';
            }
        });
    },
    methods: {
        // 改变选单数据
        changeSearchOptions(flag) {
            const item = this.oriAPIData.find(ele => ele.deptId === flag);
            if (item.workshop.length !== 0) {
                this.workshopList = item.workshop;
            } else {
                this.workshopList = [];
                this.plantList.workshopIDValue = '';
            }
        },
        // 获取工厂
        getFactory() {
            return new Promise((resolve, reject) => {
                this.factoryList = [];
                this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        resolve(data.typeList);
                    } else {
                        this.$notify.error({
                            title: MSG.API.WheatPot.getFactoryError.title,
                            message: data.msg
                        });
                        reject(data.msg);
                    }
                });
            });
        },
        // 根据工厂获车间
        getWorkshop(id) {
            return new Promise((resolve, reject) => {
                this.plantList.workshopIDValue = '';
                this.workshopList = [];
                if (id) {
                    this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '炒麦' }, false, false, false).then(({ data }) => {
                        if (data.code === 0) {
                            resolve(data.typeList);
                        } else {
                            this.$notify.error({
                                title: MSG.API.WheatPot.getWorkshopError.title,
                                message: data.msg
                            });
                            reject(data.msg);
                        }
                    });
                }
            });
        },
        // 获取工厂车间
        getOriDataFromAPI() {
            return new Promise((resolve) => {
                this.getFactory().then(valueFactory => {
                    this.oriAPIData = [];
                    this.factoryList = [];
                    for (let i = 0; i < valueFactory.length; i++) {
                        const dataTempF = {
                            deptId: valueFactory[i].deptId,
                            deptName: valueFactory[i].deptName,
                            workshop: []
                        };
                        this.factoryList.push({
                            deptId: valueFactory[i].deptId,
                            deptName: valueFactory[i].deptName
                        });
                        this.getWorkshop(valueFactory[i].deptId).then(valueWorkshop => {
                            if (valueWorkshop.length !== 0) {
                                for (let j = 0; j < valueWorkshop.length; j++) {
                                    const dataTempW = {
                                        deptId: valueWorkshop[j].deptId,
                                        deptName: valueWorkshop[j].deptName
                                    };
                                    dataTempF.workshop.push(dataTempW);
                                }
                            }
                            this.oriAPIData.push(dataTempF);
                            resolve();
                        });
                    }
                });
            });
        },
        // 获取列表
        getOrderList() {
            this.dataList = [];
            if (!this.plantList.factoryIDValue) {
                this.$warningToast('请选择工厂');
                return;
            }
            this.$http(`${MEASUREBARN_WHEAT_API.WHEAT_POT_LIST}`, `POST`, {
                factory: this.plantList.factoryIDValue,
                workShop: this.plantList.workshopIDValue
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (data.infoList.length !== 0) {
                        this.dataList = data.infoList;
                    } else {
                        this.$notify.info({
                            title: MSG.API.WheatPot.BeanPulp.searchResult.title,
                            message: MSG.API.WheatPot.BeanPulp.searchResult.message
                        });
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 去详请
        goTargetDetail(item) {
            if (!isAuth('realTime:wheat:wheatMeasuringBin')) {
                this.$notify.error({
                    title: MSG.AUTH.noAuthority.title,
                    message: MSG.AUTH.noAuthority.message
                });
                return;
            }
            // ！！！！！！此部份逻辑不一样会需要送不同参数！！！！！！
            const searchTarget = this.oriAPIData.find(ele => ele.deptId === this.plantList.factoryIDValue);
            this.targetAugs = {
                // holderId: item.holderId,
                // factory: this.plantList.factoryIDValue
                factoryId: this.plantList.factoryIDValue,
                factoryName: searchTarget.deptName,
                workshopId: item.deptId,
                workshopName: searchTarget.workshop.find(ele => ele.deptId === item.deptId).deptName,
                holderId: item.holderId,
                holderName: item.holderName
            };
            this.$store.state.common.MeasureBarnWheatPot = item;
            this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== 'MDS-views-page-DataEntry-MeasureBarn-WheatPot-DataEntryIndex');
            setTimeout(() => {
                this.$router.push({
                    name: 'MDS-views-page-DataEntry-MeasureBarn-WheatPot-DataEntryIndex'
                });
            }, 100);
        }
    }
};
</script>

<style lang="scss"></style>
