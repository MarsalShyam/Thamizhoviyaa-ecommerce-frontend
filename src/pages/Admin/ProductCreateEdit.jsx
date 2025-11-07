// frontend/src/pages/Admin/ProductCreateEdit.jsx (MODIFIED for Professional Form)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSave, FiX, FiArrowLeft, FiUpload } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const initialFormData = {
    name: '', price: 0, description: '', category: '', countInStock: 0, isFeatured: false, images: [], originalPrice: 0, fullDescription: '', benefits: [], usage: '', ingredients: [], size: '', sku: ''
};

const ProductCreateEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (isEdit) {
            const fetchProduct = async () => {
                try {
                    const { data } = await axios.get(`/api/products/${id}`);
                    setFormData(data); 
                } catch (error) {
                    toast.error('Error fetching product for edit.');
                    navigate('/admin/products');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        } else {
            setLoading(false);
        }
    }, [id, isEdit, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    // Helper to handle array inputs (e.g., Benefits, Ingredients)
    const handleArrayChange = (name, value) => {
        // Splits by new line, removes empty lines
        setFormData(prev => ({
            ...prev,
            [name]: value.split('\n').map(item => item.trim()).filter(item => item)
        }));
    };
    
    const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const formDataFile = new FormData();
        formDataFile.append("image", file);

        const { data } = await axios.post('/api/upload', formDataFile, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        const imageUrl = data.url;

        setFormData(prev => {
            const newImages = [...prev.images];
            newImages[index] = imageUrl;
            return { ...prev, images: newImages };
        });

        toast.success("Image uploaded successfully!");
    } catch (error) {
        toast.error("Image upload failed");
    }
};



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await axios.put(`/api/products/admin/${id}`, formData);
                toast.success('Product updated successfully!');
            } else {
                await axios.post('/api/products/admin', formData);
                toast.success('Product created successfully!');
            }
            navigate('/admin/products');
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <Link to="/admin/products" className="text-primary-600 flex items-center gap-2 mb-4"><FiArrowLeft /> Back to Products</Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{isEdit ? `Edit Product: ${formData.name}` : 'Create New Product'}</h2>
            
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-8">
                
                {/* === SECTION 1: CORE DETAILS & STATUS === */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Basic Information</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="input-field" />
                        <input type="text" name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU (e.g., TH-AP-500)" className="input-field" />
                        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category (e.g., Hair Care)" required className="input-field" />
                        <input type="text" name="size" value={formData.size} onChange={handleChange} placeholder="Size (e.g., 500g)" className="input-field" />
                    </div>
                </div>

                {/* === SECTION 2: PRICING & INVENTORY === */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Pricing & Inventory</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                            <label className="input-label">Selling Price (₹)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Original Price (₹)</label>
                            <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} min="0" className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Stock Quantity</label>
                            <input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} required min="0" className="input-field" />
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                         <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                            />
                            <span className="font-medium text-gray-700">Show on Home Page (Featured)</span>
                        </label>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${formData.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {formData.countInStock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                        </span>
                    </div>
                </div>

                {/* === SECTION 3: DESCRIPTIONS & ARRAYS === */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Descriptions & Details</h3>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Short Description (for Product Card)" rows="2" required className="input-field"></textarea>
                    <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} placeholder="Full Product Description (for Product Details Page)" rows="4" className="input-field"></textarea>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className="input-label block mb-2">Benefits (One per line)</label>
                            <textarea 
                                name="benefits" 
                                value={formData.benefits.join('\n')} 
                                onChange={(e) => handleArrayChange('benefits', e.target.value)} 
                                rows="6" 
                                className="input-field"
                            ></textarea>
                        </div>
                        <div>
                            <label className="input-label block mb-2">Ingredients (One per line)</label>
                            <textarea 
                                name="ingredients" 
                                value={formData.ingredients.join('\n')} 
                                onChange={(e) => handleArrayChange('ingredients', e.target.value)} 
                                rows="6" 
                                className="input-field"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* === SECTION 4: IMAGES (4 Slots) === */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Product Images (Max 4)</h3>
                    <p className='text-sm text-gray-600'>First image will be used for the Home Page featured product/card.</p>
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className='p-4 border rounded-lg bg-gray-50'>
                                <label className="input-label">Image Slot {index + 1}</label>
                                <div className="h-24 w-full bg-gray-200 mb-2 flex items-center justify-center relative overflow-hidden rounded">
                                    {formData.images[index] ? (
                                        <img src={formData.images[index]} alt={`Preview ${index}`} className="h-full w-full object-contain" />
                                    ) : (
                                        <FiUpload className="w-6 h-6 text-gray-500" />
                                    )}
                                </div>
                                {/* Mock file input - needs real upload logic later */}
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, index)}
                                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                />
                                {formData.images[index] && (
                                    <span className='text-xs text-green-600 truncate block mt-1'>URL set: {formData.images[index].substring(0, 20)}...</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* === SUBMIT BUTTONS === */}
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={() => navigate('/admin/products')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center space-x-2">
                        <FiX />
                        <span>Cancel</span>
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2 disabled:opacity-50">
                        <FiSave />
                        <span>{isEdit ? 'Update Product' : 'Create Product'}</span>
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default ProductCreateEdit;