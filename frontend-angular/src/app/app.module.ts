import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListaJuegosComponent } from './components/lista-juegos/lista-juegos.component';
import { FormularioJuegoComponent } from './components/formulario-juego/formulario-juego.component';
import { DetalleJuegoComponent } from './components/detalle-juego/detalle-juego.component';

@NgModule({
  declarations: [
    AppComponent,
    ListaJuegosComponent,
    FormularioJuegoComponent,
    DetalleJuegoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
