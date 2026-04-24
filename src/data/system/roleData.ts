import { Role, PageResult } from '../../types/system';

// 模拟角色数据源
export const mockRoles: Role[] = [
  { id: 'R001', roleName: '超级管理员', roleCode: 'admin', description: '系统最高权限', status: 'active', createTime: '2026-01-01 00:00:00' },
  { id: 'R002', roleName: '部门经理', roleCode: 'dept_manager', description: '部门管理权限', status: 'active', createTime: '2026-01-02 00:00:00' },
  { id: 'R003', roleName: '普通员工', roleCode: 'employee', description: '基础业务权限', status: 'active', createTime: '2026-01-03 00:00:00' },
  { id: 'R004', roleName: '访客', roleCode: 'guest', description: '只读权限', status: 'inactive', createTime: '2026-01-04 00:00:00' },
];

// 模拟获取角色分页数据接口
export const getRolePage = async (pageNum: number, pageSize: number, params?: Partial<Role>): Promise<PageResult<Role>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockRoles];
      
      if (params?.roleName) {
        filteredData = filteredData.filter(r => r.roleName.includes(params.roleName!));
      }

      const start = (pageNum - 1) * pageSize;
      const end = start + pageSize;
      
      resolve({
        list: filteredData.slice(start, end),
        total: filteredData.length,
        pageNum,
        pageSize
      });
    }, 300);
  });
};
