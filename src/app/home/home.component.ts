import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { MainService } from './../main.service';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "angular4-social-login";
import { GoogleLoginProvider } from "angular4-social-login";
import { SocialUser } from "angular4-social-login";
import * as io from 'socket.io-client';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  user: SocialUser;
  loggedIn: boolean;
  messageText: string;
  chats: any;
  joinned: boolean = false;
  newUser = { nickname: '', room: '' };
  msgData = { room: '', nickname: '', message: '' };
  socket = io('http://localhost:8000');

  constructor(private _service: MainService, private _router: Router, private authService: AuthService) {
    this.socket = io.connect();
  }


  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log(this.user);
    });
    var user = JSON.parse(localStorage.getItem("user"));
    if (user !== null) {
      this.getChatByRoom(user.room);
      this.msgData = { room: user.room, nickname: user.nickname, message: '' }
      this.joinned = true;
      this.scrollToBottom();
    }
    this.socket.on('new-message', function (data) {
      if (data.message.room === JSON.parse(localStorage.getItem("user")).room) {
        this.chats.push(data.message);
        this.msgData = { room: user.room, nickname: user.nickname, message: '' }
        this.scrollToBottom();
      }
    }.bind(this));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getChatByRoom(room) {
    this._service.getChatByRoom(room).then((res) => {
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  joinRoom() {
    var date = new Date();
    localStorage.setItem("user", JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = { room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.joinned = true;
    this.socket.emit('save-message', { room: this.newUser.room, nickname: this.newUser.nickname, message: 'Join this room', updated_at: date });
  }

  sendMessage() {
    this._service.saveChat(this.msgData).then((result) => {
      this.socket.emit('save-message', result);
    }, (err) => {
      console.log(err);
    });
  }

  logout() {
    var date = new Date();
    var user = JSON.parse(localStorage.getItem("user"));
    this.socket.emit('save-message', { room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
    localStorage.removeItem("user");
    this.joinned = false;
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }




}
