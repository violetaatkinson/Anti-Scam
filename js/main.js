/* RED FLAGS 🚩🚩🚩- lista de chequeo  - objeto con 3 props*/ 
const redFlags = [
	{
		puntos: 30,
		mensaje: "⚠️ Solicitan dinero por adelantado",
		// funcion que recibe datos y devuelve true o false
		evaluar: (datos) => datos.solicitanDinero === true,
	},
	{
		puntos: 30,
		mensaje: "⚠️ Salario sospechosamente alto",
		evaluar: (datos) => datos.salarioAlto === true,
	},
	{
		puntos: 25,
		mensaje: "⚠️ Piden info bancaria demasiado pronto",
		evaluar: (datos) => datos.pidenDatosBancarios === true,
	},
	{
        puntos: 15,
        mensaje: '⚠️ Email que no pertenece a la empresa',
        evaluar: (datos) => datos.tipoEmail === 'personal'
    },
	{
        puntos: 20,
        mensaje: '⚠️ No tiene web oficial',
        evaluar: (datos) => datos.tieneWebOficial === 'no'
    },
	{
        puntos: 10,
        mensaje: '⚠️ Oferta no solicitada',
        evaluar: (datos) => datos.aplicasteVos === false
    },
	{
        puntos: 35,
        mensaje: '⚠️ Cheque para comprar equipo (ESTAFA COMÚN)',
        evaluar: (datos) => datos.chequeEquipo === true
    },
	 {
        puntos: 20,
        mensaje: '⚠️ Sin presencia verificable en LinkedIn',
        evaluar: (datos) => datos.tieneLinkedIn === false
    }
];

const nivelesRiesgo = [
	{ min: 60, conclusion: "🚨 ALERTA MÁXIMA - POSIBLE ESTAFA", nivel: "MUY ALTO" },
	{ min: 40, conclusion: "⚠️ SOSPECHOSO - Procede con extrema cautela", nivel: "ALTO" },
	{ min: 20, conclusion: "⚡ ADVERTENCIA - Verifica más información", nivel: "MEDIO" },
	{ min: 0, conclusion: "✅ APARENTEMENTE SEGURO - Aún así, investiga", nivel: "BAJO" }
];

// MENSAJE DE INICIO
console.log("🔍 ANTI SCAM cargado correctamente.");
console.log("Pulsa 'Analizar Oferta' para empezar.\n");

// guarda el historial de analisis de la sesion
let historialAnalisis = [];

// cuenta cuantos analisis se hicieron en la sesion
let contadorAnalisis = 0;

// 2 params mensaje: texto del prompt y opcionesValidas: array con respuestas aceptadas
function validarRespuesta(mensaje, opcionesValidas) {
	let respuesta = "";
	//verifica si la respuesta está en el array
	while(!opcionesValidas.includes(respuesta)) {
		respuesta = prompt(mensaje);
	//El loop continúa hasta que sea válida
		if(respuesta === null || respuesta === "") {
			alert("⚠️ Debes responder esta pregunta para continuar.");
			respuesta = ""; // reinicio la respuesta "" para q while siga preguntando
		} else {
			respuesta = respuesta. toLocaleLowerCase().trim();
			
			//nuevamente valida si está en las opciones válidas
			if(!opcionesValidas.includes(respuesta)) {
				//opciones separadas por " o "
				alert(`❌ Respuesta inválida. Por favor escribe: ${opcionesValidas.join(' o ')}`)
			}
		}

	}

	return respuesta // Devuelve la respuesta válida
}

// find busca el 1er elemento del array que cumpla la condición, 
// puntos >= nivel.min verifica si los puntos obtenidos son mayores o iguales al mínimo requerido
// Resultado → un objeto con { min, conclusion, nivel } listo para usar.
function obtenerNivelRiesgo(puntos) {
	return nivelesRiesgo.find(nivel => puntos >= nivel.min);
}

