// Application Management Module
const APP_SERVICES = [
    {
        id: 'orkestra',
        name: 'Orkestra',
        description: 'Ana Kontrol Paneli',
        url: 'https://orkestra.bitebimuv.org',
        subdomain: 'orkestra.bitebimuv.org',
        port: 5000,
        icon: 'fa-music',
        color: 'purple',
        pm2Name: 'orkestra',
        features: ['Dashboard', 'Uygulamalar', 'Finans', 'Life Logs', 'AI']
    },
    {
        id: 'bimuv-api',
        name: 'Bimuv API',
        description: 'Ana Backend Servisleri',
        url: 'https://api.bitebimuv.org',
        subdomain: 'api.bitebimuv.org',
        port: 3001,
        icon: 'fa-server',
        color: 'blue',
        pm2Name: 'bimuv-api',
        features: ['REST API', 'Authentication', 'Database']
    },
    {
        id: 'bimuv-bot',
        name: 'Bimuv Bot',
        description: 'WhatsApp Bot Servisi',
        url: 'https://bot.bitebimuv.org',
        subdomain: 'bot.bitebimuv.org',
        port: null,
        icon: 'fa-robot',
        color: 'green',
        pm2Name: 'bimuv-bot',
        features: ['WhatsApp', 'Auto Reply', 'Commands']
    },
    {
        id: 'bimuv-wa',
        name: 'WhatsApp Service',
        description: 'WhatsApp Web Integration',
        url: null,
        subdomain: null,
        port: null,
        icon: 'fa-whatsapp',
        color: 'green',
        pm2Name: 'bimuv-wa',
        features: ['QR Code', 'Messages', 'Media']
    },
    {
        id: 'password-manager',
        name: 'Password Manager',
        description: 'Şifre Yönetim Sistemi',
        url: 'https://password.bitebimuv.org',
        subdomain: 'password.bitebimuv.org',
        port: 8080,
        icon: 'fa-lock',
        color: 'red',
        pm2Name: 'password-manager',
        features: ['Şifre Saklama', 'Şifreleme', 'Güvenlik']
    },
    {
        id: 'virtual-number',
        name: 'Virtual Number',
        description: 'Sanal Numara Servisi',
        url: null,
        subdomain: null,
        port: 4000,
        icon: 'fa-phone',
        color: 'indigo',
        pm2Name: 'virtual-number-backend',
        features: ['SMS', 'Numara Yönetimi', 'Doğrulama']
    },
    {
        id: 'n8n',
        name: 'n8n Automation',
        description: 'Otomasyon & Workflow',
        url: 'https://n8n.bitebimuv.org',
        subdomain: 'n8n.bitebimuv.org',
        port: 5678,
        icon: 'fa-diagram-project',
        color: 'pink',
        pm2Name: 'n8n',
        features: ['Workflows', 'Integrations', 'Automation']
    },
    {
        id: 'pushbullet',
        name: 'Pushbullet Service',
        description: 'File Transfer & Notifications',
        url: 'https://pushbullet.bitebimuv.org',
        subdomain: 'pushbullet.bitebimuv.org',
        port: 3002,
        icon: 'fa-paper-plane',
        color: 'orange',
        pm2Name: 'pushbullet',
        features: ['File Transfer', 'Push Notifications', 'Device Sync']
    },
    {
        id: 'yz',
        name: 'YZ (AI Service)',
        description: 'Yapay Zeka Servisleri',
        url: 'https://yz.bitebimuv.org',
        subdomain: 'yz.bitebimuv.org',
        port: null,
        icon: 'fa-brain',
        color: 'cyan',
        pm2Name: null,
        features: ['AI Models', 'ML', 'Natural Language']
    },
    {
        id: 'sosyalmedya',
        name: 'Sosyal Medya',
        description: 'Social Media Management',
        url: 'https://sosyalmedya.bitebimuv.org',
        subdomain: 'sosyalmedya.bitebimuv.org',
        port: null,
        icon: 'fa-share-nodes',
        color: 'teal',
        pm2Name: null,
        features: ['Post Scheduling', 'Analytics', 'Multi-Platform']
    },
    {
        id: 'whatsapp-google',
        name: 'WhatsApp Google',
        description: 'Google Integration',
        url: null,
        subdomain: null,
        port: null,
        icon: 'fa-google',
        color: 'yellow',
        pm2Name: 'whatsapp-google',
        features: ['Google Sheets', 'Drive', 'Calendar']
    }
];

