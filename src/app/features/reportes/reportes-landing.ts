import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { reportesCards } from '../../shared/mock-data';

@Component({
  selector: 'app-reportes-landing',
  imports: [RouterLink],
  template: `
    <div class="card panel">
      <h1 class="page-title" style="margin-bottom:20px">Reportes y Estadísticas</h1>
      <div class="grid">
        @for (r of cards; track r.titulo) {
          <a class="rcard" [routerLink]="'/app/' + r.ruta">
            <span class="ico">{{ r.icon }}</span>
            <span class="t">{{ r.titulo }}</span>
          </a>
        }
      </div>
    </div>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
    @media (max-width: 1200px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    .rcard { border: 1px solid var(--border); border-radius: 12px; padding: 28px 16px; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; transition: all .15s; box-shadow: var(--shadow); }
    .rcard:hover { border-color: var(--brand-primary); transform: translateY(-2px); }
    .ico { width: 64px; height: 64px; border-radius: 50%; background: var(--nav-active-bg); display: grid; place-items: center; font-size: 28px; }
    .t { font-weight: 600; color: var(--text); }
  `],
})
export class ReportesLanding {
  cards = reportesCards;
}
