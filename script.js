// Log de Doações (Simulando Banco de Dados)
const donationLog = [];

document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    }

    // Fechar com ESC
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => modal.classList.add('hidden'));
            document.body.classList.remove('modal-active');
        }
    };
});

// Modais Genéricos
function openModal(modalID) {
    document.getElementById(modalID).classList.remove('hidden');
    document.body.classList.add('modal-active');
}

function closeModal(modalID) {
    document.getElementById(modalID).classList.add('hidden');
    document.body.classList.remove('modal-active');
}

// Função Específica para Abrir Detalhes do Evento
function showEventDetails(title, date, time, location, description) {
    document.getElementById('eventTitle').innerText = title;
    document.getElementById('eventDate').innerText = date;
    document.getElementById('eventTime').innerText = time;
    document.getElementById('eventLocation').innerText = location;
    document.getElementById('eventDescription').innerText = description;
    openModal('eventModal');
}

// --- SISTEMA DE DOAÇÃO ---

// 1. Abrir Modal de Cadastro
function openDonationModal(method) {
    document.getElementById('selectedPaymentMethod').value = method;
    openModal('donationFormModal');
}

// 2. Processar Formulário
function processDonation(e) {
    e.preventDefault();

    // Coletar Dados
    const name = document.getElementById('donorName').value;
    const email = document.getElementById('donorEmail').value;
    const cpf = document.getElementById('donorCPF').value;
    const amount = document.getElementById('donationAmount').value;
    const method = document.getElementById('selectedPaymentMethod').value;
    const date = new Date().toLocaleString();

    // Salvar no Log (Simulação de DB)
    const donationRecord = {
        id: Math.floor(Math.random() * 10000),
        date: date,
        name: name,
        email: email,
        cpf: cpf,
        amount: amount,
        method: method,
        status: 'Pendente' // Será atualizado para 'Confirmado'
    };

    donationLog.push(donationRecord);

    // Log para Controle Mensal (Visível no Console F12)
    console.log("--- NOVO REGISTRO DE DOAÇÃO ---");
    console.table(donationRecord);
    console.log("Total arrecadado no log local: ", donationLog.length, " doações.");

    // Fechar form e mostrar tela de pagamento
    closeModal('donationFormModal');
    showPaymentScreen(method, amount, email);
}

// 3. Mostrar Tela de Pagamento Específica
function showPaymentScreen(method, amount, email) {
    const contentDiv = document.getElementById('paymentContent');
    let html = '';

    if (method === 'credit_card' || method === 'google_pay') {
        // Simulação de Processamento
        html = `
            <div class="py-8">
                <i class="fas fa-circle-notch fa-spin text-5xl text-blue-500 mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800">Processando Pagamento Seguro...</h3>
                <p class="text-gray-500 mt-2">Aguarde um momento.</p>
            </div>
        `;
        contentDiv.innerHTML = html;
        openModal('paymentInfoModal');

        // Simular sucesso após 2 segundos
        setTimeout(() => {
            completeDonation(email, amount);
        }, 2500);

    } else if (method === 'bank_transfer') {
        // Dados Bancários e PIX
        html = `
            <div class="text-left">
                <h3 class="text-xl font-bold text-green-800 mb-4 text-center">Dados para Depósito / PIX</h3>
                <div class="bg-gray-100 p-4 rounded mb-4 text-center border border-gray-300">
                    <p class="text-xs text-gray-500 uppercase font-bold">Chave PIX (CNPJ)</p>
                    <p class="text-xl font-mono font-bold text-gray-800 my-2">00.000.000/0001-00</p>
                    <button onclick="navigator.clipboard.writeText('00.000.000/0001-00'); alert('Chave PIX copiada!')" class="text-blue-600 text-sm underline">Copiar Chave</button>
                </div>
                <div class="space-y-2 text-sm text-gray-700 border-t pt-4">
                    <p><strong>Banco:</strong> Banco do Brasil (001)</p>
                    <p><strong>Agência:</strong> 0000-X</p>
                    <p><strong>Conta Corrente:</strong> 00000-0</p>
                    <p><strong>Favorecido:</strong> Centro de Acolhimento Bartimeu</p>
                    <p><strong>CNPJ:</strong> 00.000.000/0001-00</p>
                </div>
                <button onclick="completeDonation('${email}', '${amount}')" class="mt-6 w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700">
                    Já fiz a transferência (Confirmar)
                </button>
            </div>
        `;
        contentDiv.innerHTML = html;
        openModal('paymentInfoModal');
    }
}

// 4. Finalizar e Simular Envio de Recibo
function completeDonation(email, amount) {
    const contentDiv = document.getElementById('paymentContent');

    // Atualizar status no log
    const lastLog = donationLog[donationLog.length - 1];
    lastLog.status = 'Confirmado';
    console.log("--- STATUS ATUALIZADO: PAGAMENTO CONFIRMADO ---");
    console.log(`Recibo gerado e enviado para: ${email}`);

    const html = `
        <div class="py-6">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-check text-4xl text-green-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-800">Doação Confirmada!</h3>
            <p class="text-gray-600 mt-2">Muito obrigado pela sua generosidade.</p>
            <div class="bg-blue-50 border border-blue-200 rounded p-3 mt-6 text-sm text-blue-800">
                <i class="fas fa-envelope-open-text mr-2"></i>
                O recibo no valor de <strong>R$ ${amount}</strong> foi enviado para:<br>
                <strong>${email}</strong>
            </div>
            <button onclick="closeModal('paymentInfoModal')" class="mt-6 bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700">Fechar</button>
        </div>
    `;
    contentDiv.innerHTML = html;
}

// Newsletter UI Logic
function showNewsletterSuccess() {
    const contentDiv = document.getElementById('paymentContent');
    const html = `
        <div class="py-6">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-envelope-open-text text-4xl text-green-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-800">Inscrição Realizada!</h3>
            <p class="text-gray-600 mt-2">Obrigado! Em breve entraremos em contato.</p>
            <button onclick="closeModal('paymentInfoModal')" class="mt-6 bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700">Fechar</button>
        </div>
    `;
    contentDiv.innerHTML = html;
    openModal('paymentInfoModal');
}
