'use client';

import React from "react";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-white/10 bg-black/30 backdrop-blur-xl font-poppins">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='text-white' viewBox="0 0 24 24"><path fill="currentColor" d="m17.713 10.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319a4.37 4.37 0 0 0 2.251-2.326l.253-.611a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251M2.828 12l4.243 4.243l-1.414 1.414L0 12l5.657-5.657L7.07 7.757zm15.515 5.657L24 12l-2.83-2.828l-1.414 1.414L21.171 12l-4.242 4.243z" /></svg>

            DevMorph
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            DevMorph is an AI-powered website builder that helps you design,
            generate, and deploy modern web experiences faster than ever.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            Product
          </h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li className="hover:text-lime-400 transition cursor-pointer">
              Features
            </li>
            <li className="hover:text-lime-400 transition cursor-pointer">
              <Link href="/projects">Projects</Link>
            </li>
            <li className="hover:text-lime-400 transition cursor-pointer">
              <Link href="/pricing">Pricing</Link>
            </li>
            <li className="hover:text-lime-400 transition cursor-pointer">
              Roadmap
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            Resources
          </h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li className="hover:text-lime-400 transition cursor-pointer">
              <Link href="/contact">Contact Us</Link>
            </li>
            <li className="hover:text-lime-400 transition cursor-pointer">
              <Link href="/docs">Documentation</Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">
            Connect
          </h4>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/amanjoc12345-netizen"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-lime-400 hover:border-lime-400/50 transition"
              title="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/aman-joshi-588708375?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-lime-400 hover:border-lime-400/50 transition"
              title="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:amanjoc12345@gmail.com"
              className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-lime-400 hover:border-lime-400/50 transition"
              title="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © 2025 DevMorph — Your AI Website Builder
      </div>
    </footer>
  );
};

export default Footer;
