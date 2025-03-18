import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', direction: 'rtl', padding: '20px' }}>
      <h1>ניהול החנות</h1>
      <button onClick={() => navigate('/add-product')}>הוספת מוצר</button>
      <button onClick={() => navigate('/update-product')}>עדכון מוצר</button>
    </div>
  );
}

export default AdminDashboard;
