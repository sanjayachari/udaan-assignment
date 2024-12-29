import React from "react";
import { ThreeDot } from "react-loading-indicators";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ThreeDot color="#000000" size="medium" text="" textColor="" />{" "}
    </div>
  );
};

export default Loading;
