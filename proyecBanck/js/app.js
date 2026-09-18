/**
 * AETHER BANK - MAIN APPLICATION LOGIC (js/app.js)
 * State Management, Audio Synthesizer, UI Controls & LocalStorage
 */

// STATE OBJECT INITIALIZATION
const BANK_STATE = {
    balance: 3000.00,
    clabe: '012 180 01549283741 9',
    cardNumber: '4532 8910 2345 8912',
    cvv: '849',
    holder: 'EMIR USER',
    isFrozen: false,
    hideBalance: false,
    cardDataVisible: false,
    transactions: [
        {
            id: 'tx_init_001',
            type: 'received',
            bank: 'AETHER BANK',
            sender: 'Bono de Bienvenida Aether',
            receiver: 'EMIR USER',
            amount: 3000.00,
            concept: 'Apertura de Cuenta NeónSPEI',
            trackingKey: '2026082640014SPEI0000000001',
            ref: '1000001',
            date: new Date().toISOString()
        }
    ]
};

// LOCALSTORAGE KEYS
const STORAGE_KEY = 'aether_bank_state_v1';

// INITIALIZE APP ON DOM CONTENT LOADED
document.addEventListener('DOMContentLoaded', () => {
    loadStateFromStorage();
    initUIControls();
    updateBalanceDisplay();
    renderTransactions();
    initSoundSynth();
});

// LOAD PERSISTED STATE
function loadStateFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            BANK_STATE.balance = typeof parsed.balance === 'number' ? parsed.balance : 3000.00;
            BANK_STATE.isFrozen = !!parsed.isFrozen;
            BANK_STATE.hideBalance = !!parsed.hideBalance;
            if (Array.isArray(parsed.transactions) && parsed.transactions.length > 0) {
                BANK_STATE.transactions = parsed.transactions;
            }
        } catch (e) {
            console.error('Error loading state:', e);
        }
    } else {
        saveStateToStorage();
    }
}

// SAVE STATE
function saveStateToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        balance: BANK_STATE.balance,
        isFrozen: BANK_STATE.isFrozen,
        hideBalance: BANK_STATE.hideBalance,
        transactions: BANK_STATE.transactions
    }));
}

// UPDATE BALANCE UI
function updateBalanceDisplay() {
    const balanceElem = document.getElementById('mainBalance');
    const step2BalElem = document.getElementById('step2AvailableBalance');

    if (BANK_STATE.hideBalance) {
        balanceElem.textContent = '••••••';
        if (step2BalElem) step2BalElem.textContent = '$ •••••• MXN';
    } else {
        balanceElem.textContent = formatMoney(BANK_STATE.balance);
        if (step2BalElem) step2BalElem.textContent = `$${formatMoney(BANK_STATE.balance)} MXN`;
    }

    // Calculate today's income vs expenses
    let income = 0;
    let expenses = 0;
    const today = new Date().toDateString();

    BANK_STATE.transactions.forEach(tx => {
        const txDate = new Date(tx.date).toDateString();
        if (txDate === today) {
            if (tx.type === 'received') income += tx.amount;
            if (tx.type === 'sent') expenses += tx.amount;
        }
    });

    document.getElementById('todayIncome').textContent = `+$${formatMoney(income)}`;
    document.getElementById('todayExpenses').textContent = `-$${formatMoney(expenses)}`;
}

