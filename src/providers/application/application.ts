import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

/*
  Generated class for the ApplicationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApplicationProvider {
  remotePath:string = "https://mysuperiorcoin.com:1984";

  address:string = "5Q9EiDmY9ExftqJYUE2Gvi8WqsBfUnUVkRpsUJLaWLszfBbB6PihJiXYwcnkHRVEQZ1vqkFDRZpMNKMGytPXs2g7V12YZNp";
  viewKey:string =  "5a7391be3d2d89c160cb746fa83b57a1cecf516ee2ee1a72b782208bbd2d0d03";

  constructor(public http: HttpClient) {
    console.log('Hello ApplicationProvider Provider');
  }

  login() {
    let headers = new Headers(
      {
        'Content-Type' : 'application/json'
      });
      let options:any = new RequestOptions({ headers: headers });
      
    
    let data:any = {
      address: this.address, 
      view_key: this.viewKey,
      withCredentials: true,
      create_account: false
    };
    data = JSON.stringify(data);
    return new Promise((resolve, reject) => {
      this.http.post(this.remotePath+'/login', data, options).toPromise().then((response) =>
      {
        //let res = JSON.parse(response['_body']);
        let res = response;
        console.log(res);
        resolve(res);
      }) 
      .catch((error) =>
      {
        console.log(error);
        reject(error);
      });
    });
  }
  addressInfo() {
    let headers = new Headers(
      {
        'Content-Type' : 'application/json'
      });
      let options:any = new RequestOptions({ headers: headers });
      
    
    let data:any = {
      address: this.address, 
      view_key: this.viewKey
    };
    data = JSON.stringify(data);
    return new Promise((resolve, reject) => {
      this.http.post(this.remotePath+'/get_address_info', data, options).toPromise().then((response) =>
      {
        //let res = JSON.parse(response['_body']);
        let res = response;
        console.log(res);
        //console.log(response.json());
        resolve(res);
      }) 
      .catch((error) =>
      {
        console.log(error);
        reject(error);
      });
    });
  }

}
