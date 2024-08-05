import Footer from '@/components/Footer';
import { Header } from '@/components/Header';
import Invoice from '@/components/invoice/invoice';

function page() {
  return (
    <>
      <Header />
      <div className="max-w-screen-xl">
        <Invoice />
      </div>
      <Footer />
    </>
  );
}
export default page;
