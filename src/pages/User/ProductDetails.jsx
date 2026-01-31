import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Send, Minus, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(location.state?.product || null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(!product);
    const [address, setAddress] = useState(() => {
        const user = JSON.parse(localStorage.getItem('current_user') || '{}');
        return user.address || '';
    });

    useEffect(() => {
        if (!product) {
            fetch(`http://localhost:5000/api/products/${id}`)
                .then(res => res.json())
                .then(data => {
                    setProduct(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching product:", err);
                    setLoading(false);
                });
        }
    }, [id, product]);

    const handleWhatsAppBuy = () => {
        if (!address.trim()) {
            alert("Please enter your delivery address");
            return;
        }
        const text = `*Order Request*%0A%0A*Product:* ${product.name}%0A*Price:* ₹${product.price}%0A*Quantity:* ${quantity}%0A*Total:* ₹${product.price * quantity}%0A%0A*Customer Address:* ${address}%0A%0A*Product Link:* ${window.location.origin}/product/${id}`;
        const url = `https://wa.me/7598137660?text=${text}`;
        window.open(url, '_blank');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold uppercase">Product Not Found</div>;

    const imageUrl = product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`;

    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-12">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#800000]/10 px-6 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[#800000] font-semibold hover:gap-3 transition-all"
                    >
                        <ArrowLeft size={20} /> Back
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-['Cinzel'] font-bold text-[#800000]">Product Details</h1>
                        <div className="h-0.5 w-12 bg-[#D4AF37]" />
                    </div>
                    <div className="w-20" /> {/* Spacer */}
                </div>
            </nav>

            <div className="container mx-auto px-6 pt-12">
                <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#800000]/5">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative h-[500px] md:h-auto"
                    >
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    </motion.div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-8 md:p-12 flex flex-col justify-center"
                    >
                        <span className="text-[#D4AF37] font-['Cinzel'] font-bold tracking-widest text-sm uppercase mb-2">MKV & CO Premium</span>
                        <h2 className="text-4xl font-serif font-bold text-[#3d0000] mb-4 leading-tight">{product.name}</h2>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-3xl font-bold text-[#800000]">₹{product.price}</span>
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wider">In Stock</span>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8 text-lg italic">
                            {product.description || "A masterfully crafted piece from our traditional collection, blending heritage design with modern comfort."}
                        </p>

                        {/* Quantity Selector */}
                        <div className="mb-10">
                            <label className="block text-sm font-bold text-[#800000] uppercase tracking-wider mb-4">Select Quantity</label>
                            <div className="flex items-center gap-4 w-fit bg-[#FDFBF7] p-2 rounded-2xl border border-[#800000]/10">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-[#800000] hover:text-white transition-all text-[#800000]"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="w-12 text-center text-xl font-bold text-[#3d0000]">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-[#800000] hover:text-white transition-all text-[#800000]"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Address Confirmation */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-[#800000] uppercase tracking-wider mb-2">Delivery Address</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your full delivery address"
                                rows={3}
                                className="w-full bg-[#FDFBF7] border border-[#800000]/20 rounded-xl px-4 py-3 text-[#3d0000] focus:outline-none focus:border-[#800000] resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => addToCart({ ...product, quantity })}
                                className="flex items-center justify-center gap-3 bg-white text-[#800000] border-2 border-[#800000] py-4 rounded-2xl font-bold hover:bg-[#800000] hover:text-white transition-all shadow-lg"
                            >
                                <ShoppingBag size={20} />
                                Add to Cart
                            </button>
                            <button
                                onClick={handleWhatsAppBuy}
                                disabled={!address.trim()}
                                className="flex items-center justify-center gap-3 bg-[#D4AF37] text-[#3d0000] py-4 rounded-2xl font-bold hover:bg-[#b8952c] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={20} />
                                Buy Now via WhatsApp
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs font-bold text-[#800000]/60 uppercase tracking-widest">
                            <div className="flex items-center gap-2">✓ Pure Cotton</div>
                            <div className="flex items-center gap-2">✓ Hand Loom</div>
                            <div className="flex items-center gap-2">✓ Fast Delivery</div>
                            <div className="flex items-center gap-2">✓ Quality Check</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
