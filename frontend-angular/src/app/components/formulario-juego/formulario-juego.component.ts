import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JuegoService } from '../../services/juego.service';

@Component({
    selector: 'app-formulario-juego',
    templateUrl: './formulario-juego.component.html',
    styleUrls: ['./formulario-juego.component.scss'],
    standalone: false
})
export class FormularioJuegoComponent implements OnInit {
  formulario!: FormGroup;
  cargando: boolean = false;
  error: string = '';
  exitoMensaje: string = '';
  editando: boolean = false;
  juegoId: string = '';
  previewUrl: string = '';
  previewError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private juegoService: JuegoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editando = true;
        this.juegoId = params['id'];
        this.cargarJuego();
      }
    });
  }

  crearFormulario(): void {
    this.formulario = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      horasJugadas: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      fechaLanzamiento: ['', Validators.required],
      completado: [false],
      porcentajeCompletado: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      imagen: ['']
    });

    // observar cambios en el campo imagen para actualizar la vista previa
    this.formulario.get('imagen')?.valueChanges.subscribe((val: string) => {
      this.previewError = false;
      this.previewUrl = val || '';
    });
  }

  cargarJuego(): void {
    this.cargando = true;
    this.juegoService.obtenerJuegoPorId(this.juegoId)
      .subscribe({
        next: (juego) => {
          // Convertir fecha al formato esperado
          const fechaLanzamiento = juego.fechaLanzamiento 
            ? new Date(juego.fechaLanzamiento).toISOString().split('T')[0] 
            : '';

          this.formulario.patchValue({
            titulo: juego.titulo,
            descripcion: juego.descripcion,
            horasJugadas: juego.horasJugadas,
            fechaLanzamiento: fechaLanzamiento,
            completado: juego.completado,
            porcentajeCompletado: juego.porcentajeCompletado,
            imagen: juego.imagen
          });
          this.previewUrl = juego.imagen || '';
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al cargar el juego: ' + (err.error?.mensaje || err.message);
          this.cargando = false;
        }
      });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.error = 'Por favor, complete todos los campos correctamente';
      return;
    }

    this.cargando = true;
    this.error = '';
    this.exitoMensaje = '';

    const datos = this.formulario.value;

    if (this.editando) {
      this.juegoService.actualizarJuego(this.juegoId, datos)
        .subscribe({
          next: () => {
            this.exitoMensaje = 'Juego actualizado exitosamente';
            setTimeout(() => this.router.navigate(['/lista']), 2000);
          },
          error: (err) => {
            this.error = 'Error al actualizar: ' + (err.error?.mensaje || err.message);
            this.cargando = false;
          }
        });
    } else {
      this.juegoService.crearJuego(datos)
        .subscribe({
          next: () => {
            this.exitoMensaje = 'Juego creado exitosamente';
            setTimeout(() => this.router.navigate(['/lista']), 2000);
          },
          error: (err) => {
            this.error = 'Error al crear: ' + (err.error?.mensaje || err.message);
            this.cargando = false;
          }
        });
    }
  }

  cancelar(): void {
    this.router.navigate(['/lista']);
  }

  get titulo() {
    return this.formulario.get('titulo');
  }

  get descripcion() {
    return this.formulario.get('descripcion');
  }

  get horasJugadas() {
    return this.formulario.get('horasJugadas');
  }

  get fechaLanzamiento() {
    return this.formulario.get('fechaLanzamiento');
  }

  get porcentajeCompletado() {
    return this.formulario.get('porcentajeCompletado');
  }

  actualizarPorcentaje(valor: number): void {
    this.formulario.patchValue({ porcentajeCompletado: valor });
  }
}
