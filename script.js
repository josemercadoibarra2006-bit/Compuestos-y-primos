
function entrarOva() {
    window.location.href = 'ova.html';
}

var btnMap = {
    inicio:         'btn-inicio',
    contenido:      'btn-contenido',
    actividades:    'btn-actividades',
    evaluacion:     'btn-evaluacion',
    agradecimiento: 'btn-agradecimiento'
};
var ordenNav = ['inicio', 'contenido', 'actividades', 'evaluacion', 'agradecimiento'];

function mostrar(id) {
    document.querySelectorAll('.seccion').forEach(function(s) {
        s.classList.remove('activa');
    });
    var sec = document.getElementById(id);
    if (sec) sec.classList.add('activa');

    document.querySelectorAll('nav button').forEach(function(b) {
        b.classList.remove('activo');
    });
    var btn = document.getElementById(btnMap[id]);
    if (btn) btn.classList.add('activo');

    var paso = ordenNav.indexOf(id) + 1;
    var pct  = Math.round((paso / ordenNav.length) * 100);
    var barra = document.getElementById('barra-progreso');
    if (barra) barra.style.width = pct + '%';

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (id === 'evaluacion' && !quizIniciado) {
        quizIniciado = true;
        renderQuiz();
    }
}


function toggleActContenido(id) {
    var body    = document.getElementById(id);
    var header  = body ? body.previousElementSibling : null;
    var chevron = header ? header.querySelector('.act-chevron') : null;

    if (!body) return;
    var abierto = body.classList.contains('abierto');
    body.classList.toggle('abierto', !abierto);
    if (chevron) chevron.classList.toggle('abierto', !abierto);
}

function toggleJuego(idJuego) {
    var div = document.getElementById(idJuego);
    if (!div) return;
    var abierto = div.style.display === 'block';
    div.style.display = abierto ? 'none' : 'block';
    var chv = document.getElementById('chv-' + idJuego);
    if (chv) chv.classList.toggle('abierto', !abierto);
}
var sieveContainer = document.getElementById('sieve');
function initSieve() {
    if (!sieveContainer) return;
    sieveContainer.innerHTML = '';
    for (var i = 1; i <= 100; i++) {
        var div = document.createElement('div');
        div.classList.add('cell');
        div.id = 'n' + i;
        div.innerText = i;
        sieveContainer.appendChild(div);
    }
}
function applySieve() {
    var primes  = [];
    var isPrime = new Array(101).fill(true);
    isPrime[1]  = false;
    var n1 = document.getElementById('n1');
    if (n1) n1.classList.add('composite');
    for (var p = 2; p <= 100; p++) {
        if (isPrime[p]) {
            var np = document.getElementById('n' + p);
            if (np) np.classList.add('prime');
            primes.push(p);
            for (var i = p * p; i <= 100; i += p) {
                isPrime[i] = false;
                var ni = document.getElementById('n' + i);
                if (ni) ni.classList.add('composite');
            }
        }
    }
    var pl = document.getElementById('prime-list');
    if (pl) pl.innerHTML = '<b>Primos encontrados:</b> ' + primes.join(', ');
}

function resetSieve() {
    initSieve();
    var pl = document.getElementById('prime-list');
    if (pl) pl.innerText = '';
}

initSieve();

var VF_CORRECTAS = ['V', 'V', 'F'];   
var vfRespuestas = [null, null, null];

function vfElegir(btn, idx, valor) {
    var fila = btn.parentElement;
    fila.querySelectorAll('.vf-btn').forEach(function(b) {
        b.classList.remove('elegido-V', 'elegido-F');
    });
    btn.classList.add('elegido-' + valor);
    vfRespuestas[idx] = valor;
}

function vfVerificar() {
    var correctas = 0;
    var items = document.querySelectorAll('.vf-item');
    items.forEach(function(item, idx) {
        var btns = item.querySelectorAll('.vf-btn');
        btns.forEach(function(b) {
            b.classList.remove('correcto', 'incorrecto');
            if (b.classList.contains('elegido-' + VF_CORRECTAS[idx])) {
                b.classList.add('correcto');
                correctas++;
            } else if (b.classList.contains('elegido-V') || b.classList.contains('elegido-F')) {
                b.classList.add('incorrecto');
            }
        });
    });

    var res = document.getElementById('vf-resultado');
    if (!res) return;
    res.style.display = 'block';
    if (correctas === VF_CORRECTAS.length) {
        res.className = 'vf-resultado-box ok';
        res.innerHTML = '✓ ¡Muy bien! Tienes las ' + correctas + ' respuestas correctas.';
    } else {
        res.className = 'vf-resultado-box mal';
        res.innerHTML = '✗ Tienes ' + correctas + ' de ' + VF_CORRECTAS.length + ' correctas. Revisa las marcadas en rojo.';
    }
}

