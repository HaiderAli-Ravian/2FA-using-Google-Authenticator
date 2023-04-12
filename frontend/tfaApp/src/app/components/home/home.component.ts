import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Emitters } from 'src/app/emitters/emitter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  message: string = '';

  constructor(private http:HttpClient){}

  ngOnInit(): void {
   
    this.http
    .get('http://localhost:3000/user', {withCredentials:true})
    .subscribe(
      (res:any) => {
        this.message = `Hi ${res.name}`;
        Emitters.authEmitter.emit(true);
      },
      (err) => {
        this.message = "your Login details are Wrong, Kindly Login with correct details";
        Emitters.authEmitter.emit(false);
      }
    )

  }

}
