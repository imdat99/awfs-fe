/* tslint:disable */
/* eslint-disable */

import { class2Object } from "./helper";

class Client {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        this.http = http ? http : window as any;
        this.baseUrl = baseUrl ?? "";
    }

    /**
     * @param isSolved (optional) 
     * @param title (optional) 
     * @param page (optional) 
     * @param pageSize (optional) 
     * @return Success
     */
    getProblem(isSolved: boolean | undefined, title: string | undefined, page: number | undefined, pageSize: number | undefined): Promise<ProblemPagingResponseDTO> {
        let url_ = this.baseUrl + "/api/Problem?";
        if (isSolved === null)
            throw new Error("The parameter 'isSolved' cannot be null.");
        else if (isSolved !== undefined)
            url_ += "IsSolved=" + encodeURIComponent("" + isSolved) + "&";
        if (title === null)
            throw new Error("The parameter 'title' cannot be null.");
        else if (title !== undefined)
            url_ += "Title=" + encodeURIComponent("" + title) + "&";
        if (page === null)
            throw new Error("The parameter 'page' cannot be null.");
        else if (page !== undefined)
            url_ += "Page=" + encodeURIComponent("" + page) + "&";
        if (pageSize === null)
            throw new Error("The parameter 'pageSize' cannot be null.");
        else if (pageSize !== undefined)
            url_ += "PageSize=" + encodeURIComponent("" + pageSize) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetProblem(_response);
        });
    }

    protected processGetProblem(response: Response): Promise<ProblemPagingResponseDTO> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ProblemPagingResponseDTO.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ProblemPagingResponseDTO>(null as any);
    }

    /**
     * @param isResolveNow (optional) 
     * @param body (optional) 
     * @return Success
     */
    addProblem(isResolveNow: boolean | undefined, body: ProblemDTO | undefined): Promise<boolean> {
        let url_ = this.baseUrl + "/api/Problem?";
        if (isResolveNow === null)
            throw new Error("The parameter 'isResolveNow' cannot be null.");
        else if (isResolveNow !== undefined)
            url_ += "isResolveNow=" + encodeURIComponent("" + isResolveNow) + "&";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "text/plain"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processAddProblem(_response);
        });
    }

    protected processAddProblem(response: Response): Promise<boolean> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = resultData200 !== undefined ? resultData200 : <any>null;
    
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<boolean>(null as any);
    }

    /**
     * @return Success
     */
    getProblemById(id: number): Promise<ProblemDTO> {
        let url_ = this.baseUrl + "/api/Problem/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetProblemById(_response);
        });
    }

    protected processGetProblemById(response: Response): Promise<ProblemDTO> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ProblemDTO.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ProblemDTO>(null as any);
    }

    /**
     * @return Success
     */
    removeProblem(id: number): Promise<boolean> {
        let url_ = this.baseUrl + "/api/Problem/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "DELETE",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processRemoveProblem(_response);
        });
    }

    protected processRemoveProblem(response: Response): Promise<boolean> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = resultData200 !== undefined ? resultData200 : <any>null;
    
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<boolean>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    updateProblem(id: number, body: ProblemDTO | undefined): Promise<boolean> {
        let url_ = this.baseUrl + "/api/Problem/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: RequestInit = {
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "text/plain"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processUpdateProblem(_response);
        });
    }

    protected processUpdateProblem(response: Response): Promise<boolean> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = resultData200 !== undefined ? resultData200 : <any>null;
    
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<boolean>(null as any);
    }

    /**
     * @return Success
     */
    resolve(id: number): Promise<number> {
        let url_ = this.baseUrl + "/api/Problem/resolve/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processResolve(_response);
        });
    }

    protected processResolve(response: Response): Promise<number> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = resultData200 !== undefined ? resultData200 : <any>null;
    
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<number>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    remove(body: number[] | undefined): Promise<boolean> {
        let url_ = this.baseUrl + "/api/Problem/remove";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "text/plain"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processRemove(_response);
        });
    }

    protected processRemove(response: Response): Promise<boolean> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = resultData200 !== undefined ? resultData200 : <any>null;
    
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<boolean>(null as any);
    }
}

export class ProblemDTO implements IProblemDTO {
    id?: number;
    title?: string | undefined;
    result?: number | undefined;
    row?: number;
    col?: number;
    chestTypes?: number | undefined;
    matrix?: number[][] | undefined;

    constructor(data?: IProblemDTO) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.title = _data["title"];
            this.result = _data["result"];
            this.row = _data["row"];
            this.col = _data["col"];
            this.chestTypes = _data["chestTypes"];
            if (Array.isArray(_data["matrix"])) {
                this.matrix = [] as any;
                for (let item of _data["matrix"])
                    this.matrix!.push(item);
            }
        }
    }

    static fromJS(data: any): ProblemDTO {
        data = typeof data === 'object' ? data : {};
        let result = new ProblemDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["title"] = this.title;
        data["result"] = this.result;
        data["row"] = this.row;
        data["col"] = this.col;
        data["chestTypes"] = this.chestTypes;
        if (Array.isArray(this.matrix)) {
            data["matrix"] = [];
            for (let item of this.matrix)
                data["matrix"].push(item);
        }
        return data;
    }
}

export interface IProblemDTO {
    id?: number;
    title?: string | undefined;
    result?: number | undefined;
    row?: number;
    col?: number;
    chestTypes?: number | undefined;
    matrix?: number[][] | undefined;
}

export class ProblemPagingDTO implements IProblemPagingDTO {
    id?: number;
    title?: string | undefined;
    result?: number | undefined;

    constructor(data?: IProblemPagingDTO) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.title = _data["title"];
            this.result = _data["result"];
        }
    }

    static fromJS(data: any): ProblemPagingDTO {
        data = typeof data === 'object' ? data : {};
        let result = new ProblemPagingDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["title"] = this.title;
        data["result"] = this.result;
        return data;
    }
}

export interface IProblemPagingDTO {
    id?: number;
    title?: string | undefined;
    result?: number | undefined;
}

export class ProblemPagingResponseDTO implements IProblemPagingResponseDTO {
    items?: ProblemPagingDTO[] | undefined;
    totalCount?: number;
    currentPage?: number;
    totalPage?: number;

    constructor(data?: IProblemPagingResponseDTO) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            if (Array.isArray(_data["items"])) {
                this.items = [] as any;
                for (let item of _data["items"])
                    this.items!.push(ProblemPagingDTO.fromJS(item));
            }
            this.totalCount = _data["totalCount"];
            this.currentPage = _data["currentPage"];
            this.totalPage = _data["totalPage"];
        }
    }

    static fromJS(data: any): ProblemPagingResponseDTO {
        data = typeof data === 'object' ? data : {};
        let result = new ProblemPagingResponseDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (Array.isArray(this.items)) {
            data["items"] = [];
            for (let item of this.items)
                data["items"].push(item.toJSON());
        }
        data["totalCount"] = this.totalCount;
        data["currentPage"] = this.currentPage;
        data["totalPage"] = this.totalPage;
        return data;
    }
}

export interface IProblemPagingResponseDTO {
    items?: ProblemPagingDTO[] | undefined;
    totalCount?: number;
    currentPage?: number;
    totalPage?: number;
}

export class ApiException extends Error {
    override message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isApiException = true;

    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new ApiException(message, status, response, headers, null);
}

const client = class2Object(new Client("https://demo.dat09.fun"));
export default client as Client;