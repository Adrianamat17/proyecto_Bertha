import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaJuegosComponent } from './components/lista-juegos/lista-juegos.component';
import { FormularioJuegoComponent } from './components/formulario-juego/formulario-juego.component';
import { DetalleJuegoComponent } from './components/detalle-juego/detalle-juego.component';

const routes: Routes = [
  { path: '', redirectTo: '/lista', pathMatch: 'full' },
  { path: 'lista', component: ListaJuegosComponent },
  { path: 'crear', component: FormularioJuegoComponent },
  { path: 'editar/:id', component: FormularioJuegoComponent },
  { path: 'detalle/:id', component: DetalleJuegoComponent },
  { path: '**', redirectTo: '/lista' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
