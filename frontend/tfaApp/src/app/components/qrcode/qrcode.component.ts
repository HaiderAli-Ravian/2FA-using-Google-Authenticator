import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})

export class QrcodeComponent implements OnInit {

  form: FormGroup;
  qrCodeUrl: string;
  userCode: number;
 
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}
 

  ngOnInit() {

    this.http.get('http://localhost:3000/qrcode', {withCredentials:true}).subscribe(
      (data: any) => {
        this.qrCodeUrl = data.qrCodeString;
        console.log('QR code URL received:', this.qrCodeUrl);
      },
      (error) => {
        console.error('Error receiving QR code URL:', error);
      }
    );

    this.form = this.formBuilder.group({
      verificationCode: String
    });

  }



  submit(): void {
 
    let user = this.form.getRawValue();

    this.userCode = user.verificationCode;
 
    this.http.post('http://localhost:3000/qrcode/verify', { verificationCode: this.userCode }, {
      withCredentials: true
    }).subscribe(
      () => this.router.navigate(['/']),
      (err) => {
        console.log(err); 
        Swal.fire('Error', err.error.message, 'error')
      }
    );
  }


}
