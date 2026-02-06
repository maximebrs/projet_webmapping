// Initialisation de la carte avec l'emprise de tes données
var southWest = L.latLng(48.4041, -3.9133);
var northEast = L.latLng(48.4814, -3.6927);
var bounds = L.latLngBounds(southWest, northEast);
var map = L.map('map').fitBounds(bounds);

// Fond de carte de base

    // (ORTHO IGN)
var ortho_ign = L.tileLayer('https://data.geopf.fr/wmts?' +
    'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0' +
    '&LAYER=ORTHOIMAGERY.ORTHOPHOTOS' + 
    '&STYLE=normal' +
    '&TILEMATRIXSET=PM' +
    '&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}' +
    '&FORMAT=image/jpeg', {
    attribution: '© IGN - Carte Satellite',
    minZoom: 0,
    maxZoom: 19
}).addTo(map);

    // (OpenStreetMap)
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
});

// Couche de strates (GeoServer)
var mesStrates = L.tileLayer.wms("https://www.geotests.net/geoserver/ibresm/wms", {
    layers: 'ibresm:couv_vegetale_bretagne2425',
    format: 'image/png',
    transparent: true,
    opacity: 0.7,
    attribution: "Classification ibresm"
}).addTo(map);

mesStrates.on('tileerror', function(error) {
    console.error("Erreur de chargement GeoServer : Le serveur est probablement hors ligne.");
    // Optionnel : afficher un message discret à l'utilisateur
    alert("Le service de données (GeoServer) semble indisponible pour le moment.");
});

var handle = document.getElementById("sldOpacity");

handle.oninput = function() {
    mesStrates.setOpacity(this.value);
};

// Ajout du contrôleur de couches (le menu pour cocher/décocher)
var baseMaps = {
    "Images Satellite (IGN)": ortho_ign,
    "OpenStreetMap": osm
};
var overlayMaps = {
    "Classification (Strates)": mesStrates,
};
L.control.layers(baseMaps, overlayMaps, {collapsed: true}).addTo(map);

function showSection(sectionId) {
    // 1. Cacher toutes les sections
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    // 2. Afficher la section demandée
    document.getElementById(sectionId).classList.add('active');
    event.currentTarget.classList.add('active');

    // 3. IMPORTANT : Recalculer la taille de la carte si on l'affiche
    if(sectionId === 'map-section') {
        setTimeout(() => { map.invalidateSize(); }, 200);
    }
}

const ctxDonut = document.getElementById('donutSurface').getContext('2d');
const pixelsValues = [334104, 227017, 188919]; 
const totalPixels = 938196;
new Chart(ctxDonut, {
    type: 'doughnut',
    data: {
        labels: ['Herbe', 'Landes', 'Arbre'],
        datasets: [{
            data: [334, 227, 189],
            backgroundColor: ['#9acd32', '#f4a460', '#228b22'],
            hoverOffset: 15
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const index = context.dataIndex;
                        const hectares = context.raw;
                        const pixels = pixelsValues[index].toLocaleString();
                        const percentage = ((pixelsValues[index] / totalPixels) * 100).toFixed(1);
                        
                        // Retourne un tableau pour faire plusieurs lignes dans le pop-up
                        return [
                            ` Part : ${percentage}%`,
                            ` Surface : ${hectares} ha`,
                            ` Pixels : ${pixels}`
                        ];
                    }
                }
            },
            legend: {
                position: 'top',
                labels: { boxWidth: 12, font: { size: 15 } }
            }
        },
        cutout: '65%'
    }
});