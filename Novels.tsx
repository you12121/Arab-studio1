import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Frown } from 'lucide-react';
import InteractiveBook from '@/components/ui/InteractiveBook';

// استيراد الصور مباشرة
import gharnataImage from '@/assets/gharnata.jpg'; // تأكد من وجود هذا المسار في مشروعك
import stanImage from '@/assets/Stan.jpg';     // تأكد من وجود هذا المسار في مشروعك

// بيانات الروايات مع محتوى الصفحات
const novelsData = [
  {
    id: 1,
    title: "ثلاثية غرناطة",
    author: "رضوى عاشور",
    description: "رواية تاريخية تحكي عن سقوط الأندلس.",
    imageUrl: gharnataImage, // استخدام المتغير المستورد
    pages: [
      "كان يوماً من أيام الصيف الحارة في غرناطة. الشمس ترسل أشعتها الذهبية على قصور الحمراء، والناس يتحركون ببطء في أزقة المدينة الضيقة...",
      "في ذلك اليوم، وُلدت مريم. كانت ولادتها حدثاً سعيداً في عائلة أبي جعفر، الخطاط الماهر الذي كانت أنامله تنسج آيات القرآن كأنها جواهر...",
      "كبرت مريم وهي تستمع إلى حكايات جدتها عن أمجاد الماضي، وعن أيام كان فيها المسلمون أسياد هذه الأرض. كانت تلك الحكايات تزرع في قلبها حباً عميقاً لتاريخها...",
      "لكن رياح التغيير كانت قد بدأت تهب. أخبار سقوط الممالك الإسلامية الواحدة تلو الأخرى كانت تصل إلى غرناطة، ومعها الخوف من المصير المجهول...",
    ]
  },
  {
    id: 2,
    title: "ابليس",
    author: "كرم محمود",
    description: "ابليس 19",
    imageUrl: stanImage, // استخدام المتغير المستورد
    pages: [
      "اسمي عيسى. أو هوزيه، كما كانت تناديني أمي. ولدت في الفلبين، لكن دمي يحمل نصفاً كويتياً. هذه هي حكايتي، حكاية البحث عن جذر...",
      "أمي، جوزافين، عملت خادمة في الكويت. هناك التقت بأبي، راشد. كانت قصة حب ممنوعة، انتهت برحيلي مع أمي إلى بلدها وأنا لا أزال طفلاً...",
    ]
  },
  // يمكنك إضافة المزيد من الروايات بنفس الطريقة
];

// مكون بطاقة الرواية
const NovelCard = ({ novel, onReadClick }: { novel: typeof novelsData[0]; onReadClick: () => void; }) => {
  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-border/50 flex flex-col">
      <div className="overflow-hidden">
        <img src={novel.imageUrl} alt={`غلاف رواية ${novel.title}`} className="w-full h- object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-foreground mb-2">{novel.title}</h3>
        <p className="text-sm font-medium text-secondary mb-3">للكاتب: {novel.author}</p>
        <p className="text-muted-foreground text-sm h-20 overflow-hidden flex-grow">{novel.description}</p>
        <Button className="w-full mt-4 btn-saudi" onClick={onReadClick}>
          <BookOpen className="w-4 h-4 ml-2" />
          اقرأ الآن
        </Button>
      </div>
    </div>
  );
};

// المكون الرئيسي لصفحة الروايات
const NovelsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleReadClick = (novel) => {
    setSelectedBook(novel);
    setIsBookOpen(true);
  };

  const filteredNovels = useMemo(() => {
    if (!searchQuery) return novelsData;
    return novelsData.filter(novel =>
      novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      novel.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <header className="text-center mb-12">
          {/* تم تعديل حجم النص هنا */}
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-saudi bg-clip-text text-transparent pb-2">
            مكتبة الروايات
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            تصفح مجموعتنا المختارة أو استخدم شريط البحث للعثور على روايتك المفضلة.
          </p>
          <div className="mt-8 max-w-lg mx-auto">
            <div className="relative">
              <Input type="text" placeholder="ابحث باسم الرواية أو الكاتب..." className="w-full pr-12 pl-4 py-6 text-lg rounded-full border-2" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </header>

        <main>
          {filteredNovels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredNovels.map((novel) => (
                <NovelCard key={novel.id} novel={novel} onReadClick={() => handleReadClick(novel)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Frown className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-2xl font-semibold">لا توجد نتائج</h3>
              <p className="mt-2 text-muted-foreground">لم نتمكن من العثور على روايات تطابق بحثك.</p>
            </div>
          )}
        </main>
      </div>

      <InteractiveBook 
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        book={selectedBook}
      />
    </>
  );
};

export default NovelsPage;
