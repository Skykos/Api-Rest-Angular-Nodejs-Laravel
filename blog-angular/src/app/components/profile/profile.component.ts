import { Component, OnInit } from '@angular/core';
import {PostService} from '../../services/post.service';
import {Post} from '../../models/post';
import {global} from '../../services/global';
import { UserService } from 'src/app/services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [PostService, UserService]
})
export class ProfileComponent implements OnInit {
  public url;
  public posts: Array<Post>;
  public identity;
  public token;
  public user: User;
  
  constructor(
    private _postService : PostService,
    private _userService : UserService,
    private _router: Router,
    private _route: ActivatedRoute

  ) { 
    
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }
  

  ngOnInit(): void {
  this.getProfile();
  }

  getUser(userId){
    this._userService.getUser(userId).subscribe(
      response => {
        if(response.status == 'success'){
          this.user = response.user;
          console.log(this.user);
        }else{
          
        }
      }, 
      error => {
        console.log(error);

    });
  }

getProfile(){
  // sacar El id del post desdo la url
  this._route.params.subscribe(params => {
    let userId = +params['id'];
    console.log(userId);
  this.getUser(userId);
  this.getPosts(userId);
});
}

  getPosts(userId){
   
    this._userService.getPosts(userId).subscribe(
      response => {
        if(response.status == 'success'){
          this.posts = response.post;
          console.log(this.posts);
        }else{
          
        }
      }, 
      error => {
        console.log(error);
      });
  }

  deletepost(id){
    this._postService.delete(this.token,id).subscribe(
      response => {
        this.getProfile();

      },error =>{
        console.log(error);
      }
    )
  }

}
