// API Configuration
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api';

// State management
const state = {
    user: null,
    applications: [],
    lifeLogs: [],
    transactions: [],
    routines: [],
    currentPage: 'dashboard'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    checkAuth();
    loadDashboard();
});

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;

            // Update active state
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Load page
            loadPage(page);
        });
    });
}

// Auth check
async function checkAuth() {
    try {
        const response = await axios.get('http://135.181.254.55:5000/auth/status', { withCredentials: true });
        if (response.data.authenticated) {
            state.user = response.data.user;
        }
    } catch (error) {
        console.log('Not authenticated');
    }
}

// Page loader
function loadPage(page) {
    state.currentPage = page;
    const contentArea = document.getElementById('content-area');
    contentArea.classList.remove('fade-in');

    setTimeout(() => {
        switch(page) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'applications':
                loadApplications();
                break;
            case 'lifelogs':
                loadLifeLogs();
                break;
            case 'finance':
                loadFinance();
                break;
            case 'routines':
                loadRoutines();
                break;
            case 'ai':
                loadAI();
                break;
            case 'orchestra':
                loadOrchestraPanel();
                break;
            case 'automation':
                loadAutomation();
                break;
            case 'pushbullet':
                loadPushbullet();
                break;
        }
        contentArea.classList.add('fade-in');
    }, 100);
}

