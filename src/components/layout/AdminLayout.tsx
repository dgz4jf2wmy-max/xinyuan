import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AdminLayout() {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden bg-white p-4 relative flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
