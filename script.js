// Horários disponíveis - manhã
const morningHours = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'
];

// Horários disponíveis - tarde
const afternoonHours = [
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
];

// Duração dos serviços em minutos
const serviceDurations = {
    'navalhado': 30,
    'pente': 25,
    'barba': 20,
    'maquina_barba': 15,
    'pezinho': 10,
    'pacote': 60,
    'platinado': 120,
    'luzes': 90,
    'pigmentacao': 60,
    'tesoura': 30
};

// Número do WhatsApp para receber agendamentos
const whatsappNumber = '12991246469';

// Elementos do DOM
const bookingForm = document.getElementById('booking-form');
const dateInput = document.getElementById('date');
const timeSelect = document.getElementById('time');
const serviceSelect = document.getElementById('service');

// Configurar data mínima como hoje
const today = new Date();
const todayFormatted = today.toISOString().split('T')[0];
dateInput.min = todayFormatted;

// Configurar data máxima como 30 dias a partir de hoje
const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 30);
const maxDateFormatted = maxDate.toISOString().split('T')[0];
dateInput.max = maxDateFormatted;

// Função para verificar se a data selecionada é domingo ou segunda-feira de manhã
function isClosedDay(date) {
    const day = new Date(date).getDay();
    const selectedTime = timeSelect.value;
    
    // Domingo está sempre fechado
    if (day === 0) return true;
    
    // Segunda-feira só está aberta à tarde
    if (day === 1) {
        if (!selectedTime) return false; // Se nenhum horário selecionado ainda, permite selecionar
        const hour = parseInt(selectedTime.split(':')[0]);
        return hour < 14; // Retorna true se for antes das 14:00
    }
    
    return false;
}

// Preencher horários disponíveis
function populateTimeSlots() {
    timeSelect.innerHTML = '<option value="">Selecione um horário</option>';
    
    const selectedDate = new Date(dateInput.value);
    const day = selectedDate.getDay();
    
    // Se for domingo, não mostrar horários
    if (day === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "Barbearia fechada aos domingos";
        option.disabled = true;
        timeSelect.appendChild(option);
        return;
    }

    // Se for segunda-feira, mostrar apenas horários da tarde
    if (day === 1) {
        const afternoonGroup = document.createElement('optgroup');
        afternoonGroup.label = 'Tarde';
        afternoonHours.forEach(hour => {
            const option = document.createElement('option');
            option.value = hour;
            option.textContent = hour;
            afternoonGroup.appendChild(option);
        });
        timeSelect.appendChild(afternoonGroup);
        return;
    }

    // Para outros dias, mostrar horários da manhã e tarde
    const morningGroup = document.createElement('optgroup');
    morningGroup.label = 'Manhã';
    morningHours.forEach(hour => {
        const option = document.createElement('option');
        option.value = hour;
        option.textContent = hour;
        morningGroup.appendChild(option);
    });
    timeSelect.appendChild(morningGroup);

    const afternoonGroup = document.createElement('optgroup');
    afternoonGroup.label = 'Tarde';
    afternoonHours.forEach(hour => {
        const option = document.createElement('option');
        option.value = hour;
        option.textContent = hour;
        afternoonGroup.appendChild(option);
    });
    timeSelect.appendChild(afternoonGroup);
}

// Atualizar horários disponíveis quando a data é selecionada
dateInput.addEventListener('change', () => {
    if (isClosedDay(dateInput.value)) {
        alert('A barbearia está fechada aos domingos e segundas-feiras. Por favor, selecione outro dia.');
    }
    populateTimeSlots();
});

// Inicializar horários disponíveis
populateTimeSlots();

// Função para formatar a data para exibição
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para obter o nome do serviço
function getServiceName(serviceValue) {
    const serviceNames = {
        'navalhado': 'Corte Navalhado',
        'pente': 'Corte com Pente da Máquina',
        'barba': 'Barba',
        'maquina_barba': 'Máquina na Barba',
        'pezinho': 'Pézinho',
        'pacote': 'Pacote Mensal',
        'platinado': 'Platinado',
        'luzes': 'Luzes',
        'pigmentacao': 'Pigmentação',
        'tesoura': 'Na Tesoura'
    };
    return serviceNames[serviceValue] || serviceValue;
}

// Função para enviar mensagem para o WhatsApp
function sendToWhatsApp(formData) {
    // Formatar a mensagem
    const message = `*Novo Agendamento - Barbearia Nativa*%0A%0A` +
                   `*Nome:* ${formData.name}%0A` +
                   `*Telefone:* ${formData.phone}%0A` +
                   `*Serviço:* ${getServiceName(formData.service)}%0A` +
                   `*Data:* ${formatDate(formData.date)}%0A` +
                   `*Horário:* ${formData.time}%0A%0A` +
                   `_Agendamento realizado através do site_`;
    
    // Criar URL do WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Abrir WhatsApp em uma nova aba
    window.open(whatsappUrl, '_blank');
}

// Manipular envio do formulário
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Coletar dados do formulário
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        service: serviceSelect.value,
        date: dateInput.value,
        time: timeSelect.value
    };

    // Validar dados
    if (!formData.name || !formData.phone || !formData.service || !formData.date || !formData.time) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Verificar se a data selecionada não é domingo ou segunda
    if (isClosedDay(formData.date)) {
        alert('A barbearia está fechada aos domingos e segundas-feiras. Por favor, selecione outro dia.');
        return;
    }

    // Enviar para o WhatsApp
    sendToWhatsApp(formData);

    // Mostrar mensagem de sucesso
    alert(`Agendamento realizado com sucesso!\n\nDetalhes do agendamento:\n
Nome: ${formData.name}
Telefone: ${formData.phone}
Serviço: ${getServiceName(formData.service)}
Data: ${formatDate(formData.date)}
Horário: ${formData.time}\n\n
Uma mensagem será enviada para o WhatsApp da barbearia.`);

    // Resetar formulário
    bookingForm.reset();
    populateTimeSlots();
});

// Máscara para o telefone
document.getElementById('phone').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
        value = `${value.slice(0, 9)}-${value.slice(9)}`;
    }
    
    e.target.value = value;
});

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}); 