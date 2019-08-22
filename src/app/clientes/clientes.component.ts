import { Component, OnInit } from '@angular/core';

import { Cliente } from './cliente';
import { ClienteService } from './cliente.service'

import Swal  from 'sweetalert2'
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  private clienteService:ClienteService;
  //private activatedRoute:ActivatedRoute
  private paginator: any;

  constructor(
    clienteService : ClienteService,
    private activatedRoute: ActivatedRoute

  ) {
    this.clienteService =  clienteService;
   }

  ngOnInit() {
    
    this.activatedRoute.paramMap.subscribe( params =>{
      let page:number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.clienteService.getClientes(page).pipe(
        tap(response =>{
          console.log('ClienteComponent');
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);
          });
        })
      ).subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginator = response;
        }
      );
    });
  }

  delete(cliente: Cliente): void{
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli=>cli!==cliente)
            Swal.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )
      }
    })
  }

  /*abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.
  }*/

}
