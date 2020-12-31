import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Usuario } from "src/app/models/usuario.model";
import { AuthService } from "src/app/services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent implements OnInit {
  usuario: Usuario;
  mensajeError: string;
  recordarme: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.usuario = new Usuario();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      text: "Espere por favor...",
      icon: "info",
      allowOutsideClick: false,
    });
    Swal.showLoading();

    this.auth.nuevoUsuario(this.usuario).subscribe(
      (response) => {
        console.log(response);
        Swal.close();

        if (this.recordarme) {
          localStorage.setItem("email", this.usuario.email);
        }

        this.router.navigateByUrl("/home");
      },
      (e) => {
        if (e.error.error.message === "EMAIL_EXISTS") {
          this.mensajeError = "Éste correo ya existe";
        }

        Swal.fire({
          title: "Error al autenticar",
          text: this.mensajeError,
          icon: "error",
        });

        this.mensajeError = "Hubo un error";
      }
    );
  }
}
