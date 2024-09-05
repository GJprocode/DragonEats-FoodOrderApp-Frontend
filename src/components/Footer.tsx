import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="bg-green-600 py-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <span className="text-sm text-white font-bold tracking-tight">
          Copyright ©2024 DragonEats&Drinks.com All rights reserved.
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