// Dashboard
async function loadDashboard() {
    const content = `
        <div class="space-y-6">
            <div class="glass p-6">
                <h2 class="text-3xl font-bold gradient-text mb-2">Hoş Geldiniz</h2>
                <p class="text-gray-600">Orkestra ile hayatınızı ve projelerinizi yönetin</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="glass p-6 card stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">Uygulamalar</p>
                            <p class="text-3xl font-bold text-purple-600" id="stat-apps">0</p>
                        </div>
                        <i class="fas fa-th-large text-4xl text-purple-400"></i>
                    </div>
                </div>

                <div class="glass p-6 card stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">Gelir</p>
                            <p class="text-3xl font-bold text-green-600" id="stat-income">₺0</p>
                        </div>
                        <i class="fas fa-arrow-up text-4xl text-green-400"></i>
                    </div>
                </div>

                <div class="glass p-6 card stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">Gider</p>
                            <p class="text-3xl font-bold text-red-600" id="stat-expense">₺0</p>
                        </div>
                        <i class="fas fa-arrow-down text-4xl text-red-400"></i>
                    </div>
                </div>

                <div class="glass p-6 card stat-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">Aktif Rutinler</p>
                            <p class="text-3xl font-bold text-blue-600" id="stat-routines">0</p>
                        </div>
                        <i class="fas fa-calendar-check text-4xl text-blue-400"></i>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="glass p-6">
                    <h3 class="text-xl font-bold mb-4">Son Uygulamalar</h3>
                    <div id="recent-apps" class="space-y-3">
                        <p class="text-gray-500">Yükleniyor...</p>
                    </div>
                </div>

                <div class="glass p-6">
                    <h3 class="text-xl font-bold mb-4">Son Aktiviteler</h3>
                    <div id="recent-logs" class="space-y-3">
                        <p class="text-gray-500">Yükleniyor...</p>
                    </div>
                </div>
            </div>

            <div class="glass p-6">
                <h3 class="text-xl font-bold mb-4">Hızlı İşlemler</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onclick="openModal('newApp')" class="p-4 bg-purple-100 hover:bg-purple-200 rounded-lg transition">
                        <i class="fas fa-plus-circle text-3xl text-purple-600 mb-2"></i>
                        <p class="text-sm font-semibold">Yeni Uygulama</p>
                    </button>
                    <button onclick="openModal('newLog')" class="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition">
                        <i class="fas fa-camera text-3xl text-blue-600 mb-2"></i>
                        <p class="text-sm font-semibold">Kayıt Ekle</p>
                    </button>
                    <button onclick="openModal('newTransaction')" class="p-4 bg-green-100 hover:bg-green-200 rounded-lg transition">
                        <i class="fas fa-dollar-sign text-3xl text-green-600 mb-2"></i>
                        <p class="text-sm font-semibold">İşlem Ekle</p>
                    </button>
                    <button onclick="syncNotion()" class="p-4 bg-pink-100 hover:bg-pink-200 rounded-lg transition">
                        <i class="fas fa-sync text-3xl text-pink-600 mb-2"></i>
                        <p class="text-sm font-semibold">Notion Senkronizasyonu</p>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('content-area').innerHTML = content;
    loadDashboardData();
}

async function loadDashboardData() {
    try {
        const response = await axios.get(`${API_BASE}/dashboard`, { withCredentials: true });
        const data = response.data;

        // Update stats
        document.getElementById('stat-apps').textContent = data.stats.totalApplications;
        document.getElementById('stat-income').textContent = `₺${data.stats.income.toLocaleString()}`;
        document.getElementById('stat-expense').textContent = `₺${data.stats.expenses.toLocaleString()}`;
        document.getElementById('stat-routines').textContent = data.stats.activeRoutines;

        // Recent apps
        const appsHtml = data.applications.map(app => `
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <i class="fas fa-cube text-purple-500"></i>
                <div class="flex-1">
                    <p class="font-semibold">${app.name}</p>
                    <p class="text-xs text-gray-500">${app.subdomain}</p>
                </div>
                <span class="px-2 py-1 bg-${getStatusColor(app.status)}-100 text-${getStatusColor(app.status)}-700 rounded text-xs">${app.status}</span>
            </div>
        `).join('');
        document.getElementById('recent-apps').innerHTML = appsHtml || '<p class="text-gray-500">Henüz uygulama yok</p>';

        // Recent logs
        const logsHtml = data.lifeLogs.map(log => `
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <i class="fas fa-${getLogIcon(log.type)} text-blue-500"></i>
                <div class="flex-1">
                    <p class="font-semibold">${log.title}</p>
                    <p class="text-xs text-gray-500">${new Date(log.date).toLocaleDateString('tr-TR')}</p>
                </div>
            </div>
        `).join('');
        document.getElementById('recent-logs').innerHTML = logsHtml || '<p class="text-gray-500">Henüz kayıt yok</p>';

    } catch (error) {
        console.error('Dashboard data load error:', error);
    }
}

// Applications Page
async function loadApplications() {
    const content = `
        <div class="space-y-6">
            <div class="glass p-6 flex items-center justify-between">
                <div>
                    <h2 class="text-3xl font-bold gradient-text">Uygulamalarım</h2>
                    <p class="text-gray-600">Tüm projelerinizi tek bir yerden yönetin</p>
                </div>
                <button onclick="openModal('newApp')" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                    <i class="fas fa-plus mr-2"></i> Yeni Uygulama
                </button>
            </div>

            <div id="apps-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <p class="text-gray-500">Yükleniyor...</p>
            </div>
        </div>
    `;

    document.getElementById('content-area').innerHTML = content;
    loadApplicationsData();
}

async function loadApplicationsData() {
    try {
        const response = await axios.get(`${API_BASE}/applications`, { withCredentials: true });
        const apps = response.data;

        const appsHtml = apps.map(app => `
            <div class="glass p-6 card">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h3 class="text-xl font-bold mb-1">${app.name}</h3>
                        <p class="text-sm text-gray-600">${app.subdomain}</p>
                    </div>
                    <span class="px-3 py-1 bg-${getStatusColor(app.status)}-100 text-${getStatusColor(app.status)}-700 rounded-full text-xs font-semibold">${app.status}</span>
                </div>

                ${app.description ? `<p class="text-gray-600 text-sm mb-4">${app.description}</p>` : ''}

                <div class="space-y-2 mb-4">
                    ${app.url ? `<a href="${app.url}" target="_blank" class="text-purple-600 hover:text-purple-700 text-sm flex items-center">
                        <i class="fas fa-external-link-alt mr-2"></i> Siteyi Aç
                    </a>` : ''}
                    ${app.currentPhase ? `<p class="text-sm text-gray-600"><i class="fas fa-tasks mr-2"></i> ${app.currentPhase}</p>` : ''}
                    ${app.daysToComplete ? `<p class="text-sm text-gray-600"><i class="fas fa-clock mr-2"></i> ${app.daysToComplete} gün</p>` : ''}
                </div>

                ${app.technologies && app.technologies.length > 0 ? `
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${app.technologies.map(tech => `<span class="px-2 py-1 bg-gray-100 rounded text-xs">${tech}</span>`).join('')}
                    </div>
                ` : ''}

                <div class="flex space-x-2">
                    <button onclick="viewApp('${app._id}')" class="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition text-sm">
                        <i class="fas fa-eye mr-1"></i> Görüntüle
                    </button>
                    <button onclick="editApp('${app._id}')" class="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm">
                        <i class="fas fa-edit mr-1"></i> Düzenle
                    </button>
                </div>
            </div>
        `).join('');

        document.getElementById('apps-grid').innerHTML = appsHtml || '<p class="text-gray-500 col-span-full text-center py-12">Henüz uygulama eklenmemiş. Hemen bir tane ekleyin!</p>';
    } catch (error) {
        console.error('Apps load error:', error);
        document.getElementById('apps-grid').innerHTML = '<p class="text-red-500 col-span-full text-center">Veriler yüklenirken bir hata oluştu.</p>';
    }
}

// AI Assistant Page
function loadAI() {
    const content = `
        <div class="space-y-6">
            <div class="glass p-6">
                <h2 class="text-3xl font-bold gradient-text mb-2">AI Asistan</h2>
                <p class="text-gray-600">Claude AI ile kod oluşturun, analiz yapın ve otomasyon kurun</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="glass p-6 card">
                    <i class="fas fa-code text-4xl text-purple-500 mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">Kod Oluştur</h3>
                    <p class="text-gray-600 text-sm mb-4">Claude AI ile istediğiniz kodu oluşturun</p>
                    <button onclick="openCodeGenerator()" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Başlat
                    </button>
                </div>

                <div class="glass p-6 card">
                    <i class="fas fa-search text-4xl text-blue-500 mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">Kod Analizi</h3>
                    <p class="text-gray-600 text-sm mb-4">Kodunuzu analiz edin ve iyileştirin</p>
                    <button onclick="openCodeAnalyzer()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Başlat
                    </button>
                </div>

                <div class="glass p-6 card">
                    <i class="fas fa-robot text-4xl text-green-500 mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">Sohbet</h3>
                    <p class="text-gray-600 text-sm mb-4">Claude AI ile sohbet edin</p>
                    <button onclick="openChat()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Başlat
                    </button>
                </div>
            </div>

            <div class="glass p-6">
                <div id="ai-workspace">
                    <div class="text-center py-12 text-gray-500">
                        <i class="fas fa-robot text-6xl mb-4 opacity-50"></i>
                        <p>Yukarıdaki seçeneklerden birini seçerek başlayın</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('content-area').innerHTML = content;
}

