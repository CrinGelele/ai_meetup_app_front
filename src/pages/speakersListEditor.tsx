import { FC, useEffect } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/defaultImage.png";
import { useSelector } from 'react-redux';
import { deleteSpeaker } from '../slices/speakersSlice';
import { RootState, useAppDispatch } from '../store';
import { api } from '../api';
import { getSpeakersList } from '../slices/speakersSlice'

const POLLING_INTERVAL = 20000; // 5 секунд

export const SpeakersListEditor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const isModerator = useSelector((state: RootState) => state.user.isModerator);
  const speakersData = useSelector((state: RootState) => state.speakers.speakersData);
  const speakers = speakersData?.speakers || [];

  // Загрузка списка спикеров
useEffect(() => {
    dispatch(getSpeakersList());
    const interval = setInterval(() => {
        dispatch(getSpeakersList()); // Запрос для фильтров
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Обработчик для удаления спикера
  const handleDelete = async (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этого спикера?")) {
      await dispatch(deleteSpeaker(id));
      dispatch(getSpeakersList());
    }
  };

  // Обработчик для перехода на страницу редактирования
  const handleEdit = (id: string) => {
    navigate(`${ROUTES.SPEAKERSEDITOR}/${id}`);
  };

  // Обработчик для обновления фотографии спикера
  const handleUpdatePhoto = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];

      // Создаем FormData и добавляем файл
      const formData = new FormData();
      formData.append("image", imageFile); // Ключ "image" должен совпадать с ожидаемым на сервере

      try {
        await api.speakers.addSpeakerPhoto(id, formData);
        dispatch(getSpeakersList());
      } catch (error) {
        console.error("Ошибка при обновлении фотографии:", error);
      }
    }
  };

  // Обработчик для добавления нового спикера
  const handleAddNewSpeaker = () => {
    navigate(ROUTES.SPEAKERSCREATOR);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.SPEAKERS, path: ROUTES.SPEAKERS },
          { label: "Редактор спикеров" },
        ]}
      />
        <div className="container">
          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-primary" onClick={handleAddNewSpeaker}>
              Добавить нового спикера
            </button>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Фото</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Место работы</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {speakers.map((speaker) => (
                <tr key={speaker.id}>
                  <td>
                    <img
                      src={speaker.img_url ? speaker.img_url.replace('http://localhost:9000', '/minio') : defaultImage}
                      className="img-thumbnail"
                      alt="Speaker"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>{speaker.first_name}</td>
                  <td>{speaker.last_name}</td>
                  <td>{speaker.workplace}</td>
                  <td>
                    {isAuthenticated && isModerator && (
                      <>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(String(speaker.id))}
                        >
                          Редактировать
                        </button>
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => handleDelete(String(speaker.id))}
                        >
                          Удалить
                        </button>
                        <label htmlFor={`upload-photo-${speaker.id}`} className="btn btn-info btn-sm">
                          Обновить фото
                        </label>
                        <input
                          id={`upload-photo-${speaker.id}`}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleUpdatePhoto(String(speaker.id), e)}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};