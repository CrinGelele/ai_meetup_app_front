import "./speakerPage.css";
import { FC, useEffect, useState } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { useParams } from "react-router-dom";
import { Speaker, getSpeakerById } from "../modules/aimaApi";
import { Spinner } from "react-bootstrap";
import { SPEAKERS_MOCK } from "../modules/mock";
import defaultImage from "../assets/defaultImage.png";
import { useSelector } from 'react-redux';
import { inviteSpeaker } from '../slices/meetupsSlice'
import { RootState, useAppDispatch} from '../store'
import { useNavigate } from "react-router-dom";

export const AlbumPage: FC = () => {
  const [pageData, setPageDdata] = useState<Speaker>();

  const { id } = useParams(); // ид страницы, пример: "/albums/12"
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  const handleAdd = async () => {
    if (id) {
        await dispatch(inviteSpeaker(id));
        navigate(`${ROUTES.SPEAKERS}`);
    }
}

  useEffect(() => {
    if (!id) return;
    getSpeakerById(id)
      .then((response) => setPageDdata(response))
      .catch(
        () =>
          setPageDdata(
            SPEAKERS_MOCK.speakers.find(
              (speaker) => String(speaker.id) == id
            )
          ) /* В случае ошибки используем мок данные, фильтруем по ид */
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
  {pageData ? ( // проверка на наличие данных, иначе загрузка
    <div className="container">
      <div className="row page-container">
        {/* Текст */}
        <div className="col-12 col-md-6 order-2 order-md-1 text-container">
          <p className="primary-text">{pageData.first_name}</p>
          <p className="primary-text">{pageData.last_name}</p>
          <p className="secondary-text">{pageData.workplace}</p>
          <p className="info-text">{pageData.description}</p>
          <input type="text" hidden readOnly name="speaker_id" value={pageData.id} />
          {(isAuthenticated == true ) && (
            <button type="submit" className="submit_btn" onClick={() => handleAdd() }>Пригласить</button>
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