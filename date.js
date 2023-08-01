const arrDay = [
    "Domigo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sábado",
];

const arrMonth = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Dicimebre"
];

const day = arrDay[new Date().getDay()];
const month = arrMonth[new Date().getMonth()];
const year = new Date().getFullYear();

export { day, month, year }