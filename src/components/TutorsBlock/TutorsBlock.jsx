/** @jsxImportSource @emotion/react */
import { Component } from 'react';

import PropTypes from 'prop-types';
import Tutor from './Tutor/Tutor';
import TutorForm from './TutorForm/TutorForm';
import BigButton from '../common/BigButton/BigButton';
import Paper from '../common/Paper/Paper';
import plusImg from '../../images/add.svg';

/**
 * Добавим коммент из документации
 * В пропе css у верхнего дива пропишем два css правила:
 * { position: relative; margin-bottom: 32px }
 * в стиле объекта
 * Также на каждую лишку { margin-bottom: 24px }
 */

class TutorsBlock extends Component {
  state = {
    tutors: this.props.tutors,
    isFormOpen: false,
  };

  toggleForm = () =>
    this.setState(prevState => ({
      // console.log('prevState', prevState);
      isFormOpen: !prevState.isFormOpen,
    }));
  // так плохо! -> this.setState({ isFormOpen: !this.state.isFormOpen });

  // Добавить нового преподавателя в массив: распылить старый и добавить новый ->
  addTutor = newTutor =>
    this.setState(prevState => ({
      tutors: [...prevState.tutors, newTutor],
      isFormOpen: false,
    }));

  render() {
    const { tutors, isFormOpen } = this.state;
    return (
      <div css={{ position: 'relative', marginBottom: 32 }}>
        <ul>
          {tutors.map(tutor => (
            <li key={tutor.email} css={{ marginBottom: 24 }}>
              <Paper>
                <Tutor {...tutor} />
              </Paper>
            </li>
          ))}
        </ul>

        {isFormOpen && <TutorForm onSubmit={this.addTutor} />}

        <BigButton
          onClick={this.toggleForm}
          // onClick={this.addTutor}
          icon={!isFormOpen && plusImg}
          text={isFormOpen ? 'Отменить добавление' : 'Добавить преподавателя'}
          // text="Добавить преподавателя"
        />
      </div>
    );
  }
}

// const TutorsBlock = ({ tutors }) => {
//   //tutors=[] Дефолтное значение
//   return (
//     <div css={{ position: 'relative', marginBottom: 32 }}>
//       <ul>
//         {tutors.map(tutor => (
//           <li key={tutor.email} css={{ marginBottom: 24 }}>
//             <Paper>
//               <Tutor {...tutor} />

//             </Paper>
//           </li>
//         ))}
//       </ul>
//       <BigButton icon={plusImg} text="Добавить преподавателя" />
//     </div>
//   );
// };

TutorsBlock.propTypes = {
  tutors: PropTypes.arrayOf(
    PropTypes.shape({ email: PropTypes.string.isRequired }),
  ).isRequired,
};

export default TutorsBlock;
