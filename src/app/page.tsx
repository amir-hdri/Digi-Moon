import { HomeClient } from '@/components/home/HomeClient';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <HomeClient footer={<Footer />} />
  );
}
