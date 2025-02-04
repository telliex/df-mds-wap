<template>
    <div class="header_main">
        <mds-card title="菜单列表" :name="'menu'" :pack-up="false" style="margin-bottom: 0; background: white;">
            <template slot="titleBtn">
                <el-button v-if="isAuth('sys:menu:save')" type="primary" style="float: right; margin-bottom: 12px;" size="small" @click="addOrUpdateHandle()">
                    新增
                </el-button>
            </template>
            <el-table
                class="newTable"
                header-row-class-name="tableHead"
                :height="mainClientHeight - 64"
                :data="dataList"
                border
                tooltip-effect="dark"
                style="width: 100%;"
            >
                <el-table-column
                    prop="menuId"
                    header-align="left"
                    align="left"
                    width="80"
                    label="ID"
                />
                <table-tree-column
                    prop="name"
                    header-align="left"
                    tree-key="menuId"
                    width="150"
                    :show-overflow-tooltip="true"
                    label="名称"
                />
                <el-table-column
                    prop="parentName"
                    header-align="left"
                    align="left"
                    width="100"
                    :show-overflow-tooltip="true"
                    label="上级菜单"
                />
                <el-table-column
                    width="80"
                    header-align="left"
                    align="left"
                    :show-overflow-tooltip="true"
                    label="图标"
                >
                    <template slot-scope="scope">
                        <em class="iconfont" :class="scope.row.icon" />
                    </template>
                </el-table-column>
                <el-table-column
                    width="90"
                    prop="type"
                    header-align="left"
                    align="left"
                    :show-overflow-tooltip="true"
                    label="类型"
                >
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.type === '0'" size="small">
                            目录
                        </el-tag>
                        <el-tag v-else-if="scope.row.type === '1'" size="small" type="success">
                            菜单
                        </el-tag>
                        <el-tag v-else-if="scope.row.type === '2'" size="small" type="info">
                            按钮
                        </el-tag>
                        <el-tag v-else-if="scope.row.type === '3'" size="small" type="success">
                            三级页面
                        </el-tag>
                        <el-tag v-else-if="scope.row.type === '4'" size="small" type="success">
                            看板
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="orderNum"
                    header-align="left"
                    align="left"
                    width="80"
                    :show-overflow-tooltip="true"
                    label="排序号"
                />
                <el-table-column
                    prop="url"
                    header-align="left"
                    align="left"
                    :show-overflow-tooltip="true"
                    label="菜单URL"
                />
                <el-table-column
                    prop="perms"
                    header-align="left"
                    align="left"
                    width="180"
                    :show-overflow-tooltip="true"
                    label="授权标识"
                />
                <el-table-column
                    fixed="right"
                    header-align="left"
                    align="left"
                    width="88"
                    label="操作"
                >
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('sys:menu:update')" style="padding: 0;" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">
                            修改
                        </el-button>
                        <el-button v-if="isAuth('sys:menu:delete')" style="padding: 0;" type="text" size="small" @click="deleteHandle(scope.row.menuId)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
    </div>
</template>

<script>
import TableTreeColumn from '@/views/components/table-tree-column';
import { treeDataTranslate } from '@/net/validate';
import AddOrUpdate from './MenuAdd';
import { MAIN_API, SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'MenuManage',
    components: {
        TableTreeColumn,
        AddOrUpdate
    },
    data() {
        return {
            addOrUpdateVisible: false,
            dataList: []
        };
    },
    computed: {
        mainClientHeight: {
            get() {
                return this.$store.state.common.mainClientHeight;
            }
        }
    },
    mounted() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.$http(`${MAIN_API.MENULIST_API}`, 'GET', {}).then(({ data }) => {
                this.dataList = treeDataTranslate(data, 'menuId');
                this.addOrUpdateVisible = false;
            });
        },
        // 新增 / 修改
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },
        // 删除
        deleteHandle(id) {
            this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$http(`${SYSTEMSETUP_API.MENUDEL_API}/${id}`, 'POST', {}).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.$successToast('操作成功');
                            this.getDataList();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                })
                .catch(() => {
                //    catch
                });
        }
    }
};
</script>

<style scoped></style>
