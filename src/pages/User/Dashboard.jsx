import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Filter, LogOut, Globe, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';

// Simple Star Icon for the rating (Defined before use)
const Star = ({ size, fill }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

// Mock Data
const categories = ['All', 'Men', 'Women', 'Accessories'];
const allFabrics = ['Cotton', 'Silk', 'Linen', 'Wool', 'Polyester', 'Rayon'];

const Dashboard = () => {
    const navigate = useNavigate();
    const { t, language, toggleLanguage } = useLanguage();
    const { addToCart, cart } = useCart();

    // State
    const [activeCategory, setActiveCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        setLoading(true);
        fetch('/api/products')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch products');
                return res.json();
            })
            .then(data => {
                setProducts(data);
                setError(null);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Check server connection.");
            })
            .finally(() => setLoading(false));
    }, []);

    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
    const [selectedFabrics, setSelectedFabrics] = useState([]);

    const cartCount = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;

    // ... (useEffect remains same) ...

    const toggleFabric = (fabric) => {
        setSelectedFabrics(prev =>
            prev.includes(fabric)
                ? prev.filter(f => f !== fabric)
                : [...prev, fabric]
        );
    };

    const clearFilters = () => {
        setPriceRange({ min: 0, max: 50000 });
        setSelectedFabrics([]);
    };

    // Safety check for products
    const safeProducts = Array.isArray(products) ? products : [];

    const filteredProducts = safeProducts.filter(product => {
        // ... (rest of logic)
        // 1. Category Filter
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;

        // 2. Price Filter
        const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;

        // 3. Fabric Filter (Search in Name and Description)
        const matchesFabric = selectedFabrics.length === 0 || selectedFabrics.some(fabric =>
            product.name.toLowerCase().includes(fabric.toLowerCase()) ||
            product.description.toLowerCase().includes(fabric.toLowerCase())
        );

        return matchesCategory && matchesPrice && matchesFabric;
    });

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#3d0000] font-serif selection:bg-[#800000] selection:text-white pb-12">

            {/* Filter Modal/Panel */}
            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] overflow-y-auto border-l border-[#800000]/10"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-['Cinzel'] font-bold text-[#800000]">Filters</h3>
                                    <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X size={24} className="text-gray-500" />
                                    </button>
                                </div>

                                {/* Price Range */}
                                <div className="mb-8">
                                    <h4 className="font-bold text-[#3d0000] mb-4 uppercase text-xs tracking-wider">Price Range (₹)</h4>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-[#800000] outline-none"
                                            placeholder="Min"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-[#800000] outline-none"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>

                                {/* Fabrics */}
                                <div className="mb-8">
                                    <h4 className="font-bold text-[#3d0000] mb-4 uppercase text-xs tracking-wider">Fabrics</h4>
                                    <div className="space-y-3">
                                        {allFabrics.map(fabric => (
                                            <label key={fabric} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedFabrics.includes(fabric) ? 'bg-[#800000] border-[#800000]' : 'border-gray-300 group-hover:border-[#800000]'}`}>
                                                    {selectedFabrics.includes(fabric) && <Check size={12} className="text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedFabrics.includes(fabric)}
                                                    onChange={() => toggleFabric(fabric)}
                                                />
                                                <span className={`${selectedFabrics.includes(fabric) ? 'text-[#800000] font-bold' : 'text-gray-600'}`}>{fabric}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={clearFilters}
                                        className="w-1/2 py-3 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="w-1/2 py-3 rounded-xl bg-[#800000] text-white font-bold hover:bg-[#600000] transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Background Pattern */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23800000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#800000]/10 shadow-sm px-6 py-4">
                <div className="container mx-auto flex justify-between items-center">

                    {/* Brand */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="w-10 h-10 bg-[#800000] rounded-full flex items-center justify-center text-[#FDFBF7]">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-['Cinzel'] font-bold text-[#800000] leading-none">MKV</h1>
                            <span className="text-[10px] tracking-[0.2em] font-sans font-bold text-[#D4AF37]">& CO</span>
                        </div>
                    </div>

                    {/* Desktop Categories */}
                    <div className="hidden md:flex items-center gap-2 bg-[#FDFBF7] p-1.5 rounded-full border border-[#800000]/10">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-[#800000] text-white shadow-md'
                                    : 'text-[#800000]/60 hover:text-[#800000] hover:bg-[#800000]/5'
                                    }`}
                            >
                                {t('dashboard', cat.toLowerCase())}
                            </button>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#800000] hover:bg-[#800000]/5 transition-colors font-medium text-sm"
                        >
                            <Globe size={18} />
                            <span>{language === 'en' ? 'EN' : 'TA'}</span>
                        </button>

                        {/* Cart Button */}
                        <button
                            onClick={() => navigate('/cart')}
                            className="relative p-2 text-[#800000] hover:bg-[#800000]/5 transition-colors rounded-full border border-[#800000]/10"
                        >
                            <ShoppingBag size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#800000] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <button className="p-2 text-[#800000]/70 hover:text-[#800000] transition-colors bg-[#FDFBF7] rounded-full border border-transparent hover:border-[#800000]/10">
                            <Search size={22} />
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-4 py-2 text-white bg-[#800000] rounded-lg hover:bg-[#600000] transition-all shadow-md hover:shadow-lg"
                        >
                            <span className="hidden sm:inline text-sm font-semibold tracking-wide">{t('dashboard', 'logout')}</span>
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Category Scroll */}
            <div className="md:hidden sticky top-[73px] z-40 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#800000]/5 py-3 overflow-x-auto px-4 scrollbar-hide">
                <div className="flex gap-3">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full text-sm whitespace-nowrap border transition-all ${activeCategory === cat
                                ? 'bg-[#800000] border-[#800000] text-white'
                                : 'border-[#800000]/20 text-[#800000]/70 bg-white'
                                }`}
                        >
                            {t('dashboard', cat.toLowerCase())}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 relative z-10">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-['Cinzel'] font-bold text-[#800000]">{t('dashboard', activeCategory.toLowerCase())} <span className="text-[#3d0000]">{t('dashboard', 'collections')}</span></h2>
                        <div className="h-1 w-24 bg-[#D4AF37] mt-2 rounded-full" />
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 text-sm font-semibold text-[#800000] bg-white px-4 py-2 rounded-lg border border-[#800000]/10 hover:shadow-md transition-all"
                    >
                        <Filter size={16} /> {t('dashboard', 'filters')}
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[#800000] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-[#800000] font-medium">Loading collection...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-500 font-bold mb-2">{error}</p>
                        <p className="text-gray-500 text-sm">Please try refreshing the page later.</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl font-serif">No products found matching your criteria.</p>
                        <button onClick={clearFilters} className="mt-4 text-[#800000] font-bold hover:underline">Clear Filters</button>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                    >
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={product.id || product._id}
                                className="group bg-white rounded-2xl overflow-hidden border border-[#800000]/10 shadow-sm hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-500"
                            >
                                <div className="aspect-[3/4] overflow-hidden relative bg-gray-100">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=No+Image'}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#3d0000]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 gap-2">
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="w-full bg-[#D4AF37] text-[#3d0000] font-bold text-sm py-3 rounded-xl hover:bg-white hover:text-[#800000] transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
                                        >
                                            {t('dashboard', 'addToCart')}
                                        </button>
                                        <button
                                            onClick={() => navigate(`/product/${product._id || product.id}`, { state: { product } })}
                                            className="w-full bg-white text-[#800000] font-bold text-sm py-3 rounded-xl hover:bg-[#D4AF37] hover:text-[#3d0000] transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-serif font-semibold text-[#3d0000] truncate group-hover:text-[#800000] transition-colors">{product.name}</h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-[#800000] font-bold text-lg">₹{product.price}</p>
                                        <div className="flex text-[#D4AF37]">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill="currentColor" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
