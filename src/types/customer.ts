export interface Customer {
  id: string;
  
  /** 所属组织: 字符, 例如"集团" */
  organization: string;
  
  /** 客户编码: 字符, 唯一 */
  customerCode: string;
  
  /** 客户名称: 字符 */
  customerName: string;
  
  /** 客户分类: 字符, 例如"烟草系统"或"非烟草系统" */
  customerCategory: '烟草系统' | '非烟草系统' | string;
}
