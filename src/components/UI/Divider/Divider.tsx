import React from 'react';
import styles from './Divider.module.css';

interface DividerProps {
  size?: 'full' | 'half';
  color?: 'light' | 'dark';
  className?: string;
}

const Divider = ({ size = 'full', color = 'dark', className = '' }: DividerProps) => {
  const sizeClass = size === 'full' ? styles.full : styles.half;
  const colorClass = color === 'light' ? styles.light : styles.dark;

  return <div className={`${styles.base} ${sizeClass} ${colorClass} ${className}`.trim()}></div>;
};

export default Divider;
