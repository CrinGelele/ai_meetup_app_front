import "./speakerPage.css";
import { FC, useEffect, useState } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { useParams, useNavigate } from "react-router-dom";
import { Speaker, getSpeakerById } from "../modules/aimaApi";
import { Spinner } from "react-bootstrap";
import { SPEAKERS_MOCK } from "../modules/mock";
import defaultImage from "../assets/defaultImage.png";
import { useSelector } from 'react-redux';
import { inviteSpeaker } from '../slices/meetupsSlice';
import { RootState, useAppDispatch } from '../store';
import { api } from '../api'; // Импортируем API
import { deleteSpeaker } from '../slices/speakersSlice'

export const AlbumPage: FC = () => {
  const [pageData, setPageData] = useState<Speaker>();
  const { id } = useParams(); // ID страницы, пример: "/albums/12"
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const isModerator = useSelector((state: RootState) => state.user.isModerator);

  // Обработчик для приглашения спикера
  const handleAdd = async () => {
    if (id) {
      await dispatch(inviteSpeaker(id));
      navigate(`${ROUTES.SPEAKERS}`);
    }
  };

  // Обработчик для перехода на страницу редактирования
  const handleEdit = () => {
    if (id) {
      navigate(`${ROUTES.SPEAKERSEDITOR}/${id}`);
    }
  };

  // Обработчик для удаления спикера
  const handleDelete = async () => {
    if (id && window.confirm("Вы уверены, что хотите удалить этого спикера?")) {
      await dispatch(deleteSpeaker(id));
      navigate(ROUTES.SPEAKERS);
    }
  };

  // Обработчик для обновления фотографии спикера
  const handleUpdatePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (id && e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
  
      // Создаем FormData и добавляем файл
      const formData = new FormData();
      formData.append("image", imageFile); // Ключ "image" должен совпадать с ожидаемым на сервере
  
      try {
        const response = await api.speakers.addSpeakerPhoto(id, formData);
        if (response.data) {
          // Обновляем данные спикера после успешной загрузки фотографии
          const updatedSpeaker = await getSpeakerById(id);
          setPageData(updatedSpeaker);
        }
      } catch (error) {
        console.error("Ошибка при обновлении фотографии:", error);
      }
    }
  };

  // Загрузка данных спикера
  useEffect(() => {
    if (!id) return;
    getSpeakerById(id)
      .then((response) => setPageData(response))
      .catch(() =>
        setPageData(
          SPEAKERS_MOCK.speakers.find((speaker) => String(speaker.id) === id)
        )
      );
  }, [id]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.SPEAKERS, path: ROUTES.SPEAKERS },
          { label: pageData ? `${pageData.first_name} ${pageData.last_name}` : "Спикер" },
        ]}
      />
      {pageData ? ( // Проверка на наличие данных, иначе загрузка
        <div className="container">
          <div className="row page-container">
            {/* Текст */}
            <div className="col-12 col-md-6 order-2 order-md-1 text-container">
              <p className="primary-text">{pageData.first_name}</p>
              <p className="primary-text">{pageData.last_name}</p>
              <p className="secondary-text">{pageData.workplace}</p>
              <p className="info-text">{pageData.description}</p>
              <input type="text" hidden readOnly name="speaker_id" value={pageData.id} />
              {isAuthenticated && isModerator && (
                <>
                  <button type="submit" className="submit_btn" onClick={handleAdd}>
                    Пригласить
                  </button>
                  <button type="button" className="edit_btn" onClick={handleEdit}>
                    Редактировать
                  </button>
                  <button type="button" className="delete_btn" onClick={handleDelete}>
                    Удалить
                  </button>
                  <label htmlFor="upload-photo" className="update_photo_btn">
                    Обновить фото
                  </label>
                  <input
                    id="upload-photo"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleUpdatePhoto}
                  />
                </>
              )}
            </div>
            {/* Картинка */}
            <div className="col-12 col-md-6 order-1 order-md-2 d-flex justify-content-center align-items-center">
              <img
                src={pageData.img_url ? pageData.img_url.replace('http://localhost:9000', '/minio') : defaultImage}
                className="img-fluid speaker-image m-0"
                alt="Speaker"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="album_page_loader_block">
          <Spinner animation="border" />
        </div>
      )}
    </div>
  );
};