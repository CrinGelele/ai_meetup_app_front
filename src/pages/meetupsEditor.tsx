import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import { getMeetups, getMeetupsFiltered, moderateMeetup } from '../slices/meetupssSlice';
import { RootState, useAppDispatch } from '../store';
import './meetupPage.css';
import { BreadCrumbs } from "../components/BreadCrumbs";
import { Meetup } from '../modules/aimaApi';

const POLLING_INTERVAL = 5000; // 5 секунд

const MeetupsEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { meetups } = useSelector((state: RootState) => state.meetups); 
  const isModerator = useSelector((state: RootState) => state.user.isModerator);
  const userId = useSelector((state: RootState) => state.user.userId);

  const [isFiltered, setIsFiltered] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    start: "",
    end: ""
  });

  const [filteredMeetups, setFilteredMeetups] = useState(meetups);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Функция фильтрации
  const filterMeetups = (meetups: Meetup[], filters: any) => {
    let filtered = meetups;

    // Применяем фильтрацию по статусу, если он указан
    if (filters.status) {
      filtered = filtered.filter((meetup) => meetup.status?.includes(filters.status));
    }

    // Применяем фильтрацию по дате начала
    if (filters.start) {
      filtered = filtered.filter((meetup) => new Date(meetup.meetup_date) >= new Date(filters.start));
    }

    // Применяем фильтрацию по дате окончания
    if (filters.end) {
      filtered = filtered.filter((meetup) => new Date(meetup.meetup_date) <= new Date(filters.end));
    }

    // Фильтрация по пользователю
    if (!isModerator) {
      filtered = filtered.filter((meetup) => String(meetup.user) === String(userId));
    }

    return filtered;
  };

  useEffect(() => {
    dispatch(getMeetups());
    
    const interval = setInterval(() => {
      if (isFiltered) {
        dispatch(getMeetupsFiltered(filters)); // Запрос для фильтров
      } else {
        dispatch(getMeetups()); // Запрос для всех митапов
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch, isFiltered, filters]);

  useEffect(() => {
    // Фильтрация происходит каждый раз, когда данные митапов или фильтры меняются
    setFilteredMeetups(filterMeetups(meetups, filters));
  }, [meetups, filters, isModerator, userId]);

  const handleCardClick = (meetup_id: number | undefined) => {
    navigate(`${ROUTES.MEETUP}/${meetup_id}`);
  };

  const handleCommit = (meetup_id: string) => {
    dispatch(moderateMeetup({meetup_id: meetup_id, status: "Завершена"}));
    dispatch(getMeetups());
  };

  const handleReject = (meetup_id: string) => {
    dispatch(moderateMeetup({meetup_id: meetup_id, status: "Отклонена"}));
    dispatch(getMeetups());
  };

  const handleFilter = () => {
    setIsFiltered(true); // Включаем фильтрацию
    // Здесь мы не вызываем getMeetupsFiltered напрямую, так как фильтрация происходит локально в useEffect
  };

  const resetFilter = () => {
    setIsFiltered(false); // Отключаем фильтрацию
    setFilters({ status: "", start: "", end: "" });
    dispatch(getMeetups()); // Сбрасываем митапы и выводим все
  };

  return (
    <div className="container mx-0">
        <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.MEETUPSEDITOR }]} />
                <div className="info-container">
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="primary-text">Статус</Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" name="status" value={filters.status} onChange={handleChange} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="primary-text">От</Form.Label>
                    <Col sm="10">
                    <Form.Control type="date" name="start" value={filters.start} onChange={handleChange} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="primary-text">До</Form.Label>
                    <Col sm="10">
                    <Form.Control type="date" name="end" value={filters.end} onChange={handleChange} />
                    </Col>
                </Form.Group>
                </div>
      <div className="meetup-card-list">
        {filteredMeetups.map((meetup, index) => (
          <div key={index} className="speaker-card justify-content-between align-items-center px-4">
            <div className="m-text-container d-flex flex-column">
              <p className="primary-text">Тема: {meetup.topic || '-'}</p>
              <p className="primary-text">Дата: {meetup.meetup_date ? new Date(meetup.meetup_date).toISOString().split('T')[0] : '-'}</p>
              <p className="primary-text">Отправлена: {meetup.submit_date ? new Date(meetup.submit_date).toISOString().split('T')[0] : '-'}</p>
            </div>
            <div className="m-text-container d-flex flex-column">
                <p className="primary-text">Статус: {meetup.status || '-'}</p>
              <p className="primary-text">Кол-во зрителей: {meetup.viewers || '-'}</p>
            </div>
            {meetup.status === 'Сформирована' && isModerator && (
            <>
                <Button variant="primary" className="m-commit-btn" value={meetup.id} onClick={() => handleCommit(meetup.id.toString())}>Подтвердить</Button>
                <Button variant="primary" className="m-reject-btn" value={meetup.id} onClick={() => handleReject(meetup.id.toString())}>Отклонить</Button>
            </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetupsEditor;
