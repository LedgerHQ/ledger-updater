import React from "react";

import colors from "../colors";

export default () => (
  <style jsx global>
    {`
      * {
        box-sizing: border-box;
        margin: 0;
      }

      html,
      body {
        height: 100%;
      }

      body {
        background: ${colors.base02};
        font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI",
          Roboto;
        color: ${colors.base06};
        font-size: 16px;
        line-height: 24px;
        padding: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow-x: hidden;
      }

      button {
        background: ${colors.base03};
        border: 2px solid hsla(0, 0%, 100%, 0.1);
        height: 40px;
        padding: 0 20px;
        border-radius: 4px;
      }

      body * {
        font: inherit;
        color: inherit;
      }
    `}
  </style>
);
