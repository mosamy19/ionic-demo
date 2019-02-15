import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController } from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { CommentPage } from '../comment/comment';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the DishdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              @Inject('BaseURL') private BaseURL,
            private favoriteService: FavoriteProvider,
            private toastCtrl: ToastController,
            private actionsheetCtrl: ActionSheetController,
            private modalCtrl: ModalController,
            private socialSharing: SocialSharing
            ) {
                this.dish = navParams.get('dish');
                this.favorite = this.favoriteService.isFavorite(this.dish.id);
                this.numcomments = this.dish.comments.length;
                let total = 0;
                this.dish.comments.forEach(comment => total += comment.rating);
                this.avgstars = (total/this.numcomments).toFixed(2);
              }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorite() {
    console.log("Added to fav", this.dish.id);
    this.favorite = this.favoriteService.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: "Dish " + this.dish.id + " added as a favorite successfully",
      duration: 3000
    }).present();

  }

  presentActionSheet() {
    let actionsheet = this.actionsheetCtrl.create({
      buttons: [
        {
          text: "Add to favorite",
          handler: () => {
            this.addToFavorite();
          }
        },
        {
          text: "Add a comment",
          handler: () => {
            this.openComment();
          }
        },
        {
          text: "Share via Facebook",
          handler: () => {
            this.socialSharing.shareViaFacebook(
              this.dish.name + " -- " + this.dish.description,
              this.BaseURL + this.dish.image, '')
              .then(() => {
                console.log("Posted successfully to facebook;")
              })
              .catch(() => console.log('Failed to post to facebook'))
          }
        },
        {
          text: "Share via Twitter",
          handler: () => {
            this.socialSharing.shareViaTwitter(
              this.dish.name + " -- " + this.dish.description,
              this.BaseURL + this.dish.image, '')
              .then(() => {
                console.log("Posted successfully to twitter;")
              })
              .catch(() => console.log('Failed to post to twitter'))
          }

        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancelled");
          }
        }
      ]
    });
    actionsheet.present();
  }
  openComment() {
    let modal = this.modalCtrl.create(CommentPage);
    modal.onDidDismiss(
      comment => {
        if (null != comment) {
          this.dish.comments.push(comment);
          this.setDishDetailSummary();
        }
    })
    modal.present();
  }


  setDishDetailSummary() {
    this.numcomments = this.dish.comments.length;

    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating);
    this.avgstars = (total / this.numcomments).toFixed(2);
  }
}
