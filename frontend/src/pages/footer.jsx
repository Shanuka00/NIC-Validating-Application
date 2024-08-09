import React from "react";

import {
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
const footer = () => {
  return (
    <div className="w-full mt-12 bg-indigo-950 text-white py-y px-2 pb-0">
      <div className="pt-10 flex flex-col max-w-[1240px] px-2 py-3 m-auto justify-between sm:flex-row text-center text-gray-300 pb-0">
        <p className="py-4">Copyright © 2024 | Concept and Design by Shanuka Dilshan </p>
        <div className="flex justify-between sm:w-[100px] pt-4 text-2xl">
        <FaFacebook />
        <FaInstagram />
        </div>
      </div>
    </div>
  );
};

export default footer;
