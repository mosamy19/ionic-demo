import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Comment } from '../../shared/comment';
/**
 * Generated class for the CommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {
  comment: FormGroup;
  _commentDate: number = Date.now(); 
  
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public viewCtrl: ViewController,
              private formBuilder: FormBuilder
  ) {
    this.comment = this.formBuilder.group({
      userName: ['', Validators.required],
      rating: 3,
      comment: ['', Validators.required],
      
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }


  onSubmit(){
    let comment: Comment;
    comment = this.comment.value;
    comment.date = this._commentDate.toString();
    console.log(this.comment.value);
    this.viewCtrl.dismiss();
  }

  
  
}
