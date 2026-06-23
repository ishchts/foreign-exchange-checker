/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { Provider } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Providers<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Returns available exchange rate data providers with their base currency.
   *
   * @name GetProviders
   * @summary Get available data providers
   * @request GET:/providers
   */
  getProviders = (params: RequestParams = {}) =>
    this.request<Provider[], any>({
      path: `/providers`,
      method: "GET",
      format: "json",
      ...params,
    });
}