function mcdVerificar() {
    var input    = document.getElementById('mcd-input');
    var feedback = document.getElementById('mcd-feedback');
    if (!input || !feedback) return;
    var val = parseInt(input.value);
    if (isNaN(val)) {
        feedback.innerHTML = '<span style="color:#dc2626">Por favor ingresa un número.</span>';
        return;
    }
    if (val === 6) {
        feedback.style.cssText = 'padding:10px 14px;border-radius:8px;background:#dcfce7;color:#14532d;border:1px solid #86efac';
        feedback.innerHTML = '✓ ¡Correcto! MCD(30, 24) = <b>6</b>. Se pueden formar <b>6 equipos</b>.';
    } else {
        feedback.style.cssText = 'padding:10px 14px;border-radius:8px;background:#fee2e2;color:#7f1d1d;border:1px solid #fca5a5';
        feedback.innerHTML = '✗ No es correcto. Pista: los divisores comunes de 30 y 24 son {1, 2, 3, 6}. El <b>máximo</b> es…';
    }
}
function mcdPista() {
    var feedback = document.getElementById('mcd-feedback');
    if (!feedback) return;
    feedback.style.cssText = 'padding:10px 14px;border-radius:8px;background:#dbeafe;color:#1e3a8a;border:1px solid #bfdbfe';
    feedback.innerHTML = '💡 Solución: D₃₀ ∩ D₂₄ = {1, 2, 3, 6} → MCD = <b>6</b> → Se forman <b>6 equipos</b>.';
}

var quizIniciado   = false;
var quizPagina     = 0;
var quizRespuestas = [];
var quizTerminado  = false;

var PREGUNTAS = [
    { q:'¿Qué condición debe cumplir un número para ser considerado un número primo?',
        opts:['Tener más de tres divisores.','Ser un número par mayor que 10.','Ser un número entero y tener exactamente dos divisores: el 1 y sí mismo.','Ser un número decimal que termine en 5.'], ans:2 },
    { q:'¿Por qué el número 1 no se considera un número primo?',
        opts:['Porque es un número par.','Porque solo posee un divisor (él mismo), incumpliendo la regla de tener exactamente dos.','Porque es el primer número de todos.','Porque se puede dividir entre cero.'], ans:1 },
    { q:"¿Cuál es la 'joya absoluta' de las matemáticas por ser el único número par que es primo?",
        opts:['El número 4.','El número 0.','El número 2.','El número 10.'], ans:2 },
    { q:'¿Cómo se llaman los números que tienen más de dos divisores?',
        opts:['Números únicos.','Números compuestos.','Números infinitos.','Números fraccionarios.'], ans:1 },
    { q:'Si un detective analiza el número 9, ¿cuál es el veredicto sobre su identidad?',
        opts:['Es primo porque es un número impar.','Es primo porque solo se divide por 9 y 1.','No es primo (es compuesto) porque se puede dividir por 1, 3 y 9.','No es primo porque es un número par.'], ans:2 },
    { q:'¿Qué son los múltiplos de un número?',
        opts:['Los productos de ese número por cada uno de los números naturales.','Los números que lo dividen de forma exacta.','Los números que terminan en cero.','El resultado de restarle 1 al número.'], ans:0 },
    { q:'¿Cuál es el criterio para saber si un número es divisible por 5?',
        opts:['Si la suma de sus cifras da 3.','Si sus dos últimas cifras son 00.','Si el número termina en 0 o en 5.','Si es un número primo.'], ans:2 },
    { q:'Tienes 7 caramelos y descubres que solo puedes repartirlos en partes iguales si hay 1 persona o 7 personas. ¿Qué tipo de número es el 7?',
        opts:['Un número primo.','Un número compuesto.','Una unidad.','Un múltiplo de 2.'], ans:0 },
    { q:"¿Qué matemático de la antigua Grecia inventó un 'filtro' para encontrar números primos?",
        opts:['Euclides.','Eratóstenes.','Gauss.','Newton.'], ans:1 },
    { q:'Un número es divisible por 2 si:',
        opts:['Termina en 1, 3 o 5.','Termina en 0 o en una cifra par (2, 4, 6, 8).','La suma de sus cifras da 9.','Es un número primo mayor que 100.'], ans:1 },
    { q:'¿Para qué se usan los números primos gigantescos en el mundo digital?',
        opts:['Para calcular el clima.','Para contar las estrellas.','Como candados digitales para proteger cuentas bancarias y correos.','Para inventar tablas de multiplicar.'], ans:2 },
    { q:'¿Cuál afirmación sobre los divisores es correcta?',
        opts:['El conjunto de divisores es infinito.','El 0 es divisor de todos los números.','El 1 es divisor de cualquier número.','Los divisores siempre son mayores que el número.'], ans:2 },
    { q:'Si un número es divisible por 2 y por 3, ¿por qué otro número es divisible?',
        opts:['Por el 5.','Por el 10.','Por el 6.','Por el 9.'], ans:2 },
    { q:'Mario tiene el triple de la edad de José. Si José tiene 10 años, ¿qué edad tiene Mario?',
        opts:['13 años.','30 años.','5 años.','20 años.'], ans:1 },
    { q:'¿Qué sucede con los números primos a medida que los números crecen?',
        opts:['Se acaban al llegar al 1.000.','Son infinitos y nunca se terminan.','Solo existen números pares.','Se vuelven todos divisibles por 3.'], ans:1 },
    { q:'¿Cuál de estos es un número primo menor que 20?',
        opts:['15 (÷ 1, 3, 5, 15).','9 (÷ 1, 3, 9).','13 (÷ 1 y 13).','1 (un solo divisor).'], ans:2 },
    { q:"Un detective busca un 'ladrillo' numérico (número primo). ¿Cuál elige?",
        opts:['El 8.','El 4.','El 6.','El 11.'], ans:3 },
    { q:'Un número es divisible por 10 si:',
        opts:['Termina en 5.','Termina en 0.','Es un número primo.','La suma de sus cifras es par.'], ans:1 },
    { q:'¿Cómo se describe la distribución de los primos en la recta numérica?',
        opts:['Ordenadamente cada 2 números.','Sin patrón predecible, casi caótico.','Siempre de tres en tres.','Solo en la tabla del 10.'], ans:1 },
    { q:"Un grupo 'exclusivo' solo admite dos miembros: el 1 y el número mismo. ¿Cómo se llama?",
        opts:['Equipo de los Números Primos.','Equipo de los Números Pares.','Equipo de los Múltiplos de 10.','Equipo de las Fracciones.'], ans:0 }
];

