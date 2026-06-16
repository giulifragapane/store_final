import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { useCartStore } from "@/features/cart";

const publicNavLinks = [
  { label: "Productos", href: "/" },
  { label: "Carrito", href: "/cart" },
  { label: "Mis pedidos", href: "/orders" },  
];

export const NavBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const totalItems = useCartStore((state) => state.getTotalItems());

  const user = useAuthStore((state) => state.user);

  const navLinks = [
    ...publicNavLinks,
    ...(user
      ? [          
          { label: "Mis direcciones", href: "/addresses" },
        ]
      : []),
  ];

  const logoutUser = useAuthStore((state) => state.logoutUser);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-900 font-bold text-lg hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">🍕🍸</span>
          <span>RESTO BAR</span>
        </Link>

        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                  {link.href === "/cart" && totalItems > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-blue-600 text-white text-xs">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {user ? (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <Link
                to="/profile"
                className="text-right rounded-lg px-2 py-1 hover:bg-gray-100 transition-colors"
              >
                <p className="text-sm font-medium text-gray-800">
                  {user.nombre} {user.apellido}
                </p>
                <p className="text-xs text-gray-400">
                  {user.roles.map((role) => role.rol_codigo).join(", ")}
                </p>
              </Link>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
