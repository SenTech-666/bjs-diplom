'use strict';

// Создаём объект класса UserForm
const userForm = new UserForm();

// Присваиваем свойству loginFormCallback функцию-обработчик авторизации
userForm.loginFormCallback = function(data) {
    // Выводим в консоль переданные данные для отладки
    console.log('Данные для авторизации:', data);

    // Выполняем запрос на сервер через ApiConnector.login
    ApiConnector.login(
        {
            login: data.login,
            password: data.password
        },
        // Функция-колбек, выполняемая после получения ответа от сервера
        (response) => {
            // Смотрим в консоли, какой объект вернул сервер
            console.log('Ответ сервера на запрос авторизации:', response);

            // Проверяем успешность запроса
            if (response.success) {
                // В случае успеха обновляем страницу
                console.log('Авторизация успешна. Перезагружаем страницу...');
                location.reload();
            } else {
                // В случае ошибки выводим сообщение в окно ошибок
                const errorMessage = response.error || 'Ошибка авторизации. Проверьте данные.';
                userForm.setLoginErrorMessage(errorMessage);
                console.warn('Ошибка авторизации:', errorMessage);
            }
        }
    );
};

// Присваиваем свойству registerFormCallback функцию-обработчик регистрации
userForm.registerFormCallback = function(data) {
    // Выводим в консоль переданные данные для отладки
    console.log('Данные для регистрации:', data);

    // Выполняем запрос на сервер через ApiConnector.register
    ApiConnector.register(
        {
            login: data.login,
            password: data.password
        },
        // Функция-колбек, выполняемая после получения ответа от сервера
        (response) => {
            // Смотрим в консоли, какой объект вернул сервер
            console.log('Ответ сервера на запрос регистрации:', response);

            // Проверяем успешность запроса
            if (response.success) {
                // В случае успеха обновляем страницу
                console.log('Регистрация успешна. Перезагружаем страницу...');
                location.reload();
            } else {
                // В случае ошибки выводим сообщение в окно ошибок
                const errorMessage = response.error || 'Ошибка регистрации. Проверьте данные.';
                userForm.setRegisterErrorMessage(errorMessage);
                console.warn('Ошибка регистрации:', errorMessage);
            }
        }
    );
};
