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
	},
];


async function cargarNivelesRiesgo() {
	/* CARGO NIVELES DE RIESGO DESDE LA API */
	try {
		const response = await fetch("https://api.npoint.io/32ebe2a9eba032ef389c");
		const dataRiesgos = await response.json();
		// contiene array con los niveles
		nivelesRiesgo = dataRiesgos; // guardo los datos en la variable global
		console.log("✅ Niveles de riesgo cargados:", nivelesRiesgo);
	} catch (error) {
		console.error("❌ Error al cargar niveles de riesgo:", error);

		// PLAN B: Si falla la API, usao datos por defecto
		nivelesRiesgo = [
			{ min: 60, conclusion: "🚨 ALERTA MÁXIMA - POSIBLE ESTAFA", nivel: "MUY ALTO", clase: "nivel-muy-alto", badge: "badge-muy-alto" },
			{ min: 40, conclusion: "⚠️ SOSPECHOSO - Procede con cautela", nivel: "ALTO", clase: "nivel-alto", badge: "badge-alto" },
			{ min: 20, conclusion: "⚡ ADVERTENCIA - Verifica más información", nivel: "MEDIO", clase: "nivel-medio", badge: "badge-medio" },
			{ min: 0, conclusion: "✅ APARENTEMENTE SEGURO - Aún así, investiga", nivel: "BAJO", clase: "nivel-bajo", badge: "badge-bajo" }
		];
	}

}
	

let datosOfertaActual = {}; // Guarda las respuestas del usuario del form
let preguntaActualNum = 1; // N. de pregunta actual,siguiente preguntaActualNum++ = 2 y asi , muestra y oculta la preg
let contadorAnalisis = 0; // Cuenta cuántos análisis se hicieron en total en la sesion, se incrementa cada vez q completas un analisis
let historialAnalisis = []; // guarda todos los analisis de la sesion
let analisisSeleccionado = null; // Guarda temporalmente el análisis que estás viendo en detalle
let nivelesRiesgo = []; // los datos se guardan con el fetch

// inicio de la app
document.addEventListener("DOMContentLoaded", () => {
	cargarNombreUsuario() 
	cargarHistorial()
	configurarBotonesOpcion(); 
	cargarNivelesRiesgo()
});

function cargarNombreUsuario() {
  const nombreGuardado = localStorage.getItem("nombreUsuario");// carga el nombre si exite si no devuelve null
  if (nombreGuardado) document.getElementById("inputNombre").value = nombreGuardado;  // si encontro un nombre lo pone en el input
}

function cargarHistorial() {
	const historialGuardado = localStorage.getItem("historialAnalisis"); //busca el historial guardado
	if (historialGuardado) {
		historialAnalisis = JSON.parse(historialGuardado); //Convierte un string a objeto/array
		contadorAnalisis = historialAnalisis.length; // cuenta cuantos analisis hay
	}
}

//(pantalla 1)
function iniciarSesion() { 
	 const nombre = document.getElementById("inputNombre").value.trim();

	 if(!nombre) {
		return Swal.fire({
			 icon:"error",
			 title:"Nombre requerido",
			 text:"⚠️ Por favor ingresa tu nombre",
			 confirmButtonText: "OK",
			 confirmButtonColor:"#ef2133" 
		})
		.then(() => {
			 document.getElementById("inputNombre").focus()
		})

	 }

	 localStorage.setItem("nombreUsuario", nombre);
	  Swal.fire({ 
		icon:"success", 
		title:`¡Hola ${nombre} ! 👋`,
		text:"Responde las siguientes preguntas:",
		confirmButtonText: "Empezar",
		confirmButtonColor:"#00ba88",
		timer:2000,
		timerProgressBar:true
	 })
	 .then(() => {
		mostrarPantalla("pantallaFormulario");
	});

}

//(pantalla 1) 
function mostrarPantalla(idPantalla) {
	
	// PASO 1: Ocultar TODAS las pantallas
	document.querySelectorAll(".pantalla").forEach((p) => { //"p" es cada pantalla
		p.classList.remove("activa");
	});

	// PASO 2: Mostrar SOLO la pantalla que me pidas con el id
	document.getElementById(idPantalla).classList.add("activa");
}

