import { environment } from '../environments/environment';

export class AppSettings {
  public static API = {
    products: environment.apiUrl + 'products',
  };
}
