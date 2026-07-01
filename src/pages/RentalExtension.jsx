import { useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { requestRentalExtension, calculateExtensionCost, scheduleReturn, getReturnTimeSlots } from '../utils/rentalManagement';

const RentalExtension = () => {
  const { addNotification } = useNotifications();
  const [rentals, setRentals] = useState(() => {
    try {
      const saved = localStorage.getItem('rentease_active_rentals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedRental, setSelectedRental] = useState(null);
  const [extensionMonths, setExtensionMonths] = useState(1);
  const [returnDate, setReturnDate] = useState('');
  const [returnSlot, setReturnSlot] = useState('');
  const [activeTab, setActiveTab] = useState('extend');

  const timeSlots = getReturnTimeSlots();

  const handleExtendRental = (rentalId) => {
    const rental = rentals.find(r => r.id === rentalId);
    if (!rental) return;

    const extensionCost = calculateExtensionCost(rental.monthlyRate, extensionMonths);
    const extension = requestRentalExtension(rentalId, rental.endDate, extensionMonths);

    addNotification(
      `Extension requested! +₹${extensionCost} for ${extensionMonths} month(s)`,
      'success'
    );

    // Update rental
    const updated = rentals.map(r =>
      r.id === rentalId
        ? { ...r, endDate: extension.newEndDate, totalCost: r.totalCost + extensionCost }
        : r
    );
    setRentals(updated);
    localStorage.setItem('rentease_active_rentals', JSON.stringify(updated));
    setSelectedRental(null);
  };

  const handleScheduleReturn = (rentalId) => {
    if (!returnDate || !returnSlot) {
      addNotification('Please select date and time slot', 'error');
      return;
    }

    scheduleReturn(rentalId, returnDate, 'pickup');
    addNotification(
      `Return scheduled for ${new Date(returnDate).toLocaleDateString()}`,
      'success'
    );

    setReturnDate('');
    setReturnSlot('');
    setSelectedRental(null);
  };

  if (rentals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">No Active Rentals</h2>
            <p className="text-gray-600">You don't have any active rentals at the moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Rental Management</h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('extend')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'extend'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Extend Rental
          </button>
          <button
            onClick={() => setActiveTab('return')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'return'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Schedule Return
          </button>
        </div>

        {/* Rentals List */}
        <div className="space-y-4 mb-8">
          {rentals.map(rental => (
            <div
              key={rental.id}
              onClick={() => setSelectedRental(rental.id)}
              className={`bg-white p-6 rounded-lg shadow-lg cursor-pointer transition border-l-4 ${
                selectedRental === rental.id ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{rental.productName}</h3>
                  <p className="text-gray-600 text-sm mt-1">Rental ID: {rental.id}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(rental.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">End Date</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(rental.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Monthly Rate</p>
                      <p className="font-semibold text-blue-600">₹{rental.monthlyRate}/month</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="font-semibold text-green-600">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Extension Form */}
        {selectedRental && activeTab === 'extend' && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Extend Rental Period</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-blue-800 text-sm">
                Extend your rental to keep using the product longer. You'll be charged the monthly rate for each additional month.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Extension Duration
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 6].map(months => (
                    <button
                      key={months}
                      onClick={() => setExtensionMonths(months)}
                      className={`px-6 py-2 rounded-lg font-medium transition ${
                        extensionMonths === months
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {months}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Additional Cost</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ₹{calculateExtensionCost(rentals.find(r => r.id === selectedRental).monthlyRate, extensionMonths)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleExtendRental(selectedRental)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Confirm Extension
                </button>
                <button
                  onClick={() => setSelectedRental(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Return Scheduling Form */}
        {selectedRental && activeTab === 'return' && (
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-green-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule Return</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Return Date
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {timeSlots.map(slot => (
                    <button
                      key={slot.date}
                      onClick={() => setReturnDate(slot.date)}
                      className={`p-3 rounded-lg font-medium transition ${
                        returnDate === slot.date
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {new Date(slot.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </button>
                  ))}
                </div>
              </div>

              {returnDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Time Slot
                  </label>
                  <div className="space-y-2">
                    {timeSlots
                      .find(s => s.date === returnDate)
                      ?.times.map(time => (
                        <button
                          key={time.id}
                          onClick={() => setReturnSlot(time.id)}
                          className={`w-full p-3 rounded-lg text-left font-medium transition ${
                            returnSlot === time.id
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {time.slot}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleScheduleReturn(selectedRental)}
                  disabled={!returnDate || !returnSlot}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                  Schedule Return
                </button>
                <button
                  onClick={() => setSelectedRental(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalExtension;
