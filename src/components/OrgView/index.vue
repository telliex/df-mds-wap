<template>
    <div class="header_main">
        <mds-card :title="title" :name="'org'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="org-card" :style="siteContentViewHeight">
                        <div class="org-card_title">
                            组织架构一览
                        </div>
                        <div class="filter-input">
                            <el-input v-model="filterText" placeholder="部门名称" size="small">
                                <em slot="suffix" class="el-input__icon el-icon-search" />
                            </el-input>
                        </div>
                        <div class="tree-main SelfScrollbar">
                            <el-tree
                                ref="tree"
                                :data="OrgTree"
                                node-key="id"
                                :props="{ label: 'deptName' }"
                                :expand-on-click-node="false"
                                :default-expanded-keys="arrList"
                                highlight-current
                                :filter-node-method="filterNode"
                                @node-click="treeNodeClick"
                                @node-contextmenu="treeNodeContextMenu"
                            />
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="org-card" :style="siteContentViewHeight">
                        <div class="org-card_title">
                            {{ rightTile }}
                        </div>
                        <div class="detail-main SelfScrollbar">
                            <slot name="view" />
                        </div>
                    </div>
                </el-col>
            </el-row>
        </mds-card>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';
    // import { namespace } from 'vuex-class';

    // const commonModule = namespace('common');

    @Component({
        components: {
        }
    })
    export default class OrgView extends Vue {
        @Prop({ default: '' }) title: string;
        @Prop({ default: '' }) rightTile: string;
        // @commonModule.state('documentClientHeight') documentClientHeight

        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        get siteContentViewHeight() {
            const height = this.mainClientHeight - 52;
            return { height: height + 'px' };
        }

        $refs: {tree: HTMLFormElement}
        filterText = ''
        OrgTree: DeptObject[] = []
        arrList: string[] = []

        @Watch('filterText')
        onChangeValue(newVal: string) {
            this.$refs.tree.filter(newVal);
        }

        mounted() {
            this.getTree(true);
        }

        // 获取组织结构树
        getTree(type = false, extendId = '') {
            let id = ''
            if (JSON.parse(sessionStorage.getItem('factory') || '{}').deptCode === '9999-xn') {
                id = 'common'
            } else {
                id = JSON.parse(sessionStorage.getItem('factory') || '{}').id
            }
            COMMON_API.ORGSTRUCTURE_API({
                factory: id
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.OrgTree = data.data;
                    if (extendId !== '') {
                        this.arrList = [extendId];
                        // this.$nextTick(() => {
                        //     console.log('extendId')
                        //     console.log(extendId)
                        //     this.$refs.tree.setCurrentKey(extendId)
                        // });
                    } else {
                        this.arrList = [this.OrgTree[0]['children'][0]['id']];

                        this.$nextTick(() => {
                            this.$refs.tree.setCurrentKey('1')
                        });
                    }

                    if (type) {
                        this.$emit('getTreeSuccess', data.data);
                    }

                }
            });
        }

        // 搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.deptName.indexOf(value) !== -1;
        }

        // 组织架构点击
        treeNodeClick(row: DeptObject) {
            this.$emit('treeNodeClick', row, true)
        }

        // 组织架构右击
        treeNodeContextMenu(event, object) {
            this.$emit('treeNodeContextMenu', event, object)
        }

    }

    interface DeptObject {
        id?: string;
    }
</script>

<style scoped lang="scss">
    .org-card {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 500px;
        overflow: hidden;
        border: 1px solid rgba(232, 232, 232, 1);
        border-radius: 4px;
        box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.09);

        ::v-deep .el-tree-node__expand-icon { /* stylelint-disable-line */
            color: #487bff;
        }
        ::v-deep .el-tree-node__expand-icon.is-leaf { /* stylelint-disable-line */
            color: transparent;
        }

        .org-card_title {
            height: 40px;
            padding-left: 10px;
            color: white;
            line-height: 40px;
            background: rgba(72, 123, 255, 1);
        }

        .filter-input {
            padding: 6px 10px;
        }

        .tree-main {
            flex: 1;
            overflow-y: scroll;
        }
        .detail-main {
            padding: 16px 10px 0 10px;
            overflow-y: scroll;
        }
    }
</style>
