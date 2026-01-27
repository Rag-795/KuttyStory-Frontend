import { Link } from 'react-router-dom';
import { Film, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-surface border-t border-border-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Film className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-semibold text-primary">Kutty Story</span>
                        </Link>
                        <p className="text-sm text-muted max-w-md">
                            Transform your ideas into stunning AI-generated videos.
                            Create, customize, and share your stories with the world.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-primary mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {['Features', 'Pricing', 'Resources', 'Contact'].map((link) => (
                                <li key={link}>
                                    <a
                                        href={`/#${link.toLowerCase()}`}
                                        className="text-sm text-muted hover:text-primary transition-colors"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-primary mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-sm text-muted hover:text-primary transition-colors"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-border-light flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted">
                        © {currentYear} Kutty Story. Made with ❤️
                    </p>
                    <div className="flex items-center gap-4">
                        {[
                            { icon: Twitter, href: '#' },
                            { icon: Github, href: '#' },
                            { icon: Linkedin, href: '#' },
                        ].map(({ icon: Icon, href }, index) => (
                            <a
                                key={index}
                                href={href}
                                className="p-2 rounded-lg text-muted hover:text-primary hover:bg-secondary transition-colors"
                            >
                                <Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
