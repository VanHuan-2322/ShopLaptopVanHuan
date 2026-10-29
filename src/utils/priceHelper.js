export function getDiscountPercent(price, discountPrice) {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function formatPrice(value) {
  return value?.toLocaleString('vi-VN') + ' đ';
}