import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Github, Twitter, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleSocialClick = (platform: string) => {
    toast.info(`سيتم توجيهك إلى ${platform} قريباً`);
  };

  const handleContactClick = () => {
    toast.success("للتواصل معنا", {
      description: "سيتم إضافة معلومات التواصل قريباً",
      duration: 3000,
    });
  };

  return (
    <footer className="bg-card/90 backdrop-blur-md border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center space-x-2 space-x-reverse mb-4">
              <div className="w-8 h-8 bg-gradient-saudi rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-saudi bg-clip-text text-transparent">
                Arab-studio
              </span>
            </Link>
            <p className="text-muted-foreground text-center md:text-right text-sm leading-relaxed">
              موقع سعودي  بالثقافة والتراث
              <br />
              مع ألعاب ممتعة
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-foreground">روابط سريعة</h3>
            <div className="space-y-2">
              <Link
                to="/"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                الصفحة الرئيسية
              </Link>
              <Link
                to="/games"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                الألعاب
              </Link>
              <button
                onClick={handleContactClick}
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                اتصل بنا
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-semibold mb-4 text-foreground">تابعنا</h3>
            <div className="flex space-x-4 space-x-reverse">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSocialClick("Twitter")}
                className="text-muted-foreground hover:text-primary hover:bg-accent transition-all"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSocialClick("GitHub")}
                className="text-muted-foreground hover:text-primary hover:bg-accent transition-all"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleContactClick}
                className="text-muted-foreground hover:text-primary hover:bg-accent transition-all"
                aria-label="البريد الإلكتروني"
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Heritage Pattern Decoration */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground mb-4 md:mb-0">
              <span>صُنع بـ</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>في المملكة العربية السعودية</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {currentYear} Arab-studio. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>

        {/* Traditional Saudi Pattern - Subtle Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23006C35' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;