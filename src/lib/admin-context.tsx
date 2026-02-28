"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { PRODUCTS as STATIC_PRODUCTS } from "./products";
import { NEIGHBORHOODS as STATIC_NEIGHBORHOODS, type Neighborhood } from "./neighborhoods";
import { CATEGORIES as STATIC_CATEGORIES } from "./products";
import type { Product } from "./cart-context";

interface AdminContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;

  neighborhoods: Neighborhood[];
  addNeighborhood: (n: Omit<Neighborhood, "id">) => void;
  updateNeighborhood: (n: Neighborhood) => void;
  deleteNeighborhood: (id: string) => void;

  cities: string[];
  addCity: (name: string) => void;
  updateCity: (oldName: string, newName: string) => void;
  deleteCity: (name: string) => void;

  categories: { id: string; label: string }[];
  addCategory: (label: string) => void;
  deleteCategory: (id: string) => void;
}

const PRODUCTS_KEY = "casadobolo_products";
const NEIGHBOR_KEY = "casadobolo_neighborhoods";
const CITIES_KEY = "casadobolo_cities";
const CATS_KEY = "casadobolo_categories";

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(STATIC_NEIGHBORHOODS);

  // Dynamic Lists
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([]);

  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(PRODUCTS_KEY);
      if (storedProducts) setProducts(JSON.parse(storedProducts));

      const storedNeighbors = localStorage.getItem(NEIGHBOR_KEY);
      if (storedNeighbors) setNeighborhoods(JSON.parse(storedNeighbors));

      const storedCities = localStorage.getItem(CITIES_KEY);
      if (storedCities) {
        setCities(JSON.parse(storedCities));
      } else {
        const initialCities = Array.from(new Set(STATIC_NEIGHBORHOODS.map(n => n.city)));
        setCities(initialCities);
      }

      const storedCats = localStorage.getItem(CATS_KEY);
      if (storedCats) {
        setCategories(JSON.parse(storedCats));
      } else {
        setCategories(STATIC_CATEGORIES);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      localStorage.setItem(NEIGHBOR_KEY, JSON.stringify(neighborhoods));
      localStorage.setItem(CITIES_KEY, JSON.stringify(cities));
      localStorage.setItem(CATS_KEY, JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [products, neighborhoods, cities, categories, hydrated]);

  // Product CRUD
  const addProduct = useCallback((product: Omit<Product, "id">) => {
    setProducts((prev) => {
      const maxId = prev.length > 0 ? Math.max(...prev.map((p) => p.id)) : 0;
      return [...prev, { ...product, id: maxId + 1 }];
    });
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Neighborhood CRUD
  const addNeighborhood = useCallback((n: Omit<Neighborhood, "id">) => {
    setNeighborhoods((prev) => {
      const prefix = n.city.toLowerCase().replace(/\s+/g, "_").slice(0, 3);
      const namePart = n.name.toLowerCase().replace(/\s+/g, "_");
      const id = `${prefix}_${namePart}_${Date.now()}`;
      return [...prev, { ...n, id }];
    });
  }, []);

  const updateNeighborhood = useCallback((n: Neighborhood) => {
    setNeighborhoods((prev) => prev.map((item) => (item.id === n.id ? n : item)));
  }, []);

  const deleteNeighborhood = useCallback((id: string) => {
    setNeighborhoods((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // City Management
  const addCity = useCallback((name: string) => {
    setCities(prev => prev.includes(name) ? prev : [...prev, name]);
  }, []);

  const updateCity = useCallback((oldName: string, newName: string) => {
    setCities(prev => prev.map(c => c === oldName ? newName : c));
    setNeighborhoods(prev => prev.map(n => n.city === oldName ? { ...n, city: newName } : n));
  }, []);

  const deleteCity = useCallback((name: string) => {
    setCities(prev => prev.filter(c => c !== name));
    setNeighborhoods(prev => prev.filter(n => n.city !== name));
  }, []);

  // Category Management
  const addCategory = useCallback((label: string) => {
    const id = label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");
    setCategories(prev => [...prev, { id, label }]);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    if (id === "todos") return; // Keep "todos"
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  return (
    <AdminContext.Provider
      value={{
        products, addProduct, updateProduct, deleteProduct,
        neighborhoods, addNeighborhood, updateNeighborhood, deleteNeighborhood,
        cities, addCity, updateCity, deleteCity,
        categories, addCategory, deleteCategory
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}
