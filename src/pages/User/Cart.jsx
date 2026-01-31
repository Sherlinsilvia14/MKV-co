import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Trash2, Minus, Plus, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, removeFromCartOne, addToCart, clearCart } = useCart();
    const [address, setAddress] = useState(() => {
        const user = JSON.parse(localStorage.getItem('current_user') || '{}');
        return user.address || '';
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleBuyAll = () => {
        if (!address.trim()) {
            alert("Please enter your delivery address");
            return;
        }
        let text = `*New Order Request*%0A%0A`;
        cart.forEach((item, index) => {
            text += `*${index + 1}. ${item.name}*%0A   - Qty: ${item.quantity}%0A   - Price: ₹${item.price}%0A   - Total: ₹${item.price * item.quantity}%0A%0A`;
        });
        text += `*Order Subtotal: ₹${subtotal}*%0A%0A*Customer Address:* ${address}%0A%0A*Time:* ${new Date().toLocaleString()}`;

        const url = `https://wa.me/7598137660?text=${text}`;
        window.open(url, '_blank');
    };

    const updateQuantity = (item, delta) => {
        if (delta === -1 && item.quantity === 1) {
            removeFromCart(item.id);
        } else {
            // This is a simple shortcut: add item with 1 means increment inside context
            // actually the context addToCart increments if exists.
            // Let's manually handle it if context doesn't support decrement
            // For now, I'll just use what's there or refine context later.
            addToCart(item);
        }
    };

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
                        <h1 className="text-xl font-['Cinzel'] font-bold text-[#800000]">Shopping Cart</h1>
                        <div className="h-0.5 w-12 bg-[#D4AF37]" />
                    </div>
                    <button
                        onClick={clearCart}
                        className="text-sm font-bold text-red-600 hover:text-red-700 uppercase tracking-widest"
                    >
                        Clear All
                    </button>
                </div>
            </nav>

            <div className="container mx-auto px-6 pt-12">
                {cart.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border border-[#800000]/5 flex flex-col items-center">
                        <div className="w-24 h-24 bg-[#FDFBF7] rounded-full flex items-center justify-center text-[#800000]/20 mb-6">
                            <ShoppingBag size={48} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-[#3d0000] mb-4">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our premium collection and find something beautiful.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-[#800000] text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-[#600000] transition-all uppercase tracking-widest"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className="bg-white p-4 rounded-3xl border border-[#800000]/5 shadow-sm hover:shadow-md transition-all flex items-center gap-6"
                                    >
                                        <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.imageUrl.startsWith('http') ? item.imageUrl : item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-serif font-bold text-[#3d0000]">{item.name}</h3>
                                            <p className="text-[#800000] font-bold">₹{item.price}</p>
                                        </div>

                                        <div className="flex items-center gap-3 bg-[#FDFBF7] p-1.5 rounded-xl border border-[#800000]/5">
                                            <button
                                                onClick={() => removeFromCartOne(item.id || item._id)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-[#800000] shadow-sm hover:bg-[#800000]/5 transition-all"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-6 text-center font-bold text-[#3d0000]">{item.quantity}</span>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-[#800000] shadow-sm hover:bg-[#800000]/5 transition-all"
                                            >
                                                <Plus size={16} />
                                            </button>
                                            <div className="w-[1px] h-4 bg-[#800000]/10 mx-1" />
                                            <button
                                                onClick={() => removeFromCart(item.id || item._id)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-red-600 shadow-sm hover:bg-red-50 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl p-8 border border-[#800000]/5 shadow-2xl sticky top-24">
                                <h2 className="text-2xl font-serif font-bold text-[#3d0000] mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-500 font-medium font-sans">
                                        <span>Subtotal</span>
                                        <span className="text-[#3d0000]">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 font-medium font-sans">
                                        <span>Delivery</span>
                                        <span className="text-green-600 font-bold">FREE</span>
                                    </div>
                                    <div className="h-[1px] bg-gray-100 my-4" />
                                    <div className="flex justify-between text-xl font-bold text-[#800000]">
                                        <span>Total</span>
                                        <span>₹{subtotal}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-[#800000] uppercase tracking-wider mb-2">Delivery Address</label>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter your full delivery address"
                                        rows={2}
                                        className="w-full bg-[#FDFBF7] border border-[#800000]/20 rounded-xl px-4 py-3 text-sm text-[#3d0000] focus:outline-none focus:border-[#800000] resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleBuyAll}
                                    disabled={!address.trim()}
                                    className="w-full bg-[#800000] text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-[#600000] transition-all flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <MessageCircle size={22} />
                                    Place Order via WhatsApp
                                </button>

                                <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-widest leading-relaxed">
                                    By placing an order, you agree to our <br /> Terms of Service & Privacy Policy
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
