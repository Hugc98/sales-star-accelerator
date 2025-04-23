
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PasswordInputProps {
  password: string;
  showPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisibility: () => void;
  feedback: {
    score: number;
    feedback: string;
  };
  disabled?: boolean;
}

const PasswordInput = ({
  password,
  showPassword,
  onChange,
  onToggleVisibility,
  feedback,
  disabled
}: PasswordInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="password">Senha</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          className="pl-10 pr-10"
          required
          value={password}
          onChange={onChange}
          disabled={disabled}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={onToggleVisibility}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Eye className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </div>
      
      {password.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center space-x-1 mt-1">
            <div className={`h-1 flex-1 rounded-full ${feedback.score >= 1 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${feedback.score >= 2 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${feedback.score >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${feedback.score >= 4 ? 'bg-green-700' : 'bg-gray-200'}`}></div>
          </div>
          
          {feedback.feedback && (
            <p className="text-xs mt-1 text-muted-foreground">
              {feedback.feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
