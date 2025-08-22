import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Frown, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: صفحة غير موجودة");
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
            <Frown className="w-10 h-10 text-red-500" />
          </div>
          <CardTitle className="text-4xl font-bold text-foreground mb-2">404</CardTitle>
          <p className="text-xl text-muted-foreground">عذراً، الصفحة غير موجودة</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            الصفحة التي تبحث عنها قد تكون محذوفة أو غير متاحة
          </p>
          <Button onClick={handleGoHome} className="w-full btn-saudi">
            <Home className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
