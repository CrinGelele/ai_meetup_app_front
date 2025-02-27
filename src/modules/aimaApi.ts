export interface Speaker {
    id?: number | undefined;
    first_name: string;
    last_name: string;
    workplace: string;
    description?: string | null | undefined;
    img_url?: string | null | undefined;
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
    "id"?: number | undefined;
    "status": string;
    "user": number;
    "moderator"?: string | null | undefined;
    "creation_date"?: string | undefined | null;
    "submit_date"?: string | undefined | null;
    "resolve_date"?: string | undefined | null;
    "topic"?: string | null | undefined;
    "meetup_date"?: string | undefined | null;
    "viewers"?: string | undefined;
    "qr"?: string | undefined;
  }