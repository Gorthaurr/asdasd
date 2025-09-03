/**
 * Страница товара: слева фото, справа краткие характеристики.
 *
 * Функциональность:
 * - «Подробнее» скроллит к полным характеристикам
 * - Клик по рейтингу — к отзывам
 * - Сердце — как в карточке (активная синяя заливка)
 * - Контроль количества: − qty +
 */

import { useMemo, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductQuery } from '../api/productsApi';
import { transformProduct } from '../utils/apiTransform';
import type { Product } from '../types/product';
import { fmtCurrency } from '../utils/format';
import { selectCartItems, selectFavIds } from '../features/catalog/selectors';
import { addToCart, changeQty } from '../features/cart/cartSlice';
import { toggleFav } from '../features/favs/favsSlice';

// Типы для внутренних компонентов
interface ProductSpec {
  label: string;
  value: string;
}

interface ProductReview {
  user: string;
  rating: number;
  text: string;
}

interface ProductDetails {
  mainSpecs: ProductSpec[];
  fullSpecs: ProductSpec[];
  description: string;
  reviews: ProductReview[];
}

/**
 * Компонент для отображения звездного рейтинга
 */
interface RatingStarsProps {
  rating: number;
  size?: number;
  className?: string;
  title?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 18,
  className = 'stars',
  title,
}) => {
  const stars = useMemo(() => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;

    return Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24">
        <path
          d="M12 3.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 18.6 6.2 21.3l1.1-6.4L2.6 10.3l6.5-.9 2.9-5.9z"
          fill={i < full ? 'currentColor' : i === full && half ? 'currentColor' : 'none'}
          opacity={i === full && half ? 0.5 : 1}
          stroke="currentColor"
          strokeWidth="0.8"
        />
      </svg>
    ));
  }, [rating, size]);

  return (
    <span
      className={className}
      aria-hidden="true"
      style={{ cursor: title ? 'pointer' : 'default' }}
      title={title}
    >
      {stars}
    </span>
  );
};

/**
 * Компонент для отображения изображения товара с fallback
 */
interface ProductImageProps {
  product: Product;
}