const ORCHESTRA_PLATFORM_SECTIONS = [
    {
        title: 'AI ve Model Katmanı',
        icon: 'fa-brain',
        color: 'purple',
        items: [
            { name: 'Claude', detail: 'Sonnet 4.6 (Önerilen ana model)', tag: 'Primary' },
            { name: 'Gemini', detail: 'Alternatif büyük model', tag: 'Fallback' },
            { name: 'Perplexity', detail: 'Canlı web araştırması', tag: 'Research' },
            { name: 'GitHub Copilot Pro', detail: 'Kod üretimi ve IDE akışı', tag: 'Dev' },
            { name: 'Ollama', detail: 'Yerel model çalıştırma', tag: 'Local' }
        ]
    },
    {
        title: 'Günlük Operasyon ve Üretim',
        icon: 'fa-briefcase',
        color: 'blue',
        items: [
            { name: 'Slack', detail: 'Ekip iletişimi', tag: 'Comm' },
            { name: 'Monday', detail: 'Görev takibi', tag: 'PM' },
            { name: 'IntelliJ IDEA', detail: 'Ana IDE', tag: 'IDE' },
            { name: 'Xcode + Copilot for Xcode', detail: 'iOS geliştirme', tag: 'IDE' },
            { name: 'Figma + Canva + CapCut', detail: 'Tasarım ve içerik üretimi', tag: 'Creative' },
            { name: 'Docker', detail: 'Konteyner orkestrasyonu', tag: 'Infra' },
            { name: 'Google Business Plus + GCP', detail: 'İşletme ve bulut altyapısı', tag: 'Cloud' },
            { name: 'Vercel + Clerk + Heroku', detail: 'Dağıtım ve kimlik katmanı', tag: 'Deploy' },
            { name: 'Datadog', detail: 'Gözlemlenebilirlik', tag: 'Observability' },
            { name: '1Password + Termius + Tower', detail: 'Güvenlik ve erişim', tag: 'Ops' },
            { name: 'Polypane + HazeOver + SQLGate', detail: 'UI/DB üretkenliği', tag: 'Tooling' },
            { name: 'Bootstrap + Lambda + Antigravity', detail: 'UI + serverless + yardımcı araçlar', tag: 'Stack' }
        ]
    },
    {
        title: 'Editör Stratejisi',
        icon: 'fa-code',
        color: 'indigo',
        items: [
            { name: 'Cursor', detail: 'Tut (Copilot olmayan deneysel işlerde)', tag: 'Keep' },
            { name: 'OpenCode', detail: 'Karar netleşene kadar dondur; kullanım yoksa kaldır', tag: 'Optional' }
        ]
    }
];

const ORCHESTRA_DOMAIN_INVENTORY = [
    {
        domain: 'bitebimuv.org',
        provider: 'Turhost',
        purpose: 'Dernek',
        records: ['A 94.199.201.3'],
        subdomains: [
            { host: 'n8n.bitebimuv.org', purpose: 'Otomasyon', record: 'A 34.141.16.229' },
            { host: 'app.bitebimuv.org', purpose: 'Uygulama', record: 'A 34.141.16.229' }
        ],
        url: 'https://bitebimuv.org'
    },
    {
        domain: 'mutluet.org',
        provider: 'Squarescape',
        purpose: 'Dernek',
        records: ['A 103.169.142.0'],
        subdomains: [],
        url: 'https://mutluet.org'
    },
    {
        domain: 'bitir.me',
        provider: 'NameCheap',
        purpose: 'Öğrenci / GitHub Education',
        records: ['A 185.199.108.153'],
        subdomains: [],
        url: 'https://bitir.me'
    }
];

const ORCHESTRA_PUBLISHING_TASKS = [
    {
        title: 'nefes-islamic-mindfulness yayını',
        target: 'nefes.bitebimuv.org',
        source: 'GitHub repo: nefes-islamic-mindfulness',
        status: 'Planlandı'
    }
];

