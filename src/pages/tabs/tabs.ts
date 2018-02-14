import { Component } from '@angular/core';

import { HomePage } from '../home/home';

import { ApplicationProvider } from '../../providers/application/application';
import { TransactionPage } from '../transaction/transaction';
import { SendPage } from '../send/send';
import { AccountPage } from '../account/account';
import { ReceivePage } from '../receive/receive';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabHome = HomePage;
  tabTrx = TransactionPage;
  tabSend = SendPage;
  tabReceive = ReceivePage;
  tabAccount = AccountPage;
  constructor(public sApplication:ApplicationProvider) {

  }
}
