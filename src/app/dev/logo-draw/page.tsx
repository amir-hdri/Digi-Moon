import type { Metadata } from 'next';
import { DigiMoonAnimatedLogo } from '@/components/ui/DigiMoonAnimatedLogo';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LogoDrawDevPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_30%_20%,#064e3b_0%,#022c22_45%,#030d12_100%)]">
      <DigiMoonAnimatedLogo size="hero" draw shine="once" showOrbit showSparkles />
    </main>
  );
}
