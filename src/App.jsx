// import React, { useEffect, useState } from "react";
// import { db } from "./firebase"; // ודא שהייבוא נכון
// import { collection, getDocs } from "firebase/firestore";
// import AddProductForm from "./components/AddProductForm"; // ייבוא הטופס

// function App() {
//   const [categories, setCategories] = useState([]);

//   // שליפת קטגוריות מ-Firestore
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "categories"));
//         const categoriesList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           products: doc.data(),
//         })); // שמירת הקטגוריות כמערך עם מזהה ומוצרים
//         console.log(categoriesList);
//         setCategories(categoriesList);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <div>
//       <h1>ניהול חנות</h1>

//       {/* טופס להוספת מוצר */}
//       <AddProductForm />

//       <h2>קטגוריות ומוצרים:</h2>
//       <ul>
//         {categories.length > 0 ? (
//           categories.map((category) => (
//             <li key={category.id}>
//               <h3>{category.id}</h3> {/* שם הקטגוריה */}
//               <ul>
//                 {Object.entries(category.products).map(([productName, details]) => (
//                   <li key={productName}>
//                     <strong>{productName}</strong>: {JSON.stringify(details)}
//                   </li>
//                 ))}
//               </ul>
//             </li>
//           ))
//         ) : (
//           <p>לא נמצאו קטגוריות</p>
//         )}
//       </ul>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AddProductForm from './components/AddProductForm';
import UpdateProductForm from './components/UpdateProductForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/add-product" element={<AddProductForm />} />
        <Route path="/update-product" element={<UpdateProductForm />} />
      </Routes>
    </Router>
  );
}

export default App;



