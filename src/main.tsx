import React from 'react';
import { createRoot } from 'react-dom/client';
import AnantaKalaGallery from './AnantaKalaGallery';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AnantaKalaGallery />
  </React.StrictMode>
);