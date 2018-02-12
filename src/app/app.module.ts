import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
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
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
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
  ]
})
export class AppModule {}
