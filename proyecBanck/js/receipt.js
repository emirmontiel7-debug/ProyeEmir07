/**
 * AETHER BANK - OFFICIAL SPEI / CEP RECEIPT GENERATOR (js/receipt.js)
 * Printable Vouchers, Banxico QR Validation & PDF/Print Triggers
 */

// OPEN RECEIPT MODAL WITH TX DATA
function openReceiptModal(tx) {
    if (!tx) return;

    // Populate Receipt Fields
    document.getElementById('rcptAmount').textContent = `$${formatMoney(tx.amount)} MXN`;
    
    // Sender Details
    document.getElementById('rcptSenderName').textContent = tx.type === 'sent' ? 'EMIR USER' : (tx.sender || 'BANCO EMISOR');
    document.getElementById('rcptSenderBank').textContent = tx.type === 'sent' ? 'AETHER BANK (STP)' : tx.bank;
    document.getElementById('rcptSenderClabe').textContent = tx.senderClabe || (tx.type === 'sent' ? '012 180 01549283741 9' : '012 180 00987654321 4');

    // Receiver Details
    document.getElementById('rcptReceiverName').textContent = tx.type === 'sent' ? tx.receiver : 'EMIR USER';
    document.getElementById('rcptReceiverBank').textContent = tx.type === 'sent' ? tx.bank : 'AETHER BANK (STP)';
    document.getElementById('rcptReceiverClabe').textContent = tx.receiverClabe || (tx.type === 'sent' ? '012 180 00123456789 0' : '012 180 01549283741 9');

    // Metadata
    document.getElementById('rcptTrackingKey').textContent = tx.trackingKey || generateTrackingKey();
    
    const formattedDate = new Date(tx.date).toLocaleDateString('es-MX', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    document.getElementById('rcptDateTime').textContent = `${formattedDate} hrs`;
    document.getElementById('rcptConcept').textContent = tx.concept || 'Transferencia SPEI';
    document.getElementById('rcptRef').textContent = tx.ref || '1234567';

    // Digital Seal
    const seal = `||012|STP|${tx.date.substring(0,10)}|${tx.trackingKey}|${tx.amount.toFixed(2)}|${tx.concept}||${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}||`;
    document.getElementById('rcptDigitalSeal').textContent = seal;

    // Render Validation QR Code inside Receipt
    renderReceiptQrCode(tx.trackingKey || 'SPEI2026');

    openModal('modalReceipt');
}

// INITIALIZE RECEIPT EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    // Print Button Handler
    const printBtn = document.getElementById('btnPrintReceipt');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Share / Download Button Handler
    const shareBtn = document.getElementById('btnShareReceipt');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const tracking = document.getElementById('rcptTrackingKey').textContent;
            navigator.clipboard.writeText(`Comprobante SPEI Aether Bank - Clave de Rastreo: ${tracking}`).then(() => {
                showToast('Datos del comprobante copiados al portapapeles', 'success');
                playAudioTone('chime');
            });
        });
    }
});

// GENERATE DYNAMIC SVG QR CODE FOR SPEI VALIDATION
function generateSVGQR(text) {
    // High contrast compact SVG pattern representing a realistic matrix QR Code
    const hash = simpleStringHash(text);
    let pathData = '';
    const size = 21;
    const cellSize = 8;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            // Position finder patterns at 3 corners
            const isTopLeft = (r < 7 && c < 7);
            const isTopRight = (r < 7 && c >= size - 7);
            const isBottomLeft = (r >= size - 7 && c < 7);

            let isDark = false;
            if (isTopLeft || isTopRight || isBottomLeft) {
                const border = (r === 0 || r === 6 || c === 0 || c === 6 || r === size - 1 || r === size - 7 || c === size - 1 || c === size - 7);
                const center = (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
                               (r >= 2 && r <= 4 && c >= size - 5 && c >= size - 3) ||
                               (r >= size - 5 && r <= size - 3 && c >= 2 && c <= 4);
                isDark = border || center;
            } else {
                isDark = ((r * size + c + hash) % 3 === 0 || (r * c + hash) % 7 === 0);
            }

            if (isDark) {
                pathData += `M${c * cellSize},${r * cellSize}h${cellSize}v${cellSize}h-${cellSize}z `;
            }
        }
    }

    const svgWidth = size * cellSize;
    return `
        <svg viewBox="0 0 ${svgWidth} ${svgWidth}" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:4px; padding:4px;">
            <path d="${pathData}" fill="#0f172a" />
        </svg>
    `;
}

function simpleStringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function renderReceiptQrCode(trackingKey) {
    const wrapper = document.getElementById('receiptQrValidation');
    if (wrapper) {
        wrapper.innerHTML = generateSVGQR(trackingKey);
    }
}

function renderModalQrCode() {
    const wrapper = document.getElementById('qrCodeWrapper');
    if (wrapper) {
        wrapper.innerHTML = generateSVGQR('012180015492837419-AETHER');
    }
}
