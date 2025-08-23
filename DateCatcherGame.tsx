import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Trophy, Timer, Target } from "lucide-react";
import { toast } from "sonner";

interface DateCatcherGameProps {
  onBack: () => void;
}

interface DateObject {
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
}

interface BasketPosition {
  x: number;
}

const DateCatcherGame = ({ onBack }: DateCatcherGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "gameOver">("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("dateCatcher-highScore");
    return saved ? parseInt(saved) : 0;
  });

  const datesRef = useRef<DateObject[]>([]);
  const basketRef = useRef<BasketPosition>({ x: 400 });
  const lastDateSpawnRef = useRef(0);
  const gameTimeRef = useRef(0);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const BASKET_WIDTH = 80;
  const BASKET_HEIGHT = 40;

  // Initialize game
  const initGame = useCallback(() => {
    datesRef.current = [];
    basketRef.current = { x: CANVAS_WIDTH / 2 - BASKET_WIDTH / 2 };
    lastDateSpawnRef.current = 0;
    gameTimeRef.current = 0;
    setScore(0);
    setTimeLeft(60);
  }, []);

  // Spawn date
  const spawnDate = useCallback(() => {
    const colors = ["#8B4513", "#A0522D", "#CD853F", "#D2691E"];
    datesRef.current.push({
      x: Math.random() * (CANVAS_WIDTH - 30),
      y: -30,
      speed: Math.random() * 3 + 2,
      size: Math.random() * 10 + 15,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }, []);

  // Handle mouse movement
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (gameState !== "playing") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    basketRef.current.x = Math.max(0, Math.min(CANVAS_WIDTH - BASKET_WIDTH, x - BASKET_WIDTH / 2));
  }, [gameState]);

  // Check collisions
  const checkCollisions = useCallback(() => {
    const basket = basketRef.current;
    
    datesRef.current = datesRef.current.filter(date => {
      // Check if date hits basket
      if (
        date.y + date.size > CANVAS_HEIGHT - BASKET_HEIGHT &&
        date.x + date.size > basket.x &&
        date.x < basket.x + BASKET_WIDTH
      ) {
        setScore(prev => prev + 10);
        return false; // Remove date
      }
      
      // Remove dates that fall off screen
      return date.y < CANVAS_HEIGHT + 50;
    });
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw desert background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, "#87CEEB"); // Sky blue
    gradient.addColorStop(0.7, "#F5DEB3"); // Wheat
    gradient.addColorStop(1, "#D2691E"); // Chocolate (sand)
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw sun
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH - 80, 80, 40, 0, Math.PI * 2);
    ctx.fill();

    // Draw palm tree silhouette
    ctx.fillStyle = "#228b226c";
    ctx.fillRect(CANVAS_WIDTH - 150, CANVAS_HEIGHT - 200, 20, 150);
    // Palm leaves
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH - 140, CANVAS_HEIGHT - 190, 40, 0, Math.PI * 2);
    ctx.fill();

    if (gameState === "playing") {
      gameTimeRef.current += 16; // ~60fps
      
      // Spawn dates
      if (gameTimeRef.current - lastDateSpawnRef.current > 1000) {
        spawnDate();
        lastDateSpawnRef.current = gameTimeRef.current;
      }

      // Update dates
      datesRef.current.forEach(date => {
        date.y += date.speed;
      });

      // Check collisions
      checkCollisions();

      // Update timer
      const newTimeLeft = Math.max(0, 60 - Math.floor(gameTimeRef.current / 1000));
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft === 0) {
        setGameState("gameOver");
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("dateCatcher-highScore", score.toString());
          toast.success("رقم قياسي جديد! 🏆");
        }
        return;
      }
    }

    // Draw dates
    datesRef.current.forEach(date => {
      ctx.fillStyle = date.color;
      ctx.beginPath();
      ctx.ellipse(date.x + date.size/2, date.y + date.size/2, date.size/2, date.size/1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Date shine effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.ellipse(date.x + date.size/3, date.y + date.size/3, date.size/4, date.size/6, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw basket
    const basket = basketRef.current;
    const basketGradient = ctx.createLinearGradient(basket.x, CANVAS_HEIGHT - BASKET_HEIGHT, basket.x, CANVAS_HEIGHT);
    basketGradient.addColorStop(0, "#D2691E");
    basketGradient.addColorStop(1, "#8B4513");
    
    ctx.fillStyle = basketGradient;
    ctx.fillRect(basket.x, CANVAS_HEIGHT - BASKET_HEIGHT, BASKET_WIDTH, BASKET_HEIGHT);
    
    // Basket weave pattern
    ctx.strokeStyle = "#654321";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(basket.x + (i * BASKET_WIDTH / 4), CANVAS_HEIGHT - BASKET_HEIGHT);
      ctx.lineTo(basket.x + (i * BASKET_WIDTH / 4), CANVAS_HEIGHT);
      ctx.stroke();
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, checkCollisions, spawnDate, score, highScore]);

  // Start game
  const startGame = () => {
    initGame();
    setGameState("playing");
  };

  // Pause/Resume
  const togglePause = () => {
    setGameState(prev => prev === "playing" ? "paused" : "playing");
  };

  // Reset game
  const resetGame = () => {
    setGameState("menu");
    initGame();
  };

  // Setup canvas and event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    canvas.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  // Game loop effect
  useEffect(() => {
    if (gameState === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, gameLoop]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">🌴 التقاط التمر السعودي</h1>
          <p className="text-muted-foreground">حرك الفأرة لتحريك السلة واجمع أكبر عدد من التمر!</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{score}</div>
              <p className="text-sm text-muted-foreground">النقاط</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Timer className="w-6 h-6 mx-auto mb-2 text-secondary" />
              <div className="text-2xl font-bold text-foreground">{timeLeft}s</div>
              <p className="text-sm text-muted-foreground">الوقت المتبقي</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold text-foreground">{highScore}</div>
              <p className="text-sm text-muted-foreground">أفضل نتيجة</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Canvas */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-b from-blue-200 to-yellow-100 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full max-w-full h-auto block cursor-none"
                style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
              />
              
              {/* Game State Overlays */}
              {gameState === "menu" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Card className="w-80">
                    <CardHeader className="text-center">
                      <CardTitle>التقاط التمر السعودي</CardTitle>
                      <CardDescription>
                        اجمع أكبر عدد من التمر في 60 ثانية!
                        <br />
                        حرك الفأرة لتحريك السلة
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={startGame} className="w-full btn-saudi">
                        <Play className="w-4 h-4 ml-2" />
                        ابدأ اللعب
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {gameState === "paused" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Card className="w-64">
                    <CardHeader className="text-center">
                      <CardTitle>اللعبة متوقفة</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button onClick={togglePause} className="w-full btn-saudi">
                        <Play className="w-4 h-4 ml-2" />
                        استمرار
                      </Button>
                      <Button onClick={resetGame} variant="outline" className="w-full">
                        <RotateCcw className="w-4 h-4 ml-2" />
                        إعادة البدء
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {gameState === "gameOver" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Card className="w-80">
                    <CardHeader className="text-center">
                      <CardTitle>انتهت اللعبة!</CardTitle>
                      <CardDescription>
                        أحسنت! لقد جمعت {score} نقطة
                        {score > highScore && (
                          <Badge className="mt-2 bg-gradient-to-r from-yellow-400 to-orange-500">
                            🏆 رقم قياسي جديد!
                          </Badge>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button onClick={startGame} className="w-full btn-saudi">
                        <Play className="w-4 h-4 ml-2" />
                        العب مرة أخرى
                      </Button>
                      <Button onClick={resetGame} variant="outline" className="w-full">
                        العودة للقائمة
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Game Controls */}
        {gameState === "playing" && (
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Button onClick={togglePause} variant="outline">
              <Pause className="w-4 h-4 ml-2" />
              إيقاف مؤقت
            </Button>
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة البدء
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateCatcherGame;