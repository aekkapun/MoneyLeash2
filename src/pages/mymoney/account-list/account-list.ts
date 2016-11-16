import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

// app pages
import { AccountPage } from '../account/account';
import { TransactionsPage } from '../transaction-list/transaction-list';

// services
import {UserData} from '../../../providers/user-data';

@Component({
  selector: 'page-account-list',
  templateUrl: 'account-list.html'
})

export class AccountListPage {

  navbarcolor: string;
  dividercolor: string;
  groupedAccounts = [];
  networth: any;

  constructor(
      public nav: NavController,
      public alertController: AlertController,
      public userData: UserData) {

        this.navbarcolor = this.userData.user.navbarcolor;
        this.dividercolor = this.userData.user.dividercolor;

      }

  ionViewDidLoad() {

    this.userData.getAllAccounts().on('value', (accounts) => {

      var that = this;
      this.groupedAccounts = [];
      let currentAccounts = [];
      let currenttype = false;
      let clearedBal = 0;
      let netWorth = 0;

      accounts.forEach( spanshot => {

        var account = spanshot.val();

        let tempAccount = ({
          $key: spanshot.key,
          accountname: account.accountname,
          accounttype: account.accounttype,
          autoclear: account.autoclear,
          balanceclass: account.balanceclass,
          balancecleared: account.balancecleared,
          balancecurrent: account.balancecurrent,
          balancetoday: account.balancetoday,
          dateopen: account.dateopen,
          transactionid: account.transactionid
        });

        // Calculate Net Worth
        tempAccount.balanceclass = '';
        clearedBal = parseFloat(tempAccount.balancecleared);
        netWorth = netWorth + clearedBal;
        if (clearedBal > 0) {
          tempAccount.balanceclass = 'textGreen';
        } else if (clearedBal < 0){
          tempAccount.balanceclass = 'textRed';
        } else {
          tempAccount.balanceclass = 'textBlack';
        }
        //
        // Add grouping functionality
        //
        if(tempAccount.accounttype != currenttype){
          currenttype = tempAccount.accounttype;
          let newGroup = {
            acctype: currenttype,
            accounts: []
          };
          currentAccounts = newGroup.accounts;
          that.groupedAccounts.push(newGroup);
        }
        currentAccounts.push(tempAccount);
      });
      this.userData.dismissLoadingController();
    });

  }

  viewtransactions (account) {
    this.userData.showLoadingController();
    this.nav.push(TransactionsPage, {paramAccount: account});
  }

  newAccount() {
    var account = {
          '$key': '',
          'accountname': '',
          'accounttype': '',
          'BalanceClass': '',
          'balancecleared': '',
          'balancetoday': '',
          'dateopen': '',
          'mode': 'New'
        }
    this.nav.push(AccountPage, {paramAccount: account});
  }

  edit(slidingItem, account) {
    this.handleSlidingItems(slidingItem);
    this.nav.push(AccountPage, {paramAccount: account});
  }

  delete(slidingItem, account) {
    this.handleSlidingItems(slidingItem);
    let alert = this.alertController.create({
      title: 'Delete Account',
      message: 'Are you sure you want to delete ' + account.accountname + ' and ALL the transactions?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            //console.log('Cancel RemoveUser clicked');
            slidingItem.close();
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.userData.deleteAccount(account);
          }
        }
      ]
    });
    alert.present();
  }

  handleSlidingItems(slidingItem) {
    // Close any open sliding items when the page updates
    slidingItem.close();
  }

  fixAccountData(account) {
    this.userData.fixAccountData(account);
  }
  
}