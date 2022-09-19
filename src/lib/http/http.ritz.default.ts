/* Jovian (c) 2020, License: MIT */
import { PostfixReturn, ritzIfaceGuard, TaggedTemplateSelfChain } from 'ritz2';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import Express from 'express';
import { Server } from "http";
import { HttpFinalizerExpress } from './http.model';

type ExpressServer = Express.Express & { server?: Server, start?: () => ExpressServer, stop?: () => ExpressServer };

class httpModel {

  static get<T = any, D = any>(config: AxiosRequestConfig<D>): PostfixReturn<AxiosResponse<T>>;
  static get<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): PostfixReturn<AxiosResponse<T>>;
  static get<T = any, D = any>(strArr: TemplateStringsArray, ...args: any[]): TaggedTemplateSelfChain<PostfixReturn<AxiosResponse<T>>>;
  static get(...args) { ritzIfaceGuard('lugger:http:get', __filename); return null; }

  static post<T = any, D = any>(config: AxiosRequestConfig<D>): PostfixReturn<AxiosResponse<T>>;
  static post<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): PostfixReturn<AxiosResponse<T>>;
  static post(...args) { ritzIfaceGuard('lugger:http:post', __filename); return null; }

  static put<T = any, D = any>(config: AxiosRequestConfig<D>): PostfixReturn<AxiosResponse<T>>;
  static put<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): PostfixReturn<AxiosResponse<T>>;
  static put(...args) { ritzIfaceGuard('lugger:http:put', __filename); return null; }

  static delete<T = any, D = any>(config: AxiosRequestConfig<D>): PostfixReturn<AxiosResponse<T>>;
  static delete<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): PostfixReturn<AxiosResponse<T>>;
  static delete(...args) { ritzIfaceGuard('lugger:http:delete', __filename); return null; }

  static options<T = any, D = any>(config: AxiosRequestConfig<D>): PostfixReturn<AxiosResponse<T>>;
  static options<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): PostfixReturn<AxiosResponse<T>>;
  static options(...args) { ritzIfaceGuard('lugger:http:options', __filename); return null; }

  static getContent<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): PostfixReturn<AxiosResponse<T>>;
  static getContent<T = any, D = any>(strArr: TemplateStringsArray, ...args: any[]): TaggedTemplateSelfChain<PostfixReturn<AxiosResponse<T>>>;
  static getContent(...args) { ritzIfaceGuard('lugger:http:getContent', __filename); return null; }

  static server<T = any, D = any>(port: number, type?: 'express'): PostfixReturn<ExpressServer>;
  static server(...args) { ritzIfaceGuard('lugger:http:server', __filename); return null; }

  static finalizer = class {
    static express = HttpFinalizerExpress;
  };
}

export const http = httpModel as (typeof httpModel & (<T = any, D = any>(url: string, config?: AxiosRequestConfig<any>) => PostfixReturn<AxiosResponse<T>>));
