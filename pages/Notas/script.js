document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const contenedorNotas = document.getElementById('contenedorNotas');
    const btnAgregarNota = document.getElementById('btnAgregarNota');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const promedioActualDisplay = document.getElementById('promedioActual');
    
    // NOTA MÍNIMA DE APROBACIÓN para escala 0-100 (Cambiado de 60 a 55)
    const NOTA_MINIMA_APROBACION = 55; 

    // Función que crea el HTML de una nueva fila de inputs
    const crearFilaNota = () => {
        const fila = document.createElement('div');
        fila.classList.add('fila-nota');

        const inputNota = document.createElement('input');
        inputNota.type = 'number';
        inputNota.classList.add('input-nota');
        inputNota.placeholder = 'Nota (0 - 100)'; 
        inputNota.min = '0';
        inputNota.max = '100';
        inputNota.step = '1';

        const inputPorcentaje = document.createElement('input');
        inputPorcentaje.type = 'number';
        inputPorcentaje.classList.add('input-porcentaje');
        inputPorcentaje.placeholder = 'Porcentaje (0 - 100)';
        inputPorcentaje.min = '0';
        inputPorcentaje.max = '100';

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn-eliminar');
        btnEliminar.textContent = '-';
        
        fila.appendChild(inputNota);
        fila.appendChild(inputPorcentaje);
        fila.appendChild(btnEliminar);

        fila.addEventListener('input', calcularPromedio);
        
        return fila;
    };
    
    // Inicialización para asegurar que todas las filas iniciales tengan listeners
    const inicializarCalculadora = () => {
        const filasExistentes = contenedorNotas.querySelectorAll('.fila-nota');
        filasExistentes.forEach(fila => {
            fila.addEventListener('input', calcularPromedio);
        });
        
        if (contenedorNotas.childElementCount === 0) {
             for (let i = 0; i < 3; i++) {
                contenedorNotas.appendChild(crearFilaNota());
            }
        }
        calcularPromedio();
    };

    // Función principal para calcular el promedio PONDERADO
    const calcularPromedio = () => {
        const filas = contenedorNotas.querySelectorAll('.fila-nota');
        let sumaNotasPonderadas = 0;
        let sumaPorcentajes = 0;

        filas.forEach(fila => {
            const notaInput = fila.querySelector('.input-nota');
            const porcentajeInput = fila.querySelector('.input-porcentaje');

            let nota = parseFloat(notaInput.value) || 0;
            let porcentaje = parseFloat(porcentajeInput.value) || 0;
            
            // Limitamos los valores a la escala 0-100
            nota = Math.max(0, Math.min(100, nota));
            porcentaje = Math.max(0, Math.min(100, porcentaje));

            sumaNotasPonderadas += nota * porcentaje;
            sumaPorcentajes += porcentaje;
        });

        let promedio = 0;

        if (sumaPorcentajes > 0) {
            promedio = sumaNotasPonderadas / sumaPorcentajes;
        }

        promedioActualDisplay.textContent = promedio.toFixed(0); 
    };
    
    // Evento para AGREGAR una nueva fila
    btnAgregarNota.addEventListener('click', () => {
        const nuevaFila = crearFilaNota();
        contenedorNotas.appendChild(nuevaFila);
        calcularPromedio();
    });

    // Evento delegado para ELIMINAR una fila
    contenedorNotas.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-eliminar')) {
            const filaAEliminar = event.target.closest('.fila-nota');
            if (filaAEliminar) {
                filaAEliminar.remove();
                calcularPromedio();
            }
        }
    });
    
    // Evento para LIMPIAR todos los inputs
    btnLimpiar.addEventListener('click', () => {
        const inputs = contenedorNotas.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
        promedioActualDisplay.textContent = '0';
        calcularPromedio(); 
    });
    
    // Inicializar la calculadora al cargar la página
    inicializarCalculadora();
});