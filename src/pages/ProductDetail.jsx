import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { getDiscountPercent, formatPrice } from '../utils/priceHelper';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    getProductById(id)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không tìm thấy sản phẩm');
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    const finalPrice = product.discountPrice && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;
    addToCart({ ...product, price: finalPrice }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => Math.min(product.stockQuantity, q + 1));

  if (loading) return <p style={{ padding: 20 }}>Đang tải...</p>;
  if (error) return <p style={{ padding: 20, color: 'red' }}>{error}</p>;

  const discountPercent = getDiscountPercent(product.price, product.discountPrice);
  const hasDiscount = discountPercent > 0;

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">← Quay lại danh sách</Link>
      <div className="detail-content">
        <div className="product-image-wrapper">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="detail-image"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
          />
          {hasDiscount && <span className="discount-badge discount-badge-large">-{discountPercent}%</span>}
        </div>
        <div>
          <h1>{product.name}</h1>

          {hasDiscount ? (
            <div className="price-group-detail">
              <p className="detail-price">{formatPrice(product.discountPrice)}</p>
              <p className="detail-price-original">{formatPrice(product.price)}</p>
              <span className="discount-badge-inline">Tiết kiệm {discountPercent}%</span>
            </div>
          ) : (
            <p className="detail-price">{formatPrice(product.price)}</p>
          )}

          <p>{product.description}</p>
          <ul className="detail-specs">
            <li><strong>CPU:</strong> {product.cpu}</li>
            <li><strong>RAM:</strong> {product.ram}</li>
            <li><strong>Ổ cứng:</strong> {product.storage}</li>
            <li><strong>Card đồ họa:</strong> {product.gpu}</li>
            <li><strong>Màn hình:</strong> {product.screenSize}</li>
            <li><strong>Hãng:</strong> {product.brand?.name}</li>
            <li><strong>Danh mục:</strong> {product.category?.name}</li>
            <li><strong>Còn lại:</strong> {product.stockQuantity} sản phẩm</li>
          </ul>

          <div className="qty-selector">
            <button onClick={decreaseQty} className="qty-btn">−</button>
            <span className="qty-value">{quantity}</span>
            <button onClick={increaseQty} className="qty-btn">+</button>
          </div>

          <button
            onClick={handleAddToCart}
            className="add-to-cart-btn"
            disabled={product.stockQuantity === 0}
          >
            {product.stockQuantity === 0
              ? 'Hết hàng'
              : added
                ? '✓ Đã thêm vào giỏ'
                : '🛒 Thêm vào giỏ hàng'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;