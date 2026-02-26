// --- 1. BASE DE DATOS COMPLETA ---
const database = [
    // FEDERAL (CPEUM)
    { id: "cpeum-1", sourceName: "CPEUM (Federal)", stateCode: "federal", title: "Artículo 1 - Derechos Humanos", content: "En los Estados Unidos Mexicanos todas las personas gozarán de los derechos humanos reconocidos en esta Constitución y en los tratados internacionales...", tags: ["discriminacion", "humanos", "garantias", "genero"] },
    { id: "cpeum-3", sourceName: "CPEUM (Federal)", stateCode: "federal", title: "Artículo 3 - Educación", content: "Toda persona tiene derecho a la educación. El Estado -Federación, Estados, Ciudad de México y Municipios- impartirá y garantizará la educación inicial, preescolar, primaria, secundaria, media superior y superior...", tags: ["escuela", "maestros", "obligatoria", "universidad"] },
    { id: "cpeum-22", sourceName: "CPEUM (Federal)", stateCode: "federal", title: "Artículo 22 - Prohibición de Penas", content: "Quedan prohibidas las penas de muerte, de mutilación, de infamia, la marca, los azotes, los palos, el tormento de cualquier especie... Toda pena deberá ser proporcional al delito.", tags: ["muerte", "tortura", "multa", "delito"] },
    { id: "cpeum-27", sourceName: "CPEUM (Federal)", stateCode: "federal", title: "Artículo 27 - Propiedad y Tierras", content: "La propiedad de las tierras y aguas comprendidas dentro de los límites del territorio nacional, corresponde originariamente a la Nación...", tags: ["propiedad", "tierra", "ejido", "nacion"] },
    { id: "cpeum-123", sourceName: "CPEUM (Federal)", stateCode: "federal", title: "Artículo 123 - Trabajo", content: "Toda persona tiene derecho al trabajo digno y socialmente útil; al efecto, se promoverán la creación de empleos y la organización social de trabajo...", tags: ["laboral", "sueldo", "huelga", "obrero"] },

    // CHIHUAHUA
    { id: "cuu-4", sourceName: "Chihuahua", stateCode: "cuu", title: "Artículo 4 - Igualdad y Familia", content: "El varón y la mujer son iguales ante la ley. Esta protegerá la organización y el desarrollo de la familia. En el Estado de Chihuahua se prohíbe toda discriminación...", tags: ["familia", "mujer", "genero", "discriminacion"] },
    { id: "cuu-64", sourceName: "Chihuahua", stateCode: "cuu", title: "Artículo 64 - Facultades del Congreso", content: "Son facultades del Congreso: I. Legislar en todas las materias que no sean de la competencia exclusiva de la Federación; II. Decretar las contribuciones necesarias...", tags: ["leyes", "diputados", "presupuesto"] },

    // GUANAJUATO
    { id: "gua-1", sourceName: "Guanajuato", stateCode: "gua", title: "Artículo 1 - Derecho a la Vida", content: "El Estado de Guanajuato reconoce, protege y garantiza el derecho a la vida de todo ser humano, desde el momento de la fecundación hasta la muerte natural...", tags: ["vida", "fecundacion", "muerte", "bioetica"] },
    { id: "gua-3", sourceName: "Guanajuato", stateCode: "gua", title: "Artículo 3 - División de Poderes", content: "El Poder Público del Estado se divide para su ejercicio en Legislativo, Ejecutivo y Judicial. No podrán reunirse dos o más de estos poderes...", tags: ["gobierno", "poderes", "democracia"] },

    // HIDALGO
    { id: "hid-10", sourceName: "Hidalgo", stateCode: "hid", title: "Artículo 10 - Soberanía", content: "El Estado de Hidalgo, como integrante de la Federación, es libre y soberano en todo lo que concierne a su régimen interior...", tags: ["autonomia", "soberania", "federacion"] },
    { id: "hid-20", sourceName: "Hidalgo", stateCode: "hid", title: "Artículo 20 - Supremacía", content: "La Constitución Política de los Estados Unidos Mexicanos, esta Constitución, las Leyes que de ellas emanen y los Tratados Internacionales... son la Ley Suprema del Estado.", tags: ["ley suprema", "jerarquia"] },

    // CDMX
    { id: "cdmx-a", sourceName: "Ciudad de México", stateCode: "cdmx", title: "Carta de Derechos", content: "La Ciudad de México garantiza el pleno ejercicio de los derechos humanos y libertades fundamentales. La esclavitud y la pena de muerte están prohibidas.", tags: ["derechos", "libertad", "capital"] },
    { id: "cdmx-32", sourceName: "Ciudad de México", stateCode: "cdmx", title: "Artículo 32 - Jefatura de Gobierno", content: "La persona titular de la Jefatura de Gobierno tendrá a su cargo la administración pública de la Ciudad de México. Será elegida por votación universal...", tags: ["jefe de gobierno", "ejecutivo", "administracion"] }
];

