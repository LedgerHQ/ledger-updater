import React from "react";

export default ({ of, children, style }) => (
  <div className="container" style={style}>
    {children}
    <style jsx>
      {`
        .container :global(> * + *) {
          margin-top: ${of}px;
        }
      `}
    </style>
  </div>
);
