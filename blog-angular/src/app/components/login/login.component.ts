import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {Router, Params, ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UserService]
})
export class LoginComponent implements OnInit {
  public page_title: string;
  public user : User;
  public status: string;
  public token;
  public identity;
  constructor(
    private _userService : UserService,
    private _router : Router,
    private _route : ActivatedRoute
  ) { 
    this.page_title = 'Identificate';
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '')
  }

  ngOnInit(): void {
    //Se ejecuta siempre  y cierra sesión solo cuando llega el parametro 'sure' desde la url;
    this.logout();
  }

  onSubmit(form){
    this._userService.signup(this.user).subscribe(
      response => {
        //token
        if(response.status != 'error'){
          this.status = 'success';
          this.token = response;
          //Objeto usuario identificado 
            this._userService.signup(this.user,true).subscribe(
              response => {
                //token
                  this.identity = response;
                  console.log(this.token);
                  console.log(this.identity);

                  //Persistir los datos del usuario identificado
                  localStorage.setItem('token', this.token);
                  localStorage.setItem('identity', JSON.stringify(this.identity));

                  //redireccion a la pagina de inicio
                  this._router.navigate(['inicio']);
              }, 
              error => {
                this.status = 'error';
                console.log(<any>error);
              }
            );
        }else{
          this.status = 'error';
          console.log(response);
        }
        
      }, 
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
    
  }

  logout(){
    this._route.params.subscribe(params =>{
      let logout = +params['sure'];

      if(logout == 1){
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = null;
        this.token = null;

        //redireccion a la pagina de inicio

        this._router.navigate(['inicio']);
      }
    })
  }

}
