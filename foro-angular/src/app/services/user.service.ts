import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { User } from '../Models/user';
import {global} from '../services/global';

@Injectable()
export class UserService{
    public url: string;
    public identity;
    public token;
    constructor(private _http: HttpClient){
        this.url = global.url;
    }
     
    prueba(){
        return 'Hola mundo soy un servicio';
    }
    
    register(user):Observable<any>{
        //Convertir el objeto del usuario a un json string 
        let params = JSON.stringify(user);
        //Definir las cabeceras
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        //HAcer peticion ajax
        return this._http.post(this.url+'register', params, {headers: headers});
    }   

    signup(user, gettoken = null):Observable<any> {
        //Comprobar si llega el token
        if(gettoken != null){
            user.gettoken = gettoken;
        }
        //Convertir el objeto del usuario a un json string
        let params = JSON.stringify(user);
        //Definir cabeceras
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        //HAcer peticion ajax
        return this._http.post(this.url+'login',params,{headers:headers});
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity && identity != null && identity != undefined && identity != "undefined"){
            this.identity = identity;
        }else{
            this.identity = null;
        }

        return this.identity;
    }

    getToken(){
        let token = localStorage.getItem('token');

        if(token && token != null && token != undefined && token != "undefined"){
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token;
    }

    update(user):Observable<any>{
        let params = JSON.stringify(user);

        let headers =  new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());

        return this._http.put(this.url+'update_user',params,{headers:headers});
    }

    getUsers():Observable<any>{
        //let headers = new HttpHeaders().set('Content-Type','application/json');

        return this._http.get(this.url+'users');
                                  
    }

    getUser(id):Observable<any>{
       // let headers = new HttpHeaders().set('Content-Type','application/json');

        return this._http.get(this.url+'user/'+id);
                                  
    }
}