# 🌙 Dijimoon Design System (سیستم طراحی دیجی مون)

مجموعه کامل و آماده تولید سیستم طراحی فروشگاه اینترنتی **دیجی مون** ([dijimoon.ir](https://dijimoon.ir))، استخراج‌شده به صورت مهندسی معکوس با استفاده از ایجنت متخصص `web-analyst-pro`.

---

## 📁 ساختار پکیج و فایل‌ها

```
design-system/
├── tokens.json              # توکن‌های استاندارد W3C DTCG (قابل استفاده در Figma و Style Dictionary)
├── tailwind-theme.css       # تنظیمات @theme برای Tailwind CSS v4 + کلاس‌های شیشه‌ای و انیمیشن
├── tailwind.config.js       # کانفیگ theme.extend برای Tailwind CSS v3
├── DESIGN_SYSTEM.md         # مستندات جامع معماری، پالت رنگ، تایپوگرافی، فاصله‌گذاری و APIها
├── index.html               # دمو و پیش‌نمایش زنده و تعاملی سیستم طراحی در مرورگر
├── index.ts                 # نقطه ورود کلی ماژول تایپ‌اسکریپت
├── types/
│   └── index.ts             # تعاریف داده‌ای (Product, Category, Cart, Address, Theme)
├── lib/
│   ├── persian.ts           # ابزارهای بومی‌سازی RTL، ارقام فارسی و فرمت‌کننده تومان
│   └── api.ts               # کلاینت تایپ‌شده API برای اتصال به api.dijimoon.ir
└── components/
    ├── Header.tsx           # هدر چسبان شیشه‌ای همراه با لوگوی گرادیانی و نشان شناور سبد خرید
    ├── SearchBar.tsx        # کادر جستجوی شیشه‌ای با افکت Focus Ring زمردی
    ├── ProductCard.tsx      # کارت محصول با عکس، بج تخفیف، قیمت تومان و دکمه خرید
    ├── ProductSkeleton.tsx  # اسکلت بارگذاری شبیه‌سازی‌شده بدون تغییر چیدمان (CLS = 0)
    ├── BottomNavbar.tsx     # نوار ناوبری ثابت پایین صفحه با ۴ تب اصلی
    ├── CategoryHeader.tsx   # هدر دسته‌بندی با دکمه بازگشت و متن گرادیانی
    ├── AddressModal.tsx     # دراور انتخاب آدرس (Bottom Sheet) با حالت انتخابی سبز
    └── index.ts             # خروجی یکپارچه کامپوننت‌ها
```

---

## 🚀 راهنمای استفاده سریع

### ۱. استفاده در Tailwind CSS v4
فایل `tailwind-theme.css` را در فایل اصلی استایل (مانند `app/globals.css`) ایمپورت کنید:
```css
@import "./design-system/tailwind-theme.css";
```

### ۲. استفاده در Tailwind CSS v3
کانفیگ را به `tailwind.config.js` پروژه خود لینک یا اضافه کنید:
```javascript
const dijimoonConfig = require('./design-system/tailwind.config.js');

module.exports = {
  ...dijimoonConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
};
```

### ۳. استفاده از کامپوننت‌های React
```tsx
import { Header, ProductCard, ProductSkeleton, BottomNavbar } from './design-system/components';
import { formatToman } from './design-system/lib/persian';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header cartCount={2} currentAddress="تهران، سعادت آباد" />
      <main className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <ProductCard product={...} onAddToCart={...} />
      </main>
      <BottomNavbar activeTab="home" />
    </div>
  );
}
```

### ۴. مشاهده دموی زنده سیستم طراحی
تنها کافی است فایل `design-system/index.html` را در هر مرورگری باز کنید تا کامپوننت‌های تعاملی، افکت شیشه‌ای، ارقام فارسی و مقایسه اسکلت لودر را به صورت زنده مشاهده فرمایید.
