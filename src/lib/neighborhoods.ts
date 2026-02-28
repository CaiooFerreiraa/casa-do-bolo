export interface Neighborhood {
  id: string;
  name: string;
  city: string; // Nova propriedade para agrupamento
  fee: number;
  zone: "gratis" | "proxima" | "media" | "distante" | "remota" | "custom";
}

export const NEIGHBORHOODS: Neighborhood[] = [
  // Vitória da Conquista
  { id: "vca_centro", name: "Centro", city: "Vitória da Conquista", fee: 0, zone: "gratis" },
  { id: "vca_recreio", name: "Recreio", city: "Vitória da Conquista", fee: 0, zone: "gratis" },
  { id: "vca_candeias", name: "Candeias", city: "Vitória da Conquista", fee: 5.0, zone: "proxima" },
  { id: "vca_bairro_brasil", name: "Bairro Brasil", city: "Vitória da Conquista", fee: 5.0, zone: "proxima" },
  { id: "vca_alto_maron", name: "Alto Maron", city: "Vitória da Conquista", fee: 5.0, zone: "proxima" },
  { id: "vca_felicia", name: "Felícia", city: "Vitória da Conquista", fee: 8.0, zone: "media" },
  { id: "vca_ibirapuera", name: "Ibirapuera", city: "Vitória da Conquista", fee: 8.0, zone: "media" },

  // Exemplo de outra cidade próxima (opcional, para demonstrar a estrutura)
  { id: "barra_centro", name: "Centro", city: "Barra do Choça", fee: 25.0, zone: "remota" },

  // Opção Customizada
  { id: "outro", name: "Outro Bairro (Digitar)", city: "Outra", fee: 15.0, zone: "custom" },
];

export const ZONE_LABELS: Record<Neighborhood["zone"], string> = {
  gratis: "Grátis 🎉",
  proxima: "Zona Próxima",
  media: "Zona Média",
  distante: "Zona Distante",
  remota: "Zona Remota",
  custom: "Taxa Padrão",
};

export function getNeighborhoodById(id: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.id === id);
}

export function findNeighborhoodByName(name: string, city?: string): Neighborhood | undefined {
  const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const normalizedName = normalize(name);
  const normalizedCity = city ? normalize(city) : null;

  return NEIGHBORHOODS.find((n) => {
    const nameMatch = normalize(n.name) === normalizedName;
    const cityMatch = !normalizedCity || normalize(n.city) === normalizedCity;
    return nameMatch && cityMatch;
  });
}
