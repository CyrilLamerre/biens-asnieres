document.addEventListener('DOMContentLoaded', () => {
    const propertiesGrid = document.querySelector('.properties-grid');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    let properties = [];
    let agencies = new Set();

    // Fonction pour charger le fichier CSV
    async function loadProperties() {
        try {
            const response = await fetch('data.csv');
            const csvText = await response.text();
            const rows = csvText.split('\n').slice(1); // Ignorer l'en-tête

            properties = rows.map(row => {
                const [
                    quartier,
                    type,
                    surface,
                    prix,
                    pieces,
                    chambres,
                    sdb,
                    description,
                    agence,
                    lien
                ] = row.split(',').map(item => item.trim());

                return {
                    quartier,
                    type,
                    surface: parseInt(surface),
                    prix: parseInt(prix),
                    pieces: parseInt(pieces),
                    chambres: parseInt(chambres),
                    sdb: parseInt(sdb),
                    description,
                    agence,
                    lien
                };
            });

            // Extraire les agences uniques
            agencies = new Set(properties.map(p => p.agence));
            
            // Remplir le dropdown des agences
            agencies.forEach(agency => {
                const item = document.createElement('div');
                item.className = 'dropdown-item';
                item.textContent = agency;
                item.dataset.agency = agency;
                dropdownContent.appendChild(item);
            });

            // Afficher tous les biens initialement
            displayProperties(properties);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    }

    // Fonction pour créer une carte de bien
    function createPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'property-card';
        
        card.innerHTML = `
            <h2>${property.type} - ${property.quartier}</h2>
            <div class="property-info">
                <p>Surface: ${property.surface}m²</p>
                <p>Pièces: ${property.pieces} | Chambres: ${property.chambres} | SDB: ${property.sdb}</p>
                <p>Agence: ${property.agence}</p>
                <p>${property.description}</p>
            </div>
            <div class="property-price">${property.prix.toLocaleString()} €</div>
            <a href="${property.lien}" target="_blank" class="view-button">Voir l'annonce</a>
        `;

        return card;
    }

    // Fonction pour afficher les biens
    function displayProperties(propertiesToShow) {
        propertiesGrid.innerHTML = '';
        propertiesToShow.forEach(property => {
            propertiesGrid.appendChild(createPropertyCard(property));
        });
    }

    // Gestionnaire du dropdown
    dropdownBtn.addEventListener('click', () => {
        document.querySelector('.dropdown').classList.toggle('active');
    });

    // Fermer le dropdown en cliquant ailleurs
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelector('.dropdown').classList.remove('active');
        }
    });

    // Gestionnaire de sélection d'agence
    dropdownContent.addEventListener('click', (e) => {
        if (e.target.classList.contains('dropdown-item')) {
            const selectedAgency = e.target.dataset.agency;
            dropdownBtn.querySelector('.selected-text').textContent = 
                selectedAgency === 'all' ? 'Toutes les agences' : selectedAgency;

            const filteredProperties = selectedAgency === 'all' 
                ? properties 
                : properties.filter(p => p.agence === selectedAgency);

            displayProperties(filteredProperties);
            document.querySelector('.dropdown').classList.remove('active');
        }
    });

    // Charger les données au démarrage
    loadProperties();
}); 