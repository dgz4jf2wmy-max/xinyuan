import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Pagination } from '../../../components/ui/pagination';
import { Modal } from '../../../components/ui/modal';
import { Search, RotateCcw, Plus, Edit, Trash2, Download, ChevronDown } from 'lucide-react';
import { Position } from '../../../types/system';
import { getPositionPage } from '../../../data/system/positionData';

export default function PositionManagement() {
  const [data, setData] = useState<Position[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [queryParams, setQueryParams] = useState({
    positionName: '',
    pageNum: 1,
    pageSize: 10,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentPosition, setCurrentPosition] = useState<Partial<Position>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getPositionPage(queryParams.pageNum, queryParams.pageSize, {
        positionName: queryParams.positionName,
      });
      setData(res.list);
      setTotal(res.total);
    } catch (error) {
      console.error('获取岗位列表失败', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [queryParams.pageNum, queryParams.pageSize]);

  const handleSearch = () => {
    setQueryParams(prev => ({ ...prev, pageNum: 1 }));
    fetchData();
  };

  const handleReset = () => {
    setQueryParams({
      positionName: '',
      pageNum: 1,
      pageSize: 10,
    });
    setTimeout(fetchData, 0);
  };

  const handleAdd = () => {
    setModalType('add');
    setCurrentPosition({});
    setIsModalOpen(true);
  };

  const handleEdit = (position: Position) => {
    setModalType('edit');
    setCurrentPosition(position);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    console.log('删除岗位', id);
    alert('模拟删除成功');
    fetchData();
  };

  const handleSave = () => {
    console.log('保存岗位数据', currentPosition);
    setIsModalOpen(false);
    fetchData();
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-wrap gap-4 items-center bg-white p-4">
        <div className="w-48">
          <Input 
            placeholder="岗位名称" 
            value={queryParams.positionName}
            onChange={e => setQueryParams({...queryParams, positionName: e.target.value})}
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="primary" onClick={handleSearch}>
            <Search className="w-3.5 h-3.5 mr-1" /> 查询
          </Button>
          <Button variant="primary" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-white p-4 flex flex-col overflow-hidden">
        <div className="flex justify-end gap-2 mb-4">
          <Button variant="primary" onClick={handleAdd}>
            <Plus className="w-3.5 h-3.5 mr-1" /> 新增
          </Button>
          <Button variant="primary">
            <Edit className="w-3.5 h-3.5 mr-1" /> 编辑
          </Button>
          <Button variant="danger">
            <Trash2 className="w-3.5 h-3.5 mr-1" /> 删除
          </Button>
          <Button variant="primary">
            <Download className="w-3.5 h-3.5 mr-1" /> 导出 <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableHead>
              <TableHead>岗位编号</TableHead>
              <TableHead>岗位名称</TableHead>
              <TableHead>岗位编码</TableHead>
              <TableHead>所属部门</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-gray-500">加载中...</TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-gray-500">暂无数据</TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-center">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.positionName}</TableCell>
                  <TableCell>{row.positionCode}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${row.status === 'active' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                      {row.status === 'active' ? '正常' : '停用'}
                    </span>
                  </TableCell>
                  <TableCell>{row.createTime}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleEdit(row)} className="text-[#1890ff] hover:text-blue-700 text-sm flex items-center">
                        <Edit className="w-3 h-3 mr-1" /> 编辑
                      </button>
                      <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:text-red-700 text-sm flex items-center">
                        <Trash2 className="w-3 h-3 mr-1" /> 删除
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <div className="mt-4 pt-2">
          <Pagination 
            total={total} 
            pageSize={queryParams.pageSize} 
            current={queryParams.pageNum} 
            onChange={(page) => setQueryParams({...queryParams, pageNum: page})} 
          />
        </div>
      </div>
    </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'add' ? '新增岗位' : '编辑岗位'}
        footer={
          <>
            <Button variant="default" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button variant="primary" onClick={handleSave}>确定</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-4">
            <label className="w-20 text-right text-sm text-gray-700"><span className="text-red-500 mr-1">*</span>岗位名称</label>
            <Input 
              className="flex-1" 
              value={currentPosition.positionName || ''} 
              onChange={e => setCurrentPosition({...currentPosition, positionName: e.target.value})}
              placeholder="请输入岗位名称" 
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-20 text-right text-sm text-gray-700"><span className="text-red-500 mr-1">*</span>岗位编码</label>
            <Input 
              className="flex-1" 
              value={currentPosition.positionCode || ''} 
              onChange={e => setCurrentPosition({...currentPosition, positionCode: e.target.value})}
              placeholder="请输入岗位编码" 
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
