import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Edit2, 
  Trash2, 
  X
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../context/ProductContext';
import { GROCERY_CATEGORIES } from '../../config/categories';

const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({
    name: '',
    price: 0,
    category: GROCERY_CATEGORIES[0],
    description: '',
    unit: '1 kg',
    inStock: true,
    image: '/organic_apples.png'
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData as any);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      category: 'Fruits & Veggies',
      description: '',
      unit: '1 kg',
      inStock: true,
      image: '/organic_apples.png'
    });
  };

  return (
    <AdminLayout>
      <div className="products-page">
        <div className="welcome-section" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Product Inventory</h2>
            <p style={{ color: 'var(--admin-text-secondary)' }}>Manage your catalog, stock levels, and pricing.</p>
          </div>
          <button className="btn" style={{ padding: '12px 24px', display: 'flex', gap: '8px', background: 'var(--admin-primary)', border: 'none', color: 'white', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}>
             <Plus size={20} /> Add Product
          </button>
        </div>

        <div className="table-header" style={{ marginBottom: '24px', background: 'var(--admin-card-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
          <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
            <div className="header-search" style={{ width: '320px' }}>
              <Search size={18} color="var(--admin-text-secondary)" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px' }}>
               <button className={`icon-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                  <LayoutGrid size={18} />
               </button>
               <button className={`icon-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                  <List size={18} />
               </button>
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#333' }}>
                           <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontWeight: 600 }}>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td style={{ fontWeight: 700 }}>₹{product.price} / {product.unit}</td>
                    <td>{product.inStock ? 'In Stock' : 'Out of Stock'}</td>
                    <td>
                       <span className={`status-badge ${product.inStock ? 'status-delivered' : 'status-cancelled'}`}>
                         {product.inStock ? 'Active' : 'Disabled'}
                       </span>
                    </td>
                    <td>
                       <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="action-btn" title="Edit" onClick={() => handleEdit(product)}><Edit2 size={16} /></button>
                          <button className="action-btn delete" title="Delete" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filteredProducts.map(product => (
              <div key={product.id} className="stats-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
                 <div style={{ height: '180px', background: '#333', position: 'relative' }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                       <button className="action-btn" onClick={() => handleEdit(product)}><Edit2 size={16} /></button>
                       <button className="action-btn delete" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>
                    </div>
                 </div>
                 <div style={{ padding: '20px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>{product.category}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '8px' }}>{product.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                       <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{product.price}<small style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)', marginLeft: '4px' }}>/ {product.unit}</small></div>
                       <span className={`status-badge ${product.inStock ? 'status-delivered' : 'status-cancelled'}`}>{product.inStock ? 'In Stock' : 'Out Stock'}</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="admin-modal animate-slide-down">
              <div className="modal-header">
                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button className="close-modal" onClick={closeModal}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Product Name</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)', padding: '10px', borderRadius: '8px', color: 'white', width: '100%' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Price (₹)</label>
                        <input 
                          type="number" 
                          required 
                          value={formData.price} 
                          onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)', padding: '10px', borderRadius: '8px', color: 'white', width: '100%' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Unit</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.unit} 
                          onChange={(e) => setFormData({...formData, unit: e.target.value})}
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)', padding: '10px', borderRadius: '8px', color: 'white', width: '100%' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Category</label>
                      <select 
                        required 
                        value={formData.category} 
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)', padding: '10px', borderRadius: '8px', color: 'white', width: '100%', colorScheme: 'dark' }}
                      >
                         {GROCERY_CATEGORIES.map(cat => (
                           <option key={cat} value={cat}>{cat}</option>
                         ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Description</label>
                      <textarea 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)', padding: '10px', borderRadius: '8px', color: 'white', minHeight: '80px', width: '100%', resize: 'vertical' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                       <input 
                          type="checkbox" 
                          id="inStock" 
                          checked={formData.inStock} 
                          onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                          style={{ cursor: 'pointer' }}
                       />
                       <label htmlFor="inStock" style={{ cursor: 'pointer' }}>Item is in Stock</label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn outline" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn primary">
                     {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
