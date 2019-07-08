import React from "react";

import colors, { opacity } from "../colors";

export default ({ error, ...props }) => (
  <div {...props}>
    {error.message}
    <style jsx>
      {`
        div {
          background: ${opacity(colors.error, 0.1)};
          color: ${colors.error};
          padding: 10px;
          border-radius: 4px;
        }
      `}
    </style>
  </div>
);
