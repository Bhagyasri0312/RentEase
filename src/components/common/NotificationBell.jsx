import { Bell, X } from 'lucide-react';
import { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';

export const NotificationBell = () => {
  const { notifications, removeNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getTypeStyles = (type) => {
    const styles = {
      success: 'bg-green-100 text-green-800 border-green-300',
      error: 'bg-red-100 text-red-800 border-red-300',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      info: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return styles[type] || styles.info;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-4 border-l-4 ${getTypeStyles(notif.type)} flex justify-between items-start`}
                >
                  <div className="flex-1">
                    <p className="font-medium">{notif.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(notif.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeNotification(notif.id)}
                    className="ml-2 opacity-50 hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
