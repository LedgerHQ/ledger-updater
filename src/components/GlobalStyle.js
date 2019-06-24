import React from "react";

import colors, { lighten, darken } from "../colors";

export default () => (
  <style jsx global>
    {`
      * {
        box-sizing: border-box;
        color: inherit;
        margin: 0;
      }

      html,
      body {
        height: 100%;
      }

      body {
        background: ${colors.bg};
        font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI",
          Roboto;
        color: ${colors.text};
        font-size: 16px;
        line-height: 24px;
        margin: 80px 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-x: hidden;
      }

      button {
        background: ${colors.ocean};
        font-family: inherit;
        outline: none;
        color: white;
        font-weight: bold;
        border: 1px solid ${colors.ocean};
        height: 40px;
        padding: 0 20px;
        border-radius: 4px;
        transition: 50ms linear background-color;
        box-shadow: hsla(0, 0%, 100%, 0.4) 0 1px 0 inset,
          hsla(0, 0%, 0%, 0.1) 0 2px 3px;
        text-shadow: hsla(0, 0%, 0%, 0.1) 0 1px 0;
      }
      button:hover {
        background: ${lighten(colors.ocean, 0.1)};
      }
      button:active {
        background: ${darken(colors.ocean, 0.1)};
      }
    `}
  </style>
);
