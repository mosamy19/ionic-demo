import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '../../../node_modules/@angular/http';
import { Dish } from '../../shared/dish'
import { Observable } from 'rxjs/Observable';
import { DishProvider } from '../dish/dish';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

/*
  Generated class for the FavoriteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavoriteProvider {

  favorites: Array<any>;

  constructor(public http: Http,
  private dishservice: DishProvider,
  private storage: Storage,
  private localNotifications: LocalNotifications) {
    console.log('Hello FavoriteProvider Provider');
    storage.get('favorites').then( dbFavorites => {
      if (dbFavorites) {
        this.favorites = dbFavorites;
      }
      else {
        this.favorites = [];
        console.log('favorites not defined');
      }
    });
  }

  addFavorite(id: number): boolean {
    if (!this.idFavorite(id))   {
      this.favorites.push(id);
      this.storage.remove('favorites');
      this.storage.set('favorites', this.favorites);
      // Schedule a single notification
    this.localNotifications.schedule({
      id: id,
      text: 'Dish ' + id + ' added as a favorite successfully'
    });
    }
    return true;
  }

  idFavorite(id: number): boolean {
    return this.favorites.some(el => el === id);
  }

  getFavorites(): Observable<Dish[]> {
    return this.dishservice.getDishes()
    .map(dishes => dishes.filter(dish => this.favorites.some(el => el === dish.id)));
  }

  deleteFavorite(id: number): Observable<Dish[]> {
    let index = this.favorites.indexOf(id);
    if (index >= 0) {
      this.favorites.splice(index,1);
      this.storage.remove('favorites');
      this.storage.set('favorites', this.favorites);
      return this.getFavorites();
    }
    else {
      console.log('Deleting no existing favorite:', id);
      return Observable.throw('Deleting non existance favorite ' + id);
    }
  } 

}
