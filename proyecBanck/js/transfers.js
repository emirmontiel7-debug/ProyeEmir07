/**
 * AETHER BANK - TRANSFERS & INTERBANK SIMULATOR (js/transfers.js)
 * Interbank Sending, Didactic Receiving Engine, PIN Verification & Ledger
 */

// SUPPORTED INTERBANK LIST
const BANKS_CATALOG = [
    { id: 'bbva', name: 'BBVA México', color: '#004481', letter: 'B' },
    { id: 'nu', name: 'Nu Bank', color: '#820ad1', letter: 'N' },
    { id: 'santander', name: 'Santander', color: '#ec0000', letter: 'S' },
    { id: 'mercadopago', name: 'Mercado Pago', color: '#009ee3', letter: 'M' },
    { id: 'banamex', name: 'Citibanamex', color: '#002d72', letter: 'C' },
    { id: 'banorte', name: 'Banorte', color: '#eb0029', letter: 'B' },
    { id: 'hsbc', name: 'HSBC México', color: '#db0011', letter: 'H' },
    { id: 'azteca', name: 'Banco Azteca', color: '#00843d', letter: 'A' },
    { id: 'scotiabank', name: 'Scotiabank', color: '#ec111a', letter: 'S' }
];

// STATE FOR SENDING FLOW
let currentTransferDraft = {
    bank: BANKS_CATALOG[0],
    clabe: '',
    recipientName: '',
    amount: 0,
    concept: 'Transferencia SPEI',
    ref: '1234567',
    enteredPin: ''
};

// INITIALIZE TRANSFER EVENTS
document.addEventListener('DOMContentLoaded', () => {
    initBankPicker();
    initSendTransferFlow();
    initSimulators();
    initHistoryFilters();
});

