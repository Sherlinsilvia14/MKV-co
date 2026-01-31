import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ShoppingBag, User, Menu, X, ArrowRight } from 'lucide-react';
import AuthModal from '../components/Auth/AuthModal';
import { useLanguage } from '../context/LanguageContext';

// Import assets
import dhotiImg from '../assets/dhoti.png';
import madisarImg from '../assets/madisar.png';
import cottonImg from '../assets/cotton.png';

const LandingPage = () => {
    const [isSignupOpen, setSignupOpen] = useState(false);
    const [initialAuthMode, setInitialAuthMode] = useState('signup'); // 'signup', 'login', 'admin'
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { language, toggleLanguage, t } = useLanguage();

    const openAuth = (mode = 'signup') => {
        setInitialAuthMode(mode);
        setSignupOpen(true);
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    const Navbar = () => (
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#800000]/10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="w-10 h-10 bg-[#800000] rounded-full flex items-center justify-center text-[#FDFBF7] font-['Cinzel'] font-bold text-xl border-2 border-[#D4AF37]">
                            M
                        </div>
                        <div className="flex flex-col">
                            <span className="font-['Cinzel'] font-bold text-[#800000] text-lg leading-none">MKV & CO</span>
                            <span className="text-[10px] text-[#D4AF37] tracking-[0.2em] font-semibold">EST. 1980</span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {['home', 'history', 'about', 'products'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item)}
                                className="text-[#5a2e2e] hover:text-[#800000] font-medium transition-colors uppercase text-sm tracking-wide"
                            >
                                {t('nav', item)}
                            </button>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 text-[#800000] hover:bg-[#800000]/5 transition-all text-sm font-medium"
                        >
                            <Globe size={16} />
                            <span>{language === 'en' ? 'EN' : 'TA'}</span>
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openAuth('login')}
                            className="bg-[#800000] text-white px-6 py-2 rounded-full font-['Cinzel'] shadow-lg hover:bg-[#600000] transition-colors flex items-center gap-2"
                        >
                            <User size={16} />
                            {t('nav', 'login')}
                        </motion.button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 p-2 text-[#800000]"
                        >
                            <Globe size={20} />
                            <span className="text-xs font-bold">{language === 'en' ? 'EN' : 'TA'}</span>
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-[#800000]"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {['home', 'history', 'about', 'products'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item)}
                                className="block w-full text-left px-3 py-4 text-base font-medium text-[#5a2e2e] hover:bg-[#800000]/5 hover:text-[#800000] border-b border-gray-50"
                            >
                                {t('nav', item)}
                            </button>
                        ))}
                        <button
                            onClick={() => {
                                setSignupOpen(true);
                                setMobileMenuOpen(false);
                            }}
                            className="w-full mt-4 bg-[#800000] text-white py-3 rounded-lg font-bold"
                        >
                            {t('nav', 'login')}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );

    const Hero = () => (
        <section id="home" className="relative h-screen flex items-center justify-center pt-20 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23800000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Soft Gradient Blob */}
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#800000]/10 rounded-full blur-[100px]" />

            <div className="relative z-10 text-center max-w-4xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-[1px] w-12 md:w-24 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                        <span className="text-[#D4AF37] tracking-[0.3em] uppercase font-['Cinzel'] font-semibold text-sm md:text-base">Since 1980</span>
                        <div className="h-[1px] w-12 md:w-24 bg-gradient-to-l from-transparent to-[#D4AF37]" />
                    </div>

                    <h1 className="font-['Cinzel'] text-5xl md:text-7xl font-bold text-[#800000] mb-8 leading-tight">
                        MKV & CO
                    </h1>

                    <p className="text-[#5a2e2e] font-['Crimson_Text'] text-xl md:text-2xl italic leading-relaxed mb-12 max-w-2xl mx-auto">
                        {t('landing', 'quote')}
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scrollToSection('products')}
                        className="bg-transparent border-2 border-[#800000] text-[#800000] px-8 py-3 rounded-full font-['Cinzel'] font-bold hover:bg-[#800000] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
                    >
                        Explore Collection
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );

    const SectionTitle = ({ title, subtitle }) => (
        <div className="text-center mb-16">
            <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-[#800000] mb-3 relative inline-block">
                {title}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[#D4AF37]" />
            </h2>
            {subtitle && <p className="text-[#5a2e2e]/70 mt-4 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
    );

    const HistorySection = () => (
        <section id="history" className="py-24 bg-[#FDFBF7] relative">
            <div className="max-w-7xl mx-auto px-6">
                <SectionTitle title={t('history', 'title')} />

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-[#800000] rounded-2xl rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500" />
                            <img
                                src={cottonImg}
                                alt="History"
                                className="relative rounded-2xl shadow-xl w-full h-[400px] object-cover border border-[#D4AF37]/20"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <p className="text-xl leading-loose font-['Crimson_Text'] text-[#4a3b3b]">
                            {t('history', 'content')}
                        </p>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <span className="font-['Cinzel'] text-3xl text-[#D4AF37] font-bold">40+</span>
                                <span className="text-sm uppercase tracking-wider text-[#800000]">Years</span>
                            </div>
                            <div className="w-[1px] bg-[#D4AF37]/50" />
                            <div className="flex flex-col items-center">
                                <span className="font-['Cinzel'] text-3xl text-[#D4AF37] font-bold">10k+</span>
                                <span className="text-sm uppercase tracking-wider text-[#800000]">Customers</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );

    const AboutSection = () => (
        <section id="about" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="order-2 md:order-1"
                    >
                        <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-[#800000] mb-6">
                            {t('about', 'title')}
                        </h2>
                        <p className="text-xl leading-loose font-['Crimson_Text'] text-[#4a3b3b] mb-8">
                            {t('about', 'content')}
                        </p>

                        <button className="flex items-center gap-2 text-[#800000] font-bold hover:gap-4 transition-all">
                            Read Our Story <ArrowRight size={18} />
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="order-1 md:order-2"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <img src={madisarImg} alt="Saree" className="rounded-lg shadow-lg w-full h-48 object-cover translate-y-8" />
                            <img src={dhotiImg} alt="Dhoti" className="rounded-lg shadow-lg w-full h-48 object-cover" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );

    const ProductCard = ({ title, img, price, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="group cursor-pointer"
        >
            <div className="relative overflow-hidden rounded-xl mb-4 h-[350px]">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-[#800000] px-6 py-2 rounded-full font-bold opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 z-20 whitespace-nowrap shadow-lg">
                    View Details
                </button>
            </div>
            <div className="text-center">
                <h3 className="font-['Cinzel'] text-xl font-bold text-[#2d1b1b] group-hover:text-[#800000] transition-colors">{title}</h3>
                <p className="text-[#D4AF37] font-medium mt-1">Premium Collection</p>
            </div>
        </motion.div>
    );

    const ProductsSection = () => (
        <section id="products" className="py-24 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-6">
                <SectionTitle title={t('products', 'title')} subtitle="Handpicked traditions for the modern soul" />

                <div className="grid md:grid-cols-3 gap-8">
                    <ProductCard
                        title={t('products', 'dhoti')}
                        img={dhotiImg}
                        delay={0}
                    />
                    <ProductCard
                        title={t('products', 'madisar')}
                        img={madisarImg}
                        delay={0.2}
                    />
                    <ProductCard
                        title={t('products', 'cotton')}
                        img={cottonImg}
                        delay={0.4}
                    />
                </div>
            </div>
        </section>
    );

    const Footer = () => (
        <footer className="bg-[#1a0f0f] text-white py-12 border-t border-[#D4AF37]/30">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="font-['Cinzel'] text-2xl font-bold mb-4">MKV & CO</div>
                <div className="flex justify-center gap-6 mb-8 text-neutral-400">
                    <a href="#" className="hover:text-[#D4AF37] transition-colors">{t('nav', 'home')}</a>
                    <a href="#" className="hover:text-[#D4AF37] transition-colors">{t('nav', 'history')}</a>
                    <a href="#" className="hover:text-[#D4AF37] transition-colors">{t('nav', 'about')}</a>
                    <a href="#" className="hover:text-[#D4AF37] transition-colors">{t('nav', 'products')}</a>
                </div>
                <div className="flex flex-col items-center gap-4 text-neutral-500 text-sm">
                    <p>© {new Date().getFullYear()} MKV & Co. All rights reserved.</p>
                    <button
                        onClick={() => openAuth('admin')}
                        className="text-[#D4AF37]/50 hover:text-[#D4AF37] text-xs uppercase tracking-widest transition-colors"
                    >
                        {t('auth', 'adminPortal')}
                    </button>
                </div>
            </div>
        </footer>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#800000] selection:text-white">
            <Navbar />
            <main>
                <Hero />
                <HistorySection />
                <AboutSection />
                <ProductsSection />
            </main>
            <Footer />

            <AuthModal
                isOpen={isSignupOpen}
                onClose={() => setSignupOpen(false)}
                mode={initialAuthMode}
            />
        </div>
    );
};

export default LandingPage;
