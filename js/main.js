
// RED FLAGS 🚩🚩🚩- patrones de posible estafa
const redFlags = [
    "Solicitan dinero por adelantado",
    "Prometen salarios muy altos",
    "Te envían un cheque para comprar equipo/software",
    "Piden datos bancarios antes de contactarte",
    "Email personal (gmail,yahoo) en vez del corporativo",
    "Promesas poco realistas (trabajar poco, ganar mucho)",
    "Solicitan info sensible en la primer entrevista",
    "No tienen pagina web oficial",
    "No tienen presencia en LinkedIn o info poco creíble",
    "Oferta recibida sin haber aplicado"
]

// guarda el historial de analisis de la sesion
let historialAnalisis = [];

// cuenta cuantos analisis se hicieron
let contadorAnalisis = 0;

// FUNCION 1 : Inicia el analisis (junta los datos)
function iniciarAnalisis () {
    console.log("=== DETECTOR DE ESTAFAS LABORALES ===\n")
    
    // el contador va incrementando cada vez que inicia un analisis
    contadorAnalisis++;
    console.log(`Análisis #${contadorAnalisis}`);
    console.log("Por favor, responde las siguientes preguntas sobre la oferta laboral.\n");

    // confirm() para ? de si/OK = true o no/CANCEL = false 
    let solicitanDinero = confirm("¿La oferta solicita algún pago o inversión inicial?");
    let salarioAlto = confirm("¿El salario ofrecido es más alto que el promedio del mercado?");
    let pidenDatosBancarios = confirm("¿Te pidieron datos bancarios antes de una entrevista?");

    //promt() ? de texto , devuelve el texto que usuario escribio
    let tipoEmail = prompt("¿Qué tipo de email utilizan? (escribe: 'corporativo' o 'personal')");
    let tieneWebOficial = prompt("¿La empresa tiene web oficial? (escribe: 'si' o 'no')");
    
    let aplicasteVos = confirm("¿Aplicaste vos mismo a esta oferta o te llegó sin solicitarla?");
    let chequeEquipo = confirm("¿Te mencionaron que te enviarian un cheque para comprar equipo/software?");
    let tieneLinkedIn = confirm("¿La empresa tiene presencia verificable en LinkedIn?");

    //Guardamos toda la info en un objeto que agrupa los datos relacionados
    let datosOfertaLaboral = {
        solicitanDinero: solicitanDinero,
        salarioAlto: salarioAlto,
        pidenDatosBancarios: pidenDatosBancarios,
        tipoEmail: tipoEmail,
        tieneWebOficial: tieneWebOficial,
        aplicasteVos: aplicasteVos,
        chequeEquipo: chequeEquipo,
        tieneLinkedIn: tieneLinkedIn,
        numeroAnalisis: contadorAnalisis

    };

    console.log("\n--- Datos Recopilados ---")
    console.log(datosOfertaLaboral)


}