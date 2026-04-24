import { User, PageResult } from '../../types/system';

// 模拟用户数据源
// 预留Vue迁移注释：在Vue项目中，这里的数据可以替换为真实的API请求调用
export const mockUsers: User[] = Array.from({ length: 45 }).map((_, index) => ({
  id: `U${String(index + 1).padStart(4, '0')}`,
  username: `user${index + 1}`,
  realName: `测试用户${index + 1}`,
  department: index % 3 === 0 ? '技术部' : index % 3 === 1 ? '产品部' : '运营部',
  position: index % 2 === 0 ? '前端工程师' : '产品经理',
  phone: `13800138${String(index).padStart(3, '0')}`,
  status: index % 5 === 0 ? 'inactive' : 'active',
  createTime: `2026-04-${String((index % 30) + 1).padStart(2, '0')} 10:00:00`,
}));

// 模拟获取用户分页数据接口
export const getUserPage = async (pageNum: number, pageSize: number, params?: Partial<User>): Promise<PageResult<User>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockUsers];
      
      if (params?.username) {
        filteredData = filteredData.filter(u => u.username.includes(params.username!));
      }
      if (params?.realName) {
        filteredData = filteredData.filter(u => u.realName.includes(params.realName!));
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
