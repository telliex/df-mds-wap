<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-27 16:48:29
 * @LastEditors: Telliex
 * @LastEditTime: 2020-08-27 19:26:24
-->
<template>
    <el-submenu v-if="!getChildren" :index="menu.id + ''" :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'">
        <template slot="title">
            <div @click="gotoRouteHandle(menu)">
                <em :class="menu.menuIcon || ''" class="site-sidebar__menu-icon iconfont" />
                <span>{{ menu.menuName }}</span>
            </div>
        </template>
        <template v-for="item in menu.list">
            <sub-menu v-if="item.menuType !== 'P'" :key="item.id" :menu="item" :dynamic-menu-routes="dynamicMenuRoutes" />
        </template>
    </el-submenu>
    <el-menu-item v-else-if="menu.menuType !== 'P'" :index="menu.id + ''" @click="gotoRouteHandle(menu)">
        <em :class="menu.menuIcon || ''" class="site-sidebar__menu-icon iconfont" />
        <span>{{ menu.menuName }}</span>
    </el-menu-item>
</template>

<script>
export default {
    name: 'MainLeftbarMenu',
    components: {
        SubMenu: resolve => {
            require(['./main_leftbar_menu'], resolve);
        }
    },
    props: {
        menu: {
            type: Object,
            required: true
        },
        dynamicMenuRoutes: {
            type: Array,
            required: true
        }
    },
    data() {
        return {};
    },
    computed: {
        sidebarLayoutSkin: {
            get() {
                return this.$store.state.common.sidebarLayoutSkin;
            }
        },
        getChildren: function() {
            let st = true;
            if (this.menu.list && this.menu.list.length >= 1) {
                st = true;
                this.menu.list.forEach(item => {
                    if (item.menuType !== 'P') {
                        st = false;
                    }
                });
            }
            return st;
        }
    },
    methods: {
        // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
        gotoRouteHandle(menu) {
            if (/^http[s]?:\/\/.*/.test(menu.menuUrl)) {
                window.location.href = menu.menuUrl + '&token=' + this.$cookie.get('token') + '&tenant=MDS'
                // window.open(menu.menuUrl + '&token=' + this.$cookie.get('token') + '&tenant=MDS')
            } else {
                const route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.id);
                if (route.length >= 1) {
                    this.$router.push({ path: route[0].path });
                }
            }
        }
    }
};
</script>

<style scoped></style>
