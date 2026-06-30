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
    scale: 1.2,
  },
  { name: "VHV Versicherungen", file: "vhv.svg", scale: 0.8 },
  { name: "Rheinwerk Verlag", file: "rheinwerk-verlag.svg", scale: 1.1 },
  { name: "NATO", file: "nato.svg", scale: 0.9 },
  { name: "VDV eTicket Service", file: "vdv-eticket-service.svg", scale: 1.0 },
  { name: "t3n", file: "t3n.svg", scale: 0.8 },
  { name: "Versacommerce", file: "versacommerce.svg", scale: 0.8 },
  { name: "TUI", file: "tui.svg", scale: 0.7 },
  { name: "Ärztekammer", file: "aekn.svg", scale: 1 },
  {
    name: "Röchling",
    file: "roechling.svg",
    scale: 0.8,
  },
  { name: "Deutschland Ticket", file: "d-ticket.svg", scale: 1.1 },
  { name: "Identitätsstiftung", file: "identitaetsstiftung.svg", scale: 1.1 },
  { name: "Amazing outcomes", file: "amazing-outcomes.svg", scale: 1.1 },
  { name: "CHIP", file: "chip.svg", scale: 0.7 },
  { name: "G. Fleischhauer", file: "fleischhauer.svg", scale: 1.1 },
  {
    name: "Stadtflitzer von stadtmobil Hannover",
    file: "stadtflitzer.svg",
    scale: 0.9,
  },
  { name: "sevenload", file: "sevenload.svg", scale: 0.9 },
  // { name: "Trilos new media", file: "trilos.svg", scale: 1.0 },
  {
    name: "Lübecker Marzipan e.V.",
    file: "luebecker-marzipan.svg",
    scale: 1.0,
  },
  { name: "ITAG Valves Engineering", file: "itag.svg", scale: 0.9 },
];

export function logoSymbolId(file: string) {
  return `logo-${file.replace(/\.svg$/, "")}`;
}
