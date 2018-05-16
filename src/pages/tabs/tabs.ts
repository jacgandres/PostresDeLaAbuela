import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage,PerfilPage,ResumenPage } from "../pages.export";
 
 
@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tabHome = HomePage;
  tapResumen = ResumenPage;
  tabPerfil = PerfilPage;


}
