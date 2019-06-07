import React, { useState } from "react";

export default ({ children, Icon, onClick, ...props }) => {
  const [isLoading, setLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    const r = onClick();
    if (r.then) {
      setLoading(true);
      try {
        await r;
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <button {...props} onClick={handleClick}>
        {isLoading && <div className="spinner">...</div>}
        <div className="inner">
          {Icon && (
            <div className="icon">
              <Icon />
            </div>
          )}
          {children}
        </div>
        <style jsx>
          {`
            button {
              position: relative;
            }
            .inner {
              display: flex;
              align-items: center;
              opacity: ${isLoading ? 0 : 1};
            }
            .icon {
              margin-right: 10px;
              display: flex;
              align-items: center;
            }
            .spinner {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              color: hsla(0, 0%, 100%, 0.4);
            }
          `}
        </style>
      </button>
    </>
  );
};
