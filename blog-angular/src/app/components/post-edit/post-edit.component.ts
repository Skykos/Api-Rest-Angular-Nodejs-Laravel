import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../../services/user.service';
import {CategoryService} from '../../services/category.service';
import {Post} from '../../models/post';
import {global} from '../../services/global';
import {PostService} from '../../services/post.service';




@Component({
  selector: 'app-post-edit',
  templateUrl: '../post-new/post-new.component.html',
  providers: [UserService, CategoryService, PostService]
})
export class PostEditComponent implements OnInit {
  public page_title: string;
  public identity;
  public token;
  public post: Post;
  public is_edit: boolean;
  public categories;
  public status;
  public url: string;



  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI:  {
      url: global.url+'post/upload',
        headers: {
      "Authorization" : this._userService.getToken()
        }
      },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    fileNameIndex: true,
    attachPinText: 'Sube tu avatar de usuario'
};

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService : CategoryService,
    private _postService : PostService

    
  ) {
    this.page_title = 'Editar Entrada';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.is_edit = true;
    this.url = global.url;
   }

  ngOnInit(): void {
    this.getcategories();
    this.post = new Post(1,this.identity.sub,1,'','','');
    this.getPost();
   
  }

  onSubmit(form){
   this._postService.update(this.token, this.post, this.post.id).subscribe(
      response => {
        if(response.status == 'success'){
          this.status = 'success';
          this.post = response.post;
          //redirecion a la pagina de inicio;
          this._router.navigate(['/entrada', this.post.id]);
        }else{
          this.status = 'error';
        }
      }, error =>{
        console.log(error);
        this.status = 'error';
      }
   );
  }

  getcategories(){
    this._categoryService.getCategories().subscribe(
      response => {
        if(response.status == 'success'){
          this.categories = response.categories;
          console.log(this.categories);
        }
      }, error =>{
        console.log(error);
      }
    );
  }

  imageUpload(data){
    let image_data= JSON.parse(data.response);
    this.post.image = image_data.image;
    
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

              if(this.post.user_id != this.identity.sub){
                
                this._router.navigate(['inicio']);
                
                

              }
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
