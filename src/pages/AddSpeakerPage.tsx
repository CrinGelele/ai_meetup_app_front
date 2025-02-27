import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { ROUTES } from '../../Routes';
import { useAppDispatch } from '../store';
import { addSpeaker } from '../slices/speakersSlice';
import { Speaker } from '../modules/aimaApi';
import { BreadCrumbs } from '../components/BreadCrumbs';
import './meetupPage.css';

const AddSpeakerPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Состояние для формы добавления
  const [formData, setFormData] = useState<Speaker>({
    id: 0, // ID будет присвоен на сервере
    first_name: '',
    last_name: '',
    workplace: '',
    description: '',
    img_url: '',
  });

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
    dispatch(addSpeaker(formData)); // Отправляем данные нового спикера
    navigate(ROUTES.SPEAKERS); // Перенаправляем на страницу списка спикеров
  };

  return (
    <div className="container mx-0">
      <BreadCrumbs crumbs={[{ label: 'Добавление спикера' }]} />
      <h2>Добавление нового спикера</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formLastName">
          <Form.Label>Фамилия</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formWorkplace">
          <Form.Label>Место работы</Form.Label>
          <Form.Control
            type="text"
            name="workplace"
            value={formData.workplace}
            onChange={handleInputChange}
            required
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
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Добавить спикера
        </Button>
      </Form>
    </div>
  );
};

export default AddSpeakerPage;