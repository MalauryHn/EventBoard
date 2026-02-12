const API_URL = '/events';

// Variable pour savoir si AOS a déjà démarré
let aosStarted = false;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('events-container')) {
        fetchEvents();
    }
});

async function fetchEvents() {
    try {
        const response = await fetch(API_URL);
        const events = await response.json();
        renderEvents(events);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function renderEvents(events) {
    const container = document.getElementById('events-container');
    container.innerHTML = '';

    events.forEach((event, index) => {
        const isLiked = localStorage.getItem(`liked_event_${event.id}`) === 'true';
        
        // --- 1. Gestion des Classes pour le bouton ---
        // Si liké : Rose + Gros + Icone Pleine (ph-fill)
        // Si pas liké : Gris + Icone Vide
        const btnClass = isLiked 
            ? 'flex items-center gap-2 transition-all p-2 rounded-lg text-pink-500 bg-pink-500/10 scale-105 border border-pink-500/20' 
            : 'flex items-center gap-2 transition-all p-2 rounded-lg text-gray-400 hover:text-pink-400 hover:bg-white/10 border border-transparent';
        
        // Utilisation de la classe "ph-fill" pour le style plein, "ph" pour le style régulier
        const iconClass = isLiked ? 'ph-fill ph-heart' : 'ph ph-heart';

        const card = document.createElement('div');
        
        // --- 2. Configuration AOS ---
        // On utilise 'fade-up' standard. 
        card.setAttribute('data-aos', 'fade-up');
        // Un petit délai progressif pour l'effet "cascade"
        card.setAttribute('data-aos-delay', (index % 5) * 50); 
        
        card.className = `glass rounded-2xl p-6 relative group hover:bg-[#2a2448] transition-all duration-300 border border-white/5 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-900/20 flex flex-col`;

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ${new Date(event.date).toLocaleDateString('fr-FR')}
                </div>
                <div class="text-gray-400 text-xs flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg">
                    <i class="ph ph-map-pin"></i> ${event.location}
                </div>
            </div>

            <h3 class="text-xl font-bold text-white mb-2 cursor-pointer hover:text-purple-300" onclick="window.location.href='details.html?id=${event.id}'">
                ${event.title}
            </h3>
            
            <p class="text-gray-400 text-sm mb-6 line-clamp-2">${event.description}</p>

            <div class="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                <button onclick="toggleVote(${event.id}, this)" class="${btnClass}">
                    <i class="${iconClass} text-xl"></i>
                    <span class="font-bold vote-count">${event.votes}</span>
                </button>

                <a href="details.html?id=${event.id}" class="text-sm text-purple-400 hover:text-white transition-colors flex items-center gap-1">
                    Voir détails <i class="ph ph-arrow-right"></i>
                </a>
            </div>
        `;
        container.appendChild(card);
    });

    // --- 3. Initialisation / Refresh AOS ---
    // On attend 200ms que le DOM soit bien "peint" par le navigateur avant de lancer AOS
    setTimeout(() => {
        if (!aosStarted) {
            // Première initialisation
            AOS.init({
                duration: 800,
                once: true,
                offset: 50, // Déclenche l'animation un peu plus tôt
            });
            aosStarted = true;
        } else {
            // Si déjà initialisé, on rafraîchit pour qu'il voit les nouveaux éléments
            AOS.refresh();
        }
    }, 200);
}

// Fonction de vote corrigée (Méthode innerHTML)
async function toggleVote(id, btnElement) {
    const isLiked = localStorage.getItem(`liked_event_${id}`) === 'true';
    const action = isLiked ? 'remove' : 'add';
    const countSpan = btnElement.querySelector('.vote-count');
    let currentVotes = parseInt(countSpan.innerText);

    // --- MISE À JOUR VISUELLE ---
    if (!isLiked) {
        // Devenir LIKÉ
        currentVotes++;
        // On remplace TOUT le contenu du bouton pour être sûr que l'icône s'affiche bien
        btnElement.className = "flex items-center gap-2 transition-all p-2 rounded-lg text-pink-500 bg-pink-500/10 scale-105 border border-pink-500/20";
        btnElement.innerHTML = `<i class="ph-fill ph-heart text-xl"></i> <span class="font-bold vote-count">${currentVotes}</span>`;
        
        localStorage.setItem(`liked_event_${id}`, 'true');
    } else {
        // Devenir NON-LIKÉ
        currentVotes = Math.max(0, currentVotes - 1);
        btnElement.className = "flex items-center gap-2 transition-all p-2 rounded-lg text-gray-400 hover:text-pink-400 hover:bg-white/10 border border-transparent";
        btnElement.innerHTML = `<i class="ph ph-heart text-xl"></i> <span class="font-bold vote-count">${currentVotes}</span>`;
        
        localStorage.removeItem(`liked_event_${id}`);
    }

    // --- APPEL API ---
    try {
        await fetch(`${API_URL}/${id}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: action })
        });
    } catch (error) {
        console.error("Erreur vote:", error);
    }
}

// Gestion Formulaire Ajout (reste inchangé)
const addForm = document.getElementById('addEventForm');
if (addForm) {
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newEvent = Object.fromEntries(formData.entries());

        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEvent)
            });
            document.getElementById('addEventModal').classList.add('hidden');
            e.target.reset();
            fetchEvents();
        } catch (error) {
            console.error('Erreur ajout:', error);
        }
    });
}