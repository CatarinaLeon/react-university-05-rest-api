## Занятие 6:

- HTTP-запросы
- Состояние и компонент для индикатора загрузки
- Состояние и компонент для обработки ошибки
- [Утечка памяти при размонтировании компонента с активным HTTP-запросом](https://habr.com/ru/post/588799/)
- Паттерн «State machine»

### Задача № 1

Используя [mockapi.io/](https://mockapi.io/) сделать `GET` запрос `tutors`:

- в поле стейта `tutors` вместо инициализации пропами, оставляем `[]`, как
  начальное значение
- удаляем логику подгрузки городов из локального хранилища
- пишем метод `fetchTutors`, в котором делаем get-запрос по ендпоинту `tutors`
- полученные `tutors` записывам в стейт
- вызываем метод при маунте компонента
- теперь там, где мы при рендере массива использовали `email` как ключ -
  изменить на `id`

### Задача № 2

Написать запрос на добавление города:

- сначала очевидный способ:

  - в методе `addTutor` делаем post-запрос и передаем, кроме ендпоинта, объект с
    новым городом
  - полученный новый город добавляем в стейт в массив городов
  - после любого ответа от сервера закрываем форму

- рекомендуемый способ:
  - добавляем в стейт новове поле `newTutor` (для начала `null`)
  - пишем новый метод `confirmAdd`, в котором принимаем объект с новым `tutor` и
    записываем его в стейт в поле `newTutor`
  - теперь этот метод будем передавать в `TutorForm`
  - в методе `addTutor` оставляем post-запрос, в котором отправляетя объект с
    новым городом из стейта
  - в методе `componentDidUpdate` добавляем проверку: если в поле `newTutor` не
    пусто и предыдущий `newTutor` не равен текущему, то вызываем метод
    `addTutor`

### Задача № 3

Добавить [лоадер](https://www.npmjs.com/package/react-spinners) при запросах

- добавить в стейт новое поле `loading`, изначально `false`
- перед каждым апи-запросом устанавливать его значение в `true`
- после любого ответа от сервера устанавливать его значение снова в `false`
- импортим компонент `Loader`
- рендерим его, если в поле `loading` - `true`

### Задача № 4

Добавить обработку ошибок при запросах:

- добавить в стейт новое поле `error`, изначально `null`
- перед каждым апи-запросом устанавливать его значение в `null`
- в случае ошибки в ответе от сервера - записывать значение ошибки в это поле
- импортим компонент `ErrorMsg`
- рендерим его под формой, если в поле `error` сообщение, и передаем его в пропе
  `message`

### Задача № 5

Прерывать запрос во избежание утечки памяти при размонтировании компонента с
активным HTTP-запросом на примере запросов `tutors`:

- показать временную кнопку для тогла `tutors` из `Main`
- сделать медленную скорость загрузки, быстро открыть-скрыть секцию `tutors` или
  добавить препода и скрыть
- более простой способ убрать утечку памяти, но не предотвратить повторные
  запросы:
  - добавляем свойство в `TutorsBlock` - `isTutorsMounted = false`
  - при маунте изменяем его на `true`, при анмаунте - снова на `false`
  - в методе `addTutor` после выполнения асинхронной операции, абсолютно все
    действия по изменению стейта делаем после проверки `if (this.#isMounted)`
- более сложный способ, предотвращающий также повторные запросы:
  - добавляем 2 свойства в `TutorsBlock`:
    - если на странице только один фетч-запрос
    ```
    controller = new AbortController();
    signal = this.controller.signal;
    ```
    - если 2 и больше
    ```
    controllers = {};
    signals = {};
    ```
  - при анмаунте компонента прерываем все действующие запросы:
    - если на странице только один фетч-запрос
    ```
    if (this.controller) {
      this.controller.abort();
    }
    ```
    - если 2 и больше
    ```
    Object.keys(this.controllers).forEach(key => {
      if (this.controllers[key]) {
        this.controllers[key].abort();
      }
    });
    ```
  - добавляем метод, который будет создавать контролер и сигнал:
    ```
    createSignalAndController = () => {
      if (this.controller) {
        this.controller.abort();
      }
      this.controller = new AbortController();
      this.signal = this.controller.signal;
    };
    ```
    - если 2 и больше
    ```
    createSignalAndController = id => {
      if (this.controllers[id]) {
        this.controllers[id].abort();
      }
      this.controllers[id] = new AbortController();
      this.signals[id] = this.controllers[id].signal;
    };
    ```
  - в методе `fetchTutors` создаем контролер и сигнал:
    - если на странице только один фетч-запрос
    ```
    this.createSignalAndController();
    const signal = { signal: this.signal };
    ```
    - если 2 и больше
    ```
    const ID = 'fetchTutors';
    this.createSignalAndController(ID);
    const signal = { signal: this.signals[ID] };
    ```
  - делаем GET-запрос и передаем, кроме ендпоинта, `signal`
  - в апи-сервисе логика для этого настроена (посмотреть)
  - после выполнения асинхронной операции, в `catch` и `finally` абсолютно все
    действия по изменению стейта делаем после проверки:
    - если на странице только один фетч-запрос
    ```
    if (!this.signal.aborted) {};
    ```
    - если 2 и больше
    ```
    if (!this.signals[ID].aborted) {};
    ```
  - в `catch` еще можно сделать другую проверку (но лучше предыдущий вариант):
    ```
    if (error.name !== 'AbortError') {};
    ```

### Задача № 6

Добавить [скелетон](https://www.npmjs.com/package/react-content-loader) для
первой загрузки `tutors`:

- добавим в стейт новое свойство `firstLoading: true`
- в методе `componentDidMount` после любого результата вызова `fetchTutors`,
  меняем значение `firstLoading` на `false`
- импортим `Skeleton` и рендерим его, если `firstLoading: true`
- сообщение про отсутствие `tutors` рендерим только, если это не первая загрузка
- двойные условия рендера лучше выносить в переменные
- кнопку `BigButton` делаем недоступной при любой загрузке

### Задача № 7

В компоненте `DepartmentsBlock` реализовать отображение уведомлений при удачных
и неудачных фетчах используя библиотеку
[react-toastify](https://www.npmjs.com/package/react-toastify)

- подключаем пакет и добавляем контейнет в `Арр`
- импортируем тост и вызываем в нужных местах

### Задача № 8

Перенести апи-урл в
[переменные окружения](https://create-react-app.dev/docs/adding-custom-environment-variables/#adding-development-environment-variables-in-env)

//////////////////////////////////////////////////////

### Задача № 9 (сложный уровень)

Разобрать логику фетч запросов в `CitiesBlock`:

### 1

Используя [mockapi.io/](https://mockapi.io/) сделать `GET` запрос городами:

- в поле `cities` вместо инициализации пропами, оставляем `[]`, как начальное
  значение
- удаляем логику подгрузки городов из локального хранилища
- пишем метод `fetchCities`, в котором делаем get-запрос по ендпоинту `cities`
- полученные города записывам в стейт
- вызываем его при маунте компонента
- теперь там, где мы при рендере массива использовали email как ключ - изменить
  на `id`

### 2

Написать запрос на добавление города:

- добавляем в стейт новове поле `action` с возможными значениями:

```
const ACTION = {
  NONE: 'none',
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
};
```

- теперь в стейте в `activeCity` будем хранить не имя активного города, а весь
  объект (для начала `null`)
- пишем новый метод `confirmAdd`, в котором принимаем имя нового города и
  устанавливаем в поле `action` 'add', а в `activeCity` объект с новым городом
- теперь этот метод будем передавать в `AddForm`
- в методе `addCity` делаем post-запрос и передаем, кроме ендпоинта, объект с
  новым городом
- полученный новый город добавляем в стейт в массив городов
- после любого ответа от сервера закрываем форму, сбрасываем поля `action` и
  `activeCity`
- в методе `componentDidUpdate` добавляем проверку: если предыдущий `action` не
  равен текущему и равен `'add'`, то вызываем метод `addCity`

### 3

Написать запрос на редактирование города:

- т.к. теперь в стейте в `activeCity` будем хранить не имя активного города, а
  весь объект, из `ItemsList` будем передаем в колбеки целый `item`, а не только
  имя
- соответсвенно, в `EditCard` теперь нужно передавать только имя активного
  города
- пишем новый метод `confirmEdit`, в котором принимаем измененное имя города и
  устанавливаем в поле `action` `'edit'`, а в `activeCity` обновляем имя,
  сохраняя айди
- теперь этот метод будем передавать в `EditCard`
- в методе `editCity` делаем put-запрос и передаем, кроме ендпоинта, объект с
  измененным именем
- полученный измененный город заменяем в стейте в массиве на новый
- после любого ответа от сервера закрываем модалку, сбрасываем поля `action` и
  `activeCity`
- в методе `componentDidUpdate` добавляем проверку: если предыдущий `action` не
  равен текущему и равен `'edit'`, то вызываем метод `editCity`

### 4

Написать запрос на удаление города:

- пишем новый метод `confirmDelete`, в котором устанавливаем в поле `action`
  `'delete'`
- в методе `deleteCity` делаем delete-запрос и передаем, кроме ендпоинта, айди
  активного города
- по айди из полученного удаленного города удаляем его из массива городов
- после любого ответа от сервера закрываем модалку, сбрасываем поля `action` и
  `activeCity`
- в методе `componentDidUpdate` добавляем проверку: если предыдущий `action` не
  равен текущему и равен `'delete'`, то вызываем метод `deleteCity`
