// 查询企业的部门列表 (组织架构)
import request from "@/utils/request"

export function getDepartments() {
  return request({
    url:'/company/department'
  })
}


/** *
 *  根据 id 根据部门  接口是根据 restful的规则设计的
 *  同样的地址 不同的方法 执行不同的业务
 *   删除 delete  新增 post  修改 put 获取 get
 * **/
export function delDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method:'delete'
  })
}

