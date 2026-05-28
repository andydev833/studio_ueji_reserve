import { Check } from 'lucide-react';

const steps = ['プラン', '方法', '日程', 'お客様情報', 'お子さま', '決済', '完了'];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="step-indicator">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        return (
          <div key={i} className="step-indicator__step">
            <div
              className={`step-indicator__circle ${isActive ? 'step-indicator__circle--active' : ''} ${isCompleted ? 'step-indicator__circle--completed' : ''}`}
            >
              {isCompleted ? <Check size={14} /> : stepNum}
            </div>
            {i < steps.length - 1 && (
              <div className={`step-indicator__line ${isCompleted ? 'step-indicator__line--active' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
