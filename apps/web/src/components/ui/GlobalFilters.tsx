'use client';
import React from 'react';
import './GlobalFilters.css';

export function GlobalFilters() {
  return (
    <div className="global-filters">
      <div className="select-wrapper">
        <select className="modern-select" defaultValue="All Plants">
          <option value="All Plants">All Plants</option>
          <option value="Mumbai HO">Mumbai HO</option>
          <option value="Baddi Plant">Baddi Plant</option>
        </select>
      </div>
      <input 
        className="modern-date" 
        type="date" 
        defaultValue="2026-07-24" 
      />
    </div>
  );
}
