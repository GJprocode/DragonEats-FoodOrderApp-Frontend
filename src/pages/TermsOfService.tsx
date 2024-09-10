import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Ensure this is defined in your .env file

const TermsOfService = () => {
  const [adminEmail, setAdminEmail] = useState(''); // State to hold the admin email

  useEffect(() => {
    const fetchAdminEmail = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin-contact-info`);
        setAdminEmail(response.data.email || 'admin@dragoneats.com'); // Default if no email
      } catch (error) {
        console.error('Error fetching admin email:', error);
        setAdminEmail('admin@dragoneats.com'); // Default if API call fails
      }
    };

    fetchAdminEmail();
  }, []);

  return (
    <div className="bg-gradient-to-br from-black to-gray-900 text-white min-h-screen flex flex-col justify-center items-center py-10">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-lg mb-4">Effective Date: 01 August 2023</p>
        <p className="mb-4">
          <strong>1. Introduction</strong>
          <br />
          Welcome to DragonEats&Drinks.com. By accessing or using our website and app, you agree to these Terms of Service. If you do not agree, please do not use our services.
        </p>
        <p className="mb-4">
          <strong>2. Use of Our Services</strong>
          <br />
          You must be at least 18 years old or have parental consent to use our services.
          <br />
          You agree to provide accurate information and to update it as necessary.
        </p>
        <p className="mb-4">
          <strong>3. User Responsibilities</strong>
          <br />
          You are responsible for maintaining the confidentiality of your account and password.
          <br />
          You must not use our services for any illegal or unauthorized purpose.
        </p>
        <p className="mb-4">
          <strong>4. Content</strong>
          <br />
          All content provided on our website and app is for informational purposes only.
          <br />
          We reserve the right to modify or remove any content at our discretion.
        </p>
        <p className="mb-4">
          <strong>5. Limitation of Liability</strong>
          <br />
          Our services are provided "as is" and we make no warranties or representations of any kind.
          <br />
          We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.
        </p>
        <p className="mb-4">
          <strong>6. Termination</strong>
          <br />
          We may suspend or terminate your access to our services at any time if you violate these Terms of Service.
        </p>
        <p className="mb-4">
          <strong>7. Changes to These Terms</strong>
          <br />
          We may update these Terms of Service from time to time. We will notify you of any significant changes by posting the new terms on our website.
        </p>
        <p className="mb-4">
          <strong>8. Governing Law</strong>
          <br />
          These Terms of Service are governed by and construed in accordance with the laws of The Kingdom of Cambodia.
        </p>
        <p className="mb-4">
          <strong>9. Contact Us</strong>
          <br />
          If you have any questions about these Terms of Service, please contact us at {adminEmail}.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
