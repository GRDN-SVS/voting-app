import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { VoterService } from '../../services/voter.service';
import { API_URL } from '../../env';

import { Candidate } from '../../models/candidate.model';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})

export class VoteComponent implements OnInit {
  
  private id: string;

  constructor(private router: Router, private http: HttpClient, private voter: VoterService) { }

  async ngOnInit(): Promise<void> {
    this.id = this.voter.id;
  }
    
  fecha = new Date(2020, 10, 12);
  can1 = new Candidate(1, "Daniel Correa", this.fecha, 5, "Topicos en software", "Empezó como profesor en el 2020-1", "Es genial");
  can2 = new Candidate(2, "El innombrable", this.fecha, 100, "Integrador 2 - IA", "Es de venezuela", "Es horrible");
  can3 = new Candidate(3, "Elizabeth Suescun", this.fecha, 9, "Integrador - ing. software", "Nos ama", "Ponernos 5 en el proyecto");
  can4 = new Candidate(4, "Mauricio Toro", this.fecha, 17, "Estructuras de datos", "Es bien, pero un poco (muy) raro", "Eliminar semana santa");

  candidatos = [this.can1, this.can2, this.can3, this.can4]
  // candidate, voterId, OBJ(ElectionId, VoterId) --> Votar

  vote(candidate: Candidate) {
    console.log(candidate);
    console.log(this.id);
  }

}
