import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  form: FormGroup;
 
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {}
 
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: '',
      verificationCode: ''
    });
  }
 
  ValidateEmail = (email: any) => {
 
    var validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email.match(validRegex)) {  
  
      return true;
  
    } else {
  
      return false;
  
    }
  
  }
 
  submit(): void {
 
    let user = this.form.getRawValue();
 
    if (user.email == '' || user.password == '') {

      Swal.fire('Error', 'Please enter all the fields', 'error');
 
    }else if(!this.ValidateEmail(user.email)){
 
      Swal.fire('Error', 'Please enter a valid email address', 'error');
 
    } else {
 
      this.http
        .post('http://localhost:3000/login', user, {
          withCredentials: true,
        })
        .subscribe(
          (res) => {
            this.router.navigate(['/home'])
          },
          (err) => {
            Swal.fire('Error', err.error.message, 'error');
          }
        );
    }
  }


  openSignUpForm(){
    this.router.navigate(['/signup']);
  }


}
