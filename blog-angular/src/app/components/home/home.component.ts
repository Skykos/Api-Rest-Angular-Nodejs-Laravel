import { Component, OnInit } from '@angular/core';
import {PostService} from '../../services/post.service';
import {Post} from '../../models/post';
import {global} from '../../services/global';
import { Subscribable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PostService, UserService]
})
export class HomeComponent implements OnInit {
  public page_title: string;
  public url;
  public posts: Array<Post>;
  public identity;
  public token;
  
  constructor(
    private _postService : PostService,
    private _userService : UserService
  ) { 
    this.page_title = 'Este es el home';
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }
  

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(){
    this._postService.getPosts().subscribe(
      response => {
        if(response.status == 'success'){
          this.posts = response.Posts;
          console.log(this.posts);
        }
      }, 
      error => {
        console.log(error);
      }
    )
  }

  deletepost(id){
    this._postService.delete(this.token,id).subscribe(
      response => {
        this.getPosts();

      },error =>{
        console.log(error);
      }
    )
  }

}