// Finance Page
function loadFinance() {
    const content = `
        <div class="space-y-6">
            <div class="glass p-6 flex items-center justify-between">
                <div>
                    <h2 class="text-3xl font-bold gradient-text">Finans Yönetimi</h2>
                    <p class="text-gray-600">Gelir ve giderlerinizi takip edin</p>
                </div>
                <button onclick="openModal('newTransaction')" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    <i class="fas fa-plus mr-2"></i> Yeni İşlem
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="glass p-6 card">
                    <p class="text-gray-600 mb-2">Toplam Gelir</p>
                    <p class="text-3xl font-bold text-green-600" id="total-income">₺0</p>
                </div>
                <div class="glass p-6 card">
                    <p class="text-gray-600 mb-2">Toplam Gider</p>
                    <p class="text-3xl font-bold text-red-600" id="total-expense">₺0</p>
                </div>
                <div class="glass p-6 card">
                    <p class="text-gray-600 mb-2">Bakiye</p>
                    <p class="text-3xl font-bold text-blue-600" id="balance">₺0</p>
                </div>
            </div>

            <div class="glass p-6">
                <h3 class="text-xl font-bold mb-4">Son İşlemler</h3>
                <div id="transactions-list" class="space-y-2">
                    <p class="text-gray-500">Yükleniyor...</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('content-area').innerHTML = content;
    loadTransactionsData();
}

async function loadTransactionsData() {
    try {
        const [transactionsRes, statsRes] = await Promise.all([
            axios.get(`${API_BASE}/transactions`, { withCredentials: true }),
            axios.get(`${API_BASE}/transactions/stats`, { withCredentials: true })
        ]);

        const stats = statsRes.data;
        document.getElementById('total-income').textContent = `₺${stats.income.toLocaleString()}`;
        document.getElementById('total-expense').textContent = `₺${stats.expenses.toLocaleString()}`;
        document.getElementById('balance').textContent = `₺${stats.balance.toLocaleString()}`;

        const transactions = transactionsRes.data;
        const txHtml = transactions.map(tx => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-4">
                    <i class="fas fa-${tx.type === 'income' ? 'arrow-up text-green-500' : 'arrow-down text-red-500'} text-2xl"></i>
                    <div>
                        <p class="font-semibold">${tx.category}</p>
                        <p class="text-sm text-gray-600">${new Date(tx.date).toLocaleDateString('tr-TR')}</p>
                    </div>
                </div>
                <p class="text-xl font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                    ${tx.type === 'income' ? '+' : '-'}₺${tx.amount.toLocaleString()}
                </p>
            </div>
        `).join('');

        document.getElementById('transactions-list').innerHTML = txHtml || '<p class="text-gray-500 text-center py-8">Henüz işlem yok</p>';
    } catch (error) {
        console.error('Transactions load error:', error);
    }
}

