import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListaJuegosComponent } from './components/lista-juegos/lista-juegos.component';
import { FormularioJuegoComponent } from './components/formulario-juego/formulario-juego.component';
import { DetalleJuegoComponent } from './components/detalle-juego/detalle-juego.component';

@NgModule({ declarations: [
        AppComponent,
        ListaJuegosComponent,
        FormularioJuegoComponent,
        DetalleJuegoComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
