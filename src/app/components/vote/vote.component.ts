import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { VoterService } from '../../services/voter.service';
import { API_URL } from '../../env';

import { Candidate } from '../../models/candidate.model';

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

  constructor(public router: Router, private http: HttpClient, private voter: VoterService, config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  async ngOnInit(): Promise<void> {
    this.id = this.voter.id;
  }
    
  fecha = new Date(2020, 10, 12);
  can1 = new Candidate(1, "Daniel Correa", this.fecha, 5, "Topicos en software", "Empezó como profesor en el 2020-1", "Es genial");
  can2 = new Candidate(2, "Lalinde", this.fecha, 100, "De todo", "Es un pro", "Hacer pensar a los estudiantes");
  can3 = new Candidate(3, "Elizabeth Suescun", this.fecha, 9, "Integrador - ing. software", "Nos ama", "Ponernos 5 en el proyecto");
  can4 = new Candidate(4, "Mauricio Toro", this.fecha, 17, "Estructuras de datos", "Es bien, pero un poco raro", "Eliminar semana santa");
  can5 = new Candidate(5, "Mc'Cormick", this.fecha, 80, "Lenguajes - operativos- compiladores", "Es un osito", "Asustar a los vagos para que se vayan a administración");
  can6 = new Candidate(6, "Edwin Electronica", this.fecha, 66, "Electronica - Conmutación", "Tiene una hija que se llama Isabela", "Que los estudiantes le tengan miedo a Jose Luis");

  candidatos = [this.can1, this.can2, this.can3, this.can4, this.can5, this.can6]

  vote(candidate: Candidate, content) {
    // this.success = true;
    // this.modalTitle = "Titulo :D"
    // this.modelContent = "HELLOO"
    // this.modalService.open(content);

    const req = this.http.post(`${API_URL}/blockchain/castBallot`, JSON.stringify({
      voterId: this.id,
      electionId: "1234", // HACER REQUEST A queryWithQueryString
      optionId: candidate.getId()
    }),
    {
      headers:{
        'Content-Type': 'application/json',
      }
    })
    .subscribe(
      res => {
        if (res['error'] == undefined) {
          // Voto almacenado
          this.success = true;
          this.modalTitle = "Votación Exitosa";
          this.modelContent = "Su voto se ha registrado exitosamente!";
          this.modalService.open(content);
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
