/**
 * @module rx-jupyter
 */
import Cookies from "js-cookie";
import { AjaxRequest } from "rxjs/ajax";

export const normalizeBaseURL = (url = "") => url.replace(/\/+$/, "");

export interface ServerConfig extends Partial<AjaxRequest> {
  endpoint?: string;
  url?: string;
  token?: string;
  xsrfToken?: string;
}

/**
 * Creates an AJAX request to connect to a given server. This function
 * handles setting the authorization tokens on the request.
 * 
 * @param serverConfig Details about the server to connect to.
 * @param uri The URL to connect to, not including the base URL
 * @param opts A set of options to pass to the AJAX request.
 * 
 * @returns A fully-configured AJAX request for connecting to the server.
 */
export const createAJAXSettings = (
  serverConfig: ServerConfig,
  uri = "/",
  opts: Partial<AjaxRequest> = {}
): AjaxRequest => {
  const baseURL = normalizeBaseURL(serverConfig.endpoint || serverConfig.url);
  const url = `${baseURL}${uri}`;
  // Use the server config provided token if available before trying cookies
  const xsrfToken = serverConfig.xsrfToken || Cookies.get("_xsrf");
  const headers = {
    "X-XSRFToken": xsrfToken,
    Authorization: `token ${serverConfig.token ? serverConfig.token : ""}`
  };

  // Merge in our typical settings for responseType, allow setting additional
  // options like the method
  const settings = {
    url,
    responseType: "json",
    createXHR: () => new XMLHttpRequest(),
    ...serverConfig,
    ...opts,
    // Make sure we merge in the auth headers with user given headers
    headers: { ...headers, ...opts.headers }
  };
  delete settings.endpoint;
  return settings;
};
