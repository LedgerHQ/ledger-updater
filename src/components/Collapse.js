import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import colors from "../colors";

export default function Collapse({ children, title }) {
  const [isCollapsed, setCollapsed] = useState(true);
  const toggle = () => setCollapsed(!isCollapsed);
  return (
    <div>
      <div className="toggle" onClick={toggle}>
        {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
        <span>{title}</span>
      </div>
      {isCollapsed === false && <div className="zone">{children}</div>}
      <style jsx>
        {`
          .toggle {
            padding: 10px 0;
            font-size: 12px;
            display: flex;
            align-items: center;
            color: hsl(0, 0%, 50%);
            cursor: pointer;
          }
          .toggle:hover {
            color: hsl(0, 0%, 40%);
          }
          .toggle :global(> * + *) {
            margin-left: 5px;
          }
          .zone {
            padding: 20px;
            background: white;
            border: 1px solid ${colors.border};
            border-radius: 4px;
          }
          .zone :global(> * + * ) {
            margin-top: 20px;
          }
        `}
      </style>
    </div>
  );
}