// Load enhanced dashboard
async function loadEnhancedDashboard() {
    const content = `
        <div class="space-y-6">
            <!-- Header -->
            <div class="glass p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-3xl font-bold gradient-text mb-2">🎼 Orkestra Control Center</h2>
                        <p class="text-gray-600">Tüm uygulamalarınızı tek yerden yönetin</p>
                    </div>
                    <button onclick="refreshAllServices()" class="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition">
                        <i class="fas fa-sync mr-2"></i> Tümünü Yenile
                    </button>
                </div>
            </div>

            <!-- System Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="glass p-6 card stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">Toplam Servis</p>
                            <p class="text-3xl font-bold text-purple-600">${APP_SERVICES.length}</p>
                        </div>
                        <i class="fas fa-server text-4xl text-purple-400"></i>
                    </div>
                </div>
                <div class="glass p-6 card stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">Çalışan</p>
                            <p class="text-3xl font-bold text-green-600" id="running-count">...</p>
                        </div>
                        <i class="fas fa-check-circle text-4xl text-green-400"></i>
                    </div>
                </div>
                <div class="glass p-6 card stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">Durmuş</p>
                            <p class="text-3xl font-bold text-red-600" id="stopped-count">...</p>
                        </div>
                        <i class="fas fa-times-circle text-4xl text-red-400"></i>
                    </div>
                </div>
                <div class="glass p-6 card stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">Toplam Uptime</p>
                            <p class="text-3xl font-bold text-blue-600" id="total-uptime">...</p>
                        </div>
                        <i class="fas fa-clock text-4xl text-blue-400"></i>
                    </div>
                </div>
            </div>

            <!-- Applications Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" id="apps-grid">
                ${APP_SERVICES.map(app => createAppCard(app)).join('')}
            </div>
        </div>
    `;

    document.getElementById('content-area').innerHTML = content;

    // Load service statuses
    loadServiceStatuses();
}

