/* RED FLAGS 🚩🚩🚩- lista de chequeo */
const redFlags = [
	{
		puntos: 35,
		mensaje: "⚠️ Cheque para comprar equipo (ESTAFA COMÚN)",
		evaluar: (datos) => datos.chequeEquipo === true, //  datos = respuesta del usuario si dijo T se activa
		gravedad: "critica", // asigno el color
	},
	{
		puntos: 30,
		mensaje: "⚠️ Solicitan dinero por adelantado",
		evaluar: (datos) => datos.solicitanDinero === true,
		gravedad: "alta",
	},
	{
		puntos: 30,
		mensaje: "⚠️ Salario sospechosamente alto",
		evaluar: (datos) => datos.salarioAlto === true,
		gravedad: "alta",
	},
	{
		puntos: 25,
		mensaje: "⚠️ Piden info bancaria demasiado pronto",
		evaluar: (datos) => datos.pidenDatosBancarios === true,
		gravedad: "alta",
	},
	{
		puntos: 20,
		mensaje: "⚠️ No tiene web oficial",
		evaluar: (datos) => datos.tieneWebOficial === "no",
		gravedad: "media",
	},
	{
		puntos: 20,
		mensaje: "⚠️ Sin presencia verificable en LinkedIn",
		evaluar: (datos) => datos.tieneLinkedIn === false,
		gravedad: "media",
	},
	{
		puntos: 15,
		mensaje: "⚠️ Email que no pertenece a la empresa",
		evaluar: (datos) => datos.tipoEmail === "personal",
		gravedad: "media",
	},
	{
		puntos: 10,
		mensaje: "⚠️ Oferta no solicitada",
		evaluar: (datos) => datos.aplicasteVos === false,
		gravedad: "baja",
	},
	{
		puntos: 30,
		mensaje: "⚠️ Proceso de selección inusualmente rápido y sin entrevistas",
		evaluar: (datos) => datos.procesoRapido === true,
		gravedad: "alta",
	}
	
];

const nivelesRiesgo = [
	{
		min: 60,
		conclusion: "🚨 ALERTA MÁXIMA - POSIBLE ESTAFA",
		nivel: "MUY ALTO",
		clase: "nivel-muy-alto",
		badge: "badge-muy-alto",
	},
	{
		min: 40,
		conclusion: "⚠️ SOSPECHOSO - Procede con cautela",
		nivel: "ALTO",
		clase: "nivel-alto",
		badge: "badge-alto",
	},
	{
		min: 20,
		conclusion: "⚡ ADVERTENCIA - Verifica más información",
		nivel: "MEDIO",
		clase: "nivel-medio",
		badge: "badge-medio",
	},
	{
		min: 0,
		conclusion: "✅ APARENTEMENTE SEGURO - Aún así, investiga",
		nivel: "BAJO",
		clase: "nivel-bajo",
		badge: "badge-bajo",
	},
];

// MENSAJE DE INICIO
console.log(
	"%c🔍 ANTI SCAM",
	"font-size: 24px; font-weight: bold; color: #e74c3c;",
);
console.log("Pulsa 'Comenzar Análisis' para empezar.\n");

let datosOfertaActual = {}; // Guarda las respuestas del usuario del form
let preguntaActualNum = 1; // N. de pregunta actual,siguiente preguntaActualNum++ = 2 y asi , muestra y oculta la preg
let contadorAnalisis = 0; // Cuenta cuántos análisis se hicieron en total en la sesion, se incrementa cada vez q completas un analisis
let historialAnalisis = []; // guarda todos los analisis de la sesion
let analisisSeleccionado = null; // Guarda temporalmente el análisis que estás viendo en detalle

// inicio de la app
document.addEventListener("DOMContentLoaded", () => {
	const nombreGuardado = localStorage.getItem("nombreUsuario"); // carga el nombre si exite si no devuelve null

	if (nombreGuardado) {
		document.getElementById("inputNombre").value = nombreGuardado; // si encontro un nombre lo pone en el input
	}

	const historialGuardado = localStorage.getItem("historialAnalisis"); //busca el historial guardado
	if (historialGuardado) {
		// si no hay nada guardado salta este bloque
		historialAnalisis = JSON.parse(historialGuardado); //Convierte un string a objeto/array
		contadorAnalisis = historialAnalisis.length; // cuenta cuantos analisis hay
	}

	configurarBotonesOpcion(); // quiero q los btn funcionen desde el inicio
});

