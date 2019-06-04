import React from "react";

export default () => (
  <style jsx global>
    {`
      * {
        box-sizing: border-box;
        margin: 0;
      }

      body {
        background: white;
        color: #444;
        font-size: 16px;
        line-height: 24px;
        padding: 40px;
      }

      body * {
        font: inherit;
        color: inherit;
      }
    `}
  </style>
);
