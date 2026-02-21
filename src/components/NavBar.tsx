import { NavLink } from "react-router";
import { BookOpen, Wheat } from "lucide-react";

const links = [
  { to: "/recipes", label: "Recipes", icon: BookOpen },
  { to: "/ingredients", label: "Ingredients", icon: Wheat },
];

export function NavBar() {
  return (
    <nav className="bg-brown-dark text-cream">
      <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
        <NavLink to="/" className="font-serif text-xl font-bold text-gold-light">
          Baker's Notebook
        </NavLink>
        <div className="flex gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brown text-gold-light"
                    : "text-cream/80 hover:bg-brown-light hover:text-cream"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
