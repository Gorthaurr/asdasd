import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    const year = new Date().getFullYear();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <footer className={`animated-footer ${isVisible ? 'visible' : ''}`}>
            {/* Плавающие элементы фона */}
            <div className="footer-bg-shapes">
                <div className="footer-shape shape-1"></div>
                <div className="footer-shape shape-2"></div>
                <div className="footer-shape shape-3"></div>
            </div>

            {/* Крутые частицы */}
            <div className="footer-particles">
                <div className="footer-particle"></div>
                <div className="footer-particle"></div>
                <div className="footer-particle"></div>
                <div className="footer-particle"></div>
                <div className="footer-particle"></div>
                <div className="footer-particle"></div>
            </div>

            {/* Волновые линии */}
            <div className="footer-waves">
                <div className="footer-wave"></div>
                <div className="footer-wave"></div>
                <div className="footer-wave"></div>
            </div>

            {/* Геометрические фигуры */}
            <div className="footer-geometry">
                <div className="geometry-shape triangle"></div>
                <div className="geometry-shape square"></div>
                <div className="geometry-shape circle"></div>
                <div className="geometry-shape diamond"></div>
            </div>

            {/* Световые эффекты */}
            <div className="footer-lights">
                <div className="light-beam"></div>
                <div className="light-beam"></div>
                <div className="light-beam"></div>
            </div>

            <div className="footer-content">
                {/* Основная секция */}
                <div className="footer-main">
                    {/* Бренд */}
                    <div className="footer-brand">
                        <h3 className="brand-title">TechHome</h3>
                        <p className="brand-subtitle">Бытовая техника для дома</p>
                    </div>

                    {/* Социальные сети */}
                    <div className="footer-social">
                        <h4 className="social-title">Мы в соцсетях</h4>
                        <div className="social-icons">
                            <a 
                                href="#" 
                                className="social-icon animated-social-icon"
                                aria-label="Telegram"
                                title="Telegram"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path 
                                        d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="social-ripple"></div>
                            </a>

                            <a 
                                href="#" 
                                className="social-icon animated-social-icon"
                                aria-label="Instagram"
                                title="Instagram"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="2"/>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <div className="social-ripple"></div>
                            </a>

                            <a 
                                href="#" 
                                className="social-icon animated-social-icon"
                                aria-label="TikTok"
                                title="TikTok"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path 
                                        d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="social-ripple"></div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Нижняя секция */}
                <div className="footer-bottom">
                    <div className="footer-links">
                        <Link to="/" className="footer-link">Каталог</Link>
                        <a href="#" className="footer-link">Доставка</a>
                        <a href="#" className="footer-link">Поддержка</a>
                    </div>
                    
                    <div className="footer-copyright">
                        <span>© {year} TechHome</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
