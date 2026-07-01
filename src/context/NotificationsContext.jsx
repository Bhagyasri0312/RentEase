import { useState, useCallback } from "react";
import { NotificationsContext } from "./NotificationsContextDef";

export { NotificationsContext }; // Re-export for hooks

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Add notification
  const addNotification = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = Date.now();
      const notification = {
        id,
        message,
        type, // 'info', 'success', 'error', 'warning'
        timestamp: new Date(),
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    [removeNotification],
  );

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
