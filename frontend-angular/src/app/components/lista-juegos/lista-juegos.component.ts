import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JuegoService } from '../../services/juego.service';

@Component({
    selector: 'app-lista-juegos',
    templateUrl: './lista-juegos.component.html',
    styleUrls: ['./lista-juegos.component.scss'],
    standalone: false
})
export class ListaJuegosComponent implements OnInit {
  juegos: any[] = [];
  cargando: boolean = false;
  error: string = '';
  exitoMensaje: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalItems: number = 0;
  busqueda: string = '';
  filtroCompletado: string = 'todos';

  constructor(
    private juegoService: JuegoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarJuegos();
  }

  cargarJuegos(): void {
    this.cargando = true;
    this.error = '';
    this.exitoMensaje = '';

    const filtro = this.filtroCompletado === 'completados' ? true : undefined;
    const limit = this.filtroCompletado === 'todos' ? this.itemsPorPagina : 0;
    const page = this.filtroCompletado === 'todos' ? this.paginaActual : 1;

    this.juegoService.obtenerJuegos(page, limit, filtro)
      .subscribe({
        next: (response) => {
          this.juegos = response.datos || [];
          this.totalItems = this.filtroCompletado === 'todos' ? (response.total || 0) : this.juegos.length;
          if (this.filtroCompletado !== 'todos') {
            this.paginaActual = 1;
          }
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los juegos: ' + (err.error?.mensaje || err.message);
          this.cargando = false;
        }
      });
  }

  buscar(): void {
    if (this.busqueda.trim() === '') {
      this.cargarJuegos();
      return;
    }

    this.cargando = true;
    // Pedimos al servidor que busque por título en todos los juegos (limit=0 => sin límite)
    this.juegoService.buscarJuegos(this.busqueda, 1, 0)
      .subscribe({
        next: (response) => {
          this.juegos = (response.datos || []).map((j: any) => ({
            ...j,
            completado: j.completado || j.porcentajeCompletado === 100
          }));
          this.totalItems = this.juegos.length;
          this.paginaActual = 1;
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al buscar: ' + (err.error?.mensaje || err.message);
          this.cargando = false;
        }
      });
  }

  aplicarFiltro(filtro?: string): void {
    if (filtro) {
      this.filtroCompletado = filtro;
    }
    this.paginaActual = 1;
    this.cargarJuegos();
  }

  verDetalle(id: string): void {
    this.router.navigate(['/detalle', id]);
  }

  editarJuego(id: string): void {
    this.router.navigate(['/editar', id]);
  }

  eliminarJuego(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este juego?')) {
      this.cargando = true;
      this.juegoService.eliminarJuego(id)
        .subscribe({
          next: () => {
            this.exitoMensaje = 'Juego eliminado exitosamente';
            this.cargarJuegos();
            setTimeout(() => this.exitoMensaje = '', 3000);
          },
          error: (err) => {
            this.error = 'Error al eliminar: ' + (err.error?.mensaje || err.message);
            this.cargando = false;
          }
        });
    }
  }

  crearNuevo(): void {
    this.router.navigate(['/crear']);
  }

  irPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= Math.ceil(this.totalItems / this.itemsPorPagina)) {
      this.paginaActual = pagina;
      this.cargarJuegos();
    }
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalItems / this.itemsPorPagina);
  }

  get paginasDisponibles(): number[] {
    const paginas: number[] = [];
    for (let i = 1; i <= this.totalPaginas; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  cerrarMensaje(): void {
    this.error = '';
    this.exitoMensaje = '';
  }
}
