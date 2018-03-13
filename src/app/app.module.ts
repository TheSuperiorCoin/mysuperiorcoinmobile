import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { HttpModule, Http } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApplicationProvider } from '../providers/application/application';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { MnemonicProvider } from '../providers/mnemonic/mnemonic';
import { Crc32Provider } from '../providers/crc32/crc32';
import { CnutilProvider } from '../providers/cnutil/cnutil';
import { ConfigProvider } from '../providers/config/config';
import { NaclProvider } from '../providers/nacl/nacl';
import { VanityAddressProvider } from '../providers/vanity-address/vanity-address';
import { Base58Provider } from '../providers/base58/base58';
import { IonicStorageModule } from '@ionic/storage';
import { TransactionPage } from '../pages/transaction/transaction';
import { SendPage } from '../pages/send/send';
import { AccountPage } from '../pages/account/account';
import { ReceivePage } from '../pages/receive/receive';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AccountDetailsPage } from '../pages/account-details/account-details';

import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { QrcodePage } from '../pages/qrcode/qrcode';
import { NewPage } from '../pages/new/new';
import { TransactionInfoPage } from '../pages/transaction-info/transaction-info';
import { SendCoinProvider } from '../providers/send-coin/send-coin';
import { ImportPage } from '../pages/import/import';
import { LockScreenPage } from '../pages/lock-screen/lock-screen';
import { SettingsPage } from '../pages/settings/settings';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//import { BigIntegerProvider } from '../providers/big-integer/big-integer';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    TransactionPage,
    SendPage,
    AccountPage,
    ReceivePage,
    AccountDetailsPage,
    QrcodePage,
    NewPage,
    TransactionInfoPage,
    ImportPage,
    LockScreenPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    NgxQRCodeModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    TransactionPage,
    SendPage,
    AccountPage,
    ReceivePage,
    AccountDetailsPage,
    QrcodePage,
    NewPage,
    TransactionInfoPage,
    ImportPage,
    LockScreenPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApplicationProvider,
    MnemonicProvider,
    Crc32Provider,
    CnutilProvider,
    ConfigProvider,
    NaclProvider,
    VanityAddressProvider,
    Base58Provider,
    Clipboard,
    SocialSharing,
    BarcodeScanner,
    SendCoinProvider,
    InAppBrowser
  ]
})
export class AppModule {}
