'use client';

import React from 'react';
import ContactSection from '../../components/ContactSection';
import Footer from '../../components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-10">
      <ContactSection />
      <Footer />
    </div>
  );
}
