import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../app.settings';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(public http: HttpClient) { }

  addProduct(body: any): Observable<any> {
    const url = AppSettings.API.products;
    return this.http.post(url, body);
  }

  getProducts(): Observable<any> {
    const url = AppSettings.API.products;
    return this.http.get(url);
  }

  updateProduct(body:any ,id:any): Observable<any> {
    const url = AppSettings.API.products + '/' + id;
    return this.http.put(url, body);
  }

  deleteProduct(id:any): Observable<any> {
    const url = AppSettings.API.products + '/' + id;
    return this.http.delete(url);
  }

}
