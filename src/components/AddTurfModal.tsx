import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SLOT_TIMES = [
    "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00",
    "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00",
    "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00",
    "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00",
    "22:00 - 23:00", "23:00 - 00:00"
];

interface AddTurfModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddTurfModal({ isOpen, onClose }: AddTurfModalProps) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        area: '',
        location: '',
        sportType: '',
        capacity: '',
        latitude: '',
        longitude: '',
        city: '',
        slotPrices: SLOT_TIMES.reduce((acc, slot) => ({ ...acc, [slot]: '' }), {} as Record<string, string>),
        imageUrl: '',
        amenities: '',
        isActive: true,
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSlotPriceChange = (slot: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            slotPrices: {
                ...prev.slotPrices,
                [slot]: value
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const kycStatus = localStorage.getItem('kicko_kyc_status');
        if (kycStatus !== 'APPROVED') {
            onClose();
            alert('Cannot add turf. KYC Status is not approved.');
            return;
        }

        const razorpayAccountId = localStorage.getItem('kicko_razorpay_account_id');
        if (!razorpayAccountId) {
            onClose();
            navigate('/kyc');
            return;
        }

        console.log('New Turf Data:', formData);
        // Add API call here later
        onClose();
        setFormData({ // Reset form
            name: '',
            area: '',
            location: '',
            sportType: '',
            capacity: '',
            latitude: '',
            longitude: '',
            city: '',
            slotPrices: SLOT_TIMES.reduce((acc, slot) => ({ ...acc, [slot]: '' }), {} as Record<string, string>),
            imageUrl: '',
            amenities: '',
            isActive: true,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 sm:p-6 font-sans">
            <div className="bg-white/95 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/60 w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden relative">
                <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 sm:px-8 py-5 flex items-center justify-between z-10 border-b border-slate-100/60">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-slate-800">Add New Turf</h2>
                        <p className="text-xs text-slate-500 mt-1">Configure turf details and dynamic pricing slots</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 hover:bg-rose-50 rounded-full transition-colors text-slate-400 hover:text-rose-500 shadow-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:px-8 sm:py-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 block ml-1">Turf Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-teal-200 outline-none transition-shadow shadow-sm focus:bg-white"
                                placeholder="e.g. Green Field Arena"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 block ml-1">Area</label>
                            <input
                                type="text"
                                name="area"
                                required
                                value={formData.area}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-teal-200 outline-none transition-shadow shadow-sm focus:bg-white"
                                placeholder="e.g. Anna Nagar"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 block ml-1">City</label>
                            <input
                                type="text"
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-teal-200 outline-none transition-shadow shadow-sm focus:bg-white"
                                placeholder="e.g. Chennai"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 block ml-1">Turf Location</label>
                            <input
                                type="text"
                                name="location"
                                required
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-teal-200 outline-none transition-shadow shadow-sm focus:bg-white"
                                placeholder="e.g. Near Anna Nagar Metro, Chennai"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 block ml-1">Type of Sports</label>
                            <select
                                name="sportType"
                                required
                                value={formData.sportType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-teal-200 outline-none transition-shadow shadow-sm focus:bg-white appearance-none"
                            >
                                <option value="" disabled>Select a sport</option>
                                <option value="Cricket">Cricket</option>
                                <option value="Football">Football</option>
                                <option value="Basketball">Basketball</option>
                                <option value="Hockey">Hockey</option>
                                <option value="Baseball">Baseball</option>
                                <option value="Tennis">Tennis</option>
                                <option value="Badminton">Badminton</option>
                                <option value="Volleyball">Volleyball</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 block ml-1">Turf Capacity</label>
                            <select
                                name="capacity"
                                required
                                value={formData.capacity}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-teal-200 outline-none transition-shadow shadow-sm focus:bg-white appearance-none"
                            >
                                <option value="" disabled>Select capacity</option>
                                {[5, 6, 7, 8, 9, 10, 11, 12, 15].map(num => (
                                    <option key={num} value={num}>Members per team {num}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 block ml-1">Image URL</label>
                            <input
                                type="url"
                                name="imageUrl"
                                required
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-teal-200 outline-none transition-shadow shadow-sm focus:bg-white"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 block ml-1">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                required
                                value={formData.latitude}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-teal-200 outline-none transition-shadow shadow-sm focus:bg-white"
                                placeholder="e.g. 13.0827"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 block ml-1">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                name="longitude"
                                required
                                value={formData.longitude}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-teal-200 outline-none transition-shadow shadow-sm focus:bg-white"
                                placeholder="e.g. 80.2707"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100/60">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-serif font-bold text-slate-800">Dynamic Slot Pricing (₹)</label>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {SLOT_TIMES.map(slot => (
                                    <div key={slot} className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase ml-1 block">{slot}</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">₹</span>
                                            <input
                                                type="number"
                                                required
                                                value={formData.slotPrices[slot]}
                                                onChange={(e) => handleSlotPriceChange(slot, e.target.value)}
                                                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-teal-200 outline-none transition-shadow shadow-sm focus:bg-white text-sm font-semibold text-slate-700"
                                                placeholder="600"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2 pt-4 border-t border-slate-100/60">
                            <label className="text-sm font-medium text-slate-600 block ml-1">Amenities <span className="text-slate-400 font-normal">(comma separated)</span></label>
                            <input
                                type="text"
                                name="amenities"
                                required
                                value={formData.amenities}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-teal-200 outline-none transition-shadow shadow-sm focus:bg-white"
                                placeholder="e.g. Water, Changing Room, Washroom"
                            />
                        </div>

                        <div className="md:col-span-2 flex items-center gap-3 bg-teal-50/40 p-5 border border-teal-100/50 rounded-2xl mt-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-5 h-5 text-teal-500 rounded border-teal-200 focus:ring-teal-500 cursor-pointer transition-colors"
                            />
                            <div className="flex flex-col">
                                <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">
                                    Enable Turf Listing
                                </label>
                                <span className="text-[11px] text-slate-500">Turf will be immediately active and bookable by customers upon saving.</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-slate-100/60">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3.5 rounded-full border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full py-3.5 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:hover:shadow-md"
                        >
                            Publish Turf
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
