import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
  }

  isValidEmail = (email: any) => {

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email.match(emailRegex)) {
      return true;
    } else {
      return false;
    }

  }

  matchPassword = (password: any, confirmPassword: any) => {

    if (password === confirmPassword) {
      return true;
    } else {
      return false;
    }

  }

  signUp(): void {

    let newUser = this.signUpForm.getRawValue()
    // console.log(newUser)

    if (newUser.name == '' || newUser.email == '' || newUser.password == '') {

      Swal.fire('Error', "Please enter all the flieds", "error")

    } else if (!this.isValidEmail(newUser.email)) {

      Swal.fire('Error', "Please enter a valid email adress", "error")

    } else if (!this.matchPassword(newUser.password, newUser.confirmPassword)) {

      Swal.fire('Error', "Password is not matched", "error")

    } else {

      this.http.post('http://localhost:3000/signup', newUser, {
        withCredentials: true
      }).subscribe(
        () => this.router.navigate(['/qrcode']),
        (err) => {
          console.log(err); // add this line to log the error message
          Swal.fire('Error', err.error.message, 'error')
        }
      );
    }

  }


  openLoginForm(){
    this.router.navigate(['/login'])
  }


}