// --- 2. Funciones Auxiliares ---
const normalize = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// --- 3. Motor de Búsqueda y Renderizado ---
function performSearch() {
    const rawQuery = document.getElementById('searchInput').value.trim();
    const query = normalize(rawQuery);
    const filterState = document.getElementById('filterState').value;
    const filterScope = document.getElementById('filterScope').value;
    const container = document.getElementById('articlesList');
    const activeFiltersDiv = document.getElementById('activeFilters');

    // Actualizar texto de filtros
    if (!rawQuery) {
        activeFiltersDiv.innerHTML = 'Mostrando todo';
    } else {
        activeFiltersDiv.innerHTML = `
            <span class="inline-block bg-slate-100 px-2 py-1 rounded text-xs mr-1 mb-1 font-semibold">🔍 Filtro: "${rawQuery}"</span>
            ${filterScope !== 'all' ? `<span class="inline-block bg-amber-50 text-amber-800 px-2 py-1 rounded text-xs mr-1 mb-1">Ámbito: ${filterScope}</span>` : ''}
            ${filterState !== 'all' ? `<span class="inline-block bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs mr-1 mb-1">Estado: ${filterState.toUpperCase()}</span>` : ''}
        `;
    }

    // Filtrar (Si query está vacío, muestra todo lo que coincida con los filtros)
    let results = database.filter(item => {
        const textMatch = !query || 
            normalize(item.content).includes(query) ||
            normalize(item.title).includes(query) ||
            item.tags.some(tag => normalize(tag).includes(query));
        
        const stateMatch = filterState === 'all' || item.stateCode === filterState;
        const scopeMatch = filterScope === 'all' || 
            (filterScope === 'federal' && item.stateCode === 'federal') ||
            (filterScope === 'local' && item.stateCode !== 'federal');

        return textMatch && stateMatch && scopeMatch;
    });

    renderResults(results, container, rawQuery);
}

function renderResults(results, container, rawQuery) {
    container.innerHTML = '';
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-8 rounded-xl text-center shadow-sm border border-slate-200">
                <i data-lucide="search-x" class="h-10 w-10 mx-auto text-slate-300 mb-4"></i>
                <h3 class="text-lg font-medium text-slate-900">No se encontraron temas</h3>
                <p class="text-slate-500 mt-2 text-sm">Intenta ajustar los filtros de Estado o Ámbito.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    // Header de resultados
    const header = document.createElement('div');
    header.className = "flex justify-between items-end pb-4 border-b border-slate-100 mb-4";
    header.innerHTML = `
        <div>
            <span class="text-2xl font-bold text-slate-900">${results.length}</span>
            <span class="text-sm text-slate-500 ml-1">temas disponibles</span>
        </div>
    `;
    container.appendChild(header);

    results.forEach(item => {
        let badgeClass = "bg-slate-100 text-slate-600";
        if (item.stateCode === 'federal') badgeClass = "badge-federal";
        if (item.stateCode === 'cuu') badgeClass = "badge-cuu";
        if (item.stateCode === 'gua') badgeClass = "badge-gua";
        if (item.stateCode === 'hid') badgeClass = "badge-hid";
        if (item.stateCode === 'cdmx') badgeClass = "badge-cdmx";

        // Si hay búsqueda, resaltar. Si no, texto normal.
        let displayContent = item.content;
        let displayTitle = item.title;

        if (rawQuery) {
            const regex = new RegExp(`(${rawQuery})`, 'gi');
            displayContent = item.content.replace(regex, '<span class="search-highlight">$1</span>');
            displayTitle = item.title.replace(regex, '<span class="search-highlight">$1</span>');
        }

        const card = document.createElement('div');
        card.className = "bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group hover:border-amber-200 mb-4";
        card.onclick = () => openModal(item.id);
        
        const tagsHtml = item.tags.map(tag => 
            `<span class="px-2 py-1 bg-slate-50 text-slate-500 rounded text-[10px] uppercase font-bold border border-slate-200 tracking-wider hover:bg-slate-100 transition">${tag}</span>`
        ).join('');

        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-2">
                    <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${badgeClass}">${item.sourceName}</span>
                </div>
                <i data-lucide="external-link" class="text-slate-300 group-hover:text-amber-500 h-4 w-4 transition-transform"></i>
            </div>
            <h4 class="text-lg font-bold text-slate-800 group-hover:text-amber-700 transition mb-2">${displayTitle}</h4>
            <p class="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">${displayContent}</p>
            <div class="flex gap-2 flex-wrap mt-auto">
                ${tagsHtml}
            </div>
        `;
        container.appendChild(card);
    });
    lucide.createIcons();
}

// --- 4. Modal ---
function openModal(id) {
    const article = database.find(a => a.id === id);
    if (!article) return;

    document.getElementById('modalTitle').textContent = article.title;
    const badge = document.getElementById('modalSourceBadge');
    badge.textContent = article.sourceName;
    
    // Reset clases del badge
    badge.className = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ";
    if (article.stateCode === 'federal') badge.classList.add('bg-slate-800', 'text-white');
    else if (article.stateCode === 'cuu') badge.classList.add('bg-purple-100', 'text-purple-800');
    else if (article.stateCode === 'gua') badge.classList.add('bg-blue-100', 'text-blue-800');
    else if (article.stateCode === 'hid') badge.classList.add('bg-green-100', 'text-green-800');
    else if (article.stateCode === 'cdmx') badge.classList.add('bg-pink-100', 'text-pink-800');

    document.getElementById('modalContent').textContent = article.content;
    document.getElementById('articleModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('articleModal').classList.add('hidden');
}

// INICIALIZACIÓN: Cargar TODO al inicio
window.onload = function() {
    performSearch(); // Llama a la búsqueda sin query para mostrar todo
    lucide.createIcons();
};