import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full mt-4 bg-cyan-700 text-white py-y px-2 pb-0">
      <div className="pt-4 pb-3 flex flex-col max-w-[1240px] px-2 py-3 m-auto justify-between sm:flex-row text-center text-gray-300 pb-0">
        <p className="py-4">
          Copyright © 2024 | Concept and Design by Shanuka Dissanayake
        </p>
        <div className="flex justify-between sm:w-[100px] pt-4 text-2xl">
          <a
            href="https://www.facebook.com/shanuka2000"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-100 transition duration-300"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/shanuka.2000/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-100 transition duration-300"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
