import { Component, OnInit } from '@angular/core';
import {Post} from '../../models/post';
import {global} from '../../services/global';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {PostService} from '../../services/post.service';
import {UserService} from '../../services/user.service';


@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [PostService, UserService]
})
export class PostDetailComponent implements OnInit {

  public post: any;
  public url;
  public identity;
  constructor(
    private _postService: PostService,
    private _route : ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.url = global.url;
    this.identity = this._userService.getIdentity();
   }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(){
    // sacar El id del post desdo la url
    this._route.params.subscribe(params => {
      let id = +params['id'];
      console.log(id);

      //Peticion ajax para sacar los datos del post
      this._postService.getPost(id).subscribe(
        response => {
          if(response.status == 'success'){
              this.post = response.Post;
              console.log(this.post);
          }else{
            this._router.navigate(['inicio']);
          }
        }, error =>{
          console.log(error)
          this._router.navigate(['inicio']);
        }
      )
    });
  }

}
