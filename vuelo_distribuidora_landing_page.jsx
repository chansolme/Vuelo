import React, { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Truck, Gift, Instagram, MessageCircle, Coffee, CheckCircle2, X, Star, MapPin, Phone, Flame, ArrowRight } from "lucide-react";

const logoSrc = "data:image/webp;base64,UklGRkACAABXRUJQVlA4IDQCAAAwGQCdASq0ALQAPzmMpm0jqKKhIggAgA2JaQB2APwAAH6cjwD4qE7G8T//Zg1v1Y8e+y/EH2l3Kj3+4z2a1n4qv7D0QkQAgABoS4AAB7h0S9N4mRX8e8qS+0c4g+6zVKv9BfdreQpT9Hf3H7kLw3e8oU6NO8cI4vX8sUQk7Dq7f2f7JgAA";
const heroSrc = "data:image/webp;base64,UklGRi5dAQBXRUJQVlA4ICJdAQAwKwCdASqEAlgBPm02mUikIyKhIAgAgA2JaW7hd2Ee/vwCjEbNUJ5Kp3TAhY9x5+P/UUpo6vpyu0B9Yg8ssR0z/48ZiznV0T+7kUc1g8Yw9G6rQ9O1KXqN9JdUEihs5x+3i2Hn+lH8Ceu0GNeHeZ4mSxk2XYmMnr0dr7yxSE2m4p4HfJfZc8lvD5h9k0/HDAi4vYxbVAPQRVQu6xk9Jv0xWLjrxRkzQfP3mJTaY9cS9z5i8QW04qZ8iPqP+Kx8uf9M0m5N1h6oD0om1D4UY4P5l4d+j2GU0b7hC2eN7rFYdnV93UhxXv+8u+gW0HdwZT7N1uLr9g9m3hW10v0l1R6s3w6y+6tQhxT6G4lLzqik3+SRhdYvh1Y7ok3GdGKN6i4pe2Ue6HkoXmHkqceh3WmA3ep5+3NhvMGu4Q7yblhJqNrSf0oQEWG2dMeNfI5J8tdLkpcutmv6tQ6/QdM4V2wRmhQnW+W7p5Y2+I8xRBlpDTaPH3Hz1xe3xbV3ovw5s3xwNQGUrI2Hs4JmQ8Sg8TYc1Fv2j1zfhc1bYB+vhZ2y0yHoKx4T5FQ5dkgHqevtt64lZQSt5swYx6vkaAmdrb6+PxmDSv9c1r5w4s+zNN8PkABQ3k8v3LhDwqkKoj0G4AIKc1t+YUf27dfiTmxqNQ1m3k4m0W6n6T94q5sPZ8O9QmPUC+S2ATVfKQvX3mXq8lctdL63qjrk0pOUr0pnkTwkTiG3Zj0mSQHnWq3GmP3W7Jc+PWuVj8qjKcvwCHVr0ZXuK4V6j8Tr4m9ut8UdcK+jlwmJzyamvWPej8obFT2lIG6hK/1lWW2nlvRzI/2dS8ZV6CQeD1n7a+bJ9p5Jg5pNqnPcpcME0Yu5nfQhYvJf1b3q+i+PnQfAGf4VGY1i0HxVBJ6SfdA3J0qP1jS3Yx1Qc8vgko2lWrmYJr+GddxZ+jlwm1f3d8o0Y/9/A+Wl1w7sV1M1lTj5x9u2h/1+ZQKhk5+KJdxR9o6Md1PjY+t0cS/bHg5no0n+5KXhRyM8uJPN4m9LUErnXwU4S1pc6v5EcWQgIjf5bNe3+3j9N8kB8xxz2hO9Whc54hK8Ih2L6mlasv2UrQj8bZrSzu0QZVd6Xg9m+fPty8SliK9gXdk0+CPdT2SiH8Bb+rnNyhSxp5bnfZlKkRv7kqeq3Txq+Yd5qpW0mP8+F9dZr6g9mD5F6/0d6mKytT+WNpfa2r2sY0QYwT7SqcdzLxk2dT4C3c5u3x0vI95GpLeYcQSqmCIEd5cr8m0L4OnGtbjk3wd3m6jYWN9iFvOnl0P4Zjl+nyVeEw3T7S6T6z93IuQWn2V5Pz6w7UqgYAxQ4S0z3X6OzwmFhl1vSgjyI6E0QK2Tk0+J8d4vR5xa4v9W5+q1otK1l8WvBFlzbgt4jTRvYl6aTpMGsWpY6rsuVnK1Wp5dfmVv2f8L7XqA0hxuV0AAAA=";

