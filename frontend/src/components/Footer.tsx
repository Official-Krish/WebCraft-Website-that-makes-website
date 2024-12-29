import { Linkedin, Github, Mail, Twitter } from "lucide-react";
import { Button } from "./ui/button";

export default function Footer() {
    return <div>
        <footer className="w-full border-t border-gray-800 bg-black">
            <div className="container px-4 md:px-6 py-16 mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Company</h3>
                        <ul className="space-y-2">
                            <li>
                            <a href="/about" className="text-white transition-colors">
                                About Us
                            </a>
                            </li>
                            <li>
                            <a href="/careers" className="text-gray-400 hover:text-white transition-colors">
                                Careers
                            </a>
                            </li>
                            <li>
                            <a href="/blog" className="text-gray-400 hover:text-white transition-colors">
                                Blog
                            </a>
                            </li>
                            <li>
                            <a href="/press" className="text-gray-400 hover:text-white transition-colors">
                                Press Kit
                            </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                            <a href="/docs" className="text-gray-400 hover:text-white transition-colors">
                                Documentation
                            </a>
                            </li>
                            <li>
                            <a href="/templates" className="text-gray-400 hover:text-white transition-colors">
                                Templates
                            </a>
                            </li>
                            <li>
                            <a href="/guides" className="text-gray-400 hover:text-white transition-colors">
                                Guides
                            </a>
                            </li>
                            <li>
                            <a href="/api" className="text-gray-400 hover:text-white transition-colors">
                                API Reference
                            </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                                Privacy Policy
                            </a>
                            </li>
                            <li>
                            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                                Terms of Service
                            </a>
                            </li>
                            <li>
                            <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                                Cookie Policy
                            </a>
                            </li>
                            <li>
                            <a href="/security" className="text-gray-400 hover:text-white transition-colors">
                                Security
                            </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
                        <p className="text-gray-400">Subscribe to our newsletter for the latest updates.</p>
                        <div className="flex space-x-2">
                            <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            />
                            <Button size="sm">Subscribe</Button>
                        </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center mt-16 pt-8 border-t border-gray-800">
                        <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Your Company. All rights reserved.
                        </p>
                        
                        {/* Social as */}
                        <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors">
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </a>
                        <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </a>
                        <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">LinkedIn</span>
                        </a>
                        <a href="mailto:contact@example.com" className="text-gray-400 hover:text-white transition-colors">
                            <Mail className="h-5 w-5" />
                            <span className="sr-only">Email</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
} 