// Utility functions
function getStatusColor(status) {
    const colors = {
        active: 'green',
        inactive: 'gray',
        development: 'blue',
        maintenance: 'yellow'
    };
    return colors[status] || 'gray';
}

function getLogIcon(type) {
    const icons = {
        activity: 'running',
        achievement: 'trophy',
        mood: 'smile',
        note: 'sticky-note',
        photo: 'camera',
        video: 'video'
    };
    return icons[type] || 'file';
}

// Modal functions
function openModal(type) {
    alert(`${type} modal açılacak - geliştirme aşamasında`);
}

function openCodeGenerator() {
    const workspace = document.getElementById('ai-workspace');
    workspace.innerHTML = `
        <div class="space-y-4">
            <textarea id="code-prompt" class="w-full p-4 border rounded-lg" rows="4" placeholder="Ne tür bir kod oluşturmak istiyorsunuz?"></textarea>
            <div class="flex space-x-4">
                <select id="code-language" class="px-4 py-2 border rounded-lg">
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="php">PHP</option>
                    <option value="java">Java</option>
                </select>
                <button onclick="generateCode()" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    <i class="fas fa-magic mr-2"></i> Kod Oluştur
                </button>
            </div>
            <div id="code-output" class="hidden">
                <pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto"><code id="generated-code"></code></pre>
            </div>
        </div>
    `;
}

async function generateCode() {
    const prompt = document.getElementById('code-prompt').value;
    const language = document.getElementById('code-language').value;

    if (!prompt) {
        alert('Lütfen bir açıklama girin');
        return;
    }

    try {
        const response = await axios.post(`${API_BASE}/ai/claude/generate-code`, {
            prompt,
            language
        }, { withCredentials: true });

        document.getElementById('code-output').classList.remove('hidden');
        document.getElementById('generated-code').textContent = response.data.code;
    } catch (error) {
        alert('Kod oluşturulurken bir hata oluştu');
        console.error(error);
    }
}

async function syncNotion() {
    if (!confirm('Tüm verileriniz Notion\'a senkronize edilecek. Devam etmek istiyor musunuz?')) {
        return;
    }

    try {
        await axios.post(`${API_BASE}/sync/notion/all`, {}, { withCredentials: true });
        alert('Notion senkronizasyonu başarıyla tamamlandı!');
    } catch (error) {
        alert('Senkronizasyon sırasında bir hata oluştu');
        console.error(error);
    }
}

// Stub functions for other features
function loadLifeLogs() {
    document.getElementById('content-area').innerHTML = '<div class="glass p-6"><h2 class="text-3xl font-bold gradient-text">Hayat Kayıtları</h2><p class="text-gray-600 mt-2">Geliştirme aşamasında...</p></div>';
}

function loadRoutines() {
    document.getElementById('content-area').innerHTML = '<div class="glass p-6"><h2 class="text-3xl font-bold gradient-text">Rutinler</h2><p class="text-gray-600 mt-2">Geliştirme aşamasında...</p></div>';
}

function loadAutomation() {
    document.getElementById('content-area').innerHTML = '<div class="glass p-6"><h2 class="text-3xl font-bold gradient-text">Otomasyon</h2><p class="text-gray-600 mt-2">Geliştirme aşamasında...</p></div>';
}

function openCodeAnalyzer() {
    alert('Kod analizi - geliştirme aşamasında');
}

function openChat() {
    alert('AI Sohbet - geliştirme aşamasında');
}

function viewApp(id) {
    alert(`Uygulama görüntüleme: ${id} - geliştirme aşamasında`);
}

