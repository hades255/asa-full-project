import React from "react";

export const EmptyMessage = ({ message }) => {
  return (
    <div className="flex flex-1 w-full h-full items-center justify-center">
      <p className="font-medium text-body1 text-semantic-content-contentTertionary text-center whitespace-pre-line">
        {message || "Nothing found"}
      </p>
    </div>
  );
};
