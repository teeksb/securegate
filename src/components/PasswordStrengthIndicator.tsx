"use client";

interface Props {
  password: string;
}

const rules = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "Has an uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "Has a lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
  { label: "Has a number", test: (pw: string) => /[0-9]/.test(pw) },
];

function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export function PasswordStrengthIndicator({ password }: Props) {
  if (!password) return null;

  const done = rules.map((r) => r.test(password));

  const score = scorePassword(password);
  let label: string;
  let barColor: string;
  let textColor: string;

  if (score <= 2) {
    label = "Weak";
    barColor = "bg-red-500";
    textColor = "text-red-600";
  } else if (score <= 3) {
    label = "Fair";
    barColor = "bg-amber-500";
    textColor = "text-amber-600";
  } else {
    label = "Strong";
    barColor = "bg-emerald-500";
    textColor = "text-emerald-600";
  }

  const pct = (score / 5) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className={`text-xs font-medium ${textColor}`}>{label}</p>
      </div>

      <ul className="flex flex-col gap-1 text-xs">
        {rules.map((rule, i) => (
          <li
            key={rule.label}
            className={`flex items-center gap-1.5 transition-all ${
              done[i] ? "text-emerald-600" : "text-gray-500"
            }`}
          >
            <span>{done[i] ? "✓" : "•"}</span>
            <span>{rule.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