//(pantalla 1)
function iniciarSesion() {
	//busco el input
	const inputNombre = document.getElementById("inputNombre");
	const errorNombre = document.getElementById("errorNombre");
	const nombre = inputNombre.value.trim(); // obtiene lo q el usuario escribio

	if (nombre === "") {
		// valido q no este vacio
		errorNombre.style.display = "block"; // si no hay nombre mostar error
		inputNombre.focus();
		return;
	}

	errorNombre.style.display = "none"; // nombre valido oculta error

	localStorage.setItem("nombreUsuario", nombre); // guardo el nombre en el localStorage

	document.getElementById("saludoUsuario").textContent =
		`¡Hola ${nombre}! Responde las siguientes preguntas:`; // pongo el saludo al user en pantalla 2

	// llamo a la func q cambia pantalla y paso el id de la pantalla q quiero mostrar
	mostrarPantalla("pantallaFormulario"); 
}

//(pantalla 1) oculta todas las pantallas, muestra solo la activa
function mostrarPantalla(idPantalla) {
	document.querySelectorAll(".pantalla").forEach((p) => {
		p.classList.remove("activa");
	});

	// busca la pantalla especifica q le pase y le agrego la clase solo para q esa pantalla sea visible
	document.getElementById(idPantalla).classList.add("activa");
}

//(pantalla 2) selecciona todos los botones, agrego evento click a c/u, guardo las respuestas en datosOfertaActual
function configurarBotonesOpcion() {
	document.querySelectorAll(".btn-opcion").forEach((btn) => {
		btn.addEventListener("click", function () {
			const pregunta = this.dataset.pregunta; // lee el atributo cuando hago click pregunta = "solicitanDinero"
			const valor = this.dataset.valor; // si / no valor = "true"

			document
				.querySelectorAll(`[data-pregunta="${pregunta}"]`)
				.forEach((b) => {
					// Busca elementos que tengan exactamente ese atributo: [data-pregunta="solicitanDinero"]
					b.classList.remove("seleccionado"); // Quitar la clase "seleccionado" de TODOS los botones del mismo grupo.
				});

			this.classList.add("seleccionado"); // Agrega la clase al btn clickeado. DESPUÉS del click = btn-opcion seleccionado

			//  guarda la pregunta dataset SIEMPRE devuelve strings, no booleano asi los convierto
			if (valor === "true") {
				datosOfertaActual[pregunta] = true; // asi guardo
			} else if (valor === "false") {
				datosOfertaActual[pregunta] = false;
			} else {
				datosOfertaActual[pregunta] = valor; // Si es otra cosa ("corporativo", "si", "no"), dejar como string
			}
		});
	});
}

//(pantalla 2) Calcula y actualiza barra (11%, 22%, 33%...)
function actualizarProgreso() {
	const porcentaje = (preguntaActualNum / 10) * 100; //(5 / 10) * 100 = 50%  → Barra al 50% style="width: 50%"
	document.getElementById("progresoFill").style.width = porcentaje + "%";
}

