import { ReactNode } from 'react';

export type Tone =
  | 'green'
  | 'gray'
  | 'red'
  | 'yellow'
  | 'blue';

const tones: Record<Tone, string> = {
  green:
    'bg-green-50 text-green-700 ring-green-600/20',

  gray:
    'bg-gray-100 text-gray-600 ring-gray-500/20',

  red:
    'bg-red-50 text-red-700 ring-red-600/20',

  yellow:
    'bg-amber-50 text-amber-700 ring-amber-600/20',

  blue:
    'bg-blue-50 text-blue-700 ring-blue-600/20',
};

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
}

export default function Badge({
  tone = 'gray',
  children,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        whitespace-nowrap
        rounded-full
        px-2.5
        py-1
        text-xs
        font-medium
        ring-1
        ring-inset
        ${tones[tone]}
      `}
    >
      {children}
    </span>
  );
}