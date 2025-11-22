'use strict';

const userForm = new UserForm();


userForm.loginFormCallback = function(data) {
    
    console.log('Данные для авторизации:', data);
    ApiConnector.login(
        {
            login: data.login,
            password: data.password
        },
        (response) => {
            console.log('Ответ сервера на запрос авторизации:', response);
            if (response.success) {
                console.log('Авторизация успешна. Перезагружаем страницу...');
                location.reload();
            } else {
                
                const errorMessage = response.error || 'Ошибка авторизации. Проверьте данные.';
                userForm.setLoginErrorMessage(errorMessage);
                console.warn('Ошибка авторизации:', errorMessage);
            }
        }
    );
};


userForm.registerFormCallback = function(data) {
   
    console.log('Данные для регистрации:', data);

    
    ApiConnector.register(
        {
            login: data.login,
            password: data.password
        },
        
        (response) => {
            
            console.log('Ответ сервера на запрос регистрации:', response);

            
            if (response.success) {
           
                console.log('Регистрация успешна. Перезагружаем страницу...');
                location.reload();
            } else {
                
                const errorMessage = response.error || 'Ошибка регистрации. Проверьте данные.';
                userForm.setRegisterErrorMessage(errorMessage);
                console.warn('Ошибка регистрации:', errorMessage);
            }
        }
    );
};
