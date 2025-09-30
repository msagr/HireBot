"use client";

import Link from "next/link";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginButton } from "@/components/auth/login-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Bot className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">HireBot</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Revolutionize Your</span>
            <span className="block text-blue-600 dark:text-blue-400">Hiring Process</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            AI-powered interviewing platform that helps you find the best candidates faster and more efficiently than ever before.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button size="lg" className="w-full" asChild>
                <Link href="/auth/register">Start Free Trial</Link>
              </Button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
              Everything you need to streamline your hiring process
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'AI-Powered Interviews',
                description: 'Conduct intelligent interviews with our advanced AI that evaluates candidates fairly and consistently.',
                icon: '🤖'
              },
              {
                title: 'Automated Scheduling',
                description: 'Save time with our smart scheduling system that coordinates between interviewers and candidates.',
                icon: '📅'
              },
              {
                title: 'Detailed Analytics',
                description: 'Get comprehensive insights into candidate performance with our detailed analytics dashboard.',
                icon: '📊'
              },
              {
                title: 'Customizable Questions',
                description: 'Tailor interviews to your specific needs with our customizable question bank.',
                icon: '✏️'
              },
              {
                title: 'Collaborative Hiring',
                description: 'Involve your team in the hiring process with collaborative feedback and scoring.',
                icon: '👥'
              },
              {
                title: 'Secure & Compliant',
                description: 'Rest easy knowing your data is secure and compliant with industry standards.',
                icon: '🔒'
              },
            ].map((feature, index) => (
              <Card key={index} className="h-full flex flex-col">
                <CardHeader>
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Ready to transform your hiring process?
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
            Join thousands of companies that trust HireBot to find their next great hire.
          </p>
          <div className="mt-8">
            <Button size="lg" className="px-8 py-6 text-lg" asChild>
              <Link href="/auth/register">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-2">
                {['Features', 'Pricing', 'Testimonials', 'Updates'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-2">
                {['About', 'Blog', 'Careers', 'Press'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-2">
                {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Connect</h3>
              <div className="flex space-x-4 mt-4">
                {['Twitter', 'LinkedIn', 'GitHub', 'Facebook'].map((social) => (
                  <a key={social} href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                    <span className="sr-only">{social}</span>
                    <span className="text-lg">
                      {social === 'Twitter' && '𝕏'}
                      {social === 'LinkedIn' && '👔'}
                      {social === 'GitHub' && '🐙'}
                      {social === 'Facebook' && 'f'}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} HireBot. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}