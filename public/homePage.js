'use strict';

const logoutButton     = new LogoutButton();
const ratesBoard       = new RatesBoard();
const moneyManager     = new MoneyManager();
const favoritesWidget  = new FavoritesWidget();

const updateRates = () => {
    ApiConnector.getStocks(resp => {
        if (resp.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(resp.data);
        }
    });
};


const updateFavoritesFromData = (data) => {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(data);
    moneyManager.updateUsersList(data); 
};

const updateFavorites = () => {
    ApiConnector.getFavorites(resp => {
        if (resp.success) {
            updateFavoritesFromData(resp.data);
        }
    });
};


logoutButton.action = () => ApiConnector.logout(resp => resp.success && location.reload());

ApiConnector.current(resp => {
    if (resp.success) ProfileWidget.showProfile(resp.data);
});

updateRates();
updateFavorites();
setInterval(updateRates, 60000);  


const handleMoneyOperation = (response, successMessage) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        
      
        updateRates(); 
        
        moneyManager.setMessage(true, successMessage);
    } else {
        moneyManager.setMessage(false, response.error || 'Ошибка');
    }
};


moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, resp => 
        handleMoneyOperation(resp, 'Баланс успешно пополнен!')
    );
};

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, resp => 
        handleMoneyOperation(resp, 'Конвертация выполнена успешно!')
    );
};

moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, resp => 
        handleMoneyOperation(resp, 'Перевод выполнен успешно!')
    );
};

favoritesWidget.addUserCallback = userData => {
    ApiConnector.addUserToFavorites(userData, resp => {
        if (resp.success) {
            updateFavoritesFromData(resp.data);
            favoritesWidget.setMessage(true, 'Пользователь добавлен в избранное');
        } else {
            favoritesWidget.setMessage(false, resp.error);
        }
    });
};

favoritesWidget.removeUserCallback = userId => {
    ApiConnector.removeUserFromFavorites({ id: userId }, resp => {
        if (resp.success) {
            updateFavoritesFromData(resp.data);
            favoritesWidget.setMessage(true, 'Пользователь удалён из избранного');
        } else {
            favoritesWidget.setMessage(false, resp.error);
        }
    });
};