const ProductImage: React.FC<ProductImageProps> = ({ product }) => {
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const svg = target.previousElementSibling as SVGElement;
    if (svg) svg.style.display = 'block';
  }, []);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const svg = (e.target as HTMLImageElement).previousElementSibling as SVGElement;
    if (svg) svg.style.display = 'none';
  }, []);

  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="product-gallery">
      {/* SVG placeholder (fallback) */}
      <svg
        viewBox="0 0 800 600"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Изображение: ${product.name}`}
        style={{ display: hasImages ? 'none' : 'block' }}
      >
        <defs>
          <linearGradient id={`pg${product.id}`} x1="0" x2="1">
            <stop offset="0%" stopColor="#1c2340" />
            <stop offset="100%" stopColor="#0f1428" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill={`url(#pg${product.id})`} />
        <g fill="#6ea8fe" opacity="0.9">
          <rect x="220" y="140" width="360" height="260" rx="24" />
          <rect x="250" y="170" width="300" height="200" rx="12" fill="#182039" />
          <rect x="370" y="460" width="60" height="14" rx="7" fill="#7cf3d0" />
        </g>
      </svg>

      {/* Изображение товара */}
      {hasImages && product.images && (
        <img
          src={product.images[0].url}
          alt={product.images[0].alt_text || product.name}
          className="product-main-image"
          loading="eager"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
    </div>
  );
};

/**
 * Компонент для управления количеством товара
 */
interface QuantityControlProps {
  productId: number;
  quantity: number;
  onQuantityChange: (delta: number) => void;
  onAddToCart: () => void;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  productId,
  quantity,
  onQuantityChange,
  onAddToCart,
}) => {
  const handleDecrease = useCallback(() => {
    if (quantity > 0) {
      onQuantityChange(-1);
    }
  }, [quantity, onQuantityChange]);

  const handleIncrease = useCallback(() => {
    if (quantity === 0) {
      onAddToCart();
    } else {
      onQuantityChange(1);
    }
  }, [quantity, onQuantityChange, onAddToCart]);

  return (
    <div className="qty-inline" aria-label="Количество в корзине">
      <button
        className="animated-qty-btn"
        aria-label="Убрать одну штуку"
        onClick={handleDecrease}
        disabled={quantity === 0}
        title="➖ Убрать"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <span className="qty-count" aria-live="polite">
        {quantity}
      </span>
      <button
        className="animated-qty-btn"
        aria-label="Добавить одну штуку"
        onClick={handleIncrease}
        title="➕ Добавить"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

/**
 * Компонент для отображения отзывов
 */
interface ReviewsSectionProps {
  reviews: ProductReview[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => (
  <section id="reviews" className="panel" style={{ marginTop: 16 }}>
    <h2 style={{ marginTop: 0 }}>💬 Отзывы покупателей</h2>
    <div className="reviews">
      {reviews.map((review, index) => (
        <article key={index} className="review">
          <header>
            <strong>👤 {review.user}</strong>
            <RatingStars
              rating={review.rating}
              size={14}
              title={`⭐ ${review.rating} из 5`}
              className="stars"
            />
          </header>
          <p>💭 {review.text}</p>
        </article>
      ))}
    </div>
  </section>
);

/**
 * Компонент для отображения характеристик
 */
interface SpecificationsSectionProps {
  specs: ProductSpec[];
  title: string;
}

const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({ specs, title }) => (
  <section className="panel" style={{ marginTop: 16 }}>
    <h2 style={{ marginTop: 0 }}>{title}</h2>
    <dl className="full-specs">
      {specs.map((spec) => (
        <div key={spec.label} className="fs-row">
          <dt>{spec.label}</dt>
          <dd>{spec.value}</dd>
        </div>
      ))}
    </dl>
  </section>
);

/**
 * Основной компонент страницы товара
 *
 * Отображает полную информацию о товаре с возможностью:
 * - Просмотра изображений
 * - Управления количеством в корзине
 * - Добавления в избранное
 * - Просмотра характеристик и отзывов
 */
export default function ProductPage() {
  const { id } = useParams<{ id: string }>();

  // Запрос к API для получения товара
  const {
    data: apiProduct,
    isLoading,
    error,
  } = useGetProductQuery(id || '', {
    skip: !id,
  });

  // Преобразуем API данные в формат frontend
  const product = useMemo<Product | undefined>(() => {
    if (!apiProduct) return undefined;
    return transformProduct(apiProduct);
  }, [apiProduct]);

  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const favIds = useSelector(selectFavIds);

  const isFav = product ? favIds.includes(product.id) : false;
  const quantity = product ? (cart[product.id] ?? 0) : 0;

  const fullSpecsRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // Генерация данных о товаре
  const details = useMemo<ProductDetails | null>(() => {
    if (!product) return null;

    const mainSpecs: ProductSpec[] = [
      { label: 'Категория', value: product.category },
      { label: 'Модель', value: product.name },
      { label: 'Цена', value: fmtCurrency(product.price) },
      { label: 'Рейтинг', value: product.rating.toFixed(1) },
    ];

    const fullSpecs: ProductSpec[] = [
      { label: 'Питание', value: '220–240 В' },
      { label: 'Гарантия', value: '24 мес' },
      { label: 'Страна', value: 'ЕС' },
      { label: 'Артикул', value: `TH-${product.id.toString().padStart(5, '0')}` },
      { label: 'Материал корпуса', value: 'ABS пластик/металл' },
      { label: 'Комплектация', value: 'Базовый набор' },
      { label: 'Уровень шума', value: 'до 60 dB' },
      { label: 'Энергопотребление', value: 'A+' },
    ];

    const description =
      'Современная техника для ежедневных задач. Модель сочетает надёжность, удобство и лаконичный дизайн. Подходит для повседневного использования, проста в обслуживании.';

    const reviews: ProductReview[] = [
      { user: 'Алексей', rating: 5, text: 'Качество отличное, пользуемся каждый день.' },
      { user: 'Мария', rating: 4, text: 'Хорошая модель, доставка быстрая.' },
      { user: 'Иван', rating: 4, text: 'Цена/качество на уровне, рекомендую.' },
    ];

    return { mainSpecs, fullSpecs, description, reviews };
  }, [product]);

  // Обработчики событий
  const handleQuantityChange = useCallback(
    (delta: number) => {
      if (product) {
        dispatch(changeQty({ id: product.id, delta }));
      }
    },
    [dispatch, product]
  );

  const handleAddToCart = useCallback(() => {
    if (product) {
      dispatch(addToCart(product.id));
    }
  }, [dispatch, product]);

  const handleToggleFav = useCallback(() => {
    if (product) {
      dispatch(toggleFav(product.id));
    }
  }, [dispatch, product]);

  const smoothScrollTo = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    const y = element.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);

  const handleScrollToReviews = useCallback(() => {
    smoothScrollTo(reviewsRef.current);
  }, [smoothScrollTo]);

  const handleScrollToSpecs = useCallback(() => {
    smoothScrollTo(fullSpecsRef.current);
  }, [smoothScrollTo]);

  // Состояние загрузки
  if (isLoading) {
    return (
      <main className="container" style={{ padding: '24px 0' }}>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Загружаем товар...</p>
        </div>
      </main>
    );
  }

  // Состояние ошибки
  if (error || !product || !details) {
    return (
      <main className="container" style={{ padding: '24px 0' }}>
        <div className="error-state">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <h2>Товар не найден</h2>
          <p>Проверьте ссылку или вернитесь на главную страницу.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container product-page" style={{ padding: '16px 0 40px' }}>
      <section className="product-page-grid">
        {/* Фото товара */}
        <ProductImage product={product} />

        {/* Сводка и действия */}
        <div className="product-summary">
          <h1 style={{ marginTop: 0 }}>{product.name}</h1>

          {/* Рейтинг кликабелен → к отзывам */}
          <div
            className="product-rating"
            role="button"
            title="Перейти к отзывам"
            onClick={handleScrollToReviews}
          >
            <RatingStars rating={product.rating} />
            <strong>⭐ {product.rating.toFixed(1)}</strong>
            <span>(отзывы)</span>
          </div>

          {/* Краткие характеристики */}
          <ul className="specs-list">
            {details.mainSpecs.map((spec) => (
              <li key={spec.label}>
                <span>{spec.label}</span>
                <span>{spec.value}</span>
              </li>
            ))}
          </ul>

          {/* Действия: − qty +, Подробнее, Сердце */}
          <div className="product-actions">
            <div className="product-price">
              {fmtCurrency(product.price)}
            </div>

            <QuantityControl
              productId={product.id}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
            />

            <button
              className="btn primary"
              onClick={handleScrollToSpecs}
              title="📋 К полным характеристикам"
            >
              📋 Подробнее
            </button>

            {/* Сердце-избранное: активная синяя заливка как в карточке */}
            <button
              className={`animated-fav${isFav ? ' is-active' : ''}`}
              aria-label="Добавить в избранное"
              title={isFav ? '💔 Убрать из избранного' : '💖 Добавить в избранное'}
              onClick={handleToggleFav}
            >
              <span style={{ fontSize: '18px' }}>
                {isFav ? '💖' : '🤍'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Полные характеристики */}
      <section ref={fullSpecsRef} id="full-specs">
        <SpecificationsSection specs={details.fullSpecs} title="📋 Характеристики" />
        <h3>📝 Описание</h3>
        <p style={{ color: 'var(--muted)' }}>{details.description}</p>
      </section>

      {/* Отзывы */}
      <section ref={reviewsRef}>
        <ReviewsSection reviews={details.reviews} />
      </section>
    </main>
  );
}
