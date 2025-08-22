import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Trophy, Star, Play, ArrowLeft, Calendar, Zap } from "lucide-react";
import DateCatcherGame from "@/components/games/DateCatcherGame";
import FalconGlideGame from "@/components/games/FalconGlideGame";

type GameType = "menu" | "date-catcher" | "falcon-glide";

const Games = () => {
  const [activeGame, setActiveGame] = useState<GameType>("menu");

  const games = [
    {
      id: "date-catcher",
      title: "التقاط التمر",
      description: "اجمع أكبر عدد من التمر السعودي في سلتك قبل انتهاء الوقت",
      icon: Calendar,
      difficulty: "سهل",
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      players: "لاعب واحد"
    },
    {
      id: "falcon-glide",
      title: "طيران الصقر",
      description: "ساعد الصقر السعودي على التحليق وتجنب العقبات في الصحراء",
      icon: Zap,
      difficulty: "سهل", 
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      players: "لاعب واحد"
    }
  ];

  const renderGameContent = () => {
    switch (activeGame) {
      case "date-catcher":
        return <DateCatcherGame onBack={() => setActiveGame("menu")} />;
      case "falcon-glide":
        return <FalconGlideGame onBack={() => setActiveGame("menu")} />;
      default:
        return renderGameMenu();
    }
  };

  const renderGameMenu = () => (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-saudi rounded-2xl flex items-center justify-center shadow-lg">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-saudi bg-clip-text text-transparent">
           الألعاب السعودية
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          استمتع بمجموعة من الألعاب المميزة المستوحاة من الثقافة السعودية الأصيلة
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">فقط 2</h3>
            <p className="text-muted-foreground">ألعاب متاحة</p>
          </CardContent>
        </Card>
        <Card className="text-center bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardContent className="pt-6">
            <Star className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">تراثية</h3>
            <p className="text-muted-foreground">ألعاب سعودية</p>
          </CardContent>
        </Card>
        <Card className="text-center bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <Gamepad2 className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">استمتع</h3>
            <p className="text-muted-foreground"></p>
          </CardContent>
        </Card>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <Card key={game.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`w-12 h-12 ${game.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">{game.title}</CardTitle>
                      <div className="flex items-center space-x-2 space-x-reverse mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {game.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{game.players}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-3">
                  {game.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setActiveGame(game.id as GameType)}
                  className="w-full btn-saudi group-hover:shadow-lg transition-all duration-300"
                >
                  <Play className="w-4 h-4 ml-2" />
                  ابدأ اللعب
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          المزيد من الألعاب الشيقة قادمة قريباً... ترقبوا!
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {activeGame !== "menu" && (
        <div className="sticky top-16 z-40 bg-card/80 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <Button
              variant="ghost"
              onClick={() => setActiveGame("menu")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للقائمة
            </Button>
          </div>
        </div>
      )}
      {renderGameContent()}
    </div>
  );
};

export default Games;