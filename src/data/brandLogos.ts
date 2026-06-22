// cspell:words eticket vdv
export const brandLogos = [
  { name: "DHL", file: "dhl.svg", scale: 1 },
  { name: "Postbank", file: "postbank.svg", scale: 1 },
  { name: "BMW", file: "bmw.svg", scale: 1 },
  { name: "ROSSMANN", file: "rossmann.svg", scale: 1 },
  { name: "STIEBEL ELTRON", file: "stiebel-eltron.svg", scale: 0.9 },
  {
    name: "Bertelsmann Stiftung",
    file: "bertelsmann-stiftung.svg",
    scale: 1,
  },
  { name: "VHV Versicherungen", file: "vhv.svg", scale: 0.8 },
  { name: "sevenload", file: "sevenload.svg", scale: 0.9 },
  { name: "NATO", file: "nato.svg", scale: 0.9 },
  { name: "e-ticket", file: "vdv-eticket.svg", scale: 0.8 },
  { name: "t3n", file: "t3n.svg", scale: 0.8 },
  { name: "Versacommerce", file: "versacommerce.svg", scale: 0.8 },
  { name: "TUI", file: "tui.svg", scale: 0.7 },
  { name: "Ärztekammer", file: "aekn.svg", scale: 1 },
  { name: "D-TICKET", file: "d-ticket.svg", scale: 1.1 },
  { name: "Identitätsstiftung", file: "identitaetsstiftung.svg", scale: 1.1 },
];

export function logoSymbolId(file: string) {
  return `logo-${file.replace(/\.svg$/, "")}`;
}
