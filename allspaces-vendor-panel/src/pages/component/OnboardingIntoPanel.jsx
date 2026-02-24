import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';

import Logo from '../../images/logo-white.svg';
import ProfileAvatar from '../../images/profile_avatar.svg';

function OnboardingIntoPanel() {

  return (
    <div className="md:w-1/2 bg-black p-8 md:p-14 flex flex-col justify-center">
      <Link to="/" className="block mb-8">
        <img src={Logo} alt="Logo" className="w-24 h-24" />
      </Link>

      {/* Gray Box */}
      <div className="bg-darkGray w-full h-3/4 rounded-3xl mb-8"></div>

      {/* Quoutes */}
      <div className="text-left">
        <p className="text-white font-normal text-base mb-4">
          “This library has saved me countless hours of work and helped me
          deliver stunning designs to my clients faster than ever before.”
        </p>
        <div className="flex items-center justify-start">
          <img
            src={ProfileAvatar}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-4 text-white text-left">
            <span className="block text-base">John Doe</span>
            <span className="block text-xs text-lightGray">
              Manager at Hilton Hotel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingIntoPanel;
