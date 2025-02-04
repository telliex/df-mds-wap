<template>
    <div>
        <org-view
            :title="'设备管理'"
            :right-tile="'设备信息'"
            :type="'table'"
            @treeNodeClick="getData"
            @getTreeSuccess="setDeptId"
        >
            <template slot="view" style="padding-top: 16px;">
                <div class="view-btn">
                    <el-input v-model="deviceNo" size="small" placeholder="设备编号/设备描述" suffix-icon="el-icon-search" style="width: 180px; margin-right: 16px;" />
                    <el-button v-if="isAuth('devQuery')" type="primary" size="small" @click="getData(false, true)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('devInsert')" type="primary" size="small" @click="addOrupdate()">
                        增加
                    </el-button>
                    <el-button v-if="isAuth('devDel')" type="danger" size="small" @click="remove()">
                        批量删除
                    </el-button>
                </div>
                <el-table ref="table1" class="newTable" border header-row-class-name="tableHead" :height="mainClientHeight - 52 - 155" :data="deviceList" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" fixed="left" />
                    <el-table-column type="index" :index="indexMethod" label="序号" width="55" fixed />
                    <el-table-column prop="deptName" width="120" :show-overflow-tooltip="true" label="所属部门" />
                    <el-table-column prop="deviceNo" width="120" :show-overflow-tooltip="true" label="设备编号" />
                    <el-table-column prop="deviceName" label="设备描述" :show-overflow-tooltip="true" />
                    <el-table-column fixed="right" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button v-if="isAuth('devEdit')" type="text" @click="addOrupdate(scope.row)">
                                编辑
                            </el-button>
                            <el-button v-if="isAuth('devCfg')" type="text" @click="setConfigDiglog(scope.row)">
                                {{ scope.row.deviceConfig === 'A' ? '取消配置' : '配置' }}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row>
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </template>
        </org-view>
        <el-dialog title="配置" width="400px" :close-on-click-modal="false" :visible.sync="configVisible">
            <div :class="{'limit-upload': ImageUrl}" style="text-align: center;">
                <el-upload ref="upload" class="org-img-upload" list-type="picture-card" :action="FILE_API" :limit="1" :http-request="httpRequest" :file-list="fileList" :on-success="addfile" :on-remove="removeFile" :on-preview="handlePictureCardPreview">
                    <em class="el-icon-plus" />
                </el-upload>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="configVisible = false">
                    取消
                </el-button>
                <el-button size="small" type="primary" @click="setConfig()">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" style="margin-bottom: 20px;">
        </el-dialog>
        <add-orupdate v-if="visible" ref="addOrupdate" @refreshDataList="getData()" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';
    import AddOrupdate from './DeviceAddorUpdate.vue';
    import axios from 'axios';

    @Component({
        components: {
            AddOrupdate
        }
    })
    export default class CapacityManage extends Vue {
        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        $refs: {
            addOrupdate: HTMLFormElement;
            upload: HTMLFormElement;
        };

        FILE_API = '';
        ImageUrl = '';
        configId = '';
        fileList = [];
        dialogVisible = false;
        dialogImageUrl = '';
        deptId = '';
        deptName = '';
        deviceNo = '';
        totalCount = 0;
        currPage = 1;
        pageSize = 10;
        configVisible = false;
        visible = false;
        deviceList: object[] = [];
        multipleSelection: string[] = [];

        setDeptId(data) {
            this.deptId = data[0].id
            this.deptName = data[0].deptName
        }

        getData(row = false, first = false) {
            if (!this.isAuth('devQuery')) {
                this.$warningToast('无权限');
                return false
            }
            if (row) {
                this.deptId = row['id'];
                this.deptName = row['deptName']
            }
            if (first) {
                this.currPage = 1;
            }
            COMMON_API.DEVICELIST_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: this.deptId,
                deviceNo: this.deviceNo,
                size: this.pageSize,
                current: this.currPage
            }).then(({ data }) => {
                this.multipleSelection = [];
                this.deviceList = data.data.records;
                this.currPage = data.data.current;
                this.pageSize = data.data.size;
                this.totalCount = data.data.total;
                if (data.data.records.length === 0) {
                    this.$infoToast('暂无任何内容');
                }
            })
        }

        // 添加和编辑
        addOrupdate(data) {
            if (this.deptId) {
                this.visible = true;

                this.$nextTick(() => {
                    this.$refs.addOrupdate.init(this.deptId, this.deptName, data);
                });
            } else {
                this.$warningToast('请先选择部门');
            }
        }

        // 删除
        remove() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请选择要删除的设备');
            } else {
                this.$confirm('确认删除设备, 是否继续?', '删除设备', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        COMMON_API.DEVICEDEL_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            ids: this.multipleSelection
                        }).then(({ data }) => {
                            if (data.code === 200) {
                                this.$successToast('删除成功!');
                                this.multipleSelection = [];
                                this.getData();
                            }
                        });
                    })
            }
        }

        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item.id);
            });
        }

        // 配置
        setConfigDiglog(row) {
            if (row.deviceConfig === 'A') {
                this.$confirm('确认取消配置, 是否继续?', '取消配置', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.setConfig({
                        id: row.id,
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deviceConfig: 'F',
                        deviceImg: ''
                    })
                })
            } else {
                this.configId = row.id;
                this.configVisible = true
                this.$nextTick(() => {
                    this.ImageUrl = '';
                    this.$refs.upload.clearFiles();
                })
            }
        }

        setConfig(row) {
            if (row) {
                COMMON_API.DEVICECONFIG_API(row).then(({ data }) => {
                    this.$successToast(data.msg)
                    this.getData()
                })
            } else {
                COMMON_API.DEVICECONFIG_API({
                    id: this.configId,
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    deviceConfig: 'A',
                    deviceImg: this.ImageUrl
                }).then(({ data }) => {
                    this.configVisible = false
                    this.$successToast(data.msg)
                    this.getData()
                })
            }
        }

        // 上传图片前
        httpRequest(options) {
            COMMON_API.UPLOADFILE_API({
                name: options.file.name
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.FILE_API = data.data.url
                    axios.put(data.data.url, options.file).then(res => {
                        if (res.status === 200) {
                            options.onSuccess(data.data.key, options);
                        }
                    })
                }
            });
        }

        // 上传图片后
        addfile(key) {
            this.ImageUrl = key
        }

        // 移出图片
        removeFile() {
            this.fileList = []
        }

        // 查看图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }

        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.currPage) - 1) * (Number(this.pageSize));
        }

        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.getData();
        }

        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.getData();
        }
    }
</script>

<style lang="scss" scoped>
    .view-btn {
        float: right;
        margin-bottom: 10px;
    }
    .limit-upload {
        ::v-deep .el-upload--picture-card {/* stylelint-disable-line */
            display: none;
        }
    }
</style>
