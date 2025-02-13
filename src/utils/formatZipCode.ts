export const formatZipCode = (cep: string): string => {
  if (!cep) return cep;
  return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
};
