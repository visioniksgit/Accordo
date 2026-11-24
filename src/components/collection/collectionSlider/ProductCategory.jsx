'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FaBuilding, FaThLarge } from 'react-icons/fa';
import styles from './ProductCategory.module.scss';
import { useDepartments } from '@/utils/hooks/useDepartments';
import { updateSearchParamsWithFilters } from '../filterUtils';

const ProductCategory = ({ filter, setFilter }) => {
  const router = useRouter();
  const pathname = usePathname();
  // Ensure we are utilizing the existing searchParams so we don't drop other filters
  // const searchParams = useSearchParams();
  const { departments, isLoading } = useDepartments();

  const categoryItems = useMemo(
    () => [
      { uid: 'all', name: 'All', slug: '', icon: <FaThLarge /> },
      ...departments.map((department) => ({
        ...department,
        icon: <FaBuilding />,
      })),
    ],
    [departments]
  );

  const activeVertical = filter?.vertical || filter?.department || '';

  const handleVerticalSelect = useCallback(
    (verticalSlug) => {
      const nextFilter = {
        vertical: verticalSlug,
        department: verticalSlug,
      };

      if (setFilter) {
        setFilter(nextFilter);
      }

      const nextSearchParams = new URLSearchParams();

      if (verticalSlug) {
        nextSearchParams.set('vertical', verticalSlug);
      }

      const queryString = nextSearchParams.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router, setFilter]
  );

  if (isLoading) {
    return (
      <div className="container-fluid-lg category-slider">
        <nav className={`${styles.categoryNav} hide-scrollbar`}>
          <ul className={styles.categoryList}>
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}>
                <div
                  className={styles.categoryItem}
                  style={{ width: 90, height: 100, borderRadius: 8, background: 'var(--border-color)', opacity: 0.5, animation: 'none' }}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <div className="container-fluid-lg category-slider" translate='no'>
      <nav
        className={`${styles.categoryNav} hide-scrollbar`}
        data-lenis-prevent
      >
        <ul className={styles.categoryList}>
          {categoryItems.map((category) => {
            const isActive = (category.slug || '') === activeVertical;

            return (
              <li key={category.uid}>
                <button
                  type="button"
                  className={`${styles.categoryItem} ${isActive ? styles.active : ''}`}
                  onClick={() => handleVerticalSelect(category.slug)}
                  disabled={category.disabled}
                >
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default ProductCategory;