import React from "react";
import { FaSpinner } from "react-icons/fa";

import colors, { opacity } from "../colors";

export default ({ progress, indeterminate }) => (
  <div className="container">
    <div className="inner">
      <div
        className="bar"
        style={{
          transform: `scaleX(${indeterminate ? 1 : progress})`,
          backgroundColor: indeterminate ? colors.bg : undefined,
        }}
      />
      <div className="percent">
        {indeterminate ? (
          <div className="spinner">
            <FaSpinner />
          </div>
        ) : (
          `${Math.round(progress * 100)}%`
        )}
      </div>
    </div>
    <style jsx>
      {`
        .container {
          background: ${colors.bg};
          border: 1px solid ${colors.border};
          padding: 2px;
          position: relative;
          border-radius: 4px;
          overflow: hidden;
        }
        .inner {
          height: 36px;
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .percent {
          position: relative;
          color: white;
          font-weight: bold;
          background: rgba(0, 0, 0, 0.3);
          padding: 5px 10px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .spinner {
          display: flex;
          animation: 750ms linear rotating infinite;
        }
        .bar {
          background: ${opacity(colors.ocean, 0.4)};
          transition: 50ms linear transform;
          transform-origin: center left;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        @keyframes rotating {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}
    </style>
  </div>
);
