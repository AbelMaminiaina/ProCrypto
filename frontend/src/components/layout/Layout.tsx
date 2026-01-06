import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BetaBanner from '../common/BetaBanner';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <BetaBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
