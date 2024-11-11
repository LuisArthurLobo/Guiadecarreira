"use client"
import React, { useState, useEffect } from 'react';
import UserInfoForm from '@/components/ui/UserInfoForm';
import ChatInterface from '@/components/ui/ChatInterface';

const AppContainer = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleUserInfoSubmit = (info) => {
    localStorage.setItem('userInfo', JSON.stringify(info));
    setUserInfo(info);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  return userInfo ? (
    <ChatInterface onLogout={handleLogout} />
  ) : (
    <UserInfoForm onSubmit={handleUserInfoSubmit} />
  );
};

export default AppContainer;