// FUNCION 1 : Inicia el analisis (junta los datos)
function iniciarAnalisis() {
	console.log("=== DETECTOR DE ESTAFAS LABORALES ===\n");

	// busca nombre en localStorage sino existe null
	let nombreUsuario = localStorage.getItem("nombreUsuario");

	console.log("🔍 Buscando nombre en localStorage...");
	console.log(`Resultado: ${nombreUsuario}`); // muestra que encontro

	// si no encontro nada
	if (nombreUsuario === null || nombreUsuario === "") {
		console.log("❌ No se encontró ningun nombre guardado.");

		// 1. pedimos el nombre
		nombreUsuario = prompt("👋 ¡Bienvenido a ANTI SCAM!\n\n¿Cómo te llamas?");

		// 2. validamos - usuario cancelo o no escribio nada
		if (nombreUsuario === null || nombreUsuario.trim() === "") {
			console.log("⚠️ nombre de usuario no proporcionado.");
			alert("Necesitamos tu nombre para poder continuar 😊");
			return; // DETIENE la función, no continúa sin un nombre
		}

		// 3. guardamos en localStorage
		nombreUsuario = nombreUsuario.trim(); //sacamos los espacios
		localStorage.setItem("nombreUsuario", nombreUsuario);
		console.log(`✅ Sesión actualizada con el nombre de usuario: ${nombreUsuario}`);
		alert(`✅ Tu nombre ha sido guardado.`);
	} else {
		// ya existia el nombre
		console.log(`✅ Nombre de usuario encontrado en sesión: ${nombreUsuario}`);
	}

	console.log(`\n=== Hola ${nombreUsuario}, bienvenido al DETECTOR DE ESTAFAS LABORALES ===\n`);
	alert(`¡Hola ${nombreUsuario}! 👋\n\nVamos a analizar las ofertas laborales.`);

	// el contador va incrementando cada vez que inicia un analisis
	contadorAnalisis++;
	console.log(`Análisis #${contadorAnalisis}`); //muestra analisis 1, 2,3
	console.log("Por favor, responde las siguientes preguntas sobre la oferta laboral.\n");

	let nombreEmpresa = "";
	while (nombreEmpresa.trim() === "") { // si esta vacio sigue preguntando
		nombreEmpresa = prompt("📋 ¿Cuál es el nombre de la empresa?\n(Escribe el nombre de la empresa que ofrece el trabajo)");
		
		if (nombreEmpresa === null) {
			alert("⚠️ Necesitamos el nombre de la empresa para continuar.");
			nombreEmpresa = "";
		} else if (nombreEmpresa.trim() === "") {
			alert("⚠️ Por favor escribe el nombre de la empresa.");
		}
	}
	nombreEmpresa = nombreEmpresa.trim();
	console.log(`📋 Empresa: ${nombreEmpresa}\n`);



	// confirm() para ? de si/OK = true o no/CANCEL = false
	let solicitanDinero = confirm("¿La oferta solicita algún pago o inversión inicial?");
	let salarioAlto = confirm("¿El salario ofrecido es más alto que el promedio del mercado?");
	let pidenDatosBancarios = confirm("¿Te pidieron datos bancarios antes de una entrevista?");
	
	//usa la funcion validarRespuesta() con includes()
	let tipoEmail = validarRespuesta("¿Qué tipo de email utilizan?\n(escribe: 'corporativo' o 'personal')",['corporativo', 'personal']);

	let tieneWebOficial = validarRespuesta("¿La empresa tiene página web oficial?\n(escribe: 'si' o 'no')",['si', 'no']);

	let aplicasteVos = confirm("¿Aplicaste vos mismo a esta oferta o te llegó sin solicitarla?");
	let chequeEquipo = confirm("¿Te mencionaron que te enviarian un cheque para comprar equipo/software?");
	let tieneLinkedIn = confirm("¿La empresa tiene presencia verificable en LinkedIn?");

	//Guardamos toda la info ⬇️ en un objeto que agrupa los datos relacionados
	let datosOfertaLaboral = {
		nombreEmpresa: nombreEmpresa,
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

	//Filter => recorre cada objeto del array redFlags, ejecuta la funcion evaluar datos de c/u que devuelve true/false,
	// true lo incluye en el objeto sino lo descarta y devuelve un nuevo array solo con los true
	// alertasActivadas => tiene solo las red flags q se cumplieron
	const alertasActivadas = redFlags.filter(flag => flag.evaluar(datos));

	//Map => Recorre cada objeto de alertasActivadas, toma SOLO la propiedad mensaje, Crea un NUEVO array solo con los mensajes ["⚠️...", "⚠️..."]
	const alertasDetectadas = alertasActivadas.map(flag => flag.mensaje)

	//Reduce => Suma puntos , Func con 2 parms: total → El acumulador , flag → El objeto actual del array (puntos)
	//Suma el total actual + los puntos del objeto , Devuelve la suma final
	const puntosRiesgo = alertasActivadas.reduce((total,flag) => total + flag.puntos, 0);

	//FOREACH() - Muestra cada alerta en consola
	alertasActivadas.forEach(flag => { 
		console.log(`❌ Señal de alerta: ${flag.mensaje.replace('⚠️ ', '')} (+${flag.puntos} puntos de riesgo)`);
	})

	//despues de evaluar todo muestro el total de puntos acumulados
	console.log(`\n📊 Total de puntos de riesgo: ${puntosRiesgo}`);

	//Guardamos el resultado en el historial ⬇️
	let resultadoAnalisis = {
		numeroAnalisis: datos.numeroAnalisis, // x oferta = Análisis #1
		nombreEmpresa: datos.nombreEmpresa,
		puntosRiesgo: puntosRiesgo, // guardo total de puntos acumulados
		alertasDetectadas: alertasDetectadas, // guardamos todas las alertas
		fecha: new Date().toLocaleString(), // crea objeto con fecha/hora actual y lo convierto a texto legible
	};

	//agregamos ese resultado ⬆️ y queda guardado
	historialAnalisis.push(resultadoAnalisis);

	// Llamamos a la función 3 que muestra los resultados y pasamos el objeto a la func 3 ⬇️
	mostrarResultados(puntosRiesgo, alertasDetectadas, datos.nombreEmpresa); //recibe puntos y alertas⬇️
}

// FUNCION 3 : muestra el resultado/mensaje final al usuario
function mostrarResultados(puntos, alertas, nombreEmpresa) {
	console.log("\n=== RESULTADO DEL ANÁLISIS ===\n");

	const nivelInfo = obtenerNivelRiesgo(puntos);

	console.log(`📋 Empresa: ${nombreEmpresa}`);
	console.log(`${nivelInfo.conclusion}`);
	console.log(`Nivel de riesgo: ${nivelInfo.nivel}`);
	console.log(`Puntos de riesgo: ${puntos}/185\n`);

	// mostramos todas las alertas detectadas
	if (alertas.length > 0) {
		// si tiene al menos 1 elemento muestro alertas
		console.log("Señales de alerta detectadas:");
		alertas.forEach((alerta, index) => {
			console.log(`${index + 1}. ${alerta}`)
		});
	} else {
		console.log("✓ No se detectaron señales de alerta obvias.");
	}

	let mensajeAlerta =
		`📋 Empresa: ${nombreEmpresa}\n\n` + 
		nivelInfo.conclusion +
		"\n\n" +
		"Nivel de riesgo: " +
		nivelInfo.nivel +
		"\n" +
		"Puntos: " +
		puntos +
		"/185\n\n";

	if (alertas.length > 0) {
		// si hay alertas cuantas hay
		mensajeAlerta += "Alertas detectadas: " + alertas.length + "\n\n"; // numero de elementos en el []
		mensajeAlerta += "Revisa la consola para mas detalles.";
	}

	//muestra el mensaje de alerta / resultado final
	alert(mensajeAlerta);

	// preguntamos si quiere ver el historial o hacer otro analisis , llamo a la fun 4
	mostrarOpciones();
}

// FUNCION 4 : Menú con 3 opciones
function mostrarOpciones() {
	console.log("\n--- Opciones ---");

	let opcion = prompt(
		"¿Qué te gustaría hacer?\n1 - Analizar otra oferta\n2 - Ver el historial\n3 - Cerrar sesión\n4 - Salir\n\nEscribe el número:",
	);

	const opcionesValidas = ['1', '2', '3', '4'];
	
	// Valida antes de ejecutar 
	if(!opcionesValidas.includes(opcion)) {
		alert("Opción no válida. Cerrando el analizador.");
		console.log("❌ Opción no válida.");
		return;
	}

		switch(opcion) {
		case '1':
			iniciarAnalisis();
			break;
		case '2':
			mostrarHistorial();
			break;
		case '3':
			cerrarSesion();
			break;
		case '4':
			console.log("\n✓ Gracias por usar ANTI SCAM.\n¡No te dejes engañar por ofertas de trabajo falsas!");
			alert("Gracias por usar ANTI SCAM.\n\n¡Mantén a salvo tu información y tus finanzas!");
			break;
	}
}

// FUNCION 5: Cerrar sesion

function cerrarSesion() {
	console.log("\n=== CERRANDO SESIÓN ===\n");
	let nombreUsuario = localStorage.getItem("nombreUsuario");

	// verificamos si existe un nombre guardado
	if (nombreUsuario === null || nombreUsuario === "") {
		alert("⚠️ No hay ninguna sesión activa para cerrar.");
		mostrarOpciones();
		return;
	}

	let confirmar = confirm(`¿Deseas cerrar sesión?\n\nSe eliminará tu información de este navegador.`);

	if (confirmar) {
		localStorage.removeItem("nombreUsuario");
		console.log(`✅ Sesión cerrada correctamente.`);
		alert(`Hasta luego, ${nombreUsuario}.\n\nTu información ya no aparecerá en este navegador.`);

		console.log("\n✓ Gracias por usar ANTI SCAM.\n¡No te dejes engañar por ofertas de trabajo falsas!");
		alert("Gracias por usar ANTI SCAM.\n\n¡Mantén a salvo tu información y tus finanzas!");
	} else {
		// si no confirma , no borramos nada
		console.log("ℹ️ Cierre de sesión cancelado por el usuario.");
		alert("Tu sesión sigue activa ✅.");
		mostrarOpciones();
	}
}

// FUNCION 6 : Lista de todos los analisis
function mostrarHistorial() {
	console.log("\n=== HISTORIAL DE ANÁLISIS ===\n");

	// verificamos si hay analisis guardados
	if (historialAnalisis.length === 0) {
		console.log("Aún no se ha realizado ningún análisis");
		alert("Todavía no has hecho ningún análisis en esta sesión.");
		mostrarOpciones(); //volvemos al menu
		return; //salimos de la funcion
	}

	//recorremos cada analisis guardado
	historialAnalisis.forEach(analisis => {
		console.log(`Análisis #${analisis.numeroAnalisis} - 📋 ${analisis.nombreEmpresa}`); // cant de analisis por sesion
		console.log(`Fecha: ${analisis.fecha}`);
		console.log(`Puntos de riesgo: ${analisis.puntosRiesgo}/185`);
		console.log(`Alertas detectadas: ${analisis.alertasDetectadas.length}`);
		console.log("---");

	});

	// recorre cada analisis del historial y devuelve un nuevo array y length cuenta los elementos
	const analisisRiesgoAlto = historialAnalisis.filter(a => a.puntosRiesgo >= 60).length;
	const analisisRiesgoBajo = historialAnalisis.filter(a => a.puntosRiesgo < 20).length;

	let mensajeEstadisticas = `Se han realizado ${historialAnalisis.length} análisis en esta sesión.`;
	
	if (analisisRiesgoAlto > 0) {
		mensajeEstadisticas += `\n\n⚠️ ADVERTENCIA: ${analisisRiesgoAlto} oferta(s) de RIESGO MUY ALTO detectada(s).`;
	}
	
	if (analisisRiesgoBajo === historialAnalisis.length) {
		mensajeEstadisticas += `\n\n✅ Todas tus ofertas parecen seguras.`;
	}

	mensajeEstadisticas += `\n\nRevisa la consola para ver los detalles completos.`;

	alert(`Se han realizado ${historialAnalisis.length} análisis en esta sesión.\n\nRevisa la consola para ver los detalles completos.`);

	mostrarOpciones(); // Volvemos al menú
}
