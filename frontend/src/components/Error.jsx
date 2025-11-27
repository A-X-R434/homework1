import React from 'react';
import '../styles/Error.css';

const Error = ({ error, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">出错了</h3>
      <p className="error-message">{error?.message || '发生未知错误'}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          重试
        </button>
      )}
    </div>
  );
};

export default Error;