import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { VoterService } from '../../services/voter/voter.service';
import { API_URL } from '../../env';

import { Candidate } from '../../models/candidate.model';

import { Encrypter } from '../../services/crypto/encrypter.sevice';
import { ScrutinizerService } from '../../services/scrutinizer/scrutinizer.service';

import { box, randomBytes} from 'tweetnacl';

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
    this.scrutinizerPublicKey = this.scrutinizer.requestPublicKey();
    
    config.backdrop = 'static';
    config.keyboard = false;
  }

  async ngOnInit(): Promise<void> {
    this.id = this.voter.id;
  }

  private scrutinizerPublicKey;
    
  fecha = new Date(2020, 10, 12);
  can1 = new Candidate(1, "How I met your mother", this.fecha, 5, "CBS", "Es muy charra, mejor serie de la vida", "Contarle a los hijos la historia de como conoció la esposa para preguntar si puede salir con alguien mas");
  can2 = new Candidate(2, "Game Of Thrones", this.fecha, 100, "HBO", "Es inigualable", "Mostrar el conflicto entre poderes en un mundo medieval");
  can3 = new Candidate(3, "MR. Robot", this.fecha, 9, "Usa network", "Es muy tecnologica y psicologica", "Hacerte creer una cosa para despues explotarte la mente");
  can4 = new Candidate(4, "Greys Anatomy", this.fecha, 17, "ABC", "Es infinita", "Hacer que te enamores de un personaje para luego matarlo");
  can5 = new Candidate(5, "The Crown", this.fecha, 13, "ABC Studios", "Es muy educativa", "Enseñar sobre la historia de inglaterra y empoderar a la mujer");
  can6 = new Candidate(6, "13 Reasons Why", this.fecha, 66, "Eskmo", "Es plenamente psicologica y depresiva", "Mostrar la historia de una mujer que fue demasiado bullyniada");

  candidatos = [this.can1, this.can2, this.can3, this.can4, this.can5, this.can6]

  vote(candidate: Candidate, content) {
    // this.success = true;
    // this.modalTitle = "Votación Exitosa"
    // this.modelContent = "Su voto se ha registrado exitosamente!"
    // this.modalService.open(content);

    const encrypter = new Encrypter(this.http);

    const req = this.http.post(`${API_URL}/blockchain/castBallot`, JSON.stringify({
      voterId: this.id,
      electionId: "1234", // HACER REQUEST A queryWithQueryString
    }),
    {
      headers:{
        'Content-Type': 'application/json',
      }
    })
    .subscribe(
      res => {
        if (res['error'] == undefined) {
          // Encriptar voto
          const idAndNonce = encrypter.getIdAndNonce();
          const nonceId = idAndNonce['id'];
          const nonce = idAndNonce['nonce'];
          
          let encryptedVote = encrypter.seal(candidate.id, nonce, this.scrutinizerPublicKey);

          const req2 = this.http.post(`${API_URL}/submitVote`, JSON.stringify({
            nonceId: nonceId,
            encryptedVote: encryptedVote,
            electionId: "1234"
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

        }
        else {
          // Voto invalido
          this.success = false;
          this.modalTitle = "Ups, ocurrió un error";
          this.modelContent = res['error'];
          this.modalService.open(content);
        }
      }
    )
  }
}
