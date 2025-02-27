import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { ROUTES } from '../../Routes';
import { RootState, useAppDispatch } from '../store';
import { getSpeakersList, updateSpeaker } from '../slices/speakersSlice';
import { Speaker } from '../modules/aimaApi';
import './meetupPage.css';
import { BreadCrumbs } from '../components/BreadCrumbs';

const SpeakerEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { speakerId } = useParams<{ speakerId: string }>(); // Получаем ID спикера из URL
  const speakers = useSelector((state: RootState) => state.speakers.speakersData.speakers);

  // Находим редактируемого спикера по ID
  const currentSpeaker = speakers.find((speaker) => speaker.id === Number(speakerId));

  // Состояние для формы редактирования
  const [formData, setFormData] = useState<Speaker>({
    id: 0,
    first_name: '',
    last_name: '',
    workplace: '',
    description: '',
    img_url: '',
  });

  // Загружаем список спикеров при монтировании компонента
  useEffect(() => {
    dispatch(getSpeakersList());
  }, [dispatch]);

  // Заполняем форму данными текущего спикера, когда он загружен
  useEffect(() => {
    if (currentSpeaker) {
      setFormData(currentSpeaker);
    }
  }, [currentSpeaker]);

  // Обработчик изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateSpeaker({ speakerId: String(formData.id), data: formData })); // Передаем speakerId и данные
    navigate(ROUTES.SPEAKERS); // Перенаправляем на страницу списка спикеров
  };

  if (!currentSpeaker) {
    return <div>Спикер не найден</div>;
  }

  return (
    <div className="container mx-0">
      <BreadCrumbs crumbs={[{ label: 'Редактирование спикера' }]} />
      <h2>Редактирование спикера: {currentSpeaker.first_name} {currentSpeaker.last_name}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formLastName">
          <Form.Label>Фамилия</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formWorkplace">
          <Form.Label>Место работы</Form.Label>
          <Form.Control
            type="text"
            name="workplace"
            value={formData.workplace}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Описание</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description ?? ''}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Сохранить изменения
        </Button>
      </Form>
    </div>
  );
};

export default SpeakerEditor;