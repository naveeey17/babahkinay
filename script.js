// 1. Inisialisasi AOS
AOS.init({
    duration: 1000,
    once: true
});

// 2. Ambil Parameter "to" dari URL
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to') || 'Tamu Undangan';

// Update nama tamu di modal & halaman
document.getElementById('guest-name-modal').innerText = guestName;

// Ganti URL di bawah ini dengan URL Web App dari Google Apps Script Anda
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzcLQNkx0evP5qGVjra6eJWuSeCDD7nJz2R_BJzAwLJ3eCziV3Dk2bSxCqPV0DBDPXr/exec';

// 3. Manajemen Background Music (Howler.js)
const sound = new Howl({
    src: ['https://www.bensound.com/bensound-music/bensound-love.mp3'], // Ganti dengan URL musik asli
    loop: true,
    volume: 0.5
});

let isPlaying = false;

function openInvitation() {
    const modal = document.getElementById('welcome-modal');
    modal.classList.add('opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        
        // Play music (mengikuti kebijakan autoplay browser)
        sound.play();
        isPlaying = true;
        document.getElementById('music-toggle').classList.remove('hidden');
    }, 700);
}

function toggleMusic() {
    if (isPlaying) {
        sound.pause();
        document.getElementById('music-icon').innerText = '🔇';
    } else {
        sound.play();
        document.getElementById('music-icon').innerText = '🎵';
    }
    isPlaying = !isPlaying;
}

// 4. Fitur RSVP dengan SweetAlert2
function handleRSVP() {
    Swal.fire({
        title: 'Konfirmasi Kehadiran',
        html: `
            <input type="text" id="rsvp-name" class="swal2-input" placeholder="Nama Anda" value="${guestName}">
            <select id="rsvp-attendance" class="swal2-input">
                <option value="Hadir">Hadir</option>
                <option value="Tidak Hadir">Tidak Hadir</option>
            </select>
            <textarea id="rsvp-message" class="swal2-textarea" placeholder="Ucapan atau Doa (Opsional)"></textarea>
        `,
        confirmButtonText: 'Kirim',
        focusConfirm: false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const name = Swal.getPopup().querySelector('#rsvp-name').value;
            const attendance = Swal.getPopup().querySelector('#rsvp-attendance').value;
            const message = Swal.getPopup().querySelector('#rsvp-message').value;

            if (!name) {
                Swal.showValidationMessage(`Tolong masukkan nama Anda`);
                return false;
            }

            return fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ name, attendance, message })
            })
            .then(response => {
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .catch(error => {
                Swal.showValidationMessage(`Request failed: ${error}`);
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Terima Kasih!',
                text: 'Konfirmasi Anda telah kami terima.',
                icon: 'success'
            });
        }
    });
}