var LETRAS     = ['A','B','C','D'];
var POR_PAGINA = 5;

function totalPaginas() { return Math.ceil(PREGUNTAS.length / POR_PAGINA); }

function renderQuiz() {
    quizRespuestas = quizRespuestas.length ? quizRespuestas : new Array(PREGUNTAS.length).fill(null);
    if (quizTerminado) { renderResultado(); return; }

    var body  = document.getElementById('quiz-body');
    var barra = document.getElementById('quiz-prog');
    var ini   = quizPagina * POR_PAGINA;
    var fin   = Math.min(ini + POR_PAGINA, PREGUNTAS.length);
    if (barra) barra.style.width = Math.round((ini / PREGUNTAS.length) * 100) + '%';

    var html = '';
    for (var i = ini; i < fin; i++) {
        var p = PREGUNTAS[i];
        html += '<div class="q-card">';
        html += '<div class="q-header"><span class="q-num">Pregunta ' + (i+1) + ' de ' + PREGUNTAS.length + '</span></div>';
        html += '<div class="q-text">' + p.q + '</div><div class="opts">';
        for (var j = 0; j < p.opts.length; j++) {
            var sel = quizRespuestas[i] === j ? 'selected' : '';
            html += '<button class="opt ' + sel + '" onclick="quizElegir(' + i + ',' + j + ')">';
            html += '<span class="opt-letter">' + LETRAS[j] + '</span>' + p.opts[j] + '</button>';
        }
        html += '</div></div>';
    }

    var todaOk = true;
    for (var k = ini; k < fin; k++) { if (quizRespuestas[k] === null) { todaOk = false; break; } }
    var esUltima = quizPagina === totalPaginas() - 1;
    var dis = todaOk ? '' : 'disabled';

    html += '<div class="quiz-nav">';
    html += '<span class="quiz-page-ind">Página ' + (quizPagina+1) + ' de ' + totalPaginas() + '</span>';
    if (quizPagina > 0) html += '<button class="btn-quiz" onclick="quizPaginar(-1)">← Anterior</button>';
    if (!esUltima)      html += '<button class="btn-quiz btn-quiz-primary" onclick="quizPaginar(1)" ' + dis + '>Siguiente →</button>';
    else                html += '<button class="btn-quiz btn-quiz-primary" onclick="quizEnviar()" ' + dis + '>Ver resultados ✓</button>';
    html += '</div>';

    body.innerHTML = html;
}

