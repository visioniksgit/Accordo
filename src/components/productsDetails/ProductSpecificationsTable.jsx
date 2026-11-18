'use client';

import React from 'react';
import styles from './ProductsDetailPage.module.scss';

const ProductSpecificationsTable = ({ specifications = [] }) => {
  if (!Array.isArray(specifications) || specifications.length === 0) {
    return null;
  }

  return (
    <div className={styles['specifications-table-wrap']}>
      <table className={styles['specifications-table']}>
        <thead>
          <tr>
            <th scope="col">Specification</th>
            <th scope="col">Detail</th>
          </tr>
        </thead>
        <tbody>
          {specifications.map((spec, index) => {
            const name = spec?.name || spec?.specificationName || spec?.key || '';
            const value = spec?.value || spec?.val || '';
            if (!name && !value) return null;

            return (
              <tr key={spec?.uid || spec?.specificationUid || `${name}-${index}`}>
                <td className={styles['spec-name']}>{name}</td>
                <td className={styles['spec-value']}>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductSpecificationsTable;
