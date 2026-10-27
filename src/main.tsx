import React from 'react';
import { createRoot } from 'react-dom/client';
import KalaAndPranaGallery from './KalaAndPranaGallery';
import './index.css';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KalaAndPranaGallery />
  </React.StrictMode>,
);
