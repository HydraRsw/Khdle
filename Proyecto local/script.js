let personajes = [];
let personajeDelDia = null;

// 1. Cargar la base de datos JSON
fetch('personajes.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("No se pudo abrir el archivo personajes.json");
        }
        return response.json();
    })
    .then(data => {
        personajes = data.filter(p => p && p.name);
        
        if (personajes.length === 0) {
            console.error("El archivo JSON no tiene personajes válidos.");
            return;
        }

        const indiceAleatorio = Math.floor(Math.random() * personajes.length);
        personajeDelDia = personajes[indiceAleatorio];
        
      //  console.log("Shhh... el personaje secreto es: ", personajeDelDia.name); 
    })
    .catch(error => console.error("Error cargando el JSON:", error));

// Elementos de la interfaz
const inputInput = document.getElementById('guess-input');
const autocompleteList = document.getElementById('autocomplete-list');

// 2. Evento para capturar lo que el usuario escribe y mostrar el Dropdown
inputInput.addEventListener('input', function() {
    const valor = this.value.trim().toLowerCase();
    cerrarListaSugerencias();

    if (!valor) return;

    // Filtrar personajes cuyos nombres comiencen o contengan las letras escritas
    const filtrados = personajes.filter(p => p.name.toLowerCase().startsWith(valor));

    filtrados.forEach(personaje => {
        // Crear el elemento contenedor de la opción
        const divOpcion = document.createElement('div');
        divOpcion.className = 'autocomplete-item';
        
        // Estructura interna: Imagen + Nombre
        divOpcion.innerHTML = `
            <img src="${personaje.image}" alt="" onerror="this.src='https://via.placeholder.com/100?text=KH'">
            <span>${personaje.name}</span>
        `;

        // Al hacer clic en una sugerencia, se autocompleta el campo y se envía el intento
        divOpcion.addEventListener('click', function() {
            inputInput.value = personaje.name;
            cerrarListaSugerencias();
            hacerIntento();
        });

        autocompleteList.appendChild(divOpcion);
    });
});

// Función para limpiar/cerrar el dropdown
function cerrarListaSugerencias() {
    autocompleteList.innerHTML = '';
}

// Cerrar el menú si el usuario hace clic en cualquier otra parte de la pantalla
document.addEventListener('click', function (e) {
    if (e.target !== inputInput) {
        cerrarListaSugerencias();
    }
});

// 3. Lógica para procesar el intento de adivinación
document.getElementById('guess-btn').addEventListener('click', hacerIntento);

inputInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') hacerIntento();
});

function hacerIntento() {
    const nombreAdivinado = inputInput.value.trim().toLowerCase();
    if (!nombreAdivinado) return;

    const personajeAdivinado = personajes.find(p => p.name.toLowerCase() === nombreAdivinado);

    if (!personajeAdivinado) {
        alert("Character not found. Check the spelling!");
        return;
    }

    inputInput.value = '';
    cerrarListaSugerencias();
    mostrarResultado(personajeAdivinado);

    if (personajeAdivinado.name === personajeDelDia.name) {
        setTimeout(() => alert(`¡Felicidades! Adivinaste a ${personajeDelDia.name}!`), 500);
    }
}

function mostrarResultado(adivinado) {
    const grid = document.getElementById('results-grid');
    const fila = document.createElement('div');
    fila.className = 'result-row';

    const atributos = ['image', 'gender', 'alignment', 'weapon', 'origin', 'debut', 'species'];

    atributos.forEach(attr => {
        const caja = document.createElement('div');
        caja.className = 'box';

        if (attr === 'image') {
            caja.innerHTML = `<img src="${adivinado.image}" alt="avatar" onerror="this.src='https://via.placeholder.com/100?text=KH'">`;
            caja.classList.add(adivinado.name === personajeDelDia.name ? 'correct' : 'incorrect');
        } else {
            caja.textContent = adivinado[attr] || "N/A";
            
            if (String(adivinado[attr]).toLowerCase() === String(personajeDelDia[attr]).toLowerCase()) {
                caja.classList.add('correct');
            } else {
                caja.classList.add('incorrect');
            }
        }
        fila.appendChild(caja);
    });

    grid.insertBefore(fila, grid.firstChild);
}