import React, { useState } from 'react';
import { ShoppingCart, Plus, Heart, Eye, Star, X, Shield, RefreshCw } from 'lucide-react';
import type { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFav = isInWishlist(product.id);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const hasDiscount = product.discount && product.discount > 0;
  const originalPrice = hasDiscount 
    ? product.price / (1 - (product.discount || 0) / 100) 
    : product.price;

  // Determine delivery badge based on category
  const isExpress = [
    'Fresh Vegetables',
    'Fresh Fruits',
    'Dairy & Breakfast',
    'Soft Drinks & Juices',
    'Energy Drinks',
    'Bakery & Cakes',
    'Ice Cream & Desserts'
  ].includes(product.category);

  return (
    <>
      <div className="product-card animate-fade-in">
        <div className="card-image-wrapper">
          <img src={product.image} alt={product.name} className="card-image" loading="lazy" />
          
          {/* Category Badge */}
          <div className="card-category">{product.category}</div>
          
          {/* Quick View & Wishlist overlay */}
          <div className="card-actions-overlay">
            <button 
              className="quick-view-overlay-btn"
              onClick={() => setIsQuickViewOpen(true)}
              title="Quick View"
            >
              <Eye size={18} />
            </button>
          </div>

          <button 
            className={`wishlist-toggle-btn ${isFav ? 'active' : ''}`}
            onClick={() => toggleWishlist(product)}
            aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} fill={isFav ? "currentColor" : "transparent"} />
          </button>

          {/* Bestseller & Organic Badges */}
          <div className="badge-container">
            {product.isBestseller && (
              <span className="badge badge-bestseller">Bestseller</span>
            )}
            {product.isOrganic && (
              <span className="badge badge-organic">Organic</span>
            )}
            {hasDiscount && (
              <span className="badge badge-discount">{product.discount}% OFF</span>
            )}
          </div>
        </div>

        <div className="card-content">
          {/* Ratings */}
          <div className="card-ratings">
            <div className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  fill={i < Math.round(product.rating || 4.2) ? "var(--warning-color, #f59e0b)" : "none"} 
                  color="var(--warning-color, #f59e0b)" 
                />
              ))}
            </div>
            <span className="rating-value">{product.rating || '4.2'}</span>
            <span className="rating-count">({product.reviews || '45'})</span>
          </div>

          <h3 className="card-title" title={product.name} onClick={() => setIsQuickViewOpen(true)}>
            {product.name}
          </h3>
          <p className="card-unit">{product.unit}</p>
          <p className="card-desc">{product.description}</p>
          
          {/* Stock & Delivery badges */}
          <div className="card-meta-badges">
            {isExpress ? (
              <span className="delivery-badge express">10-Min Delivery</span>
            ) : (
              <span className="delivery-badge free">FREE Delivery</span>
            )}

            {product.stock && product.stock <= 50 ? (
              <span className="stock-badge low-stock">Only {product.stock} left</span>
            ) : (
              <span className="stock-badge in-stock">In Stock</span>
            )}
          </div>

          <div className="card-footer-flex">
            <div className="price-container">
              <span className="card-price">₹{product.price.toFixed(2)}</span>
              {hasDiscount && (
                <span className="original-price">₹{originalPrice.toFixed(2)}</span>
              )}
            </div>
            <button 
              className="btn btn-primary add-to-cart-btn"
              onClick={() => addToCart(product, 1)}
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus size={18} />
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <div className="quickview-overlay" onClick={() => setIsQuickViewOpen(false)}>
          <div className="quickview-modal animate-slide-down" onClick={(e) => e.stopPropagation()}>
            <button className="quickview-close" onClick={() => setIsQuickViewOpen(false)}>
              <X size={20} />
            </button>
            <div className="quickview-body">
              <div className="quickview-img-wrapper">
                <img src={product.image} alt={product.name} />
                {product.isOrganic && <span className="qv-badge organic">100% Organic</span>}
                {product.isBestseller && <span className="qv-badge bestseller">Bestseller</span>}
              </div>
              <div className="quickview-info">
                <div className="qv-category">{product.category}</div>
                <h2 className="qv-title">{product.name}</h2>
                
                {/* Ratings */}
                <div className="qv-ratings">
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < Math.round(product.rating || 4.2) ? "#f59e0b" : "none"} 
                        color="#f59e0b" 
                      />
                    ))}
                  </div>
                  <span className="qv-rating-value">{product.rating || '4.2'} Out of 5</span>
                  <span className="qv-rating-count">({product.reviews || '45'} verified ratings)</span>
                </div>

                <div className="qv-price-row">
                  <span className="qv-price">₹{product.price.toFixed(2)}</span>
                  {hasDiscount && (
                    <>
                      <span className="qv-original-price">₹{originalPrice.toFixed(2)}</span>
                      <span className="qv-discount-percent">({product.discount}% OFF)</span>
                    </>
                  )}
                  <span className="qv-unit">/ {product.unit}</span>
                </div>

                <div className="qv-divider"></div>

                <p className="qv-description">{product.description}</p>

                {/* Badges/Trust */}
                <div className="qv-trust-cards">
                  <div className="trust-card">
                    <Shield size={16} />
                    <span>Safe & Hygienic</span>
                  </div>
                  <div className="trust-card">
                    <RefreshCw size={16} />
                    <span>Easy Returns</span>
                  </div>
                </div>

                <div className="qv-divider"></div>

                <div className="qv-purchase-section">
                  <div className="qv-stock-status">
                    Status: {product.stock && product.stock > 0 ? (
                      <span className="text-emerald-500 font-semibold">Available (In Stock)</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Out of Stock</span>
                    )}
                  </div>
                  
                  <button 
                    className="btn btn-primary qv-add-btn"
                    onClick={() => {
                      addToCart(product, 1);
                      setIsQuickViewOpen(false);
                    }}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
