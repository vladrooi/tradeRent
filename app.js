// Основное приложение
class TradeSpaceApp {
    constructor() {
        this.state = {
            currentUser: db.currentUser,
            currentFilter: 'all',
            currentCity: '',
            currentSort: 'newest',
            currentPage: 1,
            itemsPerPage: 8,
            favorites: new Set(),
            notifications: [],
            searchQuery: '',
            activeModal: null,
            isLoading: false
        };

        this.init();
    }

    // Инициализация приложения
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.updateUI();
        this.loadProperties();
        this.animateStats();
        this.setupSmoothScrolling();
    }

    // Кэширование элементов
    cacheElements() {
        this.elements = {
            // Кнопка поддержки
            supportFab: document.getElementById('supportFab'),
            supportPopup: document.getElementById('supportPopup'),
            closeSupport: document.querySelector('.close-popup'),

            // Навигация
            authBtn: document.getElementById('authBtn'),
            authText: document.getElementById('authText'),
            addListingBtn: document.getElementById('addListingBtn'),
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),

            // Поиск
            searchBtn: document.getElementById('searchBtn'),
            searchInput: document.getElementById('searchInput'),
            citySelect: document.getElementById('citySelect'),
            propertyType: document.getElementById('propertyType'),
            areaSelect: document.getElementById('areaSelect'),
            priceSelect: document.getElementById('priceSelect'),

            // Каталог
            propertiesGrid: document.getElementById('propertiesGrid'),
            catalogSort: document.getElementById('catalogSort'),
            filterTags: document.getElementById('filterTags'),
            advancedFilterBtn: document.getElementById('advancedFilterBtn'),
            pagination: document.getElementById('pagination'),

            // Категории
            categoryTags: document.querySelectorAll('.category-tag'),

            // Города
            cityCards: document.querySelectorAll('.city-card'),
            cityItems: document.querySelectorAll('.city-item'),

            // Модальные окна
            modals: document.querySelectorAll('.modal'),
            modalOverlay: document.getElementById('modalOverlay'),
            modalCloseBtns: document.querySelectorAll('.modal-close'),

            // Формы
            loginForm: document.getElementById('loginForm'),
            registerForm: document.getElementById('registerForm'),
            addListingForm: document.getElementById('addListingForm'),

            // Вкладки
            authTabs: document.querySelectorAll('.auth-tab'),
            profileTabs: document.querySelectorAll('.profile-tab'),
            adminTabs: document.querySelectorAll('.admin-tab')
        };
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Кнопка поддержки
        this.elements.supportFab.addEventListener('click', () => {
            this.toggleSupportPopup();
        });

        this.elements.closeSupport.addEventListener('click', () => {
            this.hideSupportPopup();
        });

        // Поиск
        this.elements.searchBtn.addEventListener('click', () => {
            this.handleSearch();
        });

        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Фильтры
        this.elements.citySelect.addEventListener('change', () => {
            this.updateFilters();
        });

        this.elements.propertyType.addEventListener('change', () => {
            this.updateFilters();
        });

        this.elements.catalogSort.addEventListener('change', () => {
            this.state.currentSort = this.elements.catalogSort.value;
            this.loadProperties();
        });

        // Категории
        this.elements.categoryTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                const type = tag.dataset.type;
                this.filterByType(type);
            });
        });

        // Города
        this.elements.cityCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn')) {
                    const city = card.dataset.city;
                    this.filterByCity(city);
                }
            });
        });

        this.elements.cityItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const city = item.dataset.city;
                this.filterByCity(city);
            });
        });

        // Кнопка добавления объявления
        this.elements.addListingBtn.addEventListener('click', () => {
            if (!this.state.currentUser) {
                this.showAuthModal();
                this.showNotification('Для добавления объявления необходимо авторизоваться', 'warning');
                return;
            }
            this.showAddListingModal();
        });

        // Кнопка авторизации
        this.elements.authBtn.addEventListener('click', () => {
            if (this.state.currentUser) {
                this.showProfileModal();
            } else {
                this.showAuthModal();
            }
        });

        // Мобильное меню
        this.elements.mobileMenuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Модальные окна
        this.elements.modalOverlay.addEventListener('click', () => {
            this.hideModal();
        });

        this.elements.modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModal();
            });
        });

        // Форма входа
        if (this.elements.loginForm) {
            this.elements.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Форма регистрации
        if (this.elements.registerForm) {
            this.elements.registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Форма добавления объявления
        if (this.elements.addListingForm) {
            this.setupListingForm();
        }

        // Вкладки авторизации
        this.elements.authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                this.switchAuthTab(tabId);
            });
        });

        // Клик вне всплывающего окна поддержки
        document.addEventListener('click', (e) => {
            if (!this.elements.supportPopup.contains(e.target) && 
                !this.elements.supportFab.contains(e.target)) {
                this.hideSupportPopup();
            }
        });

        // Обработка шагов формы
        document.querySelectorAll('[data-next]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const nextStep = e.target.dataset.next;
                this.goToFormStep(nextStep);
            });
        });

        document.querySelectorAll('[data-prev]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prevStep = e.target.dataset.prev;
                this.goToFormStep(prevStep);
            });
        });

        // Показать/скрыть пароль
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = e.target.closest('.password-input').querySelector('input');
                const icon = e.target.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    // Настройка Intersection Observer для анимаций
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        // Наблюдаем за карточками
        document.querySelectorAll('.property-card, .city-card, .service-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Настройка плавной прокрутки
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Обработка поиска
    handleSearch() {
        const query = this.elements.searchInput.value.trim();
        const city = this.elements.citySelect.value;
        const type = this.elements.propertyType.value;
        const area = this.elements.areaSelect.value;
        const price = this.elements.priceSelect.value;

        if (!this.state.currentUser && (query || city || type || area || price)) {
            this.showAuthModal();
            this.showNotification('Для поиска необходимо авторизоваться', 'warning');
            return;
        }

        this.state.searchQuery = query;
        this.state.currentCity = city;
        this.state.currentFilter = type || 'all';
        this.state.currentPage = 1;

        // Обновляем фильтры
        this.updateFilterTags();

        // Загружаем свойства
        this.loadProperties();

        // Прокручиваем к каталогу
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    }

    // Обновление фильтров
    updateFilters() {
        this.state.currentPage = 1;
        this.loadProperties();
    }

    // Фильтрация по типу
    filterByType(type) {
        this.state.currentFilter = type;
        this.state.currentPage = 1;
        this.elements.propertyType.value = type;
        this.loadProperties();
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    }

    // Фильтрация по городу
    filterByCity(city) {
        this.state.currentCity = city;
        this.state.currentPage = 1;
        this.elements.citySelect.value = city;
        this.loadProperties();
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    }

    // Обновление тегов фильтров
    updateFilterTags() {
        const tags = [];
        
        if (this.state.currentCity) {
            const cityName = db.getCityName(this.state.currentCity);
            tags.push(`Город: ${cityName}`);
        }
        
        if (this.state.currentFilter && this.state.currentFilter !== 'all') {
            const typeName = db.getPropertyTypeName(this.state.currentFilter);
            tags.push(`Тип: ${typeName}`);
        }
        
        if (this.elements.areaSelect.value) {
            const area = this.elements.areaSelect.options[this.elements.areaSelect.selectedIndex].text;
            tags.push(`Площадь: ${area}`);
        }
        
        if (this.elements.priceSelect.value) {
            const price = this.elements.priceSelect.options[this.elements.priceSelect.selectedIndex].text;
            tags.push(`Цена: ${price}`);
        }
        
        if (this.state.searchQuery) {
            tags.push(`Поиск: "${this.state.searchQuery}"`);
        }
        
        this.elements.filterTags.innerHTML = tags.map(tag => `
            <div class="filter-tag">
                <span>${tag}</span>
                <span class="remove">&times;</span>
            </div>
        `).join('');
        
        // Обработчики для удаления тегов
        this.elements.filterTags.querySelectorAll('.remove').forEach((removeBtn, index) => {
            removeBtn.addEventListener('click', () => {
                this.removeFilterTag(index, tags[index]);
            });
        });
    }

    // Удаление тега фильтра
    removeFilterTag(index, tagText) {
        if (tagText.startsWith('Город:')) {
            this.state.currentCity = '';
            this.elements.citySelect.value = '';
        } else if (tagText.startsWith('Тип:')) {
            this.state.currentFilter = 'all';
            this.elements.propertyType.value = '';
        } else if (tagText.startsWith('Площадь:')) {
            this.elements.areaSelect.value = '';
        } else if (tagText.startsWith('Цена:')) {
            this.elements.priceSelect.value = '';
        } else if (tagText.startsWith('Поиск:')) {
            this.state.searchQuery = '';
            this.elements.searchInput.value = '';
        }
        
        this.state.currentPage = 1;
        this.loadProperties();
    }

    // Загрузка и отображение свойств
    loadProperties() {
        this.setLoading(true);
        
        // Имитация загрузки
        setTimeout(() => {
            let properties = db.getAvailableProperties();
            
            // Применяем фильтры
            if (this.state.currentCity) {
                properties = properties.filter(p => p.city === this.state.currentCity);
            }
            
            if (this.state.currentFilter && this.state.currentFilter !== 'all') {
                properties = properties.filter(p => p.type === this.state.currentFilter);
            }
            
            if (this.state.searchQuery) {
                const query = this.state.searchQuery.toLowerCase();
                properties = properties.filter(p => 
                    p.title.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query) ||
                    p.address.toLowerCase().includes(query)
                );
            }
            
            // Сортируем
            properties = db.sortProperties(properties, this.state.currentSort);
            
            // Отображаем
            this.displayProperties(properties);
            this.updatePagination(properties.length);
            this.updateFilterTags();
            this.setLoading(false);
        }, 500);
    }

    // Отображение свойств
    displayProperties(properties) {
        const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const end = start + this.state.itemsPerPage;
        const pageProperties = properties.slice(start, end);
        
        if (pageProperties.length === 0) {
            this.elements.propertiesGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px;">
                    <i class="fas fa-search" style="font-size: 60px; color: var(--primary); margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 15px;">Объекты не найдены</h3>
                    <p style="color: var(--gray-600); margin-bottom: 20px;">Попробуйте изменить параметры поиска</p>
                    <button class="btn btn-outline" id="clearAllFilters">
                        <i class="fas fa-times"></i> Сбросить все фильтры
                    </button>
                </div>
            `;
            
            document.getElementById('clearAllFilters')?.addEventListener('click', () => {
                this.clearAllFilters();
            });
            
            return;
        }
        
        this.elements.propertiesGrid.innerHTML = pageProperties.map(property => {
            const isFavorite = db.isFavorite(property.id);
            const cityName = db.getCityName(property.city);
            const typeName = db.getPropertyTypeName(property.type);
            
            return `
                <div class="property-card" data-id="${property.id}">
                    <div class="property-image">
                        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="${property.title}">
                        <div class="property-badge">${cityName}</div>
                        <div class="property-favorite ${isFavorite ? 'active' : ''}" data-id="${property.id}">
                            <i class="fas fa-heart"></i>
                        </div>
                    </div>
                    <div class="property-content">
                        <span class="property-category">${typeName}</span>
                        <h3 class="property-title">${property.title}</h3>
                        <div class="property-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${property.address}</span>
                        </div>
                        <div class="property-features">
                            <div class="property-feature">
                                <i class="fas fa-ruler-combined"></i>
                                <span>${property.area} м²</span>
                            </div>
                            <div class="property-feature">
                                <i class="fas fa-eye"></i>
                                <span>${property.views}</span>
                            </div>
                        </div>
                        <div class="property-price">
                            ${property.price.toLocaleString()} BYN <span>/ месяц</span>
                        </div>
                        <div class="property-actions">
                            <button class="btn btn-outline details-btn" data-id="${property.id}">
                                <i class="fas fa-info-circle"></i> Подробнее
                            </button>
                            <button class="btn btn-primary contact-btn" data-id="${property.id}">
                                <i class="fas fa-phone"></i> Контакты
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Настройка обработчиков
        this.setupPropertyCardListeners();
    }

    // Настройка обработчиков для карточек свойств
    setupPropertyCardListeners() {
        // Кнопка "Подробнее"
        document.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const propertyId = parseInt(btn.dataset.id);
                this.showPropertyDetails(propertyId);
            });
        });
        
        // Кнопка "Контакты"
        document.querySelectorAll('.contact-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const propertyId = parseInt(btn.dataset.id);
                this.showContactModal(propertyId);
            });
        });
        
        // Кнопка избранного
        document.querySelectorAll('.property-favorite').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const propertyId = parseInt(btn.dataset.id);
                
                if (!this.state.currentUser) {
                    this.showAuthModal();
                    this.showNotification('Для добавления в избранное необходимо авторизоваться', 'warning');
                    return;
                }
                
                const success = db.toggleFavorite(propertyId);
                if (success) {
                    btn.classList.toggle('active');
                    const isFavorite = btn.classList.contains('active');
                    const message = isFavorite ? 'Добавлено в избранное' : 'Удалено из избранного';
                    this.showNotification(message, 'success');
                }
            });
        });
        
        // Клик по карточке
        document.querySelectorAll('.property-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.property-favorite') && 
                    !e.target.closest('.details-btn') && 
                    !e.target.closest('.contact-btn')) {
                    const propertyId = parseInt(card.dataset.id);
                    this.showPropertyDetails(propertyId);
                }
            });
        });
    }

    // Обновление пагинации
    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.state.itemsPerPage);
        
        if (totalPages <= 1) {
            this.elements.pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Кнопка "Назад"
        if (this.state.currentPage > 1) {
            paginationHTML += `
                <button class="page-btn prev-btn">
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;
        }
        
        // Номера страниц
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || 
                (i >= this.state.currentPage - 1 && i <= this.state.currentPage + 1)) {
                paginationHTML += `
                    <button class="page-number ${i === this.state.currentPage ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </button>
                `;
            } else if (i === this.state.currentPage - 2 || i === this.state.currentPage + 2) {
                paginationHTML += `<span class="page-dots">...</span>`;
            }
        }
        
        // Кнопка "Вперед"
        if (this.state.currentPage < totalPages) {
            paginationHTML += `
                <button class="page-btn next-btn">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }
        
        this.elements.pagination.innerHTML = paginationHTML;
        
        // Обработчики пагинации
        this.elements.pagination.querySelector('.prev-btn')?.addEventListener('click', () => {
            this.state.currentPage--;
            this.loadProperties();
        });
        
        this.elements.pagination.querySelector('.next-btn')?.addEventListener('click', () => {
            this.state.currentPage++;
            this.loadProperties();
        });
        
        this.elements.pagination.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', () => {
                this.state.currentPage = parseInt(btn.dataset.page);
                this.loadProperties();
            });
        });
    }

    // Сброс всех фильтров
    clearAllFilters() {
        this.state.currentFilter = 'all';
        this.state.currentCity = '';
        this.state.searchQuery = '';
        this.state.currentPage = 1;
        
        this.elements.citySelect.value = '';
        this.elements.propertyType.value = '';
        this.elements.areaSelect.value = '';
        this.elements.priceSelect.value = '';
        this.elements.searchInput.value = '';
        
        this.loadProperties();
    }

    // Показать детали объекта
    showPropertyDetails(propertyId) {
        const property = db.getPropertyById(propertyId);
        if (!property) return;
        
        const cityName = db.getCityName(property.city);
        const typeName = db.getPropertyTypeName(property.type);
        const featuresHTML = property.features.map(feature => `<li>${feature}</li>`).join('');
        
        const detailsHTML = `
            <div class="property-details">
                <div class="property-gallery">
                    <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="${property.title}">
                </div>
                <div class="property-info">
                    <div class="property-header">
                        <div class="property-meta">
                            <span class="property-category">${typeName}</span>
                            <span class="property-city">${cityName}</span>
                        </div>
                        <h2>${property.title}</h2>
                        <div class="property-stats">
                            <span><i class="fas fa-eye"></i> ${property.views} просмотров</span>
                            <span><i class="fas fa-heart"></i> ${property.favorites} в избранном</span>
                            <span><i class="fas fa-calendar"></i> ${property.createdAt}</span>
                        </div>
                    </div>
                    
                    <div class="property-specs">
                        <div class="spec-row">
                            <div class="spec-item">
                                <i class="fas fa-ruler-combined"></i>
                                <div>
                                    <span>Площадь</span>
                                    <strong>${property.area} м²</strong>
                                </div>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-money-bill-wave"></i>
                                <div>
                                    <span>Цена аренды</span>
                                    <strong>${property.price.toLocaleString()} BYN/месяц</strong>
                                </div>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <span>Адрес</span>
                                    <strong>${property.address}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="property-description">
                        <h3>Описание</h3>
                        <p>${property.description}</p>
                    </div>
                    
                    <div class="property-features">
                        <h3>Особенности</h3>
                        <ul>${featuresHTML}</ul>
                    </div>
                    
                    <div class="property-contact">
                        <h3>Контактная информация</h3>
                        <div class="contact-details">
                            <div class="contact-item">
                                <i class="fas fa-user"></i>
                                <div>
                                    <span>Контактное лицо</span>
                                    <strong>${property.contact.name}</strong>
                                </div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <div>
                                    <span>Телефон</span>
                                    <strong>${property.contact.phone}</strong>
                                </div>
                            </div>
                            ${property.contact.email ? `
                                <div class="contact-item">
                                    <i class="fas fa-envelope"></i>
                                    <div>
                                        <span>Email</span>
                                        <strong>${property.contact.email}</strong>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="property-actions">
                        <button class="btn btn-primary btn-block" id="callOwner">
                            <i class="fas fa-phone"></i> Позвонить владельцу
                        </button>
                        <button class="btn btn-outline btn-block" id="saveProperty">
                            <i class="fas fa-heart"></i> Добавить в избранное
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('propertyDetails').innerHTML = detailsHTML;
        this.showModal('propertyModal');
        
        // Обработчики в модальном окне
        document.getElementById('callOwner')?.addEventListener('click', () => {
            window.open(`tel:${property.contact.phone.replace(/\D/g, '')}`);
        });
        
        document.getElementById('saveProperty')?.addEventListener('click', () => {
            if (!this.state.currentUser) {
                this.hideModal();
                this.showAuthModal();
                return;
            }
            
            const success = db.toggleFavorite(propertyId);
            if (success) {
                const isFavorite = db.isFavorite(propertyId);
                const message = isFavorite ? 'Добавлено в избранное' : 'Удалено из избранного';
                this.showNotification(message, 'success');
                
                // Обновляем кнопку
                const btn = document.getElementById('saveProperty');
                btn.innerHTML = isFavorite ? 
                    '<i class="fas fa-heart"></i> В избранном' :
                    '<i class="fas fa-heart"></i> Добавить в избранное';
            }
        });
    }

    // Показать контакты
    showContactModal(propertyId) {
        const property = db.getPropertyById(propertyId);
        if (!property) return;
        
        const contactHTML = `
            <div class="contact-modal">
                <h3><i class="fas fa-phone-alt"></i> Контактная информация</h3>
                <div class="contact-details">
                    <div class="contact-item">
                        <i class="fas fa-user-tie"></i>
                        <div>
                            <span>Контактное лицо</span>
                            <strong>${property.contact.name}</strong>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <span>Телефон</span>
                            <strong>${property.contact.phone}</strong>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <span>Адрес объекта</span>
                            <strong>${property.address}</strong>
                        </div>
                    </div>
                </div>
                <div class="contact-actions">
                    <button class="btn btn-primary" id="callOwnerBtn">
                        <i class="fas fa-phone"></i> Позвонить
                    </button>
                    <button class="btn btn-outline" id="copyPhoneBtn">
                        <i class="fas fa-copy"></i> Скопировать номер
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('propertyDetails').innerHTML = contactHTML;
        this.showModal('propertyModal');
        
        // Обработчики
        document.getElementById('callOwnerBtn')?.addEventListener('click', () => {
            window.open(`tel:${property.contact.phone.replace(/\D/g, '')}`);
        });
        
        document.getElementById('copyPhoneBtn')?.addEventListener('click', () => {
            navigator.clipboard.writeText(property.contact.phone)
                .then(() => this.showNotification('Номер скопирован в буфер обмена', 'success'))
                .catch(() => this.showNotification('Не удалось скопировать номер', 'error'));
        });
    }

    // Обработка входа
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            this.showNotification('Заполните все поля', 'error');
            return;
        }
        
        const result = db.login(email, password);
        
        if (result.success) {
            this.state.currentUser = result.user;
            this.updateUI();
            this.hideModal();
            this.showNotification('Вход выполнен успешно!', 'success');
        } else {
            this.showNotification(result.message, 'error');
        }
    }

    // Обработка регистрации
    async handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirm').value;
        const userType = document.getElementById('userType').value;
        
        // Валидация
        if (!name || !email || !phone || !password || !confirmPassword || !userType) {
            this.showNotification('Заполните все поля', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Пароли не совпадают', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showNotification('Пароль должен содержать минимум 6 символов', 'error');
            return;
        }
        
        // Регистрация
        const result = db.register({
            name,
            email,
            password,
            phone,
            userType
        });
        
        if (result.success) {
            this.state.currentUser = result.user;
            this.updateUI();
            this.hideModal();
            this.showNotification('Регистрация прошла успешно!', 'success');
        } else {
            this.showNotification(result.message, 'error');
        }
    }

    // Выход из системы
    logout() {
        db.logout();
        this.state.currentUser = null;
        this.updateUI();
        this.hideModal();
        this.showNotification('Вы успешно вышли из системы', 'success');
    }

    // Обновление интерфейса
    updateUI() {
        // Обновление текста кнопки авторизации
        if (this.state.currentUser) {
            this.elements.authText.textContent = this.state.currentUser.name.split(' ')[0];
        } else {
            this.elements.authText.textContent = 'Войти';
        }
        
        // Обновление избранного
        this.updateFavorites();
    }

    // Обновление избранного
    updateFavorites() {
        // Можно добавить отображение количества избранного
    }

    // Анимация статистики
    animateStats() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    counter.textContent = Math.floor(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    // Настройка формы добавления объявления
    setupListingForm() {
        const form = this.elements.addListingForm;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddListing();
        });
    }

    // Обработка добавления объявления
    async handleAddListing() {
        // Сбор данных из формы
        const formData = {
            title: document.getElementById('listingTitle').value,
            type: document.getElementById('listingType').value,
            city: document.getElementById('listingCity').value,
            address: document.getElementById('listingAddress').value,
            area: parseInt(document.getElementById('listingArea').value),
            price: parseInt(document.getElementById('listingPrice').value),
            description: document.getElementById('listingDescription').value,
            contact: {
                name: document.getElementById('listingContact').value,
                phone: document.getElementById('listingPhone').value,
                email: document.getElementById('listingEmail').value || ''
            },
            features: Array.from(document.querySelectorAll('input[name="features"]:checked')).map(cb => cb.value)
        };
        
        // Валидация
        if (!formData.title || !formData.type || !formData.city || !formData.address || 
            !formData.area || !formData.price || !formData.description || 
            !formData.contact.name || !formData.contact.phone) {
            this.showNotification('Заполните все обязательные поля', 'error');
            return;
        }
        
        // Добавление объявления
        const newProperty = db.addProperty(formData);
        
        this.hideModal();
        this.showNotification('Объявление успешно добавлено!', 'success');
        
        // Обновляем список
        this.loadProperties();
        
        // Сбрасываем форму
        this.elements.addListingForm.reset();
        this.goToFormStep(1);
    }

    // Переключение шагов формы
    goToFormStep(step) {
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    }

    // Переключение вкладок авторизации
    switchAuthTab(tabId) {
        // Скрыть все вкладки
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Убрать активный класс у всех кнопок
        this.elements.authTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Показать выбранную вкладку
        document.getElementById(`${tabId}Tab`).classList.add('active');
        document.querySelector(`.auth-tab[data-tab="${tabId}"]`).classList.add('active');
    }

    // Показать модальное окно авторизации
    showAuthModal() {
        this.showModal('authModal');
    }

    // Показать модальное окно профиля
    showProfileModal() {
        if (!this.state.currentUser) return;
        
        // Заполняем информацию профиля
        document.getElementById('profileName').textContent = this.state.currentUser.name;
        document.getElementById('profileEmail').textContent = this.state.currentUser.email;
        document.getElementById('profileType').textContent = 
            this.state.currentUser.role === 'admin' ? 'Администратор' :
            this.state.currentUser.role === 'landlord' ? 'Арендодатель' : 'Арендатор';
        
        // Показываем вкладку админа только для администраторов
        const adminTab = document.getElementById('adminTab');
        if (this.state.currentUser.role === 'admin') {
            adminTab.style.display = 'block';
        } else {
            adminTab.style.display = 'none';
        }
        
        this.showModal('profileModal');
    }

    // Показать модальное окно добавления объявления
    showAddListingModal() {
        this.showModal('addListingModal');
    }

    // Показать модальное окно
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        this.elements.modalOverlay.classList.add('active');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.state.activeModal = modalId;
    }

    // Скрыть модальное окно
    hideModal() {
        this.elements.modalOverlay.classList.remove('active');
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
        this.state.activeModal = null;
    }

    // Переключить всплывающее окно поддержки
    toggleSupportPopup() {
        this.elements.supportPopup.classList.toggle('active');
    }

    // Скрыть всплывающее окно поддержки
    hideSupportPopup() {
        this.elements.supportPopup.classList.remove('active');
    }

    // Переключить мобильное меню
    toggleMobileMenu() {
        document.querySelector('.nav-menu').classList.toggle('active');
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
        
        // Автоматическое удаление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Установить состояние загрузки
    setLoading(isLoading) {
        this.state.isLoading = isLoading;
        if (isLoading) {
            this.elements.propertiesGrid.innerHTML = `
                <div class="loading" style="grid-column: 1/-1; text-align: center; padding: 60px;">
                    <div class="spinner"></div>
                    <p>Загрузка объектов...</p>
                </div>
            `;
        }
    }
}

// Добавляем стили для уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        font-family: var(--font-secondary);
        font-weight: 500;
    }
`;
document.head.appendChild(notificationStyles);

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TradeSpaceApp();
});