//(pantalla 2) selecciona todos los botones, agrego evento click a c/u, guardo las respuestas en datosOfertaActual
function configurarBotonesOpcion() {
	document.querySelectorAll(".btn-opcion").forEach((btn) => {
		btn.addEventListener("click", function () {
			const pregunta = this.dataset.pregunta; // lee el atributo cuando hago click pregunta = "solicitanDinero"
			const valor = this.dataset.valor; // si / no valor = "true"

			document.querySelectorAll(`[data-pregunta="${pregunta}"]`).forEach((b) => {
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
			Swal.fire({
				icon: "warning",
				title: "Campo vacío",
				text: "⚠️ Por favor ingresa el nombre de la empresa",
				confirmButtonText: "OK",
				confirmButtonColor: "#ffc14d",
			});
			return;
		}

		datosOfertaActual.nombreEmpresa = empresa; //guarda el nombre de la empresa =>datosOfertaActual = { nombreEmpresa: "Google" }

		// SECCIÓN 2: Validar Preguntas 2-10 (botones)
	} else {
		// Si preguntaActualNum = 5 → `pregunta${5}` → "pregunta5 => <div id="pregunta5">
		const preguntaActual = document.getElementById(`pregunta${preguntaActualNum}`,);
		//Busca SOLO los botones DENTRO de esa pregunta
		const botonesGrupo = preguntaActual.querySelectorAll(".btn-opcion");

		// Array.from() lo convierte en un array real, some = algun btn cumple con la condicion T o F ?
		const haySeleccion = Array.from(botonesGrupo).some(
			(btn) => btn.classList.contains("seleccionado"), // alguno de los 2 tiene la clase btn-opcion seleccionado?
		);

		if (!haySeleccion) { // Si NINGUNO está seleccionado, muestra error
			Swal.fire({
				icon: "info",
				title: "Selección requerida",
				text: "⚠️ Por favor selecciona una opción antes de continuar",
				confirmButtonText: "OK",
				confirmButtonColor: "#3085d6",
			});
			return;
		}
	}

	// SECCIÓN 3: Oculta la pregunta que acabas de responder

	document.getElementById(`pregunta${preguntaActualNum}`).style.display ="none";

	// SECCIÓN 4: Aavanza preguntaActualNum = 2, ++ => ahora es 3

	preguntaActualNum++;

	// SECCIÓN 5: Mostrar siguiente pregunta O procesar

	if (preguntaActualNum <= 10) {  // Si preguntaActualNum = 4, 5, 6... hasta 10
		document.getElementById(`pregunta${preguntaActualNum}`).style.display ="block";

		// Actualizar texto "Pregunta X de 10"
		document.getElementById("preguntaActual").textContent = preguntaActualNum;

		actualizarProgreso();  // Actualiza la barra de progreso (40%, 50%)

		document.getElementById("btnAnterior").style.display = "block"; // a partir de la preg 2 muestra btn anterior

		if (preguntaActualNum === 10) { // solo si es preg 10
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
	  // PASO 1: Ocultar la pregunta ACTUAL
	document.getElementById(`pregunta${preguntaActualNum}`).style.display ="none";

	// PASO 2: RETROCEDER el número /resta 1
	preguntaActualNum--; 

	// PASO 3: Mostrar la pregunta ANTERIOR
	document.getElementById(`pregunta${preguntaActualNum}`).style.display ="block"; 
	// PASO 4: Actualizar el texto y la barra
	document.getElementById("preguntaActual").textContent = preguntaActualNum;
	actualizarProgreso();

	// PASO 5: ¿Volvimos a la pregunta 1? / el btn anterior se oculta
	if (preguntaActualNum === 1) {
		document.getElementById("btnAnterior").style.display = "none";
	}

	// PASO 6: Restaurar el botón "Siguiente"
	const btnSiguiente = document.getElementById("btnSiguiente");
	btnSiguiente.classList.remove("finalizar"); // Quita la clase "finalizar" y restaura texto a siguiente
	document.getElementById("textoSiguiente").textContent = "Siguiente";
}

// Toma todas las respuestas y calcula el nivel de riesgo
//(pantalla 3)
function procesarAnalisis() {
	// VALIDACIÓN: Asegurar que los niveles están cargados
	if (!nivelesRiesgo || nivelesRiesgo.length === 0) {
		Swal.fire({
			icon: "warning",
			title: "Datos cargando...",
			text: "Por favor espera un momento mientras se cargan los datos necesarios.",
			confirmButtonText: "Entendido",
			confirmButtonColor: "#ffc14d",
		}).then(() => {
			// Reintentar después de 2 segundos
			setTimeout(() => {
				if (nivelesRiesgo.length > 0) {
					procesarAnalisis();
				} else {
					Swal.fire({
						icon: "error",
						title: "Error de conexión",
						text: "No se pudieron cargar los datos. Por favor recarga la página.",
						confirmButtonText: "OK",
					});
				}
			}, 2000);
		});
		return;
	}
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
	const nivelInfo = nivelesRiesgo.find((nivel) => puntosRiesgo >= nivel.min); //FUNCIONA CON LOS DATOS DE LA API DEL FETCH

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

//(pantalla 3) llena html con el resultado de los datos q recudamos osea las respuestas
function mostrarResultados(resultado) {
	 // PASO 1: MOSTRAR NOMBRE DE LA EMPRESA
	document.getElementById("resultadoEmpresa").textContent = resultado.nombreEmpresa;

	 // PASO 2: MOSTRAR NIVEL DE RIESGO
	const nivelDiv = document.getElementById("resultadoNivel");
	nivelDiv.textContent = resultado.conclusion;
	nivelDiv.className = `nivel-badge ${resultado.nivelClase}`; // cambio su clase "nivel-badge nivel-alto"

	// PASO 3: MOSTRAR PUNTOS Y BARRA
	const porcentajePuntos = (resultado.puntosRiesgo / 215) * 100;

	document.getElementById("resultadoPuntos").innerHTML = `
        <div style="font-size: 3rem;">${resultado.puntosRiesgo}</div>
        <div style="font-size: 1.2rem; color:  rgba(255,255,255,0.85); margin-top: 5px;">de 215 puntos</div>
    `;

	document.getElementById("puntosFill").style.width = porcentajePuntos + "%";

	 // PASO 4: MOSTRAR ALERTAS
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
		// Si NO hay alertas
		alertasDiv.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #00ba88; font-size: 1.3rem;">
            ✅ No se detectaron señales de alerta obvias
        </div>
    `;
	}

	// 🎬 AQUÍ CAMBIO LA PANTALLA
	mostrarPantalla("pantallaResultados");
}

//(pantalla 4)
// Al hacer clic en "Continuar" en resultados cambia a la pantalla del menu (3 opciones :nuevoAnalisis,verHistorial y cerrarSesion)
function mostrarMenu() {
	mostrarPantalla("pantallaMenu");
}

//(pantalla 4) resetea formulario
function nuevoAnalisis() {
	
	// PASO 1: RESETEAR DATOS DEL ANÁLISIS ACTUAL
	datosOfertaActual = {};
	preguntaActualNum = 1;

	// PASO 2: LIMPIAR EL INPUT DE EMPRESA
	document.getElementById("inputEmpresa").value = ""; 

	// PASO 3: DESMARCAR TODOS LOS BOTONES / saco la clase "seleccionado" se ve sin marcar
	document.querySelectorAll(".btn-opcion").forEach((btn) => {
		btn.classList.remove("seleccionado");
	});

	// PASO 4: RESETEAR VISIBILIDAD DE PREGUNTAS
	document.querySelectorAll(".pregunta").forEach((p, index) => {
		p.style.display = index === 0 ? "block" : "none"; //Si index === 0 → "block" (visible) / Si index es otro número → "none" (oculto)

	});
	
	// PASO 5: RESETEAR LA UI (interfaz)
	document.getElementById("preguntaActual").textContent = "1";
	document.getElementById("btnAnterior").style.display = "none"; // oculto btn anterior
	document.getElementById("btnSiguiente").classList.remove("finalizar");
	document.getElementById("textoSiguiente").textContent = "Siguiente";
	actualizarProgreso(); //Barra de progreso al 10%

	// ↓ Vuelve al formulario limpio, listo para un nuevo análisis
	mostrarPantalla("pantallaFormulario");
}

//(pantalla 4) cierro sesion y elimino datos
function cerrarSesion() {
	
	// PASO 1: VERIFICAR SI HAY SESIÓN ACTIVA
	const nombreUsuario = localStorage.getItem("nombreUsuario"); // Busca nombre guardado en localStorage sino existe null

	if (!nombreUsuario) {
		Swal.fire({
			icon: "info",
			title: "No hay sesión activa",
			text: "No hay ninguna sesión activa para cerrar.",
			confirmButtonText: "OK",
		}).then(() => mostrarMenu());
		return;
	}

	// PASO 2: MOSTRAR CONFIRMACIÓN
	Swal.fire({
		title: "🔒 ¿Deseas cerrar sesión?",
		html: `
			<div>
				<p>Se eliminará:</p>
				<ul style="list-style:none; padding:0; margin-top:15px;">
					<li>👤 Tu nombre <b>${nombreUsuario}</b></li>
      				<li>📊 Tus <b>${historialAnalisis.length}</b> análisis guardados</li>
				</ul>
				<p style="margin-top:15px; font-size:0.9rem; opacity:0.8;">
      				Podrás volver a usar la app cuando quieras.
    			</p>
			</div>
		`,
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Cerrar Sesión",
		cancelButtonText: "Cancelar",
		reverseButtons: true,
	}).then((result) => {
		if (result.isConfirmed) {
			// PASO 3: ELIMINAR TODO DE LOCALSTORAGE
			localStorage.clear();

			// PASO 4: RESETEAR VARIABLES EN MEMORIA
			historialAnalisis = [];
			contadorAnalisis = 0;
			datosOfertaActual = {};
			preguntaActualNum = 1;

			// PASO 5: LIMPIAR INPUTS
			document.getElementById("inputNombre").value = "";
			document.getElementById("inputEmpresa").value = "";

			// PASO 6: DESMARCAR BOTONES
			document.querySelectorAll(".btn-opcion").forEach((
				btn) => btn.classList.remove("seleccionado"));

			// PASO 7: RESETEAR PREGUNTAS
			document.querySelectorAll(".pregunta").forEach((p, i) => {
				p.style.display = i === 0 ? "block" : "none";
			});

			// PASO 8: RESETEAR UI
			document.getElementById("btnAnterior").style.display = "none";
			document.getElementById("preguntaActual").textContent = "1";
			actualizarProgreso();

			// PASO 9: MOSTRAR MENSAJE DE DESPEDIDA
			Swal.fire({
				icon: "success",
				title: `Hasta luego, ${nombreUsuario} 👋`,
				text: "Tu información fue eliminada correctamente.",
				confirmButtonText: "Aceptar",
			}).then(() =>
				// 🎬 VUELVE A LA PANTALLA DE BIENVENIDA
				 mostrarPantalla("pantallaBienvenida"));
		}
	});
}

// (pantalla 5)
function mostrarHistorial() {
	 
	// PASO 1: OBTENER ELEMENTOS DEL DOM
	const historialContainer = document.getElementById("historialContainer"); //cards de cada análisis
	const estadisticas = document.getElementById("estadisticasHistorial"); // se mostrarán las estadísticas

	 // PASO 2: VERIFICAR SI HAY ANÁLISIS
	if (historialAnalisis.length === 0) {
		// si no hay analisis
		historialContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #8899a6;">
                <div style="font-size: 4rem; margin-bottom: 20px;">📭</div>
                <p style="font-size: 1.2rem;">No has realizado ningún análisis todavía</p>
            </div>
        `;

		estadisticas.innerHTML = "";
		
		// PASO 3: CALCULAR ESTADÍSTICAS
	} else {
		// si hay analisis // calcula estadisticas

		const riesgoAlto = historialAnalisis.filter(
			(a) => a.puntosRiesgo >= 60,
		).length; // filtra los mayores o = a 60
		const riesgoBajo = historialAnalisis.filter(
			(a) => a.puntosRiesgo < 20,
		).length;

		// PASO 4: GENERAR HTML DE ESTADÍSTICAS
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

		// PASO 5: GENERAR CARDS DE ANÁLISIS
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
			.join("");

		historialContainer.innerHTML = analisisHTML; // ↓ Inserta todas las cards en el container
	}

	mostrarPantalla("pantallaHistorial");
}

// (pantalla 6)
function verDetalle(indice) {
	
	// PASO 1: OBTENER EL ANÁLISIS
	analisisSeleccionado = historialAnalisis[indice];

	// PASO 2: OBTENER EL CONTAINER
	const detalleContainer = document.getElementById("detalleContainer");

	// PASO 3: GENERAR HTML COMPLETO
	detalleContainer.innerHTML = `
        <div class="detalle-card">
		 <!-- HEADER CON NOMBRE DE EMPRESA -->
            <div class="empresa-header">
                <span class="empresa-icono">🏢</span>
                <h2>${analisisSeleccionado.nombreEmpresa}</h2>
            </div>

			 <!-- NIVEL DE RIESGO -->
            <div class="nivel-badge ${analisisSeleccionado.nivelClase}">
                ${analisisSeleccionado.conclusion}
            </div>

			<!-- PUNTOS -->
            <div class="puntos-container">
                <div class="puntos-numero">
                    ${analisisSeleccionado.puntosRiesgo} 
                    <span style="font-size: 1.5rem;">/ 215</span>
                </div>
            </div>

			 <!-- INFORMACIÓN -->
            <div style="margin: 30px 0;">
                <h3 class="resultado text-center" style="margin-bottom: 15px; color: #e1e8ed;">
                    📊 Información
                </h3>
				<p class="analisis-n" style="color: #8899a6; margin: 8px 0; text-align: right; font-size:20px">
                    Análisis #${analisisSeleccionado.numeroAnalisis}
                </p>
                <p class="analisis-f" style="color: #8899a6; margin: 8px 0; text-align: right;">
                    ${analisisSeleccionado.fecha}
                </p>
            </div>

            ${
							analisisSeleccionado.alertasDetectadas.length > 0
								? `
                <div>
                    <h3 style="margin-bottom: 25px; color: #e1e8ed; text-align: center">
                        🚨 Alertas detectadas (${analisisSeleccionado.alertasDetectadas.length})
                    </h3>
                    ${analisisSeleccionado.alertasDetectadas
											.map(
												(alerta, i) => `
                        <div class="alerta-item alerta-${alerta.gravedad}">
                            <div class="alerta-mensaje">
                                <strong>${i + 1}.</strong> ${alerta.mensaje}
                            </div>
                            <div class="alerta-puntos">${alerta.puntos} pts</div>
                        </div>
                    `,
											)
											.join("")}
                </div>
            `
								: `
                <div style="text-align: center; padding: 30px; color: #00ba88; font-size: 1.2rem;">
                    ✅ No se detectaron señales de alerta
                </div>
            `
						}

          	<!-- BOTÓN COMPARTIR -->
            <div style="margin-top: 35px; text-align: center;">
                <button 
                    class="btn-compartir"
                    onclick="event.stopPropagation(); compartirAnalisis(${indice})">
                    <i class="bi bi-whatsapp"></i>
					Compartir X WhatsApp
                </button>
            </div>
        </div>
    `;
 	// 🎬 CAMBIA A LA PANTALLA DE DETALLE
	mostrarPantalla("pantallaDetalle");
}

// (pantalla 6)
function volverHistorial() {
	// 🎬 VUELVE A LA PANTALLA DE HISTORIAL
	mostrarHistorial();
	// ↓ Ejecuta toda la función otra vez
    // ↓ Regenera las cards
    // ↓ Muestra la pantalla de historial
}

function compartirAnalisis(indice) {
	
	// PASO 1: OBTENER EL ANÁLISIS
	const analisis = historialAnalisis[indice];

	 // PASO 2: CONSTRUIR EL MENSAJE
	let mensaje = `🛡️ *ANTI SCAM – Análisis #${analisis.numeroAnalisis}*\n\n`;
	mensaje += `🏢 *Empresa:* ${analisis.nombreEmpresa.toUpperCase()}\n`;
	mensaje += `📊 *Nivel de riesgo:* ${analisis.nivelRiesgo}\n`;
	mensaje += `🎯 *Puntuación:* ${analisis.puntosRiesgo}/215\n`;
	mensaje += `📅 *Fecha:* ${analisis.fecha}\n\n`;

	if (analisis.alertasDetectadas.length > 0) {  // ↓ Si hay alertas
		mensaje += `🚨 *Alertas detectadas:*\n`;
		analisis.alertasDetectadas.forEach((alerta, i) => { 
			// ↓ Recorre cada alerta
			mensaje += `${i + 1}. ${alerta.mensaje} (${alerta.puntos} pts)\n`;
			// ↓ Agrega cada alerta numerada
		});
	} else {
		mensaje += `✅ No se detectaron señales de alerta\n`;
	}

	mensaje += `\n🔗 Analizá ofertas en:\nhttps://violetaatkinson.github.io/Anti-Scam/`;

	 // PASO 3: CODIFICAR EL MENSAJE PARA URL  // Convierte caracteres especiales en formato seguro para URLs
	const mensajeEncoded = encodeURIComponent(mensaje);

	// PASO 4: CREAR URL DE WHATSAPP
	const whatsappURL = `https://wa.me/?text=${mensajeEncoded}`;

	// PASO 5: ABRIR WHATSAPP
	const ventana = window.open(whatsappURL, "_blank"); // ↓ Abre una nueva pestaña/ventana con esa URL

	// PASO 6: PLAN B (si el navegador bloquea popups)
	if (!ventana) {
		// ↓ Si window.open() devolvió null /  Significa que el navegador bloqueó el popup
		navigator.clipboard.writeText(mensaje).then(() => {
			// ↓ Copia el mensaje al portapapeles
			Swal.fire({
				icon: "success",
				title: "📋 Copiado al portapapeles",
				text: "Pegalo en WhatsApp o donde quieras",
				confirmButtonColor: "#00ba88",
			});
		});
	}
}

