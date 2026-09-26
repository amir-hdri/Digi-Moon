import React from 'react';
import { Address } from '../types';

export interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedAddressId?: string | number;
  onSelectAddress: (address: Address) => void;
  onAddNewAddress?: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-240 flex items-end justify-center">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Bottom Sheet Drawer Frame */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl shadow-2xl p-5 border-t border-gray-100 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
        {/* Drawer Drag Pill */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 cursor-grab" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">انتخاب آدرس تحویل</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
            aria-label="بستن"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Address Cards List */}
        <div className="space-y-3 py-4 overflow-y-auto flex-1">
          {addresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => onSelectAddress(addr)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                    : 'border-gray-200 hover:border-emerald-300 bg-white'
                }`}
              >
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-800">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-medium">
                        پیش‌فرض
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{addr.fullAddress}</p>
                  {addr.receiverName && (
                    <p className="text-[11px] text-gray-400 mt-1">تحویل‌گیرنده: {addr.receiverName}</p>
                  )}
                </div>

                {/* Selection Radio / Checkmark */}
                <div className="pt-1">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Address CTA */}
        {onAddNewAddress && (
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={onAddNewAddress}
              className="w-full py-3 rounded-xl border-2 border-dashed border-emerald-400 text-emerald-600 hover:bg-emerald-50/50 font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>افزودن آدرس جدید</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
