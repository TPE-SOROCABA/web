export const formatPhone = (phone: string) => {
  const phoneLength = phone.length;
  const phoneFormatted =
    phoneLength === 11
      ? phone.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4")
      : phone.replace(/^(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  return phoneFormatted;
};
