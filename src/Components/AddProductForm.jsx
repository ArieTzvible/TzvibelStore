
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

        <label>תאריך אחרון להזמנה:</label>
        <input 
        type="date" 
        name="lastOrderDate" 
        value={formData.lastOrderDate} 
        onChange={handleChange} 
        />

        <label>תאריך אספקה משוער:</label>
        <input 
        type="date" 
        name="estimatedDelivery" 
        value={formData.estimatedDelivery} 
        onChange={handleChange} 
        min={formData.lastOrderDate} 
        />


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
