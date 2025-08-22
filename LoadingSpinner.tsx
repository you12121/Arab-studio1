import { Sparkles } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Saudi-themed spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-border rounded-full animate-spin border-t-primary"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            جارٍ التحميل...
          </h3>
          <p className="text-sm text-muted-foreground">
            انتظر قليلاً، نحن نحضر لك تجربة رائعة
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex space-x-1 space-x-reverse">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;