//(pantalla 2)
function siguientePregunta() {

	// SECCIÓN 1: Validar Pregunta 1 (input de texto)

	if (preguntaActualNum === 1) {
		const empresa = document.getElementById("inputEmpresa").value.trim();

		if (empresa === "") {
			mostrarError("pregunta1", "⚠️ Por favor ingresa el nombre de la empresa");
			return;
		}

		datosOfertaActual.nombreEmpresa = empresa; //guarda el nombre de la empresa => lo guarda en datosOfertaActual.nombreEmpresa

		// SECCIÓN 2: Validar Preguntas 2-10 (botones)

	} else {
		// js evalúa el template literal => `pregunta${preguntaActualNum}`/ `pregunta${5}`// Reemplaza la variable con su valor => El string "pregunta5"
		const preguntaActual = document.getElementById(
			`pregunta${preguntaActualNum}`,
		);
		 //Busca SOLO los botones DENTRO de esa pregunta, si preg 5 => busca solo en <div id="pregunta5">
		const botonesGrupo = preguntaActual.querySelectorAll(".btn-opcion");

		// Array.from() lo convierte en un array real, some = algun btn cumple con la condicion T o F ?
		const haySeleccion = Array.from(botonesGrupo).some( 
			(btn) => btn.classList.contains("seleccionado"), // alguno de los 2 tiene la clase btn-opcion seleccionado?
		);

		if (!haySeleccion) {
			mostrarError(
				`pregunta${preguntaActualNum}`,
				"⚠️ Por favor selecciona una opción",
			);
			return;
		}
	}

	// SECCIÓN 3: Oculta la pregunta que acabas de responder

	document.getElementById(`pregunta${preguntaActualNum}`).style.display =
		"none";

	// SECCIÓN 4: Aavanza preguntaActualNum = 2, ++ => ahora es 3

	preguntaActualNum++; 

	// SECCIÓN 5: Mostrar siguiente pregunta O procesar

	if (preguntaActualNum <= 10) {
		document.getElementById(`pregunta${preguntaActualNum}`).style.display = "block";

		// Actualizar texto "Pregunta X de 10"
		document.getElementById("preguntaActual").textContent = preguntaActualNum;

		actualizarProgreso();

		document.getElementById("btnAnterior").style.display = "block"; // a partir de la preg 2 muestra btn anterior

		if (preguntaActualNum === 10) {
			// solo si es preg 10
			const btnSiguiente = document.getElementById("btnSiguiente");
			btnSiguiente.classList.add("finalizar");
			document.getElementById("textoSiguiente").textContent = "Analizar"; // Cambia el texto de "Siguiente" a "Analizar"
			document.getElementById("flechaSiguiente").textContent = "✓";
		}
	} else {
		procesarAnalisis(); // ya respondió las 10, entonces procesa el análisis (calcula el resultado)
	}
}

//(pantalla 2) // lo opuesto a siguientePregunta()
function anteriorPregunta() {
	document.getElementById(`pregunta${preguntaActualNum}`).style.display = "none";

	preguntaActualNum--; //retrocede Resta 1

	document.getElementById(`pregunta${preguntaActualNum}`).style.display = "block"; // muestra la pre anterior

	document.getElementById("preguntaActual").textContent = preguntaActualNum;

	actualizarProgreso();

	if (preguntaActualNum === 1) {
		//si volvemos a la pregunta 1 el btn anterior se oculta
		document.getElementById("btnAnterior").style.display = "none";
	}

	const btnSiguiente = document.getElementById("btnSiguiente");
	btnSiguiente.classList.remove("finalizar"); // Quita la clase "finalizar" y restaura texto a siguiente
	document.getElementById("textoSiguiente").textContent = "Siguiente";
}

//(pantalla 2)
function mostrarError(idPregunta, mensaje) {
	const pregunta = document.getElementById(idPregunta);

	let errorDiv = pregunta.querySelector(".error-message"); // busca si ya existe un div de error sino lo creo

	if (!errorDiv) {
		errorDiv = document.createElement("p");
		errorDiv.className = "error-message";
		pregunta.appendChild(errorDiv);
	}

	errorDiv.textContent = mensaje;
	errorDiv.style.display = "block";

	setTimeout(() => {
		errorDiv.style.display = "none";
	}, 3000);
}

