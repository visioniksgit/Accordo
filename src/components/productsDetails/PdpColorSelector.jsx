'use client';

import React, { useMemo, useEffect } from 'react';
import styles from './PdpColorSelector.module.scss';

const isLightColor = (hex) => {
  if (!hex || typeof hex !== 'string') return false;
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 200;
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 200;
  }
  return false;
};

/**
 * PdpColorSelector
 * Renders the color list completely new from selectedVariant?.colors.
 * By default, selects the first color in the list.
 * Clicking a color updates the held color UID in local state without reloading the page.
 */
const PdpColorSelector = ({
  selectedVariant,
  selectedColorUid,
  onSelectColor,
  className = '',
}) => {
  // Derive colors strictly from selectedVariant?.colors
  const colors = useMemo(() => {
    return Array.isArray(selectedVariant?.colors) ? selectedVariant.colors : [];
  }, [selectedVariant?.colors]);

  // The first color is the default
  const firstColor = colors[0] || null;
  const firstColorUid = firstColor?.uid || null;

  // Active color UID: user-selected color (if present in the current colors list) or the first color
  const activeColorUid = useMemo(() => {
    if (selectedColorUid && colors.some((c) => c?.uid === selectedColorUid)) {
      return selectedColorUid;
    }
    return firstColorUid;
  }, [selectedColorUid, colors, firstColorUid]);

  // By default, select and hold the first color in parent state
  useEffect(() => {
    if (
      firstColor &&
      (!selectedColorUid || !colors.some((c) => c?.uid === selectedColorUid))
    ) {
      if (onSelectColor) {
        onSelectColor(firstColor);
      }
    }
  }, [firstColor, selectedColorUid, colors, onSelectColor]);

  const activeColor = useMemo(() => {
    return colors.find((c) => c?.uid === activeColorUid) || firstColor;
  }, [colors, activeColorUid, firstColor]);

  const handleColorClick = (color) => {
    if (!color?.uid) return;
    if (onSelectColor) {
      onSelectColor(color);
    }
  };

  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.colorSelector} ${className}`.trim()}>
      <div className={styles.colorHeader}>
        <span className={styles.colorLabel}>Color:</span>
        {activeColor?.name && (
          <span className={styles.colorActiveName}>{activeColor.name}</span>
        )}
      </div>

      <div
        className={styles.colorList}
        role="radiogroup"
        aria-label="Product Colors"
      >
        {colors.map((color, index) => {
          const isActive = color.uid === activeColorUid;
          const hex = color.hexcode || color.hex || '#e0e0e0';
          const light = isLightColor(hex);

          return (
            <button
              key={color.uid || `${color.name}-${index}`}
              type="button"
              className={`${styles.colorItem} ${isActive ? styles.active : ''}`}
              onClick={() => handleColorClick(color)}
              title={color.name || 'Color'}
              aria-label={`Select color ${color.name || ''}`}
              aria-checked={isActive}
              role="radio"
            >
              <span
                className={`${styles.colorCircle} ${light ? styles.isLight : ''}`}
                style={{ backgroundColor: hex }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PdpColorSelector;
