'use client';

import React, { useState } from 'react';
import { UniversalModal } from '@/components/ui/UniversalModal';
import { toEnglishDigits, toPersianDigits } from '@/lib/persian';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/useToastStore';
import type { Address } from '@/types';
import { Plus, Check } from 'lucide-react';

export interface AddressModalProps {
  show?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  addresses?: Address[];
  selectedAddressId?: string | number;
  onSelectAddress?: (address: Address) => void;
  onAddNewAddress?: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  show,
  isOpen,
  onClose,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
}) => {
  const isVisible = isOpen !== undefined ? isOpen : Boolean(show);
  /*
    Read `addresses` from the store root, never `user?.addresses ?? []`.
    The `?? []` allocated a brand-new array on every call, and `useSyncExternalStore`
    calls the selector repeatedly (including for `getServerSnapshot`) — React sees a
    changed snapshot each time, warns "The result of getServerSnapshot should be cached",
    and re-renders until it bails with "Maximum update depth exceeded". The page then
    fell to the app error boundary. It only surfaced once signing-out became the default
    state, because a null `user` is what triggers the `??` branch.
    `addresses` always lives on the store root and keeps a stable reference.
  */
  const storeAddresses = useAuthStore((state) => state.addresses);
  const storeActiveAddress = useAuthStore((state) => state.activeAddress);
  const addAddress = useAuthStore((state) => state.addAddress);
  const visibleAddresses = addresses ?? storeAddresses;
  const activeId = selectedAddressId ?? storeActiveAddress?.id;

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [formError, setFormError] = useState('');

  const handleAddClick = () => {
    if (onAddNewAddress) {
      onAddNewAddress();
      return;
    }
    setFormError('');
    setShowForm(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = toEnglishDigits(receiverPhone.trim());
    if (!title.trim() || !fullAddress.trim() || !receiverName.trim()) {
      setFormError('لطفاً همه فیلدها را کامل کنید.');
      return;
    }
    if (!/^09\d{9}$/.test(phone)) {
      setFormError('شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.');
      return;
    }
    const address: Address = {
      id: `addr-${Date.now()}`,
      title: title.trim(),
      province: 'تهران',
      city: 'تهران',
      fullAddress: fullAddress.trim(),
      postalCode: '',
      receiverName: receiverName.trim(),
      receiverPhone: phone,
      isDefault: visibleAddresses.length === 0,
    };
    addAddress(address);
    onSelectAddress?.(address);
    useToastStore.getState().show({
      title: 'آدرس ذخیره شد',
      message: `«${address.title}» به نشانی‌های شما اضافه شد.`,
      type: 'success',
    });
    setTitle('');
    setFullAddress('');
    setReceiverName('');
    setReceiverPhone('');
    setShowForm(false);
  };

  return (
    <UniversalModal
      show={isVisible}
      onClose={onClose}
      title="انتخاب آدرس تحویل سفارش"
      description="سفارش شما به این نشانی ارسال خواهد شد."
    >
      <div className="space-y-3 py-2">
        {visibleAddresses.length === 0 && !showForm && (
          <p className="text-center text-xs text-slate-500 dark:text-zinc-400 py-4">
            هنوز نشانی ثبت نشده است. با دکمه زیر اولین نشانی را اضافه کنید.
          </p>
        )}
        {visibleAddresses.map((addr) => {
          const isSelected = String(addr.id) === String(activeId);
          return (
            <div
              key={addr.id}
              onClick={() => {
                onSelectAddress?.(addr);
                onClose();
              }}
              className={`relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 text-right ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm'
                  : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 dark:border-zinc-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100">
                    {addr.title}
                  </h4>
                </div>

                {addr.isDefault && (
                  <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    پیش‌فرض
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
                {addr.fullAddress}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-400 border-t border-slate-100 dark:border-zinc-800/80 pt-2">
                <span>گیرنده: {addr.receiverName}</span>
                <span>تلفن: {toPersianDigits(addr.receiverPhone)}</span>
              </div>
            </div>
          );
        })}

        {/* Add Address Dashed Button */}
        {!showForm && (
          <button
            type="button"
            onClick={handleAddClick}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-700 p-4 text-xs font-bold text-slate-600 dark:text-zinc-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            افزودن آدرس جدید
          </button>
        )}

        {showForm && (
          <form
            onSubmit={handleAddSubmit}
            className="space-y-2.5 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 bg-slate-50/60 dark:bg-zinc-800/40"
          >
            <span className="block text-xs font-black text-slate-800 dark:text-zinc-100">
              نشانی جدید
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان نشانی (مثلاً منزل)"
              aria-label="عنوان نشانی"
              className="w-full h-10 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <input
              type="text"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              placeholder="نشانی کامل"
              aria-label="نشانی کامل"
              className="w-full h-10 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="نام تحویل‌گیرنده"
                aria-label="نام تحویل‌گیرنده"
                className="h-10 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <input
                type="tel"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                aria-label="شماره موبایل تحویل‌گیرنده"
                dir="ltr"
                className="h-10 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors text-left font-mono"
              />
            </div>
            {formError && (
              <p className="text-[11px] font-bold text-rose-500">{formError}</p>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 h-10 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                ذخیره نشانی
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-10 px-4 rounded-xl bg-slate-200 dark:bg-zinc-700 text-xs font-bold text-slate-600 dark:text-zinc-200 hover:bg-slate-300 dark:hover:bg-zinc-600 transition-colors cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </form>
        )}
      </div>
    </UniversalModal>
  );
};
