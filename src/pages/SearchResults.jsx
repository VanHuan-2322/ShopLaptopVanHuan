import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts } from '../services/productService';
import { getDiscountPercent, formatPrice } from '../utils/priceHelper';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 8;

function SearchResults() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
    if (!keyword.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    searchProducts(keyword)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tìm kiếm sản phẩm.');
        setLoading(false);
      });
  }, [keyword]);

  if (loading) return <p style={{ padding: 20 }}>Đang tìm kiếm...</p>;
  if (error) return <p style={{ padding: 20, color: 'red' }}>{error}</p>;

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentProducts = products.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      <h1 className="home-title">
        Kết quả tìm kiếm cho "{keyword}" ({products.length} sản phẩm)
      </h1>

      {products.length === 0 ? (
        <div>
          <p>Không tìm thấy sản phẩm nào phù hợp.</p>
          <Link to="/" className="back-link">← Quay lại trang chủ</Link>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {currentProducts.map((product) => {
              const discountPercent = getDiscountPercent(product.price, product.discountPrice);
              const hasDiscount = discountPercent > 0;

              return (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <div className="product-card">
                    <div className="product-image-wrapper">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/220x150?text=No+Image'; }}
                      />
                      {hasDiscount && (
                        <span className="discount-badge">-{discountPercent}%</span>
                      )}
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-specs">{product.cpu} - {product.ram}</p>

                    {hasDiscount ? (
                      <div className="price-group">
                        <p className="product-price">{formatPrice(product.discountPrice)}</p>
                        <p className="product-price-original">{formatPrice(product.price)}</p>
                      </div>
                    ) : (
                      <p className="product-price">{formatPrice(product.price)}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default SearchResults;