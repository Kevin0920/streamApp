import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MainService } from './main.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule
import { HttpModule } from '@angular/http';

import { SocialLoginModule, AuthServiceConfig } from "angular4-social-login";
import { GoogleLoginProvider } from "angular4-social-login";

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("925531526163-vkqev4lf4v1so37ta95e401d02msjfng.apps.googleusercontent.com")
  }
]);
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    SocialLoginModule.initialize(config)
  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
