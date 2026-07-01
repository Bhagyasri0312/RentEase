import { Bell, ShoppingCart, Heart, CheckCircle } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";

export default function Notifications() {
  const { notifications } = useNotifications();

  return (
    <div className="min-h-screen bg-secondary-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="text-primary-600" size={32} />
          <h1 className="text-4xl font-bold">Notifications</h1>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Bell size={60} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold">No notifications yet</h2>
            <p className="text-gray-500 mt-2">
              We'll notify you when something important happens.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-5 flex items-start gap-4"
              >
                {item.type === "success" && (
                  <CheckCircle className="text-green-500" />
                )}

                {item.type === "cart" && (
                  <ShoppingCart className="text-blue-500" />
                )}

                {item.type === "wishlist" && (
                  <Heart className="text-pink-500" />
                )}

                {!["success", "cart", "wishlist"].includes(item.type) && (
                  <Bell className="text-primary-600" />
                )}

                <div>
                  <p className="font-medium">{item.message}</p>

                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
