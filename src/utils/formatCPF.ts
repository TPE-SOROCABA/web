export const formatCPF = (cpfRaw: string) => {
  const cpf = cpfRaw
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  return cpf;
};
