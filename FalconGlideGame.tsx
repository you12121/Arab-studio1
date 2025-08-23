import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Trophy, Target, Zap } from "lucide-react";
import { toast } from "sonner";

interface FalconGlideGameProps {
  onBack: () => void;
}

interface FalconObject {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "cactus" | "rock";
}

interface Cloud {
  x: number;
  y: number;
  size: number;
  speed: number;
}

const FalconGlideGame = ({ onBack }: FalconGlideGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "gameOver">("menu");
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("falconGlide-highScore");
    return saved ? parseInt(saved) : 0;
  });

  const falconRef = useRef<FalconObject>({ x: 150, y: 300, velocity: 0, rotation: 0 });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const cloudsRef = useRef<Cloud[]>([]);
  const gameSpeedRef = useRef(2);
  const lastObstacleRef = useRef(0);
  const frameCountRef = useRef(0);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const FALCON_SIZE = 40;
  const GRAVITY = 0.5;
  const JUMP_FORCE = -8;

  // Initialize game
  const initGame = useCallback(() => {
    falconRef.current = { x: 150, y: 300, velocity: 0, rotation: 0 };
    obstaclesRef.current = [];
    cloudsRef.current = [];
    gameSpeedRef.current = 2;
    lastObstacleRef.current = 0;
    frameCountRef.current = 0;
    setScore(0);
    setDistance(0);
    
    // Initialize clouds
    for (let i = 0; i < 5; i++) {
      cloudsRef.current.push({
        x: Math.random() * CANVAS_WIDTH * 2,
        y: Math.random() * 200 + 50,
        size: Math.random() * 40 + 30,
        speed: Math.random() * 0.5 + 0.2
      });
    }
  }, []);

  // Handle click/space for flapping
  const handleFlap = useCallback(() => {
    if (gameState === "playing") {
      falconRef.current.velocity = JUMP_FORCE;
      falconRef.current.rotation = -20;
    }
  }, [gameState]);

  // Spawn obstacle
  const spawnObstacle = useCallback(() => {
    const types: Array<"cactus" | "rock"> = ["cactus", "rock"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    obstaclesRef.current.push({
      x: CANVAS_WIDTH,
      y: type === "cactus" ? CANVAS_HEIGHT - 120 : CANVAS_HEIGHT - 80,
      width: type === "cactus" ? 30 : 50,
      height: type === "cactus" ? 120 : 80,
      type
    });
  }, []);

  // Check collisions
  const checkCollisions = useCallback(() => {
    const falcon = falconRef.current;
    
    // Check ground and ceiling collision
    if (falcon.y + FALCON_SIZE > CANVAS_HEIGHT - 50 || falcon.y < 0) {
      setGameState("gameOver");
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("falconGlide-highScore", score.toString());
        toast.success("رقم قياسي جديد في طيران الصقر! 🦅");
      }
      return;
    }
    
    // Check obstacle collision
    for (const obstacle of obstaclesRef.current) {
      if (
        falcon.x + FALCON_SIZE > obstacle.x &&
        falcon.x < obstacle.x + obstacle.width &&
        falcon.y + FALCON_SIZE > obstacle.y &&
        falcon.y < obstacle.y + obstacle.height
      ) {
        setGameState("gameOver");
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("falconGlide-highScore", score.toString());
          toast.success("رقم قياسي جديد في طيران الصقر! 🦅");
        }
        return;
      }
    }
  }, [score, highScore]);

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    frameCountRef.current++;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw desert sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    skyGradient.addColorStop(0, "#87CEEB"); // Light blue
    skyGradient.addColorStop(0.6, "#F0E68C"); // Khaki
    skyGradient.addColorStop(1, "#F5DEB3"); // Wheat
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw sun
    ctx.fillStyle = "#FFD700";
    ctx.shadowColor = "#FFA500";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH - 100, 100, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (gameState === "playing") {
      // Update falcon physics
      const falcon = falconRef.current;
      falcon.velocity += GRAVITY;
      falcon.y += falcon.velocity;
      
      // Update rotation based on velocity
      falcon.rotation = Math.min(Math.max(falcon.velocity * 3, -45), 45);
      
      // Update game speed
      gameSpeedRef.current = Math.min(5, 2 + frameCountRef.current * 0.001);
      
      // Spawn obstacles
      if (frameCountRef.current - lastObstacleRef.current > 150) {
        spawnObstacle();
        lastObstacleRef.current = frameCountRef.current;
      }

      // Update obstacles
      obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
        obstacle.x -= gameSpeedRef.current;
        
        // Score when passing obstacle
        if (obstacle.x + obstacle.width < falcon.x && obstacle.x + obstacle.width > falcon.x - 5) {
          setScore(prev => prev + 10);
        }
        
        return obstacle.x > -obstacle.width;
      });

      // Update clouds
      cloudsRef.current.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x < -cloud.size) {
          cloud.x = CANVAS_WIDTH + Math.random() * 200;
          cloud.y = Math.random() * 200 + 50;
        }
      });

      // Update distance
      setDistance(prev => prev + 1);
      
      // Check collisions
      checkCollisions();
    }

    // Draw clouds
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    cloudsRef.current.forEach(cloud => {
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cloud.x - cloud.size * 0.5, cloud.y, cloud.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cloud.x + cloud.size * 0.5, cloud.y, cloud.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw ground
    const groundGradient = ctx.createLinearGradient(0, CANVAS_HEIGHT - 50, 0, CANVAS_HEIGHT);
    groundGradient.addColorStop(0, "#D2691E");
    groundGradient.addColorStop(1, "#8B4513");
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);

    // Draw ground pattern
    ctx.strokeStyle = "#A0522D";
    ctx.lineWidth = 2;
    for (let i = 0; i < CANVAS_WIDTH; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, CANVAS_HEIGHT - 50);
      ctx.lineTo(i + 10, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Draw obstacles
    obstaclesRef.current.forEach(obstacle => {
      if (obstacle.type === "cactus") {
        // Draw cactus
        ctx.fillStyle = "#228B22";
        ctx.fillRect(obstacle.x + 10, obstacle.y, 10, obstacle.height);
        ctx.fillRect(obstacle.x, obstacle.y + 30, 30, 10);
        ctx.fillRect(obstacle.x + 5, obstacle.y + 60, 20, 10);
        
        // Cactus spikes
        ctx.fillStyle = "#32CD32";
        for (let i = 0; i < 5; i++) {
          ctx.fillRect(obstacle.x + 12 + i * 3, obstacle.y + i * 20, 2, 8);
        }
      } else {
        // Draw rock
        ctx.fillStyle = "#696969";
        ctx.beginPath();
        ctx.ellipse(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2,
          obstacle.width / 2,
          obstacle.height / 2,
          0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Rock texture
        ctx.fillStyle = "#A9A9A9";
        ctx.beginPath();
        ctx.ellipse(
          obstacle.x + obstacle.width / 3,
          obstacle.y + obstacle.height / 3,
          obstacle.width / 6,
          obstacle.height / 6,
          0, 0, Math.PI * 2
        );
        ctx.fill();
      }
    });

    // Draw falcon
    const falcon = falconRef.current;
    ctx.save();
    ctx.translate(falcon.x + FALCON_SIZE / 2, falcon.y + FALCON_SIZE / 2);
    ctx.rotate((falcon.rotation * Math.PI) / 180);
    
    // Falcon body
    ctx.fillStyle = "#8B4513";
    ctx.beginPath();
    ctx.ellipse(0, 0, FALCON_SIZE / 2, FALCON_SIZE / 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Falcon wing
    ctx.fillStyle = "#654321";
    ctx.beginPath();
    ctx.ellipse(-5, -3, FALCON_SIZE / 3, FALCON_SIZE / 6, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Falcon head
    ctx.fillStyle = "#A0522D";
    ctx.beginPath();
    ctx.arc(FALCON_SIZE / 3, 0, FALCON_SIZE / 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Falcon beak
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.moveTo(FALCON_SIZE / 2, 0);
    ctx.lineTo(FALCON_SIZE / 2 + 8, -2);
    ctx.lineTo(FALCON_SIZE / 2 + 8, 2);
    ctx.fill();
    
    // Falcon eye
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(FALCON_SIZE / 3 + 3, -2, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, checkCollisions, spawnObstacle]);

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
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        handleFlap();
      }
    };
    
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      handleFlap();
    };
    
    window.addEventListener("keydown", handleKeyPress);
    canvas.addEventListener("click", handleClick);
    
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      canvas.removeEventListener("click", handleClick);
    };
  }, [handleFlap]);

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
          <h1 className="text-3xl font-bold mb-2 text-foreground">🦅 طيران الصقر السعودي</h1>
          <p className="text-muted-foreground">اضغط مسافة أو انقر لجعل الصقر يطير وتجنب العقبات!</p>
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
              <Zap className="w-6 h-6 mx-auto mb-2 text-secondary" />
              <div className="text-2xl font-bold text-foreground">{Math.floor(distance / 10)}م</div>
              <p className="text-sm text-muted-foreground">المسافة</p>
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
            <div className="relative bg-gradient-to-b from-blue-300 to-yellow-200 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full max-w-full h-auto block cursor-pointer"
                style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
              />
              
              {/* Game State Overlays */}
              {gameState === "menu" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Card className="w-80">
                    <CardHeader className="text-center">
                      <CardTitle>طيران الصقر السعودي</CardTitle>
                      <CardDescription>
                        ساعد الصقر على التحليق في الصحراء!
                        <br />
                        اضغط مسافة أو انقر للطيران
                        <br />
                        تجنب الصبار والصخور
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={startGame} className="w-full btn-saudi">
                        <Play className="w-4 h-4 ml-2" />
                        ابدأ الطيران
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
                        استمرار الطيران
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
                      <CardTitle>انتهت الرحلة!</CardTitle>
                      <CardDescription>
                        طيران رائع! طرت {Math.floor(distance / 10)} متر وحصلت على {score} نقطة
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
                        طيران جديد
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

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground mt-4">
          💡 نصيحة: اضغط مسافة أو انقر بشكل منتظم للحفاظ على ارتفاع الصقر
        </div>
      </div>
    </div>
  );
};

export default FalconGlideGame;