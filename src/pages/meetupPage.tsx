import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { ROUTES } from '../../Routes';
import { getMeetup, deleteMeetup, setError, setMeetupData, updateMeetup, setInvites, deleteInvite, commitMeetup, updateInvite } from '../slices/meetupsSlice';
import { RootState, useAppDispatch } from '../store';
import './meetupPage.css';

const MeetupPage: React.FC = () => {
  const { current_meetup_id } = useParams<{ current_meetup_id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { invites, meetupData, error } = useSelector((state: RootState) => state.meetup);
  const isDraft = useSelector((state: RootState) => state.meetup.isDraft);

  const handleDeleteInvite = async (speaker_id: number) => {
    if (current_meetup_id && speaker_id) {
        await dispatch(deleteInvite({ current_meetup_id: current_meetup_id, speaker_id: speaker_id }));
        dispatch(getMeetup(current_meetup_id));
    }
}

  const handleSaveMeetup = () => {
    if (current_meetup_id) {
        const meetupDataToSend = {
            status: meetupData.status,
            user: meetupData.user,
            topic: meetupData.topic ?? '', 
            meetup_date: meetupData.meetup_date instanceof Date 
            ? meetupData.meetup_date.toISOString() // Преобразуем Date в строку
            : meetupData.meetup_date, // Оставляем как есть, если это строка
          };
      try {
        dispatch(updateMeetup({ current_meetup_id: current_meetup_id, meetupData: meetupDataToSend }));
      } catch (error) {
        dispatch(setError(error));
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(
        setMeetupData({
            ...meetupData,
            [name]: value,
        })
    );
  };

  const handleInviteChange = (speaker_id: number, value: string) => {
    dispatch(
      setInvites(
        invites.map((invite) =>
          invite.speaker.id === speaker_id
            ? { ...invite, approx_perfomance_duration: Number(value) || null }
            : invite
        )
      )
    );
  };

  const handleSaveInvite = async (speaker_id: number) => {
    const inviteToUpdate = invites.find(invite => invite.speaker.id === speaker_id);
    if (inviteToUpdate && current_meetup_id) {
      try {
        await dispatch(updateInvite({ 
          current_meetup_id, 
          speaker_id, 
          inviteData: inviteToUpdate 
        })).unwrap();
      } catch (error) {
        dispatch(setError(error));
      }
    }
  };
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (current_meetup_id) {
      try {
        await dispatch(commitMeetup(current_meetup_id)).unwrap();
        navigate(ROUTES.SPEAKERS);
      } catch (error) {
        dispatch(setError(error));
      }
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (current_meetup_id) {
      try {
        await dispatch(deleteMeetup(current_meetup_id)).unwrap();
        navigate(ROUTES.SPEAKERS);
      } catch (error) {
        dispatch(setError(error));
      }
    }
  };

  useEffect(() => {
    if (current_meetup_id) {
      dispatch(getMeetup(current_meetup_id));
    }
  }, [dispatch, current_meetup_id]);

  const handleCardClick = (speaker_id: number | undefined) => {
    navigate(`${ROUTES.SPEAKERS}/${speaker_id}`);
  };

  const formattedDate = meetupData?.meetup_date ? new Date(meetupData.meetup_date).toISOString().split('T')[0] : '';

  return (
    <div className="container mx-0">
            {(!isDraft) ? (
            <div className="info-container">
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="primary-text">id</Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" disabled value={meetupData.id || ''} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="primary-text">тема</Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" disabled value={meetupData.topic || ''} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="primary-text">дата</Form.Label>
                    <Col sm="10">
                    <Form.Control type="date" disabled value={formattedDate} />
                    </Col>
                </Form.Group>
            </div>
            ) : (
                <div className="info-container">
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="primary-text">id</Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" name="id" disabled value={meetupData.id} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="primary-text">тема</Form.Label>
                    <Col sm="10">
                    <Form.Control type="text" name="topic" disabled={!isDraft} onChange={handleInputChange} value={meetupData.topic || ''} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="primary-text">дата</Form.Label>
                    <Col sm="10">
                    <Form.Control type="date" name="meetup_date" disabled={!isDraft} onChange={handleInputChange} value={formattedDate || ''} />
                    </Col>
                </Form.Group>
                <Button variant="primary" onClick={handleSaveMeetup} className="submit-btn">Сохранить</Button>
                <Button variant="primary" onClick={handleSubmit} className="submit-btn">Отправить</Button>
                <Button type="submit" variant="danger" onClick={handleDelete} className="submit-btn">Удалить</Button>
                </div>
            )}

      <div className="meetup-card-list">
        {invites.map((invite, index) => (
          <div key={index} className="speaker-card justify-content-between align-items-center">
            {(isDraft) && (
                <div className="m-text-container" onClick={() => handleDeleteInvite(invite.speaker.id)}>
                    <p className="primary-text fs-3"> &#128465;</p>
                </div>
            )}
            <img src={invite.speaker.img_url} alt="speaker" onClick={() => handleCardClick(invite.speaker.id)} />
            <div className="m-text-container">
              <p className="primary-text">{invite.speaker.first_name} {invite.speaker.last_name}</p>
            </div>
            <Form.Control
              disabled={!isDraft} 
              className="duration-input"
              name="approx_perfomance_duration"
              type="text"
              value={invite.approx_perfomance_duration || ''}
              onChange={(e) => handleInviteChange(invite.speaker.id, e.target.value)}
              onBlur={() => handleSaveInvite(invite.speaker.id)} 
            />
            <div className="m-text-container">
              <p className="primary-text">минут</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetupPage;