// RED FLAGS 🚩🚩🚩- patrones de posible estafa - lista de chequeo
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
	"Oferta recibida sin haber aplicado",
];

// guarda el historial de analisis de la sesion
let historialAnalisis = [];

// cuenta cuantos analisis se hicieron
let contadorAnalisis = 0;

// FUNCION 1 : Inicia el analisis (junta los datos)
function iniciarAnalisis() {
	console.log("=== DETECTOR DE ESTAFAS LABORALES ===\n");

	// el contador va incrementando cada vez que inicia un analisis
	contadorAnalisis++;
	console.log(`Análisis #${contadorAnalisis}`);
	console.log(
		"Por favor, responde las siguientes preguntas sobre la oferta laboral.\n"
	);

	// confirm() para ? de si/OK = true o no/CANCEL = false
	let solicitanDinero = confirm(
		"¿La oferta solicita algún pago o inversión inicial?"
	);
	let salarioAlto = confirm(
		"¿El salario ofrecido es más alto que el promedio del mercado?"
	);
	let pidenDatosBancarios = confirm(
		"¿Te pidieron datos bancarios antes de una entrevista?"
	);

	//promt() ? de texto , devuelve el texto que usuario escribio
	//VALIDACION PARA TIPO EMAIL
	let tipoEmail = "";
	while (tipoEmail !== "corporativo" && tipoEmail !== "personal") {
		// si no responde bien vuelve a preguntar
		tipoEmail = prompt(
			"¿Qué tipo de email utilizan?\n(escribe: 'corporativo' o 'personal')"
		);

		// Si el usuario cancela= null o ok=""
		if (tipoEmail === null || tipoEmail === "") {
			alert("⚠️ Debes responder esta pregunta para continuar.");
			tipoEmail = ""; // Reiniciamos para que vuelva a preguntar
		} else {
			// Convertimos a minúsculas para que no importe si escribe CORPORATIVO o Corporativo
			tipoEmail = tipoEmail.toLowerCase().trim();
			// Si no escribió una opción válida
			if (tipoEmail !== "corporativo" && tipoEmail !== "personal") {
				alert(
					"❌ Respuesta inválida. Por favor escribe 'corporativo' o 'personal'"
				);
			}
		}
	}

	//VALIDACION PARA TIPO WEB OFICIAL
	let tieneWebOficial = "";
	while (tieneWebOficial !== "si" && tieneWebOficial !== "no") {
		tieneWebOficial = prompt(
			"¿La empresa tiene página web oficial?\n(escribe: 'si' o 'no')"
		);
		if (tieneWebOficial === null || tieneWebOficial === "") {
			alert("⚠️ Debes responder esta pregunta para continuar.");
			tieneWebOficial = "";
		} else {
			tieneWebOficial = tieneWebOficial.toLowerCase().trim();
			if (tieneWebOficial !== "si" && tieneWebOficial !== "no") {
				alert("❌ Respuesta inválida. Por favor escribe 'si' o 'no'");
			}
		}
	}

	let aplicasteVos = confirm(
		"¿Aplicaste vos mismo a esta oferta o te llegó sin solicitarla?"
	);
	let chequeEquipo = confirm(
		"¿Te mencionaron que te enviarian un cheque para comprar equipo/software?"
	);
	let tieneLinkedIn = confirm(
		"¿La empresa tiene presencia verificable en LinkedIn?"
	);

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
		numeroAnalisis: contadorAnalisis,
	};

	console.log("\n--- Datos Recopilados ---");
	console.log(datosOfertaLaboral);

	procesarAnalisis(datosOfertaLaboral); // envio ese objeto a la funcion 2
}

