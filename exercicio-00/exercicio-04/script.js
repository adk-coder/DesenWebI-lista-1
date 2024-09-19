let photoId = 1;
let currentLocation = null;
let currentPhotoData = null;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const fileInput = document.getElementById('fileInput');
const mapElement = document.getElementById('map');
let map, marker;

function initMap(lat = -23.55052, lng = -46.633308) {
    map = L.map(mapElement).setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

document.getElementById('openCamera').addEventListener('click', function() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.style.display = 'block';
            video.srcObject = stream;
        })
        .catch(() => {
            fileInput.style.display = 'block';
        });
});

document.getElementById('takePhoto').addEventListener('click', function() {
    if (video.srcObject) {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        currentPhotoData = canvas.toDataURL('image/png');
        video.style.display = 'none';
    } else if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            currentPhotoData = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    photo.src = currentPhotoData;
    photo.style.display = 'block';
});

document.getElementById('markLocation').addEventListener('click', function() {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        currentLocation = { lat: latitude, lng: longitude };
        updateMap(latitude, longitude);
    }, () => {
        const manualLat = prompt("Insira a latitude:");
        const manualLng = prompt("Insira a longitude:");
        currentLocation = { lat: parseFloat(manualLat), lng: parseFloat(manualLng) };
        updateMap(manualLat, manualLng);
    });
});

function updateMap(lat, lng) {
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(map);
    map.setView([lat, lng], 13);
}

document.getElementById('savePhoto').addEventListener('click', function() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (!title || !currentPhotoData || !currentLocation) {
        alert("Preencha todos os campos e tire uma foto!");
        return;
    }

    const photoData = {
        id: photoId++,
        title,
        description,
        location: currentLocation,
        date: new Date().toLocaleString(),
        imageData: currentPhotoData
    };

    const photos = JSON.parse(localStorage.getItem('photos')) || [];
    photos.push(photoData);
    localStorage.setItem('photos', JSON.stringify(photos));

    displayPhotos();
});


function displayPhotos() {
    const photos = JSON.parse(localStorage.getItem('photos')) || [];
    const tbody = document.querySelector('#photosTable tbody');
    tbody.innerHTML = '';

    photos.forEach(photo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${photo.id}</td>
            <td>${photo.title}</td>
            <td>${photo.description || 'Sem descrição'}</td>
            <td>Lat: ${photo.location.lat}, Lng: ${photo.location.lng}</td>
            <td>${photo.date}</td>
            <td>
                <button onclick="viewPhoto(${photo.id})">Visualizar</button>
                <button onclick="editPhoto(${photo.id})">Editar</button>
                <button onclick="deletePhoto(${photo.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}


