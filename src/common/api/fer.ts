/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-11-18 14:53:12
 * @LastEditors: Telliex
 * @LastEditTime: 2020-11-24 09:45:46
 */
import httpProxy from 'utils/net/httpProxy';

const FER_API = {
    /**
     * @property {string} FER_FERMENTOR_BATCH_QUERY_API 发酵车间-发酵罐管理-查询发酵罐信息(分页)
     */
    FER_FERMENTOR_BATCH_QUERY_API: params => httpProxy('/fer/fermentor/batchQuery', 'POST', params),
    /**
     * @property {string} FER_FERMENTOR_CLEAN_API 发酵车间-发酵罐管理-清洗
     */
    FER_FERMENTOR_CLEAN_API: params => httpProxy('/fer/fermentor/clean', 'POST', params),
    /**
     * @property {string} FER_FERMENTOR_CLEAR_API 发酵车间-发酵罐管理-清罐
     */
    FER_FERMENTOR_CLEAR_API: params => httpProxy('/fer/fermentor/clear', 'POST', params),
    /**
     * @property {string} FER_FERMENTOR_ID_QUERY_API 发酵车间-发酵罐管理-根据容器id查询发酵罐信息
     */
    FER_FERMENTOR_ID_QUERY_API: params => httpProxy('/fer/fermentor/queryById', 'GET', params),
    /**
     * @property {string} FER_FERMENTOR_CY_BATCH_QUERY_API 发酵车间-发酵罐管理-根据容器id查询CY记录列表
     */
    FER_FERMENTOR_CY_BATCH_QUERY_API: params => httpProxy('/fer/fermentorCy/batchQuery', 'GET', params),
    /**
     * @property {string} FER_FERMENTOR_CY_SAVE_API 发酵车间-发酵罐管理-保存CY记录
     */
    FER_FERMENTOR_CY_SAVE_API: params => httpProxy('/fer/fermentorCy/save', 'POST', params),
    /**
     * @property {string} FER_FERMENTOR_FLATION_BATCH_QUERY_API 发酵车间-发酵罐管理-根据容器id查询鼓罐记录列表
     */
    FER_FERMENTOR_FLATION_BATCH_QUERY_API: params => httpProxy('/fer/fermentorInflation/batchQuery', 'GET', params),
    /**
     * @property {string} FER_FERMENTOR_FLATION_SAVE_API 发酵车间-发酵罐管理-保存鼓罐记录
     */
    FER_FERMENTOR_FLATION_SAVE_API: params => httpProxy('/fer/fermentorInflation/save', 'POST', params),
    /**
     * @property {string} FER_FERMENTOR_LY_BATCH_QUERY_API 发酵车间-发酵罐管理-根据容器id查询LY记录列表
     */
    FER_FERMENTOR_LY_BATCH_QUERY_API: params => httpProxy('/fer/fermentorLy/batchQuery', 'GET', params),
    /**
     * @property {string} FER_FERMENTOR_LY_SAVE_API 发酵车间-发酵罐管理-保存LY记录
     */
    FER_FERMENTOR_LY_SAVE_API: params => httpProxy('/fer/fermentorLy/save', 'POST', params),
    // ==================== 盐水发料 ==================
    /**
     * @property {string} FER_BRINE_POT_LIST_API 发酵车间-盐水发料-分页查询-罐
     */
    FER_BRINE_POT_LIST_API: params => httpProxy('/fer/brineIssue/pagingQueryOfFermentor', 'POST', params),
    /**
     * @property {string} FER_BRINE_MATERIAL_API 发酵车间-盐水发料-查询盐水物料
     */
    FER_BRINE_MATERIAL_API: params => httpProxy('/fer/brineIssue/queryOfBrine', 'GET', params),
    /**
     * @property {string} FER_BRINE_OTHER_BOM_API 发酵车间-盐水发料-查询其他(Bom)物料
     */
    FER_BRINE_OTHER_BOM_API: params => httpProxy('/fer/brineIssue/queryOfBom', 'GET', params),
    /**
     * @property {string} FER_BRINE_SAVE_API 发酵车间-盐水发料-保存
     */
    FER_BRINE_SAVE_API: params => httpProxy('/fer/brineIssue/save', 'POST', params),
    /**
     * @property {string} FER_BRINE_SUBMIT_API 发酵车间-盐水发料-提交
     */
    FER_BRINE_SUBMIT_API: params => httpProxy('/fer/brineIssue/submit', 'POST', params),
    /**
     * @property {string} FER_BRINE_SUBMIT_API 发酵车间-盐水发料-虚拟物料下拉
     */
    FER_BRINE_VIRTUAL_MATERIAL_API: params => httpProxy('/fer/brineManage/dropDownOfVirtualMaterial', 'GET', params),
    /**
     * @property {string} FER_BRINE_SUBMIT_API 发酵车间-盐水发料-查询详情
     */
    FER_BRINE_QUERY_DETAIL_API: params => httpProxy('/fer/brineIssue/queryByFermentorId', 'GET', params),
    // ==================== 发料管理 ==================
    /**
     * @property {string} FER_MATERIAL_QUERY_API 发酵车间-发料管理-查询
     */
    FER_MATERIAL_QUERY_API: params => httpProxy('/fer/material/query', 'POST', params),
    /**
     * @property {string} FER_MATERIAL_SAVE_API 发酵车间-发料管理-保存
     */
    FER_MATERIAL_SAVE_API: params => httpProxy('/fer/material/save', 'POST', params),
    /**
     * @property {string} FER_MATERIAL_SUBMIT_API 发酵车间-发料管理-提交
     */
    FER_MATERIAL_SUBMIT_API: params => httpProxy('/fer/material/submit', 'POST', params),
    // ==================== 订单申请 ==================
    /**
     * @property {string} FER_ORDER_LIST_API 发酵车间-订单申请-分页列表查询
     */
    FER_ORDER_LIST_API: params => httpProxy('/fer/order/query/page', 'POST', params),
    /**
     * @property {string} FER_ORDER_SEND_API 发酵车间-订单申请-发送申请
     */
    FER_ORDER_SEND_API: params => httpProxy('/fer/order/send', 'POST', params),
    // ==================== 类别判定 ==================
    /**
     * @property {string} FER_CATEGORY_JUDGED_QUERY_API 发酵车间-类别判定-查询
     */
    FER_CATEGORY_JUDGED_QUERY_API: params => httpProxy('/fer/fermentor/judged/query', 'POST', params),
    /**
     * @property {string} FER_CATEGORY_JUDGED_API 发酵车间-类别判定-判定
     */
    FER_CATEGORY_JUDGED_API: params => httpProxy('/fer/fermentor/judged/judged', 'POST', params),
    // ==================== 入库管理 ==================
    /**
     * @property {string} FER_INSTORAGE_QUERY_API 发酵车间-入库管理-分页列表查询
     */
    FER_INSTORAGE_QUERY_API: params => httpProxy('/fer/inStorage/query', 'POST', params),
    /**
     * @property {string} FER_INSTORAGE_SAVE_API 发酵车间-入库管理-保存
     */
    FER_INSTORAGE_SAVE_API: params => httpProxy('/fer/inStorage/save', 'POST', params),
    /**
     * @property {string} FER_INSTORAGE_SUBMIT_API 发酵车间-入库管理-提交
     */
    FER_INSTORAGE_SUBMIT_API: params => httpProxy('/fer/inStorage/submit', 'POST', params),
    // ==================== 工时录入 ==================
    /**
     * @property {string} FER_TIME_SHEET_QUERY_API 发酵车间-准备工时-查询
     */
    FER_TIME_SHEET_QUERY_API: params => httpProxy('/fer/ferTimeSheet/query', 'POST', params),
    /**
     * @property {string} FER_TIME_SHEET_SAVE_API 发酵车间-准备工时-保存
     */
    FER_TIME_SHEET_SAVE_API: params => httpProxy('/fer/ferTimeSheet/save', 'POST', params),
    /**
     * @property {string} FER_TIME_SHEET_SUBMIT_API 发酵车间-准备工时-提交
     */
    FER_TIME_SHEET_SUBMIT_API: params => httpProxy('/fer/ferTimeSheet/submit', 'POST', params),
    /**
     * @property {string} FER_USER_QUERY_API 发酵车间-准备工时-人员列表-查询
     */
    FER_USER_QUERY_API: params => httpProxy('/fer/user/query', 'POST', params),
    // ==================== 报工管理 ==================
    /**
     * @property {string} FER_JOB_BOOKING_QUERY_API 发酵车间-报工管理-报工信息分页查询
     */
    FER_JOB_BOOKING_QUERY_API: params => httpProxy('/fer/jobBooking/pageQuery', 'POST', params),
    /**
     * @property {string} FER_JOB_BOOKING_CALCULATE_API 发酵车间-报工管理-报工信息根据执行结束时间计算工时
     */
    FER_JOB_BOOKING_CALCULATE_API: params => httpProxy('/fer/jobBooking/calculate', 'POST', params),
    /**
     * @property {string} FER_JOB_BOOKING_DELETE_API 发酵车间-报工管理-报工信息提交
     */
    FER_JOB_BOOKING_DELETE_API: params => httpProxy('/fer/jobBooking/delete', 'GET', params),
    /**
     * @property {string} FER_JOB_BOOKING_PRODUCE_API 发酵车间-报工管理-报工信息重新生成
     */
    FER_JOB_BOOKING_PRODUCE_API: params => httpProxy('/fer/jobBooking/produce', 'POST', params),
    /**
     * @property {string} FER_JOB_BOOKING_SAVE_API 发酵车间-报工管理-报工信息保存
     */
    FER_JOB_BOOKING_SAVE_API: params => httpProxy('/fer/jobBooking/save', 'POST', params),
    /**
     * @property {string} FER_JOB_BOOKING_SUBMIT_API 发酵车间-报工管理-报工信息提交
     */
    FER_JOB_BOOKING_SUBMIT_API: params => httpProxy('/fer/jobBooking/submit', 'POST', params)
};

export default FER_API;
