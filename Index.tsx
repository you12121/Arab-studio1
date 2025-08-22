import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Gamepad2, Crown, MapPin, Palmtree, Calendar } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const handleExploreClick = () => {
    toast.success("مرحباً بك في Arab-studio !", {
      description: "استكشف الموقع واستمتع بالألعاب التراثية",
      duration: 3000,
    });
  };

  const features = [
    {
      icon: Gamepad2,
      title: "ألعاب تراثية",
      description: "استمتع بألعاب مستوحاة من التراث السعودي",
      color: "text-primary"
    },
    {
      icon: Crown,
      title: "هوية سعودية",
      description: "تصميم يحتفي بالثقافة والتراث السعودي",
      color: "text-secondary"
    },
    {
      icon: MapPin,
      title: "فريق التطوير",
      description: "ℱ𝒲𝒜𝒵 - ℰℐ𝒮𝒮𝒜 - ℳ𝒯𝒜ℬ",
      color: "text-accent"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-saudi rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-saudi bg-clip-text text-transparent">
              Arab-studio
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              موقع سعودي  يحتفي بالثقافة والتراث مع ألعاب ممتعة
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/games">
              <Button size="lg" className="btn-saudi text-lg px-8 py-4">
                <Gamepad2 className="w-5 h-5 ml-2" />
                الألعاب
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 border-2 hover:bg-secondary/10"
              onClick={handleExploreClick}
            >
              <Palmtree className="w-5 h-5 ml-2" />
              اكتشف المزيد
            </Button>
          </div>

          {/* Heritage Icons */}
          <div className="flex justify-center items-center space-x-8 space-x-reverse opacity-60">
            <Calendar className="w-8 h-8 text-secondary animate-pulse" />
            <Crown className="w-10 h-10 text-primary animate-pulse delay-300" />
            <Palmtree className="w-8 h-8 text-secondary animate-pulse delay-700" />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 opacity-20">
          <div className="w-full h-full border-4 border-secondary rounded-full animate-spin slow"></div>
        </div>
        <div className="absolute bottom-10 right-10 w-16 h-16 opacity-20">
          <div className="w-full h-full bg-gradient-gold rounded-lg animate-bounce slow"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">لماذا  Arab-Studio؟</h2>
            <p className="text-muted-foreground text-lg">تجربة فريدة تجمع بين الأصالة والتاريخ</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/30">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-desert rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Games Preview */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-card/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">ألعاب ثقافيه ممتعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2 space-x-reverse">
                  <Calendar className="w-6 h-6 text-amber-600" />
                  <span>التقاط التمر</span>
                </CardTitle>
                <CardDescription>اجمع التمر السعودي في سلتك</CardDescription>
              </CardHeader>
            </Card>
            <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2 space-x-reverse">
                  <Crown className="w-6 h-6 text-emerald-600" />
                  <span>طيران الصقر</span>
                </CardTitle>
                <CardDescription>حلق مع الصقر في الصحراء</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <Link to="/games">
            <Button size="lg" className="btn-gold">
              <Gamepad2 className="w-5 h-5 ml-2" />
              العب الآن
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
