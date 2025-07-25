export function generateSlug(name: string): string {
  return name
    .normalize("NFD") // separa acentos das letras
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase() // tudo minúsculo
    .replace(/[^a-z0-9]+/g, "-") // troca caracteres não alfanuméricos por "-"
    .replace(/^-+|-+$/g, "") // remove hífens no início/fim
    .replace(/-{2,}/g, "-"); // evita múltiplos hífens seguidos
}
