// 系统管理相关实体类定义
// 预留Vue迁移注释：这些接口可以直接迁移为Vue项目中的TypeScript类型定义文件

export interface User {
  id: string;
  username: string;
  realName: string;
  department: string;
  position: string;
  phone: string;
  status: 'active' | 'inactive';
  createTime: string;
}

export interface Role {
  id: string;
  roleName: string;
  roleCode: string;
  description: string;
  status: 'active' | 'inactive';
  createTime: string;
}

export interface Position {
  id: string;
  positionName: string;
  positionCode: string;
  department: string;
  status: 'active' | 'inactive';
  createTime: string;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}
