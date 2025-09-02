// Пагинация для API: Prev / номера / Next
import React from 'react';
import { useCatalogUrlActions } from '../../routing/useCatalogUrlActions';

interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

interface PaginationApiProps {
  meta: PaginationMeta;
}

export default function PaginationApi({ meta }: PaginationApiProps) {
  const { setPage } = useCatalogUrlActions(); // используем URL-действия
  const { total_pages, page, total } = meta; // метаданные из API

  if (!total || total_pages <= 1) return null; // если товаров нет — пагинация не нужна

  const goto = (p: number) => {
    const newPage = Math.min(Math.max(1, p), total_pages);
    setPage(newPage);
  };

  // Показываем максимум 5 страниц вокруг текущей
  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (total_pages <= maxVisible) {
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(total_pages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      className="animated-pagination visible"
      style={{
        gridColumn: '1/-1',
        display: 'flex',
        gap: 8,
        justifyContent: 'center',
        margin: '16px 0 8px',
        alignItems: 'center',
      }}
    >
      <button
        className="animated-pagination-btn"
        onClick={() => goto(page - 1)}
        disabled={page <= 1}
        style={{ minWidth: '120px' }}
      >
        <span>‹ Предыдущая</span>
        <div className="pagination-btn-ripple"></div>
        <div className="pagination-btn-glow"></div>
      </button>

      {visiblePages.map((p) => (
        <button
          key={p}
          className={`animated-pagination-btn ${p === page ? 'active' : ''}`}
          onClick={() => goto(p)}
        >
          <span>{p}</span>
          <div className="pagination-btn-ripple"></div>
          <div className="pagination-btn-glow"></div>
        </button>
      ))}

      <button
        className="animated-pagination-btn"
        onClick={() => goto(page + 1)}
        disabled={page >= total_pages}
        style={{ minWidth: '120px' }}
      >
        <span>Следующая ›</span>
        <div className="pagination-btn-ripple"></div>
        <div className="pagination-btn-glow"></div>
      </button>
    </div>
  );
}
