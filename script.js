// 2. Ambil Parameter "to" dari URL
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to') || 'Tamu Undangan';

// 2.1 Countdown Timer Logic (17 Agustus 2026)
const weddingDate = new Date("August 17, 2026 00:00:00").getTime();

function startCountdown() {
    const timerElements = {
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds"),
        container: document.getElementById("countdown")
    };

    const countdownFunction = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(countdownFunction);
            if (timerElements.container) {
                timerElements.container.innerHTML = "<p class='text-xl font-bold'>Acara Sedang Berlangsung!</p>";
            }
            return;
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        if (timerElements.days) timerElements.days.innerText = d.toString().padStart(2, '0');
        if (timerElements.hours) timerElements.hours.innerText = h.toString().padStart(2, '0');
        if (timerElements.minutes) timerElements.minutes.innerText = m.toString().padStart(2, '0');
        if (timerElements.seconds) timerElements.seconds.innerText = s.toString().padStart(2, '0');
    }, 1000);
}

// Ganti URL di bawah ini dengan URL Web App dari Google Apps Script Anda
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzcLQNkx0evP5qGVjra6eJWuSeCDD7nJz2R_BJzAwLJ3eCziV3Dk2bSxCqPV0DBDPXr/exec';

// 3. Manajemen Background Music (Howler.js)
let sound;
if (typeof Howl !== 'undefined') {
    sound = new Howl({
        src: ['https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030e.mp3'],
        loop: true,
        volume: 0.5,
        html5: true
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Jalankan Countdown
    startCountdown();

    // 1. Inisialisasi AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true });
    }

    // 2. Update Nama Tamu
    const guestElement = document.getElementById('guest-name-modal');
    if (guestElement) guestElement.innerText = guestName;
});

let isPlaying = false;

function openInvitation() {
    const modal = document.getElementById('welcome-modal');
    if (!modal) return;
    
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        // Membuka kunci scroll
        const body = document.getElementById('main-body');
        if (body) body.classList.remove('overflow-y-hidden');
        
        if (sound) {
            sound.play();
            isPlaying = true;
            const toggleBtn = document.getElementById('music-toggle');
            if (toggleBtn) toggleBtn.classList.remove('hidden');
        }
    }, 700);
}

function toggleMusic() {
    if (!sound) return;
    if (isPlaying) {
        sound.pause();
        if (document.getElementById('music-icon')) document.getElementById('music-icon').innerText = '🔇';
    } else {
        sound.play();
        if (document.getElementById('music-icon')) document.getElementById('music-icon').innerText = '🎵';
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