// Toma todas las respuestas y calcula el nivel de riesgo
//(pantalla 3)
function procesarAnalisis() {

	// PASO 1: Incremento el contador
	contadorAnalisis++; //  Incrementa el n. de anlisis
	datosOfertaActual.numeroAnalisis = contadorAnalisis; // guardo n de analisis en el {}

	//paso 2 FILTRO: recorre todas las red f. , ejecuta la func. evaluar de cada 1, si T lo pone en el resultado sino descarta
	const alertasActivadas = redFlags.filter((flag) =>
		flag.evaluar(datosOfertaActual),
	);

	// paso 3 MAP: extraigo solo lo necesario, crea un nuevo [] con 3 props, no necesito la func evaluar
	const alertasConGravedad = alertasActivadas.map((flag) => ({
		mensaje: flag.mensaje,
		gravedad: flag.gravedad,
		puntos: flag.puntos,
	}));

	//paso 4 SUMO los puntos de todas las alertas activadas , va acumulando it1 0 + 30 = it2 30 + 25
	const puntosRiesgo = alertasActivadas.reduce(
		(total, flag) => total + flag.puntos,
		0,
	);

	//paso 5 FIND: obtener nivel de riesgo, busca el 1er nivel q cumpla la condicion => (60, 40, 20, 0), para cuando entra en el primero q cumple
	const nivelInfo = nivelesRiesgo.find((nivel) => puntosRiesgo >= nivel.min);

	// paso 6: creo un objeto con todos los datos para mostrar en pantalla y en detalle y lo guardo en el historial
	const resultadoAnalisis = {
		numeroAnalisis: contadorAnalisis,
		nombreEmpresa: datosOfertaActual.nombreEmpresa,
		puntosRiesgo: puntosRiesgo,
		alertasDetectadas: alertasConGravedad,
		nivelRiesgo: nivelInfo.nivel,
		nivelClase: nivelInfo.clase,
		conclusion: nivelInfo.conclusion,
		fecha: new Date().toLocaleString(),
		// copia exacta del obj xq desp vaciamos datosOfertaActual para un nuevo analisis , si no hacemos copia perdemos los datos del analisis anterior
		datosCompletos: { ...datosOfertaActual },
	};

	//paso 7: Guardo en historial
	historialAnalisis.push(resultadoAnalisis);

	// convierto a JSON , guardo en LS (solo guarda strigs) , stringify convierte el array a string
	localStorage.setItem("historialAnalisis", JSON.stringify(historialAnalisis));

	//paso 8 llama a la func q llena la pantalla de resultados, le pasa el obj con todos los datos
	mostrarResultados(resultadoAnalisis);
}