const products = [
  {
    id: "brasil",
    name: "Brasil",
    pricePerKg: 32000,
    image: "data:image/webp;base64,UklGRqRaAABXRUJQVlA4IKhaAAAQEgCdASpAAIMAPm02mUikIyKhIAgAgA2JaW7hd2Ee/vwAAG6nJYtLQ4y7b5v2O+Zj4L4z3dnjf+ofR3Iu7MvwQbBo/3iS5Q4xSQU2bl0LJm5nrc56M8oq8r6+Uf8QdOj7xtV8w6D7hYMeiwd6NcwNfbkZ8I6m+6b4DGWmQ4wL93X5d3P5kBcf1Yy6v+1q9TtOsyu4A4dwJqzrmxSW1rM8qkPmS0+uRql5pAecwdDkbcipw4W3yYIuYJcaTvjS83ztgVEm8XrJ+O2vH9Gz6B3mGzqz4v5R7xP7C8d5mcm7nQmAn6zD0PR0m8bA2AhPuYz8T4q6g6I8jA4E52nQ9P7um2QO4pvjTt4uFCKoY69q7K4A6aWEhA3Y3fH6iNfJj6HbaW6f+b8hqt5eX3t2tW+Ak6v3D8H6YbZTJmgT3rD2+YqhPnxw0AA" ,
    accent: "#4D98A3",
    region: "Sur de Minas Gerais, Caetano",
    process: "Natural",
    altitude: "1200 M.S.N.M",
    notes: "Chocolate, Caramelo y Almendra",
    variety: "Bourbon Amarillo, Mundo Novo",
    badge: "Equilibrado"
  },
  {
    id: "bolivia",
    name: "Bolivia",
    pricePerKg: 32000,
    image: "data:image/webp;base64,UklGRqqBAABXRUJQVlA4IJ6BAABQFQCdASpAAIMAPm02mUikIyKhIAgAgA2JaW7hd2Ee/vwAAG7LJq6bWR6eavwjc8z3N0po5m1qv9w8rX0l9hSJXrWtJ1h7oiv0QvHqYYcku4F5Lhpn6k1e7x6i9cN++xNdl1rs3E9z4Fn1Y7eHLo+tIY3PkUoJtN+7ng7daWjJw2XvXf5zX9ljh6X+Q6dvaMtT2nBpm4f8+TqV7l9+hzs3t6+UwHFlq3L0cmG3Zc2GP6b1Qe9Qqu2w3u2M9JcL+tiKDFz6gzt6Cqo2i8vYd+1v+mTpqen2vVtq7yQ8WJexxj7o8aUs5lZrAfpnqwv0zFD2oDhD9+7VG1pX5wI7F7T0J8cSn8z2mPvYs6xVhX7Qm5kDsx+2+5c/lf0P6Xth7bN8u8hva4oWPrYv7HV2AMcQAA" ,
    accent: "#D9AA47",
    region: "Caranavi",
    process: "Lavado",
    altitude: "1600 M.S.N.M",
    notes: "Cacao, Limón y Avellana",
    variety: "Catuai, Typica, Caturra",
    badge: "Dulce cítrico"
  },
  {
    id: "colombia",
    name: "Colombia",
    pricePerKg: 32000,
    image: "data:image/webp;base64,UklGRmaAAABXRUJQVlA4IFqAAABQFACdASpAAH0APm02mUikIyKhIAgAgA2JaW7hd2Ee/vwAAG7zqVqF7z5H4b8V+x9WnZ8x+TNV9sWw+0QavX3Us2W8ssH9X8y7/1Qf9m7wZutj9eYt7r1bdI6efP7g9Nb8K7vN+V9H8q4/cW6k+LzStOcvxt7uDgWdu1wW2iJax0rB3xn5i9o3hOo4iHD0HzVY6J+F4qvO8L8ncb6ymP7N6a9QnvtjdmC0g1WZk9xgG4eYQmF4C9bqoyKvl+g0+na3YH+KkT6pUzeOPb9s4tX7r+e2khjT0zZgqTyl6q7w9xV5/3k0UQ8i7wPjUh1KSmJ0TAAA=" ,
    accent: "#D5CF7C",
    region: "Caldas",
    process: "Lavado",
    altitude: "1700 M.S.N.M",
    notes: "Manjar, Toffee, Frutos Secos",
    variety: "Castillo, Caturra",
    badge: "Clásico goloso"
  },
  {
    id: "honduras",
    name: "Honduras",
    pricePerKg: 32000,
    image: "data:image/webp;base64,UklGRqaBAABXRUJQVlA4IJqBAABQFACdASpAAIMAPm02mUikIyKhIAgAgA2JaW7hd2Ee/vwAAG8V5z4R9+9r8nOZ1xQx2s6r6dHTm9m6S+Z5r2YcNX3++A53c4jZ+3m+5N3++D9p+u6P9t7X1nJq/3+74N1H2n2mwc3Od3XX4q0ytP1yV9b2P8lqO3fE3ht2e+ZPj2r7pPS1iTXC8PivZyq7xOqE2dGHWw9xAOsDq/4b8a1R8yy3QO0gpXn7Ud0/bM8u2eFpsaR9X9m9sgzH8Fvnw5m3Hv+ubWXWTMZAP0QWz3lF2nM7R53B1m3uYg4bNRh1l1iX3m4cQdD+huwn3r4J4t3M4m6ka1jT5qE3Yw0AA" ,
    accent: "#37B9E8",
    region: "Jesús de Otoro, Intibuca, Finca Las Caobas",
    process: "Lavado",
    altitude: "1600 M.S.N.M",
    notes: "Cacao, Durazno y Caramelo",
    variety: "Parainema",
    badge: "Suave frutal"
  },
  {
    id: "ruanda",
    name: "Ruanda",
    pricePerKg: 44000,
    image: "data:image/webp;base64,UklGRqaBAABXRUJQVlA4IJqBAABQFACdASpAAIMAPm02mUikIyKhIAgAgA2JaW7hd2Ee/vwAAG8YbJ1N1E0v8+wvzv+yr8d7WZ+7r+2v7v7I/f7R+y6r1s5+3u3t+S3Kyxr9y4Gfbv3na7v9t+9pfx1+v8j6Juf7kNfzncqPvtf6V4afV0U9qV2x17D9h8WnW8j9Fv0vS4l4gWZc1wUyKJ8ZpT4lq3wI+u1Z8gXuDfPYyZ8Cyf5g+ov1X+7+5i6Qe6wXam4G4Vwd7s6w5+CXi9F5Z4oW1xj5DYc9fVfm7I2H7v4b0Xg5x9vj9FivmKPS9W4jF+QnWm2d8wJ3f5/3Zr0N5AA==" ,
    accent: "#F28A12",
    region: "Gaseke, Valle Nyakanuye, Rusizi",
    process: "Lavado",
    altitude: "2100 M.S.N.M",
    notes: "Durazno, Hibiscus y Pomelo",
    variety: "Bourbon Rojo",
    badge: "Alta complejidad"
  },
  {
    id: "etiopia",
    name: "Etiopía",
    pricePerKg: 44000,
    image: "data:image/webp;base64,UklGRuJ2AABXRUJQVlA4INZ2AABwGQCdASpAAIMAPm02mUikIyKhIAgAgA2JaW7hd2Ee/vwAAG7wzq4m+vfj3n++F3v+zP87+8P+0X7v+YbD7S9Qd4tTXh3h4nq7aNQX5m0+vvaT7V0n2Z7sPtM1G1iX4m4uE8V9mH+qkR5l8a3eKX7Z7F7E9C2r+2f+K2vY8aYqg8nZ2yq4eMwXWeovTRmhtd+G8hQz8PPD0Njlwmn9Ue+eObx8vzwS84c6Z0o7a4Y6y8aVx2Ih6gF0d8Wxy0r7H2tFJr1PN8f1f2u2C3zXr8X+5v5G3vBx9T6NhvY4D6xQ1iG18o6c5uAKm/Bm7h8m1RvvYzX5nfXnq9Pcb9RkP8xXQ7jV3n6WAAAA" ,
    accent: "#4DBB2F",
    region: "Oromia",
    process: "Lavado",
    altitude: "1800 M.S.N.M",
    notes: "Pimienta, Chocolate Amargo y Uva Morada",
    variety: "Jarc",
    badge: "Exótico"
  },
];

