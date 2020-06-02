import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { VoterService } from '../../services/voter/voter.service';
import { API_URL } from '../../env';

import { Candidate } from '../../models/candidate.model';

import { Encrypter } from '../../services/crypto/encrypter.sevice';
import { ScrutinizerService } from '../../services/scrutinizer/scrutinizer.service';

import { box, randomBytes } from 'tweetnacl';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css'],
  providers: [NgbModalConfig, NgbModal]
})

export class VoteComponent implements OnInit {
  
  private id: string;
  public modalTitle: string;
  public modelContent: string;
  public success: Boolean;
  scrutinizer: ScrutinizerService;

  constructor(public router: Router, private http: HttpClient, private voter: VoterService, config: NgbModalConfig, private modalService: NgbModal) {
    this.scrutinizer = new ScrutinizerService(this.http);
    
    config.backdrop = 'static';
    config.keyboard = false;
  }

  async ngOnInit(): Promise<void> {
    this.id = this.voter.id;
  }

  private scrutinizerPublicKey;

  candidatos = this.getCandidates();

  getCandidates() {
    let candidates = [];
    let result: any;
    const req = this.http.get(`${API_URL}/election/getOptions`)
    .subscribe(
      res => {
        if (res['error'] == undefined) {
          result= Array(res)[0];
          result.forEach(option => {
            candidates.push(new Candidate(option['option_id'], option['name'], option['date_birth'], option['nombre'], option['party'], option['background'], option['proposals']))
          });
        }
        else {
          return [];
        }
      }
    )
    return candidates;
  }

  async vote(candidate: Candidate, content) {
    const encrypter = new Encrypter(this.http);

    // Encriptar voto
    const idAndNonce = await encrypter.getIdAndNonce();
    const nonceId = idAndNonce['id'];
    const nonce: Uint8Array = idAndNonce['nonce'] as Uint8Array;
    const scrutinizerPublicKey: Uint8Array = await this.scrutinizer.requestPublicKey() as Uint8Array;
    
    let encryptedVote = encrypter.seal(candidate.option_id, nonce, scrutinizerPublicKey);

    const req2 = this.http.post(`${API_URL}/vote/submitVote`, JSON.stringify({
      nonceId: nonceId,
      encryptedVote: Array.from(encryptedVote),
      electionId: 1234,
      clientPublicKey: Array.from(encrypter.publicKey)
    }), 
    {
      headers:{
        'Content-Type': 'application/json',
      }
    })
    .subscribe(
      res2 =>{
        if (res2['error'] == undefined) {
          // Voto almacenado
          this.success = true;
          this.modalTitle = "Votación Exitosa";
          this.modelContent = "Su voto se ha registrado exitosamente!";
          this.modalService.open(content);
        }
        else {
          // No se pudo mandar el voto al jurado
          this.success = false;
          this.modalTitle = "Ups, ocurrió un error";
          this.modelContent = res2['error'];
          this.modalService.open(content);
        }
      }
    );

    // const req = this.http.post(`${API_URL}/blockchain/castBallot`, JSON.stringify({
    //   voterId: this.id,
    //   electionId: "1234", // HACER REQUEST A queryWithQueryString
    // }),
    // {
    //   headers:{
    //     'Content-Type': 'application/json',
    //   }
    // })
    // .subscribe(
    //   res => {
    //     if (res['error'] == undefined) {
    //       // Encriptar voto
    //       const idAndNonce = await encrypter.getIdAndNonce();
    //       const nonceId = idAndNonce['id'];
    //       const nonce = idAndNonce['nonce'];
          
    //       let encryptedVote = encrypter.seal(candidate.id, nonce, this.scrutinizerPublicKey);

    //       const req2 = this.http.post(`${API_URL}/submitVote`, JSON.stringify({
    //         nonceId: nonceId,
    //         encryptedVote: encryptedVote,
    //         electionId: "1234",
    //         clientPublicKey: encrypter.publicKey
    //       }), 
    //       {
    //         headers:{
    //           'Content-Type': 'application/json',
    //         }
    //       })
    //       .subscribe(
    //         res2 =>{
    //           if (res2['error'] == undefined) {
    //             // Voto almacenado
    //             this.success = true;
    //             this.modalTitle = "Votación Exitosa";
    //             this.modelContent = "Su voto se ha registrado exitosamente!";
    //             this.modalService.open(content);
    //           }
    //           else {
    //             // No se pudo mandar el voto al jurado
    //             this.success = false;
    //             this.modalTitle = "Ups, ocurrió un error";
    //             this.modelContent = res2['error'];
    //             this.modalService.open(content);
    //           }
    //         }
    //       );

    //     }
    //     else {
    //       // Voto invalido
    //       this.success = false;
    //       this.modalTitle = "Ups, ocurrió un error";
    //       this.modelContent = res['error'];
    //       this.modalService.open(content);
    //     }
    //   }
    // )
  }
}