function createAppCard(app) {
    const colorClass = {
        'purple': 'from-purple-500 to-purple-700',
        'blue': 'from-blue-500 to-blue-700',
        'green': 'from-green-500 to-green-700',
        'red': 'from-red-500 to-red-700',
        'indigo': 'from-indigo-500 to-indigo-700',
        'pink': 'from-pink-500 to-pink-700',
        'yellow': 'from-yellow-500 to-yellow-700'
    }[app.color] || 'from-gray-500 to-gray-700';

    return `
        <div class="glass overflow-hidden card" id="app-${app.id}">
            <!-- App Header -->
            <div class="bg-gradient-to-r ${colorClass} p-6 text-white">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <i class="fas ${app.icon} text-3xl mr-3"></i>
                        <div>
                            <h3 class="text-xl font-bold">${app.name}</h3>
                            <p class="text-sm opacity-90">${app.description}</p>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <span class="status-badge" id="status-${app.id}">
                            <i class="fas fa-circle-notch fa-spin"></i>
                        </span>
                    </div>
                </div>
                ${app.subdomain ? `
                    <div class="text-sm opacity-90">
                        <i class="fas fa-link mr-2"></i>${app.subdomain}
                    </div>
                ` : ''}
            </div>

            <!-- App Body -->
            <div class="p-6">
                <!-- Features -->
                <div class="mb-4">
                    <p class="text-xs text-gray-500 uppercase font-semibold mb-2">Özellikler</p>
                    <div class="flex flex-wrap gap-2">
                        ${app.features.map(f => `<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">${f}</span>`).join('')}
                    </div>
                </div>

                <!-- Metrics -->
                <div class="grid grid-cols-3 gap-2 mb-4 text-center" id="metrics-${app.id}">
                    <div class="p-2 bg-gray-50 rounded">
                        <p class="text-xs text-gray-500">CPU</p>
                        <p class="text-sm font-bold" id="cpu-${app.id}">-</p>
                    </div>
                    <div class="p-2 bg-gray-50 rounded">
                        <p class="text-xs text-gray-500">RAM</p>
                        <p class="text-sm font-bold" id="ram-${app.id}">-</p>
                    </div>
                    <div class="p-2 bg-gray-50 rounded">
                        <p class="text-xs text-gray-500">Uptime</p>
                        <p class="text-sm font-bold" id="uptime-${app.id}">-</p>
                    </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2">
                    ${app.url ? `
                        <button onclick="openApp('${app.url}')" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition">
                            <i class="fas fa-external-link-alt mr-1"></i> Aç
                        </button>
                    ` : `
                        <button disabled class="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm cursor-not-allowed">
                            <i class="fas fa-ban mr-1"></i> N/A
                        </button>
                    `}
                    <button onclick="showAppActions('${app.id}')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition">
                        <i class="fas fa-cog mr-1"></i> Yönet
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Load service statuses from monitoring API
async function loadServiceStatuses() {
    try {
        const response = await axios.get(`${API_BASE}/monitoring/services`);
        const services = response.data.services || [];

        let running = 0, stopped = 0;

        services.forEach(service => {
            const app = APP_SERVICES.find(a => a.name.toLowerCase().includes(service.name.toLowerCase()) || service.name.toLowerCase().includes(a.id.toLowerCase()));
            if (!app) return;

            const statusBadge = document.getElementById(`status-${app.id}`);
            if (statusBadge) {
                if (service.status === 'healthy' || service.status === 'online') {
                    statusBadge.innerHTML = '<i class="fas fa-check-circle"></i>';
                    statusBadge.className = 'status-badge bg-green-500';
                    running++;
                } else {
                    statusBadge.innerHTML = '<i class="fas fa-times-circle"></i>';
                    statusBadge.className = 'status-badge bg-red-500';
                    stopped++;
                }
            }

            // Update metrics if available
            if (service.cpu !== undefined) {
                const cpuEl = document.getElementById(`cpu-${app.id}`);
                if (cpuEl) cpuEl.textContent = service.cpu + '%';
            }
            if (service.memory) {
                const ramEl = document.getElementById(`ram-${app.id}`);
                if (ramEl) ramEl.textContent = service.memory;
            }
            if (service.uptime) {
                const uptimeEl = document.getElementById(`uptime-${app.id}`);
                if (uptimeEl) uptimeEl.textContent = formatUptime(service.uptime);
            }
        });

        document.getElementById('running-count').textContent = running;
        document.getElementById('stopped-count').textContent = stopped;

    } catch (error) {
        console.error('Failed to load service statuses:', error);
    }
}

function formatUptime(seconds) {
    if (!seconds) return '-';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return `${Math.floor(seconds / 60)}m`;
}

function openApp(url) {
    window.open(url, '_blank');
}

function showAppActions(appId) {
    const app = APP_SERVICES.find(a => a.id === appId);
    if (!app) return;

    const modal = `
        <div id="app-action-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="closeActionModal(event)">
            <div class="glass p-8 max-w-2xl w-full mx-4" onclick="event.stopPropagation()">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold">${app.name} - Yönetim</h3>
                    <button onclick="closeActionModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <button onclick="restartApp('${app.pm2Name}')" class="p-6 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition text-left">
                        <i class="fas fa-redo text-3xl text-yellow-600 mb-2"></i>
                        <p class="font-bold text-yellow-900">Yeniden Başlat</p>
                        <p class="text-sm text-yellow-700">Uygulamayı restart et</p>
                    </button>

                    <button onclick="stopApp('${app.pm2Name}')" class="p-6 bg-red-50 hover:bg-red-100 rounded-lg transition text-left">
                        <i class="fas fa-stop text-3xl text-red-600 mb-2"></i>
                        <p class="font-bold text-red-900">Durdur</p>
                        <p class="text-sm text-red-700">Uygulamayı durdur</p>
                    </button>

                    <button onclick="startApp('${app.pm2Name}')" class="p-6 bg-green-50 hover:bg-green-100 rounded-lg transition text-left">
                        <i class="fas fa-play text-3xl text-green-600 mb-2"></i>
                        <p class="font-bold text-green-900">Başlat</p>
                        <p class="text-sm text-green-700">Uygulamayı çalıştır</p>
                    </button>

                    <button onclick="viewLogs('${app.pm2Name}')" class="p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-left">
                        <i class="fas fa-file-alt text-3xl text-blue-600 mb-2"></i>
                        <p class="font-bold text-blue-900">Loglar</p>
                        <p class="text-sm text-blue-700">Uygulama loglarını gör</p>
                    </button>

                    ${app.url ? `
                        <button onclick="openApp('${app.url}')" class="p-6 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-left">
                            <i class="fas fa-external-link-alt text-3xl text-purple-600 mb-2"></i>
                            <p class="font-bold text-purple-900">Aç</p>
                            <p class="text-sm text-purple-700">Yeni sekmede aç</p>
                        </button>
                    ` : ''}

                    <button onclick="updateApp('${app.id}')" class="p-6 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition text-left">
                        <i class="fas fa-download text-3xl text-indigo-600 mb-2"></i>
                        <p class="font-bold text-indigo-900">Güncelle</p>
                        <p class="text-sm text-indigo-700">Son versiyonu çek</p>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);
}

function closeActionModal(event) {
    if (event && event.target.id !== 'app-action-modal') return;
    const modal = document.getElementById('app-action-modal');
    if (modal) modal.remove();
}

async function restartApp(pm2Name) {
    try {
        await axios.post(`${API_BASE}/monitoring/services/${pm2Name}/restart`);
        showNotification('success', `${pm2Name} yeniden başlatılıyor...`);
        setTimeout(() => loadServiceStatuses(), 2000);
        closeActionModal();
    } catch (error) {
        showNotification('error', 'Yeniden başlatma başarısız: ' + error.message);
    }
}

async function stopApp(pm2Name) {
    try {
        await axios.post(`${API_BASE}/monitoring/services/${pm2Name}/stop`);
        showNotification('success', `${pm2Name} durduruluyor...`);
        setTimeout(() => loadServiceStatuses(), 2000);
        closeActionModal();
    } catch (error) {
        showNotification('error', 'Durdurma başarısız: ' + error.message);
    }
}

async function startApp(pm2Name) {
    try {
        await axios.post(`${API_BASE}/monitoring/services/${pm2Name}/start`);
        showNotification('success', `${pm2Name} başlatılıyor...`);
        setTimeout(() => loadServiceStatuses(), 2000);
        closeActionModal();
    } catch (error) {
        showNotification('error', 'Başlatma başarısız: ' + error.message);
    }
}

function viewLogs(pm2Name) {
    showNotification('info', 'Log görüntüleme özelliği yakında eklenecek...');
}

function updateApp(appId) {
    showNotification('info', 'Güncelleme özelliği yakında eklenecek...');
}

function refreshAllServices() {
    showNotification('info', 'Tüm servisler yenileniyor...');
    loadServiceStatuses();
}

function loadOrchestraPanel() {
    const content = `
        <div class="space-y-6">
            <div class="glass p-6">
                <h2 class="text-3xl font-bold gradient-text mb-2">Platform Orkestrası</h2>
                <p class="text-gray-600">Araçlar, AI modelleri, alan adları ve yayın görevleri tek panelde</p>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                ${ORCHESTRA_PLATFORM_SECTIONS.map(renderPlatformSection).join('')}
            </div>

            <div class="glass p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold">Alan Adı ve DNS Envanteri</h3>
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">${ORCHESTRA_DOMAIN_INVENTORY.length} domain</span>
                </div>
                <div class="space-y-4">
                    ${ORCHESTRA_DOMAIN_INVENTORY.map(renderDomainCard).join('')}
                </div>
            </div>

            <div class="glass p-6">
                <h3 class="text-xl font-bold mb-4">Yayın Görevleri</h3>
                <div class="space-y-3">
                    ${ORCHESTRA_PUBLISHING_TASKS.map(task => `
                        <div class="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <p class="font-semibold text-emerald-900">${task.title}</p>
                                    <p class="text-sm text-emerald-800 mt-1">${task.source}</p>
                                    <p class="text-sm text-emerald-800">Hedef: <span class="font-semibold">${task.target}</span></p>
                                </div>
                                <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">${task.status}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.getElementById('content-area').innerHTML = content;
}

function renderPlatformSection(section) {
    const colorClass = {
        purple: 'text-purple-600 bg-purple-50',
        blue: 'text-blue-600 bg-blue-50',
        indigo: 'text-indigo-600 bg-indigo-50'
    }[section.color] || 'text-gray-600 bg-gray-50';

    return `
        <div class="glass p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold">${section.title}</h3>
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${colorClass}">
                    <i class="fas ${section.icon} mr-1"></i>${section.items.length}
                </span>
            </div>
            <div class="space-y-3">
                ${section.items.map(item => `
                    <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <p class="font-semibold text-gray-900">${item.name}</p>
                                <p class="text-sm text-gray-600">${item.detail}</p>
                            </div>
                            <span class="px-2 py-1 text-xs bg-white border border-gray-200 rounded">${item.tag}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderDomainCard(domain) {
    return `
        <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div>
                    <p class="font-semibold text-gray-900">${domain.domain}</p>
                    <p class="text-sm text-gray-600">${domain.provider} · ${domain.purpose}</p>
                </div>
                ${domain.url ? `
                    <a href="${domain.url}" target="_blank" class="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition">
                        <i class="fas fa-external-link-alt mr-1"></i> Aç
                    </a>
                ` : ''}
            </div>
            <p class="text-sm text-gray-700 mb-2"><span class="font-semibold">DNS:</span> ${domain.records.join(', ')}</p>
            ${domain.subdomains.length > 0 ? `
                <div class="space-y-2">
                    ${domain.subdomains.map(sub => `
                        <div class="p-3 bg-white rounded border border-gray-100 text-sm">
                            <p class="font-semibold text-gray-900">${sub.host}</p>
                            <p class="text-gray-600">${sub.purpose}</p>
                            <p class="text-gray-700">${sub.record}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function showNotification(type, message) {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    const notification = `
        <div class="fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in">
            <p>${message}</p>
        </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = notification;
    document.body.appendChild(div);

    setTimeout(() => div.remove(), 3000);
}
