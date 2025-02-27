import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { ROUTE_LABELS } from '../../Routes';
import { getMeetups, getMeetupsFiltered, moderateMeetup } from '../slices/meetupssSlice';
import { RootState, useAppDispatch } from '../store';
import './meetupPage.css';
import { BreadCrumbs } from "../components/BreadCrumbs";
import { Meetup } from '../modules/aimaApi';
import qr_icon from '../assets/qr_icon.png'

const POLLING_INTERVAL = 5000; // 5 секунд

const MeetupsEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const { meetups } = useSelector((state: RootState) => state.meetups); 
  const isModerator = useSelector((state: RootState) => state.user.isModerator);
  const userId = useSelector((state: RootState) => state.user.userId);

  const [isFiltered] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    start: "",
    end: ""
  });

  const [filteredMeetups, setFilteredMeetups] = useState(meetups);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      filtered = filtered.filter((meetup) => {
        if (meetup.meetup_date) {
          return new Date(meetup.meetup_date) >= new Date(filters.start);
        }
        return false;
      });
    }

    if (filters.end) {
      filtered = filtered.filter((meetup) => {
        if (meetup.meetup_date) {
          return new Date(meetup.meetup_date) <= new Date(filters.end);
        }
        return false;
      });
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

  const handleCommit = (meetup_id: string) => {
    dispatch(moderateMeetup({meetup_id: meetup_id, status: "Завершена"}));
    dispatch(getMeetups());
  };

  const handleReject = (meetup_id: string) => {
    dispatch(moderateMeetup({meetup_id: meetup_id, status: "Отклонена"}));
    dispatch(getMeetups());
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
            <div className="dinner-icon">
                {meetup.status === 'Сформирована' ? (
                <></>
                ) : (
                <div className="qr-hover-wrapper">
                    <img className="status-icon" src={qr_icon} alt="QR Icon" />
                    <div className="qr-hover">
                    {meetup.qr && <img className="qr-code" src={`data:image/png;base64,${meetup.qr}`} alt="QR Code" />}
                    </div>
                </div>
                )}
            </div>
            {meetup.status === 'Сформирована' && isModerator && (
            <>
                <Button variant="primary" className="m-commit-btn" value={meetup.id} onClick={() => meetup.id?.toString() && handleCommit(meetup.id.toString())}>Подтвердить</Button>
                <Button variant="primary" className="m-reject-btn" value={meetup.id} onClick={() => meetup.id?.toString() && handleReject(meetup.id.toString())}>Отклонить</Button>
            </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetupsEditor;
