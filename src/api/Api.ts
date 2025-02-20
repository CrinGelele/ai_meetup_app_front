/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Speaker {
  /** ID */
  id?: number;
  /**
   * First name
   * @minLength 1
   * @maxLength 35
   */
  first_name: string;
  /**
   * Last name
   * @minLength 1
   * @maxLength 35
   */
  last_name: string;
  /**
   * Workplace
   * @minLength 1
   * @maxLength 50
   */
  workplace: string;
  /** Description */
  description?: string | null;
  /** Img url */
  img_url?: string | null;
}

export interface Invite {
  /** ID */
  id?: number;
  /**
   * Meetup
   * @minLength 1
   */
  meetup?: string;
  speaker?: Speaker;
  /**
   * Approx perfomance duration
   * @min -2147483648
   * @max 2147483647
   */
  approx_perfomance_duration?: number | null;
}

export interface User {

  userId?: string;
  /**
   * Логин
   * @minLength 1
   * @maxLength 150
   */
  username: string;
  /**
   * Пароль
   * @minLength 1
   * @maxLength 128
   */
  password: string;
  /**
   * Is staff
   * @default false
   */
  is_staff?: boolean;
  /**
   * Is superuser
   * @default false
   */
  is_superuser?: boolean;
}

export interface Meetup {
  /** ID */
  id?: number;
  /**
   * Status
   * @minLength 1
   * @maxLength 15
   */
  status: string;
  /** User */
  user: number;
  /**
   * Moderator
   * @minLength 1
   */
  moderator?: string | null;
  /**
   * Creation date
   * @minLength 1
   */
  creation_date?: string;
  /**
   * Submit date
   * @minLength 1
   */
  submit_date?: string;
  /**
   * Resolve date
   * @minLength 1
   */
  resolve_date?: string;
  /** Topic */
  topic?: string | null;
  /**
   * Meetup date
   * @format date-time
   */
  meetup_date?: string | null;
  /**
   * Viewers
   * @minLength 1
   */
  viewers?: string;

  qr?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || import.meta.env.VITE_API_URL });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://192.168.1.80:8000/api
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  invites = {
    /**
     * @description Изменить приглашение
     *
     * @tags Invites
     * @name ChangeSingleInvite
     * @request PUT:/invites/{meetup_id}/{speaker_id}/
     * @secure
     */
    changeSingleInvite: (meetupId: string, speakerId: string, data: Invite, params: RequestParams = {}) =>
      this.request<Invite, any>({
        path: `/invites/${meetupId}/${speakerId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Отменить приглашение
     *
     * @tags Invites
     * @name DeleteSingleInvite
     * @request DELETE:/invites/{meetup_id}/{speaker_id}/
     * @secure
     */
    deleteSingleInvite: (meetupId: string, speakerId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/invites/${meetupId}/${speakerId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  login = {
    /**
     * No description
     *
     * @tags Accounts
     * @name LoginCreate
     * @request POST:/login/
     * @secure
     */
    loginCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/login/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        withCredentials: true,
        ...params,
      }),
  };
  logout = {
    /**
     * No description
     *
     * @tags Accounts
     * @name LogoutCreate
     * @request POST:/logout/
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  meetups = {
    /**
     * @description Получить список митапов
     *
     * @tags Meetups
     * @name GetMeetupsList
     * @request GET:/meetups/
     * @secure
     */
    getMeetupsList: (params: { start?: string, end?: string, status?: string } & RequestParams = {}) =>
      this.request<void, any>({
        path: `/meetups/`,
        method: "GET",
        secure: true,
        query: {
          start: params.start,
          end: params.end,
          status: params.status
        },
        ...params,
      }),

    /**
     * @description Сформировать митап текущего пользователя
     *
     * @tags Meetups
     * @name SubmitCurrentMeetup
     * @request PUT:/meetups/
     * @secure
     */
    submitCurrentMeetup: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/meetups/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Получить информацию о митапе
     *
     * @tags Meetups
     * @name GetSingleMeetup
     * @request GET:/meetups/{meetup_id}/
     * @secure
     */
    getSingleMeetup: (meetupId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/meetups/${meetupId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Изменить информацию о митапе
     *
     * @tags Meetups
     * @name ChangeSingleMeetup
     * @request PUT:/meetups/{meetup_id}/
     * @secure
     */
    changeSingleMeetup: (meetupId: string, data: Meetup, params: RequestParams = {}) =>
      this.request<Meetup, any>({
        path: `/meetups/${meetupId}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Удалить информацию о митапе
     *
     * @tags Meetups
     * @name DeleteSingleMeetup
     * @request DELETE:/meetups/{meetup_id}/
     * @secure
     */
    deleteSingleMeetup: (meetupId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/meetups/${meetupId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Модерировать митап
     *
     * @tags Meetups
     * @name ModerateMeetup
     * @request PUT:/meetups/{meetup_id}/moderate/
     * @secure
     */
    moderateMeetup: (meetupId: string, params: { status?: string } & RequestParams = {}) =>
      this.request<void, any>({
        path: `/meetups/${meetupId}/moderate/`,
        method: "PUT",
        secure: true,
        body: {
          status: params.status,
        },
        ...params,
      }),

    /**
     * @description Сформировать митап
     *
     * @tags Meetups
     * @name SubmitMeetup
     * @request PUT:/meetups/{meetup_id}/submit/
     * @secure
     */
    submitMeetup: (meetupId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/meetups/${meetupId}/submit/`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
  speakers = {
    /**
     * @description Получить список спикеров
     *
     * @tags Speakers
     * @name ReadSpeakersList
     * @request GET:/speakers/
     * @secure
     */
    readSpeakersList: (params: { speaker_name_to_find?: string } & RequestParams = {}) =>
      this.request<void, any>({
        path: `/speakers/`,
        method: "GET",
        secure: true,
        query: {
          speaker_name_to_find: params.speaker_name_to_find,
        },
        ...params,
      }),

    /**
     * @description Добавить нового спикера
     *
     * @tags Speakers
     * @name CreateSpeaker
     * @request POST:/speakers/
     * @secure
     */
    createSpeaker: (data: Speaker, params: RequestParams = {}) =>
      this.request<Speaker, any>({
        path: `/speakers/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить информацию о спикере
     *
     * @tags Speakers
     * @name ReadSingleSpeaker
     * @request GET:/speakers/{speaker_id}/
     * @secure
     */
    readSingleSpeaker: (speakerId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/speakers/${speakerId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Пригласить спикера на митап
     *
     * @tags Speakers
     * @name InviteSingleSpeaker
     * @request POST:/speakers/{speaker_id}/
     * @secure
     */
    inviteSingleSpeaker: (speakerId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/speakers/${speakerId}/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Изменить информацию о спикере
     *
     * @tags Speakers
     * @name EditSingleSpeaker
     * @request PUT:/speakers/{speaker_id}/
     * @secure
     */
    editSingleSpeaker: (speakerId: string, data: Speaker, params: RequestParams = {}) =>
      this.request<Speaker, any>({
        path: `/speakers/${speakerId}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Удалить данные о спикере
     *
     * @tags Speakers
     * @name DeleteSingleSpeaker
     * @request DELETE:/speakers/{speaker_id}/
     * @secure
     */
    deleteSingleSpeaker: (speakerId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/speakers/${speakerId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Добавить фото спикера
     *
     * @tags Speakers
     * @name AddSpeakerPhoto
     * @request POST:/speakers/{speaker_id}/update_image/
     * @secure
     */
    addSpeakerPhoto: (speakerId: string, formData: FormData, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/speakers/${speakerId}/update_image/`,
        method: "POST",
        secure: true,
        body: formData, // Передаем FormData
        headers: {
          "Content-Type": "multipart/form-data", // Указываем правильный Content-Type
        },
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags user
     * @name UserUserList
     * @request GET:/user/user/
     * @secure
     */
    userUserList: (params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/user/user/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserUserCreate
     * @request POST:/user/user/
     * @secure
     */
    userUserCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/user/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserUserRead
     * @request GET:/user/user/{id}/
     * @secure
     */
    userUserRead: (id: number, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/user/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserUserUpdate
     * @request PUT:/user/user/{id}/
     * @secure
     */
    userUserUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/user/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserUserPartialUpdate
     * @request PATCH:/user/user/{id}/
     * @secure
     */
    userUserPartialUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/user/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserUserDelete
     * @request DELETE:/user/user/{id}/
     * @secure
     */
    userUserDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user/user/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
