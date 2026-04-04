import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../context/ProductContext';
import './Shop.css';

const categories = [
  'All', 
  'Fruits & Veggies', 
  'Food Staples', 
  'Dairy & Refrigerated', 
  'Snacks & Packaged Foods', 
  'Household Essentials', 
  'Personal Care', 
  'Beverages'
];

const Shop: React.FC = () => {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="shop-page container">
      <div className="shop-header">
        <h1>Shop All Products</h1>
        <p>Browse our wide selection of fresh groceries and daily essentials.</p>
      </div>

      <div className="shop-layout">
        <aside className="shop-sidebar">
          <div className="filter-group">
            <div className="filter-header">
              <Filter size={20} />
              <h3>Categories</h3>
            </div>
            <ul className="category-list">
              {categories.map(category => (
                <li key={category}>
                  <button 
                    className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="shop-main">
          <div className="shop-toolbar animate-fade-in">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="results-count">
              Showing {filteredProducts.length} results
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria.</p>
              <button className="btn btn-outline" onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}>Clear Filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