//(pantalla 3) llena html
function mostrarResultados(resultado) {
	// muestro nombre de la empresa
	document.getElementById("resultadoEmpresa").textContent =
		resultado.nombreEmpresa;

	//mostrar nivel de riesgo
	const nivelDiv = document.getElementById("resultadoNivel");
	nivelDiv.textContent = resultado.conclusion;
	nivelDiv.className = `nivel-badge ${resultado.nivelClase}`; // cambio su clase "nivel-badge nivel-alto"

	// Mostrar puntos
	const porcentajePuntos = (resultado.puntosRiesgo / 215) * 100;

	document.getElementById("resultadoPuntos").innerHTML = `
        <div style="font-size: 3rem;">${resultado.puntosRiesgo}</div>
        <div style="font-size: 1.2rem; color:  rgba(255,255,255,0.85); margin-top: 5px;">de 215 puntos</div>
    `;

	document.getElementById("puntosFill").style.width = porcentajePuntos + "%";
	
	// mostrar alertas
	const alertasDiv = document.getElementById("resultadoAlertas");

	// verifico si hay alertas
	// Recorre cada alerta y convierte c/u en 1 string y join une los strings
	if (resultado.alertasDetectadas.length > 0) {
		const alertasHTML = resultado.alertasDetectadas
    .map(
        (alerta, index) => `
        <div class="alerta-item alerta-${alerta.gravedad}">
            <div class="alerta-mensaje">
                <strong>${index + 1}.</strong> ${alerta.mensaje}
            </div>
            <div class="alerta-puntos">${alerta.puntos} pts</div>
        </div>
    `,
    )
    .join("");
		alertasDiv.innerHTML = `
        <h3>🚨 Alertas detectadas (${resultado.alertasDetectadas.length}):</h3>
        ${alertasHTML}
    `;
	} else {
		// Si NO hay alertas, muestro mensaje positivo
		alertasDiv.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #00ba88; font-size: 1.3rem;">
            ✅ No se detectaron señales de alerta obvias
        </div>
    `;
	}

	mostrarPantalla("pantallaResultados");
}

//(pantalla 4)
// Al hacer clic en "Continuar" en resultados cambia a la pantalla del menu (3 opciones :nuevoAnalisis,verHistorial y cerrarSesion)
function mostrarMenu() {
	mostrarPantalla("pantallaMenu");
}

//(pantalla 4) resetea formulario
function nuevoAnalisis() {
	// 1.reseteo datos
	datosOfertaActual = {};
	preguntaActualNum = 1;

	document.getElementById("inputEmpresa").value = ""; // 2.limpio input empresa

	document.querySelectorAll(".btn-opcion").forEach((btn) => {
		// 3.saco la clase "seleccionado" de todos los botones se ve sin marcar 
		btn.classList.remove("seleccionado");
	});

	document.querySelectorAll(".pregunta").forEach((p, index) => {
		// 4. Resetear visibilidad de preguntas
		p.style.display = index === 0 ? "block" : "none"; //Si index === 0 → "block" (visible) sino oculto, solo pregunta 1 visible

		const error = p.querySelector(".error-message"); // Busco mensajes de error y si existen los oculto
		if (error) error.style.display = "none";
	});
	// 5. Resetear UI
	document.getElementById("preguntaActual").textContent = "1";
	document.getElementById("btnAnterior").style.display = "none"; // oculto btn anterior
	document.getElementById("btnSiguiente").classList.remove("finalizar");
	document.getElementById("textoSiguiente").textContent = "Siguiente";
	actualizarProgreso(); //Barra de progreso al 10%

	mostrarPantalla("pantallaFormulario"); // volvemos a la pantalla del formulario
}

//(pantalla 4) cierro sesion y elimino datos
function cerrarSesion() {
	const nombreUsuario = localStorage.getItem("nombreUsuario");

	if (!nombreUsuario) {
		alert("⚠️ No hay ninguna sesión activa para cerrar.");
		mostrarMenu();
		return;
	}

	const confirmar = confirm(
		`🔒 ¿Deseas cerrar sesión?\n\nSe eliminará:\n• Tu nombre (${nombreUsuario})\n• Historial de ${historialAnalisis.length} análisis\n\n¿Continuar?`,
	);

	// limpio localS
	if (confirmar) {
		localStorage.removeItem("nombreUsuario");
		localStorage.removeItem("historialAnalisis");

		// reseteo las variables donde se acumulan los datos
		historialAnalisis = [];
		contadorAnalisis = 0;
		datosOfertaActual = {};
		preguntaActualNum = 1;

		// limpio formularios
		document.getElementById("inputNombre").value = "";
		document.getElementById("inputEmpresa").value = "";

		//Quitar selecciones de los btns
		document.querySelectorAll(".btn-opcion").forEach((btn) => {
			btn.classList.remove("seleccionado");
		});

		// reseteo preguntas
		document.querySelectorAll(".pregunta").forEach((p, index) => {
			p.style.display = index === 0 ? "block" : "none";
		});

		document.getElementById("btnAnterior").style.display = "none";
		document.getElementById("preguntaActual").textContent = "1";
		actualizarProgreso();

		alert(`👋 Hasta luego, ${nombreUsuario}!\n\nTu información ha sido eliminada correctamente.`,);

		mostrarPantalla("pantallaBienvenida");
	} else {
		// si el usuario cancela no hago nada
	}
}

// (pantalla 5)
function mostrarHistorial() {
	const historialContainer = document.getElementById("historialContainer");
	const estadisticas = document.getElementById("estadisticasHistorial");

	if (historialAnalisis.length === 0) {
		// si no hay analisis
		historialContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #8899a6;">
                <div style="font-size: 4rem; margin-bottom: 20px;">📭</div>
                <p style="font-size: 1.2rem;">No has realizado ningún análisis todavía</p>
            </div>
        `;

		estadisticas.innerHTML = "";
	} else {
		// si hay analisis // calcula estadisticas

		const riesgoAlto = historialAnalisis.filter(
			(a) => a.puntosRiesgo >= 60,
		).length; // filtra los mayores o = a 60
		const riesgoBajo = historialAnalisis.filter(
			(a) => a.puntosRiesgo < 20,
		).length;

		let mensajeEstadisticas = `<div class="estadisticas">
            <p><strong>Total de análisis:</strong> ${historialAnalisis.length}</p>`;

		if (riesgoAlto > 0) {
			// si hay advertencias de riesgo alto, agregar advertencia
			mensajeEstadisticas += `<p style="color: #ef2133;">⚠️ ${riesgoAlto} oferta(s) de RIESGO MUY ALTO</p>`;
		}

		if (riesgoBajo === historialAnalisis.length) {
			// si todas son de riesgo bajo
			mensajeEstadisticas += `<p style="color: #00ba88;">✅ Todas tus ofertas parecen seguras</p>`;
		}

		mensajeEstadisticas += `</div>`;

		estadisticas.innerHTML = mensajeEstadisticas;

		// genero las cards de cada analisis
		const analisisHTML = historialAnalisis
			.slice() // crea una copia del array no modifico el original
			.reverse() // inviero el orden muestro los + recientes primero
			.map((analisis, index) => {
				const indiceReal = historialAnalisis.length - 1 - index; //necesito el inidice en el array original no en el invertido
				return `
                    <div class="analisis-card" onclick="verDetalle(${indiceReal})">
                        <div class="analisis-header">
                            <span class="analisis-numero">Análisis #${analisis.numeroAnalisis}</span>
                            <span class="analisis-fecha">${analisis.fecha}</span>
                        </div>
                        <div class="analisis-empresa">🏢 ${analisis.nombreEmpresa}</div>
                        <div class="analisis-puntos">${analisis.puntosRiesgo} / 215</div>
                        <span class="badge ${analisis.nivelClase.replace("nivel-", "badge-")}">${analisis.nivelRiesgo}</span>
                        <p style="margin-top: 15px; color: #8899a6;">
                            ${analisis.alertasDetectadas.length} alerta(s) detectada(s)
                        </p>
                    </div>
                `;
			})
			.join('');

			historialContainer.innerHTML = analisisHTML;
	}
	
	mostrarPantalla('pantallaHistorial');
}

