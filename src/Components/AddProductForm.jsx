// import '../styles/AddProductForm.css';
// import React, { useState, useEffect } from 'react';
// import { db } from './../firebase';
// import { collection, getDocs, doc, setDoc } from 'firebase/firestore';




// function AddProductForm() {
//   const [categories, setCategories] = useState([]);
//   const [formData, setFormData] = useState({
//     category: '',
//     newCategory: '',
//     name: '',
//     price: '',
//     salePrice: '',
//     saleTitle: '',
//     lastOrderDate: '',
//     estimatedDelivery: '',
//     inStock: true,
//   });

//   // שליפת קטגוריות קיימות מהשרת כדי להציג לבחירה
//   useEffect(() => {
//     const fetchCategories = async () => {
//       const querySnapshot = await getDocs(collection(db, 'categories'));
//       const categoryNames = querySnapshot.docs.map(doc => doc.id);
//       setCategories(categoryNames);
//     };

//     fetchCategories();
//   }, []);

//   // פונקציה לעדכון השדות בטופס
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   // פונקציה להוספת מוצר ל-Firestore
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const categoryName = formData.newCategory || formData.category; // אם המנהל הכניס קטגוריה חדשה, נשתמש בה

//     if (!categoryName || !formData.name || !formData.price) {
//       alert("חובה למלא שם קטגוריה, שם מוצר ומחיר.");
//       return;
//     }

//     try {
//       // 1️⃣ בודקים אם הקטגוריה כבר קיימת, אם לא – יוצרים אותה
//       const categoryRef = doc(db, 'categories', categoryName);
//       await setDoc(categoryRef, {}, { merge: true }); // אם הקטגוריה לא קיימת, יוצרים מסמך ריק

//       // 2️⃣ מוסיפים את המוצר לתוך הקטגוריה
//       const productRef = doc(db, `categories/${categoryName}/products`, formData.name);
//       await setDoc(productRef, {
//         name: formData.name,
//         price: Number(formData.price),
//         salePrice: formData.salePrice ? Number(formData.salePrice) : null,
//         saleTitle: formData.saleTitle || null,
//         lastOrderDate: formData.lastOrderDate || null,
//         estimatedDelivery: formData.estimatedDelivery || null,
//         inStock: formData.inStock
//       });

//       alert("המוצר נוסף בהצלחה!");
//       setFormData({
//         category: '',
//         newCategory: '',
//         name: '',
//         price: '',
//         salePrice: '',
//         saleTitle: '',
//         lastOrderDate: '',
//         estimatedDelivery: '',
//         inStock: true
//       });
//     } catch (error) {
//       console.error("שגיאה בהוספת מוצר:", error);
//       alert("אירעה שגיאה בהוספת המוצר.");
//     }
//   };

//   return (
//     <div>
//       <h2>הוספת מוצר חדש</h2>
//       <form onSubmit={handleSubmit}>
//         {/* בחירת קטגוריה */}
//         <label>בחר קטגוריה:</label>
//         <select name="category" value={formData.category} onChange={handleChange} disabled={formData.newCategory !== ''}>
//           <option value="">בחר...</option>
//           {categories.map((cat, index) => (
//             <option key={index} value={cat}>{cat}</option>
//           ))}
//         </select>

//         {/* או הוספת קטגוריה חדשה */}
//         <label>או הוסף קטגוריה חדשה:</label>
//         <input type="text" name="newCategory" value={formData.newCategory} onChange={handleChange} disabled={formData.category !== ''} />

//         {/* שם מוצר */}
//         <label>שם מוצר:</label>
//         <input type="text" name="name" value={formData.name} onChange={handleChange} required />

//         {/* מחיר רגיל */}
//         <label>מחיר:</label>
//         <input type="number" name="price" value={formData.price} onChange={handleChange} required />

//         {/* מחיר מבצע וכותרת מבצע */}
//         <label>מחיר מבצע:</label>
//         <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} />
        
//         <label>כותרת מבצע:</label>
//         <input type="text" name="saleTitle" value={formData.saleTitle} onChange={handleChange} />

//         {/* תאריך אחרון להזמנה */}
//         <label>תאריך אחרון להזמנה:</label>
//         <input type="date" name="lastOrderDate" value={formData.lastOrderDate} onChange={handleChange} />

//         {/* תאריך משוער לאספקה */}
//         <label>תאריך משוער לאספקה:</label>
//         <input type="date" name="estimatedDelivery" value={formData.estimatedDelivery} onChange={handleChange} />

//         {/* זמינות מוצר */}
//         <label>
//           זמין במלאי:
//           <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} />
//         </label>

//         <button type="submit">הוסף מוצר</button>
//       </form>
//     </div>
//   );
// }

// export default AddProductForm;






import "../styles/AddProductForm.css";
import React, { useState, useEffect } from 'react';
import { db } from './../firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

function AddProductForm() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    newCategory: '',
    name: '',
    price: '',
    salePrice: '',
    saleTitle: '',
    lastOrderDate: '',
    estimatedDelivery: '',
    inStock: true,
    kosherType: '',   // סוג כשרות רגילה
    kosherForPassover: false,   // האם כשר לפסח (ברירת מחדל: false)
    passoverKosherType: ''   // סוג כשרות לפסח
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      setCategories(querySnapshot.docs.map(doc => doc.id));
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryName = formData.newCategory || formData.category;

    if (!categoryName || !formData.name || !formData.price) {
      alert("חובה למלא שם קטגוריה, שם מוצר ומחיר.");
      return;
    }

    try {
      const categoryRef = doc(db, 'categories', categoryName);
      await setDoc(categoryRef, {}, { merge: true });

      const productRef = doc(db, `categories/${categoryName}/products`, formData.name);
      await setDoc(productRef, {
        name: formData.name,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        saleTitle: formData.saleTitle || null,
        lastOrderDate: formData.lastOrderDate || null,
        estimatedDelivery: formData.estimatedDelivery || null,
        inStock: formData.inStock,
        kosherType: formData.kosherType || null,
        kosherForPassover: formData.kosherForPassover,
        passoverKosherType: formData.kosherForPassover ? formData.passoverKosherType : null
      });

      alert("המוצר נוסף בהצלחה!");
    } catch (error) {
      console.error("שגיאה בהוספת מוצר:", error);
      alert("שגיאה בהוספת מוצר.");
    }
  };

  return (
    <div>
      <h2>הוספת מוצר חדש</h2>
      <form onSubmit={handleSubmit}>
        <label>קטגוריה:</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="">בחר...</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <input type="text" name="newCategory" placeholder="או הוסף קטגוריה חדשה" value={formData.newCategory} onChange={handleChange} />

        <label>שם מוצר:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>מחיר:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label>סוג כשרות:</label>
        <input type="text" name="kosherType" value={formData.kosherType} onChange={handleChange} />

        <label>
          <input type="checkbox" name="kosherForPassover" checked={formData.kosherForPassover} onChange={handleChange} />
          כשר לפסח
        </label>

        {formData.kosherForPassover && (
          <>
            <label>סוג כשרות לפסח:</label>
            <input type="text" name="passoverKosherType" value={formData.passoverKosherType} onChange={handleChange} />
          </>
        )}

        <button type="submit">הוסף מוצר</button>
      </form>
    </div>
  );
}

export default AddProductForm;
