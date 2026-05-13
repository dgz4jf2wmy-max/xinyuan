import React from 'react';

export default function MobileDemo2() {
  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚧</span>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">页面建设中</h2>
        <p className="text-sm text-gray-500">
          这是一个移动端原型展示页面。未来可以根据需要在 <code>/mobile/*</code> 路由下持续挂载新页面！
        </p>
      </div>
    </div>
  );
}