// POPULATE BANK PICKER GRID
function initBankPicker() {
    const grid = document.getElementById('bankPickerGrid');
    if (!grid) return;
    grid.innerHTML = '';

    BANKS_CATALOG.forEach((bank, index) => {
        const card = document.createElement('div');
        card.className = `bank-option-card ${index === 0 ? 'selected' : ''}`;
        card.setAttribute('data-bank-id', bank.id);
        card.innerHTML = `
            <div class="bank-badge-icon" style="background-color: ${bank.color}">${bank.letter}</div>
            <span>${bank.name}</span>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('.bank-option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            currentTransferDraft.bank = bank;
            playAudioTone('click');
        });
        grid.appendChild(card);
    });
}

// SEND TRANSFER FLOW (STEP 1 -> STEP 2 -> STEP 3 -> EXECUTE)
function initSendTransferFlow() {
    const modalSend = 'modalSendTransfer';

    // Open Send Modal button
    document.getElementById('btnOpenSendModal').addEventListener('click', () => {
        if (BANK_STATE.isFrozen) {
            showToast('Tu tarjeta se encuentra congelada. Descongélala para enviar transferencias.', 'error');
            playAudioTone('error');
            return;
        }
        resetSendForm();
        openModal(modalSend);
    });

    // Step 1 -> Step 2
    document.getElementById('btnNextStep2').addEventListener('click', () => {
        const clabeInput = document.getElementById('recipientClabe').value.trim();
        const nameInput = document.getElementById('recipientName').value.trim();

        if (clabeInput.length < 10) {
            showToast('Ingresa una CLABE (18 dígitos), tarjeta (16) o celular válido.', 'error');
            playAudioTone('error');
            return;
        }

        if (nameInput.length < 3) {
            showToast('Ingresa el nombre del beneficiario.', 'error');
            playAudioTone('error');
            return;
        }

        currentTransferDraft.clabe = clabeInput;
        currentTransferDraft.recipientName = nameInput;

        switchStep(1, 2);
        playAudioTone('click');
    });

    // Step 2 -> Step 1 (Back)
    document.getElementById('btnBackStep1').addEventListener('click', () => {
        switchStep(2, 1);
        playAudioTone('click');
    });

    // Quick amount buttons in Step 2
    document.querySelectorAll('.btn-quick-amount').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = parseFloat(btn.getAttribute('data-val'));
            const amountInput = document.getElementById('sendAmountInput');
            if (val === 3000) {
                amountInput.value = BANK_STATE.balance.toFixed(2);
            } else {
                amountInput.value = val.toFixed(2);
            }
            playAudioTone('click');
        });
    });

    // Step 2 -> Step 3
    document.getElementById('btnNextStep3').addEventListener('click', () => {
        const amountVal = parseFloat(document.getElementById('sendAmountInput').value);
        const conceptVal = document.getElementById('sendConceptInput').value.trim();
        const refVal = document.getElementById('sendRefInput').value.trim() || '1234567';

        if (isNaN(amountVal) || amountVal <= 0) {
            showToast('Ingresa un monto válido a transferir.', 'error');
            playAudioTone('error');
            return;
        }

        if (amountVal > BANK_STATE.balance) {
            showToast(`Saldo insuficiente. Tu saldo actual es $${formatMoney(BANK_STATE.balance)} MXN.`, 'error');
            playAudioTone('error');
            return;
        }

        currentTransferDraft.amount = amountVal;
        currentTransferDraft.concept = conceptVal || 'Transferencia SPEI';
        currentTransferDraft.ref = refVal;

        // Populate Summary in Step 3
        document.getElementById('summaryBank').textContent = currentTransferDraft.bank.name;
        document.getElementById('summaryName').textContent = currentTransferDraft.recipientName;
        document.getElementById('summaryAmount').textContent = `$${formatMoney(amountVal)} MXN`;

        switchStep(2, 3);
        playAudioTone('click');
    });

    // Step 3 -> Step 2 (Back)
    document.getElementById('btnBackStep2').addEventListener('click', () => {
        switchStep(3, 2);
        playAudioTone('click');
    });

    // PIN Keypad buttons
    currentTransferDraft.enteredPin = '';
    document.querySelectorAll('.key-btn[data-key]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentTransferDraft.enteredPin.length < 4) {
                currentTransferDraft.enteredPin += btn.getAttribute('data-key');
                updatePinDisplay();
                playAudioTone('click');
            }
        });
    });

    // Clear PIN
    document.getElementById('btnPinClear').addEventListener('click', () => {
        currentTransferDraft.enteredPin = '';
        updatePinDisplay();
        playAudioTone('click');
    });

    // Biometric Auth Shortcut
    document.getElementById('btnAutoBioAuth').addEventListener('click', () => {
        currentTransferDraft.enteredPin = '1234';
        updatePinDisplay();
        showToast('Autenticación biométrica exitosa', 'success');
        playAudioTone('chime');
    });

    // Execute Transfer
    document.getElementById('btnExecuteTransfer').addEventListener('click', () => {
        if (currentTransferDraft.enteredPin.length < 4) {
            showToast('Introduce tu NIP de 4 dígitos o presiona la huella.', 'error');
            playAudioTone('error');
            return;
        }

        executeOutgoingTransfer();
    });
}

function updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, index) => {
        if (index < currentTransferDraft.enteredPin.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function switchStep(fromStep, toStep) {
    document.getElementById(`sendStep${fromStep}`).classList.remove('step-active');
    document.getElementById(`sendStep${toStep}`).classList.add('step-active');
}

function resetSendForm() {
    currentTransferDraft.enteredPin = '';
    updatePinDisplay();
    document.getElementById('recipientClabe').value = '';
    document.getElementById('recipientName').value = '';
    document.getElementById('sendAmountInput').value = '';
    document.getElementById('sendConceptInput').value = 'Transferencia SPEI';
    switchStep(2, 1);
    switchStep(3, 1);
}

// PROCESS OUTGOING TRANSFER
function executeOutgoingTransfer() {
    const amount = currentTransferDraft.amount;

    if (amount > BANK_STATE.balance) {
        showToast('Fondos insuficientes al procesar la transacción.', 'error');
        playAudioTone('error');
        return;
    }

    // Deduct Balance
    BANK_STATE.balance -= amount;

    // Create Transaction Record
    const tx = {
        id: 'tx_sent_' + Date.now(),
        type: 'sent',
        bank: currentTransferDraft.bank.name,
        sender: 'EMIR USER',
        receiver: currentTransferDraft.recipientName,
        receiverClabe: currentTransferDraft.clabe,
        amount: amount,
        concept: currentTransferDraft.concept,
        trackingKey: generateTrackingKey(),
        ref: currentTransferDraft.ref,
        date: new Date().toISOString()
    };

    BANK_STATE.transactions.unshift(tx);
    saveStateToStorage();
    updateBalanceDisplay();
    renderTransactions();

    closeModal('modalSendTransfer');
    playAudioTone('success');
    triggerConfetti();

    showToast(`Transferencia de $${formatMoney(amount)} enviada a ${currentTransferDraft.recipientName} (${currentTransferDraft.bank.name})`, 'success');

    // Automatically Open SPEI Official Receipt Modal
    setTimeout(() => {
        openReceiptModal(tx);
    }, 400);
}

// INTERBANK INCOMING SIMULATOR LOGIC (RECIBIR DINERO DE OTROS BANCOS)
function initSimulators() {
    // 1. Quick chip buttons
    document.querySelectorAll('.chip-bank').forEach(chip => {
        chip.addEventListener('click', () => {
            const bank = chip.getAttribute('data-bank');
            const name = chip.getAttribute('data-name');
            const amount = parseFloat(chip.getAttribute('data-amount'));

            simulateIncomingTransfer(bank, name, amount);
        });
    });

    // 2. Custom form submission
    const form = document.getElementById('customSimForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const bank = document.getElementById('simBankSelect').value;
        const name = document.getElementById('simSenderInput').value.trim() || 'Juan Pérez';
        const amount = parseFloat(document.getElementById('simAmountInput').value);

        if (isNaN(amount) || amount <= 0) {
            showToast('Ingresa un monto válido para la simulación.', 'error');
            return;
        }

        simulateIncomingTransfer(bank, name, amount);
    });
}

// EXECUTE INCOMING INTERBANK SIMULATION
function simulateIncomingTransfer(bankName, senderName, amount) {
    BANK_STATE.balance += amount;

    const tx = {
        id: 'tx_rec_' + Date.now(),
        type: 'received',
        bank: bankName,
        sender: senderName,
        senderClabe: '012 180 00987654321 4',
        receiver: 'EMIR USER',
        receiverClabe: BANK_STATE.clabe,
        amount: amount,
        concept: `Transferencia SPEI de ${bankName}`,
        trackingKey: generateTrackingKey(),
        ref: Math.floor(1000000 + Math.random() * 9000000).toString(),
        date: new Date().toISOString()
    };

    BANK_STATE.transactions.unshift(tx);
    saveStateToStorage();
    updateBalanceDisplay();
    renderTransactions();

    playAudioTone('chime');
    triggerConfetti();

    showToast(`¡TRANSFERENCIA RECIBIDA! +$${formatMoney(amount)} MXN de ${senderName} (${bankName})`, 'success');

    // Auto open receipt after 600ms so user can print it immediately
    setTimeout(() => {
        openReceiptModal(tx);
    }, 600);
}

// RENDER TRANSACTION LEDGER IN DASHBOARD
function renderTransactions() {
    const container = document.getElementById('txListContainer');
    const countElem = document.getElementById('txCount');
    if (!container) return;

    const searchText = document.getElementById('searchTx')?.value.toLowerCase() || '';
    const filterType = document.getElementById('filterTxType')?.value || 'all';

    const filtered = BANK_STATE.transactions.filter(tx => {
        const matchesSearch = tx.concept.toLowerCase().includes(searchText) ||
                              tx.sender?.toLowerCase().includes(searchText) ||
                              tx.receiver?.toLowerCase().includes(searchText) ||
                              tx.bank?.toLowerCase().includes(searchText);

        const matchesType = filterType === 'all' ? true :
                            filterType === 'received' ? tx.type === 'received' :
                            tx.type === 'sent';

        return matchesSearch && matchesType;
    });

    countElem.textContent = `${filtered.length} movimiento${filtered.length !== 1 ? 's' : ''}`;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fa-solid fa-folder-open text-2xl mb-2"></i>
                <p>No se encontraron movimientos registrados.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    filtered.forEach(tx => {
        const isReceived = tx.type === 'received';
        const dateStr = new Date(tx.date).toLocaleDateString('es-MX', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        });

        const item = document.createElement('div');
        item.className = 'tx-item';
        item.innerHTML = `
            <div class="tx-left">
                <div class="tx-icon-badge ${isReceived ? 'incoming' : 'outgoing'}">
                    <i class="fa-solid ${isReceived ? 'fa-arrow-down-left' : 'fa-arrow-up-right'}"></i>
                </div>
                <div class="tx-details">
                    <span class="tx-title">${tx.concept}</span>
                    <div class="tx-meta">
                        <span>${isReceived ? 'De: ' + tx.sender : 'Para: ' + tx.receiver}</span>
                        <span class="tx-bank-badge">${tx.bank}</span>
                        <span>• ${dateStr}</span>
                    </div>
                </div>
            </div>
            <div class="tx-right">
                <span class="tx-amount ${isReceived ? 'positive' : 'negative'}">
                    ${isReceived ? '+' : '-'}$${formatMoney(tx.amount)} MXN
                </span>
                <button class="btn-receipt-link">
                    <i class="fa-solid fa-receipt"></i> Ver Comprobante
                </button>
            </div>
        `;

        item.addEventListener('click', () => {
            openReceiptModal(tx);
        });

        container.appendChild(item);
    });
}

function initHistoryFilters() {
    const searchInput = document.getElementById('searchTx');
    const filterSelect = document.getElementById('filterTxType');

    if (searchInput) searchInput.addEventListener('input', renderTransactions);
    if (filterSelect) filterSelect.addEventListener('change', renderTransactions);

    // Open receipts archive button in action bar
    const archiveBtn = document.getElementById('btnOpenReceiptsArchive');
    if (archiveBtn) {
        archiveBtn.addEventListener('click', () => {
            if (BANK_STATE.transactions.length > 0) {
                openReceiptModal(BANK_STATE.transactions[0]);
            } else {
                showToast('Aún no tienes comprobantes generados.', 'info');
            }
        });
    }
}
