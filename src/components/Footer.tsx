// frontend/src/components/Footer.tsx
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="bg-green-600 py-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between text-center md:text-left">
        <span className="text-sm text-white font-bold tracking-tight mb-4 md:mb-0">
          © 2024 DragonEats.com.kh. All rights reserved.
        </span>
        <span className="text-white font-bold tracking-tight flex gap-4">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </span>
      </div>
    </div>
  );
};

export default Footer;
