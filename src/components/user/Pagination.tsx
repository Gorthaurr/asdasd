import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) => {
  const [inputValue, setInputValue] = useState(currentPage.toString());

  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);
  
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        <span>
          Показано {startItem}-{endItem} из {totalItems} товаров
        </span>
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-btn pagination-btn-prev"
          onClick={() => {
              const newPage = currentPage - 1;
              console.log('Pagination prev clicked, going to page:', newPage);
              console.log('Calling onPageChange with:', newPage);
              onPageChange(newPage);
          }}
          disabled={currentPage === 1}
          aria-label="Предыдущая страница"
        >
          <ChevronLeft size={18} />
          <span>Назад</span>
        </button>

        <div className="pagination-pages">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="pagination-dots">...</span>
              ) : (
                <button
                  className={`pagination-btn pagination-btn-page ${
                    page === currentPage ? 'active' : ''
                  }`}
                  onClick={() => {
                      console.log('Pagination page clicked:', page);
                      console.log('Calling onPageChange with:', page);
                      onPageChange(page as number);
                  }}
                  aria-label={`Страница ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          className="pagination-btn pagination-btn-next"
          onClick={() => {
              console.log('Pagination next clicked, going to page:', currentPage + 1);
              onPageChange(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
          aria-label="Следующая страница"
        >
          <span>Далее</span>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="pagination-jump">
        <span>Перейти к странице:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
                console.log('Pagination input Enter pressed, page:', inputValue);
                const page = parseInt(inputValue);
                if (page >= 1 && page <= totalPages) {
                    onPageChange(page);
                } else {
                    setInputValue(currentPage.toString());
                }
            }
          }}
          onBlur={() => {
            console.log('Pagination input blurred, page:', inputValue);
            const page = parseInt(inputValue);
            if (page >= 1 && page <= totalPages) {
                onPageChange(page);
            } else {
                setInputValue(currentPage.toString());
            }
          }}
          className="pagination-input"
          aria-label="Номер страницы"
        />
      </div>
    </div>
  );
};

export default Pagination;

