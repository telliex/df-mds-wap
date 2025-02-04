import httpProxy from 'utils/net/httpProxy';

const COMMON_API = {
    /**
     * @property {string} LOGIN_API 登录接口
     */
    LOGIN_API: params => httpProxy('/sysUser/login', 'POST', params),
    /**
     * @property {string} TOKEN_RULE_API 校验token
     */
    TOKEN_RULE_API: params => httpProxy('/sysUser/login', 'POST', params, 'SYS'),
    /**
     * @property {string} TOKEN_RULE_API 校验token
     */
    TEST_API: params => httpProxy('/sysDept/dropDown?factory=common', 'GET', params, 'SYS'),
    /**
     * @property {string} UPPASS_API 修改密码
     */
    UPPASS_API: params => httpProxy('/sysUser/password/update', 'POST', params),
    /**
     * @property {string} UPPASS_API 退出登录
     */
    LOGOUT_API: params => httpProxy('/sysUser/quit', 'GET', params),
    /**
     * @property {string} SET_FACTORY_API 默认工厂 factoryCode
     */
    SET_FACTORY_API: params => httpProxy('/sysUser/defaultFactory/update', 'GET', params),
    /**
     * @property {string} SET_FACTORY_API 选择工厂 factoryCode
     */
    UPDATE_FACTORY_API: params => httpProxy('/sysUser/factory/update', 'GET', params),
    /**
     * @property {string} NAV_API 路由获取菜单
     */
    NAV_API: params => httpProxy('/sysUser/userRole/menuQuery', 'GET', params),
    /**
     * @property {string} MENULIST_API 菜单管理全列表
     */
    MENULIST_API: params => httpProxy('/sysMenu/query', 'GET', params),
    /**
     * @property {string} MENUSELECT_API 菜单管理无按钮列表
     */
    MENUSELECT_API: params => httpProxy('/sysMenu/selectMenu', 'GET', params),
    /**
     * @property {string} ROLEGETMENU_API 根据角色id查功能
     */
    ROLEGETMENU_API: params => httpProxy('/sysMenu/selectByRole', 'GET', params),
    /**
     * @property {string} MENUADD_API 菜单管理新增
     */
    MENUADD_API: params => httpProxy('/sysMenu/insert', 'POST', params),
    /**
     * @property {string} MENUUPDATE_API 菜单管理修改
     */
    MENUUPDATE_API: params => httpProxy('/sysMenu/update', 'POST', params),
    /**
     * @property {string} MENUDEL_API 菜单管理删除
     */
    MENUDEL_API: params => httpProxy('/sysMenu/remove', 'GET', params),
    /**
     * @property {string} USER_BATCH_QUERY_API 系统管理-人员管理-批量查询
     */
    USER_BATCH_QUERY_API: params => httpProxy('/sysUser/batchQueryById', 'POST', params),
    /**
     * @property {string} USER_DELETE_API 系统管理-人员管理-批量删除
     */
    USER_DELETE_API: params => httpProxy('/sysUser/delete', 'POST', params),
    /**
     * @property {string} USER_DROPDOWN_API 系统管理-人员管理-下拉列表
     */
    USER_DROPDOWN_API: params => httpProxy('/sysUser/dropDown', 'POST', params),
    /**
     * @property {string} USER_INSERT_API 系统管理-人员管理-新增
     */
    USER_INSERT_API: params => httpProxy('/sysUser/insert', 'POST', params),
    /**
     * @property {string} USER_LOGIN_API 系统管理-人员管理-登录 repeat
     */
    USER_LOGIN_API: params => httpProxy('/sysUser/login', 'POST', params),
    /**
     * @property {string} USER_PASSWORD_RESET_API 系统管理-用户管理-重置密码
     */
    USER_PASSWORD_RESET_API: params => httpProxy('/sysUser/password/reset', 'GET', params),
    /**
     * @property {string} USER_PASSWORD_UPDATE_API 系统管理-用户管理-修改密码 repeat
     */
    USER_PASSWORD_UPDATE_API: params => httpProxy('/sysUser/password/update', 'GET', params),
    /**
     * @property {string} USER_QUERY_API 系统管理-人员管理-列表
     */
    USER_QUERY_API: params => httpProxy('/sysUser/query', 'POST', params),
    /**
     * @property {string} USER_QUIT_API 系统管理-人员管理-退出 repeat
     */
    USER_QUIT_API: params => httpProxy('/sysUser/quit', 'GET', params),
    /**
     * @property {string} USER_UPDATE_API 系统管理-人员管理-修改
     */
    USER_UPDATE_API: params => httpProxy('/sysUser/update', 'POST', params),
    /**
     * @property {string} USER_ROLE_MENU_QUERY_API 系统管理-用户管理-查询 repeat
     */
    USER_ROLE_MENU_QUERY_API: params => httpProxy('/sysUser/userRole/menuQuery', 'POST', params),
    /**
     * @property {string} USER_ROLE_QUERY_API 系统管理-用户管理-查询
     */
    USER_ROLE_QUERY_API: params => httpProxy('/sysUser/userRole/query', 'POST', params),
    /**
     * @property {string} USER_ROLE_ALL_QUERY_API 系统管理-用户管理-查询 不带分页
     */
    USER_ROLE_ALL_QUERY_API: params => httpProxy('/sysUser/userRole/all/query', 'POST', params),
    /**
     * @property {string} USER_ROLE_DROPDOWN_API 系统管理-用户管理-角色下拉
     */
    USER_ROLE_DROPDOWN_API: params => httpProxy('/sysRole/dropDown', 'POST', params),
    /**
     * @property {string} USER_ROLE_UPDATA_API 系统管理-用户管理-分配角色
     */
    USER_ROLE_UPDATA_API: params => httpProxy('/sysUserRole/userRole/insert', 'POST', params),
    /**
     * @property {string} ROLE_REMOVE_API 系统管理-角色管理-删除角色
     */
    ROLE_REMOVE_API: params => httpProxy('/sysRole/remove', 'GET', params),
    /**
     * @property {string} ROLE_INSERT_API 系统管理-角色管理-新增
     */
    ROLE_INSERT_API: params => httpProxy('/sysRole/insert', 'POST', params),
    /**
     * @property {string} ROLE_UPDATE_API 系统管理-角色管理-编辑
     */
    ROLE_UPDATE_API: params => httpProxy('/sysRole/update', 'POST', params),
    /**
     * @property {string} ROLE_QUERY_API 系统管理-角色管理-列表
     */
    ROLE_QUERY_API: params => httpProxy('/sysRole/query', 'POST', params),
    /**
     * @property {string} ROLE_ALLOT_INSERT_API 系统管理-角色管理-部门分配
     */
    ROLE_ALLOT_INSERT_API: params => httpProxy('/sysRoleDept/insert', 'POST', params),
    /**
     * @property {string} ROLE_ALLOT_INSERT_API 系统管理-角色管理-查询部门分配
     */
    ROLE_ALLOT_QUERY_API: params => httpProxy('/sysRoleDept/roleDeptList', 'POST', params),
    /**
     * @property {string} ROLE_MENU_INSERT_API 系统管理-角色管理-分配功能
     */
    ROLE_MENU_INSERT_API: params => httpProxy('/sysRoleMenu/insert', 'POST', params),
    /**
     * @property {string} ROLE_MENU_QUERY_API 系统管理-角色管理-查询菜单分配
     */
    ROLE_MENU_QUERY_API: params => httpProxy('/sysRoleMenu/roleMenuList', 'POST', params),
    /**
     * @property {string} ROLE_USER_INSERT_API 系统管理-角色管理-分配人员
     */
    ROLE_USER_INSERT_API: params => httpProxy('/sysUserRole/insert', 'POST', params),
    /**
     * @property {string} ROLE_USER_LIST_API 系统管理-角色管理-获取人员列表
     */
    ROLE_USER_LIST_API: params => httpProxy('/sysUserRole/roleUserList', 'POST', params),
    /**
     * @property {string} ORGSTRUCTURE_API 组织架构树形列表
     */
    ORGSTRUCTURE_API: params => httpProxy('/sysDept/dropDown', 'GET', params),
    /**
     * @property {string} ORGSTRUCTURE_API 组织架构树形 - 下拉
     */
    ORGSTRUCTURE_ALL_API: params => httpProxy('/sysDept/all/dropDown', 'GET', params),
    /**
     * @property {string} ADDORG_API 组织架构新增
     */
    ADDORG_API: params => httpProxy('/sysDept/insert', 'POST', params),
    /**
     * @property {string} DELETEORG_API 组织架构删除
     */
    DELETEORG_API: params => httpProxy('/sysDept/remove', 'GET', params),
    /**
     * @property {string} UPDATEORG_API 组织架构修改
     */
    UPDATEORG_API: params => httpProxy('/sysDept/update', 'POST', params),
    /**
     * @property {string} ORGDETAIL_API 组织架构详情
     */
    ORGDETAIL_API: params => httpProxy('/sysDept/query', 'GET', params),
    /**
     * @property {string} ORG_QUERY_WORKSHOP_API 基础数据-组织架构-按工厂和类型查询组织机构
     * params deptType: list<string> factory:
     */
    ORG_QUERY_WORKSHOP_API: params => httpProxy('/sysDept/getTypeDept', 'POST', params),
    /**
     * @property {string} ORG_QUERY_CHILDREN_API 基础数据-组织架构-按id查询下一级
     * param parentId
     */
    ORG_QUERY_CHILDREN_API: params => httpProxy('/sysDept/childList', 'GET', params),
    /**
     * @property {string} DICTQUERY_API 数据字典根据类型获取详情
     */
    DICTQUERY_API: params => httpProxy('/sysDictItem/dropDown', 'GET', params),
    /**
     * @property {string} HOLDER_DROPDOWN_API 基础数据-容器管理-下拉列表查询
     */
    HOLDER_DROPDOWN_API: params => httpProxy('/sysHolder/dropDown', 'POST', params),
    /**
     * @property {string} HOLDER_DROPDOWN_BY_STATUS_API 基础数据-容器管理-下拉列表查询
     */
    HOLDER_DROPDOWN_BY_STATUS_API: params => httpProxy('/sysHolder/byManyStatus/dropDown', 'POST', params),
    /**
     * @property {string} HOLDER_INSERT_API 基础数据-容器管理-保存容器
     */
    HOLDER_INSERT_API: params => httpProxy('/sysHolder/insert', 'POST', params),
    /**
     * @property {string} HOLDER_QUERY_API 基础数据-容器管理-分页查询
     */
    HOLDER_QUERY_API: params => httpProxy('/sysHolder/query', 'POST', params),
    /**
     * @property {string} HOLDER_QUERY_BY_NOPAGE_API 基础数据-容器管理-不分页查询
     */
    HOLDER_QUERY_BY_NOPAGE_API: params => httpProxy('/sysHolder/list/query', 'POST', params),
    /**
     * @property {string} HOLDER_ID_QUERY_API 基础数据-容器管理-按ID查询容器
     */
    HOLDER_ID_QUERY_API: params => httpProxy('/sysHolder/queryById', 'GET', params),
    /**
     * @property {string} HOLDER_REMOVE_API 基础数据-容器管理-按ID删除容器信息（可批量）
     */
    HOLDER_REMOVE_API: params => httpProxy('/sysHolder/remove', 'POST', params),
    /**
     * @property {string} HOLDER_UPDATE_API 基础数据-容器管理-修改容器
     */
    HOLDER_UPDATE_API: params => httpProxy('/sysHolder/update', 'POST', params),
    /**
     * @property {string} UPLOADFILE_API 上传文件
     */
    APPSAVE_API: params => httpProxy('/sysApp/save', 'POST', params),
    /**
     * @property {string} UPLOADFILE_API 上传文件
     */
    UPLOADFILE_API: params => httpProxy('/sysFile/upload', 'GET', params),
    /**
     * @property {string} UPLOADFILE_API 上传文件
     */
    APP_VERSION_API: params => httpProxy('/sysApp/getLastedVersion', 'GET', params),
    /**
     * @property {string} UPLOADFILE_API 上传APK
     */
    UPLOADAPK_API: params => httpProxy('/sysApp/getUploadUrl', 'GET', params),
    /**
     * @property {string} DOWNLOADFILE_API 下载文件
     */
    DOWNLOADFILE_API: params => httpProxy('/sysFile/download', 'GET', params),
    /**
     * @property {string} CAPACITYLIST_API 产能管理列表
     */
    CAPACITYLIST_API: params => httpProxy('/sysCapacity/query', 'POST', params),
    /**
     * @property {string} CAPACITYDEL_API 产能管理删除
     */
    CAPACITYDEL_API: params => httpProxy('/sysCapacity/delete', 'POST', params),
    /**
     * @property {string} CAPACITYADD_API 产能管理新增
     */
    CAPACITYADD_API: params => httpProxy('/sysCapacity/insert', 'POST', params),
    /**
     * @property {string} CAPACITYUPDATA_API 产能管理修改
     */
    CAPACITYUPDATA_API: params => httpProxy('/sysCapacity/update', 'POST', params),
    /**
     * @property {string} DEVICELIST_API 设备管理列表
     */
    DEVICELIST_API: params => httpProxy('/sysDevice/query', 'POST', params),
    /**
     * @property {string} DEVICE_LISTBYTYPE_API 设备管理列表 - 不翻页
     */
    DEVICE_LISTBYTYPE_API: params => httpProxy('/sysDevice/listByType', 'POST', params),
    /**
     * @property {string} DEVICEADD_API 设备管理新增
     */
    DEVICEADD_API: params => httpProxy('/sysDevice/insert', 'POST', params),
    /**
     * @property {string} DEVICECONFIG_API 设备管理配置
     */
    DEVICECONFIG_API: params => httpProxy('/sysDevice/updateStatus', 'POST', params),
    /**
     * @property {string} DEVICEUPDATA_API 设备管理修改
     */
    DEVICEUPDATA_API: params => httpProxy('/sysDevice/update', 'POST', params),
    /**
     * @property {string} DEVICEDEL_API 设备管理删除
     */
    DEVICEDEL_API: params => httpProxy('/sysDevice/remove', 'POST', params),
    /**
     * @property {string} ALLMATERIAL_API 物料管理拿全部物料 模糊查询
     */
    ALLMATERIAL_API: params => httpProxy('/sysMaterial/dropDown', 'POST', params, 'MDS', false),
    /**
     * @property {string} 根据编码查物料
     */
    SEARCH_MATERIAL_API: params => httpProxy('/sysMaterial/queryListByType', 'POST', params, 'MDS'),
    /**
     * @property {string} SPECS_DROPDOWN_API 基础数据--规格管理-下拉列表
     */
    SPECS_DROPDOWN_API: params => httpProxy('/sysSpecs/dropDown', 'POST', params),
    /**
     * @property {string} SPECS_INSERT_API 基础数据--规格管理-新增
     */
    SPECS_INSERT_API: params => httpProxy('/sysSpecs/insert', 'POST', params),
    /**
     * @property {string} SPECS_QUERY_API 基础数据--规格管理-列表
     */
    SPECS_QUERY_API: params => httpProxy('/sysSpecs/query', 'POST', params),
    /**
     * @property {string} SPECS_QUERY_BY_ID_API 基础数据--规格管理-详情
     */
    SPECS_QUERY_BY_ID_API: params => httpProxy('/sysSpecs/queryById', 'GET', params),
    /**
     * @property {string} SPECS_REMOVE_API 基础数据--规格管理-删除
     */
    SPECS_REMOVE_API: params => httpProxy('/sysSpecs/remove', 'POST', params),
    /**
     * @property {string} SPECS_UPDATE_API 基础数据--规格管理-修改
     */
    SPECS_UPDATE_API: params => httpProxy('/sysSpecs/update', 'POST', params),
    /**
     * @property {string} STORAGE_INSERT_API 基础数据--库位管理-新增
     */
    STORAGE_INSERT_API: params => httpProxy('/sysStorage/insert', 'POST', params),
    /**
     * @property {string} STORAGE_UPDATE_API 基础数据--库位管理-编辑
     */
    STORAGE_UPDATE_API: params => httpProxy('/sysStorage/update', 'POST', params),
    /**
     * @property {string} STORAGE_REMOVE_API 基础数据--库位管理-删除
     */
    STORAGE_REMOVE_API: params => httpProxy('/sysStorage/remove', 'POST', params),
    /**
     * @property {string} STORAGE_QUERY_API 基础数据--库位管理-查询
     */
    STORAGE_QUERY_API: params => httpProxy('/sysStorage/query', 'POST', params),
    /**
     * @property {string} METERIAL_DROPDOWN_API 基础数据-物料管理-查询指定工厂的全部物料
     */
    METERIAL_DROPDOWN_API: params => httpProxy('/sysMaterial/dropDown', 'GET', params),
    /**
     * @property {string} METERIAL_QUERY_API 基础数据-物料管理-分页获取物料
     */
    METERIAL_QUERY_API: params => httpProxy('/sysMaterial/query', 'POST', params),
    // /**
    //  * @property {string} METERIAL_SYNC_API 基础数据-物料管理-同步信息
    //  */
    // METERIAL_SYNC_API: params => httpProxy('/sysMaterial/sync', 'POST', params),
    /**
     * @property {string} METERIAL_ITEM_QUERY_API 基础数据-物料管理-根据ID查询物料明细
     */
    METERIAL_ITEM_QUERY_API: params => httpProxy('/sysMaterialItem/query', 'POST', params),
    /**
     * @property {string} ROWMETERIAL_QUERY_API 基础数据-原材料入库记录-查询列表
     */
    ROWMETERIAL_QUERY_API: params => httpProxy('/sysRowMaterial/query', 'POST', params),
    /**
     * @property {string} ROWMETERIAL_SYNC_API 基础数据-原料入库记录-同步信息
     */
    ROWMETERIAL_SYNC_API: params => httpProxy('/rawMaterial/sync', 'GET', params, 'JOB'),
    /**
     * @property {string} DICTIONARY_DELETE_API 系统管理-数据字典-主表删除
     */
    DICTIONARY_DELETE_API: params => httpProxy('/sysDict/delete', 'POST', params),
    /**
     * @property {string} DICTIONARY_DROPDOWN_API 系统管理-数据字典-主表下拉
     */
    DICTIONARY_DROPDOWN_API: params => httpProxy('/sysDict/dropDown', 'GET', params),
    /**
     * @property {string} DICTIONARY_INSERT_API 系统管理-数据字典-主表新增
     */
    DICTIONARY_INSERT_API: params => httpProxy('/sysDict/insert', 'POST', params),
    /**
     * @property {string} DICTIONARY_QUERY_AP 系统管理-数据字典-主表列表
     */
    DICTIONARY_QUERY_API: params => httpProxy('/sysDict/query', 'POST', params),
    /**
     * @property {string} DICTIONARY_UPDATE_API 系统管理-数据字典-主表修改
     */
    DICTIONARY_UPDATE_API: params => httpProxy('/sysDict/update', 'POST', params),
    /**
     * @property {string} DICTIONARY_ITEM_DELETE_API 系统管理-数据字典-删除
     */
    DICTIONARY_ITEM_DELETE_API: params => httpProxy('/sysDictItem/delete', 'POST', params),
    /**
     * @property {string} DICTIONARY_ITEM_DROPDOWN_API 系统管理-数据字典-下拉
     */
    DICTIONARY_ITEM_DROPDOWN_API: params => httpProxy('/sysDictItem/dropDown', 'GET', params),
    /**
     * @property {string} DICTIONARY_ITEM_DROPDOWN_POST_API 系统管理-数据字典-post下拉
     */
    DICTIONARY_ITEM_DROPDOWN_POST_API: params => httpProxy('/sysDictItem/dropDown', 'POST', params),
    /**
     * @property {string} DICTIONARY_ITEM_INSERT_API 系统管理-数据字典-新增
     */
    DICTIONARY_ITEM_INSERT_API: params => httpProxy('/sysDictItem/insert', 'POST', params),
    /**
     * @property {string} DICTIONARY_ITEM_QUERY_API 系统管理-数据字典-列表
     */
    DICTIONARY_ITEM_QUERY_API: params => httpProxy('/sysDictItem/query', 'POST', params),
    /**
     * @property {string} DICTIONARY_ITEM_UPDATE_API 系统管理-数据字典-修改
     */
    DICTIONARY_ITEM_UPDATE_API: params => httpProxy('/sysDictItem/update', 'POST', params),
    /**
     * @property {string} ORDER_QUERY_API 计划管理--计划订单-查询
     */
    ORDER_QUERY_API: params => httpProxy('/order/query', 'POST', params),
    /**
     * @property {string} ORDER_LIST_QUERY_API
     */
    ORDER_LIST_QUERY_API: params => httpProxy('/order/list/query', 'POST', params),
    // /**
    //  * @property {string} OREDER_SYNC_API 计划管理--计划订单-订单同步（增量）
    //  */
    // OREDER_SYNC_API: params => httpProxy('/order/sync', 'POST', params),
    /**
     * @property {string} OREDER_QUERY_BY_NO_API 根据订单号查询
     */
    OREDER_QUERY_BY_NO_API: params => httpProxy('/order/queryByNo', 'GET', params),
    /**
     * @property {string} OREDER_SYNC_API 字典表班次下拉
     */
    DICTQUERY_CLASSLIST_API: params => httpProxy('/sysDictItem/classes/dropDown', 'GET', params),
    /**
     * @property {string} 根据工厂和父级名称模糊查询指定类型的子级
     */
    SYS_CHILDTYPE_API: params => httpProxy('/sysDept/childType', 'POST', params),
    /**
     * @property {string} 辅料前处理 - 新增
     */
    PRE_MATERIAL_INSERT_API: params => httpProxy('/ste/stePreAccessories/insert', 'POST', params),
    /**
     * @property {string} 辅料前处理 - 修改
     */
    PRE_MATERIAL_UPDATE_API: params => httpProxy('/ste/stePreAccessories/update', 'POST', params),
    /**
     * @property {string} 辅料前处理 - 查询
     */
    PRE_MATERIAL_LIST_API: params => httpProxy('/ste/stePreAccessories/query', 'POST', params),
    /**
     * @property {string} 辅料前处理 - 删除
     */
    PRE_MATERIAL_REMOVE_API: params => httpProxy('/ste/stePreAccessories/remove', 'POST', params),
    /**
     * @property {string} 特殊辅料属性 - 新增
     */
    SPECIAL_MATERIAL_INSERT_API: params => httpProxy('/ste/steSpeAccessories/insert', 'POST', params),
    /**
     * @property {string} 特殊辅料属性 - 修改
     */
    SPECIAL_MATERIAL_UPDATE_API: params => httpProxy('/ste/steSpeAccessories/update', 'POST', params),
    /**
     * @property {string} 特殊辅料属性 - 查询
     */
    SPECIAL_MATERIAL_LIST_API: params => httpProxy('/ste/steSpeAccessories/query', 'POST', params),
    /**
     * @property {string} 特殊辅料属性 - 删除
     */
    SPECIAL_MATERIAL_REMOVE_API: params => httpProxy('/ste/steSpeAccessories/remove', 'POST', params),
    /**
     * @property {string} DROPDOWN_UNIT_API 根据物料获取单位
     */
    DROPDOWN_UNIT_API: params => httpProxy('/sysMaterial/unit/dropDown', 'GET', params),
    /**
     * @property {string} DROPDOWN_UNIT_API 基础数据-订单管理-列表查询（非分页）
     */
    ORDER_LIST_API: params => httpProxy('/order/list/query', 'POST', params),
    /**
     * @property {string} CHECKWORK_QUERY_API 考勤管理-查询
     */
    CHECKWORK_QUERY_API: params => httpProxy('/checkWork/query', 'POST', params),
    /**
     * @property {string} CHECKWORK_SAVE_API 考勤管理-保存
     */
    CHECKWORK_SAVE_API: params => httpProxy('/checkWork/save', 'POST', params),
    /**
     * @property {string} CHECKWORK_SUBMIT_API 考勤管理-submit
     */
    CHECKWORK_SUBMIT_API: params => httpProxy('/checkWork/submit', 'POST', params),
    /**
     * @property {string} CHECKWORK_REJECT_API 考勤管理- reject
     */
    CHECKWORK_REJECT_API: params => httpProxy('/v1/checkWork/withdraw', 'POST', params),
    /**
     * @property {string} INLIST_API 订单号查询审核日志  orderNo
     */
    COMMON_LOG_LIST_API: params => httpProxy('/verifyRecord/queryByNo', 'GET', params)
};

export default COMMON_API;
