import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../Models/user';
import {global} from '../../services/global';
import {TopicService} from '../../services/topic.service';
import {Topic} from '../../Models/topic';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, TopicService]
})
export class ProfileComponent implements OnInit {
  public url : string;
  public user : User;
  public topics : Topic[];
  public page_title : string;

  constructor(
    private _userService : UserService,
    private _topicService : TopicService,
    private _router : Router,
    private _route : ActivatedRoute

  ) 
  {
    this.url = global.url;
    this.page_title = 'Perfil'
  }

  ngOnInit(): void {

    this._route.params.subscribe(
      params =>{
        var userId = params['id'];
        this.getUser(userId);
        this.getTopics(userId);
      });
    
  }

  getUser(userId){
    this._userService.getUser(userId).subscribe(
      response => {

        if(response.User){
          this.user = response.User;
           // Redireccion
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  getTopics(userId){
    this._topicService.getMyTopicsByUser(userId).subscribe(
      response =>{
        if(response.topics){
          this.topics = response.topics;
        }
      }, 
      error=>{
        console.log(error);
      }
    );
  }
}
