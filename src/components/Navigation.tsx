import {useEffect, useState} from 'react';
import {Menu, X} from 'lucide-react';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    const navItems = [
        {name: 'About', href: '#hero'},
        {name: 'Education', href: '#education'},
        {name: 'Experience', href: '#experience'},
        {name: 'Projects', href: '#projects'},
        {name: 'Skills', href: '#skills'},
        {name: 'Research', href: '#research'},
        {name: 'Activities', href: '#activities'},
        {name: 'Interests', href: '#interests'},
        {name: 'Contact', href: '#contact'},

    ];

    // Navigation.tsx
    useEffect(() => {
        const ids = navItems.map(i => i.href.slice(1));
        const els = ids
            .map(id => document.getElementById(id))
            .filter((el): el is HTMLElement => !!el);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visible?.target?.id) setActiveSection(visible.target.id);
            },
            {
                root: null,
                threshold: [0.25, 0.5, 0.75],
                rootMargin: '-80px 0px -40% 0px',
            }
        );

        els.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);


    const scrollToSection = (href: string) => {
        const id = href.substring(1);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(id);
        }
        setIsOpen(false);
    };


    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <span className="text-xl font-bold text-gray-900">Md. Mosfikur Rahman</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => scrollToSection(item.href)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                        activeSection === item.href.substring(1)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                                    }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-200 transition-colors duration-200"
                        >
                            {isOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => scrollToSection(item.href)}
                                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200 ${
                                    activeSection === item.href.substring(1)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                                }`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
