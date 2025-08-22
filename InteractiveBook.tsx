// src/components/ui/InteractiveBook.tsx (النسخة المحسّنة والجميلة)

import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import { X } from 'lucide-react';

// بيانات الرواية التي سيتم عرضها
interface BookData {
  title: string;
  author: string; // إضافة اسم الكاتب
  pages: string[];
}

interface InteractiveBookProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookData | null;
}

// ======================= تم التعديل هنا =======================
// مكون الصفحة الفردية (بتصميم احترافي)
const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode; number: number; totalPages: number }>(
  (props, ref) => {
    return (
      <div className="bg-[#FDFDFD] text-[#333] shadow-inner" ref={ref}>
        <div className="p-8 md:p-10 h-full flex flex-col" style={{ direction: 'rtl' }}>
          {/* محتوى الصفحة */}
          <div className="flex-grow">
            <p className="text-lg md:text-xl leading-relaxed md:leading-loose font-serif text-justify">
              {props.children}
            </p>
          </div>
          {/* ترقيم الصفحات في الأسفل */}
          <div className="text-center text-sm text-gray-400 mt-4">
            {props.number} / {props.totalPages}
          </div>
        </div>
      </div>
    );
  }
);

// مكون غلاف الكتاب (بتصميم احترافي)
const Cover = React.forwardRef<HTMLDivElement, { title: string; author: string }>(
  (props, ref) => {
    return (
      <div className="bg-green-800 text-white flex flex-col items-center justify-center p-8 shadow-lg" ref={ref}>
        <div className="w-full h-full border-4 border-yellow-300/50 rounded-lg flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">{props.title}</h1>
          <p className="text-lg md:text-xl">للكاتب</p>
          <p className="text-xl md:text-2xl font-semibold mt-2">{props.author}</p>
        </div>
      </div>
    );
  }
);
// ===================== نهاية منطقة التعديل =====================


const InteractiveBook: React.FC<InteractiveBookProps> = ({ isOpen, onClose, book }) => {
  if (!isOpen || !book) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-50"
        aria-label="إغلاق"
      >
        <X className="w-8 h-8" />
      </button>

      <div onClick={(e) => e.stopPropagation()}>
        <HTMLFlipBook
          width={450}
          height={650}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={420}
          maxHeight={1350}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="shadow-2xl rounded-lg"
        >
          {/* غلاف الكتاب الأمامي */}
          <Cover title={book.title} author={book.author} />

          {/* صفحات الكتاب */}
          {book.pages.map((pageContent, index) => (
            <Page key={index} number={index + 1} totalPages={book.pages.length}>
              {pageContent}
            </Page>
          ))}

          {/* الغلاف الخلفي */}
          <div className="bg-green-900"></div>
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default InteractiveBook;
