var map = L.map('map').setView([45.3, 34.4], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var supabaseUrl = 'https://hjxczmuohvwaegbqelmo.supabase.co';
var supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeGN6bXVvaHZ3YWVnYnFlbG1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ2ODMyNjksImV4cCI6MjAxMDI1OTI2OX0.YgLPzbK-fWh67ppjfSTIIEnkFCeYmCLr1eK97U7tx1Q';
var supabase = supabase.createClient(supabaseUrl, supabaseKey);

const today = new Date().toISOString().substr(0, 10);
const datePicker = document.getElementById("datePicker");

datePicker.addEventListener('change', updateMarkers)
datePicker.value = today;

async function updateMarkers() {
    var selectedDate = document.getElementById('datePicker').value;

    var { data, error } = await supabase
        .from('markers')
        .select('*')
        .eq('date', selectedDate);

    map.eachLayer(function (layer) {
        if (layer instanceof L.circle) {
            map.removeLayer(layer);
        }
    });

    if (data && data.length > 0) {
        data.forEach(marker => {
            var coords = [marker.latitude, marker.longitude];
            var markerLayer = L.circle(coords, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 1,
                radius: 240
            }).addTo(map);
            markerLayer.bindPopup(`<b>${marker.name}</b><br>${marker.description}`);
        });
    }
}

updateMarkers()

