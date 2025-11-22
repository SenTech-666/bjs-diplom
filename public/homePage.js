'use strict';

/* ===== 1. Создаём все виджеты ===== */
const logoutButton     = new LogoutButton();
const ratesBoard       = new RatesBoard();
const moneyManager     = new MoneyManager();
const favoritesWidget  = new FavoritesWidget();

/* ===== 2. Функции обновления ===== */
const updateRates = () => {
    ApiConnector.getStocks(resp => {
        if (resp.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(resp.data);
        }
    });
};

const updateFavorites = () => {
    ApiConnector.getFavorites(resp => {
        if (resp.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(resp.data);
            moneyManager.updateUsersList(resp.data);
        }
    });
};

// Обновляем только курсы и избранное (профиль обновляем вручную из ответа!)
const refreshRatesAndFavorites = () => {
    updateRates();
    updateFavorites();
};

/* ===== 3. Выход ===== */
logoutButton.action = () => ApiConnector.logout(resp => resp.success && location.reload());

/* ===== 4. Первая загрузка ===== */
ApiConnector.current(resp => {
    if (resp.success) ProfileWidget.showProfile(resp.data);
});
updateRates();
updateFavorites();
setInterval(updateRates, 60000);

/* ===== 5. ДЕНЕЖНЫЕ ОПЕРАЦИИ — ГЛАВНОЕ ИСПРАВЛЕНИЕ! ===== */
const handleMoneyOperation = (response, successMessage) => {
    if (response.success) {
        // ВАЖНО: используем ДАННЫЕ ИЗ ОТВЕТА — они уже актуальные!
        ProfileWidget.showProfile(response.data);
        
        // Обновляем только курсы и избранное
        refreshRatesAndFavorites();
        
        moneyManager.setMessage(true, successMessage);
    } else {
        moneyManager.setMessage(false, response.error || 'Ошибка');
    }
};

// Пополнение
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, resp => 
        handleMoneyOperation(resp, 'Баланс успешно пополнен!')
    );
};

// Конвертация
moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, resp => 
        handleMoneyOperation(resp, 'Конвертация выполнена успешно!')
    );
};

// Перевод
moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, resp => 
        handleMoneyOperation(resp, 'Перевод выполнен успешно!')
    );
};

/* ===== 6. Избранное ===== */
favoritesWidget.addUserCallback = userData => {
    ApiConnector.addUserToFavorites(userData, resp => {
        if (resp.success) {
            refreshRatesAndFavorites();
            favoritesWidget.setMessage(true, 'Пользователь добавлен в избранное');
        } else {
            favoritesWidget.setMessage(false, resp.error);
        }
    });
};

favoritesWidget.removeUserCallback = userId => {
    ApiConnector.removeUserFromFavorites({ id: userId }, resp => {
        if (resp.success) {
            refreshRatesAndFavorites();
            favoritesWidget.setMessage(true, 'Пользователь удалён из избранного');
        } else {
            favoritesWidget.setMessage(false, resp.error);
        }
    });
};