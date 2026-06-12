"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

function Header() {
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuOptions = user
    ? [
        { name: "Home", path: "/" },
        { name: "My Trips", path: "/my-trips" },
      ]
    : [{ name: "Home", path: "/" }];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex gap-2 items-center">
          <Image src="/logo.svg" alt="logo" width={30} height={30} />
          <h2 className="font-bold text-xl md:text-2xl">Plan Me a Trip</h2>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {menuOptions.map((menu) => (
            <Link
              key={menu.path}
              href={menu.path}
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              {menu.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <SignInButton mode="modal">
              <Button className="rounded-full px-6">Get Started</Button>
            </SignInButton>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/create-new-trip">
                <Button className="rounded-full px-6">Create New Trip</Button>
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          {menuOptions.map((menu) => (
            <Link
              key={menu.path}
              href={menu.path}
              className="block text-base font-medium text-gray-700 hover:text-primary py-2"
              onClick={() => setMobileOpen(false)}
            >
              {menu.name}
            </Link>
          ))}
          <div className="pt-2 border-t">
            {!user ? (
              <SignInButton mode="modal">
                <Button className="w-full rounded-full">Get Started</Button>
              </SignInButton>
            ) : (
              <div className="space-y-2">
                <Link href="/create-new-trip" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-full">Create New Trip</Button>
                </Link>
                <div className="flex items-center gap-3 pt-2">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-sm text-gray-600">{user.fullName}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
