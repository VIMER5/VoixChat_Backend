# VoixChat

**VoixChat** — этот проект является MVP мессенджера.

> [!IMPORTANT]
> **ПРОЕКТ ЗАКРЫТ.**
> Данный репозиторий представляет собой завершенный дипломный проект. Дальнейшая разработка и обновления не планируются. Код предоставляется "как есть" в качестве портфолио.

## Описание архитектуры

Проект построен с использованием современной компонентной архитектуры:

- **Frontend**: Vue 3 (Composition API), Vite, Pinia для управления состоянием, Tailwind CSS v4 для стилизации. Адаптивный дизайн (Mobile-First / Desktop-Fluid).
- **Backend**: Node.js, Express, Sequelize (MySQL), Redis (Caching/PubSub).
- **Связь**: Socket.io для мгновенного обмена сообщениями и LiveKit SDK (SFU) для высококачественных голосовых и видеоконференций.
- **Инфраструктура**: Docker-контейнеризация для всех сервисов, отдельный CDN-сервер для загрузки медиафайлов.

## Скриншоты интерфейса

### Десктопная версия

![Десктоп: Главный экран](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/d1.jpg?raw=true)
![Десктоп: Система друзей](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/d2.jpg?raw=true)
![Десктоп: Модальное окно добавление в друзья](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/d3.jpg?raw=true)
![Десктоп: Модальное окно настроек пользователя](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/d4.jpg?raw=true)
![Десктоп: Модальное окно создание группового чата](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/d5.jpg?raw=true)
![Десктоп: Чат](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/d6.jpg?raw=true)
![Десктоп: Входящий вызов](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/d7.jpg?raw=true)
![Десктоп: Голосовой чат](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/d8.jpg?raw=true)
![Десктоп: Демки](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/d9.jpg?raw=true)

### Мобильная версия

![Мобильный: Главный экран](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/m1.jpg?raw=true)
![Мобильный: Система друзей](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/m2.jpg?raw=true)
![Мобильный: Модальное окно добавление в друзья](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/m3.jpg?raw=true)
![Мобильный: Модальное окно настроек пользователя](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/m4.jpg?raw=true)
![Мобильный: Модальное окно создание группового чата](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/m5.jpg?raw=true)
![Мобильный: Чат](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/m6.jpg?raw=true)
![Мобильный: Входящий вызов](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/m7.jpg?raw=true)
![Мобильный: Голосовой чат](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/m8.jpg?raw=true)
![Мобильный: Демки](https://github.com/VIMER5/VIMER5/blob/main/assets/icons/voixImg/m9.jpg?raw=true)

## Ключевые возможности, реализованные в рамках диплома:

- Регистрация, авторизация и JWT токены с механизмом refresh-токенов.
- Мгновенный текстовый чат с поддержкой сохранения истории в БД.
- Голосовые комнаты (LiveKit WebRTC) с функцией подавления эха.
- Видеозвонки и демонстрация экрана.
- Система друзей (отправка, принятие, отклонение заявок через уникальный ID `User#ID`).
- Собственная CDN сеть для аватарков и вложений.
- Адаптивный пользовательский интерфейс, который плавно перестраивается в зависимости от размера экрана.

## Лицензия

Этот проект распространяется под лицензией [MIT](LICENSE).
Код открыт и предоставляется «как есть» исключительно в демонстрационных целях и для портфолио.
