import { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct } from '../services/productService';
import ProductFormModal from '../components/ProductFormModal';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 8;

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadProducts = () => {
    setLoading(true);
    getAllProducts()
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách sản phẩm.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn chắc chắn muốn xóa "${name}"?`)) return;

    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      alert('Xóa thất bại. Vui lòng thử lại.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  if (loading) return <p style={{ padding: 20 }}>Đang tải...</p>;
  if (error) return <p style={{ padding: 20, color: 'red' }}>{error}</p>;

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentProducts = products.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Quản lý sản phẩm</h1>
        <button onClick={handleAddNew} className="admin-add-btn">+ Thêm sản phẩm</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
         <thead>
  <tr>
    <th>STT</th>
    <th>Ảnh</th>
    <th>Tên sản phẩm</th>
    <th>Hãng</th>
    <th>Danh mục</th>
    <th>Giá</th>
    <th>Tồn kho</th>
    <th>Thao tác</th>
  </tr>
</thead>
<tbody>
  {currentProducts.map((product, index) => (
    <tr key={product.id}>
      <td>{startIndex + index + 1}</td>
      <td>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="admin-table-img"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50x40?text=No+Img'; }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.brand?.name || '—'}</td>
                <td>{product.category?.name || '—'}</td>
                <td>{product.price?.toLocaleString('vi-VN')} đ</td>
                <td>{product.stockQuantity}</td>
                <td>
                  <button onClick={() => handleEdit(product)} className="admin-edit-btn">Sửa</button>
                  <button onClick={() => handleDelete(product.id, product.name)} className="admin-delete-btn">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {showForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default AdminProducts;