function editApp(id) {
    alert(`Uygulama düzenleme: ${id} - geliştirme aşamasında`);
}

// Pushbullet Page
function loadPushbullet() {
    const content = `
        <div class="space-y-6">
            <div class="glass p-6 flex items-center justify-between">
                <div>
                    <h2 class="text-3xl font-bold gradient-text">Pushbullet File Transfer</h2>
                    <p class="text-gray-600">Dosyalarınızı telefonunuza gönderin</p>
                </div>
                <button onclick="refreshDevices()" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    <i class="fas fa-sync mr-2"></i> Cihazları Yenile
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="glass p-6">
                    <h3 class="text-xl font-bold mb-4">Dosya Gönder</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold mb-2">Cihaz Seç</label>
                            <select id="device-select" class="w-full px-4 py-2 border rounded-lg">
                                <option value="">Tüm Cihazlar</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold mb-2">Dosya Seç</label>
                            <input type="file" id="file-input" class="w-full px-4 py-2 border rounded-lg" />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold mb-2">Başlık (İsteğe Bağlı)</label>
                            <input type="text" id="file-title" placeholder="Dosya başlığı" class="w-full px-4 py-2 border rounded-lg" />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold mb-2">Açıklama (İsteğe Bağlı)</label>
                            <textarea id="file-body" placeholder="Dosya açıklaması" rows="2" class="w-full px-4 py-2 border rounded-lg"></textarea>
                        </div>

                        <button onclick="sendFile()" class="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                            <i class="fas fa-paper-plane mr-2"></i> Dosya Gönder
                        </button>
                    </div>
                </div>

                <div class="glass p-6">
                    <h3 class="text-xl font-bold mb-4">Hızlı Gönder</h3>
                    <div class="space-y-3">
                        <button onclick="sendOrkestraApp('apk')" class="w-full p-4 bg-green-100 hover:bg-green-200 rounded-lg transition text-left">
                            <i class="fas fa-mobile-alt text-2xl text-green-600 mb-2"></i>
                            <p class="font-semibold">Orkestra Android APK</p>
                            <p class="text-sm text-gray-600">Android uygulamasını telefonunuza gönderin</p>
                        </button>

                        <button onclick="sendNote()" class="w-full p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition text-left">
                            <i class="fas fa-sticky-note text-2xl text-blue-600 mb-2"></i>
                            <p class="font-semibold">Not Gönder</p>
                            <p class="text-sm text-gray-600">Hızlı not gönderin</p>
                        </button>

                        <button onclick="sendLink()" class="w-full p-4 bg-orange-100 hover:bg-orange-200 rounded-lg transition text-left">
                            <i class="fas fa-link text-2xl text-orange-600 mb-2"></i>
                            <p class="font-semibold">Link Gönder</p>
                            <p class="text-sm text-gray-600">Orkestra linkini paylaşın</p>
                        </button>
                    </div>
                </div>
            </div>

            <div class="glass p-6">
                <h3 class="text-xl font-bold mb-4">Bağlı Cihazlar</h3>
                <div id="devices-list" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <p class="text-gray-500">Yükleniyor...</p>
                </div>
            </div>

            <div class="glass p-6">
                <h3 class="text-xl font-bold mb-4">Son Gönderiler</h3>
                <div id="pushes-list" class="space-y-2">
                    <p class="text-gray-500">Yükleniyor...</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('content-area').innerHTML = content;
    loadPushbulletData();
}

async function loadPushbulletData() {
    await Promise.all([
        loadDevices(),
        loadPushes()
    ]);
}

async function loadDevices() {
    try {
        const response = await axios.get(`${API_BASE}/pushbullet/devices`);
        const devices = response.data.devices || [];

        const select = document.getElementById('device-select');
        devices.forEach(device => {
            if (device.active) {
                const option = document.createElement('option');
                option.value = device.iden;
                option.textContent = `${device.nickname || device.model || 'Unknown Device'}`;
                select.appendChild(option);
            }
        });

        const devicesHtml = devices.filter(d => d.active).map(device => `
            <div class="p-4 bg-gray-50 rounded-lg">
                <i class="fas fa-${device.type === 'android' ? 'mobile-alt' : device.type === 'ios' ? 'mobile' : 'desktop'} text-3xl text-purple-500 mb-2"></i>
                <p class="font-semibold">${device.nickname || device.model || 'Unknown'}</p>
                <p class="text-xs text-gray-500">${device.manufacturer || ''}</p>
            </div>
        `).join('');

        document.getElementById('devices-list').innerHTML = devicesHtml || '<p class="text-gray-500">Cihaz bulunamadı</p>';
    } catch (error) {
        console.error('Load devices error:', error);
        document.getElementById('devices-list').innerHTML = '<p class="text-red-500">Cihazlar yüklenemedi</p>';
    }
}

async function loadPushes() {
    try {
        const response = await axios.get(`${API_BASE}/pushbullet/pushes?limit=5`);
        const pushes = response.data.pushes || [];

        const pushesHtml = pushes.map(push => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-${push.type === 'file' ? 'file' : push.type === 'link' ? 'link' : 'sticky-note'} text-purple-500"></i>
                    <div>
                        <p class="font-semibold">${push.title || 'No title'}</p>
                        <p class="text-xs text-gray-600">${new Date(push.created * 1000).toLocaleString('tr-TR')}</p>
                    </div>
                </div>
                <button onclick="deletePush('${push.iden}')" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        document.getElementById('pushes-list').innerHTML = pushesHtml || '<p class="text-gray-500">Henüz gönderim yok</p>';
    } catch (error) {
        console.error('Load pushes error:', error);
    }
}

async function sendFile() {
    const fileInput = document.getElementById('file-input');
    const deviceSelect = document.getElementById('device-select');
    const title = document.getElementById('file-title').value;
    const body = document.getElementById('file-body').value;

    if (!fileInput.files || !fileInput.files[0]) {
        alert('Lütfen bir dosya seçin');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('title', title);
    formData.append('body', body);
    if (deviceSelect.value) {
        formData.append('device_iden', deviceSelect.value);
    }

    try {
        const response = await axios.post(`${API_BASE}/pushbullet/file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        alert('Dosya başarıyla gönderildi!');
        fileInput.value = '';
        document.getElementById('file-title').value = '';
        document.getElementById('file-body').value = '';
        loadPushes();
    } catch (error) {
        alert('Dosya gönderilirken hata oluştu: ' + error.message);
    }
}

