import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JuegoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtener todos los juegos con paginación
  obtenerJuegos(page: number = 1, limit: number = 10, completado?: boolean): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (completado !== undefined) {
      params = params.set('completado', completado.toString());
    }
    return this.http.get<any>(`${this.apiUrl}/get/all`, { params });
  }

  // Obtener un juego por ID
  obtenerJuegoPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${id}`);
  }

  // Crear un nuevo juego
  crearJuego(juego: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/post`, juego);
  }

  // Actualizar un juego (PATCH)
  actualizarJuego(id: string, juego: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/update/${id}`, juego);
  }

  // Reemplazar un juego (PUT)
  reemplazarJuego(id: string, juego: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, juego);
  }

  // Eliminar un juego
  eliminarJuego(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  // Buscar juegos por título
  buscarJuegos(titulo: string, page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('titulo', titulo);
    return this.http.get<any>(`${this.apiUrl}/get/all`, { params });
  }
}
