<template>
    <el-col>
        <div class="main">
            <el-card class="searchCard newCard" style="margin: 0;">
                <el-row type="flex">
                    <el-col :span="21" />
                    <el-col :span="3" />
                </el-row>
                <el-row style="text-align: right;" class="buttonCss" />
                <div class="toggleSearchBottom">
                    <em class="el-icon-caret-top" />
                </div>
            </el-card>
        </div>
        <div class="main" style="padding-top: 0;">
            <div class="tableCard">
                <div class="toggleSearchTop" style=" position: relative; margin-bottom: 8px; background-color: white; border-radius: 5px;">
                    <em class="el-icon-caret-bottom" />
                </div>
                <el-tabs id="DaatTtabs" ref="tabs" v-model="activeName" class="NewDaatTtabs" type="border-card" style=" overflow: hidden; border-radius: 15px;">
                    <el-tab-pane name="1">
                        <span slot="label" class="spanview">
                            <el-tooltip class="item" effect="dark" :content="'haha'" placement="top-start">
                                <el-button>准备时间</el-button>
                            </el-tooltip>
                        </span>
                    </el-tab-pane>
                    <el-tab-pane name="2">
                        <span slot="label" class="spanview">
                            <el-tooltip class="item" effect="dark" :content="'haha'" placement="top-start">
                                <el-button>人员</el-button>
                            </el-tooltip>
                        </span>
                    </el-tab-pane>
                    <el-tab-pane name="3">
                        <span slot="label" class="spanview">
                            <el-button>异常记录</el-button>
                        </span>
                    </el-tab-pane>
                    <el-tab-pane name="4">
                        <span slot="label" class="spanview">
                            <el-tooltip class="item" effect="dark" :content="'haha'" placement="top-start">
                                <el-button>生产入库</el-button>
                            </el-tooltip>
                        </span>
                    </el-tab-pane>
                    <el-tab-pane name="5">
                        <span slot="label" class="spanview">
                            <el-tooltip class="item" effect="dark" :content="'haha'" placement="top-start">
                                <el-button>物料领用</el-button>
                            </el-tooltip>
                        </span>
                    </el-tab-pane>
                    <el-tab-pane name="6">
                        <span slot="label" class="spanview">
                            <el-button>文本记录</el-button>
                        </span>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </el-col>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default class Index extends Vue {
    // 将common中的参数复制一份到本地
    activeName: '1';
}
</script>
<style lang="scss" scoped></style>
