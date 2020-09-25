/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-27 14:28:27
 * @LastEditors: Telliex
 * @LastEditTime: 2020-09-14 16:53:39
 */
import httpProxy from 'utils/net/httpProxy';
const KOJI_API = {
    /**
     * @property {string} KOJI_STOCK_FLOUR_INDEX_LIST_ALL_API 麦粉库存-明细列表-所有
     */
    KOJI_STOCK_FLOUR_INDEX_LIST_ALL_API: params => httpProxy('/koji/kojiWheatStorage/queryAllDetailList', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_FLOUR_INDEX_LIST_API 麦粉库存-明细列表
     */
    KOJI_STOCK_FLOUR_INDEX_LIST_API: params => httpProxy('/koji/kojiWheatStorage/queryDetailList', 'GET', params),
    /**
    * @property {string} KOJI_STOCK_FLOUR_DETAIL_CUR_LIST_API 麦粉库存-当前详情-分页
    */
    KOJI_STOCK_FLOUR_DETAIL_CUR_LIST_API: params => httpProxy('/koji/kojiWheatStorage/queryPage/currentDetails', 'POST', params),
    /**
    * @property {string} KOJI_STOCK_FLOUR_DETAIL_HISTORY_LIST_API 麦粉库存-历史详情-分页
    */
    KOJI_STOCK_FLOUR_DETAIL_HISTORY_LIST_API: params => httpProxy('/koji/kojiWheatStorage/queryPage/historyDetails', 'POST', params),

    /**
     * @property {string} KOJI_STOCK_BEAN_INDEX_LIST_ALL_API 大豆库存-明细列表-所有
     */
    KOJI_STOCK_BEAN_INDEX_LIST_ALL_API: params => httpProxy('/koji/kojiBeanStorage/queryAllDetailList', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_BEAN_INDEX_LIST_API 大豆库存-明细列表
     */
    KOJI_STOCK_BEAN_INDEX_LIST_API: params => httpProxy('/koji/kojiBeanStorage/queryDetailList', 'GET', params),
    /**
    * @property {string} KOJI_STOCK_BEAN_DETAIL_CUR_LIST_API 大豆库存-当前详情-分页
    */
    KOJI_STOCK_BEAN_DETAIL_CUR_LIST_API: params => httpProxy('/koji/kojiBeanStorage/queryPage/currentDetails', 'POST', params),
    /**
    * @property {string} KOJI_STOCK_BEAN_DETAIL_HISTORY_LIST_API 大豆库存-历史详情-分页
    */
    KOJI_STOCK_BEAN_DETAIL_HISTORY_LIST_API: params => httpProxy('/koji/kojiBeanStorage/queryPage/historyDetails', 'POST', params),

    /**
     * @property {string} KOJI_STOCK_Y158_INDEX_LIST_ALL_API Y158菌库存-明细列表-所有
     */
    KOJI_STOCK_Y158_INDEX_LIST_ALL_API: params => httpProxy('/koji/kojiStrainStorage/queryAllDetailList', 'GET', params),
    /**
     * @property {string} KOJI_STOCK_Y158_INDEX_LIST_API Y158菌库存-明细列表
     */
    KOJI_STOCK_Y158_INDEX_LIST_API: params => httpProxy('/koji/kojiStrainStorage/queryDetailList', 'GET', params),
    /**
    * @property {string} KOJI_STOCK_Y158_DETAIL_CUR_LIST_API Y158菌库存-当前详情-分页
    */
    KOJI_STOCK_Y158_DETAIL_CUR_LIST_API: params => httpProxy('/koji/kojiStrainStorage/queryPage/currentDetails', 'POST', params),
    /**
    * @property {string} KOJI_STOCK_Y158_DETAIL_HISTORY_LIST_API Y158菌库存-历史详情-分页
    */
    KOJI_STOCK_Y158_DETAIL_HISTORY_LIST_API: params => httpProxy('/koji/kojiStrainStorage/queryPage/historyDetails', 'POST', params),

    /**
    * @property {string} KOJI_STOCK_Y158_DETAIL_ADJUST_API 执行调整
    */
    KOJI_STOCK_Y158_DETAIL_ADJUST_API: params => httpProxy('/koji/kojiStorageAdjust/adjust', 'POST', params),
    /**
    * @property {string} KOJI_STOCK_Y158_DETAIL_ADJUST_LIST_API 库存调整-分页查询
    */
    KOJI_STOCK_Y158_DETAIL_ADJUST_LIST_API: params => httpProxy('/koji/kojiStorageAdjust/queryPage', 'POST', params),

    /**
     * @property CRAFTSTANDARD_INSERT_API 制曲车间-制曲工艺-新增
     */
    CRAFTSTANDARD_INSERT_API: params => httpProxy('/koji/kojiCraftStandard/insert', 'POST', params),
    /**
     * @property CRAFTSTANDARD_UPDATE_API 制曲车间-制曲工艺-编辑
     */
    CRAFTSTANDARD_UPDATE_API: params => httpProxy('/koji/kojiCraftStandard/update', 'POST', params),
    /**
     * @property CRAFTSTANDARD_QUERY_API 制曲车间-制曲工艺-查询-分页
     */
    CRAFTSTANDARD_QUERY_API: params => httpProxy('/koji/kojiCraftStandard/queryPage', 'POST', params),
    /**
     * @property CRAFTSTANDARD_DELETE_API 制曲车间-制曲工艺-批量删除
     */
    CRAFTSTANDARD_DELETE_API: params => httpProxy('/koji/kojiCraftStandard/delete', 'POST', params),
    /**
     * @property WORKPROCEDURE_INSERT_API 制曲车间-报工工序-新增
     */
    WORKPROCEDURE_INSERT_API: params => httpProxy('/koji/kojiWorkProcedure/insert', 'POST', params),
    /**
     * @property WORKPROCEDURE_UPDATE_API 制曲车间-报工工序-编辑
     */
    WORKPROCEDURE_UPDATE_API: params => httpProxy('/koji/kojiWorkProcedure/update', 'POST', params),
    /**
     * @property WORKPROCEDURE_DELETE_API 制曲车间-报工工序-批量删除
     */
    WORKPROCEDURE_DELETE_API: params => httpProxy('/koji/kojiWorkProcedure/batchRemoveByIds', 'POST', params),
    /**
     * @property WORKPROCEDURE_QUERY_BY_WORKSHOPID_API 制曲车间-报工工序-查询报工中间表数据列表
     */
    WORKPROCEDURE_QUERY_BY_WORKSHOPID_API: params => httpProxy('/koji/kojiWorkProcedure/queryByWorkShopId', 'GET', params),
    /**
     * @property WORKPROCEDURE_QUERY_API 制曲车间-报工工序-根据高级查询条件查询报工中间表数据列表
     */
    WORKPROCEDURE_QUERY_API: params => httpProxy('/koji/kojiWorkProcedure/query', 'POST', params),

    /**
    * @property {string} KOJI_CRAFT_HEAD_INFO_QUERY_API 制曲车间-制曲头部信息查询
    */
    KOJI_CRAFT_HEAD_INFO_QUERY_API: params => httpProxy('/kojiProcess/wheat/getHouseSplite', 'GET', params),
    /**
    * @property {string} KOJI_SBEAN_SIEVE_QUERY_API 制曲车间-筛豆查询
    */
    KOJI_SBEAN_SIEVE_QUERY_API: params => httpProxy('/koji/kojiBeanSieve/query', 'POST', params),
    /**
    * @property {string} KOJI_SBEAN_WASH_QUERY_API 制曲车间-洗豆记录查询
    */
    KOJI_SBEAN_WASH_QUERY_API: params => httpProxy('/koji/kojiBeanWash/query', 'POST', params),
    /**
    * @property {string} KOJI_EXCEPTION_QUERY_API 制曲车间-查询异常记录
    */
    KOJI_EXCEPTION_QUERY_API: params => httpProxy('/koji/kojiException/query', 'POST', params),
    /**
    * @property {string} KOJI_TEXT_QUERY_API 制曲车间-文本记录查询
    */
    KOJI_TEXT_QUERY_API: params => httpProxy('/koji/kojiText/query', 'POST', params),
    /**
    * @property {string} KOJI_XD_SAVE_API 制曲车间-洗豆保存
    */
    KOJI_XD_SAVE_API: params => httpProxy('/koji/kojiBeanWash/info/save', 'POST', params),
    /**
    * @property {string} KOJI_XD_SUBMIT_API 制曲车间-洗豆提交
    */
    KOJI_XD_SUBMIT_API: params => httpProxy('/koji/kojiBeanWash/info/submit', 'POST', params),
    /**
    * @property {string} KOJI_MATERIAL_GET_QUERY_API 制曲车间-物料领用记录查询
    */
    KOJI_MATERIAL_GET_QUERY_API: params => httpProxy('/kojiMaterial/query', 'POST', params),
    /**
    * @property {string} KOJI_MATERIAL_DELETE_QUERY_API 制曲车间-物料领用删除
    */
    KOJI_MATERIAL_DELETE_QUERY_API: params => httpProxy('/kojiMaterial/delete', 'POST', params),
    /**
    * @property {string} KOJI_MATERIAL_GET_ADD_QUERY_API 制曲车间-新增物料领用
    */
    KOJI_MATERIAL_GET_ADD_QUERY_API: params => httpProxy('/kojiMaterial/insert', 'POST', params),
    /**
    * @property {string} KOJI_MATERIAL_GET_EDIT_QUERY_API 制曲车间-修改编辑物料领用
    */
    KOJI_MATERIAL_GET_EDIT_QUERY_API: params => httpProxy('/kojiMaterial/update', 'POST', params)

};

export default KOJI_API;
