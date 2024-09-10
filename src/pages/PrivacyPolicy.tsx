import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Ensure this is defined in your .env file

const PrivacyPolicy = () => {
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
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-lg mb-4">Effective Date: 01 August 2024</p>
        <p className="mb-4">
          <strong>1. Introduction</strong>
          <br />
          Welcome to DragonEats&Drinks.com. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and app.
        </p>
        <p className="mb-4">
          <strong>2. Information We Collect</strong>
          <br />
          <strong>Personal Information:</strong> Name, email address, and any other information you provide.
          <br />
          <strong>Usage Data:</strong> IP address, browser type, and activity on our website.
        </p>
        <p className="mb-4">
          <strong>3. How We Use Your Information</strong>
          <br />
          To provide and maintain our services.
          <br />
          To communicate with you about updates and offers.
          <br />
          To improve our website and app.
        </p>
        <p className="mb-4">
          <strong>4. How We Share Your Information</strong>
          <br />
          We do not sell or rent your personal information. We may share data with trusted third-party service providers who help us operate our services, subject to confidentiality agreements.
        </p>
        <p className="mb-4">
          <strong>5. Security</strong>
          <br />
          We implement reasonable security measures to protect your information. However, no system is completely secure, and we cannot guarantee absolute security.
        </p>
        <p className="mb-4">
          <strong>6. Your Rights</strong>
          <br />
          You have the right to access, correct, or delete your personal information. Contact us at {adminEmail} to exercise these rights.
        </p>
        <p className="mb-4">
          <strong>7. Changes to This Policy</strong>
          <br />
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website.
        </p>
        <p className="mb-4">
          <strong>8. Contact Us</strong>
          <br />
          If you have any questions about this Privacy Policy, please contact us at {adminEmail}.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
