import '../index.css';
import { api } from '../utils/api';
import { useEffect, useState } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import PopupWithForm from './PopupWithForm';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ name: '', link: '' });
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    api
      .getUserInfo()
      .then(data => {
        setCurrentUser(data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    api
      .getInitialCards()
      .then(data => {
        setCards(data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  //
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then(newCard => {
        setCards(state => state.map(c => (c._id === card._id ? newCard : c)));
      })
      .catch(e => console.error(e));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(res => {
        setCards(state => state.filter(item => card._id !== item._id));
      })
      .catch(e => console.error(e));
  }
  //
  function handleUpdateUser(data) {
    api
      .editUserInfo(data)
      .then(data => {
        setCurrentUser(data);
        setIsEditProfilePopupOpen(false);
      })
      .catch(err => {
        console.error(err);
      });
  }
  //
  function handleUpdateAvatar(data) {
    api
      .editAvatar(data)
      .then(data => {
        setCurrentUser(data);
        setIsEditAvatarPopupOpen(false);
      })
      .catch(err => {
        console.error(err);
      });
  }
  //
  function handleAddPlaceSubmit(data) {
    api
      .addCards(data)
      .then(data => {
        setCards([data, ...cards]);
        setIsAddPlacePopupOpen(false);
      })
      .catch(err => {
        console.error(err);
      });
  }
  //
  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({ name: '', link: '' });
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Main
          cards={cards}
          onCardClick={setSelectedCard}
          onCardDelete={handleCardDelete}
          onCardLike={handleCardLike}
          onEditAvatar={setIsEditAvatarPopupOpen}
          onEditProfile={setIsEditProfilePopupOpen}
          onAddPlace={setIsAddPlacePopupOpen}
        />
        <Footer />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onUpdateCard={handleAddPlaceSubmit}
        />

        <PopupWithForm id="confirm-popup" title="Вы уверены?" buttonText="Да" name="addCards" />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
