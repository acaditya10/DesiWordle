
import React from 'react';

interface NotificationProps {
  message: string;
}

export const Notification: React.FC<NotificationProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-md bg-gray-800 text-white font-semibold shadow-lg transition-opacity duration-300 animate-pop-in">
      {message}
    </div>
  );
};
