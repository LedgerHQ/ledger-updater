import React, { useState } from "react";

export default ({ value, onChange, ...props }) => {
  const [copy, setCopy] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState(null);
  const handleChange = e => {
    const value = e.target.value;
    setCopy(value);
    try {
      const parsed = JSON.parse(value);
      setError(null);
      onChange(parsed);
    } catch (err) {
      setError(err);
    }
  };
  return (
    <div>
      <textarea
        className={error ? "textarea-error" : ""}
        style={{ width: "100%" }}
        value={copy}
        onChange={handleChange}
        {...props}
      />
      {error && <div className="error">{error.message}</div>}
      <style jsx>
        {`
          .error {
            color: red;
          }
          .textarea-error {
            border-color: red;
          }
        `}
      </style>
    </div>
  );
};
