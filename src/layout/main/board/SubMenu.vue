<template>
    <div>
        <el-submenu v-for="(deptId, index) in workshop" :key="index" :index="deptId.deptId">
            <template slot="title">
                <div @click="goPage(deptId)">
                    <em :class="page.menuIcon || ''" class="site-sidebar__menu-icon iconfont" />
                    <span>{{ deptId.deptName.replace(/车间/g, '') }}</span>
                </div>
            </template>
            <menu-item :dept-id="deptId.deptId" :page="page.list[0]" />
        </el-submenu>
    </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
export default {
    name: 'SubMenu',
    components: {
        MenuItem: resolve => {
            require(['./MenuItem'], resolve);
        }
    },
    props: {
        page: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            factory: [],
            workshop: []
        };
    },
    inject: ['reload'],
    computed: {
        dataEchartDeptId: {
            get() {
                return this.$store.state.echarts.dataEchartDeptId;
            },
            set(val) {
                this.$store.commit('echarts/updateDataEchartDeptId', val);
            }
        },
        dataEchartDeptName: {
            get() {
                return this.$store.state.echarts.dataEchartDeptName;
            },
            set(val) {
                this.$store.commit('echarts/updateDataEchartDeptName', val);
            }
        },
        dynamicMenuRoutes: {
            get() {
                return this.$store.state.common.dynamicMenuRoutes;
            },
            set(val) {
                this.$store.commit('common/updateDynamicMenuRoutes', val);
            }
        },
        menuActiveName: {
            get() {
                return this.$store.state.common.menuActiveName;
            },
            set(val) {
                this.$store.commit('common/updateMenuActiveName', val);
            }
        }
    },
    mounted() {
        this.getFactory();
    },
    methods: {
        goPage(deptId) {
            const route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === this.page.id);
            if (route.length >= 1) {
                this.menuActiveName = deptId.deptId;
                this.dataEchartDeptId = deptId.deptId;
                this.dataEchartDeptName = deptId.deptName;
                this.$router.push({ path: route[0].path });
                this.reload();
            }
        },
        getFactory() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    for (const item of this.factory) {
                        console.log(item);
                        this.getWorkshop(item.deptId);
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        getWorkshop(id) {
            if (id) {
                this.$http(
                    `${BASICDATA_API.FINDORGBYID_API}`,
                    'POST',
                    {
                        deptId: id,
                        deptName: this.page.menuName.replace(/车间/g, '')
                    },
                    false,
                    false,
                    false
                ).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = this.workshop.concat(data.typeList);
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        }
    }
};
</script>

<style scoped></style>
