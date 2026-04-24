import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Pagination } from '../../../components/ui/pagination';
import { Modal } from '../../../components/ui/modal';
import { Search, RotateCcw, Plus, Edit, Trash2, Download, ChevronDown } from 'lucide-react';
import { User } from '../../../types/system';
import { getUserPage } from '../../../data/system/userData';

export default function UserManagement() {
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // 查询参数
  const [queryParams, setQueryParams] = useState({
    username: '',
    realName: '',
    department: '',
    pageNum: 1,
    pageSize: 10,
  });

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getUserPage(queryParams.pageNum, queryParams.pageSize, {
        username: queryParams.username,
        realName: queryParams.realName,
      });
      setData(res.list);
      setTotal(res.total);
    } catch (error) {
      console.error('获取用户列表失败', error);
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
      username: '',
      realName: '',
      department: '',
      pageNum: 1,
      pageSize: 10,
    });
    // fetchData will be called by useEffect due to pageNum change if it was not 1, 
    // but to be safe we call it here or rely on the state update.
    setTimeout(fetchData, 0);
  };

  const handleAdd = () => {
    setModalType('add');
    setCurrentUser({});
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setModalType('edit');
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    // 预留接口调用：调用删除API
    console.log('删除用户', id);
    alert('模拟删除成功');
    fetchData();
  };

  const handleSave = () => {
    // 预留接口调用：调用保存/更新API
    console.log('保存用户数据', currentUser);
    setIsModalOpen(false);
    fetchData();
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* 搜索区域 */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4">
        <div className="w-48">
          <Input 
            placeholder="用户名" 
            value={queryParams.username}
            onChange={e => setQueryParams({...queryParams, username: e.target.value})}
          />
        </div>
        <div className="w-48">
          <Input 
            placeholder="真实姓名" 
            value={queryParams.realName}
            onChange={e => setQueryParams({...queryParams, realName: e.target.value})}
          />
        </div>
        <div className="w-48">
          <Select 
            options={[
              { label: '技术部', value: '技术部' },
              { label: '产品部', value: '产品部' },
              { label: '运营部', value: '运营部' },
            ]}
            value={queryParams.department}
            onChange={e => setQueryParams({...queryParams, department: e.target.value})}
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

      {/* 表格和操作区域 */}
      <div className="flex-1 bg-white p-4 flex flex-col overflow-hidden">
        {/* 操作按钮区域 */}
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

        {/* 表格区域 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableHead>
              <TableHead>用户编号</TableHead>
              <TableHead>用户名</TableHead>
              <TableHead>真实姓名</TableHead>
              <TableHead>所属部门</TableHead>
              <TableHead>岗位</TableHead>
              <TableHead>手机号码</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10 text-gray-500">加载中...</TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10 text-gray-500">暂无数据</TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-center">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.realName}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.position}</TableCell>
                  <TableCell>{row.phone}</TableCell>
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

      {/* 新增/编辑弹窗 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'add' ? '新增用户' : '编辑用户'}
        footer={
          <>
            <Button variant="default" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button variant="primary" onClick={handleSave}>确定</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-4">
            <label className="w-20 text-right text-sm text-gray-700"><span className="text-red-500 mr-1">*</span>用户名</label>
            <Input 
              className="flex-1" 
              value={currentUser.username || ''} 
              onChange={e => setCurrentUser({...currentUser, username: e.target.value})}
              placeholder="请输入用户名" 
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-20 text-right text-sm text-gray-700"><span className="text-red-500 mr-1">*</span>真实姓名</label>
            <Input 
              className="flex-1" 
              value={currentUser.realName || ''} 
              onChange={e => setCurrentUser({...currentUser, realName: e.target.value})}
              placeholder="请输入真实姓名" 
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-20 text-right text-sm text-gray-700">所属部门</label>
            <Select 
              className="flex-1"
              options={[
                { label: '技术部', value: '技术部' },
                { label: '产品部', value: '产品部' },
                { label: '运营部', value: '运营部' },
              ]}
              value={currentUser.department || ''}
              onChange={e => setCurrentUser({...currentUser, department: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-20 text-right text-sm text-gray-700">手机号码</label>
            <Input 
              className="flex-1" 
              value={currentUser.phone || ''} 
              onChange={e => setCurrentUser({...currentUser, phone: e.target.value})}
              placeholder="请输入手机号码" 
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
