import {Toast} from 'vant'
class Utils{
    validForm(o){
        // 验证表单数据
        for (let key in o) {
            if(!o[key].reg.test(o[key].value)){
                Toast({
                    message:o[key].errorMsg,
                    duration:2000,
                    forbidClick:true
                })
                return false;
            }
            
        }
        // 表单验证通过
        return true;
    }
}
export const utils = new Utils()