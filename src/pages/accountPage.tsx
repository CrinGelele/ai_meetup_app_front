import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { changePassword } from '../slices/usersSlice';
import { useNavigate } from "react-router-dom";
import { ROUTES } from '../../Routes';

const AccountPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const username_acc = useSelector((state: RootState) => state.user.username);
    const userid_acc = useSelector((state: RootState) => state.user.userId);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const error = useSelector((state: RootState) => state.user.error);

    // Обработчик события изменения полей ввода (username и password)
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Обработчки события нажатия на кнопку "Войти"
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        formData.username = username_acc
        if (formData.username && formData.password) {
            await dispatch(changePassword({userID: userid_acc, username: formData.username, password: formData.password})); // Отправляем 'thunk'
            navigate(`${ROUTES.SPEAKERS}`); // переход на страницу услуг
        }
    };

    return (
        <Container style={{ maxWidth: '100%', marginTop: '0' }}> 
            <Container style={{ maxWidth: '400px', marginTop: '150px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{username_acc}</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="password" style={{ marginBottom: '20px' }}>
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Введите пароль"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" style={{ width: '100%' }}>
                        Изменить
                    </Button>
                </Form>
            </Container>
        </Container>
    );
};

export default AccountPage;