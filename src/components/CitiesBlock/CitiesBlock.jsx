import { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import AddForm from '../common/AddForm/AddForm';
import BigButton from '../common/BigButton/BigButton';
import DeleteCard from '../common/DeleteCard/DeleteCard';
import EditCard from '../common/EditCard/EditCard';
import Filter from '../common/Filter/Filter';
import Modal from '../common/Modal/Modal';

import * as storage from '../../services/localStorage';
import ItemsList from '../ItemsList/ItemsList';

import addIcon from 'images/add.svg';
import pencilIcon from 'images/pencil.png';
import fingerIcon from 'images/finger.png';

const STORAGE_KEY = 'cities';

const MODAL = {
  NONE: 'none',
  EDIT: 'edit',
  DELETE: 'delete',
};

class CitiesBlock extends Component {
  state = {
    cities: this.props.cities,
    isAddFormOpen: false,
    openedModal: MODAL.NONE,
    // isDeleteModalOpen: false,
    // isEditModalOpen: false,
    activeCity: '',
    filter: '',
  };

  componentDidMount() {
    const savedCities = storage.get(STORAGE_KEY);
    if (savedCities) {
      this.setState({ cities: savedCities });
    }
  }

  //добавили-сохранили город в локал стор
  componentDidUpdate(prevProps, prevState) {
    // console.log('prevState', prevState.cities);
    // console.log('this.cities', this.state.cities);
    const { cities } = this.state;
    if (prevState.cities !== cities) {
      storage.save(STORAGE_KEY, cities);
    }
  }

  // Ф-ция тоглит (переключить-добавить) форму
  toggleAddForm = () =>
    this.setState(prevState => ({ isAddFormOpen: !prevState.isAddFormOpen }));

  // Ф-ция добавляет город записывает в массив и закрывает форму
  addCity = city => {
    const isDuplicate = this.checkIfDuplicate(city);
    if (isDuplicate) {
      toast.warn(`City "${city}" is already in list`);
      return;
    }
    const newCity = { name: city };
    this.setState(prevState => ({
      cities: [...prevState.cities, newCity],
      isAddFormOpen: false,
    }));
  };
  // проверка на дубликат
  checkIfDuplicate = city =>
    this.state.cities.some(({ name }) => name === city);

  //  РЕДАКТИРОВАНИЕ ГОРОДА( EDIT CITY)
  // начинает редактирование: открывает модалку и и запоминает на каком городе открыли
  handleStartEditting = activeCity =>
    this.setState({
      // isEditModalOpen: true,
      openedModal: MODAL.EDIT,
      activeCity,
    });

  // перебирает всех детей, когда юзер нажал сохранить, мы получили изменненый последний инпут из формы
  //  и находит город и подменяет его имя
  saveEditedCity = editedCity => {
    this.setState(prevState => ({
      cities: prevState.cities.map(city => {
        if (city.name === prevState.activeCity) {
          return { ...city, name: editedCity };
        }
        return city;
      }),
      // activeCity: '',
    }));
    // this.closeEditModal();
    this.closeModal();
  };

  // // закрывает модалку редактирования города
  // closeEditModal = () => {
  //   this.setState({
  //     isEditModalOpen: false,
  //   });
  // };

  // DELETE CITY
  // добавлять города
  handleStartDeleting = activeCity =>
    this.setState({
      openedModal: MODAL.DELETE,
      // isDeleteModalOpen: true,
      activeCity,
    });

  // удаляет город и закрывает модалку
  deleteCity = () => {
    this.setState(prevState => ({
      cities: prevState.cities.filter(
        ({ name }) => name !== prevState.activeCity,
      ),
      // activeCity: '',
    }));
    // this.closeDeleteModal();
    this.closeModal();
  };
  // закрыть модалку удаления города
  // closeDeleteModal = () => this.setState({ isDeleteModalOpen: false });

  // закрывает модалку(универсальный метод для всех модалок)
  closeModal = () => {
    this.setState({
      openedModal: MODAL.NONE,
      activeCity: '',
    });
  };

  // фильтровать города
  handleFilterChange = value => this.setState({ filter: value });
  getFilteredCities = () => {
    const { cities, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return cities.filter(city =>
      city.name.toLowerCase().includes(normalizedFilter),
    );
  };

  render() {
    const {
      cities,
      isAddFormOpen,
      // isDeleteModalOpen,
      // isEditModalOpen,
      openedModal,
      activeCity,
      filter,
    } = this.state;

    const filteredCities = this.getFilteredCities();
    return (
      <>
        {cities.length > 1 && (
          <Filter
            label="Поиск города:"
            value={filter}
            onFilterChange={this.handleFilterChange}
          />
        )}

        {!cities.length && <strong>Города нет</strong>}

        {!!filteredCities.length && (
          <ItemsList
            items={filteredCities}
            // items={this.getFilteredCities()}
            onEditItem={this.handleStartEditting}
            onDeleteItem={this.handleStartDeleting}
          />
        )}

        {isAddFormOpen && (
          <AddForm
            onSubmit={this.addCity}
            formName="Добавление города"
            placeholder="Город"
          />
        )}

        <BigButton
          text={isAddFormOpen ? 'Отменить добавление' : 'Добавить город'}
          icon={!isAddFormOpen && addIcon}
          onClick={this.toggleAddForm}
        />

        {openedModal === MODAL.EDIT && (
          <Modal
            title="Редактировать информацию о городе"
            onClose={this.closeModal}
            icon={pencilIcon}
          >
            <EditCard
              label="Город"
              inputValue={activeCity}
              onSave={this.saveEditedCity}
            />
          </Modal>
        )}

        {openedModal === MODAL.DELETE && (
          <Modal
            title="Удаление города"
            onClose={this.closeModal}
            icon={fingerIcon}
          >
            <DeleteCard
              text="Будут удалены все материалы и информация о городе."
              onDelete={this.deleteCity}
              onClose={this.closeModal}
            />
          </Modal>
        )}
      </>
    );
  }
}

CitiesBlock.propTypes = {
  cities: PropTypes.array.isRequired,
};

export default CitiesBlock;

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// class CitiesBlock extends Component {
//   // constructor(props) {
//   //   super(props);

//   //   this.state = {
//   //     cities: this.props.cities,
//   //     filter: '',
//   //     isAddFormOpen: false,
//   //     activeCity: '',
//   //     isEditModalOpen: false,
//   //     isDeleteModalOpen: false,
//   //   };
//   // }

//   state = {
//     cities: this.props.cities,
//     filter: '',
//     isAddFormOpen: false,
//     activeCity: '',
//     isEditModalOpen: false,
//     isDeleteModalOpen: false,
//   };

//   handleFilterChange = value => this.setState({ filter: value });

//   toggleAddForm = () =>
//     this.setState(prevState => ({ isAddFormOpen: !prevState.isAddFormOpen }));

//   addCity = city => {
//     const newCity = { name: city };
//     this.setState(prevState => ({
//       cities: [...prevState.cities, newCity],
//       isAddFormOpen: false,
//     }));
//   };

//   handleEditCity = activeCity =>
//     this.setState({
//       activeCity,
//       isEditModalOpen: true,
//     });

//   editCity = changedCity => {
//     const { activeCity } = this.state;
//     this.setState(prevState => ({
//       activeCity: '',
//       cities: prevState.cities.map(city =>
//         city.name === activeCity ? { name: changedCity } : city,
//       ),
//     }));
//     this.closeEditModal();
//   };

//   closeEditModal = () =>
//     this.setState({
//       isEditModalOpen: false,
//     });

//   handleDeleteCity = activeCity =>
//     this.setState({
//       activeCity,
//       isDeleteModalOpen: true,
//     });

//   deleteCity = () => {
//     const { activeCity } = this.state;

//     this.setState(prevState => ({
//       activeCity: '',
//       cities: prevState.cities.filter(city => city.name !== activeCity),
//     }));
//     this.closeDeleteModal();
//   };

//   closeDeleteModal = () =>
//     this.setState({
//       isDeleteModalOpen: false,
//     });

//   getFilteredCities = () => {
//     const { cities, filter } = this.state;
//     const normalizedFilter = filter.toLowerCase();
//     return cities.filter(({ name }) =>
//       name.toLowerCase().includes(normalizedFilter),
//     );
//   };

//   render() {
//     const {
//       filter,
//       isAddFormOpen,
//       activeCity,
//       isEditModalOpen,
//       isDeleteModalOpen,
//     } = this.state;

//     return (
//       <>
//         <Filter
//           label="Поиск города:"
//           value={filter}
//           onFilterChange={this.handleFilterChange}
//         />

//         <ItemsList
//           items={this.getFilteredCities()}
//           onEditItem={this.handleEditCity}
//           onDeleteItem={this.handleDeleteCity}
//         />

//         {isAddFormOpen && (
//           <AddForm
//             onSubmit={this.addCity}
//             formName="Добавление города"
//             placeholder="Город"
//           />
//         )}

//         <BigButton
//           text={isAddFormOpen ? 'Отменить добавление' : 'Добавить город'}
//           icon={!isAddFormOpen && addIcon}
//           onClick={this.toggleAddForm}
//         />

//         {isEditModalOpen && (
//           <Modal
//             title="Редактировать информацию о городе"
//             onClose={this.closeEditModal}
//             icon={pencilIcon}
//           >
//             <EditCard
//               label="Город"
//               inputValue={activeCity}
//               onSave={this.editCity}
//             />
//           </Modal>
//         )}

//         {isDeleteModalOpen && (
//           <Modal
//             title="Удаление города"
//             onClose={this.closeDeleteModal}
//             icon={fingerIcon}
//           >
//             <DeleteCard
//               text="Будут удалены все материалы и информация о городе."
//               onDelete={this.deleteCity}
//               onClose={this.closeDeleteModal}
//             />
//           </Modal>
//         )}
//       </>
//     );
//   }
// }
