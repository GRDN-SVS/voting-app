import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { VoterService } from '../../services/voter.service';
import { API_URL } from '../../env';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private voter: VoterService) { 
  }

  ngOnInit(): void {
  }

  login() {
    this.voter.id = (document.getElementById('id') as HTMLInputElement).value;
    if (this.voter.id != '') {
      this.router.navigate(['vote']);
      return true;
      // const req = this.http.post(`${API_URL}/blockchain/validateVoter`, JSON.stringify({
      //   voterId: this.voter.id,
      // }),
      // {
      //   headers:{
      //     'Content-Type': 'application/json',
      //   }
      // })
      // .subscribe(
      //   res => {
      //     if (res['error'] == undefined) {
      //       this.router.navigate(['vote']);
      //       return true;
      //     }
      //     else {
      //       return false;
      //     }
      //   }
      // )
    } 
  }
}
