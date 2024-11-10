import { Link } from "react-router-dom";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";

const Header = () => {
  return (
    <div className="border-b-2 border-b-green-500 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl sm:text-3xl font-bold tracking-tight text-green-500 flex-1"
        >
          DragonEats.com.kh
        </Link>
        <div className="md:hidden ml-4 flex items-center relative top-[1px]">
          <MobileNav />
        </div>
        <div className="hidden md:block">
          <MainNav />
        </div>
      </div>
    </div>
  );
};

export default Header;