function quizElegir(pregIdx, optIdx) {
    if (quizTerminado) return;
    quizRespuestas[pregIdx] = optIdx;
    renderQuiz();
}

function quizPaginar(dir) {
    var ini = quizPagina * POR_PAGINA;
    var fin = Math.min(ini + POR_PAGINA, PREGUNTAS.length);
    if (dir === 1) {
        for (var k = ini; k < fin; k++) { if (quizRespuestas[k] === null) return; }
    }
    quizPagina += dir;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderQuiz();
}

function quizEnviar() {
    var ini = quizPagina * POR_PAGINA;
    var fin = Math.min(ini + POR_PAGINA, PREGUNTAS.length);
    for (var k = ini; k < fin; k++) { if (quizRespuestas[k] === null) return; }
    quizTerminado = true;
    renderResultado();
}

function renderResultado() {
    var barra = document.getElementById('quiz-prog');
    var body  = document.getElementById('quiz-body');
    if (barra) barra.style.width = '100%';

    var correctas = 0;
    for (var i = 0; i < PREGUNTAS.length; i++) {
        if (quizRespuestas[i] === PREGUNTAS[i].ans) correctas++;
    }
    var total   = PREGUNTAS.length;
    var pct     = Math.round((correctas / total) * 100);
    var nota    = (correctas / total * 5).toFixed(1);   

    var concepto, claseConcepto, mensaje, submensaje;
    if (pct >= 90) {
        concepto = 'Desempeño Superior';   claseConcepto = 'excelente';
        mensaje = '¡Excelente trabajo! 🌟'; submensaje = 'Dominas muy bien los números primos y compuestos.';
    } else if (pct >= 70) {
        concepto = 'Desempeño Alto';       claseConcepto = 'bien';
        mensaje = '¡Buen trabajo! 👍';     submensaje = 'Vas muy bien. Repasa algunos conceptos para perfeccionar.';
    } else if (pct >= 50) {
        concepto = 'Desempeño Básico';     claseConcepto = 'regular';
        mensaje = '¡Sigue adelante! 💪';   submensaje = 'Tienes la mitad correcta. Revisa el contenido y las actividades.';
    } else {
        concepto = 'Desempeño Bajo';       claseConcepto = 'bajo';
        mensaje = 'No te desanimes 😊';    submensaje = 'Repasa el tema, haz las actividades y vuelve a intentarlo. ¡Tú puedes!';
    }

    var revHTML = '';
    for (var i = 0; i < PREGUNTAS.length; i++) {
        var p  = PREGUNTAS[i];
        var ok = quizRespuestas[i] === p.ans;
        revHTML += '<div class="ans-row ' + (ok ? 'ok' : 'no') + '">';
        revHTML += '<span class="ans-icon">' + (ok ? '✓' : '✗') + '</span>';
        revHTML += '<div class="ans-detail">';
        revHTML += '<div class="ans-q">Pregunta ' + (i+1) + ': ' + p.q + '</div>';
        revHTML += '<div class="ans-info">Tu respuesta: <strong>' + LETRAS[quizRespuestas[i]] + ') ' + p.opts[quizRespuestas[i]] + '</strong></div>';
        if (!ok) revHTML += '<div class="ans-info correct-detail">Correcta: <strong>' + LETRAS[p.ans] + ') ' + p.opts[p.ans] + '</strong></div>';
        revHTML += '</div></div>';
    }

    body.innerHTML =
        '<div class="result-wrap">' +
            '<div class="nota-grande" style="color:' + (parseFloat(nota) >= 3 ? '#1b4332' : '#dc2626') + '">' + nota + '</div>' +
            '<div class="nota-sobre">sobre 5.0 &nbsp;·&nbsp; ' + correctas + ' de ' + total + ' correctas (' + pct + '%)</div>' +
            '<span class="nota-concepto ' + claseConcepto + '">' + concepto + '</span>' +
            '<div class="result-msg">' + mensaje + '</div>' +
            '<div class="result-sub">' + submensaje + '</div>' +
        '</div>' +
        '<div class="answers-list">' +
            '<div class="answers-title">Revisión de respuestas</div>' +
            revHTML +
        '</div>' +
        '<div style="text-align:center;margin-top:24px">' +
            '<button class="btn-restart" onclick="quizReiniciar()">🔄 Volver a intentar</button>' +
        '</div>';
}

function quizReiniciar() {
    quizRespuestas = new Array(PREGUNTAS.length).fill(null);
    quizTerminado  = false;
    quizPagina     = 0;
    var barra = document.getElementById('quiz-prog');
    if (barra) barra.style.width = '0%';
    renderQuiz();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}