import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { VoterService } from '../../services/voter.service';
import { API_URL } from '../../env';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class LoginComponent implements OnInit {

  public success: Boolean;  // BORRAR
  public modalTitle: string;
  public modelContent: string;

  constructor(public router: Router, private http: HttpClient, private voter: VoterService, config: NgbModalConfig, private modalService: NgbModal) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  open(content) {
    this.modalService.open(content);
  }

  login(content) {
    this.voter.id = (document.getElementById('id') as HTMLInputElement).value;
    if (this.voter.id != '') {
      this.success = true;  // BORRAR
      this.modalTitle = "Titulo :D"
      this.modelContent = "HELLOO"
      this.modalService.open(content);

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
      //       this.modalTitle = "Ups, Ocurrió un error";
      //       this.modelContent = res['error'];
      //       this.modalService.open(content);
      //     }
      //   }
      // )
    } 
  }
}
