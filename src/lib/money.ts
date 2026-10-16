// Formato de montos compartido por el directorio y el kit.
export function formatCop(value: number): string {
  return `$${new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function formatUsd(value: number): string {
  return `USD ${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value)}`;
}
