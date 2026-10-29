import { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../services/productService';
import { getAllBrands } from '../services/brandService';
import { getAllCategories } from '../services/categoryService';

function ProductFormModal({ product, onClose, onSuccess }) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    stockQuantity: '',
    cpu: '',
    ram: '',
    storage: '',
    gpu: '',
    screenSize: '',
    brandId: '',
    categoryId: '',
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllBrands().then((res) => setBrands(res.data));
    getAllCategories().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        stockQuantity: product.stockQuantity || '',
        cpu: product.cpu || '',
        ram: product.ram || '',
        storage: product.storage || '',
        gpu: product.gpu || '',
        screenSize: product.screenSize || '',
        brandId: product.brand?.id || '',
        categoryId: product.category?.id || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      imageUrl: formData.imageUrl,
      stockQuantity: Number(formData.stockQuantity),
      cpu: formData.cpu,
      ram: formData.ram,
      storage: formData.storage,
      gpu: formData.gpu,
      screenSize: formData.screenSize,
      brand: { id: Number(formData.brandId) },
      category: { id: Number(formData.categoryId) },
    };

    try {
      if (isEditing) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      onSuccess();
    } catch (err) {
      setError('Lưu thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button onClick={onClose} className="modal-close-btn">✕</button>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <div>
              <label>Tên sản phẩm</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="auth-input" />
            </div>
            <div>
              <label>Giá (đ)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required className="auth-input" />
            </div>
          </div>

          <div className="admin-form-row">
            <div>
              <label>Hãng</label>
              <select name="brandId" value={formData.brandId} onChange={handleChange} required className="auth-input">
                <option value="">-- Chọn hãng --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Danh mục</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="auth-input">
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <label>Link ảnh</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="auth-input" />

          <label>Mô tả</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="auth-input" />

          <div className="admin-form-row">
            <div>
              <label>CPU</label>
              <input type="text" name="cpu" value={formData.cpu} onChange={handleChange} className="auth-input" />
            </div>
            <div>
              <label>RAM</label>
              <input type="text" name="ram" value={formData.ram} onChange={handleChange} className="auth-input" />
            </div>
          </div>

          <div className="admin-form-row">
            <div>
              <label>Ổ cứng</label>
              <input type="text" name="storage" value={formData.storage} onChange={handleChange} className="auth-input" />
            </div>
            <div>
              <label>Card đồ họa</label>
              <input type="text" name="gpu" value={formData.gpu} onChange={handleChange} className="auth-input" />
            </div>
          </div>

          <div className="admin-form-row">
            <div>
              <label>Màn hình</label>
              <input type="text" name="screenSize" value={formData.screenSize} onChange={handleChange} className="auth-input" />
            </div>
            <div>
              <label>Tồn kho</label>
              <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required className="auth-input" />
            </div>
          </div>

          <button type="submit" className="admin-add-btn" disabled={loading} style={{ width: '100%', marginTop: 12 }}>
            {loading ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Thêm sản phẩm'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;