// FUNCION 2 : recibe los datos, calcula puntos, detecta alertas , guarda el historial
function procesarAnalisis(datos) {
	// recibo el objeto como datos

	console.log("\n=== PROCESANDO ANÁLISIS ===\n");

	//contamos los puntos de riesgo
	let puntosRiesgo = 0;

	//guardamos las senales de alertas detectadas
	let alertasDetectadas = [];

	//EVALUAMOS CADA RESPUESTA

	if (datos.solicitanDinero) {
		puntosRiesgo += 30;
		alertasDetectadas.push("⚠️ Solicitan dinero por adelantado");
		console.log("❌ Señal de alerta: Solicitan dinero (+30 puntos de riesgo)");
	}

	if (datos.salarioAlto) {
		puntosRiesgo += 30;
		alertasDetectadas.push("⚠️ Salario sospechosamente alto");
		console.log("❌ Señal de alerta: Salario muy alto (+30 puntos de riesgo)");
	}

	if (datos.pidenDatosBancarios) {
		puntosRiesgo += 25;
		alertasDetectadas.push("⚠️ Piden info bancaria demasiado pronto");
		console.log(
			"❌ Señal de alerta: Piden datos bancarios (+25 puntos de riesgo)"
		);
	}

	if (datos.tipoEmail.toLowerCase() === "personal") {
		puntosRiesgo += 15;
		alertasDetectadas.push("⚠️ Email que no pertenece a la empresa");
		console.log("❌ Señal de alerta: Email personal (+15 puntos de riesgo)");
	}

	if (datos.tieneWebOficial.toLowerCase() === "no") {
		puntosRiesgo += 20;
		alertasDetectadas.push("⚠️ No tiene web oficial");
		console.log(
			"❌ Señal de alerta: No tienen web oficial (+20 puntos de riesgo)"
		);
	}

	if (!datos.aplicasteVos) {
		puntosRiesgo += 10;
		alertasDetectadas.push("⚠️ Oferta no solicitada");
		console.log("❌ Señal de alerta: No aplicaste vos (+10 puntos de riesgo)");
	}

	if (datos.chequeEquipo) {
		puntosRiesgo += 35;
		alertasDetectadas.push("⚠️ Cheque para comprar equipo (ESTAFA COMÚN)");
		console.log(
			"❌ Señal de alerta: Cheque para equipo (+35 puntos de riesgo)"
		);
	}

	if (!datos.tieneLinkedIn) {
		puntosRiesgo += 20;
		alertasDetectadas.push("⚠️ Sin presencia verificable en LinkedIn");
		console.log(
			"❌ Señal de alerta: No tienen LinkedIn (+20 puntos de riesgo)"
		);
	}

	console.log(`\n📊 Total de puntos de riesgo: ${puntosRiesgo}`);

	//Guardamos el resultado en el historial
	let resultadoAnalisis = {
		numeroAnalisis: datos.numeroAnalisis, // x oferta = Análisis #1
		puntosRiesgo: puntosRiesgo,
		alertasDetectadas: alertasDetectadas,
		fecha: new Date().toLocaleString(),
	};

	historialAnalisis.push(resultadoAnalisis);

	// Llamamos a la función que muestra los resultados
	mostrarResultados(puntosRiesgo, alertasDetectadas);
}

// FUNCION 3 : muestra el resultado/mensaje final al usuario
function mostrarResultados(puntos, alertas) {
	console.log("\n=== RESULTADO DEL ANÁLISIS ===\n");

	let conclusion = "";
	let nivelRiesgo;

	if (puntos >= 60) {
        // 60-185 puntos = ALERTA MÁXIMA
		conclusion = "🚨 ALERTA MÁXIMA - POSIBLE ESTAFA";
		nivelRiesgo = "MUY ALTO";
	} else if (puntos >= 40) {
        // 40-59 puntos = SOSPECHOSO
		conclusion = "⚠️ SOSPECHOSO - Procede con extrema cautela";
		nivelRiesgo = "ALTO";
	} else if (puntos >= 20) {
        // 20-39 puntos = ADVERTENCIA
		conclusion = "⚡ ADVERTENCIA - Verifica más información";
		nivelRiesgo = "MEDIO";
	} else {
         // 0-19 puntos = APARENTEMENTE SEGURO
		conclusion = "✅ APARENTEMENTE SEGURO - Aún así, investiga";
		nivelRiesgo = "BAJO";
	}

	console.log(`${conclusion}`);
	console.log(`Nivel de riesgo: ${nivelRiesgo}`);
	console.log(`Puntos de riesgo: ${puntos}/185\n`);

	// mostramos todas las alertas detectadas
	if (alertas.length > 0) {
		console.log("Señales de alerta detectadas:");
		for (let i = 0; i < alertas.length; i++) {
			// recorre [] muestra cada alerta
			console.log(`  ${i + 1}. ${alertas[i]}`); // accedemos al elemento del [] en la posicion i
		}
	} else {
		console.log("✓ No se detectaron señales de alerta obvias.");
	}

	let mensajeAlerta =
		conclusion +
		"\n\n" +
		"Nivel de riesgo: " +
		nivelRiesgo +
		"\n" +
		"Puntos: " +
		puntos +
		"/185\n\n";

	if (alertas.length > 0) {
		// si el array tiene al menos 1 elemento
		mensajeAlerta += "Alertas detectadas: " + alertas.length + "\n\n";
		mensajeAlerta += "Revisa la consola para mas detalles.";
	}
    
    //muestra el mensaje de alerta / resultado final
	alert(mensajeAlerta);
}
