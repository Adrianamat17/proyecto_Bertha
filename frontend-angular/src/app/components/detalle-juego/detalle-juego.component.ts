import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JuegoService } from '../../services/juego.service';

@Component({
    selector: 'app-detalle-juego',
    templateUrl: './detalle-juego.component.html',
    styleUrls: ['./detalle-juego.component.scss'],
    standalone: false
})
export class DetalleJuegoComponent implements OnInit {
  juego: any = null;
  cargando: boolean = false;
  error: string = '';
  mostrarImagenPorDefecto: boolean = false;

  constructor(
    private juegoService: JuegoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.cargarJuego(params['id']);
      }
    });
  }

  cargarJuego(id: string): void {
    this.cargando = true;
    this.error = '';

    this.juegoService.obtenerJuegoPorId(id)
      .subscribe({
        next: (data) => {
          this.juego = data;
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al cargar el juego: ' + (err.error?.mensaje || err.message);
          this.cargando = false;
        }
      });
  }

  editarJuego(): void {
    this.router.navigate(['/editar', this.juego._id]);
  }

  volver(): void {
    this.router.navigate(['/lista']);
  }

  formatearFecha(fecha: any): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
