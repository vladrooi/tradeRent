// Основные города Беларуси
const belarusCities = ["Минск", "Гродно", "Витебск", "Брест", "Могилёв", "Гомель"];

// Инициализация базы данных
function initializeDatabase() {
    if (!localStorage.getItem('users')) {
        const initialUsers = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                name: 'Администратор Системы',
                email: 'admin@traderent.by',
                phone: '+375 (29) 123-45-67',
                rating: 5.0,
                registrationDate: new Date().toISOString()
            },
            {
                id: 2,
                username: 'landlord',
                password: 'landlord123',
                role: 'landlord',
                name: 'Анна Иванова',
                email: 'anna@example.com',
                phone: '+375 (33) 765-43-21',
                rating: 4.7,
                registrationDate: new Date().toISOString()
            },
            {
                id: 3,
                username: 'user',
                password: 'user123',
                role: 'user',
                name: 'Петр Сидоров',
                email: 'petr@example.com',
                phone: '+375 (44) 123-45-67',
                rating: 4.9,
                registrationDate: new Date().toISOString()
            },
            {
                id: 4,
                username: 'business',
                password: 'business123',
                role: 'landlord',
                name: 'Мария Козлова',
                email: 'maria@example.com',
                phone: '+375 (25) 555-55-55',
                rating: 4.8,
                registrationDate: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }

    if (!localStorage.getItem('properties')) {
        const initialData = [
            {
                id: 1,
                title: "Торговая площадь в центре Минска",
                description: "Просторная торговая площадь в самом центре города с высоким пешеходным трафиком. Идеально подходит для магазина одежды, обуви или аксессуаров. Помещение с современным ремонтом, системами кондиционирования и видеонаблюдения. Отдельный вход, большие витринные окна.",
                area: 150,
                price: 2500,
                address: "ул. Немига, 5",
                city: "Минск",
                ownerId: 2,
                ownerName: "Анна Иванова",
                images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop"],
                features: ["Кондиционер", "Охранная сигнализация", "Высокие потолки", "Витринные окна", "Ремонт", "Санузел"],
                status: "approved",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: "Торговый павильон в Гродно",
                description: "Современный торговый павильон в центре Гродно. Отличное расположение рядом с пешеходной зоной. Подходит для продажи сувениров, косметики или ювелирных изделий. Полностью оборудованное помещение готово к работе.",
                area: 45,
                price: 1200,
                address: "ул. Советская, 15",
                city: "Гродно",
                ownerId: 2,
                ownerName: "Анна Иванова",
                images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"],
                features: ["Центральное отопление", "Интернет", "Система безопасности", "Мебель", "Световая вывеска"],
                status: "approved",
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                title: "Помещение под магазин в Витебске",
                description: "Светлое просторное помещение на первом этаже жилого дома. Отдельный вход, большие витринные окна. Идеально для продуктового магазина или аптеки. Хорошая транспортная доступность.",
                area: 85,
                price: 1800,
                address: "пр-т Московский, 25",
                city: "Витебск",
                ownerId: 2,
                ownerName: "Анна Иванова",
                images: ["https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&h=400&fit=crop"],
                features: ["Отдельный вход", "Парковка", "Складское помещение", "Подведенные коммуникации"],
                status: "approved",
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                title: "ТЦ 'Европа' - этаж 2",
                description: "Премиальное помещение в торговом центре 'Европа'. Высокий трафик, современный дизайн. Подходит для брендовой одежды, электроники или ювелирных изделий.",
                area: 120,
                price: 3500,
                address: "ТЦ 'Европа', 2 этаж",
                city: "Минск",
                ownerId: 4,
                ownerName: "Мария Козлова",
                images: ["https://images.unsplash.com/photo-1600585154340-ffff5c5b4d38?w=600&h=400&fit=crop"],
                features: ["ТЦ", "Кондиционер", "Охранная система", "Уборка", "Реклама"],
                status: "approved",
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                title: "Павильон у метро",
                description: "Торговый павильон у станции метро с высоким пассажиропотоком. Отличная видимость, отдельный вход. Идеально для кофе-поинта, фастфуда или цветов.",
                area: 30,
                price: 900,
                address: "ст. м. Пушкинская",
                city: "Минск",
                ownerId: 4,
                ownerName: "Мария Козлова",
                images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"],
                features: ["Метро", "Высокий трафик", "Коммуникации", "Готовый бизнес"],
                status: "approved",
                createdAt: new Date().toISOString()
            },
            {
                id: 6,
                title: "Помещение в Брестской крепости",
                description: "Уникальное помещение в историческом центре Бреста рядом с крепостью. Высокий туристический трафик. Подходит для сувениров, кафе или музея.",
                area: 65,
                price: 1500,
                address: "ул. Гоголя, 12",
                city: "Брест",
                ownerId: 4,
                ownerName: "Мария Козлова",
                images: ["https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600&h=400&fit=crop"],
                features: ["Туристическое место", "Историческое здание", "Пешеходная зона", "Реконструкция"],
                status: "approved",
                createdAt: new Date().toISOString()
            },
            {
                id: 7,
                title: "Новое помещение в Могилёве",
                description: "Современное помещение в новом жилом комплексе. Подходит для продуктового магазина, аптеки или химчистки. Большая жилая аудитория.",
                area: 95,
                price: 1600,
                address: "пр-т Мира, 45",
                city: "Могилёв",
                ownerId: 2,
                ownerName: "Анна Иванова",
                images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop"],
                features: ["Новостройка", "Жилой район", "Парковка", "Лифт"],
                status: "pending",
                createdAt: new Date().toISOString()
            },
            {
                id: 8,
                title: "Торговый комплекс в Гомеле",
                description: "Помещение в крупном торговом комплексе. Стабильный трафик, хорошая инфраструктура. Подходит для различных видов retail-бизнеса.",
                area: 200,
                price: 4200,
                address: "ТК 'Спутник'",
                city: "Гомель",
                ownerId: 4,
                ownerName: "Мария Козлова",
                images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"],
                features: ["Торговый комплекс", "Кондиционер", "Эскалатор", "Охрана", "Уборка"],
                status: "approved",
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('properties', JSON.stringify(initialData));
    }

    if (!localStorage.getItem('reviews')) {
        const initialReviews = [
            {
                id: 1,
                authorId: 3,
                authorName: "Петр Сидоров",
                targetUserId: 2,
                rating: 5,
                comment: "Отличный арендодатель! Все условия соблюдаются, быстро решаются вопросы. Площадка соответствует описанию. Рекомендую!",
                createdAt: new Date('2024-01-15').toISOString()
            },
            {
                id: 2,
                authorId: 1,
                authorName: "Администратор Системы",
                targetUserId: 2,
                rating: 4,
                comment: "Ответственный партнер, площадки всегда в отличном состоянии. Рекомендую к сотрудничеству.",
                createdAt: new Date('2024-01-10').toISOString()
            },
            {
                id: 3,
                authorId: 3,
                authorName: "Петр Сидоров",
                targetUserId: 4,
                rating: 5,
                comment: "Прекрасные помещения в хороших локациях. Все четко по договору, без surprises. Спасибо!",
                createdAt: new Date('2024-01-20').toISOString()
            }
        ];
        localStorage.setItem('reviews', JSON.stringify(initialReviews));
    }
}

// Остальные функции database.js остаются без изменений...
// (getAllUsers, findUser, registerUser, и т.д.)
