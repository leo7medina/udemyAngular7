import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import localeES from '@angular/common/locales/es-EC'; 
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { Observable,of , throwError} from 'rxjs';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { map, catchError,tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Injectable()
export class ClienteService {

  private urlEndPoint:string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getClientes(page: Number):Observable<any>{
    //return of(CLIENTES);
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint+'/page/'+page).pipe(
      tap( (response: any) =>{
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
        })
      }),
      map( (response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt,'fullDate');
          //cliente.createAt = datePipe.transform(cliente.createAt,'EEEE dd/MMM/yyyy');
          //cliente.createAt = datePipe.transform(cliente.createAt,'dd/MM/yyyy');
          //cliente.createAt = formatDate(cliente.createAt,'dd-MM-yyyy','en-US');
          return cliente;
        });
        return response
      }),
      tap( response =>{
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
        })
      }),
    );
  }

  create(cliente: Cliente): Observable<Cliente>{

    return this.http.post(this.urlEndPoint,cliente,{headers:this.httpHeaders}).pipe(
      map( (response:any)=>response.cliente as Cliente),
      catchError(e=>{
        if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  getCliente(id:Number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e=>{
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje)
        Swal.fire('Error al editar',e.error.mensaje,'error')
        return throwError(e)
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers:this.httpHeaders}).pipe(
      catchError(e=>{
        if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  delete(id:Number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e=>{
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<Cliente>{
    let formData =new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);

    return this.http.post(`${this.urlEndPoint}/upload`,formData).pipe(
      map((response:any)=>response.cliente as Cliente),
      catchError(e=>{
        console.error(e);
        Swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  


}
