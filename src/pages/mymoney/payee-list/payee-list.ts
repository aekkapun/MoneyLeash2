import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

// firebase
import { FirebaseListObservable } from 'angularfire2';

// app pages
import { PayeePage } from '../payee/payee';

// services
import {UserData} from '../../../providers/user-data';

@Component({
  templateUrl: 'payee-list.html'
})

export class PayeeListPage {
  
  navbarcolor: string;
  dividercolor: string;
  payees: FirebaseListObservable<any>;
  groupedPayees = [];

  constructor(
      public nav: NavController,
      public alertController: AlertController,
      public userData: UserData) {

        this.navbarcolor = this.userData.user.navbarcolor;
        this.dividercolor = this.userData.user.dividercolor;
        
      }
  
  ionViewDidLoad() {

    this.userData.getAllPayees().on('value', (payees) => { 

      var that = this;
      this.groupedPayees = [];
      let currentPayees = [];
      let currentLetter = false;

      payees.forEach( spanshot => {

        let payee = spanshot.val();
        let tempPayee = ({
          $key: spanshot.key,
          payeename: payee.payeename
        });

        if(tempPayee.payeename.charAt(0) != currentLetter){
          currentLetter = tempPayee.payeename.charAt(0);
          let newGroup = {
            letter: currentLetter,
            payees: []
          };
          currentPayees = newGroup.payees;
          that.groupedPayees.push(newGroup);
        }
        currentPayees.push(tempPayee);

      })

    });
    
    /*var that = this;
    this.userData.getAllPayees()
    .subscribe( allpayees => {
      let currentLetter = false;
      let currentContacts = [];
      allpayees.forEach(payee => {
        var tempPayee = ({
          $key: payee.$key,
          payeename: payee.payeename
        });        
        if(tempPayee.payeename.charAt(0) != currentLetter){
          currentLetter = tempPayee.payeename.charAt(0);
          let newGroup = {
            letter: currentLetter,
            payees: []
          };
          currentContacts = newGroup.payees;
          that.groupedPayees.push(newGroup);
        }
        currentContacts.push(tempPayee);
      });
    });*/

  }
  
  newPayee() {
    var payee = {
          '$key': '',
          'categoryname': '',
          'categoryparent': '',
          'categorysort': '',
          'categorytype': '',
          'mode': 'New'
        }
    this.nav.push(PayeePage, {paramPayee: payee});
  }

  edit(slidingItem, payee) {
    this.handleSlidingItems(slidingItem);
    this.nav.push(PayeePage, {paramPayee: payee});
  }

  delete(slidingItem, payee) {
    let alert = this.alertController.create({
      title: 'Delete Payee',
      message: 'Are you sure you want to delete ' + payee.payeename + ' and ALL the transactions?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            //console.log('Cancel RemoveUser clicked');
            this.handleSlidingItems(slidingItem);
          }
        },
        {
          text: 'Delete',
          cssClass: 'alertDanger',
          handler: () => {
            this.handleSlidingItems(slidingItem);
            this.userData.deletePayee(payee);
          }
        }
      ]
    });
    alert.present();
  }

  showTransactions() {
    console.log('TO DO: show transactions view');
  }

  handleSlidingItems(slidingItem) {
    // Close any open sliding items when the page updates
    slidingItem.close();
  }
  
}