// FORMAT CURRENCY
function formatMoney(amount) {
    return new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// UI EVENT LISTENERS
function initUIControls() {
    // 1. Privacy Eye Balance Toggle
    const eyeBtn = document.getElementById('toggleBalancePrivacy');
    eyeBtn.addEventListener('click', () => {
        BANK_STATE.hideBalance = !BANK_STATE.hideBalance;
        const icon = document.getElementById('eyeIcon');
        icon.className = BANK_STATE.hideBalance ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        updateBalanceDisplay();
        saveStateToStorage();
        playAudioTone('click');
    });

    // 2. Copy CLABE buttons
    const copyClabe = (btnId) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText('012180015492837419').then(() => {
                showToast('CLABE copiada al portapapeles: 012180015492837419', 'success');
                playAudioTone('chime');
            });
        });
    };
    copyClabe('btnCopyClabe');
    copyClabe('btnCopyClabeModal');

    // 3. Virtual Card Freeze / Unfreeze
    const freezeBtn = document.getElementById('toggleFreezeCard');
    freezeBtn.addEventListener('click', () => {
        BANK_STATE.isFrozen = !BANK_STATE.isFrozen;
        const card = document.getElementById('virtualCard');
        const freezeText = document.getElementById('freezeText');
        const freezeIcon = document.getElementById('freezeIcon');

        if (BANK_STATE.isFrozen) {
            card.classList.add('frozen');
            freezeText.textContent = 'Descongelar';
            freezeIcon.className = 'fa-solid fa-fire-flame-curved';
            showToast('Tarjeta congeslada por seguridad', 'info');
        } else {
            card.classList.remove('frozen');
            freezeText.textContent = 'Congelar';
            freezeIcon.className = 'fa-solid fa-snowflake';
            showToast('Tarjeta activa para compras y SPEI', 'success');
        }
        saveStateToStorage();
        playAudioTone('click');
    });

    // 4. Show Card Data
    const showCardBtn = document.getElementById('btnShowCardData');
    showCardBtn.addEventListener('click', () => {
        BANK_STATE.cardDataVisible = !BANK_STATE.cardDataVisible;
        const cardNumElem = document.getElementById('cardNumDisplay');
        const cvvElem = document.getElementById('cvvDisplay');

        if (BANK_STATE.cardDataVisible) {
            cardNumElem.textContent = BANK_STATE.cardNumber;
            cvvElem.textContent = BANK_STATE.cvv;
            showCardBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Ocultar Datos';
        } else {
            cardNumElem.textContent = '4532 •••• •••• 8912';
            cvvElem.textContent = '•••';
            showCardBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Ver Datos';
        }
        playAudioTone('click');
    });

    // 5. Reset Account Balance to Didactic $3,000
    document.getElementById('btnResetAccount').addEventListener('click', () => {
        if (confirm('¿Deseas restablecer el saldo didáctico a $3,000.00 MXN y reiniciar el historial?')) {
            BANK_STATE.balance = 3000.00;
            BANK_STATE.transactions = [{
                id: 'tx_reset_' + Date.now(),
                type: 'received',
                bank: 'AETHER BANK',
                sender: 'Reinicio Didáctico',
                receiver: 'EMIR USER',
                amount: 3000.00,
                concept: 'Restablecimiento de Saldo Didáctico',
                trackingKey: generateTrackingKey(),
                ref: '3000000',
                date: new Date().toISOString()
            }];
            saveStateToStorage();
            updateBalanceDisplay();
            renderTransactions();
            showToast('Saldo reestablecido con éxito a $3,000.00 MXN', 'success');
            playAudioTone('success');
        }
    });

    // 6. Generic Modal Close Buttons
    document.querySelectorAll('.closeModalBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-target');
            if (targetId) closeModal(targetId);
        });
    });

    // Modal Background Click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });

    // Open Receive Modal buttons
    document.getElementById('btnOpenReceiveModal').addEventListener('click', () => {
        renderModalQrCode();
        openModal('modalReceiveMoney');
    });

    // Direct simulator drawer / button triggers
    document.getElementById('openSimTrigger').addEventListener('click', () => {
        scrollToSimCard();
    });
    document.getElementById('btnOpenSimDrawer').addEventListener('click', () => {
        scrollToSimCard();
    });

    document.getElementById('btnTriggerSimFromModal').addEventListener('click', () => {
        closeModal('modalReceiveMoney');
        scrollToSimCard();
    });
}

// SCROLL TO SIMULATOR
function scrollToSimCard() {
    const simCard = document.getElementById('simCardPanel');
    simCard.scrollIntoView({ behavior: 'smooth' });
    simCard.classList.add('pulse-highlight');
    setTimeout(() => simCard.classList.remove('pulse-highlight'), 1500);
}

// MODAL OPEN / CLOSE UTILS
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        playAudioTone('modal');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// TOAST NOTIFICATION SYSTEM
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// AUDIO SYNTHESIZER (WEB AUDIO API)
let audioCtx = null;
function initSoundSynth() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

function playAudioTone(type) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'chime' || type === 'success') {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(150, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'modal') {
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    }
}

// CONFETTI CELEBRATION EFFECT
function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#00ffb3', '#00e5ff', '#8b5cf6', '#fbbf24', '#ffffff'];

    for (let i = 0; i < 80; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.7) * 14,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rSpeed: (Math.random() - 0.5) * 10
        });
    }

    let startTime = Date.now();
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const elapsed = Date.now() - startTime;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3; // gravity
            p.rotation += p.rSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        if (elapsed < 2000) {
            requestAnimationFrame(render);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    render();
}

// HELPER: TRACKING KEY GENERATOR SPEI
function generateTrackingKey() {
    const now = new Date();
    const YYYYMMDD = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0');
    const randomHex = Math.floor(Math.random() * 100000000).toString().padStart(10, '0');
    return `${YYYYMMDD}40014SPEI${randomHex}`;
}