const grindOptions = ["Grano entero", "Francesa", "Italiana", "Espresso", "Goteo"];
const qtyOptions = [0.25, 0.5, 0.75, 1, 1.5, 2, 3];
const WHATSAPP_NUMBER = "56954177638";
const INSTAGRAM_URL = "https://www.instagram.com/vuelo.distribuidora/";

const money = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

function lineTotal(pricePerKg, kg) {
  return Math.round(pricePerKg * kg);
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildWhatsappText(cart, customer) {
  const lines = [
    "Hola, quiero hacer un pedido en Distribuidora Vuelo.",
    "",
    "Detalle del pedido:",
    ...cart.map((item, index) =>
      `${index + 1}. ${item.name} | ${item.kg} kg | Molienda: ${item.grind} | Subtotal: ${money(item.subtotal)}`
    ),
    "",
    `Total: ${money(cart.reduce((acc, item) => acc + item.subtotal, 0))}`,
    "",
    "Datos de contacto:",
    `Nombre: ${customer.name || "No indicado"}`,
    `Comuna / sector: ${customer.commune || "No indicado"}`,
    `Teléfono de respaldo: ${customer.phone || "No indicado"}`,
    `Notas: ${customer.notes || "Sin notas"}`,
    "",
    "Entiendo que el despacho es gratis en Valparaíso y Viña del Mar.",
    "También quiero participar en el sorteo del mes de la máquina de espresso Oster PrimaLatte.",
  ];

  return encodeURIComponent(lines.join("\n"));
}

function ProductCard({ product, onAdd }) {
  const [grind, setGrind] = useState("Grano entero");
  const [kg, setKg] = useState(1);

  return (
    <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)]">
      <div className="relative">
        <img
          src={product.image}
          alt={`Café ${product.name}`}
          className="h-64 w-full object-cover"
        />
        <div className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
          {product.badge}
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900">{product.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{product.notes}</p>
          </div>
          <div
            className="rounded-2xl px-3 py-2 text-right"
            style={{ backgroundColor: product.accent }}
          >
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-black/70">
              Precio
            </div>
            <div className="text-lg font-black text-black">{money(product.pricePerKg)} / kg</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Región
            </div>
            <div className="mt-1 text-slate-800">{product.region}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Proceso
            </div>
            <div className="mt-1 text-slate-800">{product.process}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Altura
            </div>
            <div className="mt-1 text-slate-800">{product.altitude}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Variedad
          </div>
          <div className="mt-1 text-sm text-slate-700">{product.variety}</div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Molienda</span>
            <select
              value={grind}
              onChange={(e) => setGrind(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
            >
              {grindOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Cantidad</span>
            <select
              value={kg}
              onChange={(e) => setKg(Number(e.target.value))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
            >
              {qtyOptions.map((option) => (
                <option key={option} value={option}>
                  {option} kg
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-4 text-white">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Subtotal</div>
            <div className="text-2xl font-black">{money(lineTotal(product.pricePerKg, kg))}</div>
          </div>
          <button
            onClick={() => onAdd(product, grind, kg)}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:scale-[1.02]"
          >
            <ShoppingCart className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, cart, setCart, customer, setCustomer }) {
  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.subtotal, 0),
    [cart]
  );

  const updateItemQty = (id, nextQty) => {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              kg: nextQty,
              subtotal: lineTotal(item.pricePerKg, nextQty),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsappText(cart, customer)}`;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-xl transform overflow-y-auto border-l border-white/10 bg-slate-950 text-white shadow-2xl transition duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/90 px-5 py-4 backdrop-blur">
          <div>
            <div className="text-sm uppercase tracking-[0.18em] text-slate-400">Tu pedido</div>
            <h3 className="text-2xl font-black">Carrito</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl border border-white/10 p-2 text-slate-300 transition hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-amber-300" />
              <div>
                <div className="font-bold">Promoción del mes</div>
                <div className="text-sm text-slate-300">
                  Todas las compras participan en el sorteo de una Oster PrimaLatte.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-white/10 px-5 py-10 text-center text-slate-400">
                Aún no agregas café al carrito.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-bold">{item.name}</div>
                      <div className="text-sm text-slate-300">{item.grind}</div>
                      <div className="mt-1 text-sm text-slate-400">
                        {money(item.pricePerKg)} / kg
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:text-white"
                    >
                      Quitar
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <label className="flex-1">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        Cantidad
                      </span>
                      <select
                        value={item.kg}
                        onChange={(e) => updateItemQty(item.id, Number(e.target.value))}
                        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-white/30"
                      >
                        {qtyOptions.map((option) => (
                          <option key={option} value={option}>
                            {option} kg
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Subtotal</div>
                      <div className="text-xl font-black">{money(item.subtotal)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <h4 className="text-lg font-bold">Datos para enviar el pedido</h4>
            <div className="mt-4 grid gap-3">
              <input
                type="text"
                placeholder="Nombre"
                value={customer.name}
                onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-white/30"
              />
              <input
                type="text"
                placeholder="Comuna o sector"
                value={customer.commune}
                onChange={(e) => setCustomer((c) => ({ ...c, commune: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-white/30"
              />
              <input
                type="text"
                placeholder="Teléfono de respaldo"
                value={customer.phone}
                onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-white/30"
              />
              <textarea
                rows={4}
                placeholder="Notas del pedido"
                value={customer.notes}
                onChange={(e) => setCustomer((c) => ({ ...c, notes: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-white/30"
              />
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 text-slate-900">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Total</div>
                <div className="text-3xl font-black">{money(total)}</div>
              </div>
              <div className="text-right text-sm text-slate-500">
                Despacho gratis en Valparaíso y Viña del Mar
              </div>
            </div>

            <a
              href={cart.length ? whatsappUrl : "#productos"}
              target="_blank"
              rel="noreferrer"
              className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-center text-sm font-black transition ${cart.length ? "bg-slate-950 text-white hover:translate-y-[-1px]" : "bg-slate-200 text-slate-500"}`}
            >
              <MessageCircle className="h-5 w-5" />
              {cart.length ? "Enviar pedido por WhatsApp" : "Agrega productos para continuar"}
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

function PromoModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-900 p-2 text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-slate-950 px-6 py-5 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
            <Gift className="h-4 w-4" />
            Concurso del mes
          </div>
          <h3 className="mt-4 text-3xl font-black leading-tight">
            Todas tus compras participan por una máquina de espresso Oster PrimaLatte
          </h3>
          <p className="mt-3 text-slate-300">
            Compra tu café de especialidad y participa automáticamente en el sorteo del mes.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-amber-50 p-4">
              <div className="text-sm font-bold text-amber-700">Despacho gratis</div>
              <div className="mt-1 text-sm text-slate-700">Valparaíso y Viña del Mar</div>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <div className="text-sm font-bold text-slate-900">Pedido rápido</div>
              <div className="mt-1 text-sm text-slate-700">Arma tu carrito y envíalo a WhatsApp</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:translate-y-[-1px]"
          >
            Ver cafés disponibles
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VueloLandingPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(true);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    commune: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    const savedCart = window.localStorage.getItem("vuelo-cart");
    const savedCustomer = window.localStorage.getItem("vuelo-customer");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedCustomer) setCustomer(JSON.parse(savedCustomer));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("vuelo-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem("vuelo-customer", JSON.stringify(customer));
  }, [customer]);

  const totalItems = cart.length;
  const totalAmount = useMemo(
    () => cart.reduce((acc, item) => acc + item.subtotal, 0),
    [cart]
  );

  const addToCart = (product, grind, kg) => {
    setCart((current) => [
      ...current,
      {
        id: uid(),
        productId: product.id,
        name: product.name,
        grind,
        kg,
        pricePerKg: product.pricePerKg,
        subtotal: lineTotal(product.pricePerKg, kg),
      },
    ]);
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f2e8] text-slate-900">
      <PromoModal open={promoOpen} onClose={() => setPromoOpen(false)} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        setCart={setCart}
        customer={customer}
        setCustomer={setCustomer}
      />

      <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f7f2e8]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <img src={logoSrc} alt="Distribuidora Vuelo" className="h-11 w-11 rounded-2xl object-cover" />
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Distribuidora Vuelo
              </div>
              <div className="text-base font-black">Café de especialidad</div>
            </div>
          </a>

          <div className="hidden items-center gap-6 md:flex">
            <a href="#productos" className="text-sm font-semibold text-slate-700 transition hover:text-slate-950">
              Cafés
            </a>
            <a href="#beneficios" className="text-sm font-semibold text-slate-700 transition hover:text-slate-950">
              Beneficios
            </a>
            <a href="#contacto" className="text-sm font-semibold text-slate-700 transition hover:text-slate-950">
              Contacto
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:translate-y-[-1px]"
          >
            <ShoppingCart className="h-4 w-4" />
            Carrito
            {totalItems > 0 && (
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-300 px-2 text-xs font-black text-slate-950">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      <section id="inicio" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_26%),radial-gradient(circle_at_left,rgba(14,165,233,0.14),transparent_20%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-700">
              <Coffee className="h-4 w-4" />
              Quinientos Cuatro Coffee Roasters
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[0.95] text-slate-950 sm:text-6xl">
              Café de especialidad para tu casa, negocio o equipo.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              Distribuidora Vuelo comercializa cafés de Quinientos Cuatro. Elige tu origen,
              selecciona la molienda, arma tu carrito y envía tu pedido directo por WhatsApp.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-slate-900" />
                  <div className="font-bold text-slate-900">Despacho gratis</div>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  En Valparaíso y Viña del Mar.
                </div>
              </div>
              <div className="rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Gift className="h-5 w-5 text-slate-900" />
                  <div className="font-bold text-slate-900">Concurso mensual</div>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Todas las compras del mes participan por una Oster PrimaLatte.
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#productos"
                className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:translate-y-[-1px]"
              >
                Ver cafés disponibles
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[22px] border border-slate-300 px-6 py-4 text-sm font-black text-slate-900 transition hover:border-slate-900"
              >
                <Phone className="h-4 w-4" />
                +56 9 5417 7638
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Compra fácil
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Café fresco
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Atención por WhatsApp
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="overflow-hidden rounded-[36px] border border-black/10 bg-slate-950 shadow-[0_30px_80px_-25px_rgba(15,23,42,0.55)]">
              <img src={heroSrc} alt="Distribuidora Vuelo" className="h-full w-full object-cover" />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] bg-white p-4 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Desde</div>
                <div className="mt-1 text-2xl font-black">{money(32000)} / kg</div>
              </div>
              <div className="rounded-[28px] bg-white p-4 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Orígenes</div>
                <div className="mt-1 text-2xl font-black">6</div>
              </div>
              <div className="rounded-[28px] bg-white p-4 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Moliendas</div>
                <div className="mt-1 text-2xl font-black">5</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-[32px] bg-slate-950 p-6 text-white lg:col-span-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
              <Star className="h-4 w-4" />
              Lo que ofreces
            </div>
            <h2 className="mt-4 text-3xl font-black">Una compra simple, clara y directa.</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              El cliente elige el origen, define la molienda, selecciona los kilos y envía el pedido en un clic.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-sm">
            <Truck className="h-6 w-6 text-slate-950" />
            <h3 className="mt-4 text-xl font-black">Despacho incluido</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Todos los pedidos tienen despacho gratis en Valparaíso y Viña del Mar.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-sm">
            <Flame className="h-6 w-6 text-slate-950" />
            <h3 className="mt-4 text-xl font-black">Especialidad</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Orígenes seleccionados de Quinientos Cuatro Coffee Roasters.
            </p>
          </div>
        </div>
      </section>

      <section id="productos" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Catálogo
            </div>
            <h2 className="mt-2 text-4xl font-black">Elige tu café</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Cada origen puede agregarse al carrito con la molienda y el peso que necesites.
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
            Precios por kilo. Puedes pedir fracciones desde 0.25 kg.
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[36px] bg-white p-6 shadow-sm sm:p-8">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Cómo funciona
            </div>
            <h2 className="mt-2 text-3xl font-black">Pide en tres pasos</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[28px] bg-slate-50 p-5">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Paso 1</div>
                <div className="mt-2 text-lg font-black">Elige origen</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Revisa perfiles de sabor y selecciona el café que más te guste.
                </p>
              </div>
              <div className="rounded-[28px] bg-slate-50 p-5">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Paso 2</div>
                <div className="mt-2 text-lg font-black">Define molienda y kilos</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Grano entero o molienda específica según tu método.
                </p>
              </div>
              <div className="rounded-[28px] bg-slate-50 p-5">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Paso 3</div>
                <div className="mt-2 text-lg font-black">Envía por WhatsApp</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  El carrito arma el mensaje listo para atender el pedido.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[36px] bg-slate-950 p-6 text-white sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
              <Gift className="h-4 w-4" />
              Sorteo activo
            </div>
            <h2 className="mt-4 text-3xl font-black">Este mes compras café y participas.</h2>
            <p className="mt-4 text-slate-300">
              Todas las compras del mes entran al sorteo de una máquina de espresso Oster PrimaLatte.
            </p>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-slate-300">Ideal para promocionar</div>
              <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-200">
                <li>Compra simple desde el celular.</li>
                <li>Beneficio claro y visible desde el inicio.</li>
                <li>Carrito conectado a atención directa por WhatsApp.</li>
              </ul>
            </div>

            <button
              onClick={() => setPromoOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-[22px] bg-white px-5 py-4 text-sm font-black text-slate-950 transition hover:translate-y-[-1px]"
            >
              Ver promoción
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section id="contacto" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[36px] bg-white p-6 shadow-sm sm:p-8">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Contacto
            </div>
            <h2 className="mt-2 text-3xl font-black">Atención directa y rápida</h2>
            <div className="mt-6 space-y-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-[24px] border border-slate-200 p-4 transition hover:border-slate-900"
              >
                <div className="rounded-2xl bg-slate-950 p-3 text-white">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">WhatsApp</div>
                  <div className="font-black text-slate-900">+56 9 5417 7638</div>
                </div>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-[24px] border border-slate-200 p-4 transition hover:border-slate-900"
              >
                <div className="rounded-2xl bg-slate-950 p-3 text-white">
                  <Instagram className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Instagram</div>
                  <div className="font-black text-slate-900">@vuelo.distribuidora</div>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-[24px] border border-slate-200 p-4">
                <div className="rounded-2xl bg-slate-950 p-3 text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Cobertura actual</div>
                  <div className="font-black text-slate-900">Valparaíso y Viña del Mar</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[36px] bg-slate-950 p-6 text-white sm:p-8">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Resumen
            </div>
            <h2 className="mt-2 text-3xl font-black">Distribuidora Vuelo</h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Comercializadora de café de especialidad. Sin dirección pública por ahora, con atención directa por WhatsApp y entrega gratuita en Valparaíso y Viña del Mar.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-bold">Orígenes base</div>
                <div className="mt-2 text-2xl font-black">{money(32000)} / kg</div>
                <div className="mt-1 text-sm text-slate-400">Brasil, Bolivia, Colombia, Honduras</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-bold">Orígenes premium</div>
                <div className="mt-2 text-2xl font-black">{money(44000)} / kg</div>
                <div className="mt-1 text-sm text-slate-400">Ruanda y Etiopía</div>
              </div>
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-[22px] bg-white px-5 py-4 text-sm font-black text-slate-950 transition hover:translate-y-[-1px]"
            >
              <ShoppingCart className="h-4 w-4" />
              Abrir carrito
            </button>

            <div className="mt-6 border-t border-white/10 pt-5 text-sm text-slate-400">
              Total actual del carrito: <span className="font-black text-white">{money(totalAmount)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
