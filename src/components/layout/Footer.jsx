import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { label: "About Us", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
    Support: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Feedback", href: "#" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Disclaimer", href: "#" },
    ],
    Products: [
      { label: "Furniture", href: "#" },
      { label: "Appliances", href: "#" },
      { label: "Electronics", href: "#" },
      { label: "Decor", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-blue-200 text-white mt-20">
      {/* Main Footer Content */}
      <div className="container-max py-12 md:py-16">
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 pb-12 border-b border-secondary-800">
          <div>
            <h3 className="text-3xl font-bold text-black mb-3">Stay Updated</h3>
            <p className="text-black mb-6 leading-relaxed">
              Get the latest on rental trends, discounts, and new arrivals.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-secondary-800 text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="btn-primary">Subscribe</button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <Phone
                size={20}
                className="text-primary-400 flex-shrink-0 mt-1"
              />
              <div>
                <p className="text-sm text-black">Phone</p>
                <p className="font-semibold text-black">+91 6309005323</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail size={20} className="text-primary-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-black">Email</p>
                <p className="font-semibold text-black">
                  budimebhagyasri@gmail.com
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin
                size={20}
                className="text-primary-400 flex-shrink-0 mt-1"
              />
              <div>
                <p className="text-sm text-black ">Address</p>
                <p className="font-semibold text-black">
                  Hyderabad, Telangana, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-black mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-black hover:text-blue-500 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Bottom */}
        <div className="border-t border-secondary-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo & Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">RE</span>
                </div>
                <span className="font-bold text-lg text-black">RentEase</span>
              </div>
              <p className="text-black text-sm">
                Premium furniture and appliance rentals made simple.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-11 h-11 bg-secondary-800 hover:bg-primary-500 hover:scale-110 transition-all duration-300 rounded-full flex items-center justify-center"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 pt-8 border-t border-secondary-800 text-center text-black text-sm">
            <p>
              &copy; {currentYear} RentEase. All rights reserved. | Made with{" "}
              <span className="text-red-500">❤</span> for your comfort
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
