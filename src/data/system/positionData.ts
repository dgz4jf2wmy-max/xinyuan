import { Position, PageResult } from '../../types/system';

// 模拟岗位数据源
export const mockPositions: Position[] = [
  { id: 'P001', positionName: '前端开发工程师', positionCode: 'FE_DEV', department: '技术部', status: 'active', createTime: '2026-01-01 00:00:00' },
  { id: 'P002', positionName: '后端开发工程师', positionCode: 'BE_DEV', department: '技术部', status: 'active', createTime: '2026-01-01 00:00:00' },
  { id: 'P003', positionName: '产品经理', positionCode: 'PM', department: '产品部', status: 'active', createTime: '2026-01-02 00:00:00' },
  { id: 'P004', positionName: 'UI设计师', positionCode: 'UI', department: '产品部', status: 'active', createTime: '2026-01-02 00:00:00' },
  { id: 'P005', positionName: '运营专员', positionCode: 'OP', department: '运营部', status: 'active', createTime: '2026-01-03 00:00:00' },
];

// 模拟获取岗位分页数据接口
export const getPositionPage = async (pageNum: number, pageSize: number, params?: Partial<Position>): Promise<PageResult<Position>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockPositions];
      
      if (params?.positionName) {
        filteredData = filteredData.filter(p => p.positionName.includes(params.positionName!));
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
