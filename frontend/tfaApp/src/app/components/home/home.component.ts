import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/emitters/emitter';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  message: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {

    // this.http.get('http://localhost:3000/home/verify', {
    //   withCredentials: true
    // }).subscribe(
    //   () => this.router.navigate(['/home']),
    //   (err) => {
    //     console.log(err); 
    //     // Swal.fire('Error', err.error.message, 'error')
    //     this.router.navigate(['/login'])
    //   }
    // );

    // this.http.get('http://localhost:3000/home', {
    //   headers: {
    //     'Authorization': 'Bearer ' + this.cookieService.get('jwt')
    //   },
    //   withCredentials: true
    // }).subscribe(
    //   () => this.router.navigate(['/home']),
    //   (err) => {
    //     console.log(err);
    //     this.router.navigate(['/login'])
    //   }
    // );


    this.http
      .get('http://localhost:3000/user', { withCredentials: true })
      .subscribe(
        (res: any) => {
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
