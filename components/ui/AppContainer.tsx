"use client"
import React, { useState } from 'react';
import UserInfoForm from '@/components/ui/UserInfoForm';
import ChatInterface from '@/components/ui/ChatInterface';

interface UserInfo {
  name: string;
  email: string;
}

const AppContainer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (userInfo: UserInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
    <ChatInterface onLogout={handleLogout} />
  ) : (
    <UserInfoForm onSubmit={handleSubmit} />
  );
};

export default AppContainer;