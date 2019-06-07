import React from "react";

import colors from "../colors";

export default ({ data }) => {
  const keys = Object.keys(data);
  return (
    <div className="container">
      {keys.map(key => {
        const value = data[key];
        return (
          <div key={key} className="item">
            <span className="label">{key}</span>
            <span className="value">{displayValue(value)}</span>
          </div>
        );
      })}
      <style jsx>
        {`
          .container {
            font-size: 13px;
            line-height: 16px;
            display: flex;
            flex-wrap: wrap;
          }
          .item {
            margin-right: 10px;
          }
          .label {
            color: ${colors.base04};
            margin-right: 5px;
            user-select: none;
          }
          .value {
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
};

function displayValue(v) {
  return v.toString();
}
