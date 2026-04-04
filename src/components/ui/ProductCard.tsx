import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import type { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card animate-fade-in">
      <div className="card-image-wrapper">
        <img src={product.image} alt={product.name} className="card-image" loading="lazy" />
        <div className="card-category">{product.category}</div>
      </div>
      <div className="card-content">
        <h3 className="card-title" title={product.name}>{product.name}</h3>
        <p className="card-unit">{product.unit}</p>
        <p className="card-desc">{product.description}</p>
        <div className="card-footer-flex">
          <span className="card-price">₹{product.price.toFixed(2)}</span>
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
  );
};

export default ProductCard;