// (pantalla 6)
function verDetalle(indice) {
	analisisSeleccionado = historialAnalisis[indice];

	const detalleContainer = document.getElementById('detalleContainer');

	detalleContainer.innerHTML =  `
        <div class="detalle-card">
            <div class="empresa-header">
                <span class="empresa-icono">🏢</span>
                <h2>${analisisSeleccionado.nombreEmpresa}</h2>
            </div>
            <div class="nivel-badge ${analisisSeleccionado.nivelClase}">
                ${analisisSeleccionado.conclusion}
            </div>
            <div class="puntos-container">
                <div class="puntos-numero">
                    ${analisisSeleccionado.puntosRiesgo} 
                    <span style="font-size: 1.5rem;">/ 185</span>
                </div>
            </div>
            <div style="margin: 30px 0;">
                <h3 class="resultado text-center" style="margin-bottom: 15px; color: #e1e8ed;">📊 Información</h3>
				<p  class="analisis-n" style="color: #8899a6; margin: 8px 0; text-align: right;font-size:20px">Análisis #${analisisSeleccionado.numeroAnalisis}</p>
                <p  class="analisis-f" style="color: #8899a6; margin: 8px 0; text-align: right;"> ${analisisSeleccionado.fecha}</p>
                
            </div>
            ${analisisSeleccionado.alertasDetectadas.length > 0 ? `
                <div>
                    <h3 style="margin-bottom: 25px; color: #e1e8ed;text-align: center">
                        🚨 Alertas detectadas (${analisisSeleccionado.alertasDetectadas.length})
                    </h3>
                    ${analisisSeleccionado.alertasDetectadas.map((alerta, i) => `
                        <div class="alerta-item alerta-${alerta.gravedad}">
                            <div class="alerta-mensaje">
            					<strong>${i + 1}.</strong> ${alerta.mensaje}
        					</div>
							<div class="alerta-puntos">${alerta.puntos} pts</div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div style="text-align: center; padding: 30px; color: #00ba88; font-size: 1.2rem;">
                    ✅ No se detectaron señales de alerta
                </div>
            `}
        </div>
    `;
	mostrarPantalla('pantallaDetalle');
}
 // (pantalla 6)
function volverHistorial() {
	mostrarHistorial();
 }

