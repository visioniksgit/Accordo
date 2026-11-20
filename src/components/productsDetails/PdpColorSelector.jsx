'use client';

import React, { useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
 * By default, selects the color matching the URL `color` query parameter (if syncWithUrl is true)
 * or the first color in the list.
 * Clicking a color updates the held color in state without reloading the page.
 */
const PdpColorSelector = ({
  selectedVariant,
  selectedColorUid,
  onSelectColor,
  className = '',
  syncWithUrl = true,
}) => {
  const searchParams = useSearchParams();
  const colorParam = syncWithUrl ? searchParams?.get('color') || '' : '';

  // Derive colors strictly from selectedVariant?.colors
  const colors = useMemo(() => {
    return Array.isArray(selectedVariant?.colors) ? selectedVariant.colors : [];
  }, [selectedVariant?.colors]);

  // If URL has ?color=..., find matching color by slug, name, or uid
  const colorFromUrl = useMemo(() => {
    if (!colorParam || !colors.length) return null;
    const cleanParam = decodeURIComponent(colorParam).trim().toLowerCase();
    return (
      colors.find(
        (c) =>
          (c?.slug && c.slug.toLowerCase() === cleanParam) ||
          (c?.name && c.name.toLowerCase() === cleanParam) ||
          (c?.uid && c.uid.toLowerCase() === cleanParam)
      ) || null
    );
  }, [colorParam, colors]);

  // The first color is the default fallback
  const firstColor = colors[0] || null;
  const preferredColor = colorFromUrl || firstColor;
  const preferredColorUid = preferredColor?.uid || null;

  // Active color UID: user-selected color (if present in current colors list) or preferred color
  const activeColorUid = useMemo(() => {
    if (selectedColorUid && colors.some((c) => c?.uid === selectedColorUid)) {
      return selectedColorUid;
    }
    return preferredColorUid;
  }, [selectedColorUid, colors, preferredColorUid]);

  // By default, select and hold the preferred color in parent state if not already selected
  useEffect(() => {
    const isCurrentValid =
      selectedColorUid && colors.some((c) => c?.uid === selectedColorUid);
    if (!isCurrentValid && preferredColor) {
      if (onSelectColor) {
        onSelectColor(preferredColor);
      }
    }
  }, [preferredColor, selectedColorUid, colors, onSelectColor]);

  // Listen to browser Back/Forward navigation (popstate) to sync color from URL
  useEffect(() => {
    if (!syncWithUrl) return;

    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const currentColorParam = urlParams.get('color');
      if (!currentColorParam || !colors.length) return;
      const clean = decodeURIComponent(currentColorParam).trim().toLowerCase();
      const match = colors.find(
        (c) =>
          (c?.slug && c.slug.toLowerCase() === clean) ||
          (c?.name && c.name.toLowerCase() === clean) ||
          (c?.uid && c.uid.toLowerCase() === clean)
      );
      if (match && match.uid !== selectedColorUid) {
        onSelectColor?.(match);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [syncWithUrl, colors, selectedColorUid, onSelectColor]);

  const activeColor = useMemo(() => {
    return colors.find((c) => c?.uid === activeColorUid) || preferredColor;
  }, [colors, activeColorUid, preferredColor]);

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
