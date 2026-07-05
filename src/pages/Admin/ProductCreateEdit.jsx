// frontend/src/pages/Admin/ProductCreateEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSave, FiX, FiArrowLeft, FiUpload, FiPlus, FiTrash2,
  FiInfo, FiImage, FiDollarSign, FiLayers, FiSliders, FiTruck, FiCheckCircle, FiChevronRight, FiChevronLeft,
  FiLayout, FiArrowUp, FiArrowDown
} from 'react-icons/fi';
import { TbCurrencyRupee } from 'react-icons/tb';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const initialFormData = {
  name: '',
  price: 0,
  originalPrice: 0,
  description: '',
  fullDescription: '',
  category: '',
  countInStock: 0,
  isFeatured: false,
  images: [],
  size: '',
  sku: '',
  attributes: [],
  variants: [],
  shipping: {
    weight: 0,
    width: 0,
    height: 0,
    length: 0,
    shippingClass: 'Standard'
  },
  seo: {
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  },
  aboutThisItem: [],
  productInformation: [],
  fromTheBrand: []
};

const STEPS = [
  { id: 1, name: 'Basic Info', icon: FiInfo },
  { id: 2, name: 'Media', icon: FiImage },
  { id: 3, name: 'Pricing', icon: TbCurrencyRupee },
  { id: 4, name: 'Attributes', icon: FiLayers },
  { id: 5, name: 'Variants', icon: FiSliders },
  { id: 6, name: 'Tab Details', icon: FiLayout },
  { id: 7, name: 'Shipping & SEO', icon: FiTruck },
  { id: 8, name: 'Review', icon: FiCheckCircle },
];

const ProductCreateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeRichTab, setActiveRichTab] = useState('aboutThisItem');

  // Rich Tab Content Helpers
  const handleAddRichSection = (formatType) => {
    let newSection = {
      type: formatType,
      heading: '',
    };
    if (formatType === 'format1') {
      newSection.subheading = '';
      newSection.description = '';
    } else if (formatType === 'format2') {
      newSection.subsections = [{ subheading: '', description: '' }];
    } else if (formatType === 'format3') {
      newSection.subsections = [{ subheading: '', tableData: [{ key: '', value: '' }] }];
    }

    setFormData(prev => ({
      ...prev,
      [activeRichTab]: [...(prev[activeRichTab] || []), newSection]
    }));
  };

  const handleRichSectionChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...(prev[activeRichTab] || [])];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return { ...prev, [activeRichTab]: updated };
    });
  };

  const handleRichSubsectionChange = (sectionIdx, subIdx, field, value) => {
    setFormData(prev => {
      const updated = [...(prev[activeRichTab] || [])];
      const section = { ...updated[sectionIdx] };
      const subsections = [...(section.subsections || [])];
      subsections[subIdx] = {
        ...subsections[subIdx],
        [field]: value
      };
      section.subsections = subsections;
      updated[sectionIdx] = section;
      return { ...prev, [activeRichTab]: updated };
    });
  };

  const handleAddRichSubsection = (sectionIdx, formatType) => {
    setFormData(prev => {
      const updated = [...(prev[activeRichTab] || [])];
      const section = { ...updated[sectionIdx] };
      const subsections = [...(section.subsections || [])];
      if (formatType === 'format2') {
        subsections.push({ subheading: '', description: '' });
      } else {
        subsections.push({ subheading: '', tableData: [{ key: '', value: '' }] });
      }
      section.subsections = subsections;
      updated[sectionIdx] = section;
      return { ...prev, [activeRichTab]: updated };
    });
  };

  const handleRemoveRichSubsection = (sectionIdx, subIdx) => {
    setFormData(prev => {
      const updated = [...(prev[activeRichTab] || [])];
      const section = { ...updated[sectionIdx] };
      section.subsections = (section.subsections || []).filter((_, idx) => idx !== subIdx);
      updated[sectionIdx] = section;
      return { ...prev, [activeRichTab]: updated };
    });
  };

  const handleAddRichTableDataRow = (sectionIdx, subIdx) => {
    setFormData(prev => {
      const updated = [...(prev[activeRichTab] || [])];
      const section = { ...updated[sectionIdx] };
      const subsections = [...(section.subsections || [])];
      const sub = { ...subsections[subIdx] };
      sub.tableData = [...(sub.tableData || []), { key: '', value: '' }];
      subsections[subIdx] = sub;
      section.subsections = subsections;
      updated[sectionIdx] = section;
      return { ...prev, [activeRichTab]: updated };
    });
  };

  const handleRichTableDataRowChange = (sectionIdx, subIdx, rowIdx, field, value) => {
    setFormData(prev => {
      const updated = [...(prev[activeRichTab] || [])];
      const section = { ...updated[sectionIdx] };
      const subsections = [...(section.subsections || [])];
      const sub = { ...subsections[subIdx] };
      const tableData = [...(sub.tableData || [])];
      tableData[rowIdx] = {
        ...tableData[rowIdx],
        [field]: value
      };
      sub.tableData = tableData;
      subsections[subIdx] = sub;
      section.subsections = subsections;
      updated[sectionIdx] = section;
      return { ...prev, [activeRichTab]: updated };
    });
  };

  const handleRemoveRichTableDataRow = (sectionIdx, subIdx, rowIdx) => {
    setFormData(prev => {
      const updated = [...(prev[activeRichTab] || [])];
      const section = { ...updated[sectionIdx] };
      const subsections = [...(section.subsections || [])];
      const sub = { ...subsections[subIdx] };
      sub.tableData = (sub.tableData || []).filter((_, idx) => idx !== rowIdx);
      subsections[subIdx] = sub;
      section.subsections = subsections;
      updated[sectionIdx] = section;
      return { ...prev, [activeRichTab]: updated };
    });
  };

  const handleMoveRichSection = (index, direction) => {
    setFormData(prev => {
      const list = [...(prev[activeRichTab] || [])];
      if (direction === 'up' && index > 0) {
        const temp = list[index];
        list[index] = list[index - 1];
        list[index - 1] = temp;
      } else if (direction === 'down' && index < list.length - 1) {
        const temp = list[index];
        list[index] = list[index + 1];
        list[index + 1] = temp;
      }
      return { ...prev, [activeRichTab]: list };
    });
  };

  const handleRemoveRichSection = (index) => {
    setFormData(prev => ({
      ...prev,
      [activeRichTab]: (prev[activeRichTab] || []).filter((_, idx) => idx !== index)
    }));
  };

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(`/api/products/${id}`);
          setFormData({
            ...initialFormData,
            ...data,
            attributes: data.attributes || [],
            variants: data.variants || [],
            shipping: {
              ...initialFormData.shipping,
              ...(data.shipping || {})
            },
            seo: {
              ...initialFormData.seo,
              ...(data.seo || {})
            },
            aboutThisItem: data.aboutThisItem || [],
            productInformation: data.productInformation || [],
            fromTheBrand: data.fromTheBrand || []
          });
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

  const handleNestedChange = (section, name, value, isNumber = false) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: isNumber ? Number(value) : value
      }
    }));
  };

  // Image Upload Logic
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

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  // Dynamic Attributes Logic
  const handleAddAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { name: '', value: '' }]
    }));
  };

  const handleAttributeChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.attributes];
      updated[index][field] = value;
      return { ...prev, attributes: updated };
    });
  };

  const handleRemoveAttribute = (index) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, idx) => idx !== index)
    }));
  };

  // Dynamic Variants Logic
  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: '', color: '', size: '', price: prev.price || 0, stock: 0, sku: '' }]
    }));
  };

  const handleVariantChange = (index, field, value, isNumber = false) => {
    setFormData(prev => {
      const updated = [...prev.variants];
      updated[index][field] = isNumber ? Number(value) : value;
      return { ...prev, variants: updated };
    });
  };

  const handleRemoveVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index)
    }));
  };

  const handleGenerateVariantSKU = (index) => {
    const variant = formData.variants[index];
    const baseSKU = formData.sku || 'PROD';
    const colorCode = variant.color ? variant.color.substring(0, 3).toUpperCase() : 'XX';
    const sizeCode = variant.size ? variant.size.replace(/\s+/g, '').toUpperCase() : 'XX';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const sku = `${baseSKU}-${colorCode}-${sizeCode}-${randomSuffix}`;
    handleVariantChange(index, 'sku', sku);
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        toast.warning('Please enter a product name.');
        return false;
      }
      if (!formData.category.trim()) {
        toast.warning('Please select or type a category.');
        return false;
      }
    }
    if (currentStep === 3) {
      if (formData.price <= 0) {
        toast.warning('Please enter a valid price greater than ₹0.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Final validations
    if (!formData.name.trim() || !formData.category.trim() || formData.price <= 0) {
      toast.error('Please complete all required fields with valid details.');
      return;
    }

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/admin/products" className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-6 transition-colors">
        <FiArrowLeft /> Back to Products
      </Link>

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {isEdit ? `Edit Product: ${formData.name}` : 'Create New Product'}
        </h2>
        <p className="text-gray-500 mt-2">
          Add comprehensive details for your multi-category catalogs. Consistent fields help buyers locate your goods.
        </p>
      </div>

      {/* Modern Stepper Indicator */}
      <div className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* 
    🔑 FIX: 
    - overflow-x-auto → enables horizontal scroll if content too wide
    - Custom scrollbar styling for cleaner look
    - Removed flex-col so it stays in single row always (scroll instead of wrap)
  */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="flex items-center gap-4 min-w-max pb-2">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                    disabled={step.id > currentStep && !isEdit}
                    // 🔑 flex-shrink-0 → prevents button from squishing
                    className="flex items-center gap-3 focus:outline-none transition-all group flex-shrink-0"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${isActive
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                        : isCompleted
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left whitespace-nowrap">
                      <span className="text-xs text-gray-400 block font-medium">
                        Step {step.id}
                      </span>
                      <span
                        className={`text-sm font-semibold ${isActive
                          ? 'text-primary-600'
                          : isCompleted
                            ? 'text-green-600'
                            : 'text-gray-500 group-hover:text-gray-700'
                          }`}
                      >
                        {step.name}
                      </span>
                    </div>
                  </button>

                  {/* 
              🔑 Connector line — fixed width instead of flex-grow 
              so it doesn't push things around
            */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`w-12 h-0.5 flex-shrink-0 transition-colors ${isCompleted ? 'bg-green-400' : 'bg-gray-200'
                        }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Wizard Form Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-8 flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
            >
              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 pb-2 border-b">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Silk Banarasi Saree, Castor Oil Cold-Pressed"
                        required
                        className="input-field w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">SKU (Stock Keeping Unit)</label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        placeholder="e.g., SLK-BAN-001"
                        className="input-field w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="e.g., Clothes, Food, Cosmetics, Electronics, Books"
                        required
                        className="input-field w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Default Size / Weight (Optional)</label>
                      <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        placeholder="e.g., M, XL, 500g, 1 Litre"
                        className="input-field w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief overview displayed on product listings cards..."
                      rows="2"
                      required
                      className="input-field w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Description (HTML or text supported)</label>
                    <textarea
                      name="fullDescription"
                      value={formData.fullDescription}
                      onChange={handleChange}
                      placeholder="Complete detailed technical specifications, instructions, or features..."
                      rows="5"
                      className="input-field w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Media */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="border-b pb-2">
                    <h3 className="text-2xl font-bold text-gray-900">Product Media</h3>
                    <p className="text-sm text-gray-500 mt-1">Upload high-resolution images. First image serves as default thumbnail.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="p-5 border border-dashed border-gray-300 rounded-2xl bg-gray-50/50 flex flex-col items-center justify-between text-center relative hover:bg-gray-50 transition-colors">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Image {index + 1}</span>

                        <div className="h-32 w-full bg-white border border-gray-100 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden shadow-inner">
                          {formData.images[index] ? (
                            <>
                              <img src={formData.images[index]} alt={`Preview ${index}`} className="h-full w-full object-contain" />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition-colors"
                              >
                                <FiX className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <FiUpload className="w-8 h-8 text-gray-300 animate-pulse" />
                          )}
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                          className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                        />
                        {formData.images[index] && (
                          <div className="text-[10px] text-green-600 truncate max-w-full mt-2 font-mono">
                            ✓ {formData.images[index].substring(formData.images[index].lastIndexOf('/') + 1)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Pricing & Inventory */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 pb-2 border-b">Pricing & Inventory</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Selling Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        className="input-field w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Original MRP Price (₹)</label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        min="0"
                        className="input-field w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Base Stock Quantity *</label>
                      <input
                        type="number"
                        name="countInStock"
                        value={formData.countInStock}
                        onChange={handleChange}
                        required
                        min="0"
                        className="input-field w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-semibold text-gray-700 block">Featured Product</span>
                        <span className="text-xs text-gray-400">Highlight this item on the homepage showcase</span>
                      </div>
                    </label>
                    <span className={`px-4 py-1.5 text-xs font-bold rounded-full tracking-wider self-start sm:self-center ${formData.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {formData.countInStock > 0 ? 'STATUS: IN STOCK' : 'STATUS: OUT OF STOCK'}
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 4: Attributes */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Custom Attributes <span className="font-bold text-red-500"> (Skip this tab, Go Next)</span></h3>
                      <p className="text-sm text-gray-500 mt-1">Add specifications tailored for this product type (e.g., Fabric, Shelf Life, Material).</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAttribute}
                      className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors text-sm"
                    >
                      <FiPlus /> Add Attribute
                    </button>
                  </div>

                  {formData.attributes.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                      <FiLayers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No custom attributes added yet.</p>
                      <p className="text-xs text-gray-400 mt-1">Attributes provide structured highlights for customer transparency.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                      {formData.attributes.map((attr, idx) => (
                        <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={attr.name}
                              onChange={(e) => handleAttributeChange(idx, 'name', e.target.value)}
                              placeholder="Attribute Name (e.g. Fabric)"
                              className="input-field p-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                            />
                            <input
                              type="text"
                              value={attr.value}
                              onChange={(e) => handleAttributeChange(idx, 'value', e.target.value)}
                              placeholder="Attribute Value (e.g. 100% Organic Cotton)"
                              className="input-field p-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttribute(idx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-lg transition-colors flex-shrink-0"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: Variants */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      {/* <h2 className="text-2xl font-bold text-gray-900 text-red-500">Ignore this Tab (go Next)</h2> */}
                      <h3 className="text-2xl font-bold text-gray-900">Product Variants <span className="font-bold text-red-500"> (If Variant available, fill else skip. Go next)</span></h3>
                      <p className="text-sm text-gray-500 mt-1">Configure options like color, size, pricing, and stock per variant.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors text-sm"
                    >
                      <FiPlus /> Add Variant
                    </button>
                  </div>

                  {formData.variants.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                      <FiSliders className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Single product structure active (no variations).</p>
                      <p className="text-xs text-gray-400 mt-1">Add variations if you sell the item in multiple colors, sizes, or custom tiers.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                      {formData.variants.map((v, idx) => (
                        <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 relative space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-700">Variant #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(idx)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-1">Variant Name</label>
                              <input
                                type="text"
                                value={v.name}
                                onChange={(e) => handleVariantChange(idx, 'name', e.target.value)}
                                placeholder="e.g. Premium Saree"
                                className="input-field w-full p-2 border border-gray-300 rounded bg-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-1">Color</label>
                              <input
                                type="text"
                                value={v.color}
                                onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                                placeholder="e.g. Crimson Red"
                                className="input-field w-full p-2 border border-gray-300 rounded bg-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-1">Size</label>
                              <input
                                type="text"
                                value={v.size}
                                onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                                placeholder="e.g. 5.5m, XL"
                                className="input-field w-full p-2 border border-gray-300 rounded bg-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-1">Price (₹)</label>
                              <input
                                type="number"
                                value={v.price}
                                onChange={(e) => handleVariantChange(idx, 'price', e.target.value, true)}
                                placeholder="₹ Price"
                                className="input-field w-full p-2 border border-gray-300 rounded bg-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-1">Stock</label>
                              <input
                                type="number"
                                value={v.stock}
                                onChange={(e) => handleVariantChange(idx, 'stock', e.target.value, true)}
                                placeholder="Quantity"
                                className="input-field w-full p-2 border border-gray-300 rounded bg-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-1">SKU</label>
                              <div className="flex gap-1">
                                <input
                                  type="text"
                                  value={v.sku}
                                  onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                                  placeholder="SKU"
                                  className="input-field flex-1 p-2 border border-gray-300 rounded bg-white text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleGenerateVariantSKU(idx)}
                                  title="Auto-Generate SKU"
                                  className="bg-gray-200 text-gray-600 px-2 rounded hover:bg-gray-300 font-bold text-xs"
                                >
                                  ⚡
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6: Tab Details */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Dynamic Tab Details</h3>
                      <p className="text-sm text-gray-500 mt-1">Configure premium, structured layouts for each tab page.</p>
                    </div>
                    {/* Tab Selector */}
                    <div className="flex bg-gray-100 p-1.5 rounded-xl border">
                      {[
                        { id: 'aboutThisItem', label: 'About this Item' },
                        { id: 'productInformation', label: 'Product Information' },
                        { id: 'fromTheBrand', label: 'From the Brand' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveRichTab(tab.id)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeRichTab === tab.id
                            ? 'bg-white text-primary-600 shadow-sm border'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add Section Buttons Bar */}
                  <div className="flex flex-wrap gap-3 bg-primary-50/50 p-4 rounded-xl border border-primary-100">
                    <span className="text-xs font-bold text-primary-800 self-center">Add new section block:</span>
                    <button
                      type="button"
                      onClick={() => handleAddRichSection('format1')}
                      className="bg-white hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-lg border text-xs font-bold shadow-sm flex items-center gap-1.5"
                    >
                      <FiPlus className="w-3.5 h-3.5 text-primary-600" /> Standard Block
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddRichSection('format2')}
                      className="bg-white hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-lg border text-xs font-bold shadow-sm flex items-center gap-1.5"
                    >
                      <FiPlus className="w-3.5 h-3.5 text-primary-600" /> Multi-Detail Block
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddRichSection('format3')}
                      className="bg-white hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-lg border text-xs font-bold shadow-sm flex items-center gap-1.5"
                    >
                      <FiPlus className="w-3.5 h-3.5 text-primary-600" /> Key-Value Table Block
                    </button>
                  </div>

                  {/* Sections List */}
                  {(formData[activeRichTab] || []).length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                      <FiLayout className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No sections added to this tab yet.</p>
                      <p className="text-xs text-gray-400 mt-1">Select one of the block formats above to start structuring this tab's content.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                      {(formData[activeRichTab] || []).map((section, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative space-y-4">
                          {/* Section Header */}
                          <div className="flex justify-between items-center bg-gray-50 -mx-5 -mt-5 px-5 py-3 rounded-t-2xl border-b">
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                              Section #{idx + 1} - {section.type === 'format1' ? 'Standard Block' : section.type === 'format2' ? 'Multi-Detail Block' : 'Key-Value Table Block'}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleMoveRichSection(idx, 'up')}
                                disabled={idx === 0}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1.5 rounded"
                                title="Move Up"
                              >
                                <FiArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveRichSection(idx, 'down')}
                                disabled={idx === (formData[activeRichTab] || []).length - 1}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1.5 rounded"
                                title="Move Down"
                              >
                                <FiArrowDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveRichSection(idx)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded"
                                title="Delete Section"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Section Fields */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1">Section Heading *</label>
                              <input
                                type="text"
                                value={section.heading}
                                onChange={(e) => handleRichSectionChange(idx, 'heading', e.target.value)}
                                placeholder="Enter section main heading"
                                className="input-field w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                                required
                              />
                            </div>

                            {/* Format 1 Fields */}
                            {section.type === 'format1' && (
                              <div className="grid grid-cols-1 gap-4 bg-gray-50/50 p-4 rounded-xl border">
                                <div>
                                  <label className="block text-xs font-bold text-gray-600 mb-1">Subheading (Optional)</label>
                                  <input
                                    type="text"
                                    value={section.subheading || ''}
                                    onChange={(e) => handleRichSectionChange(idx, 'subheading', e.target.value)}
                                    placeholder="Enter section subheading"
                                    className="input-field w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-gray-600 mb-1">Description *</label>
                                  <textarea
                                    value={section.description || ''}
                                    onChange={(e) => handleRichSectionChange(idx, 'description', e.target.value)}
                                    placeholder="Enter detailed description content..."
                                    rows="4"
                                    className="input-field w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                                    required
                                  />
                                </div>
                              </div>
                            )}

                            {/* Format 2 Fields */}
                            {section.type === 'format2' && (
                              <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-gray-600">Subsections Details</span>
                                  <button
                                    type="button"
                                    onClick={() => handleAddRichSubsection(idx, 'format2')}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1"
                                  >
                                    <FiPlus /> Add Subsection
                                  </button>
                                </div>
                                <div className="space-y-4">
                                  {(section.subsections || []).map((sub, sidx) => (
                                    <div key={sidx} className="bg-white p-4 rounded-lg border relative space-y-3">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveRichSubsection(idx, sidx)}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1"
                                      >
                                        <FiX className="w-4 h-4" />
                                      </button>
                                      <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Subsection Subheading *</label>
                                        <input
                                          type="text"
                                          value={sub.subheading || ''}
                                          onChange={(e) => handleRichSubsectionChange(idx, sidx, 'subheading', e.target.value)}
                                          placeholder="e.g. Dimensions"
                                          className="input-field w-full p-2 border border-gray-300 rounded text-xs"
                                          required
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Subsection Description *</label>
                                        <textarea
                                          value={sub.description || ''}
                                          onChange={(e) => handleRichSubsectionChange(idx, sidx, 'description', e.target.value)}
                                          placeholder="e.g. Detailed measurements of the product..."
                                          rows="2"
                                          className="input-field w-full p-2 border border-gray-300 rounded text-xs"
                                          required
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Format 3 Fields */}
                            {section.type === 'format3' && (
                              <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-gray-600">Subsections with Key-Value Table</span>
                                  <button
                                    type="button"
                                    onClick={() => handleAddRichSubsection(idx, 'format3')}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1"
                                  >
                                    <FiPlus /> Add Table Subsection
                                  </button>
                                </div>
                                <div className="space-y-4">
                                  {(section.subsections || []).map((sub, sidx) => (
                                    <div key={sidx} className="bg-white p-4 rounded-lg border relative space-y-3">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveRichSubsection(idx, sidx)}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1"
                                      >
                                        <FiX className="w-4 h-4" />
                                      </button>
                                      <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Table Subheading (Optional)</label>
                                        <input
                                          type="text"
                                          value={sub.subheading || ''}
                                          onChange={(e) => handleRichSubsectionChange(idx, sidx, 'subheading', e.target.value)}
                                          placeholder="e.g. Product Specifications"
                                          className="input-field w-full p-2 border border-gray-300 rounded text-xs"
                                        />
                                      </div>

                                      {/* Key-Value Table rows */}
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                          <span className="text-[10px] font-bold text-gray-500">Table Data Rows</span>
                                          <button
                                            type="button"
                                            onClick={() => handleAddRichTableDataRow(idx, sidx)}
                                            className="text-[10px] text-primary-600 hover:text-primary-700 font-bold flex items-center gap-0.5"
                                          >
                                            <FiPlus className="w-3 h-3" /> Add Row
                                          </button>
                                        </div>
                                        <div className="space-y-2">
                                          {(sub.tableData || []).map((row, ridx) => (
                                            <div key={ridx} className="flex gap-2 items-center">
                                              <input
                                                type="text"
                                                value={row.key || ''}
                                                onChange={(e) => handleRichTableDataRowChange(idx, sidx, ridx, 'key', e.target.value)}
                                                placeholder="Key (e.g. Material)"
                                                className="input-field flex-1 p-2 border border-gray-300 rounded text-xs"
                                                required
                                              />
                                              <input
                                                type="text"
                                                value={row.value || ''}
                                                onChange={(e) => handleRichTableDataRowChange(idx, sidx, ridx, 'value', e.target.value)}
                                                placeholder="Value (e.g. Brass)"
                                                className="input-field flex-1 p-2 border border-gray-300 rounded text-xs"
                                                required
                                              />
                                              <button
                                                type="button"
                                                onClick={() => handleRemoveRichTableDataRow(idx, sidx, ridx)}
                                                className="text-red-400 hover:text-red-600 p-1"
                                                title="Delete Row"
                                              >
                                                <FiTrash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 7: Shipping & SEO */}
              {currentStep === 7 && (
                <div className="space-y-8">
                  {/* Shipping Section */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 pb-2 border-b">Shipping & Dimensions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.shipping.weight}
                          onChange={(e) => handleNestedChange('shipping', 'weight', e.target.value, true)}
                          className="input-field w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Length (cm)</label>
                        <input
                          type="number"
                          value={formData.shipping.length}
                          onChange={(e) => handleNestedChange('shipping', 'length', e.target.value, true)}
                          className="input-field w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Width (cm)</label>
                        <input
                          type="number"
                          value={formData.shipping.width}
                          onChange={(e) => handleNestedChange('shipping', 'width', e.target.value, true)}
                          className="input-field w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Height (cm)</label>
                        <input
                          type="number"
                          value={formData.shipping.height}
                          onChange={(e) => handleNestedChange('shipping', 'height', e.target.value, true)}
                          className="input-field w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Shipping Class</label>
                        <select
                          value={formData.shipping.shippingClass}
                          onChange={(e) => handleNestedChange('shipping', 'shippingClass', e.target.value)}
                          className="input-field w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white"
                        >
                          <option value="Standard">Standard Delivery</option>
                          <option value="Express">Express Freight</option>
                          <option value="Heavy">Heavy Goods</option>
                          <option value="Fragile">Fragile Handling</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SEO Section */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 pb-2 border-b">Search Engine Optimization (SEO)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Meta Title</label>
                        <input
                          type="text"
                          value={formData.seo.metaTitle}
                          onChange={(e) => handleNestedChange('seo', 'metaTitle', e.target.value)}
                          placeholder="Search engine optimized listing title..."
                          className="input-field w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Meta Keywords</label>
                        <input
                          type="text"
                          value={formData.seo.metaKeywords}
                          onChange={(e) => handleNestedChange('seo', 'metaKeywords', e.target.value)}
                          placeholder="Comma-separated keywords (e.g. banarasi, silk, saree, handloom)..."
                          className="input-field w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Meta Description</label>
                        <textarea
                          value={formData.seo.metaDescription}
                          onChange={(e) => handleNestedChange('seo', 'metaDescription', e.target.value)}
                          placeholder="Search snippet summary displayed below the link on search results..."
                          rows="3"
                          className="input-field w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 8: Review & Publish */}
              {currentStep === 8 && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-gray-900 pb-2 border-b">Review & Publish</h3>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column Summary Cards */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Card 1: Core details */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h4 className="font-bold text-gray-800 border-b pb-2 mb-3">Product Overview</h4>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <dt className="text-gray-400 font-medium">Name</dt>
                            <dd className="text-gray-900 font-semibold">{formData.name}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-400 font-medium">Category</dt>
                            <dd className="text-gray-900 font-semibold">{formData.category}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-400 font-medium">Base Price</dt>
                            <dd className="text-gray-900 font-bold text-primary-600">₹{formData.price}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-400 font-medium">Base SKU</dt>
                            <dd className="text-gray-900 font-mono font-bold">{formData.sku || 'N/A'}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-400 font-medium">Global Stock</dt>
                            <dd className="text-gray-900 font-semibold">{formData.countInStock} units</dd>
                          </div>
                          <div>
                            <dt className="text-gray-400 font-medium">Default Size</dt>
                            <dd className="text-gray-900 font-semibold">{formData.size || 'N/A'}</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Card 2: Custom attributes */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h4 className="font-bold text-gray-800 border-b pb-2 mb-3">Custom Attributes ({formData.attributes.length})</h4>
                        {formData.attributes.length === 0 ? (
                          <p className="text-sm text-gray-400">No specifications added.</p>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                            {formData.attributes.map((attr, idx) => (
                              <div key={idx} className="bg-white p-2 rounded border border-gray-100 shadow-sm">
                                <span className="text-[10px] text-gray-400 uppercase font-semibold block">{attr.name || 'Untitled'}</span>
                                <span className="text-gray-700 font-semibold">{attr.value || 'N/A'}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card 3: Variants */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h4 className="font-bold text-gray-800 border-b pb-2 mb-3">Product Variations ({formData.variants.length})</h4>
                        {formData.variants.length === 0 ? (
                          <p className="text-sm text-gray-400">Single stock item. No variations created.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-xs text-left bg-white border rounded-lg overflow-hidden">
                              <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                  <th className="p-2.5">Name</th>
                                  <th className="p-2.5">Color</th>
                                  <th className="p-2.5">Size</th>
                                  <th className="p-2.5">Price</th>
                                  <th className="p-2.5">Stock</th>
                                  <th className="p-2.5">SKU</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y text-gray-700">
                                {formData.variants.map((v, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50">
                                    <td className="p-2.5 font-medium">{v.name || 'N/A'}</td>
                                    <td className="p-2.5">{v.color || 'N/A'}</td>
                                    <td className="p-2.5">{v.size || 'N/A'}</td>
                                    <td className="p-2.5 font-bold">₹{v.price}</td>
                                    <td className="p-2.5 font-semibold">{v.stock}</td>
                                    <td className="p-2.5 font-mono">{v.sku || 'N/A'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Card 4: Tab Content Summary */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h4 className="font-bold text-gray-800 border-b pb-2 mb-3">Rich Tab Content Summary</h4>
                        <dl className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <dt className="text-gray-400 font-medium">About this Item</dt>
                            <dd className="text-gray-900 font-bold">{(formData.aboutThisItem || []).length} sections</dd>
                          </div>
                          <div>
                            <dt className="text-gray-400 font-medium">Product Info</dt>
                            <dd className="text-gray-900 font-bold">{(formData.productInformation || []).length} sections</dd>
                          </div>
                          <div>
                            <dt className="text-gray-400 font-medium">From the Brand</dt>
                            <dd className="text-gray-900 font-bold">{(formData.fromTheBrand || []).length} sections</dd>
                          </div>
                        </dl>
                      </div>

                    </div>

                    {/* Right Column Summary Cards (Media, SEO & Shipping) */}
                    <div className="space-y-6">
                      {/* Media Card */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h4 className="font-bold text-gray-800 border-b pb-2 mb-3">Uploaded Images</h4>
                        {formData.images.filter(img => img).length === 0 ? (
                          <p className="text-sm text-gray-400">No images uploaded.</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {formData.images.filter(img => img).map((img, idx) => (
                              <img key={idx} src={img} alt="" className="w-full h-20 object-contain bg-white rounded border p-1" />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Shipping & SEO Card */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-sm space-y-4">
                        <div>
                          <h4 className="font-bold text-gray-800 border-b pb-2 mb-2">Shipping Information</h4>
                          <p className="text-gray-600">Weight: <strong>{formData.shipping.weight} kg</strong></p>
                          <p className="text-gray-600">Dimensions: <strong>{formData.shipping.length}x{formData.shipping.width}x{formData.shipping.height} cm</strong></p>
                          <p className="text-gray-600">Class: <strong>{formData.shipping.shippingClass}</strong></p>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 border-b pb-2 mb-2">SEO Status</h4>
                          <p className="text-gray-600 text-xs">Meta Title: <span className="font-semibold">{formData.seo.metaTitle || 'Default'}</span></p>
                          <p className="text-gray-600 text-xs truncate">Keywords: <span className="font-mono">{formData.seo.metaKeywords || 'None'}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Wizard Navigation Footer */}
        <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-800 bg-white border border-gray-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronLeft /> Previous
          </button>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-primary-200 transition-all"
            >
              Next <FiChevronRight />
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary-200 flex items-center gap-1.5 transition-all"
              >
                <FiSave /> {isEdit ? 'Update & Publish' : 'Submit & Publish'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCreateEdit;