import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Category} from '../../models/category';
import {CategoryService} from '../../services/category.service';
import {UserService} from '../../services/user.service';
import {PostService} from '../../services/post.service';
import {global} from '../../services/global';


@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [CategoryService, UserService, PostService]
})
export class CategoryDetailComponent implements OnInit {

  public page_title: string;
  public category:Category;
  public posts: any;
  public url: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService : UserService,
    private _categoryService: CategoryService,
    private _postService : PostService


  ) { 
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getPostByCategory();
  }

  getPostByCategory(){
    this._route.params.subscribe(params =>{
      let id = params['id'];
      this._categoryService.getCategory(id).subscribe(response =>{
        if(response.status == 'success'){
          this.category = response.category;
          
          this._categoryService.getPost(id).subscribe(
            response => {
              if(response.status == 'success'){
                this.posts = response.post;
              }else{
                this._router.navigate(['/inicio']);
              }
              
             
            },error=>{console.log(error)}

          );
        }else{
          this._router.navigate(['/inicio']);
        }
      },error=>{
        console.log(error);
      })
    })
  };

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
