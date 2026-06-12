import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Github, Linkedin, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="logo" width={28} height={28} className="brightness-200" />
              <h3 className="text-white font-bold text-xl">Plan Me a Trip</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered trip planning that creates personalized itineraries,
              hotel recommendations, and budget estimates in seconds.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/create-new-trip" className="hover:text-white transition-colors">
                  Create Trip
                </Link>
              </li>
              <li>
                <Link href="/my-trips" className="hover:text-white transition-colors">
                  My Trips
                </Link>
              </li>
            </ul>
          </div>

          {/* Built With */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Built With</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {["Next.js", "React", "PostgreSQL", "Prisma", "Clerk", "Groq AI", "Tailwind CSS"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-gray-800 rounded-full text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Plan Me a Trip. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <MapPin size={16} className="text-primary" />
            <span className="text-sm text-gray-500">Made with ❤️ in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
