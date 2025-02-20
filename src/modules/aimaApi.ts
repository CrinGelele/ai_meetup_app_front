export interface Speaker {
    id: number;
    first_name: string;
    last_name: string;
    workplace: string;
    description: string;
    img_url: string;
  }
  export interface SpeakersResult {
    current_meetup_id: number,
    speakers_quantity: number,
    speakers: Speaker[];
  }

  export const getSpeakers = async (): Promise<SpeakersResult> => {
    return fetch('/api/api/speakers/').then(
      (response) => response.json()
    );
  };
  
  export const getSpeakerById = async (
    id: number | string
  ): Promise<Speaker> => {
    // Таймаут 5 секунд
    const timeout = 5000;
  
    // Создаем промис для таймаута
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Запрос превысил время ожидания'));
      }, timeout);
    });
  
    // Запускаем запрос и таймаут одновременно
    try {
      const response = await Promise.race([
        fetch(`/api/api/speakers/${id}/`).then((response) => response.json()),
        timeoutPromise,
      ]);
      return response;
    } catch (error) {
      throw new Error('Ошибка при загрузке данных');
    }
  };

  export interface Meetup {
    "id": number;
    "status": string;
    "user": number;
    "moderator": string;
    "creation_date": Date | null;
    "submit_date": Date | null;
    "resolve_date": Date | null;
    "topic": string;
    "meetup_date": Date | null;
    "viewers": string;
    "qr": string;
  }