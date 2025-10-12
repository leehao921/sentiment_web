import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - 找不到頁面</h1>
      <p>抱歉，您訪問的頁面不存在。</p>
      <Link to="/">返回首頁</Link>
    </div>
  );
}

export default NotFound;
