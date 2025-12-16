import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "О комитете", href: "/about" },
  { name: "Мероприятия", href: "/events" },
  { name: "Участники", href: "/participants" },
  { name: "Документы", href: "/docs" },
];

interface HeaderProps {
  transparent?: boolean;
}

export const Header = ({ transparent = false }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 border-b border-border/50",
        transparent
          ? "bg-background/90 backdrop-blur-md"
          : "bg-background/80 backdrop-blur-md"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background">
            <span className="font-semibold tracking-tighter text-xs">ТПП</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-medium tracking-tight">
              ЦИФРОВЫЕ ТЕХНОЛОГИИ
            </span>
            <span className="text-xs text-muted-foreground tracking-tight">
              САРАТОВСКАЯ ОБЛАСТЬ
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "hover:text-foreground transition-colors",
                location.pathname === item.href && "text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <Link
          to="/join"
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs font-medium rounded-md hover:bg-foreground/90 transition-colors shadow-sm"
        >
          <span>Вступить</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-6 py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2",
                  location.pathname === item.href && "text-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/join"
              className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs font-medium rounded-md hover:bg-foreground/90 transition-colors w-fit mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Вступить</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
