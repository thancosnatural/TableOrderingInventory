import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { LOGOS } from '../constants/branding';

const socialLinks = [
    {
        icon: LOGOS.instagram,
        label: "Instagram",
        url: "https://www.instagram.com/thancos_natural_official/",
    },
    {
        icon: LOGOS.facebook,
        label: "Facebook",
        url: "https://www.facebook.com/ThancoNaturaIcecream",
    },
];


export default function Footer() {
    return (
        <footer className="bg-white border-t pt-8 pb-4 text-sm text-gray-700">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 px-4 md:px-8">

                {/* Logo + Social */}
                <div className="col-span-2 md:col-span-1 space-y-4">
                    <img src={LOGOS.logo} alt="Thanco's Logo" className="h-10" />
                    <ul className="space-y-1">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Profile</a></li>
                        <li><a href="#">My Cart</a></li>
                    </ul>
                    <div className="hidden md:flex space-x-4">
                        {socialLinks.map(({ icon, label, url }) => (
                            <a
                                key={label}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:scale-110 transition-transform"
                            >
                                <img src={icon} alt={label} className="w-6 h-auto" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Fruit Flavors */}
                <div>
                    <h4 className="text-orange-600 font-semibold mb-2">Fruit Flavors</h4>
                    <ul className="space-y-1">
                        <li>Tender Coconut</li>
                        <li>Sitaphal</li>
                        <li>Alphonso mango</li>
                        <li>Guava</li>
                        <li>Chickoo</li>
                        <li>Litchee</li>
                        <li>Strawberry</li>
                        <li>Jack fruit</li>
                        <li>Real Bean vanilla</li>
                    </ul>
                </div>

                {/* Dry Fruit Ice Cream */}
                <div>
                    <h4 className="text-orange-600 font-semibold mb-2">Dry Fruit Ice cream</h4>
                    <ul className="space-y-1">
                        <li>Anjeer</li>
                        <li>Anjeer Almond</li>
                        <li>Fig & Honey</li>
                        <li>Mixed Dry fruits</li>
                        <li>Butterscotch</li>
                        <li>Kesar pista</li>
                        <li>Roasted almond</li>
                        <li>Blackcurrant</li>
                    </ul>
                </div>

                {/* Chocolate Ice Cream */}
                <div>
                    <h4 className="text-orange-600 font-semibold mb-2">Chocholate Ice cream</h4>
                    <ul className="space-y-1">
                        <li>Belgian dark chocolate</li>
                        <li>Belgian almond</li>
                        <li>Belgian chips</li>
                        <li>Choco chips</li>
                        <li>Oreo cookie</li>
                    </ul>
                </div>

                {/* Sugarless + Special */}
                <div>
                    <h4 className="text-orange-600 font-semibold mb-2">Sugarless Ice cream</h4>
                    <ul className="space-y-1 mb-4">
                        <li>SF Anjeer</li>
                        <li>SF Tender coconut</li>
                    </ul>
                    <h4 className="text-orange-600 font-semibold mb-2">Special Flavors</h4>
                    <ul className="space-y-1">
                        <li>Lotus Biscoff ice cream</li>
                    </ul>
                </div>
            </div>

            <div className="mt-10 text-center text-gray-500 text-xs border-t pt-4">
                © Thancos natural foods pvt.ltd
            </div>
        </footer>
    );
}
