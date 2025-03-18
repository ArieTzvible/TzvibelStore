import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";



function UpdateProductForm() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [formData, setFormData] = useState({
    price: "",
    salePrice: "",
    saleTitle: "",
    lastOrderDate: "",
    estimatedDelivery: "",
    inStock: true,
  });

  // שליפת קטגוריות מהשרת
  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      setCategories(querySnapshot.docs.map((doc) => doc.id));
    };
    fetchCategories();
  }, []);

  // שליפת מוצרים לפי קטגוריה
  useEffect(() => {
    if (!selectedCategory) return;
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(
        collection(db, `categories/${selectedCategory}/products`)
      );
      setProducts(querySnapshot.docs.map((doc) => doc.id));
    };
    fetchProducts();
  }, [selectedCategory]);

  // שליפת פרטי מוצר
  useEffect(() => {
    if (!selectedProduct || !selectedCategory) return;
    const fetchProductDetails = async () => {
      const productRef = doc(
        db,
        `categories/${selectedCategory}/products`,
        selectedProduct
      );
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        setFormData(productSnap.data());
      }
    };
    fetchProductDetails();
  }, [selectedProduct, selectedCategory]);

const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === "kosherForPassover" && !checked ? { passoverKosherType: null } : {}) // איפוס סוג כשרות לפסח אם מסירים כשרות לפסח
    }));
  };


  // איפוס שדות המבצע
  const clearSale = () => {
    setFormData((prev) => ({
      ...prev,
      salePrice: null,
      saleTitle: null,
    }));
  };
  

  // שליחת העדכון ל-Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !selectedCategory) {
      alert("יש לבחור קטגוריה ומוצר לעדכון.");
      return;
    }

    try {
      const productRef = doc(
        db,
        `categories/${selectedCategory}/products`,
        selectedProduct
      );
      await updateDoc(productRef, formData);
      alert("המוצר עודכן בהצלחה!");
    } catch (error) {
      console.error("שגיאה בעדכון המוצר:", error);
      alert("שגיאה בעדכון המוצר.");
    }
  };

  return (
    <div>
      <h2>עדכון מוצר</h2>
      <form onSubmit={handleSubmit}>
        <label>בחר קטגוריה:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">בחר...</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {selectedCategory && (
          <>
            <label>בחר מוצר:</label>
            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
              <option value="">בחר...</option>
              {products.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </>
        )}

        {selectedProduct && (
          <>
            <label>מחיר:</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} />

            <label>מחיר מבצע:</label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input type="number" name="salePrice" value={formData.salePrice || ""} onChange={handleChange} />
              <button type="button" onClick={clearSale}>בטל מבצע</button>
            </div>

            <label>כותרת מבצע:</label>
            <input type="text" name="saleTitle" value={formData.saleTitle || ""} onChange={handleChange} />

            <label>תאריך אחרון להזמנה:</label>
            <input type="date" name="lastOrderDate" value={formData.lastOrderDate || ""} onChange={handleChange} />

            <label>תאריך אספקה:</label>
            <input type="date" name="estimatedDelivery" value={formData.estimatedDelivery || ""} onChange={handleChange} />

            <label>
              <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} />
              זמין במלאי
            </label>

            {/* עדכון כשרויות */}
            <label>סוג כשרות:</label>
            <input 
            type="text" 
            name="kosherType" 
            value={formData.kosherType || ""} 
            onChange={handleChange} 
            />

            <label>
            <input 
                type="checkbox" 
                name="kosherForPassover" 
                checked={formData.kosherForPassover || false} 
                onChange={handleChange} 
            />
            
            כשר לפסח
            </label>

            {formData.kosherForPassover && (
            <>
                <label>סוג כשרות לפסח:</label>
                <input 
                type="text" 
                name="passoverKosherType" 
                value={formData.passoverKosherType || ""} 
                onChange={handleChange} 
                />
            </>
            )}

            <button type="submit">עדכן מוצר</button>
          </>
        )}
      </form>
    </div>
  );
}

export default UpdateProductForm;
