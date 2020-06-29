import httpProxy from 'utils/net/httpProxy';

const STE_API = {
    /**
     * @property {string} STE_HOME_LIST_API 杀菌车间首页
     */
    STE_HOME_LIST_API: params => httpProxy('/order/queryListPkg', 'POST', params),
    /**
     * @property {string} STE_HOME_LIST_API 杀菌车间-订单拆分
     */
    STE_SPLIT_LIST_API: params => httpProxy('/steOrderSplit/query', 'POST', params)
};

export default STE_API;