async function sendOrkestraApp(type = 'apk') {
    const deviceSelect = document.getElementById('device-select');

    if (confirm('Orkestra uygulamasını telefonunuza göndermek istiyor musunuz?')) {
        try {
            const response = await axios.post(`${API_BASE}/pushbullet/send-app`, {
                device_iden: deviceSelect.value || null,
                file_type: type
            });

            alert('Uygulama başarıyla gönderildi! Telefonunuzda Pushbullet bildirimini kontrol edin.');
            loadPushes();
        } catch (error) {
            alert('Uygulama gönderilirken hata oluştu: ' + error.message);
        }
    }
}

async function sendNote() {
    const title = prompt('Not başlığı:');
    if (!title) return;

    const body = prompt('Not içeriği:');
    if (!body) return;

    const deviceSelect = document.getElementById('device-select');

    try {
        await axios.post(`${API_BASE}/pushbullet/note`, {
            title,
            body,
            device_iden: deviceSelect.value || null
        });

        alert('Not başarıyla gönderildi!');
        loadPushes();
    } catch (error) {
        alert('Not gönderilirken hata oluştu: ' + error.message);
    }
}

async function sendLink() {
    const deviceSelect = document.getElementById('device-select');

    try {
        await axios.post(`${API_BASE}/pushbullet/link`, {
            title: 'Orkestra - Hayat Yönetim Sistemi',
            url: 'http://orkestra.bitebimuv.org',
            body: 'Orkestra uygulamasını keşfedin!',
            device_iden: deviceSelect.value || null
        });

        alert('Link başarıyla gönderildi!');
        loadPushes();
    } catch (error) {
        alert('Link gönderilirken hata oluştu: ' + error.message);
    }
}

async function deletePush(iden) {
    if (confirm('Bu gönderiyi silmek istediğinizden emin misiniz?')) {
        try {
            await axios.delete(`${API_BASE}/pushbullet/pushes/${iden}`);
            loadPushes();
        } catch (error) {
            alert('Silme işlemi başarısız: ' + error.message);
        }
    }
}

async function refreshDevices() {
    await loadDevices();
    alert('Cihazlar yenilendi!');
}
